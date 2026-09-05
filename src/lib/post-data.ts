import { getPost } from "./cms-api";
import { renderMarkdown } from "./markdown";

export type PostData = {
  post: Awaited<ReturnType<typeof getPost>>;
  html: string | null;
};

// src/routes/api/posts/[id].json.ts와 src/routes/posts/[id].tsx의 서버 사이드
// 분기 양쪽에서 같은 로직을 쓰기 위해 분리했다 — 자세한 이유는 두 파일의 주석 참고.
export async function getPostData(id: string): Promise<PostData> {
  const post = await getPost(id);
  if (!post) return { post: null, html: null };
  const html = await renderMarkdown(post.content, { shiki: true });
  return { post, html };
}
