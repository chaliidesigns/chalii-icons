# Building the chalii icon themes

This is the working plan for shipping `chalii-file-icons` and `chalii-product-icons` as a single VS Code extension.

## 1. Project layout (target)

```
chalii-icons/
├── package.json                       Extension manifest
├── icons/
│   ├── file-icons/                    SVG sources
│   └── product-icons/                 SVG sources
├── fonts/
│   └── chalii-product.woff           Generated codicon-replacement font
├── themes/
│   ├── chalii-file-icon-theme.json
│   └── chalii-product-icon-theme.json
├── scripts/
│   └── build-font.mjs                 SVG → WOFF pipeline
└── docs/
```

## 2. Tooling

- **Node 20+**
- **fantasticon** for font generation
- **svgo** to optimize SVGs
- **@vscode/vsce** to package and publish
- **vscode** API typings for editor integration tests (optional)

## 3. Authoring rules

### File icons (SVG)

- 32×32 viewBox, 2px stroke, full color allowed.
- Filename = the canonical key in the theme JSON (`javascript.svg`, `folder-src.svg`, …).
- Provide `-open` variants for folders that should react to expansion.

### Product icons (SVG → font)

- 16×16 viewBox, single color (`currentColor` / black fill).
- Filename = codicon ID (`chevron-down.svg`, `git-branch.svg`).
- Codepoint comes from the canonical [codicons mapping](https://github.com/microsoft/vscode-codicons/blob/main/src/template/mapping.json).

## 4. Build pipeline

1. `npm run optimize` → svgo over all icons.
2. `npm run build:font` → fantasticon reads `icons/product-icons/` + the codicon mapping, outputs `fonts/chalii-product.woff` and a generated `themes/chalii-product-icon-theme.json`.
3. `npm run build:file-theme` → small node script that reads `icons/file-icons/` and emits `themes/chalii-file-icon-theme.json` from a manifest.
4. `vsce package` → produces `.vsix`.

## 5. Manifest (sketch)

```jsonc
{
  "name": "chalii-icons",
  "displayName": "Chalii Icons",
  "publisher": "makindajack",
  "version": "0.0.1",
  "engines": { "vscode": "^1.85.0" },
  "categories": ["Themes"],
  "contributes": {
    "iconThemes": [
      {
        "id": "chalii-file-icons",
        "label": "Chalii File Icons",
        "path": "./themes/chalii-file-icon-theme.json",
      },
    ],
    "productIconThemes": [
      {
        "id": "chalii-product-icons",
        "label": "Chalii Product Icons",
        "path": "./themes/chalii-product-icon-theme.json",
      },
    ],
  },
}
```

## 6. Testing

- Open the extension folder in VS Code → press `F5` → an Extension Development Host opens.
- `Preferences: File Icon Theme` → pick _Chalii File Icons_.
- `Preferences: Product Icon Theme` → pick _Chalii Product Icons_.
- Toggle dark / light / high-contrast to verify variants.

## 7. Publishing

```sh
vsce login makindajack
vsce publish
```

Marketplace listing should include screenshots of: Explorer with file icons, Activity Bar with product icons, side-by-side dark/light.
