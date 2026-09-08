import type {
  PortfolioCareerCompany,
  PortfolioCareerSection,
  PortfolioDocument,
  PortfolioProject,
} from "./cms-api";
import { getDevPosts, getPortfolio } from "./cms-api";
import { renderMarkdown } from "./markdown";

// featured_projects[].body_markdown, career.companies[].career_items_markdown은
// intro.content와 마찬가지로 markdown 문자열이다(2026-09, tyange-cms-api 쪽 스키마 변경에
// 맞춤) — 여기서 renderMarkdown()으로 HTML을 미리 구워 *Html 필드로 붙여서 내려보낸다.
export type RenderedPortfolioProject = PortfolioProject & {
  bodyHtml: string;
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
  const bodyHtml = await renderMarkdown(project.body_markdown ?? "");
  return { ...project, bodyHtml };
}

async function renderCareerCompany(
  company: PortfolioCareerCompany,
): Promise<RenderedPortfolioCareerCompany> {
  const careerItemsHtml = await renderMarkdown(company.career_items_markdown ?? "");
  return { ...company, careerItemsHtml };
}

// period 문자열("2026.08 ~", "2022.08 - 2025.12" 등)에서 시작 연·월을 뽑아
// 비교 가능한 정수(YYYYMM)로 만든다. 못 뽑으면 0 → 맨 뒤로 밀린다.
function careerStartOrder(period: string): number {
  const m = period.match(/(\d{4})\s*[.\-/]\s*(\d{1,2})/);
  return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
}

async function renderCareerSection(
  career: PortfolioCareerSection,
): Promise<RenderedPortfolioCareerSection> {
  // CMS에 입력된 순서와 무관하게 시작 시점이 최근인 회사부터 정렬한다.
  // sort는 안정 정렬이라 시작 연·월이 같으면 원래 순서를 유지한다.
  const ordered = [...career.companies].sort(
    (a, b) => careerStartOrder(b.period) - careerStartOrder(a.period),
  );
  const companies = await Promise.all(ordered.map(renderCareerCompany));
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
