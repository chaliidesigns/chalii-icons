#!/usr/bin/env node
// Points each file icon theme at its own style's icons.
//
// Every style has its own folder of file icons, but a theme file can end up referring to the
// filled Solid icon instead. That is what made Stroke, Duotone and the other styles show some
// filled icons next to outlined ones. This script repoints those entries at the style's own file.
//
// Brand logos (python, github, java and so on) only exist filled, so their own-style file is a
// copy of the Solid one. Those are left alone.
//
//   node scripts/repoint-file-icons.mjs            fix the theme files
//   node scripts/repoint-file-icons.mjs --check    only report, exit 1 if anything would change
//
// `npm run check:file-icons` runs the second form.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import url from "node:url";

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const STYLES = ["duotone", "twotone", "stroke", "bulk", "sharp-solid", "sharp-stroke"];
const hash = (f) => crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");

let pending = 0;
for (const style of STYLES) {
    const themePath = path.join(root, `themes/chalii-file-icon-theme.${style}.json`);
    const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
    let repointed = 0, brands = 0;
    for (const [key, def] of Object.entries(theme.iconDefinitions)) {
        const light = key.endsWith("_light");
        const name = key.replace(/^_/, "").replace(/_light$/, "").replace(/_/g, "-");
        if (def.iconPath.split("/")[2] !== "solid") continue;
        const variant = light ? "light" : "dark";
        const own = path.join(root, "icons", style, "file-icons", variant, `${name}.svg`);
        const solid = path.join(root, "icons/solid/file-icons", variant, `${name}.svg`);
        if (!fs.existsSync(own)) continue;
        if (fs.existsSync(solid) && hash(own) === hash(solid)) { if (!light) brands++; continue; }
        def.iconPath = `../icons/${style}/file-icons/${variant}/${name}.svg`;
        if (!light) repointed++;
    }
    pending += repointed;
    if (repointed && !check) fs.writeFileSync(themePath, JSON.stringify(theme, null, 2) + "\n");
    console.log(`${style.padEnd(13)} ${check ? "would repoint" : "repointed"} ${String(repointed).padStart(2)} icons | brand logos left filled ${brands}`);
}
if (check && pending) { console.error(`\n${pending} file icons still point at the Solid folder. Run: node scripts/repoint-file-icons.mjs`); process.exit(1); }
