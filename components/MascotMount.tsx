import { cookies } from "next/headers";
import Mascot from "./Mascot";

const COPY = {
  es: { label: "Pregúntale a Alba" },
  en: { label: "Ask Alba" },
} as const;

async function getLang(): Promise<"es" | "en"> {
  return (await cookies()).get("alba_lang")?.value === "en" ? "en" : "es";
}

export default async function MascotMount() {
  return <Mascot label={COPY[await getLang()].label} />;
}
