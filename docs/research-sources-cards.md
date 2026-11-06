# Research sources: Week 1 cards 2, 3, 4, 6 and tea answer (qa-2)

Scope: claims in `content/week1.es.json` (w1-c2, w1-c3, w1-c4, w1-c6) and `content/seed-qa.json` qa-2. Mood/family and pelvic floor timing are covered elsewhere.
Method: pages fetched with WebFetch on 2026-11-06. Quotes are as returned by the fetch tool (it summarises pages; short quotes are exact text, but treat as machine-extracted and spot-check against the live page before shipping). Search summaries were not used as evidence.

## 1. Sources actually read

| ID | Source | Title | URL | Date shown |
|---|---|---|---|---|
| S1 | MSD Manual Consumer | Overview of Postpartum Care | https://www.msdmanuals.com/home/women-s-health-issues/postpartum-care/overview-of-postpartum-care | Full review Aug 2024; last updated Jul 2026 |
| S2 | MSD Manual Consumer | After Pregnancy and Childbirth (Postpartum): When to Call the Doctor | https://www.msdmanuals.com/home/multimedia/table/after-pregnancy-and-childbirth-postpartum-when-to-call-the-doctor | No review date; copyright 2026 |
| S3 | MSD Manual Professional | Postpartum Care | https://www.msdmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-care | Full review Apr 2024; last updated Jul 2026 |
| S4 | MedlinePlus | Episiotomy - aftercare | https://medlineplus.gov/ency/patientinstructions/000483.htm | Review date 5/29/2026 |
| S5 | MedlinePlus | Vaginal delivery - discharge | https://medlineplus.gov/ency/patientinstructions/000628.htm | Review date 11/8/2024 |
| S6 | MedlinePlus | After vaginal delivery - in the hospital | https://medlineplus.gov/ency/patientinstructions/000629.htm | Review date 11/8/2024 |
| S7 | CDC Hear Her | Urgent Maternal Warning Signs and Symptoms | https://www.cdc.gov/hearher/maternal-warning-signs/index.html | May 15, 2024 |
| S8 | NHS | Your body after the birth | https://www.nhs.uk/pregnancy/labour-and-birth/after-the-birth/your-body/ | Page last reviewed 25 April 2024 |
| S9 | Cleveland Clinic | Postpartum: Stages, Symptoms & Recovery Time | https://my.clevelandclinic.org/health/articles/postpartum | Last updated 02/27/2024 |
| S10 | North York General Hospital (Ontario) | Mother's Care After Delivery | https://nygh.on.ca/areas-care/maternal-newborn-and-paediatric-care/pregnancy-and-birth/mothers-care-after-delivery | No date; copyright 2026 |
| S11 | Somerset NHS Foundation Trust | Perineal care - Maternity | https://www.somersetft.nhs.uk/maternity-new/maternity/after-your-babys-birth/for-you/perineal-care | No date; copyright 2026 |
| L1 | LactMed (NLM), via UCSB mirror of NCBI | Chamomile (NBK501808) | https://git.lsit.ucsb.edu/publicdata/nih-gov/raw/commit/a3492137cada35c1427e5783c176e4344e6cbb56/www.ncbi.nlm.nih.gov/books/NBK501808/index.html%3Freport=reader (canonical: https://www.ncbi.nlm.nih.gov/books/NBK501808/) | Last Revision Feb 15, 2021 |
| L2 | LactMed, via mirror | Raspberry (NBK501785) | same mirror path with NBK501785 (canonical: https://www.ncbi.nlm.nih.gov/books/NBK501785/) | Last Revision Aug 15, 2024 |
| L3 | LactMed, via mirror | Stinging Nettle (NBK501777) | same mirror path with NBK501777 (canonical: https://www.ncbi.nlm.nih.gov/books/NBK501777/) | Last Revision Aug 15, 2024 |
| L4 | LactMed, via mirror | Sage (NBK501816) | same mirror path with NBK501816 (canonical: https://www.ncbi.nlm.nih.gov/books/NBK501816/) | Last Revision Nov 15, 2024 (mirror copy; a search result showed a later revision, Jul 2025, not read) |
| L5 | LactMed, via mirror | Peppermint (NBK501851) | same mirror path with NBK501851 (canonical: https://www.ncbi.nlm.nih.gov/books/NBK501851/) | Last Revision Jan 15, 2025 (mirror copy) |
| N1 | NCCIH (NIH) | Chamomile: Usefulness and Safety | https://www.nccih.nih.gov/health/chamomile | Last updated November 2024 |

Mirror caveat: ncbi.nlm.nih.gov itself returned a bot-check page, so LactMed text was read from an archived mirror of the NCBI page. The revision dates above are the mirror copy's; the live record may be newer.

Could not fetch: ACOG (HTTP 402, all pages tried), Mayo Clinic (HTTP 403), NHS exercise/constipation pages (not located), CDC "urgent-warning-signs" guessed URL (404, replaced by S7), Cleveland Clinic old URL 9680 (404), pubmed.ncbi.nlm.nih.gov (cookie wall), ncbi.nlm.nih.gov directly (bot check).

## 2. Claim audit

### Card w1-c2, "Qué evitar"

| Claim in card | Status | Supporting quote and source | Difference vs card |
|---|---|---|---|
| No tampons or menstrual cup for the first 6 weeks, only pads | Supported (tampons); partly (cup) | S1: "Tampons should not be used until 6 weeks after delivery." S5: wait 6 weeks before using tampons. S4: tampons on list to avoid for 6 weeks. S8 (NHS): "You should not use tampons until you've had your 6-week postnatal check." and warns about "internal period products like tampons and menstrual cups before this wound has healed". S9: "wear a pad to catch vaginal bleeding after childbirth (no tampons)." | S3 says "most clinicians advise against using tampons" with no number. S10 says until lochia stops and healed, not a fixed 6 weeks. Menstrual cup named only in S8 (NHS), as "before this wound has healed", not with a 6-week number. |
| No douching | Supported | S3: "vaginal douching is prohibited (douching is not recommended for any woman, regardless of pregnancy)." S1: "nothing, including tampons and douches, should be put in the vagina for at least 2 weeks." | S1 gives a 2-week minimum for douches/anything vaginal; card has no timeframe, which is consistent (no conflict) but the clinical advice is lifelong, not just postpartum. |
| No heavy lifting or strenuous exercise | Supported | S1: "Strenuous activity and heavy lifting should be avoided for about 6 weeks." S5: wait 6 weeks before "impact exercises, such as jogging, dancing, or lifting weights." S10: "Do not lift more than 10 pounds of weight or anything heavier than your baby for 6 weeks." | None (card says no number in c2; c6 says until clinician clears, typically 6 weeks, consistent). |
| Gentle walking is fine | Supported | S1: "Women should get up and walk as soon as possible." S9: "Most people can begin walking or doing gentle movements a few days after giving birth." S5: "it's safe to start gentle exercises a few days after a normal vaginal delivery" and "If you feel any pain, stop exercising." | S9 and S5 say "a few days after"; card implies from week 1, consistent. |
| Do not stay in bed all day; rest when bleeding increases | Partly | S1: "Women should get up and walk as soon as possible." S3: "Ambulation is encouraged as soon as possible." S9: "don't rush to exercise or get back in shape." | No source read says to rest specifically when bleeding increases (this is in card c1 and was not audited here). |
| Do not wait for the 6-week visit if worried; call earlier | Partly | S2 and S8 give call-now triggers (see c3). | No source read states this general instruction; supported only indirectly by the warning-sign lists. Note ACOG recommends contact within 3 weeks (see Not verified). |

### Card w1-c3, "Qué vigilar"

| Claim in card | Status | Supporting quote and source | Difference vs card |
|---|---|---|---|
| Soaking a pad every hour | Supported (but threshold differs) | S2: "If blood soaks a sanitary pad every hour for more than 2 hours". S1: "If blood soaks a sanitary pad every hour for more than 2 hours." | Source says for more than 2 hours; card says "every hour" with no duration (the bleeding numbers are also in `docs/research-bleeding.md`). Card is more cautious. |
| Clots the size of a golf ball or bigger | Supported | S2: "If very large clots (larger than a golf ball) are passed". | None. (S4 uses "larger than a walnut" for episiotomy aftercare; different threshold.) |
| Fever of 100.4°F (38°C) or more | Supported | S7: "Fever of 100.4°F or higher". S2 and S1: "If the temperature is 100.4° F (38° C) or higher". S10: "temperature above 38°C or 100.4° F". | Other sources differ: S5 (MedlinePlus) "more than 100°F (37.8°C) that persists"; S9 (Cleveland) "higher than 101 degrees Fahrenheit (38 degrees Celsius)" (internally inconsistent: 101°F is not 38°C). Card matches CDC and MSD. |
| Foul-smelling discharge | Supported | S2: "If discharge smells foul". S5: discharge "becomes heavier or develops a foul odor". S9: "Foul-smelling vaginal discharge." S4: "a discharge with a bad odor". | None. |
| Severe headache | Partly | S7: "Headache that won't go away or gets worse over time". S5: "a headache that does not go away or becomes worse." | Sources say a headache that does not go away or worsens, not "severe". Wording difference only. |
| Vision changes | Supported | S7: "Changes in your vision". S5: "vision changes". | None. |
| Chest pain | Supported | S7: "Chest pain or fast-beating heart". S2: "If sudden, sharp chest pain occurs or chest pain worsens when inhaling". | None. |
| Trouble breathing | Supported | S7: "Trouble Breathing". S2: "If breathing becomes difficult". | None. |
| Severe abdominal pain | Supported | S7: "Severe belly pain that doesn't go away". S2: "If pain or discomfort is felt in the lower abdomen (above the pubic area) after the first 5 days". | S2 sets a lower threshold (any lower abdominal pain after day 5). |
| Wound red, warm, with pus | Partly | S11 (NHS trust): "Red or puffy skin near the stitches", "Yellowish puss coming out of the wound", "Feeling hotter than usual". S2 (C-section incision): "If this area turns red or becomes swollen or hard to the touch". S9: "Leaking pus or bloody discharge from your C-section incision." | No source read lists "warm" for the wound; S11 says feeling hotter than usual (general). CDC list (S7) has no wound item. |
| Bleeding that calmed and returns heavy | Not verified | None of the pages read states this exactly. S5: discharge "becomes heavier". | Only S5 partly overlaps. |
| Thoughts of harming self or baby; 988 and 1-833-TLC-MAMA | Partly (warning sign only) | S7: "Thoughts about harming yourself or your baby". | The sources read do not mention 988 or the TLC-MAMA number or its hours/languages (mood content is being audited by another agent). |
| Additional CDC signs not on card | Note | S7 also lists dizziness or fainting, extreme swelling of hands or face, severe nausea and vomiting, vaginal bleeding or discharge after pregnancy, severe swelling/redness/pain of a leg or arm, overwhelming tiredness. S2 adds painful or incomplete urination, firm breast lump, painful red breast, leg swelling. | Card omits these. |

### Card w1-c4, "Remedios caseros y cuidado"

| Claim in card | Status | Supporting quote and source | Difference vs card |
|---|---|---|---|
| Peri bottle with warm water, front to back | Supported | S10: "Squirt the water from front to back." S1: "Using a spray bottle of warm water may also be soothing." S9: "Using a peri bottle with warm water to rinse after using the bathroom". S4: "spray warm water over the area after urinating or having a bowel movement, pat dry". | Only S10 states front to back. |
| Pat dry gently, no rubbing | Supported | S8: "Have a bath or shower with plain warm water then carefully pat yourself dry." S4: pat dry. | None. |
| Ice in first 24–48 h | Partly | S1: "Immediately after delivery and for the first 24 hours, ice or cold packs may be used to relieve the pain and swelling." S4/S6: "Using ice packs in the first 24 hours after birth decreases the swelling and helps with the pain." | Sources say first 24 hours; none read says 48 hours. (ACOG page, not read, reportedly says 24 to 72 hours; see Not verified.) |
| Then warm sitz baths | Supported | S3: "Later, warm sitz baths can be used several times a day." S1: "Warm sitz baths can help relieve pain." S4: sitz bath a few times a day, starting 24 hours after birth. S10: "Sit in the water for 10 minutes at least 3 times a day." | None. |
| Witch hazel pads | Partly | S9: "using witch hazel pads are ways to help your bottom feel better." | Only one source read (Cleveland Clinic); not mentioned in MSD, MedlinePlus, NHS pages. |
| Numbing spray (if clinician approves) | Partly | S3: "sometimes lidocaine cream or spray can be used to relieve pain." | One source; MSD Professional. |
| Pain: ibuprofen or acetaminophen as directed | Supported | S4: "acetaminophen or ibuprofen". S1: "acetaminophen and ibuprofen are relatively safe pain relievers" (breastfeeding). S3: "Acetaminophen and ibuprofen are considered safe during breastfeeding when taken at usual recommended doses." S8: "If you're breastfeeding, check with a pharmacist, midwife or GP before you buy over-the-counter painkillers." | S5 and S6 name only ibuprofen. |
| Constipation: fluids, fruit/veg (fiber), walking | Supported (fluids, fiber); partly (walking) | S5: "Eat a high-fiber diet with plenty of fruits and vegetables." and "Drink 8 cups (2 liters) of water a day to prevent constipation". S10: "Walking around will help get your bowels moving again". S4: contact provider at "4 or more days without a bowel movement". | Walking for constipation only in S10. Sources also mention stool softeners (S4, S5, S9), not in the card. S3: "If defecation has not occurred within 3 days, a mild cathartic... may be given." |
| Warm, easy-to-digest food (caldos, sopas, comidas calientes) | Not supported (no clinical source found) | No clinical source found. | No clinical source found for warm or easy-to-digest foods aiding recovery. A web search turned up only observational and cultural literature on confinement diets, not read in full. Oat, ginger, turmeric, cinnamon as "traditional": no clinical source found. |
| Teas "traditional, ask your promotora, never medical advice" framing | Supported as framing | N1: "Little is known about whether it's safe to use chamomile during pregnancy or while breastfeeding." | None. |

### Tea claims (card w1-c4 "Tés" and qa-2)

| Claim | Status | Supporting quote and source | Difference vs card |
|---|---|---|---|
| Chamomile "calms and helps sleep" | Partly | L1: "Chamomile is used orally as a sedative and for gastrointestinal conditions". | LactMed describes use, not proven benefit while breastfeeding. |
| Chamomile is "generally considered mild" (qa-2: "suele considerarse suave") | Contradicted / not supported as worded | L1: "No data exist on the safety of chamomile in nursing mothers or infants, although rare sensitization may occur". N1: "Little is known about whether it's safe to use chamomile during pregnancy or while breastfeeding." | qa-2 says it "suele considerarse suave" (usually considered mild); sources say safety data in nursing mothers do not exist. Suggest rewording to "no hay datos sobre su seguridad al amamantar". L1 also notes "Topical chamomile is a known sensitizing agent". |
| Chamomile: ask clinician if breastfeeding | Supported in spirit | L1 and N1 as above. | L1 adds: "Chamomile has been used as a galactogogue; however, no scientifically valid clinical trials support this use." Not in card. |
| Red raspberry leaf "traditionally for the uterus and iron" | Partly | L2: "The leaf of the red raspberry (Rubus idaeus) is a purported galactogogue"; "It is generally without side effects when used as a tea"; "no data are available on the safety in nursing mothers or their infants". | LactMed says nothing about uterus or iron use; the uterus claim is not supported by anything read ("no clinical source found" for the iron and uterus claims). L2 supports "generally without side effects as tea" but also says no safety data in nursing mothers. |
| Nettle "traditionally for iron" | Not supported for iron (no clinical source found) | L3: "Only minimal scientific support for a galactogogue effect of stinging nettle exists." and "It is probably best not to apply stinging nettle topically to the breast while breastfeeding." | Nothing read on nettle and iron: no clinical source found. |
| Start one tea at a time | No clinical source found | None. | Reasonable precaution, but not sourced. |
| Avoid sage in medicinal doses while breastfeeding; can lower milk | Partly | L4: "Sage purportedly reduces lactation and has been used to aid with weaning or an overabundant milk supply." Also: no studies have evaluated sage's effect on milk supply; no safety data for nursing mothers or infants; thujone and camphor are neurotoxic at high doses (from tool summary). | Card states sage "can lower milk" as fact; LactMed says "purportedly" and that no studies evaluated it. The "avoid" advice is a precaution, not evidence-based. |
| Avoid excess strong peppermint while breastfeeding; can lower milk | Not supported as a clear fact | L5: "Large doses can cause heartburn, nausea and vomiting." The tool summary says LactMed covers "the limited evidence on milk supply". A search result (not read directly) reported that LactMed found no clinical trials showing peppermint suppresses supply, with animal and cell data on menthol. | I did not obtain the exact LactMed sentence on peppermint and milk supply from a direct read, so "can lower milk" is partly supported at best (traditional belief; limited evidence). Mark as needing a manual check of https://www.ncbi.nlm.nih.gov/books/NBK501851/. |

### Card w1-c6, "Movimiento suave, Semana 1" (excluding pelvic floor timing)

| Claim in card | Status | Supporting quote and source | Difference vs card |
|---|---|---|---|
| Short walks at home; rest if bleeding increases | Partly | S9: "Most people can begin walking or doing gentle movements a few days after giving birth." S1: "Women should get up and walk as soon as possible." S5: return to walking "when you feel ready". | "Rest if bleeding increases" not in any page read. |
| No sit-ups, running, or carrying weight until clinician approves (typically at 6 weeks) | Partly | S1: "Strenuous activity and heavy lifting should be avoided for about 6 weeks." S5: wait 6 weeks before "impact exercises, such as jogging, dancing, or lifting weights." S10: "Do not lift more than 10 pounds of weight or anything heavier than your baby for 6 weeks." | Sit-ups/abdominal exercises not found on a page I fully read (only in a search summary of NHS trust leaflets: not read). "Until clinician approves" is not stated; sources give 6 weeks. Some trust leaflets (search summary only) advise avoiding running until 12 weeks or more: not verified. |

## 3. Suggested source lines (only sources read)

Spanish, for display under each card.

- Card w1-c2: "Fuentes: MSD Manual (Overview of Postpartum Care, rev. ago. 2024), MedlinePlus (Vaginal delivery - discharge, 8 nov. 2024), NHS (Your body after the birth, 25 abr. 2024)."
- Card w1-c3: "Fuentes: CDC Hear Her (Urgent Maternal Warning Signs, 15 may. 2024), MSD Manual (When to Call the Doctor), MedlinePlus (Vaginal delivery - discharge, 8 nov. 2024)."
- Card w1-c4: "Fuentes: MSD Manual (Overview of Postpartum Care, rev. ago. 2024; Postpartum Care, profesional, rev. abr. 2024), MedlinePlus (Episiotomy - aftercare, 29 may. 2026), Cleveland Clinic (Postpartum, 27 feb. 2024). Tés: LactMed (NIH) y NCCIH. La comida de cuarentena y los tés son tradición cultural; no hay estudios clínicos que los respalden."
- Card w1-c6: "Fuentes: MSD Manual (Overview of Postpartum Care, rev. ago. 2024), MedlinePlus (Vaginal delivery - discharge, 8 nov. 2024), Cleveland Clinic (Postpartum, 27 feb. 2024)."
- qa-2 (chamomile): replace the current source line with "LactMed (NIH), Chamomile, rev. 15 feb. 2021; NCCIH, Chamomile, nov. 2024: no hay datos sobre su seguridad en madres que amamantan." and drop "suele considerarse suave".

## 4. Not verified

- ACOG: all pages returned HTTP 402. Search snippets (not evidence) suggest ACOG says cold packs "best in the first 24 to 72 hours" and mentions witch hazel pads and numbing spray; read the page directly before citing.
- Mayo Clinic: HTTP 403; nothing from Mayo was read.
- Ice "24–48 hours": no source read says 48 hours; every page read says 24 hours.
- Witch hazel: only Cleveland Clinic read.
- Warm easy-to-digest foods; oats, ginger, turmeric, cinnamon; nettle and raspberry leaf for iron or uterus: no clinical source found.
- Peppermint lowering milk supply: exact LactMed sentence not obtained.
- Sage: a later LactMed revision (Jul 2025, from a search result) was not read.
- Wound "warm" sign; "rest when bleeding increases"; sudden heavy bleeding after it calmed; 988 and TLC-MAMA details: not found in pages read.
- Sit-ups/abdominal exercise restrictions and clinician-clearance timing: only seen in search summaries of NHS trust leaflets, not fetched.
- Fetch tool returns summaries of pages, so quotes should be spot-checked against the live pages.
