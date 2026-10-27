import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail, CircleAlert } from "lucide-react";
import { BUDGETS, FORM_ENDPOINT, PROJECT_TYPES, SITE, SOCIAL } from "../lib/content";
import { SectionHead } from "./SectionHead";

type Fields = { name: string; email: string; company: string; type: string; budget: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "handoff" | "error";

const EMPTY: Fields = { name: "", email: "", company: "", type: "", budget: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address, like name@example.com.";
  if (!f.type) e.type = "Please choose the type of project.";
  if (f.message.trim().length < 20) e.message = "Please describe the project in at least a sentence or two (20+ characters).";
  return e;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const hasEndpoint = FORM_ENDPOINT.trim().length > 0;

  const set = (k: keyof Fields) => (v: string) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // spam trap: real people never see or fill this field
    if ((form.elements.namedItem("_gotcha") as HTMLInputElement | null)?.value) return;

    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, email: true, type: true, message: true });
    const first = Object.keys(errs)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      company: fields.company.trim(),
      projectType: fields.type,
      budget: fields.budget,
      message: fields.message.trim(),
    };

    if (hasEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...body, _subject: `New enquiry from ${body.name}` }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
        setFields(EMPTY);
        setTouched({});
      } catch {
        setStatus("error");
      }
      return;
    }

    // No form service configured: hand the message to the visitor's own email app.
    const text = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      body.company && `Company / project: ${body.company}`,
      `Type: ${body.projectType}`,
      body.budget && `Budget: ${body.budget}`,
      "",
      body.message,
    ].filter((l) => l !== "").join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Project enquiry — ${body.name}`)}&body=${encodeURIComponent(text)}`;
    setStatus("handoff");
  };

  const err = (k: keyof Fields) => (touched[k] && errors[k] ? errors[k] : undefined);
  const fieldProps = (k: keyof Fields) => ({
    id: `f-${k}`,
    name: k,
    value: fields[k],
    onBlur: blur(k),
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) ? `f-${k}-err` : undefined,
  });

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index="05" label="Contact" id="contact-title" title="Have an idea worth building?" />

        <div className="contact__grid">
          <div className="contact__aside" data-reveal>
            <p className="contact__lead">
              Tell us what you're working on, what problem you're trying to solve, and what you want to achieve.
              Let's explore how we can build it.
            </p>
            <dl className="contact__details">
              <div>
                <dt className="mono">Email</dt>
                <dd><a className="link" href={`mailto:${SITE.email}`}><Mail aria-hidden size={16} strokeWidth={1.6} /> {SITE.email}</a></dd>
              </div>
              <div>
                <dt className="mono">Based in</dt>
                <dd>{SITE.location}</dd>
              </div>
              <div>
                <dt className="mono">Elsewhere</dt>
                <dd>
                  {SOCIAL.map((s) => (
                    <a key={s.label} className="link" href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label} <ArrowUpRight aria-hidden size={15} strokeWidth={1.6} /><span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="contact__panel" data-reveal>
            {status === "sent" ? (
              <div className="form-result" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
                <span className="form-result__icon" aria-hidden><Check size={22} strokeWidth={1.8} /></span>
                <h3>Thank you — your message has been received.</h3>
                <p>We'll reply to the email address you provided.</p>
                <button className="link" type="button" onClick={() => setStatus("idle")}>Send another message</button>
              </div>
            ) : (
              <form ref={formRef} className="form" onSubmit={submit} noValidate>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="f-name">Name <span aria-hidden>*</span></label>
                    <input {...fieldProps("name")} type="text" autoComplete="name" required onChange={(e) => set("name")(e.target.value)} />
                    {err("name") && <p className="field__error" id="f-name-err">{err("name")}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="f-email">Email address <span aria-hidden>*</span></label>
                    <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" required onChange={(e) => set("email")(e.target.value)} />
                    {err("email") && <p className="field__error" id="f-email-err">{err("email")}</p>}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="f-company">Company or project name <span className="field__opt">(optional)</span></label>
                  <input {...fieldProps("company")} type="text" autoComplete="organization" onChange={(e) => set("company")(e.target.value)} />
                </div>

                <div className="form__row">
                  <div className="field">
                    <label htmlFor="f-type">Type of project <span aria-hidden>*</span></label>
                    <select {...fieldProps("type")} required onChange={(e) => set("type")(e.target.value)}>
                      <option value="">Choose one…</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {err("type") && <p className="field__error" id="f-type-err">{err("type")}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="f-budget">Budget range <span className="field__opt">(optional)</span></label>
                    <select {...fieldProps("budget")} onChange={(e) => set("budget")(e.target.value)}>
                      <option value="">Prefer not to say</option>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="f-message">Project description <span aria-hidden>*</span></label>
                  <textarea {...fieldProps("message")} rows={6} required onChange={(e) => set("message")(e.target.value)} />
                  {err("message") && <p className="field__error" id="f-message-err">{err("message")}</p>}
                </div>

                {/* honeypot — hidden from people and assistive tech */}
                <div className="hp" aria-hidden>
                  <label htmlFor="f-gotcha">Leave this field empty</label>
                  <input id="f-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="form__foot">
                  <button className="btn btn--solid" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : hasEndpoint ? "Send enquiry" : "Continue in your email app"}
                    {status !== "sending" && <ArrowRight aria-hidden size={18} strokeWidth={1.6} />}
                  </button>
                  <p className="form__note">
                    {hasEndpoint
                      ? "Required fields are marked with *."
                      : <>This opens your email app with your message filled in — nothing is sent until you press send there. Required fields are marked with *.</>}
                  </p>
                </div>

                <div className="form__status" role="status" aria-live="polite">
                  {status === "handoff" && (
                    <p className="notice">
                      <Mail aria-hidden size={18} strokeWidth={1.6} />
                      <span>Your email app should now be open with your message ready. If nothing happened, email us directly at <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</span>
                    </p>
                  )}
                  {status === "error" && (
                    <p className="notice notice--error">
                      <CircleAlert aria-hidden size={18} strokeWidth={1.6} />
                      <span>Your message couldn't be sent. Please try again, or email us at <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</span>
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
