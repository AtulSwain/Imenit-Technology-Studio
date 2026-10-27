import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode; label?: string };

/**
 * Catches render errors so a failure never leaves a blank white page.
 * Used twice: around the whole app, and around the optional 3D scene
 * (if WebGL fails, the site keeps working without it).
 */
export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? "app"}]`, error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="crash" role="alert">
        <div className="crash__inner">
          <p className="eyebrow">IMENIT Technologies</p>
          <h1>Something went off-orbit.</h1>
          <p>Please reload the page. If it keeps happening, email us and we will fix it fast.</p>
          <button className="btn btn--solid" onClick={() => window.location.reload()}>
            <span className="btn__label">Reload page</span>
          </button>
        </div>
      </div>
    );
  }
}
