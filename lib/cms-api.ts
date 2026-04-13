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
  blog_url?: string | null;
  velog_url?: string | null;
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
  featured_projects: PortfolioProject[];
  career?: PortfolioCareerSection;
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
