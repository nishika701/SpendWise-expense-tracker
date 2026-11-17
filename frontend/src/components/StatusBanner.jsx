export default function StatusBanner({ message, error, onClose }) {
  if (!message && !error) return null;

  return (
    <div className={`status-banner ${error ? "error" : "success"}`}>
      <span>{error || message}</span>
      <button onClick={onClose} aria-label="Close message">
        ×
      </button>
    </div>
  );
}
