# Provenance — Rubric

## Origin

- Original project: `keyonehub-marketing-site-v2`, imported from `Fractal-Grid-AI/fractal_marketing_site` (5 commits, last one 2026-05-19).
- Archived before the change pass: `E:\Projects\_archive\rubric-pre-rebuild.bundle` (all refs plus the stash) and `E:\Projects\_archive\zips\rubric-pre-rebuild.zip`.
- Mode: change pass. The marketing shell was rewritten; the interactive decision demo is the same author's earlier work and was kept.

## What was removed

- Third-party marks and case-study imagery: Amazon, BMW, Maersk, Twilio, Visa, Mastercard, Squarespace, HubSpot, Intuit, Segment and Slack.
- The Stripe-derived palette, layout rhythm and copy.
- Payment, billing and inventory sections that did not describe this product.

## What is original to this repository

- The Rubric name, positioning, English and Spanish copy, palette, type system, SVG mark and Open Graph image.
- The page sections under `src/components/site` and the demo re-skin strings (thread, Rubric agent, approval wording).

## Third-party code and assets

- UI primitives from shadcn/ui (MIT) and Radix UI (MIT).
- `lucide-react` (ISC), `framer-motion` (MIT), `next-intl` (MIT).
- Fonts Instrument Serif, Instrument Sans and JetBrains Mono (SIL OFL 1.1), self-hosted at build time through `next/font`.
- No remote media, stock photography or AI-generated images. Every visual is CSS or SVG defined in the repository.

## Fictional data

`Acme` is a fictional account used by the scripted demo. The site does not claim real customers, certifications or integrations.

## Deployment

- Repo: <https://github.com/JORDANROBERTO74/rubric>
- Live: <https://rubric-hq.vercel.app>
- Release: `v1.0.0`
