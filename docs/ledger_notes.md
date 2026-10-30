# Ledger notes

Text moved out of `LEDGER.md`, verbatim: the full text of items that
were shortened, moved or closed, under their ID. The ledger keeps each
item short and this file keeps the rest. New entries go at the bottom.

## HG1

Done entry as Muse wrote it in 0895d39 (2026-10-29):

Dropped the 9 unused Express-era runtime dependencies
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
