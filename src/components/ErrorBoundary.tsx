import { Component, type ErrorInfo, type ReactNode } from "react";
import { SITE } from "../lib/content";

/** Shows a clear message instead of a blank page if rendering ever fails. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="crash" role="alert">
        <h1>Something went wrong.</h1>
        <p>Please reload the page. If it keeps happening, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <button className="btn btn--solid" type="button" onClick={() => window.location.reload()}>Reload page</button>
      </main>
    );
  }
}
