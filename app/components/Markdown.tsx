"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/**
 * The markdown files link to each other with repo-relative paths
 * (`01-basic-techniques/`, `../02-reasoning-techniques/`, `README.md`).
 * Turn those into site routes, relative to the page being rendered.
 */
function resolveHref(href: string, base: string[]): string | null {
  if (/^(https?:|mailto:|#)/.test(href)) return null;

  const segments = [...base];
  for (const part of href.split("/")) {
    if (part === "" || part === "." || part === "README.md") continue;
    if (part === "..") segments.pop();
    else segments.push(part);
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}/`;
}

export default function Markdown({
  content,
  base,
}: {
  content: string;
  base: string[];
}) {
  return (
    <div className="doc-prose prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const internal = href ? resolveHref(href, base) : null;
            if (internal) {
              return (
                <Link href={internal} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noreferrer" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
