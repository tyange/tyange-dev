import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(
  content: string,
  options?: { shiki?: boolean },
) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize);

  if (options?.shiki) {
    processor.use(rehypeShiki, { theme: "dark-plus" });
  }

  const result = await processor.use(rehypeStringify).process(content);

  return String(result);
}
