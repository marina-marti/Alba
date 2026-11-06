"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio" },
  { href: "/checkin", label: "Hoy" },
  { href: "/pregunta", label: "Pregunta" },
  { href: "/circulo", label: "Círculo" },
];

export default function BottomNav() {
  const path = usePathname();
  const idx = items.findIndex((i) => i.href === path);
  return (
    <nav
      aria-label="Navegación"
      className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-sm rounded-full bg-white/90 p-1.5 shadow-lift backdrop-blur"
    >
      <div className="relative grid grid-cols-4">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-dawn-200 transition-[transform,opacity] duration-500 ease-out"
          style={{ transform: `translateX(${Math.max(idx, 0) * 100}%)`, opacity: idx < 0 ? 0 : 1 }}
        />
        {items.map((i, n) => (
          <Link
            key={i.href}
            href={i.href}
            aria-current={n === idx ? "page" : undefined}
            className={`relative flex min-h-12 items-center justify-center rounded-full px-1 text-sm transition-colors duration-300 ${
              n === idx ? "font-semibold text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
