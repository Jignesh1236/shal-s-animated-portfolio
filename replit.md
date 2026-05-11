# Vanshal Portfolio

A fullscreen animated portfolio for Vanshal (@one.shal) — a memer and content creator. Features 5 horizontal GSAP-animated panels with no traditional scroll, live memes fetched from Reddit via a backend proxy, and anime.js effects throughout.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, serves `/api`)
- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port 21113, serves `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Frontend: Pure HTML + GSAP 3 + anime.js (CDN), served by Vite
- Memes: meme-api.com proxied through `/api/memes`

## Where things live

- Portfolio HTML: `artifacts/portfolio/index.html` — self-contained with inline CSS + JS
- Memes proxy: `artifacts/api-server/src/routes/memes.ts`
- API routes: `artifacts/api-server/src/routes/`

## Architecture decisions

- Pure HTML file inside a Vite scaffold — Vite just serves `index.html` as-is; no React bundle
- No page scroll: wheel/touch/keyboard events navigate between 5 fullscreen GSAP panels
- Reddit memes fetched server-side via `/api/memes` (meme-api.com) to bypass CORS
- GSAP handles panel transitions; anime.js handles decorative animations (particles, counters, color flicker)

## User preferences

- No emojis anywhere in the UI
- Pure HTML (no React/framework for the portfolio itself)
- GSAP + anime.js via CDN
- Same-screen scroll effect with GSAP (no page scroll)
