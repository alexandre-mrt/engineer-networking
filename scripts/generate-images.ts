import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

const BASE_URL = "https://image.pollinations.ai/prompt";

interface ImageSpec {
  name: string;
  prompt: string;
  width: number;
  height: number;
  seed: number;
}

const IMAGES: ReadonlyArray<ImageSpec> = [
  {
    name: "hero-mesh.png",
    width: 1536,
    height: 1024,
    seed: 42,
    prompt:
      "Abstract gradient mesh with interconnected glowing nodes forming a network pattern. " +
      "Warm blues and purples on dark background. Modern minimal editorial style. No text. " +
      "Clean geometric lines, subtle glow on nodes, smooth gradient transitions.",
  },
  {
    name: "ai-shift-icon.png",
    width: 800,
    height: 800,
    seed: 101,
    prompt:
      "Minimalist illustration of a robot hand and human hand reaching toward each other " +
      "forming a bridge. Blue and purple tones on clean white background. " +
      "Clean vector style, simple geometric shapes, no text, centered composition.",
  },
  {
    name: "networking-icon.png",
    width: 800,
    height: 800,
    seed: 202,
    prompt:
      "Minimalist illustration of interconnected people nodes forming a constellation pattern. " +
      "Blue accent color on white background. Clean modern geometric style. " +
      "Circular nodes with thin connecting lines, no text, centered.",
  },
  {
    name: "human-skills-icon.png",
    width: 800,
    height: 800,
    seed: 303,
    prompt:
      "Minimalist illustration of a brain split in half. Left side has digital circuit patterns, " +
      "right side has organic tree branches with leaves. Purple and green tones on white background. " +
      "Clean editorial style, symmetric composition, no text.",
  },
  {
    name: "resources-icon.png",
    width: 800,
    height: 800,
    seed: 404,
    prompt:
      "Minimalist illustration of stacked books with a glowing lightbulb emerging from the top. " +
      "Blue and warm amber tones on white background. Modern editorial style, " +
      "clean geometric shapes, subtle glow effect, no text, centered.",
  },
  {
    name: "case-study-collison.png",
    width: 600,
    height: 600,
    seed: 501,
    prompt:
      "Abstract geometric portrait silhouette of a young tech founder. " +
      "Blue tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of triangles and lines on white background. No text.",
  },
  {
    name: "case-study-rauch.png",
    width: 600,
    height: 600,
    seed: 502,
    prompt:
      "Abstract geometric portrait silhouette of a creative coder and open source builder. " +
      "Purple tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of triangles and lines on white background. No text.",
  },
  {
    name: "case-study-hightower.png",
    width: 600,
    height: 600,
    seed: 503,
    prompt:
      "Abstract geometric portrait silhouette of a community leader and speaker at a podium. " +
      "Green tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of triangles and lines on white background. No text.",
  },
  {
    name: "case-study-nadella.png",
    width: 600,
    height: 600,
    seed: 504,
    prompt:
      "Abstract geometric portrait silhouette of an executive corporate leader. " +
      "Deep navy blue tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of triangles and lines on white background. No text.",
  },
];

function buildUrl(spec: ImageSpec): string {
  const encoded = encodeURIComponent(spec.prompt);
  return `${BASE_URL}/${encoded}?width=${spec.width}&height=${spec.height}&model=flux&nologo=true&seed=${spec.seed}`;
}

async function downloadImage(
  spec: ImageSpec,
  index: number,
  total: number
): Promise<boolean> {
  const url = buildUrl(spec);
  console.log(`\n[${index}/${total}] Generating ${spec.name}...`);
  console.log(`  URL: ${url.slice(0, 120)}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed: HTTP ${response.status}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const outputPath = join(ASSETS_DIR, spec.name);
    await writeFile(outputPath, buffer);

    console.log(`  Saved ${spec.name} (${(buffer.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.error(`  Failed: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

async function main(): Promise<void> {
  console.log("=== EngineerHub Image Pipeline (Pollinations.ai / FLUX) ===");
  console.log("Free, no API key required.\n");

  await mkdir(ASSETS_DIR, { recursive: true });

  const total = IMAGES.length;
  let succeeded = 0;

  for (let i = 0; i < IMAGES.length; i++) {
    const ok = await downloadImage(IMAGES[i], i + 1, total);
    if (ok) succeeded++;
  }

  console.log("\n--- Summary ---");
  console.log(`Generated: ${succeeded}/${total} images`);
  console.log(`Cost: $0.00 (Pollinations.ai is free)`);
  console.log(`Output: ${ASSETS_DIR}`);

  if (succeeded < total) process.exit(1);
}

main();
