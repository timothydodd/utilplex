# UtilPlex

Fast, private developer utilities. Every page is pre-rendered HTML, every tool runs entirely in the browser, nothing is uploaded.

## Stack

- Static-site generator written in plain Node.js
- [Eta](https://eta.js.org) for templates
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [esbuild](https://esbuild.github.io) to bundle per-tool ES modules
- Tool libraries: `sql-formatter`, `prettier`, `js-yaml`, `js-beautify`, `diff`

No framework runtime ships to the browser.

## Layout

```
builder/      # build script, templates, asset sources
content/      # site.json, tools.json, patch-notes.json, pages/*.json
tools/src/    # one ES module per tool, bundled by esbuild
site/         # build output (gitignored)
legacy/       # the previous Angular app, kept for reference
```

## Commands

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run build`   | Build the static site into `site/`                |
| `npm run preview` | Serve `site/` on http://localhost:4000            |
| `npm run clean`   | Remove the `site/` directory                      |

## Adding a tool

1. Add an entry in the relevant category in `content/tools.json`. The `entry` field names the JS module.
2. Add the per-tool body template at `builder/templates/tool-bodies/<entry>.eta`.
   - For most formatters you can copy an existing one (e.g. `format-json.eta`).
3. Add `tools/src/<entry>.js` — the module that wires up the tool's UI.
4. Bump the version and add a patch-notes entry.
5. `npm run build`. Sitemap, RSS, and JSON-LD are all generated automatically.

## SEO

- Each page emits `<canonical>`, OpenGraph, Twitter, and JSON-LD structured data.
- Tool pages emit `SoftwareApplication` JSON-LD; the home page emits a `WebSite` + `ItemList` graph.
- `sitemap.xml` lists every page.
- `rss.xml` is a feed of patch-note entries.
- `robots.txt` allows everything and points at the sitemap.

## Theme

Light by default, dark via `prefers-color-scheme` or the toggle in the header. The choice is persisted in `localStorage` and applied before paint by an inlined script in the layout to avoid a flash.
