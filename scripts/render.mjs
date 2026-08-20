// Renderiza el video nombrando el mp4 con el TITULO del guion
// (lo lee de out/_titulo.txt, que genera build-video.mjs).
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let titulo = "video";
try {
  titulo = fs.readFileSync(path.join(ROOT, "out", "_titulo.txt"), "utf-8").trim() || "video";
} catch {}
const out = path.join(ROOT, "out", `${titulo}.mp4`);
const extra = process.argv.slice(2).join(" ");

console.log(`Renderizando -> ${out}`);
execSync(`npx remotion render src/index.ts CarVideo "${out}" --crf=23 ${extra}`, {
  stdio: "inherit",
});
console.log(`\n✅ Listo: ${out}`);
