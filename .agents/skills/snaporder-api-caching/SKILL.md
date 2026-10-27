---
name: snaporder-api-caching
description: >
  SnapOrder vendor-portal data caching strategy across server pages, services,
  and client TanStack Query. Covers React.cache per-request dedup, fetch
  revalidate/tags, unstable_cache, query keys, invalidation, and what must not
  be cached. Use when integrating backend APIs, adding list/detail fetches,
  optimizing RSC pages, or debugging stale or duplicate data.
---

# SnapOrder API Caching

Use the right cache layer for each data type. Never cache request-specific or tenant-scoped data in module-level mutable variables.

## Cache layers (pick one)

| Layer | Tool | Scope | Use for |
|-------|------|-------|---------|
| **A. Per-request dedup** | `React.cache()` in server module | Single render/request | `getAuthSession`, shared server fetch used by layout + page |
| **B. HTTP / RSC** | `fetch(..., { next: { revalidate, tags } })` | Server, time/tag based | Vendor config, permission catalog, slow-changing lists |
| **C. Cross-request server** | `unstable_cache` | Process/CDN | Rare; static reference data only |
| **D. Client** | TanStack Query (`useQuery` / `useMutation`) | Browser tab | Interactive lists, details, filters, mutations |
| **E. URL state** | `useUrlFilters` | Browser URL | Filters, pagination — **not** a data cache |

## A — Per-request (`React.cache`)

Wrap every server helper that may run more than once per request:

```ts
import "server-only";
import { cache } from "react";

export const getAuthSession = cache(async () => { /* cookies via session.ts */ });

export const getVendorProfile = cache(async () => {
  const res = await serverFetch("/api/v1/vendor/profile");
  return mapVendorProfile(await res.json());
});
```

## B — Server fetch revalidation

```ts
await fetch(`${API}/api/v1/branches`, {
  next: { revalidate: 60, tags: ["branches"] },
});
```

After mutation:

```ts
import { revalidateTag } from "next/cache";
revalidateTag("branches");
revalidateTag(`branch:${slug}`);
```

Tag naming: plural list tag + singular entity tag.

## D — TanStack Query (client)

Already in `src/shared/providers/QueryProvider.tsx`. Feature pattern:

```ts
// query-keys/branches.keys.ts
export const branchesKeys = {
  all: ["branches"] as const,
  lists: () => [...branchesKeys.all, "list"] as const,
  list: (filters: BranchFilters) => [...branchesKeys.lists(), filters] as const,
  detail: (slug: string) => [...branchesKeys.all, "detail", slug] as const,
};

// hooks/useBranches.ts
export function useBranches(filters: BranchFilters) {
  return useQuery({
    queryKey: branchesKeys.list(filters),
    queryFn: () => fetchBranchList(filters), // service; mock today
    placeholderData: keepPreviousData,
  });
}
```

**Invalidation** on mutation success:

```ts
queryClient.invalidateQueries({ queryKey: branchesKeys.all });
queryClient.setQueryData(branchesKeys.detail(slug), updated);
```

### Client fetch rules

- List pages: client fetch via hooks (current mock services) until SSR list needed
- When adding server prefetch: pass `initialData` / dehydrate — do not double-fetch without `React.cache` on server

## What NOT to cache

- URL filter/pagination state (use URL — see `snaporder-frontend-engineering`)
- Per-user secrets or full JWT in client cache keys
- Module-level `let cache = {}` for request/tenant data
- `localStorage` for API responses (except explicit user prefs with version prefix)

## Staleness defaults

| Data | Client `staleTime` | Server `revalidate` |
|------|-------------------|---------------------|
| Session / auth | 0 (always fresh on server) | n/a |
| List tables | 30s default | 60s when server-driven |
| Detail view | 60s | tag on mutation |
| Reference catalogs (roles, permissions) | 5m | 300s or tag |

Override per feature when product requires live data (e.g. agent monitor).

## Server + client together

```text
page.tsx (no cookies)
  → optional: prefetch in layout/server component via cached service
  → pass serializable props OR dehydrate QueryClient
PageView (client)
  → useQuery with same queryKey → cache hit, no duplicate network
```

## Checklist

- [ ] Server reads wrapped in `React.cache` if called from multiple RSC nodes
- [ ] Query keys include normalized filter object (stable sort)
- [ ] Mutations invalidate/list + detail tags or query keys
- [ ] `revalidateTag` used when server components own the data
- [ ] No mutable module cache for tenant/user payloads

## More detail

- [cache-layers.md](references/cache-layers.md)
