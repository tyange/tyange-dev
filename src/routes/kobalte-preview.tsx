import { A } from "@solidjs/router";
import { Accordion as KAccordion } from "@kobalte/core/accordion";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import { Select as KSelect } from "@kobalte/core/select";
import { Switch as KSwitch } from "@kobalte/core/switch";
import { Arrow as KTooltipArrow, Tooltip as KTooltip } from "@kobalte/core/tooltip";
import { createSignal, type JSX } from "solid-js";

// Kobalte(SolidJS 헤드리스 UI)를 tyange-dev의 헤드리스 UI 프리미티브로 정식 채택
// (2026-09-06) — 처음엔 "느낌만 보려는" 실험용 라우트였지만, 홈 헤더에 링크를 걸어
// 정식 페이지로 확정했다. Kobalte는 로직/접근성만 제공하고 스타일은 없으므로,
// 색·라운드·보더는 전부 이미 연결돼 있는 design-system의 --tl-* 토큰(Tailwind
// 유틸리티)을 그대로 썼다 — 별도 컴포넌트 패키지 없이도 "연결"이 성립함을 보여주는
// 게 이 라우트의 원래 목적이었다. design-system 저장소 자체의 컴포넌트 패키지화
// (docs/decisions.md의 "다음 단계")는 git 의존성 서브디렉토리 구조·dist/ 커밋+CI
// 게이트·solid export 조건 유지 같은 선행 인프라가 필요한 별개의 더 큰 작업이라
// 이번엔 손대지 않았다.
//
// Accordion/Tooltip은 2026-09-06에 실제 홈 화면(경력 섹션 접기, 기술 스택 툴팁)에
// 적용하면서 추가됐다. 주의: Kobalte의 compound export는 루트 컴포넌트 자체가
// `Accordion`/`Tooltip`이고 `.Root`는 없다(Content/Header/Item/Trigger만 하위
// 프로퍼티로 붙어있음) — `<Accordion.Root>`처럼 쓰면 SSR에서 "Comp is not a
// function"으로 조용히 깨진다(prerender 자체는 "성공"으로 찍혀서 발견하기
// 까다로움). Switch/Select/Dialog와 똑같이 컴파운드 객체를 루트 엘리먼트로 직접
// 쓴다.

const SORT_OPTIONS = ["최신순", "오래된순", "이름순"] as const;

function PreviewCard(props: { title: string; description: string; children: JSX.Element }) {
  return (
    <div class="rounded-2xl border border-tl-border bg-tl-surface/40 p-7">
      <h2 class="text-lg font-bold tracking-[-0.03em] text-tl-fg">{props.title}</h2>
      <p class="mt-1 text-sm leading-6 text-tl-fg/56">{props.description}</p>
      <div class="mt-6">{props.children}</div>
    </div>
  );
}

function SwitchDemo() {
  return (
    <KSwitch class="flex items-center gap-3">
      <KSwitch.Input />
      <KSwitch.Control class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-tl-fg/12 p-0.5 transition-colors data-[checked]:bg-tl-accent">
        <KSwitch.Thumb class="h-5 w-5 rounded-full bg-tl-surface shadow-sm transition-transform data-[checked]:translate-x-5" />
      </KSwitch.Control>
      <KSwitch.Label class="text-sm text-tl-fg/72">알림 받기</KSwitch.Label>
    </KSwitch>
  );
}

function DialogDemo() {
  return (
    <KDialog>
      <KDialog.Trigger class="inline-flex items-center gap-1.5 rounded-full border border-tl-border px-4 py-2 text-sm text-tl-fg/72 transition hover:bg-tl-fg/4 hover:text-tl-fg">
        모달 열기
      </KDialog.Trigger>
      <KDialog.Portal>
        <KDialog.Overlay class="fixed inset-0 z-50 bg-black/40" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <KDialog.Content class="w-full max-w-sm rounded-2xl border border-tl-border bg-tl-surface p-6 shadow-lg">
            <KDialog.Title class="text-lg font-bold tracking-[-0.03em] text-tl-fg">
              Kobalte 미리보기
            </KDialog.Title>
            <KDialog.Description class="mt-2 text-sm leading-6 text-tl-fg/62">
              포커스 트랩·ESC 닫기·바깥 클릭 닫기는 Kobalte가 처리하고, 색과
              라운드는 design-system 토큰을 그대로 썼다.
            </KDialog.Description>
            <div class="mt-6 flex justify-end">
              <KDialog.CloseButton class="rounded-full bg-tl-accent px-4 py-2 text-sm font-medium text-tl-fg-on-accent transition hover:bg-tl-accent-hover">
                닫기
              </KDialog.CloseButton>
            </div>
          </KDialog.Content>
        </div>
      </KDialog.Portal>
    </KDialog>
  );
}

function SelectDemo() {
  const [value, setValue] = createSignal<(typeof SORT_OPTIONS)[number]>("최신순");

  return (
    <KSelect
      options={[...SORT_OPTIONS]}
      value={value()}
      onChange={(next: string | null) => {
        if (next) setValue(next as (typeof SORT_OPTIONS)[number]);
      }}
      itemComponent={(props) => (
        <KSelect.Item
          item={props.item}
          class="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-tl-fg/72 outline-none data-[highlighted]:bg-tl-accent-soft data-[highlighted]:text-tl-fg"
        >
          <KSelect.ItemLabel>{props.item.rawValue}</KSelect.ItemLabel>
          <KSelect.ItemIndicator class="text-tl-accent">✓</KSelect.ItemIndicator>
        </KSelect.Item>
      )}
    >
      <KSelect.Trigger class="flex w-40 items-center justify-between rounded-full border border-tl-border px-4 py-2 text-sm text-tl-fg/72 transition hover:bg-tl-fg/4 data-[expanded]:border-tl-accent">
        <KSelect.Value<string>>{(state) => state.selectedOption()}</KSelect.Value>
        <KSelect.Icon class="text-tl-fg/40">⌄</KSelect.Icon>
      </KSelect.Trigger>
      <KSelect.Portal>
        <KSelect.Content class="z-50 min-w-[10rem] overflow-hidden rounded-xl border border-tl-border bg-tl-surface p-1 shadow-lg">
          <KSelect.Listbox />
        </KSelect.Content>
      </KSelect.Portal>
    </KSelect>
  );
}

function AccordionDemo() {
  return (
    <KAccordion multiple collapsible defaultValue={["item-0"]} class="space-y-2">
      {["첫 번째 항목", "두 번째 항목"].map((title, index) => (
        <KAccordion.Item value={`item-${index}`} class="rounded-lg border border-tl-border">
          <KAccordion.Header>
            <KAccordion.Trigger class="group flex w-full items-center justify-between px-3 py-2 text-left text-sm text-tl-fg/72">
              {title}
              <span class="text-tl-fg/40 transition-transform group-data-[expanded]:rotate-180">
                ⌄
              </span>
            </KAccordion.Trigger>
          </KAccordion.Header>
          <KAccordion.Content class="px-3 pb-3 text-sm leading-6 text-tl-fg/56">
            펼치고 접는 상태·키보드 탐색을 Kobalte가 관리한다. 홈 화면의 경력
            섹션에 실사용 중.
          </KAccordion.Content>
        </KAccordion.Item>
      ))}
    </KAccordion>
  );
}

function TooltipDemo() {
  return (
    <KTooltip openDelay={200}>
      <KTooltip.Trigger class="inline-flex items-center gap-1.5 rounded-full border border-tl-border px-4 py-2 text-sm text-tl-fg/72 transition hover:bg-tl-fg/4 hover:text-tl-fg">
        마우스를 올려보세요
      </KTooltip.Trigger>
      <KTooltip.Portal>
        <KTooltip.Content class="z-50 rounded-lg border border-tl-border bg-tl-surface px-3 py-1.5 text-xs text-tl-fg shadow-lg">
          <KTooltipArrow />
          위치 계산(popper)과 hover 지연을 Kobalte가 관리한다.
        </KTooltip.Content>
      </KTooltip.Portal>
    </KTooltip>
  );
}

export default function KobaltePreview() {
  return (
    <main class="min-h-screen bg-tl-bg px-6 py-16 text-tl-fg sm:px-10 lg:px-12">
      <div class="mx-auto max-w-3xl space-y-4">
        <h1 class="text-2xl font-bold tracking-[-0.05em] text-tl-fg">Kobalte 프리뷰</h1>
        <p class="max-w-xl text-sm leading-7 text-tl-fg/56">
          헤드리스 UI 라이브러리 Kobalte로 만든 컴포넌트 5종. 로직·접근성은
          Kobalte가, 스타일은 design-system 토큰이 맡는다. Accordion/Tooltip은
          홈 화면(경력 섹션, 기술 스택 아이콘)에 실제로 쓰이고 있다.
        </p>

        <div class="grid gap-4 pt-4 sm:grid-cols-2">
          <PreviewCard title="Switch" description="토글 상태·접근성 속성을 Kobalte가 관리한다.">
            <SwitchDemo />
          </PreviewCard>

          <PreviewCard title="Select" description="키보드 탐색·리스트박스 role을 Kobalte가 관리한다.">
            <SelectDemo />
          </PreviewCard>

          <PreviewCard title="Dialog" description="포커스 트랩·바깥 클릭/ESC 닫기를 Kobalte가 관리한다.">
            <DialogDemo />
          </PreviewCard>

          <PreviewCard title="Accordion" description="펼침/접힘 상태와 키보드 탐색을 Kobalte가 관리한다.">
            <AccordionDemo />
          </PreviewCard>

          <PreviewCard title="Tooltip" description="hover 지연과 위치 계산(popper)을 Kobalte가 관리한다.">
            <TooltipDemo />
          </PreviewCard>
        </div>

        <div class="pt-4">
          <A href="/" class="inline-flex items-center text-sm text-tl-fg/48 transition hover:text-tl-fg">
            &larr; 돌아가기
          </A>
        </div>
      </div>
    </main>
  );
}
