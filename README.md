# SnapOrder Kiosk

Car-lane screen. Staff sign in. The person in the car does not.

The kiosk now features the Snap Coffee identity: espresso and citrus colors, custom product photography, a persistent voice companion, editable drink options, and pickup confirmation. English and Arabic layouts can be switched from the header.

The separate `/kiosk/dual-screen` concept shows an outdoor drive-through installation: a SnapOrder voice-ordering enclosure beside static Snap Coffee menu signage. Each has its own weatherproof cabinet, canopy and pedestal, with a real gap between the units and a photographic street setting. The solution screen retains its promotional banner. It uses independent terracotta/cream styling, menu data, state, and assets in `src/features/dual-display` and `public/assets/dual-screen`. No region scrolls; longer orders use explicit page controls. Its voice samples are simulated locally and do not capture microphone audio. The original `/kiosk` page remains available.

The voice preview uses the existing scripted demo backend. Sample phrase buttons simulate a recognized request and update the cart; no microphone audio is recorded. The initial two-item cart is sample data. “Start fresh” clears it for a new customer.

Typography is self-hosted, so builds do not need access to Google Fonts. On Windows environments where Turbopack's CSS worker fails, use `npm run build -- --webpack` for the production build.

```bash
npm run dev -- -p 3010
```

Open http://127.0.0.1:3010/sign-in. Local and Vercel both use the built-in demo lane. Set `KIOSK_API_URL=http://127.0.0.1:4500` and run `npm run mock` only when you want the separate Postman mock.

## Vercel

Push this folder as the repository root. If the GitHub repo is the whole workspace, set the Vercel root directory to `snap-order-kiosk-screen-v1`.

Leave `KIOSK_API_URL` unset. Do not point it at `127.0.0.1`. Optionally set `NEXT_PUBLIC_SITE_URL` to the public Vercel URL. No other environment variables are required.

## Demo accounts

Password for every account: `demo-lane`

| Email | What you see |
| --- | --- |
| `lane.en@demo` | English, left to right, Snap Coffee |
| `lane.stage@demo` | Arabic, right to left, Snap Coffee |

The account returns `template_id` and theme. An unknown template id falls back to the stage layout.
