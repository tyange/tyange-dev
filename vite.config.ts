import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

import { getDevPosts } from "./src/lib/cms-api.ts";

export default defineConfig(async ({ command }) => {
  // 홈이 모든 글로 링크를 걸어 crawlLinks만으로도 대부분 발견되지만, CMS 응답이
  // 비정상일 때 조용히 글 없는 사이트로 빌드되는 걸 막기 위해 Next의
  // generateStaticParams처럼 dev 태그 글 id를 명시적으로도 넣는다.
  // `vite dev`에서는 요청 시 렌더되므로 프리렌더 라우트 계산(CMS 호출)이 필요 없다.
  const devPosts = command === "build" ? await getDevPosts() : [];

  return {
    plugins: [
      solidStart(),
      tailwindcss(),
      nitro({
        // 배포가 SCP로 정적 파일을 nginx에 올리는 방식이라 Node 서버 번들이 필요 없다.
        // nitro@3.0.260610-beta(현재 SolidStart 템플릿 기본값)는 이 옵션 조합에서
        // 서버 번들링 단계가 rolldown SSR 엔트리 오류로 죽는 버그가 있어(빌드는 실패해도
        // .output/public 자체는 정상 생성됨을 확인함) nitro는 3.0.260903-beta 이상으로
        // package.json에 고정한다.
        static: true,
        prerender: {
          routes: [
            "/",
            "/api/home.json",
            ...devPosts.flatMap((post) => [`/posts/${post.post_id}`, `/api/posts/${post.post_id}`]),
          ],
          crawlLinks: true,
          failOnError: true,
        },
      }),
    ],
  };
});
