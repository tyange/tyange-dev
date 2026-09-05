import { getHomeData } from "@/lib/home-data";

// 이 라우트는 두 곳에서 쓰인다:
// 1) 빌드 시 nitro가 vite.config.ts의 prerender.routes 목록에 따라 이 경로를
//    실제로 GET 요청해 응답을 .output/public/api/home.json 정적 파일로 굽는다
//    (서버 사이드 요청이라 Origin 헤더가 없어 tyange-cms-api를 통과한다).
// 2) 배포된 사이트에서 클라이언트 사이드로 홈으로 이동할 때, 브라우저가 바로 이
//    정적 파일을 fetch한다 — tyange-cms-api를 브라우저가 직접 두드리지 않는다
//    (그 API는 Origin 헤더가 붙은 요청을 전부 403으로 막는다).
export async function GET() {
  return Response.json(await getHomeData());
}
