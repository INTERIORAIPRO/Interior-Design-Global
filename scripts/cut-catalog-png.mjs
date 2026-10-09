import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { removeBackground } from "@imgly/background-removal";

const root = resolve(import.meta.dirname, "..");
const names = ["sofa", "armchair", "lamp", "table", "rug"];

for (const name of names) {
  const input = resolve(root, "public/partner-store", `${name}.jpg`);
  const output = resolve(root, "public/partner-store", `${name}.png`);
  const blob = await removeBackground(input, {
    output: { format: "image/png", quality: 1 },
  });
  await writeFile(output, Buffer.from(await blob.arrayBuffer()));
  console.log("wrote", output);
}
