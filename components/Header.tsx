import Link from "next/link";
import { Sunrise, Wave } from "@/components/Curves";
import LanguageSelect from "@/components/LanguageSelect";
import ProfileBubble from "@/components/ProfileBubble";
import { getProfile } from "@/lib/db";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between gap-3 px-6 pb-8 pt-8">
      <Link href="/" className="inline-flex min-h-11 items-center gap-3 font-serif text-3xl tracking-wide text-dawn-500">
        <Sunrise className="h-6 w-9" />
        Alba
      </Link>
      <div className="flex items-center gap-2">
        <LanguageSelect />
        <ProfileBubble name={getProfile()?.name ?? null} />
      </div>
      <Wave className="absolute inset-x-6 bottom-0 h-5 w-[calc(100%-3rem)]" />
    </header>
  );
}
