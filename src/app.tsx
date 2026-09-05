import { MetaProvider, Title, Meta } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      // 이 사이트엔 클라이언트 사이드 전환으로 지킬 공유 상태가 없고, 데이터는
      // query()의 "use server" 경계 뒤에 있어 서버 없는 정적 배포에서는 클라이언트
      // 사이드 재탐색이 애초에 불가능하다(RPC를 받아줄 서버가 없음). explicitLinks로
      // 평범한 <a href>가 라우터에 가로채이지 않고 항상 진짜 페이지 이동을 하게 한다.
      explicitLinks
      root={(props) => (
        <MetaProvider>
          <Title>유태양 | Frontend Developer</Title>
          <Meta
            name="description"
            content="차분한 인터페이스와 구조적인 프론트엔드 작업을 담은 개발자 포트폴리오."
          />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
