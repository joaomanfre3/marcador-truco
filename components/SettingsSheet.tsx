"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trash2, Volume2, VolumeX, X } from "lucide-react";

interface SettingsSheetProps {
  open: boolean;
  target: number;
  sound: boolean;
  onClose: () => void;
  onSetTarget: (t: number) => void;
  onToggleSound: () => void;
  onResetRound: () => void;
  onResetAll: () => void;
}

const TARGETS = [12, 15, 24];

export function SettingsSheet({
  open,
  target,
  sound,
  onClose,
  onSetTarget,
  onToggleSound,
  onResetRound,
  onResetAll,
}: SettingsSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-felt-800 p-5 pb-8 shadow-2xl"
            style={{ backgroundColor: "var(--color-felt-800)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">Ajustes</h3>
              <button
                onClick={onClose}
                aria-label="Fechar ajustes"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Meta de pontos */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                Partida vai até
              </p>
              <div className="flex gap-2">
                {TARGETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSetTarget(t)}
                    className={`flex-1 rounded-xl py-3 text-base font-bold tabular-nums transition ${
                      t === target
                        ? "bg-white text-felt-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    style={t === target ? { color: "var(--color-felt-900)" } : undefined}
                  >
                    {t} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Som */}
            <button
              onClick={onToggleSound}
              className="mb-2 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/20"
            >
              <span className="flex items-center gap-2 font-medium">
                {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                Som dos pontos
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  sound ? "bg-emerald-400 text-emerald-950" : "bg-white/20 text-white/60"
                }`}
              >
                {sound ? "LIGADO" : "DESLIGADO"}
              </span>
            </button>

            {/* Resets */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={onResetRound}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold transition hover:bg-white/20"
              >
                <RotateCcw size={16} /> Zerar placar
              </button>
              <button
                onClick={onResetAll}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/15 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
              >
                <Trash2 size={16} /> Zerar tudo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
