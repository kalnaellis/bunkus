"use client";

import { useMemo, useState } from "react";
import CanvasBG from "@/components/CanvasBG";
import CTAButton, { type CTAState } from "@/components/CTAButton";
import IntakeModal from "@/components/IntakeModal";
import ScrollType from "@/components/ScrollType";

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ctaState, setCtaState] = useState<CTAState>("idle");
  const [isModalOpen, setModalOpen] = useState(false);

  const caseTeaser = useMemo(() => `CASE HASH ${Math.floor(scrollProgress * 9999).toString(16)}`, [scrollProgress]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget;
    const progress = target.scrollTop / (target.scrollHeight - target.clientHeight || 1);
    setScrollProgress(progress);

    if (progress > 0.82 && ["idle"].includes(ctaState)) {
      setCtaState("armed");
    }
  };

  const openByState = () => {
    if (ctaState === "armed") {
      setCtaState("form_open");
      setModalOpen(true);
      return;
    }

    if (["upload_ready", "complete"].includes(ctaState)) {
      setModalOpen(true);
    }
  };

  return (
    <main className="relative h-screen">
      <CanvasBG progress={scrollProgress} />

      <div className="h-screen overflow-y-auto" onScroll={handleScroll}>
        <section className="relative min-h-[360vh]">
          <ScrollType progress={scrollProgress} />

          <div className="mx-auto flex min-h-[360vh] max-w-7xl flex-col justify-end px-6 pb-24 text-right text-xs uppercase tracking-[0.2em] text-white/40">
            <p>{caseTeaser}</p>
          </div>
        </section>
      </div>

      <CTAButton state={ctaState} onClick={openByState} />
      <IntakeModal
        open={isModalOpen}
        ctaState={ctaState}
        onClose={() => setModalOpen(false)}
        onStateChange={(next) => {
          setCtaState(next);
          if (next === "complete") {
            setModalOpen(true);
          }
        }}
      />
    </main>
  );
}
