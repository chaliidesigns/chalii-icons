// Turns an upstream icon SVG into a single filled outline that an icon font can hold.
//
// An icon font glyph is one solid shape. The upstream icons are not: they use
// strokes (stroke styles), even-odd holes (solid styles) and a lighter second
// tone (duotone). Fed straight into the font builder, strokes disappear, even-odd
// holes fill in and the second tone becomes a blob. Instead we draw the icon the
// way it was designed and trace the result into outlines.

import { Resvg } from "@resvg/resvg-js";
import potrace from "potrace";
import paper from "paper";

const SIZE = 768; // render size in pixels for the 24-unit icon grid

paper.setup(new paper.Size(SIZE, SIZE));

// The tracer draws holes the way an SVG viewer expects (even-odd). A font fills with the
// non-zero rule, so a hole must be wound against its outline or it fills in and the
// detail inside the icon, like the check in a circle, disappears.
function windHoles(d) {
    const shape = new paper.CompoundPath({ pathData: d, fillRule: "evenodd" });
    shape.reorient(false, true);
    const wound = shape.pathData;
    shape.remove();
    return wound;
}

function prepare(svg, { dropFills = [] } = {}) {
    let s = svg;
    // Duotone draws its second tone as a light fill under the strokes. A font
    // glyph has one color, so drop that layer and keep the strokes.
    for (const color of dropFills) {
        const shape = new RegExp(`<(?:path|circle|rect|ellipse|polygon|polyline|line)\\b[^>]*\\sfill="${color}"[^>]*\\/?>`, "gi");
        s = s.replace(shape, "");
    }
    // Draw every remaining shape at full strength, in black.
    s = s.replace(/\s(?:fill-|stroke-)?opacity="[^"]*"/g, "");
    s = s.replace(/\b(fill|stroke)="#[0-9a-fA-F]{3,8}"/g, '$1="#000000"');
    return s;
}

function trace(png) {
    return new Promise((resolve, reject) => {
        potrace.trace(
            png,
            { threshold: 128, turdSize: 6, optTolerance: 0.3, alphaMax: 1, blackOnWhite: true, color: "#000000", background: "transparent" },
            (err, out) => (err ? reject(err) : resolve(out)),
        );
    });
}

/** @param {string} svg upstream icon  @param {{dropFills?: string[]}} [options] */
export async function traceGlyph(svg, options = {}) {
    const png = new Resvg(prepare(svg, options), { fitTo: { mode: "width", value: SIZE }, background: "#ffffff" }).render().asPng();
    const traced = await trace(Buffer.from(png));
    const traces = [...traced.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]).join(" ").trim();
    if (!traces) throw new Error("glyph came out empty");
    const d = windHoles(traces);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"><path fill="currentColor" d="${d}"/></svg>\n`;
}
