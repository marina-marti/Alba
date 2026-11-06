import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Alba",
  description: "Tu espacio de calma.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fdf8f0" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col">
          <Header />
          <main className="page-enter flex-1 px-6 pb-36 pt-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
