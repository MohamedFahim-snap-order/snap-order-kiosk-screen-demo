# Design system

Authoritative sources in-repo:

- `docs/ui-style-registry.md`
- `src/styles/tokens.css`
- `src/styles/utilities.css`
- `src/styles/skeleton.css`
- `src/app/globals.css` (`@theme inline` maps tokens)

Before adding a token or `.ui-*` class, search the registry.

## Rules

1. Semantic CSS variables only (`--color-*`, `--gradient-*`, `--shadow-*`, `--radius-*`, …).
2. Reusable patterns use `ui-` prefix in `@layer components`.
3. Theme via `html.dark` (next-themes). Support light and dark for every new surface.
4. Prefer semantic utilities: `bg-app`, `bg-surface`, `text-text-muted`, `border-border`, brand tokens.
5. No parallel gray/blue product palettes. Arbitrary hex needs registry note + justification.
6. Page-specific CSS modules are for layout structure (grids, row templates), not new color systems.
7. Icons: Lucide SVG. Do not use emoji as permanent production icons when Lucide exists.
8. Do not `@apply` custom `.ui-*` component classes into other CSS (Tailwind compose pitfall). Compose classes in JSX instead.

## Prefer these building blocks

| Need | Use |
|------|-----|
| Page header | `ui-page-header`, `ui-page-title`, `ui-page-subtitle` |
| Panels/cards | `ui-panel`, `ui-surface`, `ui-card-*` |
| Buttons | `ui-btn-primary`, `ui-btn-brand-alt`, `ui-btn-secondary`, `ui-btn-ghost`, `ui-btn-destructive` |
| Forms | `ui-field-label`, `ui-field-control`, `ui-field-hint`, `ui-field-error` |
| Tables | `ui-table-wrap`, `ui-data-table` |
| Badges | `ui-badge` + semantic variant + optional `ui-badge-dot` |
| Focus | global focus + `ui-focus-ring` on custom controls |
| Loading | `ui-skeleton-*` (block/text/title/button/avatar/…) |
| Modals | existing dialog primitive (`DashboardAccountModal` / project dialogs) + `ui-modal-*` tokens as applicable |
| Menus | `ui-dropdown-surface`; prefer shared `FilterSelect` for finite filters |
| Scroll areas | project scrollbar utilities (e.g. `.ui-scrollbar`); avoid page-level X overflow |

## Visual accuracy reviews

- Match established dashboard density (controlled padding, thin semantic borders, consistent card heights).
- Improve screenshot inconsistencies when they fight the system (emoji icons, huge empty fixed-height cards, color-only meaning).
- Active filters/tabs: brand tokens + non-color cue (`aria-selected`, inset/border treatment).
