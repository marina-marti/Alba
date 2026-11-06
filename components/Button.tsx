import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-dawn-400 px-6 py-3 font-medium text-white shadow-soft hover:bg-dawn-500 active:scale-[0.98]";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${base} ${className}`} {...props} />;
}

export function ButtonLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
