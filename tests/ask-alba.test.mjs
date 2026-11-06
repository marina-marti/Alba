// Run: node --test tests/   (Node >= 23.6 strips TS types natively; no deps)
import test from "node:test";
import assert from "node:assert/strict";
import { answerQuestion, withTimeout } from "../lib/ask-alba.ts";
import fs from "node:fs";

const G = JSON.parse(fs.readFileSync("content/guardrails.es.json", "utf8"));
const SEED = JSON.parse(fs.readFileSync("content/seed-qa.json", "utf8"));
const D = G.disclaimer;

test("five seed questions answer from the seed, with source and disclaimer", async () => {
  assert.equal(SEED.items.length, 5);
  for (const it of SEED.items) {
    const r = await answerQuestion({ question: it.question, page: "semana-1" });
    assert.equal(r.usedSeed, true, it.id);
    assert.ok(r.source.length > 0, it.id);
    assert.ok(r.answer.endsWith(D), it.id);
    assert.ok(r.answer.startsWith(it.answer.slice(0, 40)), it.id);
  }
});
test("seed matches loose wording", async () => {
  const r = await answerQuestion({ question: "puedo tomar te de manzanilla??" });
  assert.equal(r.usedSeed, true);
  assert.match(r.answer, /manzanilla/);
});
test("bleeding answer mentions red 3-4 days", async () => {
  const r = await answerQuestion({ question: SEED.items[0].question });
  assert.match(r.answer, /3–4 días/);
});
test("red flag: llama a tu médico ahora, no reassurance, disclaimer", async () => {
  for (const q of ["Empapo una toalla cada hora", "I am soaking a pad every hour", "tengo fiebre y escalofríos", "pasé coágulos grandes", "chest pain since morning", "dolor de cabeza muy fuerte"]) {
    const r = await answerQuestion({ question: q });
    assert.match(r.answer.toLowerCase(), /llama a tu médico ahora/, q);
    assert.doesNotMatch(r.answer.toLowerCase(), /normal|tranquila|no te preocupes|suele|don't worry|reassur/, q);
    assert.ok(r.answer.endsWith(D), q);
    assert.ok(r.source);
  }
});
test("red flag is not delegated to generate", async () => {
  let called = false;
  const r = await answerQuestion({ question: "empapo una toalla cada hora" }, { generate: async () => { called = true; return "es normal"; } });
  assert.equal(called, false);
  assert.match(r.answer, /llama a tu médico ahora/i);
});
test("low mood names TLC-MAMA (es, en, not-in-seed wording)", async () => {
  for (const q of ["Me siento triste y no puedo dormir", "me siento muy deprimida", "I feel so sad and hopeless"]) {
    const r = await answerQuestion({ question: q });
    assert.match(r.answer, /1-833-TLC-MAMA/, q);
    assert.ok(r.answer.endsWith(D), q);
  }
});
test("unsure: es and en, with phrase, source, disclaimer", async () => {
  const es = await answerQuestion({ question: "¿Puedo teñirme el pelo esta semana?" });
  assert.match(es.answer, /pregúntale a una promotora o en el Círculo\./);
  assert.match(es.answer, /^No tengo esa información/);
  assert.ok(es.answer.endsWith(D));
  assert.ok(es.source);
  const en = await answerQuestion({ question: "Can I dye my hair this week?" });
  assert.match(en.answer, /^I can't answer that right now/);
  assert.ok(en.answer.includes(G.unsure_phrase));
  assert.ok(en.answer.endsWith(D));
});
test("English seed question without generator answers in English, not Spanish seed", async () => {
  const r = await answerQuestion({ question: "Is chamomile tea ok for me?" });
  assert.match(r.answer, /^I can't answer/);
  assert.equal(r.lang, "en");
});
test("every answer ends with the exact disclaimer", async () => {
  for (const q of ["hola", "¿Qué puedo pedirle a mi familia esta semana?", "what is the weather", "fiebre"]) {
    assert.ok((await answerQuestion({ question: q })).answer.endsWith(D), q);
  }
});
test("no 'posparto' in displayed source", async () => {
  const r = await answerQuestion({ question: SEED.items[2].question });
  assert.doesNotMatch(r.source, /posparto/i);
});
test("generator receives question, page, guardrails; its text gets disclaimer + source", async () => {
  let got;
  const r = await answerQuestion({ question: "¿Puedo teñirme el pelo?", page: "semana-1" }, { generate: async (q) => { got = q; return "Respuesta."; } });
  assert.equal(got.page, "semana-1");
  assert.equal(got.guardrails.disclaimer, D);
  assert.ok(r.answer.endsWith(D));
  assert.ok(r.source);
  assert.equal(r.usedSeed, false);
});
test("withTimeout: slow generator -> null after ~timeout; fast passes; throw -> null", async () => {
  const t0 = Date.now();
  const slow = await withTimeout(() => new Promise((res) => setTimeout(() => res("late"), 400)), 50);
  assert.equal(slow, null);
  assert.ok(Date.now() - t0 < 300);
  assert.equal(await withTimeout(async () => "ok", 50), "ok");
  assert.equal(await withTimeout(async () => { throw new Error("x"); }, 50), null);
});
test("AC-71: slow or failing generator on a live question falls back to seed answer", async () => {
  const live = SEED.items.filter((i) => i.live);
  assert.equal(live.length, 2);
  for (const it of live) {
    const slow = await answerQuestion({ question: it.question }, { generate: () => new Promise((r) => setTimeout(() => r("late"), 500)), timeoutMs: 50 });
    assert.equal(slow.usedSeed, true);
    assert.ok(slow.answer.startsWith(it.answer.slice(0, 40)));
    const bad = await answerQuestion({ question: it.question }, { generate: async () => { throw new Error("boom"); } });
    assert.equal(bad.usedSeed, true);
  }
  const none = await answerQuestion({ question: "¿Puedo teñirme el pelo?" }, { generate: async () => null });
  assert.match(none.answer, /pregúntale a una promotora o en el Círculo/);
});
test("default timeout is 5000 ms", async () => {
  const m = await import("../lib/ask-alba.ts");
  assert.equal(m.GENERATE_TIMEOUT_MS, 5000);
});
