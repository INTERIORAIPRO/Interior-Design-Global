import { mkdir, writeFile } from "fs/promises";
import { createWriteStream, readFileSync } from "fs";
import http from "http";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "src/lib/partner-store/productPhotos.ts");
const outDir = path.join(root, "public/products");
const text = readFileSync(sourceFile, "utf8");
const block = text.split("export const productPhotoSources")[1] || "";
const sources = {};
const pattern = /"([^"]+)":\s*\n\s*"(https:[^"]+)"/g;
let match;
while ((match = pattern.exec(block))) {
  sources[match[1]] = match[2];
}

await mkdir(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (target) => {
      const client = target.startsWith("https") ? https : http;
      client
        .get(target, { headers: { "User-Agent": "InteriorDesignGlobal/1.0" } }, (response) => {
          if (
            response.statusCode &&
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            request(response.headers.location);
            return;
          }
          if (response.statusCode !== 200) {
            reject(new Error(`${response.statusCode} ${target}`));
            return;
          }
          const file = createWriteStream(dest);
          response.pipe(file);
          file.on("finish", () => file.close(() => resolve()));
          file.on("error", reject);
        })
        .on("error", reject);
    };
    request(url);
  });
}

const entries = Object.entries(sources);
for (const [id, url] of entries) {
  const dest = path.join(outDir, `${id}.jpg`);
  try {
    await download(url, dest);
    console.log("ok", id);
  } catch (error) {
    console.error("fail", id, error instanceof Error ? error.message : error);
  }
}

await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(Object.keys(sources), null, 2),
);
console.log("downloaded", entries.length);
