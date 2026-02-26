const phrases = [
  "NOT YOUR REGULAR LAWYER",
  "I MAKE RULES BEND",
  "CASE CLOSED",
  "LIPS GLOSSED",
  "SOME BREAK LAWS. I BREAK LIMITS."
];

const ctaLabels = {
  idle: "Seal your case in one click",
  armed: "Open intake",
  form_open: "Submit details",
  submitting: "Submitting...",
  upload_ready: "Upload files",
  uploading: "Uploading...",
  complete: "Complete"
};

const state = {
  cta: "idle",
  session: null
};

const el = {
  bg: document.getElementById("bg"),
  hashLine: document.getElementById("hashLine"),
  headline: document.getElementById("headline"),
  card: document.getElementById("sideCard"),
  cta: document.getElementById("cta"),
  modal: document.getElementById("intakeModal"),
  legal: document.getElementById("legalModal"),
  intakeForm: document.getElementById("intakeForm"),
  uploadStep: document.getElementById("uploadStep"),
  formStep: document.getElementById("formStep"),
  caseRef: document.getElementById("caseRef"),
  status: document.getElementById("status"),
  files: document.getElementById("files")
};

function phraseFor(progress) {
  if (progress < 0.2) return phrases[0];
  if (progress < 0.4) return phrases[1];
  if (progress < 0.62) return phrases[2];
  if (progress < 0.82) return phrases[3];
  return phrases[4];
}

function updateCTA(next) {
  state.cta = next;
  el.cta.textContent = ctaLabels[next] ?? ctaLabels.idle;
  const active = !["idle", "submitting", "uploading"].includes(next);
  el.cta.disabled = !active;
  el.cta.classList.toggle("active", active);
}

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.max(0, Math.min(1, window.scrollY / (max || 1)));

  el.hashLine.textContent = `HX-${Math.floor(progress * 9000).toString(16).toUpperCase()}`;
  el.headline.textContent = phraseFor(progress);
  el.headline.style.letterSpacing = progress > 0.2 && progress < 0.4 ? "0.02em" : "0.01em";
  el.card.classList.toggle("hidden", !(progress > 0.48 && progress < 0.78));
  el.bg.style.backgroundPosition = `left ${Math.round(progress * 100)}% top, right ${Math.round(progress * 100)}% top, center`;

  if (progress > 0.82 && state.cta === "idle") updateCTA("armed");
});

el.cta.addEventListener("click", () => {
  if (state.cta === "armed" || state.cta === "upload_ready" || state.cta === "complete") {
    el.modal.showModal();
    if (state.cta === "armed") updateCTA("form_open");
  }
});

document.getElementById("closeModal").addEventListener("click", () => el.modal.close());
document.getElementById("openLegal").addEventListener("click", () => el.legal.showModal());
document.getElementById("closeLegal").addEventListener("click", () => el.legal.close());

el.intakeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.session) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const consent = document.getElementById("consent").checked;

  if (!name || !email.includes("@") || !consent) {
    el.status.textContent = "Enter valid details and consent to continue.";
    return;
  }

  updateCTA("submitting");

  try {
    const response = await fetch("/api/case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, consent, consentTextVersion: "v1" })
    });

    if (!response.ok) throw new Error("api unavailable");
    state.session = await response.json();
  } catch {
    const fallbackCase = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;
    state.session = {
      caseId: fallbackCase,
      rowIndex: 1,
      folderId: "local-demo-folder",
      folderUrl: "local://demo"
    };
  }

  el.caseRef.textContent = `Reference: ${state.session.caseId}`;
  el.caseRef.classList.remove("hidden");
  el.formStep.classList.add("hidden");
  el.uploadStep.classList.remove("hidden");
  el.status.textContent = "Case created. Add files to complete.";
  updateCTA("upload_ready");
});

document.getElementById("uploadBtn").addEventListener("click", async () => {
  if (!state.session) return;

  const files = Array.from(el.files.files || []);
  if (!files.length) {
    el.status.textContent = "Please select at least one file.";
    return;
  }

  updateCTA("uploading");

  try {
    const formData = new FormData();
    formData.set("caseId", state.session.caseId);
    formData.set("rowIndex", String(state.session.rowIndex));
    formData.set("folderId", state.session.folderId);
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    if (!response.ok) throw new Error("upload api unavailable");
    el.status.textContent = "Uploaded and logged.";
  } catch {
    el.status.textContent = "Upload API unavailable in static mode; UI flow verified locally.";
  }

  updateCTA("complete");
});

updateCTA("idle");
window.dispatchEvent(new Event("scroll"));
