const WORDS = ["Digital products", "Intelligent software", "Web experiences", "AI systems", "Platform engineering"];

/** A slow, quiet capability strip. Pure CSS animation; pauses on hover and stops with reduced motion. */
export function Ticker() {
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker__track">
        {[0, 1].map((k) => (
          <div className="ticker__group" key={k}>
            {WORDS.map((w) => (
              <span className="ticker__item" key={w}>
                {w}
                <i className="ticker__mark"><b /><b /><b /></i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
