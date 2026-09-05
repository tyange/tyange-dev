import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { isServer } from "solid-js/web";
import type { PostData } from "@/lib/post-data";

// "use server" 없음 — src/routes/index.tsx의 fetchHomeData와 같은 이유(자세한 맥락은
// 그 파일 주석 참고). 서버(프리렌더)에서는 getPostData()를 직접 호출하고, 브라우저
// (클라이언트 사이드 이동)에서는 구워둔 정적 파일(/api/posts/<id>,
// src/routes/api/posts/[id].ts)을 fetch한다.
// getPostData를 정적 import하면 isServer로 분기해도 unified/rehype/shiki 전체가
// 클라이언트 번들에 딸려 들어간다(확인됨 — 이 라우트로 이동할 때 실제로 다운로드됨).
// 동적 import로 감싸야 그 브랜치가 실행되지 않는 클라이언트에서 진짜로 빠진다.
const fetchPost = query(async (id: string): Promise<PostData> => {
  if (isServer) {
    const { getPostData } = await import("@/lib/post-data");
    return getPostData(id);
  }
  const res = await fetch(`/api/posts/${id}`);
  return res.json();
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
        when={data()?.post}
        fallback={
          <main class="min-h-screen bg-background text-foreground">
            <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
              <p class="text-sm leading-7 text-black/56">글을 찾을 수 없습니다.</p>
              <a
                href="/"
                class="mt-4 inline-flex items-center text-sm text-black/48 hover:text-black"
              >
                &larr; 돌아가기
              </a>
            </div>
          </main>
        }
      >
        {(post) => (
          <main class="min-h-screen bg-background text-foreground">
            <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
              <article class="prose prose-neutral max-w-none">
                <header class="not-prose mb-8 border-b border-black/10 pb-4">
                  <div class="mb-4">
                    <time class="text-sm text-black/50">{post().published_at}</time>
                  </div>
                  <h1 class="mb-4 text-4xl font-bold tracking-[-0.05em] text-black">
                    {post().title}
                  </h1>
                  <p class="text-xl text-black/70">{post().description}</p>
                </header>

                {/* rehype-sanitize를 통과한 뒤의 HTML만 여기 들어온다(fetchPost 참고) */}
                {/* eslint-disable-next-line solid/no-innerhtml */}
                <div innerHTML={data()!.html!} />

                <footer class="not-prose mt-8 border-t border-black/10 pt-8">
                  {post().tags.length > 0 ? (
                    <div class="flex flex-wrap gap-2">
                      {post().tags.map((tag) => (
                        <span class="rounded-full bg-black/5 px-3 py-1 text-sm text-black/80">
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div class="mt-8">
                    <a
                      href="/"
                      class="inline-flex items-center text-sm text-black/48 transition hover:text-black"
                    >
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
