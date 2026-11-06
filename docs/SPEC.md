# Spec — Alba, a postpartum companion

**Status:** Draft — TBD remain (22 open questions, including Q-31 to confirm; all 4 contradictions resolved) · **Shape:** full — more than 15 requirements, WhatsApp integration, health data
**Built:** 2026-11-06 · **Input:** D1 pitch, D2 content pack, D3 owner message, D4–D21 owner answers (3,272 words) · **Spec:** 6656 words excl. citations · **Speaker:** product owner (D3:L1 adopts D1, D2)
**Length:** 6656 vs 3,272 — dense input: nearly every line carries a need (58 REQ, 50 questions, 4 contradictions); none dropped to meet the count
**Counts:** 58 REQ (3 removed) · 103 AC · 4 contradictions (4 resolved) · 50 questions (28 resolved) · 0 assumptions · 6 proposed (3 approved) · 7 out of scope

## Problem

- Mothers are left alone after birth; as many as 40% skip the postpartum visit — observed (D1:L6).
- Spanish speakers are hit harder on access; in Mexico about half skip the postnatal checkup — observed (D1:L6).

## Goal

- A private Spanish-first companion that tracks healing, teaches week by week, connects moms to promotoras, and gets her to the checkup — observed (D1:L4).

## Non-goals / Out of scope

- **OOS-1** Diagnosis — D1:L9 "Tracking and information only, never diagnosis."
- **OOS-2** For the hackathon demo, WhatsApp messages, Circle content and the Day 3–41 timeline are simulated, not live — D5:L1 "simulated = WhatsApp messages, Circle content, Day 3–41 timeline". Live: Week 1 cards, Ask Alba with the 2 demo questions, check-in, red-flag escalation, one-page summary (D5:L1). Promotora review and moderation are also simulated (D8:L4).
- **OOS-3** No retention policy for the demo — D6:L1 "no retention policy yet"
- **OOS-4** Only US hotlines, no Mexico hotlines — D6:L5 "US first, TLC-MAMA and 988"
- **OOS-5** Full verification of Claude-cited sources comes later — D11:L1 "the full check can come later"
- **OOS-6** Real authentication, multiple users, and the login, sign-up and consent screens, for the demo — D13:L1 "real auth is not needed"; D15:L1 "remove the auth page entirely"
- **OOS-7** HIPAA review is revisited later — D17:L4 "lets revisit hippa later"

## Requirements

### REQ-1 — Product name
The product shall be named Alba.
- Source: D1:L1 — "The name: Alba"
- AC-1 Given the product name is shown, When a mom reads it, Then it reads "Alba".

### REQ-2 — Discreet appearance
Alba shall show nothing on a home screen that says postpartum or medical.
- Source: D1:L2 — "nothing on a home screen that says postpartum or medical"
- AC-2 Given Alba on a home screen, When someone views it, Then no text on it says postpartum or medical.

### REQ-3 — Spanish first
Alba shall present its content in Spanish.
- Source: D1:L4 — "in Spanish, on the phone she already has"; D2:L4 — "Spanish-first"
- AC-4 Given a mom opens Alba, When content loads, Then it is in Spanish.
- AC-5 Given English is chosen with the dropdown (REQ-53), When content loads, Then it is in English; the start language stays Spanish.

### REQ-4 — Daily check-ins
Alba shall let a mom check in daily on bleeding, pain, mood and healing.
- Source: D1:L8 — "Daily check-ins on bleeding, pain, mood, and healing"; D10:L1 — "each of bleeding, pain, mood and healing is a 1–5 scale"
- AC-6 Given the daily check-in, When it opens, Then it asks about bleeding, pain, mood and healing, each on a 1–5 scale (D10:L1).
- AC-7 Given the check-in, When she answers, Then a yes/no "soaked a pad in an hour" appears under bleeding (D10:L1).

### REQ-5 — Free-form notes
Alba shall let a mom add free-form notes.
- Source: D1:L8 — "plus free-form notes"
- AC-8 Given she writes a note, When she saves it, Then it is saved as part of that day's check-in (D10:L1).

### REQ-6 — One-page doctor summary
Alba shall build, locally, a one-page summary of her check-ins and notes that she hands her doctor at the visit.
- Source: D1:L8 — "The AI condenses it all into a one-page summary she hands her doctor at the visit"; D11:L3 — "a one-page screen she can print or save as PDF"; D8:L2 — "claude for the summary and weekly research articles to pull based on the week theyre in"; D19:L1 — "a local summary of what is happening"
- AC-9 Given check-ins and notes exist, When the summary is produced, Then it is one page.
- AC-10 Given the summary, When produced, Then it is a one-page screen she can print or save as PDF (D11:L3); trigger, sharing, language and period are TBD → Q-18.
- AC-78 Given the summary is built, When it is shown, Then nothing was sent to the Claude API or any other service (D19:L1).
- AC-109 Given she has check-ins, When the summary is shown, Then it states the days logged, per question the latest, average and range, the days with a soaked pad and the days with notes, with no judgement or advice (D19:L1).

### REQ-7 — Week 1 milestone cards
Alba shall show Week 1 milestone cards: what to expect, what to avoid, what to watch, home remedies, what to ask family, gentle movement.
- Source: D1:L9 — "Week 1: what to avoid, what to watch for, home remedies, what to ask family for"; D2:L4 — "Week 1 milestones — paste into Milestones (Spanish-first)"
- AC-11 Given she opens Week 1, When it loads, Then six cards appear with the content of D2:L5–L10, as corrected in content/README.md (D8:L6, D14:L2).
- AC-12 Given Card 1, When shown, Then red bleeding is described as lasting 3–4 days (D7:L1).
- AC-80 Given Cards 1 and 3, When shown, Then they say to call if soaking a pad every hour (D8:L6).
- AC-88 Given Cards 1 and 3, When shown, Then they say to call for golf-ball clots (D8:L6).
- AC-89 Given Card 1, When shown, Then it says discharge lasts up to 6 weeks in total, pink/brown about 14 days (D8:L6).
- AC-63 Given Week 1, When shown, Then "what people appreciated" is TBD → Q-19.

### REQ-8 — Weeks 2–6 and beyond
Alba shall give workouts, teas and recovery guidance for weeks 2–6 and beyond.
- Source: D1:L9 — "Weeks 2–6 and beyond: workouts, teas, and recovery guidance"
- AC-13 Given weeks 2–6, When she opens a week, Then workouts, teas and recovery guidance are shown.
- AC-14 Given those weeks, When shown, Then content and the end of "beyond" are TBD → Q-19.

### REQ-9 — Researched weekly summaries with sources
Each week, Alba's AI agent shall search and summarize medically-backed articles, citing sources.
- Source: D1:L9 — "searching and summarizing medically-backed articles per week, with sources cited and promotora review"; D8:L2 — "claude for the summary and weekly research articles to pull based on the week theyre in"
- AC-15 Given a weekly summary, When shown, Then it lists its sources.
- AC-16 Given an article, When selected, Then which sources count as medically-backed is TBD → Q-4.
- AC-79 Given a mom is in week N, When the weekly research runs, Then it pulls articles for week N (D8:L2).

### REQ-10 — Promotora review
Alba shall have a promotora review AI-researched content.
- Source: D1:L9 — "with sources cited and promotora review"
- AC-17 Given AI-researched content, When it reaches moms, Then in the demo the promotora review is a simulated role (D8:L4).

### REQ-11 — Tea framing
Where Alba shows tea content, it shall label it "tradicional, pregunta a tu promotora" and not as a medical recommendation.
- Source: D2:L19 — "it always stays framed as"
- AC-18 Given a tea is shown, When she reads it, Then the label "tradicional, pregunta a tu promotora" appears with it.

### REQ-12 — Community Circle
Alba shall provide a small moderated space where moms connect to promotoras and to each other.
- Source: D1:L10 — "A small moderated space where moms connect to promotoras and to each other"
- AC-19 Given a mom opens the Circle, When it loads, Then posts from promotoras and moms are shown.
- AC-20 Given the Circle, When people join, Then size and admission are TBD → Q-10.

### REQ-13 — Human moderation
A real person shall moderate the Circle.
- Source: D1:L10 — "moderated by a real person"
- AC-21 Given a post, When moderated, Then a human, not software, moderates it.
- AC-22 Given moderation, When it applies, Then in the demo the moderation is a simulated role (D8:L4).

### REQ-14 — Promotora tips
The Circle shall offer short video and audio tips in Spanish from promotoras on healing, breastfeeding and finding childcare.
- Source: D1:L10 — "Short video and audio tips in Spanish from women who actually do this work — healing, breastfeeding, finding childcare"
- AC-23 Given the Circle, When she browses tips, Then video and audio tips in Spanish on those three topics are listed.
- AC-24 Given a tip, When shown, Then "short" is TBD → Q-10.

### REQ-15 — Weekly live audio check-in
The Circle shall hold a weekly live audio check-in.
- Source: D1:L10 — "A weekly live audio check-in"
- AC-25 Given the week, When the check-in time arrives, Then a live audio check-in is open to join; day, time, platform TBD → Q-10.

### REQ-16 — Feed of quick wins and questions
The Circle shall have a feed for quick wins and questions.
- Source: D1:L10 — "A feed for quick wins and questions"; D1:L21 — "a promotora answers with a short audio tip, another mom adds a quick win"
- AC-26 Given the feed, When a mom posts a quick win or question, Then it appears in the feed.
- AC-27 Given a question, When a promotora replies with an audio tip, Then the reply appears under it.

### REQ-17 — Anonymous posting
Alba shall let a mom post in the Circle anonymously.
- Source: D1:L10 — "post anonymously"; D1:L13 — "anonymous posting"; D6:L2 — "posts show a random alias, only moderators see the author"
- AC-28 Given an anonymous post, When others read it, Then it shows a random alias, not who wrote it.
- AC-29 Given an anonymous post, When a moderator views it, Then the author is visible; what promotoras see is TBD → Q-11.

### REQ-18 — Week-3 first contact
Alba shall help a mom make first contact with her clinic within 3 weeks.
- Source: D1:L11 — "first contact within 3 weeks"; D10:L4 — "remind at day 20 for the first contact"; D1:L21 — "she confirms a clinic call"
- AC-30 Given she has called the clinic, When she confirms it, Then Alba accepts the confirmation.
- AC-31 Given the 3-week window, When it starts, Then its start is her delivery date (D8:L5).
- AC-85 Given day 20 after delivery, When it arrives, Then Alba reminds her to make first contact (D10:L4).

### REQ-19 — Comprehensive visit
Alba shall help a mom reach the comprehensive postpartum visit by 12 weeks.
- Source: D1:L11 — "the comprehensive visit by 12 weeks"; D10:L4 — "aim the comprehensive visit at 6 weeks, with 12 weeks as the outer limit"
- AC-32 Given 12 weeks approaches, When Alba sends reminders, Then they aim the visit at 6 weeks, with 12 weeks as the outer limit (D10:L4).

### REQ-20 — WhatsApp reminders in Spanish
Alba shall send reminders in Spanish on WhatsApp.
- Source: D1:L11 — "WhatsApp reminders in Spanish, a prep checklist (childcare, transport, questions saved), and a visit-day reminder"; D6:L6 — "reminders through whatsapp"
- AC-33 Given a reminder is due, When sent, Then it arrives on WhatsApp in Spanish.
- AC-34 Given reminders, When scheduled, Then count, timing and opt-out are TBD → Q-16.

### REQ-21 — Visit prep checklist
Alba shall give a prep checklist for the visit covering childcare, transport and questions saved.
- Source: D1:L11 — "a prep checklist (childcare, transport, questions saved)"
- AC-35 Given a visit is coming, When she opens the checklist, Then it lists childcare, transport and questions saved.

### REQ-22 — Visit-day reminder
On the day of the visit, Alba shall send a reminder.
- Source: D1:L11 — "a visit-day reminder"
- AC-36 Given visit day, When it begins, Then she receives a reminder; the visit date is the appointment date she enters in the app (D9:L2).

### REQ-23 — Attendance confirmation
Alba shall let a mom confirm she went to the visit.
- Source: D1:L21 — "she confirms she went"
- AC-37 Given the visit has passed, When she confirms she went, Then Alba accepts the confirmation.
- AC-38 Given a confirmation, When counted as success, Then how it is verified is TBD → Q-17.

### REQ-24 — WhatsApp welcome
When a mom starts, Alba shall send a welcome in Spanish on WhatsApp.
- Source: D1:L21 — "welcome in WhatsApp, in Spanish"; D6:L6 — "starts through the app and reminders through whatsapp"
- AC-39 Given a new mom, When she starts, Then a Spanish welcome arrives on WhatsApp; she starts through the app (D6:L6); she gives her WhatsApp number there (REQ-48); when the welcome is sent is TBD → Q-40.

### REQ-25 — Red flags from day one
From day one, Alba shall show red flags in plain language with a "go now" path.
- Source: D1:L12 — "Plain-language red flags from day one"; D2:L7 — "llama hoy, no esperes"; D10:L2 — "tap-to-call button to her clinic or 911"
- AC-40 Given day one, When she opens red flags, Then soaking a pad in an hour, fever, severe headache and chest pain are listed.
- AC-41 Given a listed red flag, When shown, Then it says "llama hoy, no esperes"; it shows full screen with a tap-to-call button to her clinic or 911 (D10:L2); the clinic number is the one she entered with her appointment date, and tap-to-call falls back to 911 if she entered none (D11:L2).

### REQ-26 — Red-flag escalation
When she reports soaking a pad in an hour, escalation shall fire.
- Source: D1:L21 — "soaking a pad in an hour, escalation fires"; D10:L2 — "tap-to-call button to her clinic or 911"
- AC-42 Given she reports it, When she submits, Then escalation fires: the full-screen "llama hoy, no esperes" message with a tap-to-call button to her clinic or 911 (D10:L2), reported through the yes/no under bleeding (D10:L1).

### REQ-27 — Mental-health hotline
Alba's mental-health check-ins shall escalate to a real bilingual human line, the TLC-MAMA hotline, plus 988 for crisis.
- Source: D1:L12 — "Mental-health check-ins that escalate to a real bilingual human line"; D1:L12 — "plus 988 for crisis"; D6:L5 — "US first, TLC-MAMA and 988"
- AC-43 Given a mental-health check-in that escalates, When shown, Then the TLC-MAMA hotline is named.
- AC-44 Given a crisis, When detected, Then 988 is named.
- AC-45 Given check-ins, When they run, Then whether the mental-health check-ins are the daily mood question, and what triggers 988, are TBD → Q-15, and the hotlines are the US ones (D6:L5).

### REQ-28 — Removed
Removed by D15:L1 (login, sign-up and consent screens are not part of the demo); see the amendment log.

### REQ-29 — Minimal data
Alba shall keep check-ins and notes on the server and store no real names.
- Source: D1:L13 — "minimal data"; D6:L1 — "check-ins and notes on the server, no real names"
- AC-47 Given a mom uses Alba, When data is stored, Then it is check-ins and notes on the server with no real name; what the Claude API receives is in REQ-46.

### REQ-30 — Removed
Removed by D15:L1 (login, sign-up and consent screens are not part of the demo); see the amendment log.

### REQ-31 — Visual style
Alba's interface shall use curves, smooth transitions and calm colors.
- Source: D1:L15 — "Curves, smooth transitions, calm colors"
- AC-49 Given the interface, When reviewed, Then palette and review standard are TBD → Q-22.

### REQ-32 — Low-spec devices
Alba shall run on a prepaid phone with patchy data.
- Source: D1:L15 — "Lightweight and low-spec, because she's often on a prepaid phone with patchy data."
- AC-50 Given a low-spec phone on patchy data, When she uses Alba, Then limits are TBD → Q-20.

### REQ-33 — Pelvic floor flow
Alba shall offer a pelvic floor flow framed as cuarentena rest.
- Source: D1:L21 — "pelvic floor flow, framed as cuarentena rest"
- AC-51 Given she opens the flow (Day 14), When it plays, Then it is framed as cuarentena rest; meaning TBD → Q-23.

### REQ-34 — Ask Alba
Ask Alba shall answer her questions in context, page to page, with sources.
- Source: D2:L3 — "Ask Alba walks with her page to page, answering questions in context, in Spanish, with sources, and never diagnosing"; D2:L12 — "cite the source"
- AC-52 Given she asks on a page, When Ask Alba answers, Then the answer names a source.
- AC-65 Given Ask Alba answers on a page, When the answer is shown, Then its language follows REQ-35.
- AC-53 Given an answer, When it is produced, Then it comes from the Claude API (D6:L3); Claude may cite sources beyond the seed file (D9:L4); what counts as unsure is TBD → Q-4.

### REQ-35 — Answer language
Ask Alba shall answer in the language she asked.
- Source: D2:L12 — "answer in the language she asked"; D4:L2 — "the language she asks in"
- AC-54 Given a Spanish question, When answered, Then the answer is in Spanish.
- AC-55 Given an English question, When answered, Then the answer is in English.

### REQ-36 — Red flags in Ask Alba
If a question describes a red-flag symptom, then Ask Alba shall tell her "llama a tu médico ahora" and not reassure.
- Source: D2:L12 — "red-flag symptoms → \"llama a tu médico ahora\" (never reassurance)"
- AC-56 Given she describes soaking a pad in an hour, When Ask Alba answers, Then it says "llama a tu médico ahora" and gives no reassurance.

### REQ-37 — Low mood in Ask Alba
If a question shows low mood, then Ask Alba shall point her to the TLC-MAMA hotline.
- Source: D2:L12 — "low mood → TLC-MAMA hotline"
- AC-57 Given she writes she is sad and cannot sleep, When Ask Alba answers, Then the TLC-MAMA hotline is named.

### REQ-38 — Unsure answers
If Ask Alba is unsure, then it shall tell her to ask a promotora or in the Circle.
- Source: D2:L12 — "if unsure → \"pregúntale a una promotora o en el Círculo.\""
- AC-58 Given it is unsure, When it answers, Then it says "pregúntale a una promotora o en el Círculo."
- AC-59 Given a question, When judged, Then what counts as unsure is TBD → Q-4.

### REQ-39 — Disclaimer
Ask Alba shall end every health answer with "esto no es consejo médico — pregunta a tu médico o promotora."
- Source: D2:L12 — "Every health answer ends"; D4:L1 — "add the disclaimer to every health answer"
- AC-60 Given a health answer, When shown, Then it ends with that line.

### REQ-40 — Pre-tested answers
Ask Alba shall hold the five pre-tested questions and answers in its seed knowledge file.
- Source: D2:L11 — "Ask Alba — seed knowledge file"; D2:L13 — "Pre-tested Q&A"
- AC-61 Given the seed knowledge file, When it is loaded, Then it holds the five pre-tested questions and answers of D2:L14–L18, each ending with the disclaimer line (D4:L1).
- AC-62 Given the day-9 bleeding answer, When shown, Then its text says red 3–4 days (D7:L1) and the values in AC-80, AC-88 and AC-89 (D8:L6).

### REQ-41 — Expectation-versus-reality posts
Alba shall let moms post anonymously about what they thought they would experience and what they actually did.
- Source: D1:L10 — "post anonymously about what they thought they'd experience and what they actually did"
- AC-66 Given the Circle, When a mom posts about what she expected and what happened, Then the post appears in the Circle; who may post is TBD → Q-10.

### REQ-42 — Send Week 1 family phrases on WhatsApp
Alba shall let a mom send the Week 1 "ask your family" phrases to family by WhatsApp.
- Source: D2:L18 — "tienes las frases listas para mandarles por WhatsApp"
- AC-67 Given Week 1 Card 5, When she picks a phrase, Then she can send it by WhatsApp.

### REQ-43 — Mood-dip response
When a mood dip is detected, Alba shall respond with support and the TLC-MAMA hotline.
- Source: D1:L21 — "mood dip — the app responds with support and the TLC-MAMA hotline"; D13:L2 — "show the hotline"; D10:L3 — "mood scored 1 or 2 on two check-ins in a row, or any note mentioning self-harm"
- AC-64 Given a mood dip, When detected, Then a support message and the TLC-MAMA hotline are shown; a mood dip is mood scored 1 or 2 on two check-ins in a row, or any note mentioning self-harm (D10:L3).

### REQ-44 — Shared-phone privacy
Alba shall not reveal on a shared phone what it is.
- Source: D1:L13 — "A shared phone never reveals what the app is."
- AC-3 Given a shared phone, When another person looks, Then what counts as revealing is TBD → Q-8.

### REQ-45 — Web app with WhatsApp integration
Alba shall be a web app with WhatsApp integration.
- Source: D4:L3 — "web app with WhatsApp integration"
- AC-68 Given Alba is deployed, When a mom opens it in a browser, Then it loads as a web app.
- AC-69 Given the WhatsApp integration, When Alba sends a message, Then it arrives in WhatsApp.

### REQ-46 — Claude API
Alba shall use the Claude API in the demo for the chat bot (Ask Alba); it is not used for the one-page summary (D19:L1).
- Source: D6:L3 — "we will connect alba to the claude api for the demo"; D7:L5 — "the chat bot and the personalized workouts"; D8:L2 — "claude for the summary and weekly research articles to pull based on the week theyre in"
- Priority: critical (D6:L4 "make sure this works critically")
- AC-70 Given the demo, When the two live questions (D2:L13) are asked, Then Ask Alba answers each through the Claude API.
- AC-71 Given a Claude API call fails or is slow, When she asks one of the two live questions, Then Ask Alba shows the seed answer for that question (D7:L2); slow means over 5 seconds (unconfirmed → Q-31; delegated, D8:L3).
- AC-81 Given a Claude API call fails for workouts, the summary or weekly research, When she opens them, Then she sees an error message for now (D9:L1); its text is TBD → Q-35.
- AC-87 Given a Claude API call fails on an Ask Alba question other than the two live ones, When she asks, Then what she sees is TBD → Q-39.
- AC-72 Given Ask Alba calls the API, When the call is made, Then it carries only the question she typed and the page she is on, no check-ins or notes (D7:L3).

### REQ-47 — Personalized workouts
Alba shall give pelvic floor workouts that depend on the week, using the Claude API.
- Source: D7:L5 — "the chat bot and the personalized workouts"; D8:L1 — "workouts dependent on the week for the pelvic floor"
- AC-74 Given a mom opens workouts, When they are shown, Then the pelvic floor workouts shown depend on her week (D8:L1).

### REQ-48 — Removed
Removed by D15:L1 (login, sign-up and consent screens are not part of the demo); see the amendment log.

### REQ-49 — Enter appointment date
Alba shall let a mom enter her appointment date and her clinic phone number in the app.
- Source: D9:L2 — "she enters her appointment date in the app"; D11:L2 — "she enters her clinic phone number with her appointment date"
- AC-90 Given the app, When she enters her clinic phone number, Then Alba keeps it for tap-to-call (D11:L2).
- AC-82 Given the app, When she enters an appointment date, Then Alba keeps it for her reminders; whether it is for the first contact or the comprehensive visit is TBD → Q-13.

### REQ-50 — Claude API key on the server only
Alba shall keep the Claude API key on the server only.
- Source: D9:L5 — "keep the API key server-side only"
- AC-83 Given Alba open in a browser, When its page source and network calls are inspected, Then the Claude API key does not appear.

### REQ-51 — Check cited sources
Alba shall check that sources Claude cites exist and are medical.
- Source: D10:L5 — "yes, approve the citation check"; D11:L1 — "flagged sin verificar"
- AC-84 Given Claude cites a source, When the answer is shown, Then a source named by Claude is flagged "sin verificar", and the seed answers cite only their named sources (D11:L1).

### REQ-52 — Stack and run mode
Alba shall be built with Next.js (App Router), TypeScript and Tailwind, call the Claude API from server-side route handlers, store data in SQLite on the server, and run locally for the demo.
- Source: D12:L1 — "Next.js App Router with TypeScript and Tailwind, Claude API in server-side route handlers with the key from .env only, SQLite on the server, run locally for the demo"
- AC-91 Given the repo, When it is installed and started locally, Then Alba loads in a browser.
- AC-92 Given the Claude API is called, When the call is made, Then it is made from a server-side route handler with the key read from .env.
- AC-93 Given check-ins and notes are saved, When the server restarts, Then they are still stored in SQLite.

### REQ-53 — Language selector
Alba shall start in Spanish and let a mom switch the app to English with a dropdown.
- Source: D14:L1 — "a dropdown to switch language somewhere on the page; the page starts in Spanish"
- AC-94 Given a mom opens Alba for the first time, When the first page loads, Then it is in Spanish.
- AC-95 Given the language dropdown, When she picks English, Then the page text is in English.
- AC-96 Given she picked English, When she opens another page or returns later, Then whether the choice is kept is TBD → Q-42.

### REQ-54 — Profile bubble
Alba shall show a profile bubble at the top right of every page that opens the starter user's profile.
- Source: D15:L3 — "a buble with their profile at the top right corner"
- AC-99 Given any page, When it loads, Then a profile bubble is at the top right.
- AC-100 Given the bubble, When she taps it, Then the starter user's profile opens; what the profile shows and lets her edit is TBD → Q-43.

### REQ-55 — Starter user
Alba shall start with a signed-in starter user whose profile is already filled in.
- Source: D15:L2 — "start the homepage with a user already"; D16:L1 — "week 2 for the starter demo"
- AC-97 Given Alba is started for the first time, When the home page loads, Then it shows the starter user's date and week with no login or sign-up step.
- AC-98 Given the starter user, When the profile is read, Then the delivery date puts her in week 2 on the day the starter data is created (D16:L1).

### REQ-56 — Circle chats by category
The Circle shall offer mock chats in categories such as can't sleep, baby handling, not sure and discharge.
- Source: D17:L1 — "different categories, such as cant sleep, baby handeling, not sure, discharge etc."; D18:L2 — "feeding, feeling low, recovery and movement, asking for help"
- AC-101 Given the Circle, When a mom opens it, Then eight mock chat rooms are listed: can't sleep, baby handling, not sure, discharge, feeding, feeling low, recovery and movement, asking for help (D17:L1, D18:L2).

### REQ-57 — Calendar on the dashboard
Alba shall show a calendar on the dashboard of what she has done: check-ins, exercises and her overall status of health today.
- Source: D17:L3 — "a calendar on the dashboard that shows what shes done, ie check in, exercises, overall status of health today"; D18:L3 — "add the calendar to fill the right side of the page"
- AC-103 Given she has done a check-in on a day, When she opens the dashboard, Then that day is marked as checked in.
- AC-104 Given she has done an exercise on a day, When she opens the dashboard, Then that day is marked as exercised.
- AC-106 Given a wide screen, When the dashboard opens, Then the calendar fills the right side of the page (D18:L3).
- AC-105 Given today, When she opens the dashboard, Then her overall status of health today is shown; what it contains is TBD → Q-47.

### REQ-58 — Clinic map (demo)
Alba shall show, in its own tab at the bottom, an illustrated demo map of mock low-cost promotoras, clinics and community centers near a rural town in the US, with a simulated "use my location" button.
- Source: D17:L2 — "a map of some local clinics available depending on the users location"; D18:L1 — "illustrated demo map"; D19:L2 — "a local map with low cost clinics around the area"; D20:L1 — "add the map to a seperate tab at the bottom"; D20:L2 — "promotoras or clinics or community centers, lets mock this data for a location in a rural town in mexico"; D21:L1 — "move it to US thats fine but its mocked anyways, mark some fake promotoras or community centers not just a clinci"
- AC-107 Given the clinic page, When it opens, Then a soft illustrated map with pins and a list of mock promotoras, community centers and clinics in a rural town in the US is shown (D21:L1).
- AC-110 Given the clinic list, When it is shown, Then each clinic shows that it is low cost; what counts as low cost is TBD → Q-50.
- AC-111 Given the bottom navigation, When she looks at it, Then a separate map tab opens the map (D20:L1).
- AC-108 Given the "use my location" button, When she taps it, Then the clinics are shown without reading her real location and nothing leaves her phone (D18:L1).

## Users and roles
- Mom — D1:L4 — REQ-4…REQ-44 — observed
- Promotora — D1:L10 — REQ-10, REQ-14 — observed
- Moderator (real person) — D1:L10 — REQ-13 — observed
- Doctor / clinic — D1:L8 — REQ-6, REQ-18 — observed; permissions → Q-11

## Data
- Check-ins and notes — D1:L8 — REQ-4, REQ-5, REQ-29, Q-25 — observed
- Posts (anonymous) — D1:L10 — REQ-17, Q-11 — observed
- Visit and call confirmations — D1:L21 — REQ-18, REQ-23 — observed

## Integrations
- WhatsApp, to the mom, from a web app (D4:L3) — D1:L11 — REQ-20, REQ-24, REQ-45 — observed
- TLC-MAMA hotline and 988 — D1:L12 — REQ-27 — observed
- Claude API — D6:L3 — REQ-46, REQ-47, Q-25 — observed

## Non-functional
- Low-spec, patchy data — D1:L15 — REQ-32, Q-20 — observed
- Privacy — D1:L13 — REQ-2, REQ-28…REQ-30, Q-25 — observed
- Accessibility, availability — silent — Q-20; retention — not defined for the demo, OOS-3

## Glossary
- promotora — "women who actually do this work", D1:L10 — simulated in the demo (OOS-2)
- cuarentena — D1:L17 — unclear → Q-23

## Success metrics

- She made the visit — D1:L17 "one measurable result: she made the visit"
- Two touchpoints reached — D1:L11 "The measurable core: two touchpoints, not one"
- No target number stated → Q-17.

## Contradictions

**C-1** — How long is bleeding red?

| | Statement | Source |
| :--- | :--- | :--- |
| A | "rojo vivo y abundante los primeros 3 días" | D2:L5 (product owner) |
| B | "el sangrado suele ser rojo los primeros 3–4 días" | D2:L14 (product owner) |

- Depends on it: REQ-7, REQ-40
- To resolve: 3 days, or 3–4?
- Pending: needs research on bleeding before deciding (D4:L4).
- **Resolved** (D7:L1): B — 3–4 days. Research: research-bleeding.md.

**C-2** — Does every health answer end with the disclaimer?

| | Statement | Source |
| :--- | :--- | :--- |
| A | "Every health answer ends" the disclaimer | D2:L12 (product owner) |
| B | the low-mood answer ends "No estás sola — y también puedes contarlo en el Círculo."; the chamomile answer ends differently | D2:L17, L15 (product owner) |

- Depends on it: REQ-39, REQ-40 (also D2:L18)
- To resolve: add it to those answers, or exempt some?
- **Resolved** (D4:L1): A — add the disclaimer to every health answer.

**C-3** — In what language does Ask Alba answer?

| | Statement | Source |
| :--- | :--- | :--- |
| A | "answering questions in context, in Spanish, with sources" | D2:L3 (product owner) |
| B | "answer in the language she asked" | D2:L12 (product owner) |

- Depends on it: REQ-34, REQ-35
- To resolve: always Spanish, or the language asked?
- **Resolved** (D4:L2): B — the language she asks in.

**C-4** — Is the Claude API only for the chat bot and workouts?

| | Statement | Source |
| :--- | :--- | :--- |
| A | "the rest doesnt need claude right now" | D7:L5 (product owner) |
| B | "you can use claude for the summary and weekly research articles" | D8:L2 (product owner) |

- Depends on it: REQ-6, REQ-9, REQ-46
- **Resolved** (D8:L2): B — the owner answered Q-28 with it. Later changed by D19:L1: the one-page summary no longer uses Claude (Q-32 withdrawn).

## Open questions

_Ranked by impact × uncertainty, highest first._

| ID | Score | Question | If guessed wrong | Input | Answer as | Blocks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Q-8 | I3×U3=9 | What counts as revealing on a shared phone: icon, notification, chat name? | exposure | "never reveals" D1:L13 | list | REQ-44 |
| Q-10 | I3×U3=9 | Circle size, admission, "around the world", tip length, live audio day and platform? | wrong space | "around the world" D1:L10 | list | REQ-12, 14, 15, 41 |
| Q-11 | I3×U3=9 | Who can see, edit, export or delete what: mom, promotora, moderator, admin? | wrong access | silent (searched "admin", "permission") | table | REQ-13, 17 |
| Q-4 | I3×U2=6 | What makes Ask Alba "unsure", and which sources count as medically-backed? | wrong health advice | "medically-backed" D1:L9; "not clinical guidance" D2:L19 | rule | REQ-9, 38 |
| Q-13 | I2×U3=6 | Is the appointment date she enters for the first contact or the comprehensive visit? | reminder aimed at the wrong visit | "visit-day reminder" D1:L11 | first / comprehensive / both | REQ-49, 22 |
| Q-15 | I3×U2=6 | Are the mental-health check-ins the daily mood question, and what triggers 988 (crisis)? | missed crisis | "plus 988 for crisis" D1:L12 | rule | REQ-27 |
| Q-16 | I2×U3=6 | How many reminders, when, and can she opt out? | spam or missed visits | silent (searched "opt out", "frequency") | schedule | REQ-20 |
| Q-17 | I2×U3=6 | What target counts as success, and how is attendance verified? | unmeasurable | "she made the visit" D1:L17 | number / method | REQ-23 |
| Q-18 | I2×U3=6 | What are the summary's trigger, sharing method, language and period? | doctor can't use it | "one-page summary" D1:L8 | list | REQ-6 |
| Q-19 | I2×U3=6 | Who writes weeks 2–6+, until which week, and what is "what people appreciated"? | content gaps | "and beyond" D1:L9 | week number | REQ-7, 8 |
| Q-20 | I2×U3=6 | Which phones, networks, data budget, offline use, accessibility level? | unusable | "low-spec" D1:L15 | list | REQ-32 |
| Q-25 | I2×U3=6 | What does the Spanish consent text say, including that her question and, for the summary, her check-ins and notes go to the Claude API? | consent not informed | "consent in Spanish" D1:L13 | text | REQ-30, 48 |
| Q-31 | I2×U2=4 | Confirm: a call over 5 seconds falls back to the seed answer? | demo stalls or flips early | "you decide timeout" D8:L3 | confirm / number | REQ-46 |
| Q-39 | I2×U2=4 | What does she see if a Claude call fails on any Ask Alba question other than the two live ones? | blank answer | "error message for now" D9:L1 | seed / error | REQ-46, 34 |
| Q-42 | I1×U3=3 | Is the chosen language kept across pages and visits? | she must re-pick each time | "dropdown to switch language" D14:L1 | session / device / none | REQ-53 |
| Q-43 | I1×U3=3 | What does the profile show, and what can she edit there (WhatsApp number, appointment date, clinic number)? | missing fields | "bubble with their profile" D15:L3 | list | REQ-54, 49 |
| Q-47 | I3×U3=9 | What is "overall status of health today": her own ratings only, or a judgment of how she is doing? | reads as a diagnosis | "overall status of health today" D17:L3 | her ratings only / other | REQ-57 |
| Q-50 | I1×U3=3 | What counts as "low cost" on the map: free, or a stated fee limit? | wrong label | "low cost clinics" D19:L2 | free / low / both | REQ-58 |
| Q-22 | I1×U3=3 | What makes it "very easy to use" and "meditative"; what palette? | rework | "almost meditative" D1:L15 | reference | REQ-31 |
| Q-23 | I1×U3=3 | What does cuarentena mean here: length, rules? | wrong framing | "la cuarentena" D1:L17 | days | REQ-33 |
| Q-35 | I1×U3=3 | What does the error message say, in Spanish? | confusing screen | "show an error message" D9:L1 | text | REQ-46 |
| Q-40 | I1×U3=3 | Is the WhatsApp welcome sent at sign-up or on day 3? | welcome mistimed | "Day 3, welcome in WhatsApp" D1:L21 | at sign-up / day 3 | REQ-24 |

_Resolved:_ Q-1 → web app with WhatsApp integration (D4:L3). Q-12 → demo scope in OOS-2 (D5:L1). Q-2 → check-ins and notes on the server, no real names, no retention policy (D6:L1; OOS-3). Q-3 → phone or email login, random alias, moderators see author (D6:L2). Q-7 → US first (D6:L5; OOS-4). Q-24 → starts in the app, reminders on WhatsApp (D6:L6). C-1 → 3–4 days (D7:L1). Q-26 → seed answer fallback (D7:L2). Q-27 → WhatsApp number and consent at sign-up (D7:L4). Q-25 narrowed to the consent text; Ask Alba sends only the question and page (D7:L3). Q-28 → Claude also for summary and weekly research (D8:L2; supersedes D7:L5 "the rest doesnt need claude"). Q-29 → workouts depend on the week (D8:L1). Q-5 → promotora review and moderation simulated (D8:L4). Q-6 → delivery date entered at sign-up (D8:L5). Q-30 → cautious values in AC-80 (D8:L6). Q-31 → 5 seconds chosen by the drafter at the owner's request, to confirm. Q-33 → error message for now (D9:L1). Q-34 → she enters the appointment date (D9:L2). Q-32 → check-ins and notes to the API for the summary only (D9:L3). Q-4 narrowed: Claude may cite others (D9:L4). P-4 → REQ-50 (D9:L5). Q-9 → 1–5 scales, pad yes/no, note (D10:L1). Q-14 → full-screen message with tap-to-call (D10:L2). Q-15 narrowed: mood-dip trigger set (D10:L3). Q-13 narrowed: day 20, visit at 6 weeks, 12-week outer limit (D10:L4). P-5 → REQ-51 (D10:L5). Q-37 → seed answers cite named sources, Claude-named sources flagged "sin verificar", full check later (D11:L1; OOS-5). Q-36 → she enters the clinic number, falls back to 911 (D11:L2). Q-18 narrowed: one-page printable screen (D11:L3). Q-41 → stack and local run (D12:L1; REQ-52). Q-38 and Q-24 → no login or sign-up; the demo starts with a starter user (D15:L1, L2; REQ-55, OOS-6). Q-48 → mock data (D20:L2). Q-49 → the mock town is in the US, so the US hotlines stay (D21:L1). Q-44 → week 2 (D16:L1). Q-45 → eight Circle rooms (D18:L2). Q-46 → illustrated demo map (D18:L1; REQ-58). Q-21 → English too, via a dropdown, starting in Spanish (D14:L1; REQ-53). Q-38 → mocked login, one demo user (D13:L1; OOS-6). Q-15: the TLC-MAMA hotline is shown on a mood dip (D13:L2); 988 trigger still open. C-2 → A (D4:L1). C-3 → B (D4:L2).

## Assumptions

None stated in input.

## Proposed — not in input

_Model-originated. Not requirements. Each needs a person's approval (amend) before it becomes one._

- **P-1** Content for cesarean or other delivery types — prompted by D2:L7 "la herida"; risk: wrong guidance.
- **P-2** Log of escalations and moderation actions — prompted by the safety model, D1:L10; risk: no record.
- **P-3** Metrics: share reaching the 3-week and the visit touchpoints — prompted by D1:L11; risk: no baseline.
- **P-4** Keep the Claude API key server-side only — approved → REQ-50 (D9:L5).
- **P-5** Check that sources Claude cites exist and are medical — approved → REQ-51 (D10:L5).
- **P-6** Map of local clinics by her location — approved → REQ-58 (D18:L1).

## Amendment log

| Date | IDs | Trigger | Change |
| :--- | :--- | :--- | :--- |
| 2026-11-06 | — | initial build | — |
| 2026-11-06 | C-2, REQ-39, REQ-40 | D4:L1 | disclaimer on every health answer; C-2 resolved |
| 2026-11-06 | C-3, REQ-34, REQ-35 | D4:L2 | answer language = language asked; C-3 resolved |
| 2026-11-06 | Q-1, REQ-24, new REQ-45, Q-24 | D4:L3 | web app with WhatsApp; Q-1 resolved; start flow asked as Q-24 |
| 2026-11-06 | C-1 | D4:L4 | stays open: research needed |
| 2026-11-06 | Q-12, OOS-2 | D5:L1 | demo scope: live vs simulated; Q-12 resolved |
| 2026-11-06 | Q-2, Q-3, Q-7, Q-24, REQ-17, 20, 24, 28, 29, 30, 34, OOS-3, OOS-4 | D6:L1, L2, L5, L6 | four questions resolved; values written into requirements |
| 2026-11-06 | new REQ-46, Q-25, Q-26, Q-27, P-4 | D6:L3, L4 | Claude API connection (critical); data-to-API, failure and sign-up questions |
| 2026-11-06 | C-1, REQ-7, REQ-40 | D7:L1 | red bleeding 3–4 days; C-1 resolved |
| 2026-11-06 | Q-25, 26, 27, REQ-46, 48, REQ-24, 29 | D7:L2–L4 | fallback to seed answer; API gets question and page only; WhatsApp number and consent at sign-up |
| 2026-11-06 | REQ-46 narrowed, new REQ-47, Q-28, Q-29, Q-30, Q-31 | D7:L5 | Claude API for chat bot and personalized workouts only; summary and research not on Claude |
| 2026-11-06 | Q-28, REQ-6, 9, 46 | D8:L2 | Claude also for summary and weekly research (supersedes D7:L5 "the rest doesnt need claude") |
| 2026-11-06 | Q-29, REQ-47 | D8:L1 | workouts depend on the week for the pelvic floor |
| 2026-11-06 | Q-5, Q-6, REQ-10, 13, 18, 22, 48, OOS-2 | D8:L4, L5 | review and moderation simulated; delivery date entered at sign-up |
| 2026-11-06 | Q-30, REQ-7, REQ-40 | D8:L6 | cautious bleeding values on cards and seed answer |
| 2026-11-06 | Q-31, REQ-46; new Q-32, Q-33, Q-34 | D8:L3 | 5-second timeout picked by drafter (unconfirmed); new questions on API data, failure, visit date |
| 2026-11-06 | Q-33, Q-34, Q-32, REQ-46, 22, 6, new REQ-49 | D9:L1–L3 | error message for now; appointment date entered in app; check-ins and notes to API for summary only |
| 2026-11-06 | Q-4, REQ-34; P-4 → REQ-50; new P-5, Q-35 | D9:L4, L5 | Claude may cite other sources; API key server-side; citation check proposed |
| 2026-11-06 | Q-9, Q-14, REQ-4, 5, 25, 26 | D10:L1, L2 | check-in scales and note; full-screen escalation with tap-to-call; new Q-36 |
| 2026-11-06 | Q-15, Q-13, REQ-18, 19, 43, 49 | D10:L3, L4 | mood-dip trigger; day-20 reminder, visit at 6 weeks with 12-week limit; Q-15 and Q-13 narrowed |
| 2026-11-06 | P-5 → REQ-51; new Q-37 | D10:L5 | citation check approved |
| 2026-11-06 | REQ-6, 9, 40, 46, 47, AC-7, 74, 80, OOS-4; new C-4, Q-38, Q-39, Q-40, AC-86, 87, 88, 89 | reader check 2 | removed inferred values; seed file requirement; Claude for summary/research as permitted; split AC-80; C-4 recorded; stale pointers fixed |
| 2026-11-06 | Q-37, Q-36, Q-18, REQ-6, 25, 26, 49, 51, OOS-5; new Q-41, AC-90 | D11:L1–L3 | citation flag for now; clinic number entered with fallback to 911; summary is a printable one-page screen; stack question added |
| 2026-11-06 | Q-41, new REQ-52 | D12:L1 | stack and local run decided |
| 2026-11-06 | Q-38, REQ-28, OOS-6; Q-15 | D13:L1, L2 | login mocked, single demo user; hotline shown on a mood dip |
| 2026-11-06 | Q-21, REQ-3, new REQ-53, Q-42 | D14:L1 | English via a dropdown, start in Spanish |
| 2026-11-06 | REQ-7 | D14:L2 | source-research corrections applied to cards and seed answers: source lines, two-week baby-blues wording, chamomile per LactMed, ice 24 hours, nettle/raspberry marked no clinical source; Card 6 and the wound warning left unchanged |
| 2026-11-06 | REQ-28, 30, 48 removed; OOS-6; new REQ-54, 55; Q-43, Q-44 | D15:L1–L3 | login, sign-up and consent screens removed; the demo starts with a starter user (named by the owner; not written in this spec) and a profile bubble at the top right. Supersedes "no real names" (D6:L1) for this demo persona only |
| 2026-11-06 | Q-44, REQ-55 | D16:L1 | starter user in week 2 |
| 2026-11-06 | new REQ-56, REQ-57, P-6, OOS-7, Q-45, Q-46, Q-47 | D17:L1–L4 | Circle chats by category; dashboard calendar; clinic map proposed; HIPAA review deferred |
| 2026-11-06 | Q-45, Q-46, REQ-56, REQ-57, P-6 → REQ-58 | D18:L1–L3 | eight Circle rooms; calendar fills the right side; illustrated demo clinic map |
| 2026-11-06 | REQ-6, REQ-46, C-4 note, REQ-58, new Q-48 | D19:L1, L2 | the one-page summary is built locally and nothing is sent to Claude; low-cost clinics asked for on the map |
| 2026-11-06 | REQ-58, Q-48 resolved; new Q-49, Q-50 | D20:L1, L2 | map in its own bottom tab; mock promotoras, clinics and community centers for a rural town in Mexico; hotline numbers for Mexico asked |
| 2026-11-06 | REQ-58, Q-49 resolved | D21:L1 | mock town moved to the US; fake promotoras, community centers and clinics |
