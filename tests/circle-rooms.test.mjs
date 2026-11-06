// Run: node --test tests/  (Circle rooms, REQ-56 / AC-101; content is simulated, OOS-2)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import Database from "better-sqlite3";
import { ensureRoomTable, insertRoomMessage, selectRoomMessages, selectLatestByRoom, agoParts } from "../lib/rooms-core.ts";

const load = (l) => JSON.parse(fs.readFileSync(`content/demo/circle-rooms.${l}.json`, "utf8"));
const es = load("es"), en = load("en");
const strings = (o) => (typeof o === "string" ? [o] : o && typeof o === "object" ? Object.values(o).flatMap(strings) : []);

test("eight rooms, same ids, slugs, icons and message counts in es and en", () => {
  assert.equal(es.rooms.length, 8);
  assert.deepEqual(en.rooms.map((r) => [r.id, r.slug, r.icon, r.messages.length]), es.rooms.map((r) => [r.id, r.slug, r.icon, r.messages.length]));
  assert.equal(new Set(es.rooms.map((r) => r.slug)).size, 8);
  for (const r of es.rooms) assert.ok(r.messages.length >= 6 && r.messages.length <= 10, r.id);
  for (const [a, b] of [[es, en]]) for (const [i, r] of a.rooms.entries())
    assert.deepEqual(b.rooms[i].messages.map((m) => [m.who, m.kind, m.minutesAgo]), r.messages.map((m) => [m.who, m.kind, m.minutesAgo]), r.id);
});

test("every file, room and message is marked simulated", () => {
  for (const f of [es, en]) {
    assert.equal(f.simulated, true);
    for (const r of f.rooms) {
      assert.equal(r.simulated, true, r.id);
      for (const m of r.messages) assert.equal(m.simulated, true, r.id);
    }
  }
});

test("message shape: who, kind, alias, text, duration on audio", () => {
  for (const f of [es, en]) for (const r of f.rooms) for (const m of r.messages) {
    assert.ok(["mom", "promotora"].includes(m.who));
    assert.ok(["text", "audio"].includes(m.kind));
    assert.ok(m.alias.trim() && m.text.trim() && Number.isInteger(m.minutesAgo) && m.minutesAgo >= 0);
    if (m.kind === "audio") { assert.equal(m.who, "promotora"); assert.match(m.duration, /^\d:\d\d$/); }
  }
});

test("no postpartum / posparto / medical anywhere", () => {
  for (const f of [es, en]) for (const s of strings(f)) assert.doesNotMatch(s, /postpartum|posparto|medical/i, s);
});

test("no phone numbers except the TLC-MAMA line in the Feeling low banner", () => {
  const phone = /\d[\d\-\s().]{6,}\d/;
  for (const f of [es, en]) for (const r of f.rooms) {
    const own = strings({ ...r, banner: r.id === "low" ? undefined : r.banner });
    for (const s of own) assert.doesNotMatch(s, phone, `${r.id}: ${s}`);
    if (r.id === "low") {
      assert.match(r.banner.text, /1-833-TLC-MAMA/);
      assert.match(r.banner.text, /\(1-833-852-6262\)/);
      assert.doesNotMatch(r.banner.text, /988/);
      assert.equal(r.banner.text.replace("1-833-TLC-MAMA", "").replace("(1-833-852-6262)", "").match(phone), null);
    }
  }
});

test("sensitive rooms carry their banner; discharge uses the red-flag wording and links to /banderas", () => {
  for (const f of [es, en]) {
    const by = Object.fromEntries(f.rooms.map((r) => [r.id, r]));
    for (const id of ["discharge", "low", "unsure"]) assert.ok(by[id].banner?.text, id);
    assert.equal(by.discharge.banner.link.href, "/banderas");
  }
  assert.match(es.rooms.find((r) => r.id === "discharge").banner.text, /cada hora.*pelota de golf.*mal.*fiebre/);
  assert.match(en.rooms.find((r) => r.id === "discharge").banner.text, /pad every hour.*golf ball.*foul.*fever/);
});

test("every sensitive mom message is directly followed by a promotora reply that sends her to the doctor", () => {
  const sensitive = /sangr|flujo|olor|coágulo|fiebre|dolor|duele|herida|triste|llorar|daño|discharge|smell|clot|fever|pain|hurts|wound|sad|cry|hurting|bleed|burning|ardiera/i;
  const doctor = /médico|clínica|doctor|clinic/i;
  for (const f of [es, en]) for (const r of f.rooms) {
    const ms = [...r.messages].sort((a, b) => b.minutesAgo - a.minutesAgo);
    ms.forEach((m, i) => {
      if (m.who !== "mom" || !sensitive.test(m.text)) return;
      const next = ms[i + 1];
      assert.ok(next && next.who === "promotora" && doctor.test(next.text), `${r.id}: ${m.text}`);
    });
  }
});

test("can't sleep keeps the demo beats: 3 am post, promotora audio reply, a mom's quick win", () => {
  for (const f of [es, en]) {
    const r = f.rooms.find((x) => x.id === "sleep");
    assert.match(r.messages[0].text, /3/);
    assert.ok(r.messages.some((m) => m.who === "promotora" && m.kind === "audio"));
    assert.ok(r.messages.filter((m) => m.who === "mom").length >= 3);
  }
});

test("stored message round trip against in-memory SQLite", () => {
  const db = new Database(":memory:");
  ensureRoomTable(db);
  ensureRoomTable(db); // idempotent
  const cols = db.prepare("PRAGMA table_info(sim_room_messages)").all().map((c) => c.name);
  assert.deepEqual(cols, ["id", "room", "alias", "text", "created_at"]);
  const t0 = new Date("2026-11-06T10:00:00Z");
  assert.equal(insertRoomMessage(db, "flujo", "Luna cálida", "  Hola  ", t0), true);
  assert.equal(insertRoomMessage(db, "flujo", "Sol suave", "   ", t0), false);
  assert.equal(insertRoomMessage(db, "pedir-ayuda", "Río suave", "x".repeat(900), t0), true);
  const rows = selectRoomMessages(db, "flujo");
  assert.equal(rows.length, 1);
  assert.deepEqual([rows[0].alias, rows[0].text, rows[0].created_at], ["Luna cálida", "Hola", t0.toISOString()]);
  assert.equal(selectRoomMessages(db, "pedir-ayuda")[0].text.length, 500);
  insertRoomMessage(db, "flujo", "A", "segundo", t0);
  assert.equal(selectLatestByRoom(db).flujo.text, "segundo");
  assert.deepEqual(selectRoomMessages(db, "nope"), []);
  db.close();
});

test("agoParts picks minutes, hours, days", () => {
  assert.deepEqual(agoParts(0), { key: "room.now", n: 0 });
  assert.deepEqual(agoParts(45), { key: "room.ago.min", n: 45 });
  assert.deepEqual(agoParts(120), { key: "room.ago.h", n: 2 });
  assert.deepEqual(agoParts(2500), { key: "room.ago.d", n: 2 });
});
