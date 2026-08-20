# JobFlow

A calm command center for your job search. Track applications, interviews, reminders, and career signals in one workspace — from the first "saved" role to the offer stage.

Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email/password (there is no backend — auth is mocked and persisted in `localStorage`), or click **Continue to the workspace** on the login page.

## Scripts

| Command          | What it does                      |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the dev server              |
| `npm run build`  | Production build                  |
| `npm run start`  | Serve the production build        |
| `npm run lint`   | Run ESLint                        |

## What the app does

An application ("dossier") moves through a fixed pipeline of stages:

```
SAVED → APPLIED → SCREENING → INTERVIEW → OFFER
```

Each dossier stores the company, role, location, salary, source, notes, a list of interviews, reminders, and an automatic timeline of every change.

## Project structure

```
src/
├── app/                      # Routes (App Router)
│   ├── layout.jsx            # Root layout: fonts, theme, providers, toasts
│   ├── page.jsx              # Marketing landing page (/)
│   ├── login/  register/     # Auth pages (mock auth)
│   ├── dashboard/            # Overview: stats, momentum chart, signals
│   ├── applications/         # List + filter/search, and [id]/ dossier detail
│   ├── pipeline/             # Kanban board — drag cards between stages
│   ├── calendar/             # Month view of interviews + reminders
│   ├── analytics/            # Funnel, source and cadence charts
│   ├── settings/             # Profile, search focus, notification prefs
│   ├── Components/           # Marketing site sections + RequireAuth guard
│   │   └── jobflow/          # App-shell components (sidebar, journey, toggles)
│   └── globals.css           # Tailwind v4 theme tokens + custom utilities
├── components/ui/            # Low-level UI primitives (button, input, dialog…)
├── hooks/                    # use-auth (auth context + mutations), use-mobile
└── lib/
    ├── store.js              # Client-side app store (useSyncExternalStore)
    ├── jobflow.js            # STAGES, SOURCES, date/stage helpers
    └── utils.js              # cn() — clsx + tailwind-merge
```

### Key files to know

- **`src/lib/store.js`** — the single source of truth for all applications. A tiny external store (`useSyncExternalStore`) exposed via `useStore()`, with actions like `add`, `setStage`, `addNote`, `addInterview`, `addReminder`, `toggleReminder`, and `remove`. Data lives in memory (not persisted), so refreshes reset it.
- **`src/lib/jobflow.js`** — pipeline constants (`STAGES`, `SOURCES`) and small date/stage helpers (`stageIndex`, `relative`, `fmtDate`).
- **`src/hooks/use-auth.js`** — mock auth. The user object is read/written to `localStorage` under `job-flow.user`; mutations for login/register/logout are stubs via TanStack Query. `RequireAuth` (in `src/app/Components/`) redirects signed-out visitors away from protected pages.
- **`src/app/Components/jobflow/AppShell.jsx`** — the shared sidebar layout used by every workspace page (dashboard, applications, pipeline, calendar, analytics, settings).

### Pages

| Route                     | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `/`                       | Marketing landing page                                         |
| `/login`, `/register`     | Mock sign-in / sign-up                                         |
| `/dashboard`              | Live stats, 8-week momentum chart, pipeline distribution        |
| `/applications`           | Filterable/sortable list, "New" dialog to create a dossier      |
| `/applications/[id]`      | Dossier detail: journey, timeline, notes, interviews, reminders |
| `/pipeline`               | Drag-and-drop kanban across the 5 stages                       |
| `/calendar`               | Month grid of upcoming interviews and reminders                |
| `/analytics`              | Funnel, by-source and cadence charts (recharts)                |
| `/settings`               | Profile and notification preferences (form only)               |

## Styling conventions

Tailwind v4 is CSS-first. Design tokens and custom utilities live in `src/app/globals.css`:

- Use theme colors (`bg-background`, `text-muted-foreground`, `bg-primary`…) instead of ad-hoc hex values.
- Reusable utilities: `label-caps`, `num`, `panel`, `hairline`, `paper-grid`, `noise`, `animate-flow`.
- Dark mode is `.dark` class-based and toggled by `src/app/Components/jobflow/ThemeToggle.jsx`.
- Fonts are loaded via `next/font/google` (Space Grotesk, Inter, JetBrains Mono) and exposed as CSS variables in the root layout.

## Current WIP / known issues

- `src/app/Components/Navbar.jsx` does not compile — it references `Logo` and a react-router-style `Link` without imports. Use `next/link` (`href`). This causes `npm run lint` to fail.
- There is no backend or persistence for applications — the store is in-memory only.
- No tests or type checking are configured (plain JS with `jsconfig.json`).
