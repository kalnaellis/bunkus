"use client";

import { motion } from "framer-motion";
import { createFlavorHash } from "@/lib/caseId";

type ScrollTypeProps = {
  progress: number;
};

const phrases = [
  "NOT YOUR REGULAR LAWYER",
  "I MAKE RULES BEND",
  "CASE CLOSED",
  "LIPS GLOSSED",
  "SOME BREAK LAWS. I BREAK LIMITS."
];

function pickPhrase(progress: number) {
  if (progress < 0.2) return phrases[0];
  if (progress < 0.4) return phrases[1];
  if (progress < 0.62) return phrases[2];
  if (progress < 0.82) return phrases[3];
  return phrases[4];
}

export default function ScrollType({ progress }: ScrollTypeProps) {
  const phrase = pickPhrase(progress);
  const hash = createFlavorHash(`CASE-${Math.floor(progress * 1000)}`);
  const sideCardVisible = progress > 0.48 && progress < 0.78;

  return (
    <div className="pointer-events-none sticky top-0 flex min-h-screen items-center justify-center px-6 py-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <motion.p
            key={hash}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.4 }}
            className="text-xs uppercase tracking-[0.4em] text-white/45"
          >
            {hash}
          </motion.p>

          <motion.h1
            key={phrase}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              letterSpacing: progress > 0.2 && progress < 0.4 ? "0.02em" : "0.01em"
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-4xl text-5xl font-semibold uppercase leading-[0.95] md:text-7xl lg:text-8xl"
          >
            {phrase}
          </motion.h1>

          <p className="max-w-xl text-sm text-white/60 md:text-base">
            A typographic intake narrative. Scroll to arm the case-seal action and unlock submission.
          </p>
        </div>

        {sideCardVisible ? (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden h-fit rounded-xl border border-white/25 bg-white/5 p-6 text-sm text-white/85 shadow-glow lg:block"
          >
            <p className="mb-4 uppercase tracking-[0.2em] text-white/55">Case card</p>
            <p className="text-lg font-medium">Case closed / lips glossed</p>
            <svg viewBox="0 0 160 120" className="mt-6 w-full text-accent" fill="none">
              <path d="M12 88 C48 28, 112 28, 148 88" stroke="currentColor" strokeWidth="2" />
              <circle cx="80" cy="56" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M74 56 L78 60 L86 52" stroke="currentColor" strokeWidth="2" />
            </svg>
          </motion.aside>
        ) : null}
      </div>
    </div>
  );
}
