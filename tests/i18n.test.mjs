// Run: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { es } from "../lib/i18n/es.ts";
import { en } from "../lib/i18n/en.ts";
import { normLang, fmt } from "../lib/i18n/lang.ts";
import * as content from "../lib/content-paths.mjs";

test("es and en dictionaries have identical keys", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
});
test("no empty strings; same {placeholders} in both languages", () => {
  const ph = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join();
  for (const k of Object.keys(es)) {
    assert.ok(es[k].trim() && en[k].trim(), k);
    assert.equal(ph(en[k]), ph(es[k]), k);
  }
});
test("English UI strings never say postpartum or medical; numbers and hotline match", () => {
  for (const [k, v] of Object.entries(en)) assert.doesNotMatch(v, /postpartum|medical|posparto/i, k);
  for (const [k, v] of Object.entries(es)) assert.doesNotMatch(v, /posparto|postpartum/i, k);
  const nums = (s) => (s.match(/\d+/g) ?? []).join();
  for (const k of Object.keys(es)) if (!/^(checkin\.intro|alert\.callNow|summary\.footnote)$/.test(k)) assert.equal(nums(en[k]), nums(es[k]), k);
});
test("normLang: es default, only 'en' selects English", () => {
  assert.equal(normLang(undefined), "es");
  assert.equal(normLang("fr"), "es");
  assert.equal(normLang("EN"), "es");
  assert.equal(normLang(""), "es");
  assert.equal(normLang("en"), "en");
  assert.equal(fmt("Hi {n} {x}", { n: 3 }), "Hi 3 {x}");
});
test("content files exist for both languages with matching ids", () => {
  for (const [es_, en_] of content.PAIRS) {
    const a = JSON.parse(fs.readFileSync(es_, "utf8")), b = JSON.parse(fs.readFileSync(en_, "utf8"));
    const ids = (o) => JSON.stringify((o.cards ?? o.items ?? o.posts ?? o.events ?? []).map((x) => x.id ?? x.day));
    assert.equal(ids(b), ids(a), en_);
  }
});
