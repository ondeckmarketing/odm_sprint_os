# ODM Sprint OS — multi-user deploy (Cloudflare Pages + D1)

Shared, synced sprint tracker. Every checkmark writes to a Cloudflare D1
database, so Chris, Sean, and anyone with the link see the same state.

## What's in here
- `index.html` ............ the dashboard (frontend)
- `functions/api/*.js` .... Pages Functions API (state / toggle / reset)
- `schema.sql` ............ database table
- `wrangler.toml` ......... project + D1 binding config

The frontend auto-detects the backend. Hosted on Pages with D1 => "Synced"
(multi-user). Opened as a plain file with no backend => "Local only" fallback.

---

## Option A — Deploy with Wrangler (CLI)
Prereq: Node installed, then `npm i -g wrangler` and `wrangler login`.

1. Create the database:
   wrangler d1 create odm-sprint
   -> copy the printed database_id into wrangler.toml (replace the placeholder)

2. Create the table (remote):
   wrangler d1 execute odm-sprint --remote --file=schema.sql

3. Deploy:
   wrangler pages deploy .

Wrangler prints your live URL. Done.

Local preview with the DB:
   wrangler pages dev . --d1 DB=odm-sprint

---

## Option B — Deploy from the Cloudflare dashboard (no CLI)
1. Workers & Pages -> Create -> Pages -> Upload assets. Upload this whole
   folder (keep the functions/ folder structure). Name it "odm-sprint-os".
2. Storage & Databases -> D1 -> Create database -> name it "odm-sprint".
   Open it -> Console -> paste the contents of schema.sql -> run. (Creates task_state, gate_state, and keyword_state.)
3. Back in the Pages project -> Settings -> Functions (or Bindings) ->
   D1 database bindings -> Add:
      Variable name: DB
      Database:      odm-sprint
4. Redeploy (Deployments -> Retry/Redeploy) so the binding takes effect.

Visit the URL. The status pill (top right) should read "Synced".

---

## Notes
- First visit asks for your name (attribution only — no login). Click the
  status pill anytime to change it. Hover a completed task to see who did it.
- Every task has an **Owner dropdown** — reassign on the fly. Pick a name,
  choose "Unassigned", or "+ Add person…" to grow the roster. Owner changes
  sync to everyone just like checkmarks.
- The **Gate tab** scores each client against the 10-item day-90 retention
  benchmark (G3-01..G3-10). Mark each Yes / No / N/A; one No = the gate fails.
  Each client's pass/fail also shows on its dashboard card. Scores sync too.
- **Reset sprint** now clears task progress AND gate scores but KEEPS owner
  assignments, so you roll into the next 90 days with the team intact.
- The **Keywords tab** is a per-client focus-keyword bank: add / edit / delete
  terms, with a star to flag primary keywords (the ones G3-05 is scored on).
  Keywords sync across the team and PERSIST through a sprint reset.
- The page polls every 8 seconds, so teammates' changes appear within ~8s.
- "Reset sprint" clears ALL progress for everyone — use it for the next
  90-day sprint. To roll forward, just reset on the new start date.
- To change clients/tasks/dates, regenerate index.html (ask Claude) — the
  task list is embedded as data near the top of the <script>.

---

## Mobile / install as an app
The dashboard is fully responsive — phones, tablets, laptops. It also ships
as a PWA, so the team can install it to a home screen and run it full-screen:

- iPhone (Safari): open the URL -> Share -> "Add to Home Screen".
- Android (Chrome): open the URL -> menu -> "Install app" / "Add to Home Screen".

Files `manifest.json`, `icon-192.png`, and `icon-512.png` power this — keep
them in the project root alongside index.html.
