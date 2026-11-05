// Builds chalii-icons assets. Iterates every enabled style in
// scripts/styles.mjs, applies the manifest from scripts/manifest.mjs against
// that style's source root, copies the SVGs, and emits per-style theme JSONs.
//
//   • icons/<style>/file-icons/<name>.svg
//   • icons/<style>/product-icons/<id>.svg
//   • themes/chalii-file-icon-theme.<style>.json
//   • themes/chalii-product-icon-theme.<style>.json
//
// Override the upstream library source root with ICONS_SRC_ROOT env var.
// Pass --style=<id> (repeatable) to limit the build to specific styles.
// Product icons are always rebuilt. Add --file-icons to also rebuild the file icons.
// The build checks that every source icon exists before writing; pass --allow-missing to skip that check.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { generateFonts, FontAssetType, OtherAssetType } from "fantasticon";
import { fileIcons, folderNames, productIcons } from "./manifest.mjs";
import { enabledStyles, styles as allStyles } from "./styles.mjs";
import { traceGlyph } from "./lib/glyph.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const ICONS_SRC_ROOT = process.env.ICONS_SRC_ROOT
    || "/Users/makindajack/Downloads/Compressed/icons-src/25,000+ SVG icons";

// Allow CLI selection (e.g. `node scripts/build.mjs --style=solid`)
const cliStyles = process.argv
    .filter((a) => a.startsWith("--style="))
    .map((a) => a.slice("--style=".length));

const targetStyles = cliStyles.length
    ? allStyles.filter((s) => cliStyles.includes(s.id))
    : enabledStyles();

if (!targetStyles.length) {
    console.error("No styles selected. Enable one in scripts/styles.mjs or pass --style=<id>.");
    process.exit(1);
}

function resolveSrc(style, manifestPath) {
    const aliased = style.fileAlias?.[manifestPath] ?? manifestPath;
    const [category, ...rest] = aliased.split("/");
    const remapped = style.categoryAlias?.[category] ?? category;
    return path.join(ICONS_SRC_ROOT, style.srcRoot, remapped, rest.join("/"));
}

// Safety check that runs before anything is written. The source icon library is
// licensed and lives outside this repo, so on a machine without it the old build
// copied nothing and overwrote the committed theme files with empty ones.
// Pass --allow-missing to build anyway and accept a partial result.
const allowMissing = process.argv.includes("--allow-missing");
// File icons are only rebuilt on request. The solid file icons were replaced by hand in
// v1.2.0, so a plain run must not overwrite them. Product icons are always rebuilt.
const withFileIcons = process.argv.includes("--file-icons");

function preflight() {
    if (!fs.existsSync(ICONS_SRC_ROOT)) {
        console.error(`\nSource icon library not found: ${ICONS_SRC_ROOT}`);
        console.error("Set ICONS_SRC_ROOT to the folder that holds the icon set and run again.");
        console.error("Nothing was written. The committed icons and theme files are untouched.\n");
        process.exit(2);
    }
    const problems = [];
    for (const style of targetStyles) {
        const styleRoot = path.join(ICONS_SRC_ROOT, style.srcRoot);
        if (!fs.existsSync(styleRoot)) {
            problems.push(`${style.id}: style folder not found: ${styleRoot}`);
            continue;
        }
        const committed = (kind, name) => fs.existsSync(path.join(repoRoot, "icons", style.id, kind === "file" ? "file-icons/dark" : "product-icons", `${name}.svg`));
        const absent = [
            ...(withFileIcons ? fileIcons : []).filter((i) => !fs.existsSync(resolveSrc(style, i.src)) && !committed("file", i.name)).map((i) => i.src),
            ...productIcons.filter((i) => !fs.existsSync(resolveSrc(style, i.src)) && !committed("product", i.id)).map((i) => i.src),
        ];
        if (absent.length) {
            problems.push(`${style.id}: ${absent.length} source icon(s) missing, for example ${absent.slice(0, 3).join(", ")}`);
        }
    }
    if (problems.length && !allowMissing) {
        console.error("\nBuild stopped before writing anything:");
        for (const problem of problems) console.error(`  - ${problem}`);
        console.error("The committed icons and theme files are untouched.");
        console.error("Fix ICONS_SRC_ROOT, or pass --allow-missing to build a partial set.\n");
        process.exit(2);
    }
}
preflight();

async function buildStyle(style) {
    const fileIconsDarkDir = path.join(repoRoot, "icons", style.id, "file-icons", "dark");
    const fileIconsLightDir = path.join(repoRoot, "icons", style.id, "file-icons", "light");
    const productIconsDir = path.join(repoRoot, "icons", style.id, "product-icons");
    const themesDir = path.join(repoRoot, "themes");

    for (const dir of [fileIconsDarkDir, fileIconsLightDir, productIconsDir, themesDir]) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let copied = 0;
    let kept = 0; // icons this copy of the library lacks, left as committed
    const missing = [];

    // Brand fills used when generating light/dark variants of file icons.
    // VS Code never applies CSS `color` to file icons, so we ship two physical
    // SVG copies and let the icon-theme JSON's `light` block swap them.
    const DARK_FILL = "#e7e8ea";   // chalii-themes dark fg.default
    const LIGHT_FILL = "#1e2022";  // chalii-themes light fg.default

    function copyIcon(srcRel, destPath, opts = {}) {
        const srcAbs = resolveSrc(style, srcRel);
        if (!fs.existsSync(srcAbs)) {
            // Newer icons that this copy of the library lacks stay as committed.
            if (fs.existsSync(destPath)) { kept++; return true; }
            missing.push(`${opts.label}: ${srcRel}`);
            return false;
        }
        if (opts.recolorToCurrentColor) {
            // VS Code colors product icons via CSS `color`, which only works when
            // the SVG uses fill="currentColor"/stroke="currentColor". The upstream library
            // ships with hard-coded #141B34 fills, so without this rewrite the
            // icons render as dark navy on dark themes (invisible).
            const svg = fs.readFileSync(srcAbs, "utf8")
                .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
                .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"');
            fs.writeFileSync(destPath, svg);
        } else if (opts.recolorTo) {
            const svg = fs.readFileSync(srcAbs, "utf8")
                .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `fill="${opts.recolorTo}"`)
                .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `stroke="${opts.recolorTo}"`);
            fs.writeFileSync(destPath, svg);
        } else {
            fs.copyFileSync(srcAbs, destPath);
        }
        copied++;
        return true;
    }

    if (withFileIcons) {
        // ---- File icons ----
        // Two variants per icon: dark (default) + light (used when a light color
        // theme is active, via the `light` block in the theme JSON).
        const iconDefs = {};
        const byExt = {};
        const byName = {};
        const byLang = {};
        const lightDefs = {};
        const lightByExt = {};
        const lightByName = {};
        const lightByLang = {};

        for (const icon of fileIcons) {
            const darkDest = path.join(fileIconsDarkDir, `${icon.name}.svg`);
            const lightDest = path.join(fileIconsLightDir, `${icon.name}.svg`);
            if (!copyIcon(icon.src, darkDest, {
                label: `file-icon ${icon.name} (dark)`,
                recolorTo: DARK_FILL,
            })) continue;
            copyIcon(icon.src, lightDest, {
                label: `file-icon ${icon.name} (light)`,
                recolorTo: LIGHT_FILL,
            });

            const defKey = `_${icon.name.replace(/-/g, "_")}`;
            const lightKey = `${defKey}_light`;
            iconDefs[defKey] = { iconPath: `../icons/${style.id}/file-icons/dark/${icon.name}.svg` };
            lightDefs[lightKey] = { iconPath: `../icons/${style.id}/file-icons/light/${icon.name}.svg` };

            for (const ext of icon.extensions ?? []) {
                byExt[ext.toLowerCase()] = defKey;
                lightByExt[ext.toLowerCase()] = lightKey;
            }
            for (const fn of icon.fileNames ?? []) {
                byName[fn.toLowerCase()] = defKey;
                lightByName[fn.toLowerCase()] = lightKey;
            }
            for (const lid of icon.languageIds ?? []) {
                byLang[lid.toLowerCase()] = defKey;
                lightByLang[lid.toLowerCase()] = lightKey;
            }
        }

        const folderNameMap = {};
        const folderNameExpandedMap = {};
        const folderNameMapLight = {};
        const folderNameExpandedMapLight = {};
        for (const [name, iconName] of Object.entries(folderNames)) {
            const defKey = `_${iconName.replace(/-/g, "_")}`;
            const lightKey = `${defKey}_light`;
            if (!iconDefs[defKey]) continue;
            folderNameMap[name.toLowerCase()] = defKey;
            folderNameExpandedMap[name.toLowerCase()] = defKey;
            folderNameMapLight[name.toLowerCase()] = lightKey;
            folderNameExpandedMapLight[name.toLowerCase()] = lightKey;
        }

        const fileTheme = {
            $schema: "vscode://schemas/icon-theme",
            iconDefinitions: { ...iconDefs, ...lightDefs },
            file: "_file",
            folder: "_folder",
            folderExpanded: "_folder_open",
            rootFolder: "_folder",
            rootFolderExpanded: "_folder_open",
            fileExtensions: byExt,
            fileNames: byName,
            languageIds: byLang,
            folderNames: folderNameMap,
            folderNamesExpanded: folderNameExpandedMap,
            light: {
                file: "_file_light",
                folder: "_folder_light",
                folderExpanded: "_folder_open_light",
                rootFolder: "_folder_light",
                rootFolderExpanded: "_folder_open_light",
                fileExtensions: lightByExt,
                fileNames: lightByName,
                languageIds: lightByLang,
                folderNames: folderNameMapLight,
                folderNamesExpanded: folderNameExpandedMapLight,
            },
            hidesExplorerArrows: false,
        };
        fs.writeFileSync(
            path.join(themesDir, `chalii-file-icon-theme.${style.id}.json`),
            JSON.stringify(fileTheme, null, 2) + "\n",
        );
    }

    // Product icon themes only support glyphs from a font (not iconPath/SVG).
    // We copy SVGs (currentColor) and bake them into a WOFF font with
    // deterministic PUA codepoints starting at 0xE000.
    const productDefs = {};
    const codepoints = {};
    let nextCp = 0xe000;
    const validIds = [];
    for (const icon of productIcons) {
        const dest = path.join(productIconsDir, `${icon.id}.svg`);
        const srcAbs = resolveSrc(style, icon.src);
        if (fs.existsSync(srcAbs)) {
            fs.writeFileSync(dest, await traceGlyph(fs.readFileSync(srcAbs, "utf8"), style.glyph));
            copied++;
        } else if (fs.existsSync(dest)) {
            kept++;
        } else {
            missing.push(`product-icon ${icon.id}: ${icon.src}`);
            continue;
        }
        codepoints[icon.id] = nextCp++;
        validIds.push(icon.id);
    }

    // Drop glyph files that are no longer in the manifest so they do not end up in the font.
    const wanted = new Set(productIcons.map((i) => `${i.id}.svg`));
    for (const f of fs.readdirSync(productIconsDir)) if (!wanted.has(f)) fs.rmSync(path.join(productIconsDir, f));

    const fontsDir = path.join(themesDir, "fonts");
    fs.mkdirSync(fontsDir, { recursive: true });
    const fontName = `chalii-product-icons-${style.id}`;

    await generateFonts({
        name: fontName,
        inputDir: productIconsDir,
        outputDir: fontsDir,
        fontTypes: [FontAssetType.WOFF, FontAssetType.WOFF2],
        assetTypes: [OtherAssetType.JSON],
        codepoints,
        normalize: true,
        fontHeight: 1000,
        descent: 0,
        prefix: "",
        tag: "",
        formatOptions: { json: { indent: 2 } },
    });

    for (const id of validIds) {
        const cp = codepoints[id].toString(16).toUpperCase().padStart(4, "0");
        productDefs[id] = { fontCharacter: `\\${cp}`, fontId: fontName };
    }

    const productTheme = {
        $schema: "vscode://schemas/product-icon-theme",
        fonts: [
            {
                id: fontName,
                src: [
                    { path: `./fonts/${fontName}.woff2`, format: "woff2" },
                    { path: `./fonts/${fontName}.woff`, format: "woff" },
                ],
                weight: "normal",
                style: "normal",
            },
        ],
        iconDefinitions: productDefs,
    };
    fs.writeFileSync(
        path.join(themesDir, `chalii-product-icon-theme.${style.id}.json`),
        JSON.stringify(productTheme, null, 2) + "\n",
    );

    return { copied, kept, missing };
}

console.log(`chalii-icons build`);
console.log(`  ICONS_SRC_ROOT: ${ICONS_SRC_ROOT}`);

let failed = false;
for (const style of targetStyles) {
    console.log(`\n  ▸ ${style.id} (${style.label}) — ${style.srcRoot}`);
    const { copied, kept, missing } = await buildStyle(style);
    console.log(`      copied:  ${copied}`);
    if (kept) console.log(`      kept as committed (not in this library copy): ${kept}`);
    console.log(`      missing: ${missing.length}`);
    if (missing.length) {
        failed = true;
        for (const m of missing) console.log(`        • ${m}`);
    }
}

console.log(failed ? "\nBuild completed with missing icons.\n" : "\nBuild completed cleanly.\n");
process.exit(failed ? 1 : 0);
