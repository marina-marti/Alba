import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Alba",
  description: "Tu espacio de calma.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fffaf3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="mx-auto flex min-h-screen max-w-md flex-col">
          <Header />
          <main className="flex-1 px-5 pb-28 pt-4">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
