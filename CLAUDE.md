# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project overview

UtilPlex is a static developer-utilities site. Every page is pre-rendered HTML, every tool runs entirely in the browser, no framework runtime ships to the client. Render speed, cleanliness, and SEO are explicit priorities — prefer removing effects to keeping them.

The previous Angular app lives in `legacy/` for reference and should not be modified. New work happens at the repo root.

## Stack

- Plain Node.js build script (`builder/build.mjs`)
- [Eta](https://eta.js.org) templates
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/postcss`
- [esbuild](https://esbuild.github.io) bundles per-tool ES modules
- Tool libraries: `sql-formatter`, `prettier` (standalone + parser plugins), `js-yaml`, `js-beautify`, `diff`
- Pure ESM — `"type": "module"` in `package.json`

## Commands

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run build`   | Build the static site into `site/`                   |
| `npm run preview` | Serve `site/` on http://localhost:4000               |
| `npm run clean`   | Remove `site/`                                       |

There is no test, lint, or dev-server step yet. Builds may fail on Windows with `EBUSY`/`EACCES` if `npm run preview` holds files open — the build already swallows those.

## Layout

```
builder/
  build.mjs              # main build pipeline
  templates/             # Eta templates
    layout.eta           # site frame (head, header, footer)
    home.eta             # landing page
    tool.eta             # tool page wrapper
    tool-bodies/<entry>.eta  # one body template per tool
    page.eta             # generic prose page (how-it-works)
    patch-notes.eta      # patch-notes index
  lib/
    icons.mjs            # inline-SVG icon set (Lucide-derived)
    seo.mjs              # JSON-LD generators
    sitemap.mjs          # sitemap.xml generator
    rss.mjs              # rss.xml generator (patch notes feed)
    util.mjs             # formatDate, minifyCss, minifyHtml, escapeHtml
  assets/
    app.css              # Tailwind v4 source — theme tokens + component CSS
    main.js              # site-wide chrome (theme toggle, copy/clear buttons)
    theme-init.js        # inlined into <head> before paint, sets html.dark

content/
  site.json              # site metadata, navigation, twitter handle
  tools.json             # categories + tools (source of truth for tool list)
  patch-notes.json       # release notes — drives /patch-notes/ and rss.xml
  pages/<slug>.json      # generic prose pages (e.g. how-it-works.json)

tools/src/
  _helpers.js            # $, bindRun, bindSample, setStatus, indentValue
  _prettier.js           # shared wrapper for Prettier-based formatters
  _case.js               # key-case transform for JSON↔YAML
  <entry>.js             # one ES module per tool, named to match tools.json#entry

site/                    # build output (gitignored)
legacy/                  # the old Angular app, reference only
```

## How a tool is wired

Each tool is identified by an `entry` string. Three things must share that name:

1. `content/tools.json` — `entry: "format-json"` (under the right category)
2. `builder/templates/tool-bodies/format-json.eta` — the page body markup
3. `tools/src/format-json.js` — the ES module that wires up the markup

The build:
- renders `tool.eta` with the body included → `site/<category>/<slug>/index.html`
- bundles `tools/src/format-json.js` → `site/assets/tools/format-json.js`
- the layout's `<script type="module" defer src="/assets/tools/format-json.js">` is only emitted when `toolEntry` is set, so other pages stay JS-light.

## Adding a tool

1. Add the tool to the right category in `content/tools.json`. Set `entry`, `slug`, `icon` (must exist in `builder/lib/icons.mjs`), and `keywords`.
2. Create `builder/templates/tool-bodies/<entry>.eta`. Copy the closest sibling — most formatters use the same input/output two-pane layout with `id="input"`, `id="output"`, `data-action="run"`, `data-action="sample"`.
3. Create `tools/src/<entry>.js`. Use the helpers in `_helpers.js` — `bindRun(handler)` wires the run button + Ctrl/Cmd-Enter, `bindSample(() => "...")` wires the sample button, `setStatus(msg, "ok"|"error")` writes to the status line.
4. Add a `patch-notes.json` entry describing the new tool.
5. Bump `version` in `package.json`.

That's it — sitemap, RSS, JSON-LD, navigation, and the home tool grid all read from `tools.json` and update automatically.

## Adding a generic page

1. Drop a JSON file in `content/pages/`, shape `{ slug, title, description, sections: [{ heading, body }] }`.
2. Build. The page renders to `site/<slug>/index.html` and is added to the sitemap with `0.5` priority.

## SEO conventions

- Every page emits `<canonical>`, OpenGraph, Twitter card, and JSON-LD.
- Tool pages emit `SoftwareApplication` JSON-LD (see `lib/seo.mjs`).
- Home emits a `WebSite` + `ItemList` `@graph`.
- All HTML is whitespace-minified; `<script>`/`<pre>`/`<textarea>`/`<style>` content is preserved.
- Single CSS file (Tailwind output, minified). No external font requests; the only third-party script is Microsoft Clarity (inlined in `layout.eta`).
- Icons are inline SVG — no icon-font fetch, no emoji.

## Theme

- Tokens live in `@theme` blocks in `builder/assets/app.css`. Light is the default, dark applies when `<html>` has the `dark` class.
- `theme-init.js` is inlined in `<head>` so the class is set before first paint (avoids FOUC). Source: `localStorage["up-theme"]`, falling back to `prefers-color-scheme`.
- The toggle button in the header (`data-theme-toggle`) flips the class and persists the choice.

## Style + UX rules

- No emojis anywhere — site, content, code comments, or commits. If you need an icon, use one from `builder/lib/icons.mjs` (or add one there and reference it via the `icon()` helper).
- No animations or transforms beyond color/opacity hover states. The user values render speed; effects that cause layout work, paint thrash, or jank should be removed, not tuned.
- No big drop shadows, no parallax, no marquee gradients on chrome. The header gets a single linear-gradient on the brand mark and that's it.
- One CSS file, one site-wide JS file, one per-tool JS file. Don't add a second stylesheet or vendor split.
- HTML must remain semantic — `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`. Bots and screen readers read the static markup.

## Code style

- Plain ESM, no TypeScript. Files end in `.mjs` for build code (Node) and `.js` for browser code (esbuild bundles).
- Tool entries should be small. Defer to library functions — don't reimplement formatting, parsing, or diffing.
- Don't add comments that describe *what* the code does. Add a short *why* line only when a constraint, workaround, or non-obvious decision needs preserving.
- No emojis in comments, commit messages, or output strings.

## Don't

- Don't touch `legacy/` unless explicitly asked to back-port something.
- Don't add a framework (React, Vue, Svelte, Angular). The build is intentionally framework-free.
- Don't add server-side anything. Tools must run in the browser.
- Don't add tracking, analytics, or third-party CDN scripts beyond the existing Microsoft Clarity tag.
- Don't bypass `tools.json` — adding a hand-rolled page outside the data flow breaks sitemap, JSON-LD, and the home grid.
