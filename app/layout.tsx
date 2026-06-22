import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import { XPProvider } from "@/contexts/xp-context";

export const metadata: Metadata = {
  title: "Homestead",
  description: "Your personal productivity dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: "#FAF3EA" }}>
        <XPProvider>
          <Nav />
          <main className="md:ml-60 pt-16 md:pt-0 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
              {children}
            </div>
          </main>
        </XPProvider>
      </body>
    </html>
  );
}
