#!/usr/bin/env node
// Lightweight watch mode: rebuild on changes under content/, builder/, or
// tools/, and serve site/ on http://localhost:4000. No live-reload — the
// browser reload is manual, intentionally — keeps deps small and avoids the
// HMR weight the new pipeline was meant to shed.
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WATCH_DIRS = ["content", "builder", "tools"].map(d => path.join(ROOT, d));

let building = false;
let pending = false;

async function build() {
  if (building) { pending = true; return; }
  building = true;
  const t0 = Date.now();
  try {
    await new Promise((resolve, reject) => {
      const p = spawn(process.execPath, [path.join(__dirname, "build.mjs")], { stdio: "inherit" });
      p.on("exit", code => code === 0 ? resolve() : reject(new Error(`build exited ${code}`)));
    });
    console.log(`[dev] rebuilt in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.error("[dev] build failed:", e.message);
  } finally {
    building = false;
    if (pending) { pending = false; build(); }
  }
}

function startServer() {
  const p = spawn("npx", ["--yes", "serve", "site", "-l", "4000", "--no-port-switching"], {
    stdio: "inherit", shell: process.platform === "win32",
  });
  p.on("exit", code => process.exit(code ?? 0));
}

async function watch(dir) {
  // fs.watch with recursive works on macOS and Windows. On Linux it falls back
  // to a single-level watch — fine for our flat-ish layout, but we do walk
  // first-level subdirectories to catch deeper changes.
  const watchOne = async (target) => {
    try {
      const w = fs.watch(target, { recursive: true });
      for await (const _ of w) build();
    } catch {
      // fallback: shallow watch + recurse
      try {
        const w = fs.watch(target);
        for await (const _ of w) build();
      } catch {}
    }
  };
  watchOne(dir);
}

await build();
WATCH_DIRS.forEach(watch);
startServer();
console.log("[dev] watching content/, builder/, tools/ — preview at http://localhost:4000");
