// Every image dropped into src/projects/ is bundled automatically and can be
// referenced from content.ts by its file name (e.g. image: "nova-ledger.jpg").
const files = import.meta.glob("../projects/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function projectImage(name?: string): string | undefined {
  if (!name) return undefined;
  return files[`../projects/${name}`];
}
