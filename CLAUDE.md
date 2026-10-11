# CLAUDE.md

Two things live in this repo:

1. **The hex-grid library**: `src/` → `dist/hex-grid*.{js,css}`
   (tracked). Vanilla JS + CSS, gulp 5, no tests. An animated grid of
   hexagonal tiles that displays "posts".
2. **Levi's portfolio app and data**: `example/`. The page at
   https://levi.dev is this example app, and `example/data/<post-id>/`
   is the post content. levi.dev does not build this repo; it vendors
   the build output (see "levi.dev" below).

**To add or update a post, use the `levi-dev-post` skill**
(claude-config). It covers text, media (R2), build, vendoring into
levi.dev, commits in both repos, and deploy verification. This file is
the reference the skill leans on.

## Build

```powershell
npm install                                  # once per machine; postinstall runs bower (dat.gui)
npx gulp --series clean data scripts styles  # full build (what levi.dev's `npm run vendor` runs)
npx gulp data                                # posts only; ALSO wipes example/dist, so follow with scripts + styles
npx gulp                                     # clean + build + dev server on :3000 with livereload
```

- **Always `--series`** when naming several tasks. The gulp CLI runs
  them in parallel by default, and `data` starts by deleting all of
  `example/dist`, which `scripts` and `styles` write into.
- `data` (in `example/gulp/gulp-data-tasks.js`): inject each
  `description.md` into its `metadata.json` `"content"` →
  `example/dist/data/<id>.json` → sort newest-first and merge with
  `collection-metadata.json` → `example/dist/data.min.json` → inject
  that into `example/dist/index.html` (SEO dump) → render the 4-line
  template `example/sitemap.xml` to `example/dist/sitemap.xml` (root,
  devlog, and `https://www.levi.dev/#<id>` per post; `lastmod` is the
  build date).
- `example/dist/` is gitignored. `dist/` is tracked, so a rebuild can
  dirty it; commit it with the post.
- The runtime (`example/scripts/data.js`) fetches only
  `<appRootPath>/dist/data.min.json` and composes media URLs from
  `collection-metadata.json`:
  `<baseUrl>/<id>/<logoName | thumbnailName | images[].fileName>`.

## Post schema: `example/data/<post-id>/`

`metadata.json` (copy a recent post such as `kittenbaticorn`):

| field | value |
|---|---|
| `id` | the folder name |
| `titleShort` | tile title; `\n` separates up to three short lines |
| `titleLong` | expanded title |
| `emphasis` | 0–1 tile prominence (`0.6` side project, `0.8` flagship) |
| `color` | hex; recent posts use `#f5d74c` |
| `urls` | object of label → URL. Labels in use: `github`, `demo`, `homepage`, `ludum-dare`, `global-game-jam`, `devlog`, `soundcloud`, `codepen`, `itchio`, `youtube`, `play-store`, `app-store`, `published`, `godot-asset-library` |
| `jobTitle`, `location` | strings; `""` for side projects |
| `date` | `"2026"`, `"4/2026"`, or `{"start": "m/yyyy", "end": "m/yyyy" or "present", "tieBreaker": n}`; sorted newest first |
| `categories` | tags. Common: Side-Project, App, Game, 2D, 3D, Animation, Teamwork, Godot, Art, Solo-Work, Web, Frontend, Game-Jam, AI, Music, Work, Library, C++, Typescript, Networking, Platformer, Competitive, Website, Research, School |
| `images` | `[{"fileName": "x.gif", "description": "caption"}]`; files live under `<baseUrl>/<id>/` |
| `videos` | `[{"videoHost": "youtube", "id": "<11-char id>", "description": "caption"}]` or `[]`; `vimeo` also supported |
| `content` | always `""`; the build injects `description.md` |

`description.md` is Showdown markdown. House style: a `> one-line
hook` blockquote, a few paragraphs, a `### 🛠️ Tools` list with
bold links, optionally an `_All art ... made without the use of AI._`
line, and an emoji sign-off.

It is rendered in the browser by showdown 2.x (bundled into
`dist/hex-grid.js`, `github` flavor, no extensions). **Delete unused
`[id]: url` reference definitions**: showdown 2.x only strips a
definition whose id appears at least twice in the text, so an unused
one renders as a visible `[id]: url` paragraph (1.x hid them; 32 such
lines were removed from 15 old posts in the 2026-10 upgrade).

`collection-metadata.json`: `baseUrl` is `https://levi.dev/media`,
the R2 bucket `levi-portfolio-media` behind levi.dev's media Function
(S3 until 2026-10-10); plus `logoName`, `thumbnailName`,
`thumbnailDimensions`.

## Media

Per post, under `<id>/` in the bucket: `logo.png` (128 px tall, any
width; shown in a 45%-wide × 50 px box with `background-size:
contain`), `thumbnail.png` (128×128), and whatever `images[]` names
(PNG screenshots, GIF captures; the carousel is 16:9). Prepared and
uploaded with levi.dev's `npm run media:prepare` and
`npm run media:upload`.

Logos and thumbnails are hand-drawn in two Inkscape masters on Google
Drive (`levi-portfolio/logos.svg` and `thumbnails.svg`, 20–28 MB, one
unlabeled layer each). `example/docs/design/logos.svg` and
`thumbnails.svg` here are **stale 2021 snapshots**; don't edit or
trust them.

## levi.dev

`~/Repositories/levi.dev/apps/hex-grid/public/` is a robocopy mirror
of `dist/` and `example/{data,dist,images,scripts,styles,index.html}`,
refreshed by `npm run vendor` in levi.dev (`example/docs` and
`example/gulp` are deliberately not vendored). Nothing is edited there
by hand. Order for any change: edit here → commit + push here →
`npm run vendor` in levi.dev → commit + push there (CI deploys).

## Git

Commit directly to `master` and push. Dependabot PRs land regularly;
merge them. The repo is public (MIT), so post text is public the
moment it is pushed.
