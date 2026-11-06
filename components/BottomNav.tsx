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
  return (
    <nav
      aria-label="Navegación"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md justify-around rounded-t-4xl bg-white/90 px-2 py-3 shadow-soft backdrop-blur"
    >
      {items.map((i) => {
        const active = path === i.href;
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`min-h-11 rounded-full px-4 py-2 text-sm ${
              active ? "bg-dawn-200 font-medium text-ink" : "text-ink-soft"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
