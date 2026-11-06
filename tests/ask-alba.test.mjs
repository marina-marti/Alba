// Run: node --test tests/   (Node >= 23.6 strips TS types natively; no deps)
import test from "node:test";
import assert from "node:assert/strict";
import { answerQuestion, withTimeout } from "../lib/ask-alba.ts";
import fs from "node:fs";

const G = JSON.parse(fs.readFileSync("content/guardrails.es.json", "utf8"));
const SEED = JSON.parse(fs.readFileSync("content/seed-qa.json", "utf8"));
const D = G.disclaimer;
const GE = JSON.parse(fs.readFileSync("content/guardrails.en.json", "utf8"));
const SEED_EN = JSON.parse(fs.readFileSync("content/seed-qa.en.json", "utf8"));
const DE = GE.disclaimer;

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
  for (const q of ["Empapo una toalla cada hora", "tengo fiebre y escalofríos", "pasé coágulos grandes", "dolor de cabeza muy fuerte"]) {
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
  for (const q of ["Me siento triste y no puedo dormir", "me siento muy deprimida"]) {
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
  assert.ok(en.answer.includes(GE.unsure_phrase));
  assert.ok(en.answer.endsWith(DE));
});
test("English seed question without generator answers from the English seed (REQ-35)", async () => {
  const r = await answerQuestion({ question: "Is chamomile tea ok for me?" });
  assert.equal(r.lang, "en");
  assert.equal(r.usedSeed, true);
  assert.match(r.answer, /^Chamomile is traditionally/);
});
test("every answer ends with the exact disclaimer", async () => {
  for (const q of ["hola", "¿Qué puedo pedirle a mi familia esta semana?", "fiebre"]) {
    assert.ok((await answerQuestion({ question: q })).answer.endsWith(D), q);
  }
  for (const q of ["what is the weather", "I have a fever"]) {
    assert.ok((await answerQuestion({ question: q })).answer.endsWith(DE), q);
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

// ---- English paths (REQ-35: answer language follows the QUESTION) ----
const EN_SEED_QUESTIONS = [
  "Is this bleeding normal on day 9?",
  "Can I drink chamomile tea?",
  "When can I start pelvic floor exercises?",
  "I feel sad and can't sleep",
  "How do I ask my family for help?",
];
test("English: the five seed questions answer from the English seed with the English disclaimer", async () => {
  assert.equal(SEED_EN.items.length, 5);
  for (const [i, it] of SEED_EN.items.entries()) {
    for (const q of [it.question, EN_SEED_QUESTIONS[i]]) {
      const r = await answerQuestion({ question: q, page: "semana-1" });
      assert.equal(r.lang, "en", q);
      assert.equal(r.usedSeed, true, q);
      assert.equal(r.answer, it.answer, q);
      assert.ok(r.answer.endsWith(DE), q);
      assert.equal(r.source, it.source, q);
    }
  }
});
test("English: match groups need every group (chamomile alone; family without ask/help does not match)", async () => {
  const r = await answerQuestion({ question: "Can my family do the dishes" });
  assert.equal(r.usedSeed, false);
  assert.match(r.answer, /^I can't answer that right now/);
});
test("English red flag: 'call your doctor now', no reassurance, never delegated, disclaimer", async () => {
  let called = false;
  for (const q of ["I am soaking a pad every hour", "chest pain since morning", "I have a fever", "I passed big clots", "severe headache and blurred vision"]) {
    const r = await answerQuestion({ question: q }, { generate: async () => { called = true; return "it is normal"; } });
    assert.equal(r.kind, "red-flag", q);
    assert.equal(r.lang, "en", q);
    assert.match(r.answer, /^Call your doctor now\./, q);
    assert.ok(r.answer.includes("call 911"), q);
    assert.doesNotMatch(r.answer.toLowerCase(), /normal|don't worry|do not worry|reassur|fine\b/, q);
    assert.doesNotMatch(r.answer, /[áéíóúñ]|llama|médico|Círculo/i, q);
    assert.ok(r.answer.endsWith(DE), q);
    assert.ok(r.source && !/señales/.test(r.source), q);
  }
  assert.equal(called, false);
});
test("English low mood: TLC-MAMA hotline text, English disclaimer, crisis skips the seed", async () => {
  for (const q of ["I feel so sad and hopeless", "I'm overwhelmed and anxious", "I want to hurt myself"]) {
    const r = await answerQuestion({ question: q });
    assert.equal(r.lang, "en", q);
    assert.match(r.answer, /1-833-TLC-MAMA/, q);
    assert.match(r.answer, /988/, q);
    assert.doesNotMatch(r.answer, /Círculo|\bno estás\b/i, q);
    assert.ok(r.answer.endsWith(DE), q);
  }
  const crisis = await answerQuestion({ question: "I am sad, can't sleep and want to hurt myself" });
  assert.equal(crisis.usedSeed, false);
  assert.match(crisis.answer, /^Feeling this way/);
});
test("English unsure: English phrase, source, disclaimer; failing generator also unsure", async () => {
  const r = await answerQuestion({ question: "Can I dye my hair this week?" });
  assert.equal(r.kind, "unsure");
  assert.equal(r.answer, `I can't answer that right now. Please ${GE.unsure_phrase} ${DE}`);
  assert.ok(r.source);
  const f = await answerQuestion({ question: "Can I dye my hair this week?" }, { generate: async () => null });
  assert.equal(f.kind, "error");
  assert.ok(f.answer.endsWith(DE));
});
test("English live question: slow generator falls back to the English seed (AC-71)", async () => {
  for (const it of SEED_EN.items.filter((i) => i.live)) {
    const r = await answerQuestion({ question: it.question }, { generate: () => new Promise((res) => setTimeout(() => res("late"), 300)), timeoutMs: 30 });
    assert.equal(r.usedSeed, true);
    assert.equal(r.answer, it.answer);
  }
});
test("English generated text gets the English disclaimer and English source label", async () => {
  const r = await answerQuestion({ question: "Can I dye my hair this week?" }, { generate: async (q) => { assert.equal(q.guardrails.disclaimer, DE); return "Sure."; } });
  assert.ok(r.answer.endsWith(DE));
  assert.equal(r.source, "Claude (unverified)");
});
test("answer language follows the question, not anything else: Spanish question stays Spanish", async () => {
  const r = await answerQuestion({ question: "¿Puedo tomar té de manzanilla?" });
  assert.equal(r.lang, "es");
  assert.ok(r.answer.endsWith(D));
});
test("no 'postpartum', 'medical' or 'posparto' in any English answer", async () => {
  const qs = [...EN_SEED_QUESTIONS, "I am soaking a pad every hour", "I feel so sad", "Can I dye my hair this week?"];
  for (const q of qs) {
    const r = await answerQuestion({ question: q });
    assert.doesNotMatch(r.answer + " " + r.source.replace(/Postnatal/g, ""), /postpartum|medical|posparto/i, q);
  }
});
