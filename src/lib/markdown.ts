import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// AGENTS.md "데이터 페칭" 참고: 이 함수는 서버(프리렌더)와 브라우저(클라이언트 사이드
// 이동 시 정적 API 라우트 안) 양쪽에서 호출된다. shiki의 기본 oniguruma 엔진은 WASM을
// fetch로 불러오는데, createJavaScriptRegexEngine은 WASM 없이 순수 JS 정규식으로
// 동작해 두 환경 모두에서 안전하다 — 실제 크래시 원인은 따로(tyange-cms-api의 Origin
// 차단) 있었지만, WASM fetch에 의존하지 않는 편이 여러 배포 환경에서 더 견고하므로
// 이 엔진을 유지한다. langs도 지금까지 쓰인 언어(typescript/javascript)로 좁혀
// 불필요한 문법 청크를 줄이고, 목록에 없는 언어가 나오면 fallbackLanguage로 도망가게
// 해 예상 못한 언어가 와도 죽지 않게 한다.
const shikiEngine = createJavaScriptRegexEngine();

export async function renderMarkdown(content: string, options?: { shiki?: boolean }) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize);

  if (options?.shiki) {
    processor.use(rehypeShiki, {
      theme: "dark-plus",
      engine: shikiEngine,
      langs: ["typescript", "javascript", "tsx", "jsx", "bash", "json", "css", "html", "yaml"],
      fallbackLanguage: "text",
    });
  }

  const result = await processor.use(rehypeStringify).process(content);

  return String(result);
}
