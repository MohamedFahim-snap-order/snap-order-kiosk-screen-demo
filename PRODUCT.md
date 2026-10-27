# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, React 19, TypeScript, Tailwind v4. Libraries are the vendor-portal subset needed for this demo: TanStack Query, React Hook Form, Zod, Sonner, Lucide, clsx, tailwind-merge, server-only. No Redux, no next-themes, no i18n package, no ElevenLabs SDK.

## Users

A staff member signs in with a kiosk account to open the lane screen. That account belongs to a branch, and the branch belongs to a vendor. The person in the car does not sign in. They hear and read an agent after the lane detects a car.

## Product Purpose

Give a branch a car-lane screen whose layout, language direction, and colors come from that vendor. Success for this demo is signing in as different kiosk accounts and seeing a different template or palette, then a scripted agent reply after a stand-in car arrival.

## Positioning

The lane is not one shared skin. The backend names the template and the color tokens. The screen only renders that payload.

## Operating Context

The screen sits on a vendor car lane and must stay readable from tablet width through a desktop monitor. A sensor will start the agent in production. This demo uses a Car arrived control and a polled event endpoint. The real API will be Laravel. ElevenLabs audio is later, behind the same event transport.

## Capabilities and Constraints

- Sign-in is work email and password only.
- Two demo accounts, password `demo-lane`. Each account returns one locale, the matching direction, and one scheme. The screen job stays the same: start the agent, hear the latest line, add products, and open checkout.
  - `lane.en@demo` — English, left to right, light
  - `lane.stage@demo` — Arabic, right to left, dark
- Locale, direction, and light or dark come from that account. An account does not carry both languages or both directions.
- Ordering, menus, cart, a vendor switcher, real sensor hardware, Laravel, and ElevenLabs audio are out of scope.
- Unknown `templateId` falls back to `lane-stage` and shows a notice.

## Brand Commitments

The product name is SnapOrder. Sign-in uses the vendor portal shell: teal and orange, email and password. Lane colors are not a second brand; they come from the payload.

## Evidence on Hand

Demo accounts and scripted agent lines are synthetic and labeled as demo data. No customer logos, prices, or testimonials are available. Do not invent them.

## Product Principles

- The vendor payload decides layout, direction, and color.
- The customer never authenticates on this screen.
- Production replaces the mock and the sensor button without rewriting templates.
- Routes stay thin. Features own UI, validation, mapping, and data access.
- The lane must stay readable at a glance from a car.

## Accessibility & Inclusion

Arabic and English, with direction from the payload. Touch targets at least 48px. Text contrast at least 4.5:1. The latest agent line is announced in a live region. Motion respects reduced-motion.
