import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { BUDGETS, CONTACT_EMAIL, CONTACT_FORM_ENDPOINT, CONTACT_LOCATION, CONTACT_PHONE, PROJECT_TYPES, SOCIAL } from "../lib/content";
import { copyText, useUI } from "../lib/ui";
import { Arrow, Eyebrow, SplitWords } from "./ui";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form. Sends to CONTACT_FORM_ENDPOINT when configured (Formspree-style JSON POST);
 * otherwise opens the visitor's email app with everything pre-filled, so messages always reach you.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { showToast } = useUI();
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(() => {
    gsap.from(".contact__form > *", {
      y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.06,
      scrollTrigger: { trigger: ".contact__form", start: "top 85%", once: true },
    });
  }, { scope: root });

  const toggleType = (t: string) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const copyEmail = async () => {
    showToast((await copyText(CONTACT_EMAIL)) ? "Email copied to clipboard" : CONTACT_EMAIL);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      projectType: types.join(", "),
      budget,
      message: String(data.get("message") ?? ""),
    };

    if (CONTACT_FORM_ENDPOINT) {
      setStatus("sending");
      try {
        const res = await fetch(CONTACT_FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    // no backend configured: hand off to the visitor's email app
    const details = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.company ? `Company: ${payload.company}` : "",
      payload.projectType ? `Project: ${payload.projectType}` : "",
      payload.budget ? `Budget: ${payload.budget}` : "",
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${payload.message}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`New project — ${payload.name}`)}&body=${encodeURIComponent(body)}`;
    // mailto: hands off to the mail app without unloading this page (no new blank tab)
    window.location.href = href;
    setStatus("sent");
  };

  return (
    <section className="contact section" id="contact" ref={root}>
      <div className="container contact__grid">
        <div className="contact__info">
          <Eyebrow index="07">Contact</Eyebrow>
          <h2 className="h2" data-words><SplitWords text="Tell us about" /> <span className="wm"><em className="wi">your idea.</em></span></h2>
          <p className="muted" data-reveal>Share a few details and we'll get back within one business day with next steps and a rough plan.</p>

          <ul className="contact__list" data-reveal>
            <li>
              <small>Email</small>
              <button className="contact__copy" onClick={copyEmail}>
                <span>{CONTACT_EMAIL}</span>
                <svg viewBox="0 0 24 24" aria-hidden><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
              </button>
            </li>
            <li><small>Phone</small><span>{CONTACT_PHONE}</span></li>
            <li><small>Studio</small><span>{CONTACT_LOCATION}</span></li>
          </ul>

          <div className="contact__social" data-reveal>
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
        </div>

        <div className="contact__card">
          {status === "sent" ? (
            <div className="contact__done" role="status">
              <span className="contact__check" aria-hidden><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10" /></svg></span>
              <h3>Thank you — message ready.</h3>
              <p>
                {CONTACT_FORM_ENDPOINT
                  ? "We received your message and will reply within one business day."
                  : <>Your email app should open with your message — just press send. No email app? Write to us at <button className="contact__inline" onClick={copyEmail}>{CONTACT_EMAIL}</button>.</>}
              </p>
              <button className="link-arrow" onClick={() => setStatus("idle")}><span>Send another</span><Arrow className="" /></button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={submit}>
              <fieldset className="field-group">
                <legend>I'm interested in</legend>
                <div className="chips">
                  {PROJECT_TYPES.map((t) => (
                    <button type="button" key={t} className={`chip${types.includes(t) ? " is-on" : ""}`} aria-pressed={types.includes(t)} onClick={() => toggleType(t)}>{t}</button>
                  ))}
                </div>
              </fieldset>

              <div className="fields">
                <label className="field"><input name="name" required placeholder=" " autoComplete="name" /><span>Your name</span></label>
                <label className="field"><input name="email" type="email" required placeholder=" " autoComplete="email" /><span>Email address</span></label>
              </div>
              <label className="field"><input name="company" placeholder=" " autoComplete="organization" /><span>Company (optional)</span></label>

              <fieldset className="field-group">
                <legend>Budget</legend>
                <div className="chips">
                  {BUDGETS.map((b) => (
                    <button type="button" key={b} className={`chip${budget === b ? " is-on" : ""}`} aria-pressed={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>{b}</button>
                  ))}
                </div>
              </fieldset>

              <label className="field field--area"><textarea name="message" required placeholder=" " rows={4} /><span>Tell us about the project</span></label>

              <div className="contact__submit">
                <button className="btn btn--solid" type="submit" disabled={status === "sending"} data-magnetic>
                  <span className="btn__label">{status === "sending" ? "Sending…" : "Send message"}</span><Arrow />
                </button>
                {status === "error" && <p className="contact__error">Couldn't send right now — please email {CONTACT_EMAIL}.</p>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
