export type CmsResponse<T> = {
  status: boolean;
  data: T | null;
  message: string | null;
};

export type PortfolioLink = {
  label: string;
  url: string;
};

export type PortfolioIdentity = {
  name: string;
  email: string;
  github_url: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  period: string;
  /** Markdown. renderMarkdown()으로 변환해서 쓴다(홈 데이터 조립 시 summaryHtml로). */
  summary: string;
  stack: string[];
  /** Markdown 불릿 리스트(`- 항목` 줄바꿈). 예전 highlights: string[]을 대체(2026-09). */
  highlights_markdown: string;
  links: PortfolioLink[];
};

export type PortfolioCareerCompany = {
  company: string;
  period: string;
  employment_type: string;
  role: string;
  position: string;
  /** 회사별 세부 경력을 통째로 담는 Markdown. 예전 items: PortfolioCareerItem[]을 대체(2026-09). */
  career_items_markdown: string;
};

export type PortfolioCareerSection = {
  summary_label: string;
  summary_value: string;
  companies: PortfolioCareerCompany[];
};

export type PortfolioTechStackItem = {
  name: string;
  icon_url: string;
};

export type PortfolioIntroSection = {
  content: string;
  tech_stack: PortfolioTechStackItem[];
};

export type PortfolioDocument = {
  slug: string;
  version: number;
  identity: PortfolioIdentity;
  featured_projects: PortfolioProject[];
  career?: PortfolioCareerSection;
  intro?: PortfolioIntroSection;
};

export type PortfolioResponse = {
  portfolio_id: number;
  slug: string;
  content: PortfolioDocument;
  created_at: string;
  updated_at: string;
};

export type TagWithCategory = {
  tag: string;
  category: string;
};

export type PostItem = {
  post_id: string;
  title: string;
  description: string;
  published_at: string;
  tags: TagWithCategory[];
  status: string;
};

export type PostDetail = {
  post_id: string;
  title: string;
  description: string;
  published_at: string;
  tags: TagWithCategory[];
  content: string;
  status: string;
};

type PostsResponse = {
  posts: PostItem[];
};

function getApiBaseUrl() {
  return (process.env.CMS_API_BASE_URL ?? "https://tyange.com/api/cms").replace(/\/$/, "");
}

async function fetchCms<T>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    // Static export should resolve CMS content during the build.
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`CMS API ${response.status}: ${path}`);
  }

  return (await response.json()) as CmsResponse<T>;
}

export async function getPortfolio() {
  const response = await fetchCms<PortfolioResponse>("/portfolio");
  return response.data;
}

export async function getDevPosts() {
  const response = await fetchCms<PostsResponse>("/posts/search-with-tags?include=dev");
  return response.data?.posts ?? [];
}

export async function getPost(postId: string) {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/post/${postId}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as PostDetail;
}
