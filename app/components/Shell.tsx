"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "../lib/content";

function NavLinks({ nav, onNavigate }: { nav: Category[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = pathname.replace(/^\/|\/$/g, "");

  return (
    <nav className="flex flex-col gap-5">
      <Link
        href="/"
        onClick={onNavigate}
        aria-current={current === ""}
        className="row block px-2.5 py-1.5 text-sm"
      >
        ভূমিকা
      </Link>

      {nav.map((category) => {
        const categorySlug = category.slug.join("/");
        return (
          <div key={categorySlug} className="flex flex-col gap-1">
            <Link
              href={`/${categorySlug}/`}
              onClick={onNavigate}
              aria-current={current === categorySlug}
              className="row block px-2.5 py-1.5"
            >
              <span className="t-label">{category.title}</span>
            </Link>
            <div className="seam-l ml-3 flex flex-col gap-0.5 pl-2">
              {category.topics.map((topic) => {
                const topicSlug = topic.slug.join("/");
                return (
                  <Link
                    key={topicSlug}
                    href={`/${topicSlug}/`}
                    onClick={onNavigate}
                    aria-current={current === topicSlug}
                    className="row block px-2.5 py-1.5 text-sm leading-snug"
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
      <header className="surface-panel seam-b-heavy sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="মেনু"
            className="control control--quiet px-2.5 py-1.5 lg:hidden"
          >
            ☰
          </button>
          <Link href="/" className="t-title text-sm">
            প্রম্পট ইঞ্জিনিয়ারিং স্ট্যান্ডার্ড
          </Link>
          <a
            href="https://github.com/sojibrd/ai_prompt_reference"
            target="_blank"
            rel="noreferrer"
            className="control control--quiet ml-auto px-2.5 py-1.5 text-xs"
          >
            GitHub
          </a>
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
            className="overlay absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="drawer-enter surface-panel absolute inset-y-0 left-0 w-72 overflow-y-auto rounded-none border-y-0 border-l-0 p-4">
            <NavLinks nav={nav} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
