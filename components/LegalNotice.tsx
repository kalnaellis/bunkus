"use client";

type LegalNoticeProps = {
  open: boolean;
  onClose: () => void;
};

export default function LegalNotice({ open, onClose }: LegalNoticeProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/30 bg-[#111117] p-6 text-sm text-white/85">
        <h3 className="mb-4 text-lg font-semibold uppercase">Privacy / data processing notice</h3>
        <ul className="list-disc space-y-2 pl-4 text-white/70">
          <li>We retain submissions for up to 12 months unless an engagement starts earlier.</li>
          <li>Access is limited to internal legal staff and approved processors.</li>
          <li>You can request deletion by contacting the email listed in your confirmation message.</li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-md border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
