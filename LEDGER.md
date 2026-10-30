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

- **HG1** · Drop the 9 runtime dependencies left over from an old
  Express server that nothing uses (express, express-session,
  @sendgrid/mail, body-parser, morgan, and others). They cause most of
  the Dependabot churn: @sendgrid/mail brought in follow-redirects (the
  two highs PR #57 fixed), and no tracked file but the manifests
  mentions sendgrid or axios. Muse can take it: hex-grid joined
  `~/.config/muse/trust.json` on 2026-10-29. (Session 530145bc,
  2026-10-11; dependency-vulnerability-roundup 2026-10-21.)
  - owner: muse ac65d867-4eaa-4b20-9fd2-f899131fd9a2 (Paseo; launched by claude 0cfd9cf1)
  - branch: mainline; last commit: `dd02e63`
  - evidence: `.claude/probes/HG1/`
  - next: Muse works the brief; then Claude reviews its commit
  - brief: `docs/design/HG1_drop_express_deps.md`

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
