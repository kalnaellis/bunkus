"use client";

export type CTAState =
  | "idle"
  | "armed"
  | "form_open"
  | "submitting"
  | "form_success"
  | "upload_ready"
  | "uploading"
  | "complete";

const labelMap: Record<CTAState, string> = {
  idle: "Seal your case in one click",
  armed: "Open intake",
  form_open: "Submit details",
  submitting: "Submitting...",
  form_success: "Case sealed",
  upload_ready: "Upload files",
  uploading: "Uploading...",
  complete: "Complete"
};

type CTAButtonProps = {
  state: CTAState;
  onClick: () => void;
};

export default function CTAButton({ state, onClick }: CTAButtonProps) {
  const isDisabled = state === "idle" || state === "submitting" || state === "uploading";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`fixed bottom-8 left-1/2 z-40 -translate-x-1/2 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
        isDisabled
          ? "cursor-not-allowed border-white/25 bg-white/10 text-white/45"
          : "border-accent bg-accent/90 text-black shadow-glow hover:scale-[1.03]"
      }`}
    >
      {labelMap[state]}
    </button>
  );
}
