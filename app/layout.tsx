import type { Metadata } from "next";
import { Noto_Sans_Bengali, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getNav } from "./lib/content";
import Shell from "./components/Shell";

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "প্রম্পট ইঞ্জিনিয়ারিং স্ট্যান্ডার্ড",
  description:
    "প্রম্পট ইঞ্জিনিয়ারিং-এর টেকনিক, প্যাটার্ন আর পরিচিত ফাঁদগুলোর একটা বাংলা রেফারেন্স।",
  other: {
    "theme-color": "#4f46e5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nav = getNav();

  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${bengali.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                var dark = stored ? stored === 'dark'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (dark) document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full">
        <Shell nav={nav}>{children}</Shell>
      </body>
    </html>
  );
}
