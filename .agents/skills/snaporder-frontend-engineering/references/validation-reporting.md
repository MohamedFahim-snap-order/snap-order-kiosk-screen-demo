# Validation and reporting

## Scripts (from package.json)

Run what exists:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

Do not claim completion if these fail.

## Tests

- Prefer Vitest unit tests for Zod schemas, mappers, URL parse/serialize helpers.
- Do not invent Playwright coverage here unless the user asks — use the Playwright skill when writing e2e.

## Final report template

After substantive feature work, report:

1. **Files changed** (paths / areas)
2. **URL filter & pagination model** (params + defaults) — if applicable
3. **Query architecture** (keys, list vs detail vs secondary)
4. **UI sections / routes**
5. **A11y & responsive notes**
6. **Theme** (light/dark considered)
7. **Validation results** (lint / type-check / test / build)
8. **Remaining differences** (honest gaps vs screenshots or future API)

## Honesty rules

- Scoped errors only — no raw backend dumps in UI.
- Do not mark erasure/export complete without service confirmation.
- Call out stubs (e.g. consent-history toast) explicitly in remaining diffs.
