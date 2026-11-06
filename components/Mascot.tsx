"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// All words live in MascotMount.tsx (COPY es/en); this client part gets the label as a prop.
const HIDDEN = ["/pregunta", "/alerta"];

export default function Mascot({ label }: { label: string }) {
  const path = usePathname() || "/";
  if (HIDDEN.some((p) => path === p || path.startsWith(p + "/"))) return null;
  const slug = path === "/" ? "inicio" : path.replace(/^\/+|\/+$/g, "");
  return (
    <Link href={`/pregunta?desde=${encodeURIComponent(slug)}`} aria-label={label} className="mascot group">
      <span className="mascot-label" aria-hidden>{label}</span>
      <svg viewBox="0 0 100 100" className="mascot-svg" aria-hidden>
        <defs>
          <radialGradient id="mascot-fill" cx="40%" cy="32%" r="80%">
            <stop offset="0" stopColor="#fbe3c8" />
            <stop offset="1" stopColor="#f1c39d" />
          </radialGradient>
        </defs>
        <g className="m-arm">
          <path d="M76 64 L94 54" stroke="#e9ab7e" strokeWidth="7" strokeLinecap="round" />
          <circle cx="96" cy="50" r="6.5" fill="#f1c39d" />
        </g>
        <g className="m-body">
          <path d="M50 10c18 0 34 11 37 28s-2 30-14 41-30 14-44 6S6 60 11 40 30 10 50 10z" fill="url(#mascot-fill)" />
          <ellipse cx="29" cy="60" rx="7" ry="4.5" fill="#e9ab7e" opacity=".5" />
          <ellipse cx="71" cy="60" rx="7" ry="4.5" fill="#e9ab7e" opacity=".5" />
          <ellipse className="m-eye" cx="38" cy="48" rx="3.4" ry="4.6" fill="#3a2f29" style={{ transformOrigin: "38px 48px" }} />
          <ellipse className="m-eye" cx="62" cy="48" rx="3.4" ry="4.6" fill="#3a2f29" style={{ transformOrigin: "62px 48px" }} />
          <path d="M40 62q10 9 20 0" stroke="#3a2f29" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
        <g className="m-puff" fill="#fff" opacity="0">
          <circle cx="50" cy="76" r="3" />
          <circle cx="57" cy="80" r="2" />
        </g>
      </svg>
    </Link>
  );
}
