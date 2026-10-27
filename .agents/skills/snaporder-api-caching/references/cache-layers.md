# Cache layers — examples

## Duplicate session fetch (bad)

```ts
// layout.tsx
const user = await getAuthSession();
// page.tsx — second cookies() read without cache wrapper
const cookieStore = await cookies(); // FORBIDDEN in page
```

## Duplicate session fetch (good)

```ts
// session.ts
export const getAuthSession = cache(async () => { ... });

// layout + page both call getAuthSession → one cookies() read per request
```

## Branch setup save

```ts
// useSaveBranchSetup.ts
onSuccess: (branch) => {
  queryClient.invalidateQueries({ queryKey: branchesKeys.all });
  queryClient.setQueryData(branchesKeys.detail(branch.slug), branch);
};
```

## Future RSC branch list

```ts
// src/app/dashboard/branches/page.tsx
import { fetchBranchListServer } from "@/features/operations/branches/services/branches.server";

export default async function BranchesPage() {
  const initial = await fetchBranchListServer(defaultFilters);
  return <BranchesPageView initialData={initial} />;
}
```

`fetchBranchListServer` uses `cache` + `fetch` tags; client hook uses same query key with `initialData`.

## Anti-pattern

```ts
let branchesCache: Branch[] | null = null; // module scope — race across requests
export async function getBranches() {
  if (branchesCache) return branchesCache;
  ...
}
```
