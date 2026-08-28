"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "../lib/content";
import { PanelLeftClose } from "./icons";

interface SidebarProps {
  nav: Category[];
  /** Supplied only in the drawer, where the list needs a way out. */
  onClose?: () => void;
  /** Supplied only on the rail, where the list can be folded away. */
  onCollapse?: () => void;
  onNavigate?: () => void;
}

/**
 * Category -> technique navigation.
 *
 * One component serves both mounts: the permanent desktop rail and the
 * drawer. They differ only in the way out; a second component would have
 * meant two lists drifting apart.
 *
 * One padded column rather than a seamed header over a scroll pane: the
 * header belongs to the list, not to a bar above it.
 */
export default function Sidebar({ nav, onClose, onCollapse, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const current = pathname.replace(/^\/|\/$/g, "");

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-4">
      {/* The brand lives here, not in a top bar: from `lg:` up this column is
          the only chrome on screen. */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 min-w-0"
        >
          <span className="text-xl shrink-0">🧠</span>
          <span className="t-title text-sm truncate">প্রম্পট রেফারেন্স</span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="control control--quiet p-1.5 shrink-0"
            aria-label="সাইডবার বন্ধ করুন"
          >
            ✕
          </button>
        )}

        {onCollapse && (
          <button
            onClick={onCollapse}
            className="control control--quiet p-1.5 shrink-0"
            aria-label="সূচিপত্র লুকান"
            aria-expanded
            aria-controls="site-sidebar"
          >
            <PanelLeftClose />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          onClick={onNavigate}
          aria-current={current === ""}
          className="row block px-2.5 py-1.5 text-xs"
        >
          ভূমিকা
        </Link>

        {nav.map((category) => {
          const categorySlug = category.slug.join("/");

          return (
            <div key={categorySlug} className="topic-group pb-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/${categorySlug}/`}
                  onClick={onNavigate}
                  aria-current={current === categorySlug}
                  className="row block min-w-0 flex-1 px-2.5 py-1.5"
                >
                  <span className="t-strong text-xs truncate">{category.title}</span>
                </Link>
                <span className="chip shrink-0">{category.topics.length}</span>
              </div>

              {category.topics.map((topic) => {
                const topicSlug = topic.slug.join("/");

                return (
                  <Link
                    key={topicSlug}
                    href={`/${topicSlug}/`}
                    onClick={onNavigate}
                    aria-current={current === topicSlug}
                    className="row block px-2.5 py-1.5 text-xs leading-snug"
                  >
                    {topic.title}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
