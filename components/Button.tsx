import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "quiet" | "sage";
const cls = (variant: Variant, extra: string) =>
  `btn ${variant === "quiet" ? "btn-quiet" : variant === "sage" ? "btn-sage" : ""} ${extra}`;

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cls(variant, className)} {...props} />;
}

export function ButtonLink({ href, children, className = "", variant = "primary" }: { href: string; children: ReactNode; className?: string; variant?: Variant }) {
  return (
    <Link href={href} className={cls(variant, className)}>
      {children}
    </Link>
  );
}
