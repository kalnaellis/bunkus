import { useMemo, useState } from 'react';

const STATES = {
  CTA: 'cta_only',
  FORM: 'form',
  UPLOAD: 'upload'
};

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip';

function IntakeFlow() {
  const [state, setState] = useState(STATES.CTA);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);

  const hasFiles = useMemo(() => files.length > 0, [files]);

  const validate = (payload) => {
    const nextErrors = {};

    if (!payload.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!payload.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!payload.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!payload.phone.trim()) nextErrors.phone = 'Phone is required.';
    if (!payload.consent) nextErrors.consent = 'You must acknowledge the intake notice.';

    return nextErrors;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: formData.get('firstName')?.toString() ?? '',
      lastName: formData.get('lastName')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      consent: formData.get('consent') === 'on'
    };

    const validationErrors = validate(payload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    localStorage.setItem('bunkus_intake', JSON.stringify(payload));
    setState(STATES.UPLOAD);
  };

  const updateFiles = (incomingFiles) => {
    const normalized = Array.from(incomingFiles).map((file) => ({
      name: file.name,
      size: file.size
    }));
    setFiles(normalized);
    localStorage.setItem('bunkus_files', JSON.stringify(normalized.map((file) => file.name)));
  };

  const onDrop = (event) => {
    event.preventDefault();
    if (!event.dataTransfer?.files?.length) return;
    updateFiles(event.dataTransfer.files);
  };

  return (
    <div className="intake-flow">
      <button className="button-primary" type="button" onClick={() => setState(STATES.FORM)}>
        SEAL YOUR CASE IN ONE CLICK
      </button>

      {state === STATES.FORM && (
        <form className="intake-form" onSubmit={onSubmit} noValidate>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" type="text" required aria-invalid={Boolean(errors.firstName)} />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" type="text" required aria-invalid={Boolean(errors.lastName)} />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required aria-invalid={Boolean(errors.email)} />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" required aria-invalid={Boolean(errors.phone)} />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
          </div>

          <div className="consent-wrap">
            <input id="consent" name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} />
            <label htmlFor="consent">I understand this is an initial intake, not official legal advice.</label>
          </div>
          {errors.consent && <p className="error-message">{errors.consent}</p>}

          <button className="button-primary" type="submit">
            SUBMIT
          </button>
        </form>
      )}

      {state === STATES.UPLOAD && (
        <div className="upload-panel">
          <h3>Upload your files</h3>
          <label
            htmlFor="file-input"
            className="dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
          >
            <span>Drag files here or click to browse</span>
            <input
              id="file-input"
              type="file"
              multiple
              accept={ACCEPTED_TYPES}
              onChange={(event) => updateFiles(event.target.files || [])}
            />
          </label>

          {hasFiles && (
            <ul className="file-list">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`}>
                  <span>{file.name}</span>
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
          )}

          <p className="done-message">Received. We will review your materials.</p>
        </div>
      )}
    </div>
  );
}

export default IntakeFlow;
