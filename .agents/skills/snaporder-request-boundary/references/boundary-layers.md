# Request boundary layers

```text
Browser
  → proxy (src/proxy.ts)           request.cookies, redirects
  → app layout (optional)            getAuthSession() facade only
  → page.tsx                       NO cookies()/headers()
  → feature PageView (client)      TanStack Query, URL filters
  → hooks                            query/mutation
  → services (server or mock)      server-only fetch + mappers
  → Laravel API                    JWT / tenant host
```

## Layout vs page

| File | Session |
|------|---------|
| `src/app/dashboard/layout.tsx` | `getAuthSession()` — OK (facade) |
| `src/app/dashboard/*/page.tsx` | Prefer props from layout/context; if needed, facade only |
| `src/features/**/components/*` | Never `next/headers` |

## Server Actions

```ts
"use server";

import { getAuthSession } from "@/lib/auth/session";
import { revalidateTag } from "next/cache";

export async function updateBranchAction(slug: string, input: unknown) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  // call service / API
  revalidateTag(`branch:${slug}`);
}
```

## Route Handlers (`src/app/api/**/route.ts`)

May use `cookies()` / `headers()` **only** inside the route file or a dedicated `server-only` helper — not re-exported to pages.
