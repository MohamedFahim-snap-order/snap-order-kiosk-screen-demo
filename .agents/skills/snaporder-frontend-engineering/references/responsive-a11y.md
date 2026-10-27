# Responsive and accessibility

## Responsive

Validate layouts conceptually at: 1760, 1440, 1280, 1024, 768, 480, 390, 320.

Rules:

- CSS Grid/Flexbox only — no resize listeners for layout.
- No page-level horizontal scrolling.
- Long IDs/names truncate safely (`min-w-0`, ellipsis).
- Tables may become stacked cards on small screens (support/customers patterns).
- Touch targets remain usable; prefer ≥38px control height from `.ui-btn` / icon buttons.
- Dialogs must fit short/narrow viewports.
- Filter bars wrap; segment tabs scroll or compact — do not force desktop columns into 320px.

## Accessibility (WCAG 2.2 AA target)

- One `h1` per route; semantic headings/lists/tables.
- Visible focus; do not remove focus outlines.
- Text (and icons) for status — never color alone (badges may use `ui-badge-dot`).
- Accessible names for icon buttons and custom selects.
- Dialogs: labelled, focus trap, restore focus, Escape.
- Tabs/filters keyboard operable.
- `prefers-reduced-motion`: avoid essential info only in motion; respect global reduced-motion handling.
- Masked PII needs clear labels (e.g. sr-only “Masked plate”).
- Locale-aware number/date/currency/percent formatting for user-visible values.
- Use `lang`/`dir` only on relevant fragments — do not flip the whole app direction casually.
