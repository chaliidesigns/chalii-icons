<p align="center">
  <img src="images/icon.png" alt="Chalii Icons" width="120" height="120">
</p>

<h1 align="center">Chalii Icons</h1>

<p align="center">
  Multi-style file & product icon themes for VS Code and the wider VS Code family - tuned for the Chalii brand.<br>
  Seven styles, one source manifest, ports for JetBrains, Neovim, Emacs, Sublime Text and Visual Studio.
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-icons">🛒 Marketplace</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-install">📥 Install</a> •
  <a href="#-activate">🎛️ Activate</a> •
  <a href="#-other-editors">🧩 Other Editors</a> •
  <a href="CHANGELOG.md">📝 Changelog</a>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-icons">
    <img alt="Version" src="https://vsmarketplacebadges.dev/version-short/makindajack.chalii-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-icons">
    <img alt="Installs" src="https://vsmarketplacebadges.dev/installs-short/makindajack.chalii-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=installs">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-icons">
    <img alt="Rating" src="https://vsmarketplacebadges.dev/rating-short/makindajack.chalii-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=rating">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code-%5E1.85-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/fantasticon-4-ff6b0d" alt="fantasticon">
  <img src="https://img.shields.io/badge/resvg--js-2-5C2D91" alt="resvg-js">
  <img src="https://img.shields.io/badge/JetBrains-Kotlin%20%2B%20Gradle-000000?logo=jetbrains" alt="JetBrains">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT">
</p>

---

## 🌟 Highlights

- 🎨 **Seven icon styles** - Solid, Duotone, Twotone, Stroke, Bulk, Sharp Solid and Sharp Stroke, each a separate theme in the picker
- 🧩 **Two independent themes per style** - file/folder icons (Explorer, tabs, breadcrumbs) and product icons (Activity Bar, status bar, gutters, panels)
- 🖥️ **Works across the VS Code family** - VS Code, Insiders, VSCodium, Cursor, Windsurf, Trae, Codespaces, Gitpod, code-server, Theia
- 🔁 **One manifest, many editors** - the same `scripts/manifest.mjs` generates ports for JetBrains, Neovim, Emacs, Sublime Text and Visual Studio
- 🌙 **Dark & light variants** of every file icon, colour-tuned to pair with [Chalii Themes](https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-themes)

## ✨ Features

- **1,700+ file-icon definitions** across the seven styles, with `dark/` and `light/` SVG sets per style
- **~140 product-icon overrides per style**, shipped as generated WOFF/WOFF2 icon fonts (built with fantasticon)
- **File, folder and language mappings** - file extensions, exact file names, language IDs, folder names and expanded-folder states
- **Published to both registries** - VS Code Marketplace and Open VSX, via a tag-triggered GitHub Actions workflow
- **Ports generated from the same source** - JetBrains plugin (Kotlin/Gradle), Neovim (`nvim-web-devicons`), Emacs (`nerd-icons.el`), Sublime Text (Package Control) and Visual Studio 2022
- **Contact sheet** rendering (`images/contact-sheet.*`) via `@resvg/resvg-js` for reviewing a whole style at a glance

## 🚀 Quick Start

```sh
# Install from the Marketplace
code --install-extension makindajack.chalii-icons
```

Then set both themes in `settings.json` (or use the Command Palette - see [Activate](#-activate)):

```jsonc
{
  "workbench.iconTheme": "chalii-file-icons-solid",
  "workbench.productIconTheme": "chalii-product-icons-solid",
}
```

Swap `solid` for `duotone`, `twotone`, `stroke`, `bulk`, `sharp-solid` or `sharp-stroke` to pick another style.

## 📥 Install

Pick the section that matches your editor.

### Visual Studio Code · VS Code Insiders · GitHub Codespaces

**From the Marketplace UI**

1. Open **Extensions** (`Cmd/Ctrl + Shift + X`).
2. Search for `Chalii Icons`.
3. Click **Install**.

**From the command line**

```sh
# Stable
code --install-extension makindajack.chalii-icons

# Insiders
code-insiders --install-extension makindajack.chalii-icons
```

In Codespaces and `vscode.dev` / `github.dev`, install the same way as desktop VS Code - search and install from the in-browser Extensions view.

### Cursor

1. Open **Extensions** in the sidebar.
2. Search for `Chalii Icons`.
3. Click **Install**. (Cursor pulls from Open VSX; the listing is mirrored automatically.)

```sh
cursor --install-extension makindajack.chalii-icons
```

### Windsurf (Codeium)

1. Open the **Extensions** view.
2. Search for `Chalii Icons` and install.

```sh
windsurf --install-extension makindajack.chalii-icons
```

### Trae (ByteDance)

1. Open **Extensions** from the sidebar.
2. Search for `Chalii Icons` and install.

If the listing isn't available yet, use the [manual `.vsix` install](#manual-install-any-compatible-editor).

### VSCodium

VSCodium uses the [Open VSX Registry](https://open-vsx.org).

```sh
codium --install-extension makindajack.chalii-icons
```

Or search in the Extensions view, or install from a `.vsix` below.

### Gitpod · code-server · Eclipse Theia

These editors also use Open VSX. Install via the in-app Extensions view, or:

```sh
# code-server
code-server --install-extension makindajack.chalii-icons
```

If your code-server instance points at a different gallery, set this before launching it:

```sh
export EXTENSIONS_GALLERY='{"serviceUrl":"https://open-vsx.org/vscode/gallery","itemUrl":"https://open-vsx.org/vscode/item"}'
```

### Manual install (any compatible editor)

1. Download the latest `.vsix` from the [Releases page](https://github.com/chaliidesigns/chalii-icons/releases).
2. Open the Command Palette and run **Extensions: Install from VSIX…**, or:

```sh
code --install-extension chalii-icons-<version>.vsix
```

### Not yet supported

JetBrains IDEs, Sublime Text, Neovim, Emacs and Visual Studio don't implement the VS Code icon-theme format - they get their own ports under [`packages/`](packages/) (see [Other Editors](#-other-editors)). Xcode, Fleet and Zed are tracked in the [roadmap](docs/overview/roadmap.md).

## 🎛️ Activate

Once installed, switch each theme independently. They're separate settings - you can use one without the other.

### File icons

1. Open the Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows / Linux).
2. Run **Preferences: File Icon Theme**.
3. Select **Chalii Icons (Solid)** (or any other style).

Or set it directly in `settings.json`:

```jsonc
{
  "workbench.iconTheme": "chalii-file-icons-solid",
}
```

### Product icons (UI icons)

1. Command Palette → **Preferences: Product Icon Theme**.
2. Select **Chalii Product Icons (Solid)**.

```jsonc
{
  "workbench.productIconTheme": "chalii-product-icons-solid",
}
```

### Available theme IDs

| Style        | File icon theme ID               | Product icon theme ID               |
| ------------ | -------------------------------- | ----------------------------------- |
| Solid        | `chalii-file-icons-solid`        | `chalii-product-icons-solid`        |
| Duotone      | `chalii-file-icons-duotone`      | `chalii-product-icons-duotone`      |
| Twotone      | `chalii-file-icons-twotone`      | `chalii-product-icons-twotone`      |
| Stroke       | `chalii-file-icons-stroke`       | `chalii-product-icons-stroke`       |
| Bulk         | `chalii-file-icons-bulk`         | `chalii-product-icons-bulk`         |
| Sharp Solid  | `chalii-file-icons-sharp-solid`  | `chalii-product-icons-sharp-solid`  |
| Sharp Stroke | `chalii-file-icons-sharp-stroke` | `chalii-product-icons-sharp-stroke` |

### Pair with Chalii Themes

These icons are colour-tuned to match the [Chalii Themes](https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-themes) colour set:

```jsonc
{
  "workbench.colorTheme": "Chalii Dark",
  "workbench.iconTheme": "chalii-file-icons-solid",
  "workbench.productIconTheme": "chalii-product-icons-solid",
}
```

Auto-switch with your OS appearance:

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Chalii Light",
  "workbench.preferredDarkColorTheme": "Chalii Dark",
  "workbench.iconTheme": "chalii-file-icons-solid",
  "workbench.productIconTheme": "chalii-product-icons-solid",
}
```

## 🧩 Other Editors

Each port lives under [`packages/`](packages/) and is generated from the same [`scripts/manifest.mjs`](scripts/manifest.mjs):

| Editor                  | Package                                                                      | Notes                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| JetBrains IDEs          | [`packages/jetbrains`](packages/jetbrains/README.md)                         | Kotlin plugin, Gradle build, published to JetBrains Marketplace on `jb/v*` tags |
| Neovim                  | [`packages/nvim`](packages/nvim/README.md)                                   | `nvim-web-devicons` overrides (Nerd Font glyphs), LuaRocks rockspec    |
| Emacs                   | [`packages/emacs`](packages/emacs/README.md)                                 | `nerd-icons.el` overrides, MELPA recipe                                |
| Sublime Text 3+         | [`packages/sublime/Chalii Icons`](packages/sublime/Chalii%20Icons/README.md) | Mirrored to [chalii-icons-sublime](https://github.com/chaliidesigns/chalii-icons-sublime) for Package Control |
| Visual Studio 2022      | [`packages/visualstudio/ChaliiIcons`](packages/visualstudio/ChaliiIcons/README.md) | Image-manifest based `.vsix`                                      |

See [docs/overview/supported-ides.md](docs/overview/supported-ides.md) for the full compatibility matrix.

## 📦 Scripts

| Script                        | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| `npm run build`               | Copy SVGs + emit theme JSON and product-icon fonts for all styles |
| `npm run build:clean`         | Wipe `icons/` and `themes/` then rebuild                          |
| `npm run build:solid`         | Build only the Solid style                                        |
| `npm run build:duotone`       | Build only the Duotone style                                      |
| `npm run build:jetbrains`     | Generate the JetBrains plugin sources                             |
| `npm run build:nvim`          | Generate the Neovim Lua package                                   |
| `npm run build:emacs`         | Generate the Emacs package                                        |
| `npm run build:sublime`       | Generate the Sublime Text package (PNG rasters + `.tmPreferences`) |
| `npm run build:vsfull`        | Generate the Visual Studio 2022 image manifest + `.vsix`          |
| `npm run build:contact-sheet` | Render a contact sheet of every icon                              |
| `npm run build:all`           | Everything above, in order                                        |

> The build scripts read SVGs from the upstream icon library (`ICONS_SRC_ROOT`, see [docs/README.dev.md](docs/README.dev.md)). The generated `icons/`, `themes/` and `packages/*` outputs are committed, so installing and packaging does **not** require the source library.

## 🏗️ Structure

```
chalii-icons/
├── package.json                  # Extension manifest (7 file + 7 product icon themes)
├── themes/                       # Generated theme JSONs + product-icon fonts
│   ├── chalii-file-icon-theme.<style>.json
│   ├── chalii-product-icon-theme.<style>.json
│   └── fonts/                    # chalii-product-icons-<style>.{woff,woff2,json}
├── icons/
│   └── <style>/
│       ├── file-icons/{dark,light}/
│       └── product-icons/
├── scripts/
│   ├── manifest.mjs              # Single source of truth: icon name → upstream path
│   ├── styles.mjs                # Style registry
│   ├── build.mjs                 # VS Code build (SVG copy + JSON + fonts)
│   ├── build-{jetbrains,nvim,emacs,sublime,vsfull,contact-sheet}.mjs
│   └── sync-sublime-repo.sh      # Mirror the Sublime package to its own repo
├── packages/                     # Generated ports for other editors
│   ├── jetbrains/  nvim/  emacs/  sublime/  visualstudio/
├── docs/                         # Icon docs, roadmap, publishing & versioning notes
├── images/                       # Extension icon + contact sheets
└── .github/workflows/            # build.yml (VSIX + Marketplace/Open VSX), jetbrains.yml
```

## 🚀 Deployment

Publishing is automated with GitHub Actions:

- **VS Code Marketplace + Open VSX** - push a `vscode/v*` tag; `build.yml` packages the VSIX with `@vscode/vsce` and publishes with `VSCE_PAT` / `OVSX_PAT`.
- **JetBrains Marketplace** - push a `jb/v*` tag; `jetbrains.yml` runs `./gradlew buildPlugin verifyPlugin` then signs and publishes.
- **Sublime Text** - `./scripts/sync-sublime-repo.sh <version>` mirrors the package to [chalii-icons-sublime](https://github.com/chaliidesigns/chalii-icons-sublime) and tags it for Package Control.

Details: [docs/overview/publishing.md](docs/overview/publishing.md) · [docs/overview/versioning.md](docs/overview/versioning.md).

## 🛠️ Troubleshooting

**Icons didn't change after installing.** Run **Preferences: File Icon Theme** _and_ **Preferences: Product Icon Theme** explicitly - installation alone doesn't activate either.

**A specific file type still uses the default icon.** That extension isn't in the manifest yet. Open an [issue](https://github.com/chaliidesigns/chalii-icons/issues) with the extension name.

**Some UI icons (gutter, status bar) are unchanged.** Product Icon Themes can only override icons whose codicon ID is mapped. Anything not yet in the manifest falls back to the built-in codicon - that's by design.

**Cursor / Windsurf / Trae can't find it.** Their bundled Open VSX index sometimes lags. Fall back to the [manual `.vsix` install](#manual-install-any-compatible-editor).

## 🔗 Links

- [Report an issue](https://github.com/chaliidesigns/chalii-icons/issues)
- [Roadmap](docs/overview/roadmap.md)
- [Contributing & build docs](docs/README.dev.md)
- [Companion colour theme: Chalii Themes](https://marketplace.visualstudio.com/items?itemName=makindajack.chalii-themes)

## 📄 License

MIT - see [LICENSE.md](LICENSE.md)

## 👤 Author

**Chalii Designs** - design & engineering studio by Jackson Makinda - [makindajackson.com](https://makindajackson.com)

- 📧 Email: me@makindajackson.com
- 💼 LinkedIn: [Jackson Makinda](https://linkedin.com/in/makindajack)
- 🎨 Dribbble: [@makindajack](https://dribbble.com/makindajack)
- 🐦 Twitter: [@makindajack](https://twitter.com/makindajack)

---

Built with ❤️ in Dar es Salaam, Tanzania 🇹🇿
