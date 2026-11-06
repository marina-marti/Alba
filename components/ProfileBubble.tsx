"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

// Round avatar (first letter of the name) linking to /perfil. Hidden on the urgent screen only.
export default function ProfileBubble({ name }: { name: string | null }) {
  const path = usePathname();
  const { t } = useI18n();
  if (path === "/alerta" || path?.startsWith("/alerta/")) return null;
  const letter = (name?.trim()[0] ?? "A").toUpperCase();
  return (
    <Link
      href="/perfil"
      aria-label={t("profile.label")}
      aria-current={path === "/perfil" ? "page" : undefined}
      className="profile-bubble"
    >
      <span aria-hidden>{letter}</span>
    </Link>
  );
}
