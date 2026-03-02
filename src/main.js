const app = document.getElementById('root');

app.innerHTML = `
  <div class="page-shell">
    <header class="top-strip" aria-label="Primary">
      <div class="content-wrap top-strip__inner">
        <a class="brand" href="#hero">BUNKUS</a>
        <a class="top-strip__cta" href="#section-four">Seal your case</a>
      </div>
    </header>

    <main>
      <section id="hero" class="panel panel--hero" aria-labelledby="hero-title">
        <div class="content-wrap">
          <p class="eyebrow">Criminal Defense Intake</p>
          <h1 id="hero-title">NOT YOUR REGULAR LAWYER</h1>
        </div>
      </section>

      <section id="section-two" class="panel panel--poster" aria-label="I MAKE RULES BEND">
        <div class="content-wrap poster-grid">
          <h2>I MAKE RULES BEND</h2>
          <figure class="poster-image">
            <img src="./public/image-placeholder.svg" alt="Cinematic placeholder for section two" loading="lazy" />
          </figure>
        </div>
      </section>

      <section id="section-three" class="panel panel--poster" aria-label="CASE CLOSED. LIPS CLOSED.">
        <div class="content-wrap poster-grid poster-grid--reverse">
          <h2>CASE CLOSED. LIPS CLOSED.</h2>
          <figure class="poster-image">
            <img src="./public/image-placeholder.svg" alt="Cinematic placeholder for section three" loading="lazy" />
          </figure>
        </div>
      </section>

      <section id="section-four" class="panel panel--cta" aria-labelledby="cta-title">
        <div class="content-wrap cta-wrap">
          <h2 id="cta-title">SOME BREAK LAWS. I BREAK LIMITS.</h2>
          <div class="intake-flow" id="intake-flow">
            <button class="button-primary" type="button" id="open-intake">SEAL YOUR CASE IN ONE CLICK</button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const STATES = { CTA: 'cta_only', FORM: 'form', UPLOAD: 'upload' };
let state = STATES.CTA;
let files = [];
const intakeRoot = document.getElementById('intake-flow');

function renderErrors(errors = {}) {
  return {
    firstName: errors.firstName ? `<p class="error-message">${errors.firstName}</p>` : '',
    lastName: errors.lastName ? `<p class="error-message">${errors.lastName}</p>` : '',
    email: errors.email ? `<p class="error-message">${errors.email}</p>` : '',
    phone: errors.phone ? `<p class="error-message">${errors.phone}</p>` : '',
    consent: errors.consent ? `<p class="error-message">${errors.consent}</p>` : ''
  };
}

function renderForm(errors = {}) {
  const e = renderErrors(errors);
  intakeRoot.innerHTML = `
    <button class="button-primary" type="button" id="open-intake">SEAL YOUR CASE IN ONE CLICK</button>
    <form class="intake-form" id="intake-form" novalidate>
      <div class="field-grid">
        <div class="field">
          <label for="firstName">First name</label>
          <input id="firstName" name="firstName" type="text" required aria-invalid="${Boolean(errors.firstName)}" />
          ${e.firstName}
        </div>
        <div class="field">
          <label for="lastName">Last name</label>
          <input id="lastName" name="lastName" type="text" required aria-invalid="${Boolean(errors.lastName)}" />
          ${e.lastName}
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required aria-invalid="${Boolean(errors.email)}" />
          ${e.email}
        </div>
        <div class="field">
          <label for="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required aria-invalid="${Boolean(errors.phone)}" />
          ${e.phone}
        </div>
      </div>

      <div class="consent-wrap">
        <input id="consent" name="consent" type="checkbox" required aria-invalid="${Boolean(errors.consent)}" />
        <label for="consent">I understand this is an initial intake, not official legal advice.</label>
      </div>
      ${e.consent}

      <button class="button-primary" type="submit">SUBMIT</button>
    </form>
  `;
  bindEvents();
}

function renderUpload() {
  const list = files.length
    ? `<ul class="file-list">${files.map((f) => `<li><span>${f.name}</span><span>${(f.size / 1024).toFixed(1)} KB</span></li>`).join('')}</ul>`
    : '';
  intakeRoot.innerHTML = `
    <button class="button-primary" type="button" id="open-intake">SEAL YOUR CASE IN ONE CLICK</button>
    <div class="upload-panel">
      <h3>Upload your files</h3>
      <label for="file-input" class="dropzone" id="dropzone">
        <span>Drag files here or click to browse</span>
        <input id="file-input" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" />
      </label>
      ${list}
      <p class="done-message">Received. We will review your materials.</p>
    </div>
  `;
  bindEvents();
}

function validate(payload) {
  const errors = {};
  if (!payload.firstName.trim()) errors.firstName = 'First name is required.';
  if (!payload.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!payload.email.trim()) errors.email = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(payload.email)) errors.email = 'Enter a valid email address.';
  if (!payload.phone.trim()) errors.phone = 'Phone is required.';
  if (!payload.consent) errors.consent = 'You must acknowledge the intake notice.';
  return errors;
}

function updateFiles(fileList) {
  files = Array.from(fileList).map((f) => ({ name: f.name, size: f.size }));
  localStorage.setItem('bunkus_files', JSON.stringify(files.map((f) => f.name)));
  renderUpload();
}

function bindEvents() {
  const openBtn = document.getElementById('open-intake');
  if (openBtn) {
    openBtn.onclick = () => {
      if (state === STATES.CTA) {
        state = STATES.FORM;
        renderForm();
      }
    };
  }

  const form = document.getElementById('intake-form');
  if (form) {
    form.onsubmit = (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = {
        firstName: String(data.get('firstName') || ''),
        lastName: String(data.get('lastName') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
        consent: data.get('consent') === 'on'
      };
      const errors = validate(payload);
      if (Object.keys(errors).length) {
        renderForm(errors);
        return;
      }
      localStorage.setItem('bunkus_intake', JSON.stringify(payload));
      state = STATES.UPLOAD;
      renderUpload();
    };
  }

  const input = document.getElementById('file-input');
  if (input) input.onchange = (e) => updateFiles(e.target.files || []);

  const dropzone = document.getElementById('dropzone');
  if (dropzone) {
    dropzone.ondragover = (e) => e.preventDefault();
    dropzone.ondrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) updateFiles(e.dataTransfer.files);
    };
  }
}

bindEvents();
