import type {
  PortfolioCareerCompany,
  PortfolioCareerSection,
  PortfolioDocument,
  PortfolioProject,
} from "./cms-api";
import { getDevPosts, getPortfolio } from "./cms-api";
import { renderMarkdown } from "./markdown";

// featured_projects[].summary/highlights_markdown, career.companies[].career_items_markdown은
// intro.content와 마찬가지로 markdown 문자열이다(2026-09, tyange-cms-api 쪽 스키마 변경에
// 맞춤) — 여기서 renderMarkdown()으로 HTML을 미리 구워 *Html 필드로 붙여서 내려보낸다.
export type RenderedPortfolioProject = PortfolioProject & {
  summaryHtml: string;
  highlightsHtml: string;
};

export type RenderedPortfolioCareerCompany = PortfolioCareerCompany & {
  careerItemsHtml: string;
};

export type RenderedPortfolioCareerSection = Omit<PortfolioCareerSection, "companies"> & {
  companies: RenderedPortfolioCareerCompany[];
};

export type RenderedPortfolioDocument = Omit<PortfolioDocument, "featured_projects" | "career"> & {
  featured_projects: RenderedPortfolioProject[];
  career?: RenderedPortfolioCareerSection;
};

export type RenderedPortfolio = {
  portfolio_id: number;
  slug: string;
  content: RenderedPortfolioDocument;
  created_at: string;
  updated_at: string;
};

export type HomeData = {
  portfolio: RenderedPortfolio | null;
  devPosts: Awaited<ReturnType<typeof getDevPosts>>;
  introHtml: string | null;
};

async function renderProject(project: PortfolioProject): Promise<RenderedPortfolioProject> {
  const [summaryHtml, highlightsHtml] = await Promise.all([
    renderMarkdown(project.summary),
    renderMarkdown(project.highlights_markdown),
  ]);
  return { ...project, summaryHtml, highlightsHtml };
}

async function renderCareerCompany(
  company: PortfolioCareerCompany,
): Promise<RenderedPortfolioCareerCompany> {
  const careerItemsHtml = await renderMarkdown(company.career_items_markdown ?? "");
  return { ...company, careerItemsHtml };
}

async function renderCareerSection(
  career: PortfolioCareerSection,
): Promise<RenderedPortfolioCareerSection> {
  const companies = await Promise.all(career.companies.map(renderCareerCompany));
  return { ...career, companies };
}

// src/routes/api/home.json.ts(빌드 시 정적 JSON으로 구워짐)와
// src/routes/index.tsx의 서버 사이드 분기(프리렌더 시 직접 호출) 양쪽에서
// 같은 로직을 쓰기 위해 분리했다 — 자세한 이유는 두 파일의 주석 참고.
export async function getHomeData(): Promise<HomeData> {
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);
  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;

  const introHtml = portfolioData?.content.intro?.content
    ? await renderMarkdown(portfolioData.content.intro.content)
    : null;

  let renderedPortfolio: RenderedPortfolio | null = null;
  if (portfolioData) {
    const featured_projects = await Promise.all(
      portfolioData.content.featured_projects.map(renderProject),
    );
    const career = portfolioData.content.career
      ? await renderCareerSection(portfolioData.content.career)
      : undefined;

    renderedPortfolio = {
      ...portfolioData,
      content: { ...portfolioData.content, featured_projects, career },
    };
  }

  return {
    portfolio: renderedPortfolio,
    devPosts: posts.status === "fulfilled" ? posts.value : [],
    introHtml,
  };
}
