# SnapOrder Kiosk

Car-lane screen. Staff sign in. The person in the car does not.

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
| `lane.en@demo` | English, left to right, light |
| `lane.stage@demo` | Arabic, right to left, dark |

The account returns `template_id` and theme. An unknown template id falls back to the stage layout.
