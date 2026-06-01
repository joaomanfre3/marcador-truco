"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { TeamId } from "@/lib/truco";

interface TeamPanelProps {
  team: TeamId;
  name: string;
  score: number;
  wins: number;
  target: number;
  stake: number;
  maoDeOnze: boolean;
  onWinHand: () => void;
  onAdjust: (delta: number) => void;
  onRename: (name: string) => void;
}

const accent: Record<TeamId, string> = {
  nos: "var(--color-nos)",
  eles: "var(--color-eles)",
};

export function TeamPanel({
  team,
  name,
  score,
  wins,
  target,
  stake,
  maoDeOnze,
  onWinHand,
  onAdjust,
  onRename,
}: TeamPanelProps) {
  const color = accent[team];

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between gap-3 p-4 sm:p-6">
      {/* Nome editável + vitórias */}
      <div className="flex w-full flex-col items-center gap-1">
        <input
          aria-label={`Nome do time ${name}`}
          value={name}
          onChange={(e) => onRename(e.target.value)}
          maxLength={14}
          className="w-full max-w-[14ch] bg-transparent text-center text-lg font-bold tracking-wide outline-none placeholder:text-white/40 focus:underline sm:text-2xl"
          style={{ color }}
        />
        <div className="flex items-center gap-1 text-xs font-medium text-white/50">
          {Array.from({ length: Math.min(wins, 5) }).map((_, i) => (
            <span key={i} aria-hidden style={{ color }}>
              ★
            </span>
          ))}
          <span className="ml-1 tabular-nums">{wins} vit.</span>
        </div>
      </div>

      {/* Placar gigante */}
      <div className="relative flex flex-1 items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            initial={{ y: 24, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -24, opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="no-select text-[28vw] font-black leading-none tabular-nums sm:text-[140px]"
            style={{ color, textShadow: `0 0 40px ${color}40` }}
          >
            {score}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence>
          {maoDeOnze && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest backdrop-blur"
              style={{ color }}
            >
              Mão de onze!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão principal — ganhou a mão */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onWinHand}
        disabled={score >= target}
        className="no-select w-full rounded-2xl py-4 text-base font-extrabold uppercase tracking-wide text-black shadow-lg transition disabled:opacity-30 sm:text-lg"
        style={{ backgroundColor: color }}
      >
        Ganhou +{stake}
      </motion.button>

      {/* Ajuste manual */}
      <div className="flex w-full items-center justify-center gap-3">
        <button
          aria-label={`Tirar 1 ponto de ${name}`}
          onClick={() => onAdjust(-1)}
          className="no-select flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-90 hover:bg-white/20"
        >
          <Minus size={18} />
        </button>
        <button
          aria-label={`Adicionar 1 ponto a ${name}`}
          onClick={() => onAdjust(1)}
          className="no-select flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-90 hover:bg-white/20"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
