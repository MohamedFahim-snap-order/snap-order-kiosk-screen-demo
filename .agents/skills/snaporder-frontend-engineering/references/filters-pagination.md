# URL filters and pagination

## Shared tools

Use `@/shared/filters`:

- `createStringParam` / `createEnumParam` / `createNumberParam`
- `useUrlFilters(schema)`
- `useDebouncedUrlValue` for search (~300ms)
- `FilterSelect` for finite dropdowns (accessible listbox; portals to body)

## Conventions

1. Declare URL schema in `config/*-filters.config.ts`.
2. Validate with Zod in `schemas/*-filters.schema.ts` — invalid values catch to defaults.
3. Feature hook (`useXFilters`) maps URL values → domain filters and exposes `setFilters` / `resetFilters`.
4. Filter/segment/pageSize changes reset `page` to 1.
5. Search commits with `router.replace` (via shared hook). Other filter changes may push/replace per existing shared behavior — stay consistent with `useUrlFilters`.
6. Pagination is server-driven (or mock-paginated in the service). Do not load entire datasets client-side when pages exist.
7. Show range + total, Previous/Next, practical page numbers, page-size control.
8. Keep previous page data visible while refetching.
9. Normalize impossible pages when the service returns a clamped page (sync URL if needed).
10. Nested timelines on details pages use separate params (e.g. `activityPage`) so they do not clash with list pagination.

## Segment / tab filters

When segment cards act as filters: `role="tablist"` / `role="tab"`, `aria-selected`, `aria-controls`, keyboard-friendly, URL-driven, reset page on change. On small screens: horizontal scroll with scrollbar utility or compact select — no page-level X overflow.
