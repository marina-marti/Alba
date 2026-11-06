import type { Metadata, Viewport } from "next";
import { getLang, dictionaries, makeT } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

// The page title stays exactly "Alba" in both languages.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Alba",
    description: makeT(await getLang())("meta.description"),
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fdf8f0" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body>
        <I18nProvider lang={lang} dict={dictionaries[lang]}>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col">
          <Header />
          <main className="page-enter flex-1 px-6 pb-36 pt-6">{children}</main>
          <BottomNav />
        </div>
        </I18nProvider>
      </body>
    </html>
  );
}
