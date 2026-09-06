import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { Accordion } from "@kobalte/core/accordion";
import { Arrow as TooltipArrow, Tooltip } from "@kobalte/core/tooltip";
import { For, Show } from "solid-js";
import { isServer } from "solid-js/web";
import type { HomeData, RenderedPortfolioProject } from "@/lib/home-data";
import { siGithub } from "simple-icons";

function SectionLabel(props: { title: string; description?: string }) {
  return (
    <div class="space-y-2">
      <h2 class="text-2xl font-bold tracking-[-0.05em] text-tl-fg">{props.title}</h2>
      {props.description ? (
        <p class="max-w-xs text-sm leading-7 text-tl-fg/56">{props.description}</p>
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

function ProjectCardLinks(props: { project: RenderedPortfolioProject }) {
  const visibleLinks = () => props.project.links.filter((link) => isVisibleProjectLink(link.label));
  return (
    <div class="flex gap-1">
      <For each={visibleLinks()}>
        {(link) => (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center rounded-full p-2 text-tl-fg/36 transition hover:text-tl-fg/64"
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

// "use server" 없음 — 이 사이트는 서버 없는 정적 배포라 RPC를 받아줄 곳이 없다.
// 대신 isServer로 직접 분기한다: 서버(프리렌더)에서는 getHomeData()를 직접 호출하고,
// 브라우저(클라이언트 사이드 이동)에서는 그 결과를 구워둔 정적 파일(/api/home.json,
// src/routes/api/home.json.ts)을 fetch한다. tyange-cms-api가 브라우저의 Origin
// 헤더가 붙은 요청을 전부 403으로 막기 때문에 브라우저가 그 API를 직접 부를 수
// 없다 — 반드시 이 정적 파일 경유로만 데이터를 받아야 한다.
// getHomeData를 정적 import하면 isServer로 분기해도 그 안의 renderMarkdown이
// 클라이언트 번들에 딸려 들어간다(src/routes/posts/[id].tsx와 같은 문제) — 동적
// import로 감싸 클라이언트에서 실제로 빠지게 한다.
const fetchHomeData = query(async (): Promise<HomeData> => {
  if (isServer) {
    const { getHomeData } = await import("@/lib/home-data");
    return getHomeData();
  }
  const res = await fetch("/api/home.json");
  return res.json();
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
        <main class="min-h-screen bg-tl-bg px-6 py-16 text-tl-fg sm:px-10 lg:px-12">
          <div class="mx-auto max-w-3xl space-y-3">
            <h1 class="text-2xl font-bold tracking-[-0.05em] text-tl-fg">불러오는 중…</h1>
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

function HomeContent(props: HomeData) {
  const content = () => props.portfolio?.content;

  return (
    <Show
      when={content()}
      fallback={
        <main class="min-h-screen bg-tl-bg px-6 py-16 text-tl-fg sm:px-10 lg:px-12">
          <div class="mx-auto max-w-3xl space-y-3">
            <h1 class="text-2xl font-bold tracking-[-0.05em] text-tl-fg">
              포트폴리오 데이터를 불러오지 못했습니다.
            </h1>
            <p class="text-sm leading-7 text-tl-fg/56">
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
  content: NonNullable<HomeData["portfolio"]>["content"];
  devPosts: HomeData["devPosts"];
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
    (p): p is RenderedPortfolioProject => p != null,
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
      <main class="min-h-screen bg-tl-bg text-tl-fg">
        <header>
          <div class="mx-auto flex w-full max-w-6xl items-center px-6 py-5 sm:px-10 lg:px-12">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.05rem] text-tl-fg/86">
              <span class="font-medium">{content.identity.name}</span>
              <span class="text-tl-fg/16">|</span>
              <a
                href={content.identity.github_url}
                target="_blank"
                rel="noreferrer"
                class="transition hover:text-tl-fg"
              >
                GitHub
              </a>
              <span class="text-tl-fg/16">|</span>
              <a href={`mailto:${content.identity.email}`} class="transition hover:text-tl-fg">
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
                class="prose prose-neutral dark:prose-invert max-w-3xl break-keep prose-p:text-[1.625rem] prose-p:font-bold prose-p:leading-[1.45] prose-p:tracking-[-0.03em] prose-p:text-tl-fg sm:prose-p:text-[2rem] lg:prose-p:text-[2.25rem]"
                // rehype-sanitize를 통과한 뒤의 HTML만 여기 들어온다(fetchHomeData 참고)
                // eslint-disable-next-line solid/no-innerhtml
                innerHTML={introHtml}
              />
            ) : (
              <h1 class="max-w-2xl text-[1.625rem] font-bold leading-[1.45] tracking-[-0.03em] text-tl-fg sm:text-[2rem] lg:text-[2.25rem]">
                여기에 인트로 텍스트가 들어갑니다.
              </h1>
            )}

            {introTechStack.length > 0 && (
              <div class="mt-10 flex flex-wrap items-center gap-5">
                {introTechStack.map((item) => (
                  <Tooltip openDelay={200}>
                    <Tooltip.Trigger
                      as="span"
                      class="flex items-center gap-2 text-sm text-tl-fg/70 transition hover:text-tl-fg"
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
                    </Tooltip.Trigger>
                    {/* 모바일(sm 미만)은 이름이 숨겨지고 아이콘만 보이는데, 툴팁은 hover
                       기반이라 터치에선 안 뜬다 — 그래도 데스크톱 폭이 좁아 이름이 잘리는
                       경우엔 여전히 도움이 돼서 sm:hidden 조건 없이 항상 붙여둔다. */}
                    <Tooltip.Portal>
                      <Tooltip.Content class="z-50 rounded-lg border border-tl-border bg-tl-surface px-3 py-1.5 text-xs text-tl-fg shadow-lg">
                        <TooltipArrow />
                        {item.name}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip>
                ))}
              </div>
            )}
          </section>

          <section class="pb-12">
            {careerProfile ? (
              <>
                <div class="max-w-[64rem]">
                  <div class="flex items-baseline gap-3 text-tl-fg">
                    <p class="text-2xl font-bold tracking-[-0.05em]">
                      {careerProfile.summary_label}
                    </p>
                    <p class="text-sm text-tl-fg/48">{careerProfile.summary_value}</p>
                  </div>
                </div>

                <div class="mt-8 max-w-[64rem]">
                  {/* 회사별로 접고 펼칠 수 있게 함 — 예전엔 전부 펼쳐진 채로만 보여서
                     경력이 길면 스크롤이 길어졌다. defaultValue에 전체 회사를 넣어서
                     기존과 같은(전부 펼쳐진) 첫 화면은 유지한다. */}
                  <Accordion
                    multiple
                    collapsible
                    defaultValue={careerProfile.companies.map((_, index) => `company-${index}`)}
                    class="space-y-6"
                  >
                    {careerProfile.companies.map((company, companyIndex) => (
                      <Accordion.Item value={`company-${companyIndex}`} class="min-w-0">
                        <Accordion.Header>
                          <Accordion.Trigger class="group flex w-full items-start justify-between gap-3 text-left">
                            <div class="space-y-2">
                              <h1 class="text-[1.05rem] font-bold tracking-[-0.02em] text-tl-fg">
                                {company.company}
                              </h1>
                              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-tl-fg/48">
                                <span>{company.period}</span>
                                <span>{company.employment_type}</span>
                                <span>{company.role}</span>
                                {company.position ? <span>{company.position}</span> : null}
                              </div>
                            </div>
                            <span class="mt-1 shrink-0 text-tl-fg/40 transition-transform group-data-[expanded]:rotate-180">
                              ⌄
                            </span>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content>
                          <div class="divide-y divide-tl-border pl-5 sm:pl-8">
                            {company.items.map((item) => (
                              <section class="space-y-2 py-5 first:pt-4 last:pb-0">
                                <h2 class="text-[1.05rem] font-bold tracking-[-0.02em] text-tl-fg">
                                  {item.title}
                                </h2>
                                {item.period ? (
                                  <p class="text-sm font-medium text-tl-fg/48">{item.period}</p>
                                ) : null}
                                <div
                                  class="prose prose-neutral dark:prose-invert prose-sm max-w-4xl pl-4 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-li:text-tl-fg/62 prose-p:text-tl-fg/62"
                                  // rehype-sanitize를 통과한 뒤의 HTML만 여기 들어온다(renderMarkdown 참고)
                                  // eslint-disable-next-line solid/no-innerhtml
                                  innerHTML={item.bulletsHtml}
                                />
                              </section>
                            ))}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </>
            ) : null}
          </section>

          <section id="work" class="pb-14">
            <h2 class="mb-8 text-2xl font-bold tracking-[-0.05em] text-tl-fg">작업</h2>

            <div class="space-y-4">
              {/* Hero: featured_projects[0] — full width */}
              {hero && (
                <article class="rounded-2xl border border-tl-border bg-tl-surface/40 p-8 lg:p-10">
                  <h3 class="text-3xl font-bold tracking-[-0.06em] text-tl-fg">{hero.title}</h3>
                  <p class="mt-2 text-sm text-tl-fg/48">{hero.period}</p>

                  <div
                    class="prose prose-neutral dark:prose-invert prose-sm mt-5 max-w-3xl prose-p:text-tl-fg/62"
                    // eslint-disable-next-line solid/no-innerhtml
                    innerHTML={hero.summaryHtml}
                  />

                  <div
                    class="prose prose-neutral dark:prose-invert prose-sm mt-5 max-w-3xl prose-ul:my-0 prose-li:my-1 prose-li:text-tl-fg/56"
                    // eslint-disable-next-line solid/no-innerhtml
                    innerHTML={hero.highlightsHtml}
                  />

                  <div class="mt-8 flex flex-wrap items-center gap-3">
                    {hero.links
                      .filter((link) => isVisibleProjectLink(link.label))
                      .map((link) => (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          class="inline-flex items-center gap-1.5 rounded-full border border-tl-border px-4 py-2 text-sm text-tl-fg/64 transition hover:bg-tl-fg/4 hover:text-tl-fg"
                        >
                          {link.label}
                          <span class="text-[0.65rem]">↗</span>
                        </a>
                      ))}
                  </div>

                  <div class="mt-6 flex flex-wrap gap-2">
                    {hero.stack.map((tag) => (
                      <span class="rounded-full bg-tl-fg/4 px-3 py-1.5 text-xs text-tl-fg/48">
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
                  <div class="rounded-2xl border border-tl-border bg-tl-surface/40 p-7">
                    <div class="mb-5">
                      <h3 class="text-lg font-bold tracking-[-0.03em] text-tl-fg">CMS 시스템</h3>
                      <p class="mt-1 text-sm text-tl-fg/48">블로그를 구동하는 콘텐츠 관리 시스템</p>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      {[cms, cmsApi]
                        .filter((p): p is RenderedPortfolioProject => p != null)
                        .map((project) => (
                          <article class="rounded-xl bg-tl-fg/2 p-5 transition-colors duration-200 hover:bg-tl-fg/5">
                            <div class="flex items-start justify-between">
                              <h4 class="font-bold tracking-[-0.02em] text-tl-fg">
                                {project.title}
                              </h4>
                              <ProjectCardLinks project={project} />
                            </div>
                            <p class="mt-1 text-xs text-tl-fg/44">{project.period}</p>
                            <div
                              class="prose prose-neutral dark:prose-invert prose-sm mt-3 max-w-none prose-p:my-0 prose-p:text-tl-fg/58"
                              // eslint-disable-next-line solid/no-innerhtml
                              innerHTML={project.summaryHtml}
                            />
                            <div class="mt-4 flex flex-wrap gap-1.5">
                              {project.stack.map((tag) => (
                                <span class="rounded-full bg-tl-fg/4 px-2.5 py-1 text-[0.6875rem] text-tl-fg/44">
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
                  <div class="rounded-2xl border border-tl-border bg-tl-surface/40 p-7">
                    <div class="mb-5">
                      <h3 class="text-lg font-bold tracking-[-0.03em] text-tl-fg">개인 사이트</h3>
                      <p class="mt-1 text-sm text-tl-fg/48">블로그, 포트폴리오, 운영 대시보드</p>
                    </div>
                    <div class="space-y-3">
                      {personalSites.map((project) => (
                        <article class="rounded-xl bg-tl-fg/2 p-5 transition-colors duration-200 hover:bg-tl-fg/5">
                          <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                              <h4 class="font-bold tracking-[-0.02em] text-tl-fg">
                                {project.title}
                              </h4>
                              <p class="mt-1 text-xs text-tl-fg/44">{project.period}</p>
                            </div>
                            <ProjectCardLinks project={project} />
                          </div>
                          <div class="mt-3 flex flex-wrap gap-1.5">
                            {project.stack.map((tag) => (
                              <span class="rounded-full bg-tl-fg/4 px-2.5 py-1 text-[0.6875rem] text-tl-fg/44">
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
                    <article class="flex flex-col rounded-2xl border border-tl-border bg-tl-surface/40 p-7">
                      <div class="flex items-start justify-between">
                        <div>
                          <h3 class="text-lg font-bold tracking-[-0.03em] text-tl-fg">
                            {project.title}
                          </h3>
                          <p class="mt-1 text-sm text-tl-fg/48">{project.period}</p>
                        </div>
                        <ProjectCardLinks project={project} />
                      </div>
                      <div
                        class="prose prose-neutral dark:prose-invert prose-sm mt-3 max-w-none prose-p:my-0 prose-p:text-tl-fg/62"
                        // eslint-disable-next-line solid/no-innerhtml
                        innerHTML={project.summaryHtml}
                      />
                      <div class="mt-auto flex flex-wrap gap-2 pt-5">
                        {project.stack.map((tag) => (
                          <span class="rounded-full bg-tl-fg/4 px-3 py-1.5 text-xs text-tl-fg/48">
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
            <div class="divide-y divide-tl-border">
              {devPosts.length > 0 ? (
                devPosts.map((post) => (
                  <div class="group cursor-pointer py-5 first:pt-0">
                    <a class="space-y-1.5" href={`/posts/${post.post_id}`}>
                      <h3 class="text-[1.1rem] font-bold tracking-[-0.04em] text-tl-fg transition group-hover:text-tl-fg/72">
                        {post.title}
                      </h3>
                      <p class="max-w-2xl text-sm leading-7 text-tl-fg/54">{post.description}</p>
                    </a>
                  </div>
                ))
              ) : (
                <div class="py-3 text-sm leading-7 text-tl-fg/56">
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
