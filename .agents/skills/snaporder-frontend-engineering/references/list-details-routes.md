# List and details routes

## Typical shape

```text
/dashboard/<feature>              # list
/dashboard/<feature>/[id]         # details
```

Examples: `customers`, `branches`, `ai-conversations`.

## List page

- Header (`ui-page-*`) + primary actions
- Optional metrics/segment tabs
- Filter bar
- Results (table or compact full-width records)
- Pagination
- Loading/error/empty states scoped to the list

Each row needs an explicit View / View Details control navigating by stable public id (not name/phone).

## Details page

- Back link to list (preserve prior filter query when practical)
- One `h1`
- Fetch only the selected entity; missing/inaccessible → `notFound()` (do not silently show another record)
- Responsive panel grid (2-col large, 1-col small)
- Content-driven heights — no huge empty fixed cards
- Secondary data (activity, history) loaded in separate queries and paginated when large
- `loading.tsx` / `error.tsx` / `not-found.tsx` as needed

## Skeletons

- First load: feature skeletons using `ui-skeleton-*`
- Background refetch: keep content; avoid full-page skeleton flash
