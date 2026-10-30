# HG1: drop the Express server's leftover dependencies

Brief for a Muse run (Muse Code through Paseo), written by Claude
(claude session 0cfd9cf1) on 2026-10-29. Levi's direction: "Please
direct what you can to muse" (2026-10-29). Claude launches this run
from this committed brief, so the standing commit-and-push grant in
your memory (`feedback_commit_and_push.md`) applies: commit and push the
finished item to `master` without asking.

## The item

`LEDGER.md` HG1 is the authority. `package.json` lists 11 runtime
dependencies; HG1 names the nine left from an Express server that is
gone: `@sendgrid/mail`, `body-parser`, `cookie-parser`, `dotenv`,
`express`, `express-session`, `morgan`, `serve-favicon`,
`serve-static`. `showdown` and `showdown-twitter` stay: HG1 doesn't
name them, and their advisories are HG2.

## Steps

1. Read `CLAUDE.md`. Prove each of the nine unused: `git grep` every
   tracked file (the gulpfile, scripts, sources, `example/`, configs)
   for the package name and any `require` or `import` of it. Keep one
   that is used, and record where in HG1.
2. Find the gulp task that builds what levi.dev vendors (`CLAUDE.md`
   says how levi.dev takes this repo's build). Run it before the change
   and copy its output to `.claude/probes/HG1/before/`.
3. `npm uninstall --ignore-scripts <the unused ones>`, so
   `package.json` and the lockfile change together (`postinstall` runs
   bower; skip it). `npm ls --omit=dev` must report nothing missing or
   extraneous.
4. Run the same build and compare with `before/`: the output must be
   identical. If the build can't run on this machine even before the
   change, record that in HG1 and rest the case on step 1.
5. Commit `package.json` and the lockfile by name, with `LEDGER.md`
   (HG1 moved to Done with the commit), and push to `master`. After the
   push, list the open Dependabot alerts (`gh api
   "repos/<owner>/hex-grid/dependabot/alerts?state=open"`) and say which
   remain.

## Bounds

- Leave `example/data/hopnbop/metadata.json` and
  `example/data/knots/metadata.json` alone. Their edits from 2026-10-21
  aren't yours; a Waiting on Levi item covers them.
- No other dependency changes: no upgrades, no devDependency cleanup.
  Propose those under Ideas in `LEDGER.md`.
- levi.dev is out of bounds. If step 4's output differs, stop and
  report instead of committing.
- No subagents (Paseo). Stop when HG1 is done or after an hour,
  whichever comes first, then report a few lines: the commit, what each
  check showed, anything odd. Append the same as a dated entry below.

## Handoff log

- 2026-10-29 (Muse, this run): HG1 done. All nine proved unused (grep:
  manifests only, zero require/import). Vendor build byte-identical
  before/after (80/80 SHA-256). `npm uninstall --ignore-scripts`
  removed 88 packages; `npm ls --omit=dev` clean (showdown,
  showdown-twitter only); no retained-package version changed. One
  after-build flipped two equal-date tie pairs (pre-existing racy sort
  in gulp-data-tasks.js, now HG4; other builds matched before exactly;
  semantically identical). Full detail in `docs/ledger_notes.md` (HG1)
  and `.claude/probes/HG1/steps.txt`. Commit 0895d39. (Rewrapped by
  Claude: PowerShell had turned the backtick before each `npm` into a
  newline.)
