import { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { SOCIAL } from "../lib/content";
import { LogoE } from "./ui";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [subscribed, setSubscribed] = useState(false);

  useGSAP(() => {
    gsap.from(".footer__brand > *", {
      yPercent: 100, duration: 1.4, ease: "expo.out", stagger: 0.06,
      scrollTrigger: { trigger: ".footer__brand", start: "top 95%", once: true },
    });
  }, { scope: root });

  return (
    <footer className="footer" ref={root}>
      <div className="container">
        <div className="footer__top">
          <div className="footer__col">
            <p className="eyebrow">Studio</p>
            {["about", "services", "work", "blog"].map((id) => (
              <a key={id} href={`#${id}`} data-scramble>{id[0].toUpperCase() + id.slice(1)}</a>
            ))}
          </div>
          <div className="footer__col">
            <p className="eyebrow">Social</p>
            {SOCIAL.map((s) => <a key={s.label} href={s.href} data-scramble>{s.label}</a>)}
          </div>
          <div className="footer__col footer__news">
            <p className="eyebrow">Stay in the loop</p>
            <form className={`news${subscribed ? " is-done" : ""}`} onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
              <input type="email" placeholder="Your email" required aria-label="Your email" />
              <button type="submit" aria-label="Subscribe"><svg viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button>
              <span className="news__ok" role="status">{subscribed ? "Thanks — you're in." : ""}</span>
            </form>
          </div>
        </div>
        <div className="footer__brand" aria-hidden>
          <span>I</span><span>M</span><LogoE /><span>N</span><span>I</span><span>T</span>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} IMENIT Technologies. All rights reserved.</span>
          <a href="#top" className="totop" data-magnetic><span data-scramble>Back to top</span> ↑</a>
        </div>
      </div>
    </footer>
  );
}
