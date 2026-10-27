---
name: snaporder-request-boundary
description: >
  SnapOrder vendor-portal request-boundary rules: never call cookies() or headers()
  from next/headers inside app route page files. Route guards use src/proxy.ts;
  session and backend auth live in server-only lib/services. Use when adding or
  editing pages, layouts, API integration, server actions, middleware/proxy, or
  when wiring Laravel/Supabase backend fetch from the Next.js app.
---

# SnapOrder Request Boundary

Keeps request-scoped I/O out of `page.tsx` so backend integration stays testable and consistent.

## Hard rule

**Never** in `src/app/**/page.tsx`:

```ts
import { cookies, headers } from "next/headers";
await cookies();
await headers();
```

Same ban for reading/writing cookies or request headers inline in page components.

## Where request I/O belongs

| Concern | Location | Notes |
|---------|----------|-------|
| Route guard (logged in? role allowed?) | `src/proxy.ts` | Uses `NextRequest.cookies` — not `next/headers` |
| Auth session read/write | `src/lib/auth/session.ts` | `server-only`; wraps `cookies()` + `React.cache` |
| Backend fetch with auth | `src/lib/api/*` or feature `services/*.ts` | `server-only`; calls session helper, not pages |
| Server Actions mutations | `src/features/**/actions/*.ts` or service | Auth check inside action/service |
| Page UI | `src/app/**/page.tsx` | Thin: metadata + pass props to feature view |

## Allowed in pages

Pages may call **facade** functions that hide `cookies()` / `headers()`:

```ts
// src/app/dashboard/branches/page.tsx — OK
import { getAuthSession } from "@/lib/auth/session";
import { getAuthenticatedDashboardContext } from "@/features/auth/lib/authenticated-user";

export default async function BranchesPage() {
  const sessionUser = await getAuthSession();
  const authContext = sessionUser ? getAuthenticatedDashboardContext(sessionUser) : null;
  return <BranchesPageView businessName={authContext?.business.name ?? "…"} />;
}
```

Prefer **one** session read per tree: dashboard `layout.tsx` already loads session for shell — avoid duplicate session fetches in every child page when props/context can carry `business` / `user`.

## Backend integration pattern

1. Page → feature `*PageView` (client) or server child that calls a **service**.
2. Service (`src/features/<tab>/<feature>/services/*.ts` or `src/lib/api/server-fetch.ts`) is `server-only`.
3. Service obtains auth via `getAuthSession()` (or future `getServerAuthHeaders()` in `src/lib/api/`).
4. Service calls Laravel API; maps snake_case → domain types.
5. Client components use TanStack Query hooks that call Route Handlers or Server Actions — **not** `cookies()` in the browser.

```ts
// src/lib/api/server-fetch.ts (create when wiring real API)
import "server-only";
import { cache } from "react";
import { getAuthSession } from "@/lib/auth/session";

export const serverFetch = cache(async (path: string, init?: RequestInit) => {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`${process.env.SNAPORDER_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`, // when JWT lands
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res;
});
```

Feature service example:

```ts
import "server-only";
import { serverFetch } from "@/lib/api/server-fetch";
import { mapBranchListFromApi } from "../mappers/branches.mapper";

export async function fetchBranchListServer(filters: BranchFilters) {
  const res = await serverFetch(`/api/v1/branches?${toQuery(filters)}`);
  const json = await res.json();
  return mapBranchListFromApi(json.data);
}
```

## Proxy (not page)

`src/proxy.ts` — session cookie on `NextRequest`, role/path rules via `canAccessPath`. Do not duplicate guard logic in pages.

## Checklist before merge

- [ ] No `cookies()` / `headers()` import in any `page.tsx`
- [ ] New auth/header logic in `lib/` or feature `services/`, marked `server-only` where needed
- [ ] Pages stay thin; business logic not in `src/app/`
- [ ] Proxy updated if new guarded route prefix added

## More detail

- [boundary-layers.md](references/boundary-layers.md)
- [backend-fetch.md](references/backend-fetch.md)
