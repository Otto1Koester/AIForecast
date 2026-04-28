import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIForecast",
  description: "AI-прогнозирование запасов лекарственных средств",
};

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/", label: "Dashboard" },
  { href: "/sku", label: "SKU" },
  { href: "/methodology", label: "Methodology" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
              <Link
                href="/"
                className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                AIForecast
              </Link>
              <nav>
                <ul className="flex items-center gap-1 text-sm">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link
                href="/login"
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Войти
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
            {children}
          </main>

          <footer className="border-t border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto w-full max-w-6xl px-6 text-xs text-zinc-500 dark:text-zinc-400">
              AIForecast · MVP · AI-прогнозирование запасов лекарственных средств
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
