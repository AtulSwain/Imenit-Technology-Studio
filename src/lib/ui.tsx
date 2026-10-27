import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type Panel = { type: "project" | "post"; index: number } | null;

type UI = {
  panel: Panel;
  openProject: (i: number) => void;
  openPost: (i: number) => void;
  closePanel: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
};

const Ctx = createContext<UI | null>(null);

/** Global UI state: the open detail panel (project / article) and toast messages. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo<UI>(() => ({
    panel,
    openProject: (index) => setPanel({ type: "project", index }),
    openPost: (index) => setPanel({ type: "post", index }),
    closePanel: () => setPanel(null),
    toast,
    showToast,
  }), [panel, toast, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ui = useContext(Ctx);
  if (!ui) throw new Error("useUI must be used inside <UIProvider>");
  return ui;
}

/** Copy text to the clipboard, with a fallback for older browsers / insecure contexts. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
