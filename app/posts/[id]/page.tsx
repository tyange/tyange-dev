import { getDevPosts, getPost } from "@/lib/cms-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";

async function renderMarkdown(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, { theme: "dark-plus" })
    .use(rehypeStringify)
    .process(content);

  return String(result);
}

export async function generateStaticParams() {
  const devPosts = await getDevPosts();
  return devPosts.map((post) => ({ id: post.post_id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const html = await renderMarkdown(post.content);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <article className="prose prose-neutral max-w-none">
          <header className="not-prose mb-8 border-b border-black/10 pb-4">
            <div className="mb-4">
              <time className="text-sm text-black/50">{post.published_at}</time>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-[-0.05em] text-black">
              {post.title}
            </h1>
            <p className="text-xl text-black/70">{post.description}</p>
          </header>

          <div dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="not-prose mt-8 border-t border-black/10 pt-8">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={`${tag.category}-${tag.tag}`}
                    className="rounded-full bg-black/5 px-3 py-1 text-sm text-black/80"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-black/48 transition hover:text-black"
              >
                &larr; 돌아가기
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
