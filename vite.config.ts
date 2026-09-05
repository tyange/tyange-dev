import { fileURLToPath } from "node:url";
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
    // tsconfig의 "@/*" paths만으로는 부족하다 — nitro@3.0.260903-beta dev 서버가
    // SSR 모듈을 env-runner(NodeWorkerEnvRunner/SelfEnvRunner 등)를 거쳐 fetchModule
    // RPC로 돌리는데, isServer 분기 안 동적 import(`await import("@/lib/home-data")`,
    // src/routes/index.tsx·posts/[id].tsx)가 그 경로를 타면 "@/*" 별칭이 안 풀려
    // "Cannot find module '@/lib/home-data'"로 500이 난다(devServer.runner를
    // "self"로 바꿔도 동일 — 워커냐 아니냐의 문제가 아니라 fetchModule 자체가
    // 별칭을 못 찾는 문제). resolve.alias로 직접 등록하면 어떤 environment를 타든
    // Vite 코어 리졸버가 처리해 통과한다. 정적 import(`@/lib/cms-api` 등)는 이
    // alias 없이도 이미 잘 됐었다 — 동적 import만 걸리는 문제.
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
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
