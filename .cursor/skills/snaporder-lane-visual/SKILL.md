---
name: snaporder-lane-visual
description: >-
  Applies SnapOrder vendor-portal colors and spacing units to the kiosk lane.
  Use when changing kiosk screen UI, lane templates, themes, checkout, or
  sign-in visuals in snap-order-kiosk-screen.
---

# SnapOrder lane visual

The lane is a public touch screen. Colors, locale, direction, and light or dark come from the signed-in account. Arabic is right to left. English is left to right. An account carries one of each. Spacing, radius, type steps, and shadows come from the portal units in `src/app/globals.css`.

## Theme fields

`applyTheme` maps the payload onto `--kiosk-*`. A new theme is a new object with the same fields. Do not hardcode a palette inside a template.

| Field | Role |
|---|---|
| `brand` | Action fill. Darken it in CSS before putting white `on_brand` on it. |
| `brand_soft` | Quiet band behind the agent line and empty art. |
| `surface` | Lane canvas. |
| `surface_raised` | Header, cards, order column. |
| `ink` | Primary text, including text on `accent`. |
| `muted` | Secondary text. Must clear 4.5:1 on `surface_raised`. |
| `accent` | Money fill (total and checkout). Text on it is `ink`. |
| `danger` | End session only. Not the listening state. |
| `radius` | Cards. Controls use `--radius-default`. |

## Units

Use `--space-*` (4–32), `--radius-*`, `--shadow-*`, and `--duration-fast`. Lane controls are at least 48px tall. Body text on the lane is 14px or larger.

## Cart row

Match the voice-kiosk row, not its palette. One line is the name, a quantity stepper, and the line price. Under it, each option group is a label plus chips. Size shows every choice. Other groups show the chosen chip until the label is pressed. Selected chips use `brand_soft`. The total stays on `accent`.

## Adding a template

Register the component. Read `--kiosk-*` and the portal units. Do not invent a second color set.
