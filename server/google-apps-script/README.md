# Smartcom IELTS → Google Sheets (server deployment)

This folder contains the **server code**, not a functioning deployment. Editing GitHub alone will **not** change the current Google Apps Script web app.

1. Open the destination spreadsheet: https://docs.google.com/spreadsheets/d/1pBSYFuiN6FNVrce1nMTUQa2INLyTrqrx4r7XWs_rVAA/edit
2. Choose **Extensions → Apps Script** using an account with edit rights. Back up the current Apps Script before replacing any handlers (other workflows may depend on them).
3. Add a new Apps Script project (prefer a new bound project for this receiver), paste `Code.gs` and save.
4. **Deploy → New deployment → Web app**. Execute as **Me** and allow access to **Anyone** (only if school policy permits); copy the `/exec` URL. If an organization blocks public endpoints, use an authenticated proxy instead.
5. Update the `ENDPOINT` constant in `Practice/shared/attempt-history.js` to this URL. Existing pages with their own Apps Script URLs must be migrated separately; enumerate and verify them.
6. Test with a synthetic TEST/PRACTICE row, check `_SC_ATTEMPT_INDEX` and the appropriate RESULTS sheet, and verify duplicate submission does not add another row. Remove synthetic test rows afterward.
7. Add a readable verification by polling `GET /exec?action=status&attemptId=...&callback=scAck_...`. Do not treat an opaque POST response as successful sync.

Fields: `mode, name, className, skill, practiceType, practiceId, score, total, percent, attemptId, durationSeconds, details`.
The hidden `_SC_ATTEMPT_INDEX` (optional to hide after deployment) ensures idempotency by `attemptId`.

**Warning:** This endpoint accepts writes from the public internet when deployed as Anyone. For production, add gateway authentication, abuse limits and monitoring. A secret embedded in frontend JavaScript is not a secret.
