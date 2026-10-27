import { Layers, Monitor, Server, Sparkles, type LucideIcon } from "lucide-react";
import { SERVICES, type ServiceIconName } from "../lib/content";
import { SectionHead } from "./SectionHead";

const ICONS: Record<ServiceIconName, LucideIcon> = { layers: Layers, monitor: Monitor, sparkles: Sparkles, server: Server };

export function Services() {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          index="02"
          label="Services"
          id="services-title"
          title="What we build, and when it makes sense."
          intro="Four areas of work we can genuinely deliver. Each starts with the problem, not the technology."
        />

        <ol className="service-list">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <li className="service" key={s.title} data-reveal>
                <div className="service__head">
                  <span className="mono service__num">{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="service__icon" aria-hidden size={22} strokeWidth={1.4} />
                  <h3 className="service__title">{s.title}</h3>
                </div>
                <dl className="service__qa">
                  <div><dt className="mono">What we build</dt><dd>{s.build}</dd></div>
                  <div><dt className="mono">The problem it solves</dt><dd>{s.solves}</dd></div>
                  <div><dt className="mono">Choose it when</dt><dd>{s.when}</dd></div>
                </dl>
                <ul className="service__items">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
