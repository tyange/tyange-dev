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
  role: string;
  location: string;
  availability: string;
  email: string;
  github_url: string;
  blog_url: string;
  velog_url?: string | null;
};

export type PortfolioHero = {
  eyebrow: string;
  headline: string;
  summary: string;
  primary_cta: PortfolioLink;
  secondary_cta: PortfolioLink;
};

export type PortfolioHighlightCard = {
  label: string;
  title: string;
};

export type PortfolioMetric = {
  value: string;
  unit: string;
  description: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  period: string;
  summary: string;
  stack: string[];
  highlights: string[];
  links: PortfolioLink[];
};

export type PortfolioAbout = {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  services: string[];
  strengths: string[];
};

export type PortfolioWritingSection = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PortfolioCurrentItem = {
  name: string;
  summary: string;
  stack: string[];
};

export type PortfolioCareerItem = {
  title: string;
  period?: string | null;
  bullets: string[];
};

export type PortfolioCareerCompany = {
  company: string;
  period: string;
  employment_type: string;
  role: string;
  position: string;
  items: PortfolioCareerItem[];
};

export type PortfolioCareerSection = {
  summary_label: string;
  summary_value: string;
  companies: PortfolioCareerCompany[];
};

export type PortfolioDocument = {
  slug: string;
  version: number;
  identity: PortfolioIdentity;
  hero: PortfolioHero;
  highlight_cards: PortfolioHighlightCard[];
  metrics?: PortfolioMetric[];
  guiding_principle: string;
  featured_projects: PortfolioProject[];
  about: PortfolioAbout;
  writing: PortfolioWritingSection;
  career?: PortfolioCareerSection;
  currently_building?: PortfolioCurrentItem[];
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

type PostsResponse = {
  posts: PostItem[];
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_TYANGE_CMS_API_BASE ??
    process.env.CMS_API_BASE_URL ??
    "https://tyange.com/api/cms"
  ).replace(/\/$/, "");
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
