"use client";

import { motion } from "framer-motion";
import { STAKES } from "@/lib/truco";

interface StakeSelectorProps {
  stake: number;
  onSelect: (stake: number) => void;
}

export function StakeSelector({ stake, onSelect }: StakeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Valor da mão
      </span>
      <div className="flex items-center gap-1.5">
        {STAKES.map((s) => {
          const active = s.value === stake;
          return (
            <button
              key={s.value}
              onClick={() => onSelect(s.value)}
              className="no-select relative rounded-xl px-2.5 py-2 text-center transition sm:px-3.5"
              style={{ minWidth: 56 }}
            >
              {active && (
                <motion.span
                  layoutId="stake-pill"
                  className="absolute inset-0 rounded-xl bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`relative block text-lg font-black leading-none tabular-nums ${
                  active ? "text-felt-900" : "text-white"
                }`}
                style={active ? { color: "var(--color-felt-900)" } : undefined}
              >
                {s.value}
              </span>
              <span
                className={`relative mt-0.5 block text-[9px] font-bold uppercase tracking-wide ${
                  active ? "text-felt-900/70" : "text-white/40"
                }`}
                style={active ? { color: "var(--color-felt-900)" } : undefined}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
