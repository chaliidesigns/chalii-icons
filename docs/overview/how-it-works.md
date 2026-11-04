# How Chalii Icons works

This page explains the end-to-end pipeline: from raw upstream SVGs on disk to a working icon theme inside the editor.

## The big picture

```
upstream icon library         scripts/manifest.mjs
        ▼                                            ▼
    raw .svg files  ─────────►  scripts/build.mjs  ─────────►  icons/{file,product}-icons/*.svg
                                       │                                +
                                       ▼                          themes/chalii-*-icon-theme.json
                                generated artifacts

                                       ▼
                              VS Code (or any compatible
                              editor) loads the theme JSON
```

There are three moving parts:

1. **Source icons** — an unzipped copy of the upstream icon library. Nothing here is committed; you bring your own license.
2. **Manifest** — [`scripts/manifest.mjs`](../../scripts/manifest.mjs) is the single source of truth. Every icon the theme exposes is listed here, mapping an upstream name to a Chalii alias plus the file types / codicon IDs it should cover.
3. **Build script** — [`scripts/build.mjs`](../../scripts/build.mjs) reads the manifest, copies the SVGs it needs into [`icons/`](../../icons/), and emits the two theme JSONs in [`themes/`](../../themes/).

## The build pipeline

Run:

```sh
npm run build         # incremental
npm run build:clean   # wipe icons/ first
```

What happens, step by step:

1. The script resolves the upstream source root. Default is the path documented in the [README](../../README.md#develop); override with `ICONS_SRC_ROOT=/path npm run build`.
2. For each entry in the manifest:
   - Locate the matching SVG in the upstream tree.
   - Copy it into `icons/<style>/file-icons/{dark,light}/` (file icons get two color variants) or `icons/<style>/product-icons/` (single `currentColor` variant) under its Chalii alias.
3. Generate `themes/chalii-file-icon-theme.json`:
   - One `iconDefinitions` entry per file icon SVG.
   - `fileExtensions`, `fileNames`, and `languageIds` maps wiring extensions / filenames / language IDs to those definitions.
   - A `folder` / `folderExpanded` pair plus `rootFolder` variants.
4. Generate `themes/chalii-product-icon-theme.json`:
   - Each entry maps a built-in [codicon ID](https://microsoft.github.io/vscode-codicons/dist/codicon.html) (e.g. `chevron-down`, `gear`, `git-branch`) to a Chalii SVG.
5. Done. The two JSONs in `themes/` are what the extension actually ships.

## How the editor loads it

The extension manifest [`package.json`](../../package.json) declares two contribution points:

```jsonc
"contributes": {
  "iconThemes":         [{ "id": "chalii-file-icons",    "path": "./themes/chalii-file-icon-theme.json"    }],
  "productIconThemes":  [{ "id": "chalii-product-icons", "path": "./themes/chalii-product-icon-theme.json" }]
}
```

When the user picks **Chalii Icons (Dualtone)** from `Preferences: File Icon Theme`, the editor reads the JSON, resolves every `iconPath` relative to it, and renders the SVGs in the Explorer, tabs, breadcrumbs, etc. Product icons follow the same flow via `Preferences: Product Icon Theme`.

For deeper background see:

- [What are VS Code icons](what-are-vscode-icons.md)
- [How file icons work](../file-icons/how-file-icons-work.md)
- [How product icons work](../product-icons/how-product-icons-work.md)
- [Building an icon theme](../theme-development/building-icon-themes.md)

## Adding or changing an icon

You almost never edit the generated files. The workflow is:

1. Open [`scripts/manifest.mjs`](../../scripts/manifest.mjs).
2. Add or edit the entry — upstream name, Chalii alias, and the extensions / filenames / language IDs / codicon IDs it should bind to.
3. Run `npm run build`.
4. Reload the Extension Development Host (`Cmd+R` / `Ctrl+R`) to see the change.

If a file icon doesn't appear, the most common causes are:

- The extension is missing from the manifest entry's extension list.
- The user's file is matched by a more specific rule (filename beats language ID beats extension).
- The SVG didn't copy because the upstream name doesn't exist in the source tree — check the build log.

## Relationship to Chalii Themes

[Chalii Themes](https://github.com/chaliidesigns/chalii-themes) is the sibling **color theme** extension (Chalii Light + Chalii Dark). The two are designed to be installed together but are released as separate extensions:

| Concern                            | Extension                            |
| ---------------------------------- | ------------------------------------ |
| Editor colors, syntax tokens       | `chalii-themes`                     |
| File / folder icons                | `chalii-icons`                      |
| Activity bar, status bar, UI icons | `chalii-icons` (product icon theme) |

You can mix and match — e.g. use Chalii Icons with a different color theme — but the duotone orange palette in this pack is tuned to match `#f05106` (light) and `#ff6b0d` (dark) from Chalii Themes.

## Supported editors

Any editor that implements the VS Code icon-theme contribution points. See [Supported IDEs](supported-ides.md) for the full list.
