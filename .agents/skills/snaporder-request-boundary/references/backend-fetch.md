# Backend fetch handoff

## Env

- `SNAPORDER_API_URL` — Laravel base (per ADR: Supabase JWT, tenant host-first)
- Never pass tokens to client components

## Errors

- 401 → redirect sign-in (layout/proxy) or throw in server action
- 403 → `access-denied` or toast on client
- Map API envelope to domain in **mappers** only

## Mock → real swap

1. Keep function signatures in `services/*.ts`
2. Replace mock branch with `serverFetch` + mapper
3. Client hooks unchanged (same query keys)

## Do not

- Import `cookies()` in client `"use client"` files
- Store JWT in `localStorage`
- Put fetch URL + secret in client bundle
