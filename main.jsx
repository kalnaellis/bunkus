// Compatibility shim for environments/extensions that still request /main.jsx.
// The real app bootstraps from /src/main.js via index.html.
window.location.replace('./index.html');
