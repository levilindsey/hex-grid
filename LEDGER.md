# hex-grid ledger

Open work for hex-grid, the portfolio component and post data that
levi.dev vendors: follow-ups, known residuals, decisions waiting on Levi,
and ideas. Convention: claude-config `rules/ledger.md`. IDs (`HG<n>`) are
stable and never reused. Site-level items go in levi.dev's `LEDGER.md`.

Session pointers like "session 530145bc, agent a0456b95" refer to Claude
Code transcripts under `~/.claude/projects/` (kept 30 days). Each item
states its facts, so it stands on its own after the transcript is gone.

## Waiting on Levi

- **HG3** · Two edits uncommitted since 2026-10-21 change the post
  date from `2026` to `2026-2027` in
  `example/data/hopnbop/metadata.json` and
  `example/data/knots/metadata.json`. Keep them (commit, redeploy)
  or discard?

## In progress

## Next

## Residuals (known, not fixed)

- **HG2** · showdown 2.1.0 ships three advisories dismissed as
  tolerable_risk on 2026-10-11 (CVE-2026-59710, CVE-2026-59711,
  CVE-2024-1899), acceptable while post markdown stays first-party.
  npm's latest is still 2.1.0 and a dismissed alert gets no
  security-update PR, so nothing will announce a fix: bump when a
  later release exists, or swap to markdown-it
  (dependency-vulnerability-roundup 2026-10-14, rechecked 2026-10-21).

## Ideas (not scheduled)

## Done

- **HG1** · Dropped the 9 unused Express-era runtime dependencies
  (`@sendgrid/mail`, `body-parser`, `cookie-parser`, `dotenv`,
  `express`, `express-session`, `morgan`, `serve-favicon`,
  `serve-static`); `dependencies` now holds only `showdown` and
  `showdown-twitter`. Proof: no `require`/`import` of any of the nine
  in any tracked file — each appeared only in `package.json` /
  `package-lock.json` (the `Express` strings elsewhere are post
  categories and doc prose). `npm ls --omit=dev` clean; lockfile lost
  88 packages with zero version changes to retained packages (the one
  remaining `serve-static` lock entry is `dev: true`, via
  `gulp-connect`). Vendor build
  (`npx gulp --series clean data scripts styles`) byte-identical
  before/after: 80/80 files SHA-256 equal in `dist/` +
  `example/dist`. Known wrinkle, pre-existing and unrelated: one of
  four after-builds flipped two equal-date tie pairs
  (`before-times`/`dandelions`, `4/2021`;
  `photo-viewer`/`progress-circle`, `2/2014`) in
  `data.min.json`/`index.html`/`sitemap.xml` — semantically identical
  (posts equal sorted by id). Cause: `gulp-data-tasks.js` pushes in
  async `fs.readFile` completion order and its date comparator
  returns 0 for equal dates with no `tieBreaker`. Evidence:
  `.claude/probes/HG1/` (untracked; left uncommitted per brief). Brief:
  `docs/design/HG1_drop_express_deps.md`. Resolved in this commit
  (Muse, 2026-10-29; launched by claude 0cfd9cf1).
