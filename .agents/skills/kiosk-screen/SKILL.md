---
name: kiosk-screen
description: Builds and edits the SnapOrder car-lane kiosk. Use when changing sign-in, lane templates, vendor theme tokens, the sensor stand-in, or the kiosk mock API in snap-order-kiosk-screen-v1.
---

# Kiosk screen

## Rules

- Sign-in keeps the SnapOrder teal and orange shell. Lane colors come only from bootstrap CSS variables. No hex inside `src/templates/`.
- A new layout is a component plus one entry in `src/templates/registry.ts`. Unknown ids fall back to `lane-stage` and show `copy.fallbackNotice`.
- Templates receive the same slots: identity, presence, utterance, transcript, status, controls, notice.
- `cookies()` and `headers()` stay out of `page.tsx`. Session reads live in `src/lib/auth/session.ts`.
- The UI talks to the lane API through `src/lib/api/kiosk-client.ts`. `KIOSK_API_URL` selects the local Postman mock. When it is unset, or points at localhost on Vercel, `src/features/kiosk-session/demo/demo-lane.ts` answers. Do not call ElevenLabs or the sensor hardware from a template.
- Swap `pollingTransport` when the live stream arrives. Do not rewrite templates for SSE or a websocket.
- Arabic and English copy for the lane comes from the payload. Direction is `dir` on the lane root.

## Demo accounts

Password for all: `demo-lane`

- `lane.en@demo` — English, left to right, light
- `lane.stage@demo` — Arabic, right to left, dark

## Mock

`postman/mocks/kiosk-screen/` is local only. Run `npm run mock`, then `npm run dev`. Vercel does not run that mock. Leave `KIOSK_API_URL` unset there so the built-in demo lane serves sign-in, bootstrap, presence, and events.
