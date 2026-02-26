"use client";

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
          <p className="text-xs uppercase tracking-[0.4em] text-white/45">{hash}</p>

          <h1
            className="max-w-4xl text-5xl font-semibold uppercase leading-[0.95] md:text-7xl lg:text-8xl"
            style={{
              letterSpacing: progress > 0.2 && progress < 0.4 ? "0.02em" : "0.01em",
              transform: `translateY(${Math.max(0, 20 - progress * 20)}px)`,
              opacity: Math.min(1, 0.6 + progress)
            }}
          >
            {phrase}
          </h1>

          <p className="max-w-xl text-sm text-white/60 md:text-base">
            A typographic intake narrative. Scroll to arm the case-seal action and unlock submission.
          </p>
        </div>

        {sideCardVisible ? (
          <aside className="hidden h-fit rounded-xl border border-white/25 bg-white/5 p-6 text-sm text-white/85 shadow-glow lg:block">
            <p className="mb-4 uppercase tracking-[0.2em] text-white/55">Case card</p>
            <p className="text-lg font-medium">Case closed / lips glossed</p>
            <svg viewBox="0 0 160 120" className="mt-6 w-full text-accent" fill="none">
              <path d="M12 88 C48 28, 112 28, 148 88" stroke="currentColor" strokeWidth="2" />
              <circle cx="80" cy="56" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M74 56 L78 60 L86 52" stroke="currentColor" strokeWidth="2" />
            </svg>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
