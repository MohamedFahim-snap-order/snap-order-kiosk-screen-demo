# Forms and dialogs

## Stack

- React Hook Form + Zod (`@hookform/resolvers/zod`)
- Shared create/edit form component when both modes exist
- Dialogs: existing accessible modal primitive (`DashboardAccountModal` pattern) — focus trap/restore, Escape, labelled title
- Feedback: Sonner toasts for success/error; inline `ui-field-error` / server error for form-level failures

## Patterns

1. One Zod schema + `defaultValues`; map domain → form values for edit.
2. Disable submit/cancel appropriately while pending; set `aria-busy` on primary action.
3. Destructive actions need confirmation dialog with irreversible-effect warning when applicable.
   Prefer shared `@/shared/ui/ConfirmActionDialog` for Cancel + confirm chrome; keep domain copy + mutations in the feature.
4. Never claim erasure/deletion complete before service confirmation.
5. Icon-only buttons need accessible names (`aria-label`).
6. Native `<button type="button|submit">` / links — not div click targets.
7. Dropdown menus near viewport edges: use `FilterSelect` portal positioning (`placement`, `menuAlign`) so menus do not create page X/Y overflow.

## Mutations

- `useMutation` in feature hooks; invalidate targeted query keys on success.
- Keep service functions as the only place that talks to mock/API for writes.
