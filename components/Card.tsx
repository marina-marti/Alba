import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-4xl bg-white/80 p-5 shadow-soft ${className}`}>{children}</section>;
}
