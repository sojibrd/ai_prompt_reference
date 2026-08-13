import Link from "next/link";
import Markdown from "./Markdown";
import { getDoc, getNeighbours, href, type Doc } from "../lib/content";

function NeighbourLink({ doc, direction }: { doc: Doc; direction: "prev" | "next" }) {
  return (
    <Link
      href={href(doc.slug)}
      className="glass-panel flex-1 rounded-xl px-4 py-3 transition-colors hover:border-[var(--primary)]"
    >
      <div className="text-xs text-[var(--muted)]">
        {direction === "prev" ? "← আগের" : "পরের →"}
      </div>
      <div className="mt-0.5 text-sm font-medium">{doc.title}</div>
    </Link>
  );
}

export default function DocPage({ slug }: { slug: string[] }) {
  const doc = getDoc(slug);
  if (!doc) return null;

  const { prev, next } = getNeighbours(slug);

  return (
    <article className="pb-8">
      <Markdown content={doc.content} base={doc.slug} />

      {(prev || next) && (
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          {prev && <NeighbourLink doc={prev} direction="prev" />}
          {next && <NeighbourLink doc={next} direction="next" />}
        </div>
      )}
    </article>
  );
}
