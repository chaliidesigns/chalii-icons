// Style registry — one entry per upstream style we ship as a theme variant.
//
// `id`           : kebab-case slug used in theme ids and on-disk paths
// `label`        : suffix shown in the VS Code theme picker
// `srcRoot`      : upstream subpath (under ICONS_SRC_ROOT) for this style
// `categoryAlias`: optional remap when a manifest path's category folder
//                  doesn't exist in this style (e.g. Sharp collapses
//                  "Arrows (Round)" / "Arrows (Sharp)" → "Arrows")
// `enabled`      : when false, the style is registered for documentation
//                  purposes but skipped by the build
//
// Phase plan: see docs/project-scope.md §4.

export const styles = [
    {
        id: "solid",
        label: "Solid",
        srcRoot: "Rounded/Solid",
        enabled: true, // Phase 1 — filled (start here)
        // Some icons are renamed in the Solid set vs Duotone. Map manifest
        // paths (left) to the actual on-disk filename (right). Applied after
        // categoryAlias.
        fileAlias: {
            // In this style "remove" is the X and "clear" is the minus, the reverse of
            // the other styles, so each manifest name maps to the matching shape.
            "Add Remove Delete/remove-01.svg": "Add Remove Delete/clear-01.svg",
            "Add Remove Delete/cancel-01.svg": "Add Remove Delete/remove.svg",
            "Add Remove Delete/cancel-square.svg": "Add Remove Delete/remove-square.svg",
        },
    },
    {
        id: "duotone",
        label: "Duotone",
        srcRoot: "Rounded/Duotone",
        enabled: true, // v1.1.0
        // Product icon glyphs are one color, so the light second tone is dropped.
        glyph: { dropFills: ["#D4D7E0"] },
    },
    {
        id: "twotone",
        label: "Twotone",
        srcRoot: "Rounded/Twotone",
        enabled: true, // v1.1.0
        categoryAlias: { "Settings": "Setting" },
    },
    {
        id: "stroke",
        label: "Stroke",
        srcRoot: "Rounded/Stroke",
        enabled: true, // v1.1.0
    },
    {
        id: "bulk",
        label: "Bulk",
        srcRoot: "Rounded/Bulk",
        enabled: true, // v1.1.0
        fileAlias: { "Add Remove Delete/cancel-square.svg": "Add Remove Delete/remove-square.svg" },
    },
    {
        id: "sharp-solid",
        label: "Sharp Solid",
        srcRoot: "Sharp/Solid",
        enabled: true, // v1.1.0
        categoryAlias: {
            "Arrows (Round)": "Arrows",
            "Arrows (Sharp)": "Arrows",
            "Game & Sports": "Game Sports",
        },
    },
    {
        id: "sharp-stroke",
        label: "Sharp Stroke",
        srcRoot: "Sharp/Stroke",
        enabled: true, // v1.1.0
        categoryAlias: {
            "Arrows (Round)": "Arrows",
            "Arrows (Sharp)": "Arrows",
            "Game & Sports": "Game Sports",
        },
    },
];

export function enabledStyles() {
    return styles.filter((s) => s.enabled);
}
