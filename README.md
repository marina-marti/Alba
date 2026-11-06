# Alba

Compañera privada, en español, para las primeras semanas. Demo hackathon, se ejecuta en local.

## Run

```
npm install
cp .env.example .env   # then set CLAUDE_API_KEY
npm run dev            # http://localhost:3000
npm run build
```

- Stack: Next.js (App Router), TypeScript, Tailwind, SQLite (better-sqlite3).
- Data: `./data/alba.db` (git-ignored, created on first use).
- `lib/claude.ts` reads `CLAUDE_API_KEY` server-side only; never commit `.env`.
- Login is a mock (cookie `alba_demo`), one demo user.
