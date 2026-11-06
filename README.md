# Alba

- Alba is a private, Spanish-first companion for the first weeks after a baby arrives (web app plus WhatsApp).
- It tracks how a mom is doing, gives plain information, and sends her to her doctor fast when something looks wrong.
- Hackathon demo: runs locally, no login: the app starts with a ready user (Marina, from `content/demo/seed-user.json`).

## Run

```
npm install
npm run demo        # seeds the demo user, then starts http://localhost:3000
```

Put `CLAUDE_API_KEY=...` in `.env` (variable name only; never commit `.env`). Without a key, the two demo questions in Ask Alba fall back to the seed answer after 5 seconds.

Another port: `npm run demo -- -p 3013`.

## Live vs simulated (OOS-2)

- Live: Week 1 cards, Ask Alba with the 2 demo questions, check-in, red-flag escalation, one-page summary.
- Simulated: WhatsApp messages, Circle content, the Day 3-41 timeline, promotora review and moderation (content in `content/demo/*.json`).

## Demo path (3 minutes)

Open `/` (no login; Marina is already there, profile bubble top right), then:

1. Day 3, welcome on WhatsApp, in Spanish: timeline at `/recordatorios`
2. Day 5, mood dip: seeded check-ins on days 4-5; trigger it live at `/checkin` (mood 1-2) -> `/alerta?motivo=animo`
3. Day 7, Circle moment: `/circulo`
4. Day 9, red flag (pad soaked in an hour): `/checkin` with pad = yes -> `/alerta`; cards at `/banderas`
5. Day 14, pelvic floor: `/entrenamiento`
6. Day 20, week-3 touchpoint: `/recordatorios`
7. Day 35-41, visit with prep checklist: `/visita`
8. One-page summary: `/resumen`
9. Visit-day reminder: `/recordatorios`
10. "She confirms she went": `/visita`

Also: `/perfil` (edit delivery date, appointment, clinic phone), `/semana-1` (cards), `/pregunta` (Ask Alba).

Check everything before going on stage (server running): `node scripts/rehearse.mjs [baseUrl]`.

## Reset

- On first run (empty profile table) the app creates the starter user and her check-ins by itself.
- `npm run seed` wipes and reloads the starter user (safe to repeat).
- `node scripts/seed.mjs --reset` empties check-ins, profile and the simulated tables (schema kept).
- Data lives in `./data/alba.db` (git-ignored).

## Warning

Do not run `npm run build` while the dev server runs in the same folder: it corrupts `.next`. Stop the server first (if it happens, delete `.next` and restart).

## Stack

Next.js (App Router), TypeScript, Tailwind, SQLite (better-sqlite3). The Claude API is called only from server-side route handlers.
