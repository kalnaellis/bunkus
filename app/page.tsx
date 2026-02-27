"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type IntakeSession = {
  caseId: string;
  rowIndex: number;
  filesCount?: number;
};

type UploadRecord = {
  name: string;
  status: "queued" | "uploaded" | "failed";
  url?: string;
};

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip";

export default function HomePage() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);

  const [heroText, setHeroText] = useState("");
  const [canOpenForm, setCanOpenForm] = useState(false);
  const [step, setStep] = useState<"cta" | "form" | "upload">("cta");
  const [statusText, setStatusText] = useState("Confidential intake. No spam. No nonsense.");
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [sourceTag, setSourceTag] = useState("github-pages-v1");
  const [scrollY, setScrollY] = useState(0);

  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "", []);

  useEffect(() => {
    const phrase = "NOT YOUR REGULAR LAWYER";
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setHeroText(phrase.slice(0, index));
      if (index >= phrase.length) {
        window.clearInterval(timer);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!section4Ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        setCanOpenForm(target.isIntersecting && target.intersectionRatio > 0.95);
      },
      { threshold: [0.95, 1] }
    );

    observer.observe(section4Ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".glitch-surface");
    const onMove = (event: PointerEvent) => {
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const px = ((event.clientX - rect.left) / rect.width) * 100;
        const py = ((event.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty("--mx", `${px}%`);
        node.style.setProperty("--my", `${py}%`);
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  async function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      action: "intake",
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      consent: formData.get("consent") === "on",
      source: sourceTag
    };

    setStatusText("Submitting intake...");

    try {
      if (!endpoint) throw new Error("Missing NEXT_PUBLIC_APPS_SCRIPT_URL");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed intake submission");
      const data = (await response.json()) as IntakeSession;
      setSession(data);
      setStep("upload");
      setStatusText("Received. Upload files to continue.");
    } catch {
      const fallback = {
        caseId: `CASE-${new Date().getUTCFullYear()}-${Math.floor(Math.random() * 1_000_000)
          .toString()
          .padStart(6, "0")}`,
        rowIndex: 1
      };
      setSession(fallback);
      setStep("upload");
      setStatusText("Received (demo mode). Upload files to continue.");
    }
  }

  async function uploadFiles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    const fileInput = event.currentTarget.elements.namedItem("files") as HTMLInputElement | null;
    const fileList = fileInput?.files;
    if (!fileList?.length) return;

    const selected = Array.from(fileList);
    setUploads(selected.map((file) => ({ name: file.name, status: "queued" })));
    setStatusText("Uploading files...");

    try {
      if (!endpoint) throw new Error("Missing NEXT_PUBLIC_APPS_SCRIPT_URL");

      const files = await Promise.all(
        selected.map(async (file) => ({
          name: file.name,
          type: file.type,
          content: btoa(String.fromCharCode(...new Uint8Array(await file.arrayBuffer())))
        }))
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "upload",
          caseId: session.caseId,
          rowIndex: session.rowIndex,
          files
        })
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { files: Array<{ name: string; url: string }> };

      setUploads(data.files.map((item) => ({ name: item.name, url: item.url, status: "uploaded" })));
      setStatusText("Upload complete. Your files are secured.");
    } catch {
      setUploads(selected.map((file) => ({ name: file.name, status: "failed" })));
      setStatusText("Upload failed in this environment. Keep endpoint + Drive settings in sync.");
    }
  }

  return (
    <main ref={shellRef} className="poster-shell">
      <section className="poster scene-1">
        <div className="scene-inner">
          <h1>{heroText}</h1>
          <p className="subline">Corporate. Criminal. Contracts. Controlled chaos.</p>
        </div>
      </section>

      <section className="poster scene-2">
        <div className="scene-grid">
          <h2 className="poster-title glitch-surface">I MAKE RULES BEND</h2>
          <div className="image-frame glitch-surface" style={{ transform: `translateY(${Math.max(-28, 24 - scrollY * 0.02)}px)` }}>
            <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=80" alt="Litigation portrait" />
          </div>
        </div>
      </section>

      <section className="poster scene-3">
        <div className="scene-grid reverse sticky-grid">
          <div className="image-frame glitch-surface" style={{ transform: `translateY(${Math.min(22, -20 + scrollY * 0.018)}px)` }}>
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80" alt="Case preparation portrait" />
          </div>
          <h2 className="poster-title glitch-surface">CASE CLOSED. LIPS CLOSED.</h2>
        </div>
      </section>

      <section className="poster scene-4" ref={section4Ref}>
        <div className="scene-inner cta-panel">
          <h2 className="poster-title">SOME BREAK LAWS. I BREAK LIMITS.</h2>

          {step === "cta" ? (
            <div className="funnel-card">
              <button className={`seal-button ${canOpenForm ? "ready" : "arming"}`} disabled={!canOpenForm} onClick={() => setStep("form")}>
                SEAL YOUR CASE IN ONE CLICK
              </button>
              <p className="microcopy">Confidential intake. No spam. No nonsense.</p>
            </div>
          ) : null}

          {step === "form" ? (
            <form className="funnel-card" onSubmit={submitIntake}>
              <input name="name" placeholder="Name" required minLength={2} />
              <input name="email" type="email" placeholder="Email" required />
              <label className="consent-line">
                <input name="consent" type="checkbox" required /> I understand this is an initial intake, not official legal advice.
              </label>
              <input
                name="source"
                value={sourceTag}
                onChange={(event) => setSourceTag(event.target.value)}
                placeholder="Source tag"
                aria-label="Source tag"
              />
              <button className="seal-button ready" type="submit">
                SUBMIT INTAKE
              </button>
            </form>
          ) : null}

          {step === "upload" ? (
            <form className="funnel-card" onSubmit={uploadFiles}>
              <label className="upload-dropzone">
                <span>UPLOAD FILES</span>
                <input name="files" type="file" accept={ACCEPTED_TYPES} multiple />
                <small>Drag and drop or click. Accepts pdf/doc/docx/jpg/png/zip.</small>
              </label>
              <button className="seal-button ready" type="submit">
                START UPLOAD
              </button>
            </form>
          ) : null}

          {statusText ? <p className="microcopy status">{statusText}</p> : null}
          {uploads.length > 0 ? (
            <ul className="upload-list">
              {uploads.map((item) => (
                <li key={`${item.name}-${item.status}`}>
                  <span>{item.name}</span>
                  <strong>{item.status}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </main>
  );
}
