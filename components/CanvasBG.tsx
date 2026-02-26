"use client";

type CanvasBGProps = {
  progress: number;
};

export default function CanvasBG({ progress }: CanvasBGProps) {
  const offset = `${Math.round(progress * 100)}%`;

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(155,98,255,0.26), transparent 40%), radial-gradient(circle at 80% 30%, rgba(216,109,255,0.2), transparent 35%), linear-gradient(120deg, #060609, #0d0914 55%, #120c1a)",
        backgroundPosition: `left ${offset} top, right ${offset} top, center`,
        transition: "background-position 180ms linear"
      }}
      aria-hidden
    />
  );
}
