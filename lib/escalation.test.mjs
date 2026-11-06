import test from "node:test";
import assert from "node:assert/strict";
import { escalationFor } from "./escalation.ts";

const base = { day: "2026-11-06", bleeding: 2, pain: 2, mood: 4, healing: 3, pad_soak: 0, note: null };
let n = 0;
const past = (mood, extra = {}) => ({ ...base, mood, id: ++n, created_at: `2026-11-0${n}T10:00:00Z`, ...extra });

test("no escalation on a normal check-in", () => assert.equal(escalationFor(base, [past(4)]), null));
test("pad soak", () => assert.equal(escalationFor({ ...base, pad_soak: 1 }, []), "pad"));
test("mood 1 or 2 twice in a row", () => {
  n = 0;
  assert.equal(escalationFor({ ...base, mood: 2 }, [past(1)]), "mood");
  assert.equal(escalationFor({ ...base, mood: 1 }, [past(2)]), "mood");
});
test("a mood of 1 escalates at once, even with no history", () => {
  assert.equal(escalationFor({ ...base, mood: 1 }, []), "mood");
  assert.equal(escalationFor({ ...base, mood: 1 }, [past(5)]), "mood");
});
test("a single 2 is not enough", () => assert.equal(escalationFor({ ...base, mood: 2 }, []), null));
test("low mood after a good one is not enough", () => {
  n = 0;
  assert.equal(escalationFor({ ...base, mood: 2 }, [past(1, { created_at: "2026-11-01T00:00:00Z" }), past(4, { created_at: "2026-11-02T00:00:00Z" })]), null);
});
test("mood 3 breaks the streak", () => assert.equal(escalationFor({ ...base, mood: 2 }, [past(3)]), null));
test("latest already in history is ignored", () => {
  n = 0;
  const latest = past(2);
  assert.equal(escalationFor(latest, [latest]), null);
});
test("self-harm keywords, accents and case insensitive", () => {
  for (const note of ["A veces pienso en hacerme DAÑO", "quiero hacerle daño al bebé", "Quitarme la vida", "pensamientos SUICIDAS", "Suicidio", "self-harm", "thoughts of Self Harm", "I want to hurt myself"]) {
    assert.equal(escalationFor({ ...base, note }, []), "selfharm", note);
  }
});
test("harmless notes", () => assert.equal(escalationFor({ ...base, note: "Dormí poco, me duele la espalda" }, []), null));
