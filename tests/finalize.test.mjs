import test from "node:test";
import assert from "node:assert/strict";
import { finalize } from "../lib/claude-generate.ts";

const g = { disclaimer: "Esto no es consejo médico — pregunta a tu médico o promotora." };

test("English: the model's own 'not medical advice' sentence is dropped, ours is the only disclaimer, no 'medical'", () => {
  const out = finalize(
    { answer: "Chamomile is traditional. This is not medical advice. Ask your doctor first. Sources: LactMed.", sources: ["LactMed (NIH)"] },
    "en", g, ["LactMed (NIH)"]);
  assert.equal((out.match(/not health advice/gi) ?? []).length, 1);
  assert.ok(!/medical/i.test(out), out);
  assert.ok(out.endsWith("This is not health advice — ask your doctor or promotora."));
});

test("Spanish: a model-written disclaimer is replaced by the exact one, once", () => {
  const out = finalize(
    { answer: "Puede ser normal. Esto no es consejo médico. Fuente: MSD.", sources: ["MSD Manual"] },
    "es", g, ["MSD Manual"]);
  assert.equal((out.match(/Esto no es consejo médico — pregunta a tu médico o promotora\./g) ?? []).length, 1);
  assert.equal((out.match(/no es consejo médico/gi) ?? []).length, 1);
});
