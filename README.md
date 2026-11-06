# Alba

A private, Spanish-first companion for the first weeks after a baby arrives, built as a web app with WhatsApp reminders.

Alba helps a new mom keep track of how she is healing, explains what to expect week by week, points her to nearby help, and gets her to her follow-up visit. When something looks wrong, it sends her to her doctor fast. It never diagnoses.

> **Status:** hackathon build. It runs locally with one demo user and no login. Some parts are live and some are simulated on purpose; see [Live vs simulated](#live-vs-simulated).

## Contents

- [Why Alba exists](#why-alba-exists)
- [Principles that shape every screen](#principles-that-shape-every-screen)
- [Live vs simulated](#live-vs-simulated)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [The 3-minute demo path](#the-3-minute-demo-path)
- [Pages](#pages)
- [How Claude is used (and what never leaves the server)](#how-claude-is-used-and-what-never-leaves-the-server)
- [Languages and content](#languages-and-content)
- [Data and reset](#data-and-reset)
- [Project structure](#project-structure)
- [Testing and verification](#testing-and-verification)
- [Working on Alba](#working-on-alba)
- [Known limits](#known-limits)
- [Documents](#documents)

## Why Alba exists

Many mothers are left alone after birth, and as many as 40% skip the follow-up visit. Spanish speakers are hit harder on access; in Mexico about half skip the postnatal checkup (problem statement in `docs/SPEC.md`).

The goal: a private, Spanish-first companion that tracks healing, teaches week by week, connects moms to promotoras (community health workers), and gets her to the checkup.

The success measure is simple: **she made the visit**, with two touchpoints reached rather than one. No numeric target is set yet (spec open question Q-17).

## Principles that shape every screen

These are hard rules from `CLAUDE.md` and the spec. Changes must respect them.

1. **Tracking, information and escalation only. Never diagnosis** (OOS-1). Every health answer ends with the disclaimer (REQ-39). Red-flag symptoms always say to call her doctor now, never reassurance (REQ-36).
2. **Discreet on a shared phone.** Nothing on screen, in the page title or in a notification may say what the app is about (REQ-2, REQ-44). `scripts/rehearse.mjs` checks every page for forbidden words.
3. **Spanish first** (REQ-3). The app starts in Spanish; a dropdown switches to English (REQ-53). Ask Alba answers in the language she asks in (REQ-35).
4. **Minimal data.** Check-ins and notes stay on the server with no real name (REQ-29).
5. **Claude sees as little as possible.** See [How Claude is used](#how-claude-is-used-and-what-never-leaves-the-server).
6. **A `TBD → Q-n` in the spec means a decision is missing.** Stop and ask; don't guess, and don't change spec values (propose the change instead).

## Live vs simulated

The demo scope is **OOS-2**. Simulated items are marked `"simulated": true` in their data.

| Live | Simulated |
|---|---|
| Week 1 cards | WhatsApp messages |
| Ask Alba (the two demo questions go through Claude) | Circle content (community rooms) |
| Daily check-in with notes | The Day 3 to 41 timeline |
| Red-flag escalation | Promotora review and moderation |
| One-page summary (built locally) | |

Also built, outside that live list: the calendar on the dashboard, pelvic floor workouts by week (ticket T-009, in progress), the language selector, and an illustrated clinic map whose data is mock (a fictional rural town).

## Quick start

Requirements: Node.js with npm. Next.js 15 needs Node 18.18 or newer; this repo has been run on Node 26. `better-sqlite3` is a native module, so the first `npm install` compiles or downloads a binary.

```bash
npm install
npm run demo        # seeds the demo user, then starts http://localhost:3000
```

Open `http://localhost:3000`. There is no login. The demo user is already there (profile bubble at the top right).

Use another port with `npm run demo -- -p 3013`.

## Configuration

Create a `.env` file in the project root:

```
CLAUDE_API_KEY=your-key-here
```

- `.env.example` shows the variable name. **Never commit `.env`**; `.gitignore` excludes `.env` and `.env.*`.
- The key is read on the server only, from route handlers. It must never appear in client code or page source (REQ-50, AC-83).
- **Without a key** the app still runs. The two live Ask Alba questions fall back to their seed answers after 5 seconds. Everything else works.

## Scripts

| Command | What it does |
|---|---|
| `npm run demo` | Seeds the starter user, then starts the dev server |
| `npm run dev` | Starts the dev server only |
| `npm run seed` | Wipes and reloads the starter user (safe to repeat) |
| `node scripts/seed.mjs --reset` | Empties check-ins, profile and the simulated tables; keeps the schema |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | `tsc --noEmit` (type check) |
| `node --test tests/ lib/` | Runs the test suites |
| `node scripts/rehearse.mjs [baseUrl]` | Hits every route of a running server in demo order and checks for forbidden words |

**Warning:** don't run `npm run build` while the dev server runs from the same folder. It corrupts `.next`. Stop the server first; if it happens, delete `.next` and restart. To run two dev servers from one folder, set `NEXT_DIST_DIR` so they don't share a build directory (see `next.config.mjs`).

## The 3-minute demo path

Open `/` (no login; the demo user is already there), then:

1. **Day 3, WhatsApp welcome, in Spanish:** the timeline at `/recordatorios`
2. **Day 5, mood dip:** seeded check-ins on days 4 and 5; trigger it live at `/checkin` (mood 1 or 2), which leads to `/alerta?motivo=animo`
3. **Day 7, Circle moment:** `/circulo`
4. **Day 9, red flag (pad soaked in an hour):** `/checkin` with pad set to yes, which leads to `/alerta`; the cards are at `/banderas`
5. **Day 14, pelvic floor:** `/entrenamiento`
6. **Day 20, week-3 touchpoint:** `/recordatorios`
7. **Day 35 to 41, visit with prep checklist:** `/visita`
8. **One-page summary:** `/resumen`
9. **Visit-day reminder:** `/recordatorios`
10. **"She confirms she went":** `/visita`

Also: `/perfil` (edit delivery date, appointment, clinic phone), `/semana-1` (Week 1 cards), `/pregunta` (Ask Alba), `/clinicas` (clinic map).

Check everything before going on stage, with the server running: `node scripts/rehearse.mjs`.

## Pages

| Route | What it is | Status |
|---|---|---|
| `/` | Home dashboard with the calendar of check-ins and exercises | Built |
| `/checkin`, `/checkin/gracias` | Daily check-in: bleeding, pain, mood, healing, pad soaked, free-text note | Live |
| `/alerta` | Escalation screen for red flags and low mood | Live |
| `/banderas` | Red-flag warning-sign cards | Live |
| `/semana-1` | Six Week 1 milestone cards | Live |
| `/pregunta` | Ask Alba: Claude-backed answers with a disclaimer | Live (two demo questions) |
| `/resumen` | One-page summary she can print or save as PDF | Live, built locally |
| `/entrenamiento` | Pelvic floor workouts by week | Built (T-009 in progress) |
| `/perfil` | Profile: delivery date, appointment, clinic phone | Built |
| `/visita` | Visit prep checklist and "she went" confirmation | Demo data |
| `/recordatorios` | WhatsApp reminders and the Day 3 to 41 timeline | Simulated |
| `/circulo`, `/circulo/[room]` | Community Circle rooms by category | Simulated |
| `/clinicas` | Illustrated map of mock low-cost promotoras, clinics and community centers; a simulated "use my location" button that reads no real location | Mock data |
| `/api/pregunta` | Server route handler behind Ask Alba | Live |

## How Claude is used (and what never leaves the server)

Claude is called only from server-side route handlers, and only for what the spec allows (REQ-46, REQ-50).

| Feature | What Claude receives | Notes |
|---|---|---|
| Ask Alba | Only the question she typed and the page she is on | Never check-ins or notes (AC-72) |
| Workouts | Only the week number | |
| One-page summary | **Nothing. It is built locally** | Nothing is sent to the Claude API or any other service (REQ-46, AC-78) |
| Check-ins, notes, profile | **Never sent** | Stored in SQLite on the server |

Failure behavior:

- The two live Ask Alba questions fall back to their seed answer after 5 seconds if the API fails or is slow (AC-71).
- Other Claude-backed features show an error message on failure (AC-81).
- Sources Claude cites are flagged "sin verificar" (REQ-51, AC-84); the seed answers cite only their named sources.

## Languages and content

- Two languages: Spanish (`es`, the default) and English (`en`). The choice is stored in the `alba_lang` cookie. UI strings are in `lib/i18n/es.ts` and `lib/i18n/en.ts`.
- Health content is in `content/` as paired files: `week1.es.json` and `week1.en.json`, `redflags.*`, `guardrails.*`, `seed-qa.*`. Keys, ids and array lengths match across languages.
- Simulated demo data is in `content/demo/`: timeline, Circle posts and rooms, visit checklist, clinics, and `seed-user.json`.
- Sources are shown as organisation plus date. Phone numbers in the demo data are placeholders, and hotlines are US numbers only (OOS-4).
- `content/README.md` records every change made to the original text and why, including the source corrections.

## Data and reset

- Data lives in SQLite at `./data/alba.db`, which is git-ignored (as are the `-wal` and `-shm` files).
- On first run, with an empty profile table, the app creates the starter user and her check-ins by itself.
- The starter user: delivery date 2026-10-20, appointment 2026-11-30, check-ins on days 3 to 14, a mood dip on days 4 and 5, and a soaked pad on day 9 (`content/demo/seed-user.json`).
- `npm run seed` wipes and reloads the starter user. `node scripts/seed.mjs --reset` empties the tables and keeps the schema.
- There is no retention policy for the demo (OOS-3).

## Project structure

```
app/               Next.js App Router pages and server actions
  api/pregunta/    Ask Alba route handler
  checkin/ resumen/ semana-1/ pregunta/ banderas/ alerta/ circulo/
  visita/ recordatorios/ entrenamiento/ clinicas/ perfil/
components/        Shared UI: Button, Card, BottomNav, Header, Mascot, CalendarMonth, ...
lib/               Logic and data access
  ask-alba.ts      Seed matching and answer rules for Ask Alba
  claude.ts        Anthropic client; reads the key from .env on the server
  escalation.ts    Red-flag and low-mood escalation rules
  summary.ts       The one-page summary, built locally
  db.ts, seed-core.ts   SQLite access, schema and seeding
  i18n/            Spanish and English strings
content/           Health content (es/en) and simulated demo data
docs/              Spec, coverage map, research notes
scripts/           seed.mjs, rehearse.mjs
tests/             Integration tests (node:test)
tickets/           Ticket files and BOARD.md
```

Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, SQLite via `better-sqlite3`, and `@anthropic-ai/sdk`. It runs locally for the demo (REQ-52).

Visual style: warm paper and apricot tones with sage accents, one card and one button style, a 32px card radius, and reduced-motion support throughout (`app/globals.css`, `tailwind.config.ts`).

## Testing and verification

```bash
node --test tests/ lib/      # unit and integration tests
npm run lint                 # type check (tsc --noEmit)
node scripts/rehearse.mjs    # with the server running: every route, in demo order
```

Verify before calling anything done: run it, read the output. Capture exit codes directly (`npm test; echo $?`), never after a pipe, because `cmd | tail; echo $?` reports `tail`'s status, not the command's.

At the time of writing, `tsc --noEmit` reports three errors in test files (`lib/calendar.test.ts`, `lib/summary.test.ts`, `lib/today.test.ts`) about importing `.ts` paths without `allowImportingTsExtensions`. They do not affect the app build or the node tests.

## Working on Alba

- **Build from the spec.** `docs/SPEC.md` is the source of truth. Every ticket cites REQ and AC ids. `docs/COVERAGE.md` maps each input line to the spec.
- **Tickets** live in `tickets/T-NNN.md`. `tickets/BOARD.md` is generated, so edit the ticket files and never the board.
- **Branches:** feature work happens on `feat/...` branches, often in their own git worktree; an `integration` branch collects them.
- **Git hygiene:** stage files by name, never `git add -A`. Commit only when asked. No secrets in files.
- **Claude Code users:** `CLAUDE.md` holds the working rules the assistant follows in this repo.

## Known limits

These are scoped out of the hackathon demo on purpose:

- No real login, sign-up or consent screens; one demo user (OOS-6).
- WhatsApp messages, Circle content, the Day 3 to 41 timeline, promotora review and moderation are simulated (OOS-2). Audio tips have no audio files.
- US hotlines only; no Mexico hotlines (OOS-4).
- Full verification of sources Claude cites comes later (OOS-5).
- No retention policy (OOS-3), and a HIPAA review is deferred (OOS-7).
- Several decisions are still open in the spec (`## Open questions` in `docs/SPEC.md`), including how the summary is triggered and shared and what counts as revealing on a shared phone.

## Documents

| File | What it is |
|---|---|
| `docs/SPEC.md` | The spec: requirements, acceptance criteria, open questions, amendment log |
| `docs/COVERAGE.md` | Maps each input line to the requirement it became |
| `docs/research-*.md` | Research notes and sources behind the bleeding numbers, pelvic floor guidance, Week 1 cards, and mood and family content |
| `content/README.md` | Changes made to the content, and why |
| `content/demo/README.md` | What each simulated data file contains |
| `tickets/BOARD.md` | The current ticket board |
| `CLAUDE.md` | Working rules for Claude Code in this repo |
