// Run: node --test tests/   Fake clients only; never the real API.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { answerQuestion } from "../lib/ask-alba.ts";
import { buildGenerate, parseReply } from "../lib/claude-generate.ts";
import { buildSummary } from "../lib/summary.ts";

const G = JSON.parse(fs.readFileSync("content/guardrails.es.json", "utf8"));
const GEN = JSON.parse(fs.readFileSync("content/guardrails.en.json", "utf8"));
const D = G.disclaimer;
const LIVE = "¿Es normal este sangrado en el día 9?";
const ok = (o) => async () => JSON.stringify(o);
const ES = (g) => ({ question: "¿Puedo teñirme el pelo?", page: "", guardrails: g });

test("prompt to Claude contains only the question and the page", async () => {
  let seen;
  const gen = buildGenerate(async (a) => { seen = a; return JSON.stringify({ answer: "Hola.", sources: ["NIMH"] }); });
  await answerQuestion({ question: "¿Puedo teñirme el pelo?", page: "semana-1" }, { generate: gen });
  assert.equal(seen.messages.length, 1);
  assert.equal(seen.messages[0].content, "Página: semana-1\nPregunta: ¿Puedo teñirme el pelo?");
  assert.doesNotMatch(JSON.stringify(seen), /delivery_date|appointment_date/i);
});

test("malformed JSON / non-JSON / missing answer fall back to the seed", async () => {
  for (const raw of ["no json at all", '{"answer": ', '{"sources":["x"]}', '{"answer":""}']) {
    const r = await answerQuestion({ question: LIVE }, { generate: buildGenerate(async () => raw) });
    assert.equal(r.usedSeed, true, raw);
    assert.equal(r.kind, "seed-fallback");
  }
  assert.equal(parseReply("```json\n{\"answer\":\"a\",\"sources\":[\"b\"]}\n```").answer, "a");
});

test("a throwing client falls back to the seed", async () => {
  const r = await answerQuestion({ question: LIVE }, { generate: buildGenerate(async () => { throw new Error("401"); }) });
  assert.equal(r.usedSeed, true);
});

test("disclaimer appended exactly once (es) and the English one for English", async () => {
  const es = await answerQuestion({ question: "¿Puedo teñirme el pelo?" }, { generate: buildGenerate(ok({ answer: "Pregunta a tu promotora.", sources: ["NIMH"] })) });
  assert.ok(es.answer.endsWith(D));
  assert.equal(es.answer.split(D).length, 2);
  const withIt = await buildGenerate(ok({ answer: `Ok. ${D}`, sources: ["NIMH"] }))(ES(G));
  assert.equal(withIt.split(D).length, 2);
  const en = await buildGenerate(ok({ answer: "Ask your promotora.", sources: ["NIMH"] }))({ question: "Can I dye my hair this week?", page: "", guardrails: GEN });
  assert.ok(en.endsWith(GEN.disclaimer));
});

test("unknown source flagged; known not; English flag in English; no sources flagged", async () => {
  const t = await buildGenerate(ok({ answer: "Respuesta.", sources: ["Blog de mamás", "NIMH"] }))(ES(G));
  assert.match(t, /Blog de mamás \(sin verificar\)/);
  assert.doesNotMatch(t, /NIMH \(sin verificar\)/);
  const en = await buildGenerate(ok({ answer: "Answer.", sources: ["Some blog"] }))({ question: "Can I dye my hair this week?", page: "", guardrails: GEN });
  assert.match(en, /Some blog \(unverified\)/);
  const noSrc = await buildGenerate(ok({ answer: "Respuesta.", sources: [] }))(ES(G));
  assert.match(noSrc, /sin verificar/);
});

test("postpartum/posparto never appears in the answer", async () => {
  const t = await buildGenerate(ok({ answer: "El posparto y el Postpartum son largos.", sources: ["NIMH"] }))(ES(G));
  assert.doesNotMatch(t, /posparto|postpartum/i);
  const en = await buildGenerate(ok({ answer: "Postpartum is long.", sources: ["NIMH"] }))({ question: "Can I dye my hair this week?", page: "", guardrails: GEN });
  assert.doesNotMatch(en, /postpartum/i);
  assert.match(en, /after birth/);
});

test("slow client: live question gets seed after the timeout; other question gets the error path", async () => {
  const slow = buildGenerate(() => new Promise((r) => setTimeout(() => r('{"answer":"late","sources":[]}'), 400)));
  const t0 = Date.now();
  const live = await answerQuestion({ question: LIVE }, { generate: slow, timeoutMs: 50 });
  assert.equal(live.usedSeed, true);
  assert.ok(Date.now() - t0 < 300);
  const other = await answerQuestion({ question: "¿Puedo teñirme el pelo?" }, { generate: slow, timeoutMs: 50 });
  assert.equal(other.kind, "error");
  assert.ok(other.answer.endsWith(D));
});

test("red flag never reaches the client", async () => {
  let called = false;
  const r = await answerQuestion({ question: "empapo una toalla cada hora" }, { generate: buildGenerate(async () => { called = true; return "{}"; }) });
  assert.equal(called, false);
  assert.match(r.answer, /llama a tu médico ahora/i);
});

test("model-written source line is replaced (no duplicate); English answer ends with the English disclaimer only", async () => {
  const t = await buildGenerate(ok({ answer: "Respuesta. Fuente: Blog X.", sources: ["Blog X"] }))(ES(G));
  assert.equal(t.match(/Fuente/g).length, 1);
  const r = await answerQuestion({ question: "Can I dye my hair this week?" }, { generate: buildGenerate(ok({ answer: "Ask.", sources: ["NHS"] })) });
  assert.ok(r.answer.endsWith(GEN.disclaimer));
  assert.doesNotMatch(r.answer, /Esto no es consejo/);
});
