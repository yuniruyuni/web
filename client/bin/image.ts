import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ASSETS_DIR = "../assets";
const STATIC_DIR = "static";

async function convertImages() {
  const files = await readdir(ASSETS_DIR);
  const pngFiles = files.filter((f) => f.endsWith(".png"));

  await mkdir(STATIC_DIR, { recursive: true });

  for (const file of pngFiles) {
    const inputPath = join(ASSETS_DIR, file);
    const outputPath = join(STATIC_DIR, file.replace(".png", ".webp"));

    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

    console.log(`Converted: ${file} -> ${file.replace(".png", ".webp")}`);
  }
}

convertImages().catch(console.error);
