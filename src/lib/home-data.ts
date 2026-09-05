import { getDevPosts, getPortfolio } from "./cms-api";
import { renderMarkdown } from "./markdown";

export type HomeData = {
  portfolio: Awaited<ReturnType<typeof getPortfolio>>;
  devPosts: Awaited<ReturnType<typeof getDevPosts>>;
  introHtml: string | null;
};

// src/routes/api/home.json.ts(빌드 시 정적 JSON으로 구워짐)와
// src/routes/index.tsx의 서버 사이드 분기(프리렌더 시 직접 호출) 양쪽에서
// 같은 로직을 쓰기 위해 분리했다 — 자세한 이유는 두 파일의 주석 참고.
export async function getHomeData(): Promise<HomeData> {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);
  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  const introHtml = portfolioData?.content.intro?.content
    ? await renderMarkdown(portfolioData.content.intro.content)
    : null;
  return {
    portfolio: portfolioData,
    devPosts: posts.status === "fulfilled" ? posts.value : [],
    introHtml,
  };
}
