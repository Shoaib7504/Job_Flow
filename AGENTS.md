<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# job-flow

Next.js 16.3.1 / React 19 / Tailwind v4 app. App Router only (`src/app`). Single commit from `create-next-app`; the code is early WIP.

## Commands

- `npm run dev` — dev server
- `npm run build` / `npm run start` — production build/run
- `npm run lint` — `eslint` (flat config, `eslint.config.mjs`); no `--fix` in the script
- No test framework, no typecheck (JS, `jsconfig.json`), no CI configured

## Conventions

- `@/*` → `src/*` (`jsconfig.json`)
- Components go in `src/app/Components/` (capital C)
- Tailwind v4 is CSS-first: design tokens and custom utilities live in `src/app/globals.css` (`@theme inline`, `@utility`). Use theme colors like `bg-background`, `text-foreground`, `text-muted-foreground` and utilities `label-caps`, `num`, `panel`, `hairline`, `paper-grid`, `noise`, `animate-flow` rather than ad-hoc hex values. Dark mode is `.dark` class-based.

## Known WIP / broken state

- `src/app/Components/Navbar.jsx` does not compile: it references `Logo` and `Link` (react-router-style `to=` prop) without any imports, and react-router is NOT a dependency. Use `next/link` (`href`). `npm run lint` currently fails on this file — fix it as part of any work here.
