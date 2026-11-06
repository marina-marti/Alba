# content/
- `week1.es.json`: six Week 1 cards (D2:L5-L10). Serves REQ-7, REQ-11; AC-11, 12, 18, 80, 88, 89.
- `redflags.es.json`: Card 3 flags, `bleeding: true` marks bleeding items. Serves REQ-25, REQ-7; AC-80, 88.
- `seed-qa.json`: five Q&As (D2:L14-L18) + shared disclaimer. Serves REQ-40, 39, 34; AC-61, 62, 60, 52.
- `guardrails.es.json`: Ask Alba rules (D2:L12). Serves REQ-34-39; AC-52 to 60.
Changes to D2 text:
1. Card 1: red 3 -> 3-4 days (C-1, D7:L1); pink/brown "2-4 semanas" -> ~14 days, total up to 6 weeks (D8:L6; research: no source gives 2-4 weeks).
2. Cards 1, 3, QA-1: "más de 1 toalla por hora" -> "una toalla cada hora" (owner; Cleveland Clinic wording).
3. Card 1: added a call line (pad hourly, golf-ball clots) because AC-80/88 require it on Cards 1 and 3. Card 3 clots: "del tamaño de una pelota de golf o más grandes".
4. QA-1: source "MSD Manual / CDC Hear Her" -> "MSD Manual / Cleveland Clinic" (CDC page 404).
5. QA-2, 4, 5: disclaimer appended (D4:L1). QA-4 and QA-5 sources are our wording; D2 names none.
6. Typographic only: Card 3 heading and guardrail phrases kept as in D2 (accents restored in "médico"). Tea text verbatim.

## Source corrections 2026-11-06
Applied from `docs/research-sources-mood-family.md` and `docs/research-sources-cards.md` (WebFetch summaries; spot-check live pages before shipping). Sources shown as organisation plus date; titles containing "posparto/postpartum" are cited by organisation and date only (REQ-2). Not cited, not read: ACOG, Mayo Clinic, HRSA primary page.
1. Card 1 mood line: source line added (NIMH rev. 2023; MedlinePlus act. 9 dic 2025). Card 5: `source` field added (NHS rev. 18 mar 2026; NIMH rev. 2023).
2. QA-4 source: NIMH, Perinatal Depression (rev. 2023); HRSA, National Maternal Mental Health Hotline (announcement 16 May 2023, read via a repost). QA-5 source: NHS, Postnatal depression (rev. 18 mar 2026); NIMH (rev. 2023). They replace an internal pointer / hotline-only label.
3. Baby-blues timing, Card 1 and QA-4: "la primera semana" -> "las primeras dos semanas" (NIMH "first 2 weeks", NHS "within 2 weeks", Cleveland "a week or two"). "Más de 2 semanas o empeora" kept. Added "si se siente muy intenso, pide ayuda antes" (NIMH: "severe or last longer than 2 weeks").
4. Chamomile, QA-2 and Card 4: removed "suele considerarse suave" and "tómala con moderación". Now says no safety data while breastfeeding, ask doctor or promotora first (LactMed "No data exist on the safety of chamomile in nursing mothers"; NCCIH). QA-2 source: LactMed (NIH), Chamomile, rev. 15 feb. 2021; NCCIH, Chamomile, nov. 2024, plus the traditional label. Disclaimer ending kept.
5. Ice, Card 4: "24–48 h" -> "24 horas" (MSD Manual, MedlinePlus: first 24 hours; no source read says 48).
6. "Sin fuente clínica" added to: cuarentena foods (Card 4), nettle and red raspberry leaf (Card 4), "comida caliente" (Card 5, QA-5). Sage/peppermint "pueden bajar la leche" (Card 4) and QA-2 line now end "(sin confirmar)"; LactMed says sage "purportedly", peppermint sentence not obtained.
7. QA-3 source label "NHS — folletos de fisioterapia posparto" -> "NHS — folletos de fisioterapia" (word removed so content/ has no "posparto"; no claim changed).
Deliberately unchanged: all warning signs (incl. "caliente" in the wound sign, not in sources), bleeding numbers, Card 6 "nada de abdominales" (open item for Marina), Card 3 hotline line, `redflags.es.json`.
