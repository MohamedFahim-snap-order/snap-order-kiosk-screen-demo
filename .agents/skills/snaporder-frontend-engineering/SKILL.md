---
name: snaporder-frontend-engineering
description: >
  Project rules for SnapOrder vendor-portal frontend work: feature architecture,
  semantic design tokens, .ui-* utilities, URL-driven filters/pagination, list/details
  routes, forms/dialogs, responsive layouts, WCAG accessibility, light/dark themes,
  React Query, RHF+Zod, skeletons, validation scripts, honest completion reports,
  and API integration data-flow (see docs/api-integration.md). Use whenever building
  or refactoring dashboard pages, feature modules under src/features/, forms, modals,
  filters, tables, list/details routes, wiring vendor APIs, reviewing visual accuracy
  against screenshots, or verifying/finishing frontend work — even if the user does
  not paste architecture rules. Prefer this skill over repeating long project rule
  dumps in the prompt. Do not use for unrelated backend-only, marketing-site redesign,
  or generic Next.js/React docs already covered by other installed skills.
---

# SnapOrder Frontend Engineering

Canonical project rules for this repo. Keep user prompts short; load this skill instead of pasting architecture/design/a11y checklists every time.

## Non-goals

- Do not redesign SnapOrder or invent a second design system.
- Do not duplicate Next.js / React / Playwright / Vercel skill docs — defer to those skills for framework mechanics.
- Do not invent `components.json` / shadcn setup; this repo uses semantic tokens + `.ui-*` + existing dialog primitives.

## Always do first

1. Reuse dashboard shell (`src/app/dashboard/layout.tsx` → `DashboardShell`). Never rebuild sidebar/topbar.
2. Follow feature folder shape under nav tabs: `operations/*`, `ai/*`, `analytics/*`, `menu-marketing/*`, `administration/*` (see architecture.md). Shell stays in `dashboard/`; auth/notifications stay top-level.
3. **Placement:** feature-only UI → `src/features/<tab>/<feature>/components/`; cross-feature UI → `src/shared/ui/` (or `shared/filters`, `shared/providers`). Never park shared primitives inside a feature, and never put domain tables/pages under shared.
4. Prefer semantic tokens + `.ui-*` from the registry over hardcoded colors.
5. URL is source of truth for list filters/pagination — no Redux/Context/`localStorage` for that state.
6. Validate with `npm run lint`, `npm run type-check`, `npm run test`, `npm run build` before claiming done.

## Load references by task

| Task | Read |
|------|------|
| Any dashboard feature / page | [architecture.md](references/architecture.md) |
| **API integration / data flow / menu live quirks** | [api-integration.md](../../../docs/api-integration.md) + [agent-guide.md](../../../docs/agent-guide.md) |
| **No `cookies()`/`headers()` in pages; proxy + server services** | `../snaporder-request-boundary/SKILL.md` |
| **API + RSC + React Query caching** | `../snaporder-api-caching/SKILL.md` |
| Visual styling, tokens, `.ui-*`, themes | [design-system.md](references/design-system.md) |
| Forms, dialogs, mutations, toasts | [forms-dialogs.md](references/forms-dialogs.md) |
| Search/filters/pagination URL state | [filters-pagination.md](references/filters-pagination.md) |
| List + details routes | [list-details-routes.md](references/list-details-routes.md) |
| Breakpoints, overflow, a11y, motion | [responsive-a11y.md](references/responsive-a11y.md) |
| Scripts, tests, completion report | [validation-reporting.md](references/validation-reporting.md) |

Read only the rows that match the current request.

## Hard invariants (summary)

- **Shell:** authenticated dashboard layout only; pages render inside existing content area.
- **Stack:** Next.js 16 App Router, React 19, Tailwind v4, TanStack Query, RHF, Zod, Sonner, Lucide, `next-themes` (`html.dark`).
- **Structure:** separate UI / URL state / RQ hooks / services / mappers / API types / domain types / Zod schemas / query keys.
- **UI:** compose `ui-page-*`, `ui-panel`, `ui-btn-*`, `ui-field-*`, `ui-badge-*`, `ui-table-*`, `ui-skeleton-*`, `ui-focus-ring`, scrollbar utilities. No parallel gray/blue palettes. No unexplained `bg-[#…]`.
- **Data:** mock/service boundary; mappers between API snake_case and domain camelCase; typed query keys with normalized filter objects (never raw `URLSearchParams`).
- **Request boundary:** never `cookies()` / `headers()` in `page.tsx` — use `src/proxy.ts`, `src/lib/auth/session.ts`, and `server-only` services (`snaporder-request-boundary` skill).
- **Caching:** `React.cache` on server facades; TanStack Query on client; `revalidateTag` on mutations (`snaporder-api-caching` skill).
- **UX:** one `h1` per route; explicit View actions (row click alone is insufficient); skeletons on first load; keep prior data during refetch (`placeholderData`); scoped errors; light + dark both required.
- **Perf:** Client Components only where interactive; no page-level horizontal overflow; static Tailwind classes; avoid heavy chart/grid libs unless already used.
- **Privacy:** mask PII in UI/URLs/exports when the feature handles customer identity.

## Completion gate

Before “done”, run validation scripts and produce the report format in [validation-reporting.md](references/validation-reporting.md). Honest remaining diffs are required.
