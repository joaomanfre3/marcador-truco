// Lógica pura do marcador de truco — sem React, fácil de testar e de raciocinar.

export type TeamId = "nos" | "eles";

export interface GameState {
  names: Record<TeamId, string>;
  scores: Record<TeamId, number>;
  /** Vitórias na série de partidas (melhor de N). */
  wins: Record<TeamId, number>;
  /** Valor da mão atual: 1 (vale 1), 3 (truco), 6 (seis), 9 (nove), 12 (doze). */
  stake: number;
  /** Pontos pra vencer a partida (12 = truco paulista). */
  target: number;
  /** Time que venceu a última partida — dispara o overlay de vitória. */
  winner: TeamId | null;
  sound: boolean;
}

export const STAKES = [
  { value: 1, label: "Vale 1" },
  { value: 3, label: "Truco" },
  { value: 6, label: "Seis" },
  { value: 9, label: "Nove" },
  { value: 12, label: "Doze" },
] as const;

export const initialState: GameState = {
  names: { nos: "Nós", eles: "Eles" },
  scores: { nos: 0, eles: 0 },
  wins: { nos: 0, eles: 0 },
  stake: 1,
  target: 12,
  winner: null,
  sound: true,
};

export type Action =
  | { type: "WIN_HAND"; team: TeamId } // time ganhou a mão → soma o valor da mão
  | { type: "ADJUST"; team: TeamId; delta: number } // correção manual +1/-1
  | { type: "SET_STAKE"; stake: number }
  | { type: "SET_NAME"; team: TeamId; name: string }
  | { type: "SET_TARGET"; target: number }
  | { type: "TOGGLE_SOUND" }
  | { type: "DISMISS_WINNER" } // fecha overlay e começa nova partida
  | { type: "RESET_ROUND" } // zera placar, mantém vitórias da série
  | { type: "RESET_ALL" } // zera tudo (placar + série)
  | { type: "HYDRATE"; state: GameState };

function clampScore(n: number) {
  return Math.max(0, n);
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "WIN_HAND": {
      const next = clampScore(state.scores[action.team] + state.stake);
      const reachedTarget = next >= state.target;
      return {
        ...state,
        scores: { ...state.scores, [action.team]: reachedTarget ? state.target : next },
        stake: 1,
        winner: reachedTarget ? action.team : state.winner,
        wins: reachedTarget
          ? { ...state.wins, [action.team]: state.wins[action.team] + 1 }
          : state.wins,
      };
    }

    case "ADJUST": {
      const next = clampScore(state.scores[action.team] + action.delta);
      const reachedTarget = next >= state.target;
      return {
        ...state,
        scores: { ...state.scores, [action.team]: reachedTarget ? state.target : next },
        winner: reachedTarget && !state.winner ? action.team : state.winner,
        wins:
          reachedTarget && !state.winner
            ? { ...state.wins, [action.team]: state.wins[action.team] + 1 }
            : state.wins,
      };
    }

    case "SET_STAKE":
      return { ...state, stake: action.stake };

    case "SET_NAME":
      return {
        ...state,
        names: { ...state.names, [action.team]: action.name || (action.team === "nos" ? "Nós" : "Eles") },
      };

    case "SET_TARGET":
      return { ...state, target: action.target };

    case "TOGGLE_SOUND":
      return { ...state, sound: !state.sound };

    case "DISMISS_WINNER":
      return { ...state, winner: null, scores: { nos: 0, eles: 0 }, stake: 1 };

    case "RESET_ROUND":
      return { ...state, scores: { nos: 0, eles: 0 }, stake: 1, winner: null };

    case "RESET_ALL":
      return {
        ...initialState,
        names: state.names,
        target: state.target,
        sound: state.sound,
      };

    case "HYDRATE":
      return { ...action.state, winner: null };

    default:
      return state;
  }
}

/** A "mão de 11" — quando um time chega a target-1 e a regra muda na mesa. */
export function isMaoDeOnze(state: GameState, team: TeamId): boolean {
  return state.scores[team] === state.target - 1;
}
