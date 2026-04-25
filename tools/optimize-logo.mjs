#!/usr/bin/env node
// One-shot logo optimizer. Reads ./logo.png, trims transparent padding,
// and emits all the variants the site (and search engines / social cards)
// expect, sorted into:
//
//   builder/assets/logo-source.png      (trimmed master, kept for re-runs)
//   builder/assets/logo-32.png   16+32+favicon
//   builder/assets/logo-64.png   header
//   builder/assets/logo-64.webp  header webp
//   builder/assets/logo-180.png  apple-touch-icon
//   builder/assets/logo-192.png  android home-screen
//   builder/assets/logo-512.png  android splash, large icon
//   builder/assets/og-image.png  1200x630 social card
//
// The build script (builder/build.mjs) copies these into site/assets/ and
// the layout / manifest references them.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "logo.png");
const ASSETS = path.join(ROOT, "builder", "assets");

const OG_BG = "#0F1E5A";       // deep navy from the brand palette
const OG_GRADIENT = ["#F39167", "#C2368F", "#8B2FA8"]; // peach → magenta → purple

async function main() {
  const exists = await fs.stat(SRC).then(() => true).catch(() => false);
  if (!exists) { console.error(`logo source not found at ${SRC}`); process.exit(1); }

  console.log("Optimizing logo…");

  // Trim transparent padding so every downstream variant is tight to the
  // actual mark. trim() defaults to using the top-left pixel as the trim
  // color — for an alpha logo on transparent background, that's correct.
  const trimmed = await sharp(SRC).trim({ threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  console.log(`  trimmed to ${meta.width}×${meta.height}`);

  await fs.mkdir(ASSETS, { recursive: true });
  await fs.writeFile(path.join(ASSETS, "logo-source.png"), trimmed);

  // ── Square icons ───────────────────────────────────────────────────
  // Padded to square with transparent background so the mark stays centered.
  // Used for favicons, apple-touch-icon, and PWA icons.
  const squares = [
    { name: "logo-32",  size: 32,  format: "png"  },
    { name: "logo-64",  size: 64,  format: "png"  },
    { name: "logo-64",  size: 64,  format: "webp" },
    { name: "logo-180", size: 180, format: "png"  },
    { name: "logo-192", size: 192, format: "png"  },
    { name: "logo-512", size: 512, format: "png"  },
  ];
  for (const v of squares) {
    const out = path.join(ASSETS, `${v.name}.${v.format}`);
    let pipe = sharp(trimmed).resize(v.size, v.size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
    if (v.format === "webp") pipe = pipe.webp({ quality: 90 });
    else                     pipe = pipe.png({ compressionLevel: 9, palette: false });
    await pipe.toFile(out);
    const stat = await fs.stat(out);
    console.log(`  ${v.name}.${v.format.padEnd(4)} → ${(stat.size / 1024).toFixed(1)} KB`);
  }

  // ── Hero logo (natural aspect) ─────────────────────────────────────
  // Used at large size on the home page. We export 1x and 2x widths so
  // retina screens get a sharp variant via srcset.
  const aspect = meta.height / meta.width;
  const heroes = [
    { name: "logo-hero",    width: 480, format: "webp" },
    { name: "logo-hero",    width: 480, format: "png"  },
    { name: "logo-hero@2x", width: 960, format: "webp" },
    { name: "logo-hero@2x", width: 960, format: "png"  },
  ];
  for (const v of heroes) {
    const out = path.join(ASSETS, `${v.name}.${v.format}`);
    const h = Math.round(v.width * aspect);
    let pipe = sharp(trimmed).resize(v.width, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
    if (v.format === "webp") pipe = pipe.webp({ quality: 90 });
    else                     pipe = pipe.png({ compressionLevel: 9, palette: false });
    await pipe.toFile(out);
    const stat = await fs.stat(out);
    console.log(`  ${v.name}.${v.format.padEnd(4)} → ${(stat.size / 1024).toFixed(1)} KB  (${v.width}×${h})`);
  }

  // Open Graph card — 1200x630 with logo centered on a brand-gradient panel.
  // Drawn as a single SVG composite so we don't need an extra background
  // image asset on disk.
  const ogSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${OG_GRADIENT[0]}"/>
        <stop offset=".55" stop-color="${OG_GRADIENT[1]}"/>
        <stop offset="1" stop-color="${OG_GRADIENT[2]}"/>
      </linearGradient>
      <radialGradient id="v" cx="600" cy="315" r="700" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${OG_BG}" stop-opacity="0"/>
        <stop offset="1" stop-color="${OG_BG}" stop-opacity=".55"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="${OG_BG}"/>
    <rect width="1200" height="630" fill="url(#g)" opacity=".85"/>
    <rect width="1200" height="630" fill="url(#v)"/>
    <text x="600" y="568" text-anchor="middle"
          font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
          font-size="42" font-weight="700" fill="#fff" letter-spacing="2">
      UtilPlex
    </text>
    <text x="600" y="600" text-anchor="middle"
          font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
          font-size="18" font-weight="500" fill="#ffffffcc" letter-spacing=".5">
      Fast, private developer utilities
    </text>
  </svg>`);
  const logo420 = await sharp(trimmed).resize(420, 420, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }).toBuffer();
  const ogOut = path.join(ASSETS, "og-image.png");
  await sharp(ogSvg)
    .composite([{ input: logo420, top: 80, left: 390 }])
    .png({ compressionLevel: 9 })
    .toFile(ogOut);
  const ogStat = await fs.stat(ogOut);
  console.log(`  og-image.png   → ${(ogStat.size / 1024).toFixed(1)} KB`);

  console.log("Done.");
}

main().catch(err => { console.error(err); process.exit(1); });
