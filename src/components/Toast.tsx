import { useUI } from "../lib/ui";

export function Toast() {
  const { toast } = useUI();
  return (
    <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
      <i className="toast__dot" />
      <span>{toast}</span>
    </div>
  );
}
