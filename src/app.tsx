import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { Router, useBeforeLeave, useIsRouting, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createEffect } from "solid-js";
import { isServer } from "solid-js/web";
import "./app.css";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => Promise<void> | void) => {
    finished: Promise<void>;
  };
};

// 클라이언트 사이드 라우팅(글 목록 → /posts/:id 등)에 브라우저 네이티브
// View Transitions를 얹어 부드러운 크로스페이드로 전환한다.
// - startViewTransition이 없거나(구형 브라우저) reduced-motion이면 그냥 즉시 이동
// - 첫 로드는 프리렌더된 HTML이라 useBeforeLeave가 안 불려서 영향 없음
// - Solid 라우팅은 Suspense 기반 비동기라, transition 콜백이 반환한 Promise를
//   useIsRouting()이 false로 돌아오는 시점에 resolve해서 DOM 갱신을 기다리게 한다.
//   라우팅이 어떤 이유로든 안 끝나도 멈추지 않도록 2s 타임아웃을 건다.
function usePageTransitions() {
  if (isServer) return;

  const isRouting = useIsRouting();
  let finishTransition: (() => void) | null = null;

  createEffect(() => {
    if (!isRouting() && finishTransition) {
      finishTransition();
    }
  });

  useBeforeLeave((e) => {
    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition || e.defaultPrevented) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    e.preventDefault();
    doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const done = () => {
            clearTimeout(timer);
            finishTransition = null;
            resolve();
          };
          const timer = setTimeout(done, 2000);
          finishTransition = done;
          e.retry(true);
        }),
    );
  });
}

function RouterRoot(props: RouteSectionProps) {
  usePageTransitions();
  return (
    <MetaProvider>
      <Title>유태양 | Frontend Developer</Title>
      <Meta
        name="description"
        content="차분한 인터페이스와 구조적인 프론트엔드 작업을 담은 개발자 포트폴리오."
      />
      <Suspense>{props.children}</Suspense>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={RouterRoot}>
      <FileRoutes />
    </Router>
  );
}
