---
name: screens-agents-qa
description: >
  Verify the SnapOrder Screens & Agents feature end-to-end: required routes/files,
  URL filter model, unit tests, type-check, and lint. Use whenever building,
  changing, or finishing `/dashboard/screens-agents`, screen/agent details pages,
  seat usage UI, or screens-agents tabs/filters/pagination — even if the user only
  says "test screens agents" or "verify seats page".
---

# Screens & Agents QA

## When to run

After any change under:

- `src/features/administration/screens-agents/**`
- `src/app/dashboard/screens-agents/**`

## Required checklist

1. Run the bundled verifier:

```bash
node .agents/skills/screens-agents-qa/scripts/verify.mjs
```

2. If verifier fails, fix reported missing files / test failures / type errors, then re-run.
3. Manual smoke (dev server):
   - `/dashboard/screens-agents` — seat usage + Screens/Agents tabs
   - Switch tabs; search + status filter + pagination stay URL-driven (`tab`, `q`, `status`, `page`, `pageSize`)
   - Eye icon opens details; End session / Unlock mutate mock store
   - `/dashboard/screens-agents/screens/[screenId]`
   - `/dashboard/screens-agents/agents/[agentId]`
4. Report results using the template below. Do not claim pass if verifier exits non-zero.

## Architecture invariants

- Feature module owns UI / hooks / service / mappers / types / schemas / fixtures.
- App routes stay thin.
- Filters live in URL via `@/shared/filters`.
- Prefer `.ui-*` + CSS modules; avoid inventing parallel palettes.
- Explicit View actions (Eye) required — not row-click only.

## Report template

```md
### Screens & Agents QA
- Verifier: pass|fail
- Files: ok|missing [...]
- Unit tests: pass|fail
- type-check: pass|fail
- lint (feature paths): pass|fail
- Manual smoke: done|blocked
- Fixes applied: [...]
```
