# CLAUDE.md — Alba

Alba is a private, Spanish-first companion for the fourth trimester (web app + WhatsApp). Hackathon build, demo run locally.

## Source of truth
- `docs/SPEC.md` — build from it. Every ticket cites REQ/AC IDs. `docs/COVERAGE.md` maps input lines to the spec. `docs/research-bleeding.md` backs the bleeding numbers.
- A `TBD → Q-n` in the spec means a decision is missing: stop and ask, don't guess. Don't change spec values; propose the change instead.
- Demo scope is OOS-2: WhatsApp messages, Circle content, the Day 3–41 timeline, promotora review and moderation are simulated. Live: Week 1 cards, Ask Alba (two demo questions), check-in, red-flag escalation, one-page summary.

## Stack (REQ-52)
Next.js App Router, TypeScript, Tailwind. Claude API only from server-side route handlers; key from `.env` only (`CLAUDE_API_KEY`, already set by Marina) (REQ-50), never in client code or git. SQLite on the server. Run locally.

## Hard rules
1. Not a medical product: tracking, information and escalation only, never diagnosis (OOS-1). Every health answer ends with the disclaimer (REQ-39). Red-flag symptoms always say "llama a tu médico ahora", never reassurance (REQ-36).
2. Nothing on screen, in the page title or in notifications may say postpartum or medical (REQ-2, REQ-44).
3. Spanish first (REQ-3). Ask Alba answers in the language she asks in (REQ-35).
4. Claude API: Ask Alba sends only the typed question and the page she is on; the workouts send only the week number. Check-ins, notes and profile data never go to Claude; the one-page summary is built locally (REQ-46, D19:L1). On failure, the two live questions fall back to the seed answer after 5 seconds; other failures show an error message.
5. Stage files by name, never `git add -A`. Commit only when Marina says so. No secrets in files.
6. Verify before "done": run it, read the output.
