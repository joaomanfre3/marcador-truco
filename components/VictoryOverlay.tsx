"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { TeamId } from "@/lib/truco";

interface VictoryOverlayProps {
  team: TeamId;
  name: string;
  wins: number;
  onContinue: () => void;
}

const accent: Record<TeamId, string> = {
  nos: "var(--color-nos)",
  eles: "var(--color-eles)",
};

// Confete leve sem libs: peças geradas deterministicamente por índice.
const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 137.5) % 100,
  delay: (i % 10) * 0.08,
  duration: 1.6 + (i % 5) * 0.25,
  rotate: (i * 73) % 360,
  size: 6 + (i % 4) * 3,
}));

export function VictoryOverlay({ team, name, wins, onContinue }: VictoryOverlayProps) {
  const color = accent[team];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/70 p-6 backdrop-blur-sm"
      onClick={onContinue}
    >
      {/* Confete */}
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 1, rotate: c.rotate }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: c.rotate + 360 }}
          transition={{ duration: c.duration, delay: c.delay, ease: "easeIn", repeat: Infinity }}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: i % 2 ? color : "#fff",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.7, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex flex-col items-center gap-4 text-center"
      >
        <Trophy size={72} style={{ color }} strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            Venceu a partida
          </p>
          <h2
            className="mt-1 text-5xl font-black uppercase sm:text-6xl"
            style={{ color, textShadow: `0 0 40px ${color}80` }}
          >
            {name}
          </h2>
          <p className="mt-2 text-white/70">
            {wins}ª vitória na série · toque pra próxima partida
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="mt-2 rounded-full px-8 py-3 text-base font-extrabold uppercase tracking-wide text-black"
          style={{ backgroundColor: color }}
        >
          Nova partida
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
