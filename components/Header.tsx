import Link from "next/link";

export default function Header() {
  return (
    <header className="px-5 pt-6">
      <Link href="/" className="text-2xl font-semibold tracking-wide text-dawn-500">
        Alba
      </Link>
    </header>
  );
}
