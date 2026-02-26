"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import LegalNotice from "@/components/LegalNotice";
import type { CTAState } from "@/components/CTAButton";
import { caseSchema, type CaseInput } from "@/lib/validators";

type IntakeModalProps = {
  open: boolean;
  ctaState: CTAState;
  onClose: () => void;
  onStateChange: (state: CTAState) => void;
};

type CaseSession = {
  caseId: string;
  rowIndex: number;
  folderId: string;
  folderUrl: string;
};

export default function IntakeModal({ open, ctaState, onClose, onStateChange }: IntakeModalProps) {
  const [showLegal, setShowLegal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [session, setSession] = useState<CaseSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CaseInput>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      name: "",
      email: "",
      consent: true,
      consentTextVersion: "v1"
    }
  });

  if (!open) return null;

  const submitIntake = form.handleSubmit(async (values) => {
    try {
      setError(null);
      onStateChange("submitting");

      const response = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error("Intake request failed.");

      const payload = (await response.json()) as CaseSession;
      setSession(payload);
      onStateChange("upload_ready");
    } catch {
      setError("Could not submit details. Please retry.");
      onStateChange("form_open");
    }
  });

  const submitUpload = async () => {
    if (!session || files.length === 0) return;
    try {
      setError(null);
      onStateChange("uploading");
      const formData = new FormData();
      formData.set("caseId", session.caseId);
      formData.set("rowIndex", String(session.rowIndex));
      formData.set("folderId", session.folderId);
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      onStateChange("complete");
    } catch {
      setError("File upload failed. Please retry.");
      onStateChange("upload_ready");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
        <div className="w-full max-w-xl rounded-xl border border-white/25 bg-[#0b0b10] p-6 shadow-glow">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em]">Seal your case</h2>
            <button type="button" onClick={onClose} className="text-xs uppercase text-white/60">
              Close
            </button>
          </div>

          {session ? (
            <div className="mb-4 rounded-lg border border-white/20 bg-white/5 p-3 text-xs text-white/75">
              Reference: {session.caseId}
            </div>
          ) : null}

          {!session ? (
            <form className="space-y-4" onSubmit={submitIntake}>
              <input
                placeholder="Name"
                className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2"
                {...form.register("name")}
              />
              <input
                placeholder="Email"
                className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2"
                {...form.register("email")}
              />
              <label className="flex items-start gap-2 text-xs text-white/70">
                <input type="checkbox" className="mt-0.5" {...form.register("consent")} />
                <span>
                  I confirm these files are mine to share and I agree to the processing of my data for case evaluation.
                </span>
              </label>
              <button
                type="button"
                className="text-xs uppercase text-accent underline"
                onClick={() => setShowLegal(true)}
              >
                Privacy / data processing notice
              </button>
              <button type="submit" className="block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black">
                Submit details
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <FileUpload files={files} onFilesChange={setFiles} disabled={ctaState === "uploading"} />
              <button
                type="button"
                onClick={submitUpload}
                disabled={!files.length || ctaState === "uploading"}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                Upload files
              </button>
            </div>
          )}

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          {ctaState === "complete" && session ? (
            <p className="mt-4 text-sm text-emerald-300">Done. Folder logged: {session.folderUrl || session.folderId}</p>
          ) : null}
        </div>
      </div>
      <LegalNotice open={showLegal} onClose={() => setShowLegal(false)} />
    </>
  );
}
