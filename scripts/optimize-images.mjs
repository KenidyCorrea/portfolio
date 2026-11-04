// Converts source images in /assets/source-images to responsive WebP files in /public/images
// and generates the favicon PNGs and the Open Graph card.
// Usage: npm run images
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");
const SOURCE_DIR = path.resolve("assets/source-images");
const OUT_DIR = path.join(PUBLIC_DIR, "images");
const WEBP_QUALITY = 78;

/** name: output base name, src: file in /assets/source-images, widths: output widths */
const SOURCES = [
  { name: "santabot", src: "chatbot.png", widths: [800, 1600] },
  { name: "scf-auth", src: "scf-auth.png", widths: [800, 1600] },
  { name: "santaacesso", src: "santaacesso.png", widths: [800, 1600] },
  { name: "balanca-smart", src: "balanca-smart.png", widths: [800, 1600] },
  { name: "santapag", src: "santapag.png", widths: [800, 1600] },
  { name: "santaanalise", src: "cma.png", widths: [800, 1600] },
  { name: "santalabs", src: "santalabs.png", widths: [800, 1600] },
  { name: "portrait", src: "comercial.jpg", widths: [480, 960] },
];

const COLORS = { graphite: "#131519", line: "#2E333A", paper: "#E9EBEE", amber: "#F5A524", fog: "#9BA2AC" };

async function convert({ name, src, widths }) {
  const input = path.join(SOURCE_DIR, src);
  const meta = await sharp(input).metadata();
  for (const width of widths) {
    const target = Math.min(width, meta.width ?? width);
    const out = path.join(OUT_DIR, `${name}-${width}.webp`);
    const info = await sharp(input)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);
    process.stdout.write(`${path.basename(out)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB\n`);
  }
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${COLORS.graphite}"/>
  <path d="M16 12h9v16l13-16h11L35 29l15 21H39L29 35l-4 5v10h-9z" fill="${COLORS.amber}"/>
  <rect x="16" y="54" width="14" height="3" rx="1.5" fill="${COLORS.paper}"/>
  <circle cx="37" cy="55.5" r="1.8" fill="${COLORS.paper}"/>
  <circle cx="43" cy="55.5" r="1.8" fill="${COLORS.paper}"/>
  <circle cx="49" cy="55.5" r="1.8" fill="${COLORS.paper}"/>
</svg>`;
}

function ogSvg() {
  const grid = Array.from({ length: 21 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="630" />`).join("") +
    Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="1200" y2="${i * 60}" />`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORS.graphite}"/>
  <g stroke="${COLORS.line}" stroke-width="1" opacity="0.45">${grid}</g>
  <path d="M80 470 H360 L400 400 L440 520 L480 430 H1120" fill="none" stroke="${COLORS.amber}" stroke-width="4" stroke-linejoin="round"/>
  <text x="80" y="210" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="112" fill="${COLORS.paper}">Kenidy Corrêa</text>
  <text x="84" y="290" font-family="Arial, sans-serif" font-size="40" fill="${COLORS.amber}">Senior Software Engineer · Full Stack</text>
  <text x="84" y="345" font-family="Arial, sans-serif" font-size="28" fill="${COLORS.fog}">APIs, integrations and apps running in production</text>
</svg>`;
}

async function generateBrandAssets() {
  const icon = Buffer.from(faviconSvg());
  await sharp(icon).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, "favicon-32.png"));
  await sharp(icon).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC_DIR, "og-image.png"));
  process.stdout.write("favicon-32.png, apple-touch-icon.png, og-image.png\n");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const source of SOURCES) {
    await readFile(path.join(SOURCE_DIR, source.src)); // fail fast with a clear ENOENT
    await convert(source);
  }
  await generateBrandAssets();
}

main().catch((error) => {
  process.stderr.write(`Image optimization failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
