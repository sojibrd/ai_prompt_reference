import fs from "fs";
import path from "path";

const ROOT = process.cwd();

export type Doc = {
  slug: string[];
  title: string;
  content: string;
};

export type Topic = {
  slug: string[];
  title: string;
};

export type Category = {
  slug: string[];
  title: string;
  topics: Topic[];
};

/** Folders that hold the reference content, in reading order. */
function categoryDirs(): string[] {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d\d-/.test(e.name))
    .map((e) => e.name)
    .sort();
}

function topicDirs(category: string): string[] {
  return fs
    .readdirSync(path.join(ROOT, category), { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d\d-/.test(e.name))
    .map((e) => e.name)
    .sort();
}

function readMarkdown(segments: string[]): string {
  return fs.readFileSync(path.join(ROOT, ...segments, "README.md"), "utf8");
}

/** First `# heading` of the file, falling back to a prettified folder name. */
function titleOf(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return fallback.replace(/^\d\d-/, "").replace(/-/g, " ");
}

export function getNav(): Category[] {
  return categoryDirs().map((category) => ({
    slug: [category],
    title: titleOf(readMarkdown([category]), category),
    topics: topicDirs(category).map((topic) => ({
      slug: [category, topic],
      title: titleOf(readMarkdown([category, topic]), topic),
    })),
  }));
}

/** Every page on the site, home first, then categories and their topics. */
export function getAllDocs(): Doc[] {
  const home = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  const docs: Doc[] = [{ slug: [], title: titleOf(home, "Home"), content: home }];

  for (const category of categoryDirs()) {
    const categoryMd = readMarkdown([category]);
    docs.push({
      slug: [category],
      title: titleOf(categoryMd, category),
      content: categoryMd,
    });

    for (const topic of topicDirs(category)) {
      const topicMd = readMarkdown([category, topic]);
      docs.push({
        slug: [category, topic],
        title: titleOf(topicMd, topic),
        content: topicMd,
      });
    }
  }

  return docs;
}

export function getDoc(slug: string[]): Doc | undefined {
  const key = slug.join("/");
  return getAllDocs().find((doc) => doc.slug.join("/") === key);
}

/** Previous/next page in reading order, for the footer links. */
export function getNeighbours(slug: string[]) {
  const docs = getAllDocs();
  const key = slug.join("/");
  const index = docs.findIndex((doc) => doc.slug.join("/") === key);
  return {
    prev: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

export function href(slug: string[]): string {
  return slug.length === 0 ? "/" : `/${slug.join("/")}/`;
}
