# Sources for mood, sleep, family help and hotline claims

Researched 2026-11-06. Method: WebFetch on each page. Important limit: WebFetch returns text summarised by a small model, so quotes below are as returned by the tool and are not byte-checked against the live pages. Before shipping, open each URL and confirm the quote once. Dates are the dates the page showed (or "none shown").

## 1. Sources actually read

| Short name | URL | Title | Date shown |
|---|---|---|---|
| NIMH | https://www.nimh.nih.gov/health/publications/perinatal-depression | Perinatal Depression - National Institute of Mental Health (NIMH) | "Revised 2023" (NIH Publication No. 23-MH-8116) |
| MedlinePlus EN | https://medlineplus.gov/postpartumdepression.html | Postpartum Depression (MedlinePlus) | Last updated December 9, 2025 |
| MedlinePlus ES | https://medlineplus.gov/spanish/postpartumdepression.html | Depresión posparto: MedlinePlus en español | Última actualización 9 de diciembre de 2025 |
| NHS | https://www.nhs.uk/conditions/baby/support-and-services/feeling-depressed-after-childbirth/ (resolved to the "Postnatal depression" page; also fetched at https://www.nhs.uk/mental-health/conditions/post-natal-depression/overview/) | Postnatal depression - NHS | Page last reviewed 18 March 2026; next review 18 March 2029 |
| Cleveland | https://my.clevelandclinic.org/health/diseases/9312-postpartum-depression | Postpartum Depression (PPD): Causes, Symptoms & Treatment | "Medically Reviewed. Last updated on 03/26/2026" |
| CDC | https://www.cdc.gov/reproductive-health/depression/index.html | Symptoms of Depression Among Women \| Reproductive Health \| CDC | May 15, 2024 (top) and May 14, 2024 (bottom); page does not label either as reviewed/updated |
| HRSA release (copy) | https://www.porh.psu.edu/hrsa-celebrates-national-maternal-mental-health-hotlines-first-anniversary-introduces-updated-number-1-833-tlc-mama/ | HRSA Celebrates National Maternal Mental Health Hotline's First Anniversary; Introduces Updated Number: 1-833-TLC-MAMA (Penn State Office of Rural Health repost of the HRSA announcement) | Posted May 16, 2023 |
| MMHLA | https://www.mmhla.org/hotline | Share the National Maternal Mental Health Hotline - Maternal Mental Health Leadership Alliance | None shown (only "©2026") |
| 988 EN | https://988lifeline.org/ | 988 Lifeline (no explicit title returned) | None shown |
| 988 ES | https://988lifeline.org/es/ | Línea 988 de Prevención del Suicidio y Crisis | None shown |
| PSI | https://www.postpartum.net/get-help/help-for-moms/ | Help for Perinatal Individuals \| Postpartum Support International (PSI) | None shown (only "© 2026") |

### Could not be fetched
- HRSA primary hotline pages: https://www.hrsa.gov/maternal-health/national-maternal-mental-health-hotline, https://mchb.hrsa.gov/national-maternal-mental-health-hotline, https://mchb.hrsa.gov/es/node/44, https://mchb.hrsa.gov/es/node/166 (all HTTP 403). The HRSA statement is therefore read only through the Penn State repost of the HRSA announcement.
- ACOG: https://www.acog.org/womens-health/faqs/postpartum-depression and /postpartum-care (HTTP 402).
- Mayo Clinic: https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617 and the Mayo community health page (HTTP 403).
- MSD Manual page URL tried (HTTP 404); Cleveland "baby blues" URL (404); NHS "baby-blues" URL (404). Not retried further.
- https://988lifeline.org/help-yourself/en-espanol/ (404).
- Seen only in search summaries, not fetched: Mayo Clinic baby blues "first two to three days... up to two weeks"; NHS trust leaflets "3 to 4 days". Do not cite these.

## 2. Claim audit

Content tested: Card 1 mood line (w1-c1, last bullet), Card 5 (w1-c5), Card 3 hotline line (w1-c3, last bullet, same hotline facts), qa-4 (mood answer), qa-5 (family answer).

### Mood, timing and when to seek help

| # | Claim in our content | Status | Supporting quote and source | Note |
|---|---|---|---|---|
| M1 | Crying easily / feeling overwhelmed is common (Card 1, qa-4) | supported | NHS: "Feeling down, anxious or irritable for a few days after your baby is born is very common." CDC: "Baby blues describes the worry, sadness, and tiredness many women experience after having a baby." NIMH: "feelings of worry, unhappiness, and exhaustion that many women experience in the first 2 weeks after giving birth." | |
| M2 | ...specifically "la primera semana" (Card 1, qa-4) | partly | MedlinePlus: "The baby blues usually go away within a few days to a week." CDC: "Baby blues symptoms typically resolve on their own within a few days." | Sources disagree on window. NIMH says "first 2 weeks"; NHS says goes away "within 2 weeks of the birth"; Cleveland: "Baby blues typically begin within a few days of delivery" and "the symptoms tend to subside within a week or two". "First week" matches MedlinePlus/CDC, but NIMH, NHS and Cleveland allow up to 2 weeks. Safer wording: "en los primeros días o semanas" or "las primeras dos semanas". |
| M3 | "Si dura más de 2 semanas ... es momento de pedir ayuda" | supported | NIMH: "Mood changes and feelings of anxiety or unhappiness that are severe or last longer than 2 weeks after childbirth may be signs of postpartum depression." MedlinePlus: "If your symptoms are more severe and last longer than two weeks, you may have postpartum depression." Cleveland: "If symptoms continue beyond your second week postpartum, contact a healthcare provider." | |
| M4 | "o empeora" | supported | NHS: "if it continues, gets worse or you're struggling to cope, it's important to get help." NIMH: "severe or last longer than 2 weeks" (severity alone qualifies). | |
| M5 | Implied: the 2-week mark is the point to ask for help | partly | NHS: "It's important to get help even if you only have some of the signs." NIMH: "severe or last longer than 2 weeks". MedlinePlus: "get help right away" for thoughts of suicide or of hurting self or baby. | The 2-week rule is a cutoff for mild symptoms. Sources say not to wait if symptoms are severe or if there are thoughts of self-harm or harming the baby. Card 3 already covers self-harm; consider making that link explicit in the mood line and qa-4. |
| M6 | "no es debilidad" | not supported | No page read contains this idea. | Reassurance wording, not a medical claim. Do not attribute it to a source. |
| M7 | qa-4: call "al 988 en crisis" | supported | MedlinePlus: lists the National Suicide and Crisis Lifeline, "Llame o envíe un mensaje de texto al 988" (ES page). NIMH: 988 described as the resource for someone "struggling or having thoughts of suicide". | |

### Sleep and low mood

| # | Claim | Status | Quote and source | Note |
|---|---|---|---|---|
| S1 | Card 5 family script: "lloro mucho y no puedo dormir" as a sign to get help | partly | NIMH: "Difficulty sleeping (even when the baby is asleep), waking early in the morning, or oversleeping" is a listed symptom. MedlinePlus: "Sleeping too much or too little" is a symptom of postpartum depression; also names "lack of sleep" among contributing factors. Cleveland: symptom "Trouble sleeping or wanting to sleep all the time"; risk factor "Lack of sleep and being tired". | Sleep trouble is a listed symptom, so supported as a symptom. Sources do not say "crying a lot and cannot sleep" is by itself a trigger to call. Newborn care also disrupts sleep, so sleep loss alone is not a sign; NIMH's wording "even when the baby is asleep" is the distinguishing detail. |
| S2 | qa-4 question "Me siento triste y no puedo dormir": the answer does not address sleep directly | n/a (gap) | NHS: "try to get as much sleep and rest as you can." Cleveland: "Sleep or rest when your baby sleeps." | Answer is silent on sleep. Optional: add one rest line, cited to NHS or Cleveland. |

### Family help in the first week

| # | Claim | Status | Quote and source | Note |
|---|---|---|---|---|
| F1 | Ask family to watch the baby so she can nap / rest (Card 5, qa-5 "Descanso") | partly | NHS: "try to get as much sleep and rest as you can." Cleveland: "Sleep or rest when your baby sleeps." and "Ask for help - let others know how they can help you." NIMH: family can assist with "caring for the baby or home". | Rest is supported. "Someone minds the baby during a nap" is a reasonable application, not stated word for word. |
| F2 | Bring water and hot food, "no tengo que levantarme" (Card 5, qa-5) | not supported by sources read | None of the pages read mention food, water or staying off her feet for the mother. Closest: NIMH "Offering emotional or practical support". | Cuarentena food is cultural practice (see Card 4 tradition framing). Do not cite a medical source for it. Label as tradition or general practical help. |
| F3 | Help with the house and other children (Card 5, qa-5) | supported | NHS: "ask for help with practical things like shopping, chores and childcare." NIMH: family can provide help by "Assisting with daily tasks such as caring for the baby or home". | NHS says "childcare"; NIMH says "caring for the baby or home". "Other children" is a fair reading of childcare, not a literal match. |
| F4 | Accompany her to the call with the clinic (Card 5, qa-5) | partly | NIMH: family can help by "Helping get to appointments". | Source says getting to appointments. Our "acompáñame a la llamada con la clínica" is a phone call, not travel. Close enough to cite "appointments" but not identical. |
| F5 | If family sees her sad over 2 weeks, ask them to help her call 1-833-TLC-MAMA (Card 5) | supported | NIMH: "Spouses, partners, family members, and friends may be the first to recognize signs of depression in a new mother." Family help includes "Encouraging discussion with a health care provider". NIMH hotline text: "free, confidential mental health support for mothers and their families". | Hotline is for "mothers and their families", so family can call too. |
| F6 | qa-5 "tienes las frases listas para mandarles por WhatsApp" | n/a | Internal product statement. | Not a medical claim. |

### Hotline and 988

| # | Claim | Status | Quote and source | Note |
|---|---|---|---|---|
| H1 | Number 1-833-TLC-MAMA (1-833-852-6262) | supported | HRSA release (copy): "1-833-TLC-MAMA (1-833-852-6262)". MMHLA: "Call or text 1-833-TLC-MAMA (1-833-852-6262)". | NIMH prints it as "1-833-9-TLC-MAMA (1-833-852-6262)". The digits in parentheses match. Our form matches HRSA. |
| H2 | Run by HRSA | supported (secondary copy) | HRSA release (copy), posted by HRSA and reposted by Penn State, describes the hotline as HRSA's, announcement from HRSA. MMHLA links to an mchb.hrsa.gov hotline page. | The HRSA primary page could not be fetched (403). NIMH does not say HRSA runs it. |
| H3 | Free | supported | HRSA release (copy): hotline "provides 24/7, free, confidential emotional support, resources and referrals". NIMH: "free, confidential mental health support for mothers and their families". MMHLA: "a free, confidential, 24/7, call or text resource". | |
| H4 | Confidential | supported | Same quotes as H3. | |
| H5 | 24/7 | supported | HRSA release (copy): "24/7". NIMH: "connect with counselors 24 hours a day, 7 days a week." | |
| H6 | Spanish and English | supported | HRSA release (copy): "accessible by phone or text in English and Spanish." NIMH: "English- and Spanish-speaking counselors are available." MMHLA: "available in English and Spanish with 60 more languages available via translation." | |
| H7 | qa-4: "Puedes llamar" | supported, incomplete | HRSA release (copy): "accessible by phone or text". | Can also text. Optional: "llamar o mandar un mensaje de texto". |
| H8 | Hotline is a place to ask for help when mood does not pass | supported | HRSA release (copy): "emotional support, resources and referrals" before, during and after pregnancy. NIMH: see H3. | A web search summary also said HRSA states the line is not an emergency line and that anyone in imminent danger should call 911 and crisis cases go to 988. Not read on a primary page (HRSA 403), so not verified. |
| H9 | 988 (Card 3 and qa-4) is free, confidential, 24/7 | supported | 988 EN: "Your conversations are free and confidential." and "The 988 Lifeline is available 24/7/365." 988 ES: "La línea 988 está disponible 24/7/365. Sus conversaciones son gratuitas y confidenciales." | |
| H10 | 988 available in Spanish | partly | 988 EN: "¡Los servicios de texto y chat de 988 Lifeline ya están disponibles en Español!" 988 ES links to a "Servicios En Español" page. | Spanish text and chat confirmed. A Spanish phone option was not confirmed on any page read. Our content does not claim Spanish for 988, so no change is required. Do not add one without checking. |
| H11 | Card 3: "Pensamientos de hacerte daño a ti o al bebé - llama al 988 o a la línea" | supported | MedlinePlus: "If you have thoughts about suicide, or hurting yourself or your baby get help right away". MedlinePlus ES: "Si tiene pensamientos de suicidio o de hacerse daño a usted mismo o a su bebé, busque ayuda de inmediato." MedlinePlus lists 988. | MedlinePlus also says to call 911 or go to the ER for postpartum psychosis symptoms (confusion, hallucinations, dangerous behavior). Card 3 does not mention 911. Consider whether it should. |

### Contradictions or disagreements found
1. Baby blues window: "first week" (MedlinePlus, CDC "a few days") versus "first 2 weeks" (NIMH) and "within 2 weeks" (NHS), "a week or two" (Cleveland). Our "primera semana" is correct per two sources and narrower than three others. Not wrong, but not the only accepted window.
2. The "2 weeks" rule is stated consistently by NIMH, MedlinePlus, Cleveland. NHS gives no number ("if it continues, gets worse"). The 2 weeks is a point where blues stop being the likely explanation, not a waiting period: NIMH says "severe or last longer than 2 weeks", NHS says get help "even if you only have some of the signs".
3. Hotline number format: NIMH writes "1-833-9-TLC-MAMA"; HRSA and MMHLA write "1-833-TLC-MAMA". Both give 852-6262.

## 3. Suggested source line per content item

Use only sources read. Date = date shown on page.

- Mood answer (qa-4), replace the current "source" field:
  `NIMH, Perinatal Depression (rev. 2023); HRSA, National Maternal Mental Health Hotline (anuncio, 16 mayo 2023)`
  Alternative for the 2-week point: `MedlinePlus, Depresión posparto (act. 9 dic 2025)` (Spanish page, covers "unos pocos días o una semana", "más de dos semanas" and 988).
- Family answer (qa-5), current source is "Alba, Semana 1, tarjeta 5", which is an internal pointer, not a medical source. Add: `NHS, Postnatal depression (rev. 18 mar 2026); NIMH, Perinatal Depression (rev. 2023)`. These support rest, practical help and appointments. They do not support the hot food claim (F2).
- Card 1 mood line: `NIMH, Perinatal Depression (rev. 2023); MedlinePlus, Depresión posparto (act. 9 dic 2025)`.
- Card 5: `NHS, Postnatal depression (rev. 18 mar 2026); NIMH, Perinatal Depression (rev. 2023)`.
- Card 3 hotline line (not requested, same facts): `HRSA, National Maternal Mental Health Hotline (anuncio, 16 mayo 2023); 988 Lifeline (988lifeline.org)`.

If Marina wants an HRSA primary page cited, someone needs to open https://mchb.hrsa.gov/national-maternal-mental-health-hotline in a browser and copy its title and date, since automated fetch was blocked.

## 4. Not verified

- HRSA primary hotline page (title, date, exact wording): fetch blocked (403) on four URLs. Hotline facts come from the Penn State repost of the HRSA announcement (May 16, 2023), NIMH (2023) and MMHLA (no date).
- ACOG, Mayo Clinic, MSD Manual: not read. No ACOG or Mayo quote is used in this document.
- Whether 988 has a Spanish phone option (press 2): not found on pages read.
- Whether the hotline line is "not an emergency line / call 911": only in a search summary.
- Hot food, water, "no tengo que levantarme", and the cuarentena practices: no medical source found.
- "No es debilidad": no source.
- The quotes are tool-returned summaries, not byte-exact page text. CDC dates are ambiguous (two dates, neither labelled).
- Date of the NIMH page is "Revised 2023" only; no month.
