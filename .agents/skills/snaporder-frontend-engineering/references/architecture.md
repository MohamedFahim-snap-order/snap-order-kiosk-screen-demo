# Architecture

## Dashboard shell

- Route group: `src/app/dashboard/**`.
- Layout (`layout.tsx`) authenticates, then wraps children in `DashboardShell` (sidebar + topbar + scrollable content).
- Feature pages supply only page content — never a second app chrome.
- Metadata: set `title` on dashboard routes.

## Where code lives (placement rules)

Put every new file in the **owner** layer. Do not dump cross-cutting UI into a feature folder, and do not park feature UI under shared.

Feature modules are grouped by dashboard nav tab (`DASHBOARD_NAVIGATION` in `src/features/dashboard/config/dashboard-navigation.ts`):

```text
src/features/
  operations/          # Overview routes live in dashboard/; rest below
    branches/
    customers/
    ai-conversations/
    flagged-conversations/
  ai/
    ai-configuration/
    demo-testing/
    ai-observability/
    upsell-rules/
  analytics/           # placeholder for analytics nav pages
  menu-management/
    menus/
    items/
    categories/
    modifiers/
    combos/
  menu-marketing/
    vendor-config/
    menu-builder/
    promotions/
    loyalty-rewards/
  administration/
    pending-changes/
    licenses/
    screens-agents/
    support/
    users/
    roles/
    audit-trail/
  dashboard/           # shell + overview chrome (cross-tab)
  auth/                # sign-in / session (outside nav tabs)
  notifications/       # topbar notifications (shell-adjacent)
```

| Kind | Location | Examples |
|------|----------|----------|
| Feature UI (one domain only) | `src/features/<tab>/<feature>/components/` | `UsersTable`, `ScreensTable`, `DeleteBranchDialog` |
| Feature logic / data | `src/features/<tab>/<feature>/{hooks,services,mappers,types,schemas,query-keys,config,fixtures,styles}/` | filters URL schema, RQ keys, mocks |
| Dashboard chrome + overview | `src/features/dashboard/components/{layout,account,overview}/` | `DashboardShell`, sidebar, ProfileModal, overview panels |
| Shared reusable UI | `src/shared/ui/` | `DashboardAccountModal`, `ConfirmActionDialog`, `DetailsBackLink`, `ThemeToggle` |
| Shared fixtures (cross-feature demo facts) | `src/shared/fixtures/` | `vendor-license.seed` |
| Shared skeletons / errors | `src/shared/skeletons/`, `src/shared/errors/` | route `loading.tsx` skeletons, `NotFoundView` |
| Shared filters / providers | `src/shared/filters/`, `src/shared/providers/` | `FilterSelect`, `useUrlFilters`, `QueryProvider` |
| App routes (thin) | `src/app/dashboard/<route>/` | `page.tsx`, `loading.tsx`, `error.tsx` |

**Decision test:** If another feature will (or already should) import it, it belongs under `src/shared/**`. If only one feature uses it, keep it under that feature’s tab folder.

**Do not:**

- Put generic confirm/modal/button primitives inside `features/**/components` (except account forms that own dashboard-only profile/password flows).
- Put list/table/page views for one domain under `src/shared`.
- Reintroduce a catch-all `src/components/**` for product UI — new domains go under `src/features/<tab>/<name>/`.

## Feature module layout

Mirror existing features (`src/features/<tab>/<name>/`):

```text
components/     # page views, rows, panels, feature-specific dialogs
hooks/          # RQ queries/mutations + URL filter hooks
services/       # fetch/mutate; mock toggle ok
mappers/        # API ↔ domain
types/          # domain + *-api.types
schemas/        # Zod (forms + URL filter validation)
query-keys/     # stable typed keys
config/         # options, URL filter schema defs
fixtures/       # mocks when needed
styles/         # CSS modules for page-specific layout only
```

App routes stay thin: `page.tsx` / `loading.tsx` / `error.tsx` (+ `[id]/not-found.tsx` when details can 404).

## State ownership

| Concern | Owner |
|---------|--------|
| Filters, segment, page, pageSize | URL via `@/shared/filters` (`useUrlFilters`, Zod catch defaults) |
| Server/list/detail/activity data | React Query |
| Dialog open/selected entity | Local component state |
| Forms | React Hook Form + Zod resolver |
| Toasts | Sonner |

Do not use Redux for filters, pagination, dialogs, or form drafts.

## React Query

- Keys: `featureKeys.list(filters)`, `.detail(id)`, `.summary()`, nested resources as needed.
- Use serializable normalized filter objects as key parts.
- Prefer `placeholderData: (previous) => previous` on paginated/list queries.
- Mutations invalidate the smallest relevant key set.
- Do not fetch full histories when pagination exists.

## Services & types

- Separate `FooApi*` (snake_case) from domain `Foo*` (camelCase).
- No `any`. Map at the boundary.
- Exports/erasure/destructive flows go through the service layer (never assemble sensitive payloads only from cached UI objects when a secure export path is required).

## Client vs server

- Keep `page.tsx` server-friendly when practical (session/business name, `generateMetadata`, `notFound()`).
- Mark interactive trees `"use client"`.
- Wrap `useSearchParams` / URL filter hooks in `<Suspense>` with skeleton fallbacks.

## Data flow (API)

```text
Client hook (RQ)
  → queries/*.ts ("use server")
    → services/*.ts (server-only)
      → vendorIamRequest → tenant/platform API
      → mappers → domain types
```

Mutations invalidate the smallest relevant keys **and** linked domains (e.g. categories ↔ items). See [docs/api-integration.md](../../../docs/api-integration.md).

## Menu management ownership

- Live catalog/items/categories logic: `src/features/menu-management/**` (esp. `catalog/`, `categories/`).
- Some routes still import thin wrappers from `menu-marketing/menu-builder` — prefer **menu-management** for new integration work; do not revive deleted duplicate page views.
