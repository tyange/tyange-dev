import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { getDevPosts, getPortfolio, type PortfolioProject } from "@/lib/cms-api";
import { renderMarkdown } from "@/lib/markdown";
import { siGithub } from "simple-icons";

function SectionLabel(props: { title: string; description?: string }) {
  return (
    <div class="space-y-2">
      <h2 class="text-2xl font-bold tracking-[-0.05em] text-black">{props.title}</h2>
      {props.description ? (
        <p class="max-w-xs text-sm leading-7 text-black/56">{props.description}</p>
      ) : null}
    </div>
  );
}

function isGitHubRepositoryLink(label: string, url: string) {
  return label === "저장소" && url.includes("github.com");
}

function isVisibleProjectLink(label: string) {
  return label !== "서비스";
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current">
      <path d={siGithub.path} />
    </svg>
  );
}

function ProjectCardLinks(props: { project: PortfolioProject }) {
  const visibleLinks = () => props.project.links.filter((link) => isVisibleProjectLink(link.label));
  return (
    <div class="flex gap-1">
      <For each={visibleLinks()}>
        {(link) => (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center rounded-full p-2 text-black/36 transition hover:text-black/64"
            aria-label={isGitHubRepositoryLink(link.label, link.url) ? "GitHub 저장소" : link.label}
          >
            {isGitHubRepositoryLink(link.label, link.url) ? (
              <>
                <GitHubIcon />
                <span class="sr-only">{link.label}</span>
              </>
            ) : (
              <span class="text-xs">{link.label}</span>
            )}
          </a>
        )}
      </For>
    </div>
  );
}

const fetchHomeData = query(async () => {
  "use server";
  const [portfolio, posts] = await Promise.allSettled([getPortfolio(), getDevPosts()]);
  const portfolioData = portfolio.status === "fulfilled" ? portfolio.value : null;
  // renderMarkdown(unified/remark/rehype)은 여기(서버 전용 query)에서만 호출한다 —
  // 클라이언트 번들에 마크다운 파이프라인이 섞여 들어가지 않게 하기 위함.
  const introHtml = portfolioData?.content.intro?.content
    ? await renderMarkdown(portfolioData.content.intro.content)
    : null;
  return {
    portfolio: portfolioData,
    devPosts: posts.status === "fulfilled" ? posts.value : [],
    introHtml,
  };
}, "home");

export const route = {
  preload: () => fetchHomeData(),
} satisfies RouteDefinition;

export default function Home() {
  const data = createAsync(() => fetchHomeData());

  return (
    <Show
      when={data()}
      fallback={
        <main class="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] sm:px-10 lg:px-12">
          <div class="mx-auto max-w-3xl space-y-3">
            <h1 class="text-2xl font-bold tracking-[-0.05em] text-black">불러오는 중…</h1>
          </div>
        </main>
      }
    >
      {(d) => (
        <HomeContent portfolio={d().portfolio} devPosts={d().devPosts} introHtml={d().introHtml} />
      )}
    </Show>
  );
}

function HomeContent(props: {
  portfolio: Awaited<ReturnType<typeof getPortfolio>>;
  devPosts: Awaited<ReturnType<typeof getDevPosts>>;
  introHtml: string | null;
}) {
  const content = () => props.portfolio?.content;

  return (
    <Show
      when={content()}
      fallback={
        <main class="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] sm:px-10 lg:px-12">
          <div class="mx-auto max-w-3xl space-y-3">
            <h1 class="text-2xl font-bold tracking-[-0.05em] text-black">
              포트폴리오 데이터를 불러오지 못했습니다.
            </h1>
            <p class="text-sm leading-7 text-black/56">
              `tyange-cms-api`의 `/portfolio` 응답을 확인한 뒤 다시 배포해 주세요.
            </p>
          </div>
        </main>
      }
    >
      {(c) => <HomeBody content={c()} devPosts={props.devPosts} introHtml={props.introHtml} />}
    </Show>
  );
}

function HomeBody(props: {
  content: NonNullable<NonNullable<Awaited<ReturnType<typeof getPortfolio>>>["content"]>;
  devPosts: Awaited<ReturnType<typeof getDevPosts>>;
  introHtml: string | null;
}) {
  const content = props.content;
  const devPosts = props.devPosts;
  const introHtml = props.introHtml;
  const careerProfile = content.career;

  // Hero: featured_projects 배열의 첫 프로젝트(= CMS의 1순위)를 풀폭으로 크게 보여준다.
  // 즉 큰 카드는 CMS에서 순서만 바꿔 제어한다(과거의 slug "inert" 고정 방식 대체).
  const hero = content.featured_projects[0] ?? null;
  const heroSlug = hero?.slug;

  const projectMap = new Map(content.featured_projects.map((p) => [p.slug, p]));
  // Hero로 뽑힌 프로젝트는 아래 그룹/폴백에서 중복 렌더되지 않도록 제외한다.
  const pickGrouped = (slug: string) => (slug === heroSlug ? undefined : projectMap.get(slug));
  const cms = pickGrouped("tyange-cms");
  const cmsApi = pickGrouped("tyange-cms-api");
  const blogProject = pickGrouped("tyange-blog");
  const devProject = pickGrouped("tyange-dev");
  const dashboardProject = pickGrouped("tyange-dashboard");
  const personalSites = [blogProject, devProject, dashboardProject].filter(
    (p): p is PortfolioProject => p != null,
  );
  const groupedSlugs = new Set([
    "tyange-cms",
    "tyange-cms-api",
    "tyange-blog",
    "tyange-dev",
    "tyange-dashboard",
  ]);
  const otherProjects = content.featured_projects.filter(
    (p) => p.slug !== heroSlug && !groupedSlugs.has(p.slug),
  );

  const introTechStack = content.intro?.tech_stack ?? [];

  return (
    <>
      <main class="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
          <header>
            <div class="mx-auto flex w-full max-w-6xl items-center px-6 py-5 sm:px-10 lg:px-12">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.05rem] text-black/86">
                <span class="font-medium">{content.identity.name}</span>
                <span class="text-black/16">|</span>
                <a
                  href={content.identity.github_url}
                  target="_blank"
                  rel="noreferrer"
                  class="transition hover:text-black"
                >
                  GitHub
                </a>
                <span class="text-black/16">|</span>
                <a href={`mailto:${content.identity.email}`} class="transition hover:text-black">
                  {content.identity.email}
                </a>
              </div>
            </div>
          </header>

          <div class="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
            {/* ── Intro ── */}
            <section class="w-full pt-16 pb-20">
              {introHtml ? (
                <div
                  class="prose prose-neutral max-w-3xl break-keep prose-p:text-[1.625rem] prose-p:font-bold prose-p:leading-[1.45] prose-p:tracking-[-0.03em] prose-p:text-black sm:prose-p:text-[2rem] lg:prose-p:text-[2.25rem]"
                  // rehype-sanitize를 통과한 뒤의 HTML만 여기 들어온다(fetchHomeData 참고)
                  // eslint-disable-next-line solid/no-innerhtml
                  innerHTML={introHtml}
                />
              ) : (
                <h1 class="max-w-2xl text-[1.625rem] font-bold leading-[1.45] tracking-[-0.03em] text-black sm:text-[2rem] lg:text-[2.25rem]">
                  여기에 인트로 텍스트가 들어갑니다.
                </h1>
              )}

              {introTechStack.length > 0 && (
                <div class="mt-10 flex flex-wrap items-center gap-5">
                  {introTechStack.map((item) => (
                    <span
                      class="flex items-center gap-2 text-sm text-black/70 transition hover:text-black"
                      title={item.name}
                    >
                      {item.icon_url && (
                        <img
                          src={item.icon_url}
                          alt={item.name}
                          width={20}
                          height={20}
                          class="h-5 w-5 shrink-0 object-contain"
                        />
                      )}
                      <span class="hidden sm:inline">{item.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section class="pb-12">
              {careerProfile ? (
                <>
                  <div class="max-w-[64rem]">
                    <div class="flex items-baseline gap-3 text-black">
                      <p class="text-2xl font-bold tracking-[-0.05em]">
                        {careerProfile.summary_label}
                      </p>
                      <p class="text-sm text-black/48">{careerProfile.summary_value}</p>
                    </div>
                  </div>

                  <div class="mt-8 max-w-[64rem]">
                    <div class="space-y-10">
                      {careerProfile.companies.map((company) => (
                        <section class="min-w-0 space-y-2">
                          <h1 class="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                            {company.company}
                          </h1>
                          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-black/48">
                            <span>{company.period}</span>
                            <span>{company.employment_type}</span>
                            <span>{company.role}</span>
                            {company.position ? <span>{company.position}</span> : null}
                          </div>

                          <div class="mt-6 divide-y divide-black/[0.06] pl-5 sm:pl-8">
                            {company.items.map((item) => (
                              <section class="space-y-2 py-5 first:pt-0 last:pb-0">
                                <h2 class="text-[1.05rem] font-bold tracking-[-0.02em] text-black">
                                  {item.title}
                                </h2>
                                {item.period ? (
                                  <p class="text-sm font-medium text-black/48">{item.period}</p>
                                ) : null}
                                <div class="space-y-2 pt-1">
                                  {item.bullets.map((bullet) => (
                                    <p class="max-w-4xl pl-4 text-sm leading-7 text-black/62">
                                      - {bullet}
                                    </p>
                                  ))}
                                </div>
                              </section>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </section>

            <section id="work" class="pb-14">
              <h2 class="mb-8 text-2xl font-bold tracking-[-0.05em] text-black">작업</h2>

              <div class="space-y-4">
                {/* Hero: featured_projects[0] — full width */}
                {hero && (
                  <article class="rounded-2xl border border-black/6 bg-white/40 p-8 lg:p-10">
                    <h3 class="text-3xl font-bold tracking-[-0.06em] text-black">{hero.title}</h3>
                    <p class="mt-2 text-sm text-black/48">{hero.period}</p>

                    <p class="mt-5 max-w-3xl text-sm leading-7 text-black/62">{hero.summary}</p>

                    {hero.highlights.length > 0 && (
                      <ul class="mt-5 space-y-2.5">
                        {hero.highlights.map((h) => (
                          <li class="flex gap-2.5 text-sm leading-6 text-black/56">
                            <span class="shrink-0 text-black/20">—</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div class="mt-8 flex flex-wrap items-center gap-3">
                      {hero.links
                        .filter((link) => isVisibleProjectLink(link.label))
                        .map((link) => (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            class="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm text-black/64 transition hover:bg-black/4 hover:text-black"
                          >
                            {link.label}
                            <span class="text-[0.65rem]">↗</span>
                          </a>
                        ))}
                    </div>

                    <div class="mt-6 flex flex-wrap gap-2">
                      {hero.stack.map((tag) => (
                        <span class="rounded-full bg-black/4 px-3 py-1.5 text-xs text-black/48">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                )}

                {/* Two groups below — side by side */}
                <div class="grid gap-4 lg:grid-cols-2">
                  {/* CMS System Group */}
                  {(cms || cmsApi) && (
                    <div class="rounded-2xl border border-black/6 bg-white/40 p-7">
                      <div class="mb-5">
                        <h3 class="text-lg font-bold tracking-[-0.03em] text-black">CMS 시스템</h3>
                        <p class="mt-1 text-sm text-black/48">
                          블로그를 구동하는 콘텐츠 관리 시스템
                        </p>
                      </div>
                      <div class="grid gap-3 sm:grid-cols-2">
                        {[cms, cmsApi]
                          .filter((p): p is PortfolioProject => p != null)
                          .map((project) => (
                            <article class="rounded-xl bg-black/2 p-5 transition-colors duration-200 hover:bg-black/5">
                              <div class="flex items-start justify-between">
                                <h4 class="font-bold tracking-[-0.02em] text-black">
                                  {project.title}
                                </h4>
                                <ProjectCardLinks project={project} />
                              </div>
                              <p class="mt-1 text-xs text-black/44">{project.period}</p>
                              <p class="mt-3 text-sm leading-6 text-black/58">{project.summary}</p>
                              <div class="mt-4 flex flex-wrap gap-1.5">
                                {project.stack.map((tag) => (
                                  <span class="rounded-full bg-black/4 px-2.5 py-1 text-[0.6875rem] text-black/44">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </article>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Personal Sites Group */}
                  {personalSites.length > 0 && (
                    <div class="rounded-2xl border border-black/6 bg-white/40 p-7">
                      <div class="mb-5">
                        <h3 class="text-lg font-bold tracking-[-0.03em] text-black">개인 사이트</h3>
                        <p class="mt-1 text-sm text-black/48">블로그, 포트폴리오, 운영 대시보드</p>
                      </div>
                      <div class="space-y-3">
                        {personalSites.map((project) => (
                          <article class="rounded-xl bg-black/2 p-5 transition-colors duration-200 hover:bg-black/5">
                            <div class="flex items-start justify-between gap-2">
                              <div class="min-w-0">
                                <h4 class="font-bold tracking-[-0.02em] text-black">
                                  {project.title}
                                </h4>
                                <p class="mt-1 text-xs text-black/44">{project.period}</p>
                              </div>
                              <ProjectCardLinks project={project} />
                            </div>
                            <div class="mt-3 flex flex-wrap gap-1.5">
                              {project.stack.map((tag) => (
                                <span class="rounded-full bg-black/4 px-2.5 py-1 text-[0.6875rem] text-black/44">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fallback */}
                {otherProjects.length > 0 && (
                  <div class="grid gap-4 lg:grid-cols-2">
                    {otherProjects.map((project) => (
                      <article class="flex flex-col rounded-2xl border border-black/6 bg-white/40 p-7">
                        <div class="flex items-start justify-between">
                          <div>
                            <h3 class="text-lg font-bold tracking-[-0.03em] text-black">
                              {project.title}
                            </h3>
                            <p class="mt-1 text-sm text-black/48">{project.period}</p>
                          </div>
                          <ProjectCardLinks project={project} />
                        </div>
                        <p class="mt-3 text-sm leading-7 text-black/62">{project.summary}</p>
                        <div class="mt-auto flex flex-wrap gap-2 pt-5">
                          {project.stack.map((tag) => (
                            <span class="rounded-full bg-black/4 px-3 py-1.5 text-xs text-black/48">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section
              id="writing"
              class={`grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] ${devPosts.length > 0 ? "pb-14" : "pb-0"}`}
            >
              <SectionLabel title="기록" />
              <div class="divide-y divide-black/[0.06]">
                {devPosts.length > 0 ? (
                  devPosts.map((post) => (
                    <div class="group cursor-pointer py-5 first:pt-0">
                      <a class="space-y-1.5" href={`/posts/${post.post_id}`}>
                        <h3 class="text-[1.1rem] font-bold tracking-[-0.04em] text-black transition group-hover:text-black/72">
                          {post.title}
                        </h3>
                        <p class="max-w-2xl text-sm leading-7 text-black/54">{post.description}</p>
                      </a>
                    </div>
                  ))
                ) : (
                  <div class="py-3 text-sm leading-7 text-black/56">
                    CMS API에서 `dev` 태그 글을 아직 찾지 못했습니다.
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
    </>
  );
}
