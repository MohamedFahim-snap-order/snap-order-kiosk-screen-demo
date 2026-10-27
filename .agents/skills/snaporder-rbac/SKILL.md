---
name: snaporder-rbac
description: >
  SnapOrder vendor-portal RBAC — session permissionKeys, legacy page gates, dummy login roles,
  proxy checks, and the live Roles & Permissions / Groups IAM modules.
---

# SnapOrder RBAC

## Two layers

1. **Session catalog keys (preferred when present):** login/profile `activeMembership.permissionKeys` stored on the session. Route/nav use `{resource}.view` (or `*`) via `src/lib/auth/rbac.ts`.
2. **Legacy page gate (fallback):** `src/constants/roles.ts` + `src/constants/permissions.ts` + `src/lib/auth/access.ts` when `permissionKeys` are missing (dummy auth).

Action-level catalogue for the Roles UI: live `GET /vendor/permissions` with fallback `src/constants/rbac/permission-catalog.json`.

## Live IAM modules

| Feature | Paths | Config |
|---------|-------|--------|
| Roles | `/vendor/roles` | `ROLES_USE_MOCK = false` |
| Permissions | `/vendor/permissions` | live + static fallback |
| Groups | `/vendor/groups` | `GROUPS_USE_MOCK = false` |
| Users | `/vendor/users` (+ `/roles`) | `USERS_USE_MOCK = false` |

Shared client: `src/lib/api/vendor-iam.ts` + `authenticatedVendorRequest` (tenant host).

## Roles & Permissions UI

- Routes: `/dashboard/roles`, `/dashboard/roles/new`, `/dashboard/roles/[roleId]`, edit
- Feature: `src/features/administration/roles/`
- Groups: `src/features/administration/groups/`
- Users: `src/features/administration/users/` — role options from `GET /vendor/users/roles` (Redux `userRoles`)
- Page gates: `roles.view` / `groups.view` / `users.view` when keys present; else legacy `"roles"` / `"groups"` / `"users"`
- System roles locked: `super_admin`, `human_agent`, `kiosk_screen`
- Users form excludes device keys via `USER_FORM_EXCLUDED_ROLE_KEYS`

## Legacy login roles

`UserRole` snake_case ids for dummy session / proxy. Labels in `USER_ROLE_LABELS`.

| Role | Home after login |
|------|------------------|
| `super_admin` | `/dashboard/overview` |
| `ai_engineer` … `branch_operator` | `/dashboard/overview` |
| `branch_human_agent` | `/agent-monitor` |
| `branch_kiosk` | `/access-denied` |

New dashboard route: add `PATH_RULES` + nav `href` + catalog `.view` key when applicable.

## Dummy login

Env-only passwords (`DUMMY_AUTH_PASSWORD`). Never commit credentials. Dummy sessions omit `permissionKeys` and use `ROLE_PERMISSIONS`.
