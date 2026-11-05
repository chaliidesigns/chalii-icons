# chalii-icons

Multi-style icon themes for Visual Studio Code by Makinda Jackson, tuned for the Chalii brand. Covers both file/folder icons and product (UI) icons.

## Status

Phase 1: **Solid** (filled) — shipped as `Chalii Icons (Solid)` and `Chalii Product Icons (Solid)`. 124 starter icons, zero missing. Other upstream styles (Duotone, Twotone, Stroke, Bulk, Sharp Solid, Sharp Stroke) are scaffolded but disabled — see [`docs/project-scope.md`](docs/project-scope.md).

## Repository structure

```
chalii-icons/
├── package.json                       Extension manifest
├── themes/                            Generated theme JSONs (don't hand-edit)
│   ├── chalii-file-icon-theme.<style>.json
│   └── chalii-product-icon-theme.<style>.json
├── icons/
│   └── <style>/                       SVGs copied from the upstream library per style
│       ├── file-icons/
│       │   ├── dark/
│       │   └── light/
│       └── product-icons/
├── scripts/
│   ├── manifest.mjs                   Single source of truth: name → upstream path
│   ├── styles.mjs                     Style registry (which upstream sets to build)
│   └── build.mjs                      Per-style copy + theme JSON emit
└── docs/                              Documentation about VS Code icons & this project
```

## Develop

Prerequisite: an unzipped copy of the upstream icon library. The default source root is:

```
/Users/makindajack/Downloads/Compressed/icons-src/25,000+ SVG icons
```

Override with `ICONS_SRC_ROOT=/path/to/25,000+ SVG icons npm run build`.

```sh
npm run build           # rebuild the product icon glyphs and fonts for every enabled style
npm run build:clean     # clear the product icon outputs and rebuild them (file icons are kept)
node scripts/build.mjs --style=solid --style=duotone   # build several
```

What the build does and does not touch:

- **Product icons** are rebuilt on every run. Each upstream SVG is drawn as designed and traced into one
  filled outline, because an icon font can only hold single filled shapes. Strokes, even-odd holes and the
  light second tone of the duotone style would otherwise disappear or turn into blobs. Duotone and twotone
  therefore look like the stroke style in product icons, since a font glyph has one color.
- **File icons** are not rebuilt unless you pass `--file-icons`. The solid file icons were replaced by hand in
  v1.2.0, so a plain run must not overwrite them.
- If the icon library or any icon it needs is missing, the build stops before writing anything. Icons that
  are already committed count as present. Pass `--allow-missing` to build a partial set on purpose.

Then in VS Code:

1. Open this folder.
2. Press `F5` to launch the Extension Development Host.
3. `Cmd+Shift+P → Preferences: File Icon Theme → Chalii Icons (Solid)`
4. `Cmd+Shift+P → Preferences: Product Icon Theme → Chalii Product Icons (Solid)`

## Add or change an icon

Edit [scripts/manifest.mjs](scripts/manifest.mjs) and re-run `npm run build`. The manifest is the only place you need to touch — file lists, theme JSONs, and copied SVGs are all derived from it.

## Add a new style variant

1. Flip `enabled: true` (or add a new entry) in [scripts/styles.mjs](scripts/styles.mjs).
2. Add the matching `iconThemes` / `productIconThemes` entries in [package.json](package.json).
3. Run `npm run build:clean`. Patch any per-style filename mismatches via `fileAlias` on the style entry.

## Docs

- [Project scope & workflow](docs/project-scope.md) ← **start here**
- [What are VS Code icons](docs/overview/what-are-vscode-icons.md)
- [How the project works](docs/overview/how-it-works.md)
- [Supported IDEs](docs/overview/supported-ides.md)
- [Roadmap & TODO](docs/overview/roadmap.md)
- [How file icons work](docs/file-icons/how-file-icons-work.md)
- [File icons checklist](docs/file-icons/file-icons-list.md)
- [How product icons work](docs/product-icons/how-product-icons-work.md)
- [Product icons checklist](docs/product-icons/product-icons-list.md)
- [Building an icon theme](docs/theme-development/building-icon-themes.md)

## Companion extension

The matching **color theme** (Chalii Light + Chalii Dark) lives in [chalii-themes](https://github.com/chaliidesigns/chalii-themes). The two are designed to be installed together but ship separately.

## License

See [LICENSE.md](LICENSE.md). Icon assets are derived from the upstream icon library and are not redistributable without your own license to the upstream library.
