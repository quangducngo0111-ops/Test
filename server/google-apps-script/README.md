# Smartcom IELTS → Google Sheets receiver (deployment checklist)

> **Important:** Editing `Code.gs` on GitHub does **not** modify a deployed Apps Script Web App. The developer must redeploy the running receiver.

## Verified destination

- Google Sheet: **Theo dõi BTVN**
- Destination: https://docs.google.com/spreadsheets/d/1pBSYFuiN6FNVrce1nMTUQa2INLyTrqrx4r7XWs_rVAA/edit
- Scores appear in **PRACTICE_RESULTS** and **TEST_RESULTS**.
- `_SC_ATTEMPT_INDEX` is created by this receiver after the first successfully accepted POST; it is used for idempotent `attemptId` checks.

The repository also contains `backend/google-apps-script/class-score-receiver.gs`, which writes to per-class tabs and has **no JSONP status endpoint**. Do not accidentally deploy that file in place of the result receiver unless you intentionally want the different destination/schema.

## Safe deployment

1. In Google Apps Script, **back up any existing project** and its deployment configuration. If it handles other workflows, **create a separate project** (using `script.google.com`) rather than overwriting the existing `doPost`.
2. Copy the complete contents of `server/google-apps-script/Code.gs`. It specifies the destination spreadsheet ID explicitly and can work as either a standalone project or a bound script under an account with access to the destination Sheet.
3. Save, authorize access to Google Sheets, then choose **Deploy → New deployment → Web app** (or **Manage deployments → Edit → New version** when updating the same Web App).
4. Choose **Execute as: Me**. Set **Who has access: Anyone** only when institution policy permits. A public endpoint must be protected against abuse for production use; client-side secrets do not provide protection.
5. Open the deployed `/exec?action=health` URL. The updated receiver should return an `ok:true`, `ready:true`, and `version:2026-11-26-v2` JSON object. A missing version indicates an old deployment.
6. Copy the **actual newly deployed /exec URL** to the `ENDPOINT` constant in `Practice/shared/attempt-history.js`. The shared recorder now routes **Reading Practice** requests to that one endpoint even if older lessons still contain a hardcoded URL. Other test flows with direct URLs must be migrated separately.
7. Perform **one synthetic practice submission**. Verify a new row in `PRACTICE_RESULTS` and its `attemptId` in `_SC_ATTEMPT_INDEX`. Check `/exec?action=status&attemptId=<the same ID>` returns `recorded:true`. Delete only your synthetic test records afterward.

### Frontend data safety

- Every new graded Reading submission now accepts either a string or a `URLSearchParams` request body, records locally, and sends the **same attemptId** on the first POST and any safe retry.
- Do **not** infer success from `fetch(..., {mode:'no-cors'})`. Only an explicit server acknowledgement for that attempt ID confirms a recorded Sheet row.
- Previously submitted browser-local records might be present under `SC_ATTEMPT_HISTORY_V1` and `SC_RESULT_OUTBOX_V2`. **Do not automatically resend old unknown-status attempts**, because older clients may have sent the first request without the later-generated attempt ID, and retrying could duplicate a score.
- **Reading Library** is ungraded reading and currently stores reading progress locally. It is not supposed to write an exam score to `PRACTICE_RESULTS`.

## Receiver field contract

`mode, name, className, skill, practiceType, practiceId, score, total, percent, attemptId, durationSeconds, details, submittedAt`

The status endpoint supports JSONP with a `scAck_` callback because the public Apps Script service does not provide normal CORS headers. The endpoint responds with `recorded:true` only after the indexed row was written.
