# Reading UX standard (2026-11-09)

The full Reading tests and the Reading practice exercises have **separate, deliberate tools**. New Reading pages should use these same files instead of inventing new selection menus.

## Reading Practice

Load `../../reading-standard.js?v=20261109-v3` at the end of a numbered exercise page under `Practice/Reading/<type>/<number>/`.

- Elapsed (count-up) timer while answering; freeze the display on submission.
- Existing selection menus for **Highlight** and **Take note**, with persistent local browser markup in the original exercise engine. Hovering over a highlighted note anchor now shows a floating note tooltip, including notes restored from localStorage.
- Double-click a **single English word in `#passageRoot`** to show a Vietnamese machine translation in a popover. Uses the public MyMemory endpoint, without a paid key. Requires internet, may be rate-limited or unavailable. When the request fails, a translation link appears; never pretend a translation was obtained.
- Review **every answer**, correct or incorrect, immediately under that item after submission. The reusable script calls the exercise's existing `renderReview` or `reviewHTML` function to retain its own answer key, explanation and evidence. For note/table layouts it moves the result below the relevant input/row.
- Existing evidence links call each exercise's `focusEvidence`. Ensure **every exercise** has clickable evidence; the Short Answer and Table Completion examples also implement evidence focus.
- Keep result submissions, answer keys, assessment logic, and attempts in the page unchanged.

**Numbered practice pages directly upgraded:** ReadingPassage1/01; ReadingPassage2/01–05; NoteCompletion/01–02; TrueFalseNotGiven/01–04; TableCompletion/01; ShortAnswerQuestions/01. Other pages have not been modified unless listed here.

## Reading Test

Load `../Practice/Reading/reading-test-standard.js?v=20261109-v4` from `ReadNN/index.html`.

- **Count down** 60 minutes. Auto-submit on expiration remains in the original exam engine. Both tests and practice load `assets/student-entry.js`: a valid homepage profile skips duplicate name/class entry; standalone visitors get the eight-class searchable input, exact-value validation, and must enter a name.
- Annotation toolbar and contextual text selection popover: **Highlight**, **Take note**, remove highlight, **Bold**; no dictionary. Notes appear on mouse hover and persist within the exam session; the purple two-pane layout follows the Practice interface while retaining the **60-minute countdown**.
- After submission, show explanation, correct answer, and clickable passage evidence **under all answer slots**, not only wrong answers.
- Clicking evidence text (or the evidence button) focuses and highlights the cited paragraph in yellow on the left.
- Preserve the original exam's 40-question scoring, answer storage, and Sheets submission.

**Full tests upgraded:** `Read01` to `Read13`.

## Regression checklist

1. Start a practice exercise. Verify count-up timer, Highlight and Take note. Select text, write a note, then hover the annotated word to confirm the full note appears. Reload and check the saved note still appears on hover. Double-click a word in the left passage; popover should show a real returned Vietnamese translation or a clear fallback.
2. Answer some items correctly, some incorrectly, leave at least one blank. Submit. Confirm the timer stops, **every** question gets its own answer/explanation, and click evidence to illuminate the left paragraph.
3. Navigate away and back; check saved highlights/notes and answers behave as in the original engine.
4. Start a Reading Test. Verify **60:00** countdown, Highlight, Take note and Bold (in the inline toolbar and selected-text popover), and no dictionary. Hover notes to read them. Check the Practice-like two-pane layout. Highlight and bold in both passage and questions, then switch passages and back to check persistence.
5. Submit with wrong/right/blank answers, including multi-select groups. Confirm feedback appears below each item; clicking a quotation highlights the cited left paragraph. No feedback or correct answers should become visible **before** submission.
6. Verify exactly one result submission is posted to the existing Google Apps Script endpoint for each completed attempt. Check the connected Google Sheet.
7. Verify behavior at desktop and mobile widths and with the browser translation service offline.

The connector-backed edits passed JavaScript parsing and static checks, but **browser interaction and Google Sheets end-to-end submissions still need real-device smoke tests**. This is a checklist, not a claim that those tests have run.

## Student profile regression

1. On the homepage, enter a valid name and one of the eight official class codes. Open any upgraded Reading Test/Practice page: it must start directly using this saved identity without asking again.
2. In a clean browser profile with no `IELTS_PRACTICE_STUDENT` value, open a deep Reading link directly: a student name and a valid class must be entered. Typing `XD` suggests only matching codes and arbitrary values must be rejected.
3. Log out from the homepage to clear the shared identity; a newly opened deep Reading link must require login.
4. This is a convenience profile, **not** an authenticated student account; do not treat it as proof of identity.
