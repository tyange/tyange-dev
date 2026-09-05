import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { getPost } from "@/lib/cms-api";
import { renderMarkdown } from "@/lib/markdown";

const fetchPost = query(async (id: string) => {
  "use server";
  const post = await getPost(id);
  if (!post) return null;
  // renderMarkdown(shiki 포함)은 여기(서버 전용 query)에서만 호출한다 — 클라이언트
  // 번들에 unified/shiki 파이프라인이 섞여 들어가지 않게 하기 위함.
  const html = await renderMarkdown(post.content, { shiki: true });
  return { post, html };
}, "post");

export const route = {
  preload: ({ params }) => fetchPost(params.id),
} satisfies RouteDefinition;

export default function PostPage(props: { params: { id: string } }) {
  const data = createAsync(() => fetchPost(props.params.id));

  return (
    <Show
      when={data() !== undefined}
      fallback={
        <main class="min-h-screen bg-background text-foreground">
          <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">불러오는 중…</div>
        </main>
      }
    >
      <Show
        when={data()}
        fallback={
          <main class="min-h-screen bg-background text-foreground">
            <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
              <p class="text-sm leading-7 text-black/56">글을 찾을 수 없습니다.</p>
              <a href="/" class="mt-4 inline-flex items-center text-sm text-black/48 hover:text-black">
                &larr; 돌아가기
              </a>
            </div>
          </main>
        }
      >
        {(d) => (
          <main class="min-h-screen bg-background text-foreground">
            <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
              <article class="prose prose-neutral max-w-none">
                <header class="not-prose mb-8 border-b border-black/10 pb-4">
                  <div class="mb-4">
                    <time class="text-sm text-black/50">{d().post.published_at}</time>
                  </div>
                  <h1 class="mb-4 text-4xl font-bold tracking-[-0.05em] text-black">
                    {d().post.title}
                  </h1>
                  <p class="text-xl text-black/70">{d().post.description}</p>
                </header>

                {/* rehype-sanitize를 통과한 뒤의 HTML만 여기 들어온다(fetchPost 참고) */}
                {/* eslint-disable-next-line solid/no-innerhtml */}
                <div innerHTML={d().html} />

                <footer class="not-prose mt-8 border-t border-black/10 pt-8">
                  {d().post.tags.length > 0 ? (
                    <div class="flex flex-wrap gap-2">
                      {d().post.tags.map((tag) => (
                        <span class="rounded-full bg-black/5 px-3 py-1 text-sm text-black/80">
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div class="mt-8">
                    <a href="/" class="inline-flex items-center text-sm text-black/48 transition hover:text-black">
                      &larr; 돌아가기
                    </a>
                  </div>
                </footer>
              </article>
            </div>
          </main>
        )}
      </Show>
    </Show>
  );
}
