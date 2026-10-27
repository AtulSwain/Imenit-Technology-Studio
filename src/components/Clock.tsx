import { useEffect, useState } from "react";
import { STUDIO_CITY, TIMEZONE } from "../lib/content";

function format() {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TIMEZONE }).format(new Date());
  } catch {
    return new Date().toTimeString().slice(0, 5);
  }
}

/** Small live studio clock — a quiet "real people work here" detail. */
export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={`clock ${className}`}>
      <span className="clock__city">{STUDIO_CITY}</span>
      <span className="clock__time">{time.slice(0, 2)}<i>:</i>{time.slice(3, 5)}</span>
    </span>
  );
}
