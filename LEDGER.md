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

- **HG4** · The data build orders equal-date posts at random:
  `readInjectedDescription` (`example/gulp/gulp-data-tasks.js:111`)
  pushes metadata in `fs.readFile` completion order and
  `timeStringComparator` (`:148`) returns 0 for equal dates, so tied
  posts (`before-times`/`dandelions`, `photo-viewer`/`progress-circle`)
  can swap between builds in `data.min.json`, `index.html` and
  `sitemap.xml`. Fix: break ties by id. Found by HG1's byte-compare
  (`docs/ledger_notes.md`, HG1). A small Muse task.

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

- **HG5** · Dependabot alert #136 (`qs` 6.16.0, dev via gulp-connect → tiny-lr, GHSA-6pq8-jhm2-2vcw): merged Dependabot PR #58 (`qs` 6.17.1, lockfile only). Done in 7c5afaa (2026-10-29).
- **HG1** · Dropped the 9 unused Express-era runtime dependencies (Muse; full text in `docs/ledger_notes.md`). Done in 0895d39 (2026-10-29).
