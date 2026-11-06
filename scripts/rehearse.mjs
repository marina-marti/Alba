// Rehearsal: hits every route of a running server in demo order.
// Usage: node scripts/rehearse.mjs [baseUrl]   (default http://localhost:3000)
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = ["/", "/perfil", "/checkin", "/semana-1", "/pregunta", "/banderas", "/alerta",
  "/alerta?motivo=animo", "/resumen", "/circulo", "/recordatorios", "/visita", "/entrenamiento"];
const forbidden = /postpartum|posparto|medical/i;
let failed = false;

for (const r of routes) {
  let status = 0, bad = null;
  try {
    const res = await fetch(base + r, { redirect: "manual" });
    status = res.status;
    const html = await res.text();
    const m = html.match(forbidden);
    if (m) bad = m[0];
  } catch (e) {
    bad = `unreachable (${e.cause?.code ?? e.message})`;
  }
  const ok = status === 200 && !bad;
  if (!ok) failed = true;
  console.log(`${ok ? "PASS" : "FAIL"}  ${String(status).padEnd(3)}  ${r}${bad ? `  [${bad}]` : ""}`);
}
console.log(`${failed ? "FAIL" : "PASS"}  forbidden-word check (postpartum, posparto, medical) over all routes`);

// Which demo beats the seeded data supports.
console.log("\nSeeded data vs demo beats:");
try {
  const db = new Database(path.join(root, "data", "alba.db"), { readonly: true });
  const rows = db.prepare("SELECT * FROM checkins ORDER BY day ASC, id ASC").all();
  // Real lib/escalation.ts (Node strips the types); history = earlier check-ins.
  const { escalationFor } = await import(new URL("../lib/escalation.ts", import.meta.url));
  const esc = (c, i) => escalationFor(c, rows.slice(0, i));
  const dip = rows.map((c, i) => ({ c, e: esc(c, i) })).find((x) => x.e === "mood");
  const pad = rows.map((c, i) => ({ c, e: esc(c, i) })).find((x) => x.e === "pad");
  const line = (ok, t) => console.log(`${ok ? "PASS" : "FAIL"}  ${t}`);
  line(rows.length > 0, `${rows.length} seeded check-ins`);
  line(!!dip, dip ? `mood dip: ${dip.c.day} (mood ${dip.c.mood}) -> escalationFor = "mood" -> /alerta?motivo=animo` : "mood dip: not found (days 4-5 expected)");
  line(!!pad, pad ? `pad soak: ${pad.c.day} -> escalationFor = "pad" -> /alerta` : "pad soak: not found (day 9 expected)");
  const p = db.prepare("SELECT appointment_date FROM profile WHERE id=1").get();
  line(!!p?.appointment_date, `visit beat: appointment_date ${p?.appointment_date ?? "missing"}`);
  if (!dip || !pad || !p) failed = true;
} catch (e) {
  console.log(`FAIL  cannot read data/alba.db (${e.message}); run npm run seed`);
  failed = true;
}
process.exit(failed ? 1 : 0);
