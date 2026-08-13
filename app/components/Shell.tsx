"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "../lib/content";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="থিম পরিবর্তন"
      className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}

function NavLinks({ nav, onNavigate }: { nav: Category[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = pathname.replace(/^\/|\/$/g, "");

  const linkClass = (slug: string) =>
    [
      "block rounded-lg px-3 py-1.5 text-sm transition-colors",
      current === slug
        ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
        : "text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--foreground)]",
    ].join(" ");

  return (
    <nav className="space-y-6">
      <Link href="/" onClick={onNavigate} className={linkClass("")}>
        ভূমিকা
      </Link>

      {nav.map((category) => {
        const categorySlug = category.slug.join("/");
        return (
          <div key={categorySlug} className="space-y-1">
            <Link
              href={`/${categorySlug}/`}
              onClick={onNavigate}
              className={`${linkClass(categorySlug)} !font-semibold !text-[var(--foreground)] ${
                current === categorySlug ? "bg-[var(--primary-soft)]" : ""
              }`}
            >
              {category.title}
            </Link>
            <div className="ml-3 space-y-0.5 border-l border-[var(--card-border)] pl-2">
              {category.topics.map((topic) => {
                const topicSlug = topic.slug.join("/");
                return (
                  <Link
                    key={topicSlug}
                    href={`/${topicSlug}/`}
                    onClick={onNavigate}
                    className={linkClass(topicSlug)}
                  >
                    {topic.title}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export default function Shell({
  nav,
  children,
}: {
  nav: Category[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-panel border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="মেনু"
            className="rounded-lg px-2.5 py-1.5 text-[var(--muted)] hover:bg-[var(--primary-soft)] lg:hidden"
          >
            ☰
          </button>
          <Link href="/" className="font-semibold">
            প্রম্পট ইঞ্জিনিয়ারিং স্ট্যান্ডার্ড
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <a
              href="https://github.com/sojibrd/ai_prompt_reference"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
            >
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto py-8 lg:block">
          <NavLinks nav={nav} />
        </aside>

        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="animate-slide-in-left glass-panel absolute inset-y-0 left-0 w-72 overflow-y-auto p-4">
            <NavLinks nav={nav} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
