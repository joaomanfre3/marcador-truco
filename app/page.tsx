"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Settings, Undo2 } from "lucide-react";
import {
  reducer,
  initialState,
  isMaoDeOnze,
  type Action,
  type GameState,
  type TeamId,
} from "@/lib/truco";
import { TeamPanel } from "@/components/TeamPanel";
import { StakeSelector } from "@/components/StakeSelector";
import { VictoryOverlay } from "@/components/VictoryOverlay";
import { SettingsSheet } from "@/components/SettingsSheet";

const STORAGE_KEY = "marcador-truco:v1";

export default function Home() {
  const [state, baseDispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const history = useRef<GameState[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  // Carrega o jogo salvo no navegador (uma vez).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) baseDispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* localStorage indisponível — segue com estado limpo */
    }
    setHydrated(true);
  }, []);

  // Salva sempre que o estado muda (só depois de hidratar).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* cota cheia / modo privado — ignora */
    }
  }, [state, hydrated]);

  const beep = useCallback(
    (team: TeamId) => {
      if (!state.sound) return;
      try {
        audioRef.current ??= new AudioContext();
        const ctx = audioRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = team === "nos" ? 660 : 520;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch {
        /* áudio bloqueado pelo navegador — ignora */
      }
    },
    [state.sound],
  );

  // Wrapper de dispatch que registra histórico (pra desfazer) e dá feedback.
  const dispatch = useCallback(
    (action: Action, opts?: { team?: TeamId; haptic?: boolean }) => {
      const mutating = action.type === "WIN_HAND" || action.type === "ADJUST";
      if (mutating) {
        history.current = [...history.current.slice(-19), state];
        if (opts?.team) beep(opts.team);
        if (opts?.haptic !== false && typeof navigator !== "undefined") {
          navigator.vibrate?.(action.type === "WIN_HAND" ? 35 : 12);
        }
      }
      baseDispatch(action);
    },
    [state, beep],
  );

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (prev) {
      baseDispatch({ type: "HYDRATE", state: prev });
      navigator.vibrate?.(10);
    }
  }, []);

  const canUndo = history.current.length > 0;

  return (
    <main className="relative z-10 mx-auto flex h-dvh max-w-3xl flex-col">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          aria-label="Desfazer última jogada"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition active:scale-90 enabled:hover:bg-white/20 disabled:opacity-25"
        >
          <Undo2 size={18} />
        </button>

        <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">
          Truco
        </h1>

        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Abrir ajustes"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition active:scale-90 hover:bg-white/20"
        >
          <Settings size={18} />
        </button>
      </header>

      {/* Dois placares */}
      <div className="flex flex-1 items-stretch">
        <TeamPanel
          team="nos"
          name={state.names.nos}
          score={state.scores.nos}
          wins={state.wins.nos}
          target={state.target}
          stake={state.stake}
          maoDeOnze={isMaoDeOnze(state, "nos")}
          onWinHand={() => dispatch({ type: "WIN_HAND", team: "nos" }, { team: "nos" })}
          onAdjust={(d) => dispatch({ type: "ADJUST", team: "nos", delta: d }, { team: "nos" })}
          onRename={(name) => dispatch({ type: "SET_NAME", team: "nos", name })}
        />

        <div className="w-px self-stretch bg-white/10" />

        <TeamPanel
          team="eles"
          name={state.names.eles}
          score={state.scores.eles}
          wins={state.wins.eles}
          target={state.target}
          stake={state.stake}
          maoDeOnze={isMaoDeOnze(state, "eles")}
          onWinHand={() => dispatch({ type: "WIN_HAND", team: "eles" }, { team: "eles" })}
          onAdjust={(d) => dispatch({ type: "ADJUST", team: "eles", delta: d }, { team: "eles" })}
          onRename={(name) => dispatch({ type: "SET_NAME", team: "eles", name })}
        />
      </div>

      {/* Valor da mão */}
      <div className="flex justify-center px-4 pb-6 pt-2">
        <StakeSelector
          stake={state.stake}
          onSelect={(s) => dispatch({ type: "SET_STAKE", stake: s })}
        />
      </div>

      {/* Overlay de vitória */}
      <AnimatePresence>
        {state.winner && (
          <VictoryOverlay
            team={state.winner}
            name={state.names[state.winner]}
            wins={state.wins[state.winner]}
            onContinue={() => dispatch({ type: "DISMISS_WINNER" })}
          />
        )}
      </AnimatePresence>

      {/* Ajustes */}
      <SettingsSheet
        open={settingsOpen}
        target={state.target}
        sound={state.sound}
        onClose={() => setSettingsOpen(false)}
        onSetTarget={(t) => dispatch({ type: "SET_TARGET", target: t })}
        onToggleSound={() => dispatch({ type: "TOGGLE_SOUND" })}
        onResetRound={() => {
          dispatch({ type: "RESET_ROUND" });
          setSettingsOpen(false);
        }}
        onResetAll={() => {
          history.current = [];
          dispatch({ type: "RESET_ALL" });
          setSettingsOpen(false);
        }}
      />
    </main>
  );
}
