import OpenAI from "openai";
import type { ImageModel } from "openai/resources/images";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MODEL: ImageModel = "gpt-image-1";
const QUALITY = "low" as const;
const COST_PER_IMAGE_USD = 0.005;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

type ImageSize = "1024x1024" | "1536x1024" | "1024x1536";

interface ImageSpec {
  name: string;
  prompt: string;
  size: ImageSize;
}

// ---------------------------------------------------------------------------
// Image definitions
// ---------------------------------------------------------------------------

const IMAGES: ReadonlyArray<ImageSpec> = [
  {
    name: "hero-mesh.png",
    size: "1536x1024",
    prompt:
      "Abstract gradient mesh with interconnected nodes forming a network pattern. " +
      "Warm blues and purples. Modern, minimal, editorial style. No text. " +
      "Clean geometric lines, subtle glow on nodes, smooth gradient transitions.",
  },
  {
    name: "ai-shift-icon.png",
    size: "1024x1024",
    prompt:
      "Minimalist illustration of a robot hand and human hand reaching toward each other, " +
      "forming a bridge. Blue and purple tones on a white background. " +
      "Clean vector style, simple geometric shapes, no text.",
  },
  {
    name: "networking-icon.png",
    size: "1024x1024",
    prompt:
      "Minimalist illustration of interconnected people nodes forming a constellation pattern. " +
      "Blue accent color on white background. Clean, modern, geometric style. " +
      "Circular nodes with thin connecting lines, no text.",
  },
  {
    name: "human-skills-icon.png",
    size: "1024x1024",
    prompt:
      "Minimalist illustration of a brain with circuit patterns on one side and organic tree branches " +
      "on the other side. Purple and green tones on white background. " +
      "Clean editorial style, symmetric composition, no text.",
  },
  {
    name: "resources-icon.png",
    size: "1024x1024",
    prompt:
      "Minimalist illustration of stacked books with a glowing lightbulb emerging from the top. " +
      "Blue and warm amber tones on white background. Modern editorial style, " +
      "clean geometric shapes, subtle glow effect, no text.",
  },
  {
    name: "case-study-collison.png",
    size: "1024x1024",
    prompt:
      "Abstract geometric portrait silhouette representing a tech founder. " +
      "Blue tones, minimal geometric shapes, modern editorial illustration style. " +
      "No real face — only abstract silhouette composed of polygons and lines. No text.",
  },
  {
    name: "case-study-rauch.png",
    size: "1024x1024",
    prompt:
      "Abstract geometric portrait silhouette of a coder and builder. " +
      "Purple tones, minimal geometric shapes, modern editorial illustration style. " +
      "No real face — only abstract silhouette composed of polygons and lines. No text.",
  },
  {
    name: "case-study-hightower.png",
    size: "1024x1024",
    prompt:
      "Abstract geometric portrait silhouette of a community leader and public speaker. " +
      "Green tones, minimal geometric shapes, modern editorial illustration style. " +
      "No real face — only abstract silhouette composed of polygons and lines. No text.",
  },
  {
    name: "case-study-nadella.png",
    size: "1024x1024",
    prompt:
      "Abstract geometric portrait silhouette of a corporate executive leader. " +
      "Deep blue tones, minimal geometric shapes, modern editorial illustration style. " +
      "No real face — only abstract silhouette composed of polygons and lines. No text.",
  },
] as const;

// ---------------------------------------------------------------------------
// Generation logic
// ---------------------------------------------------------------------------

interface GenerationResult {
  name: string;
  success: boolean;
  error?: string;
}

async function generateImage(
  client: OpenAI,
  spec: ImageSpec,
  index: number,
  total: number
): Promise<GenerationResult> {
  console.log(`Generating [${index}/${total}] ${spec.name}...`);

  try {
    const response = await client.images.generate({
      model: MODEL,
      prompt: spec.prompt,
      size: spec.size,
      quality: QUALITY,
      output_format: "png",
      n: 1,
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      return {
        name: spec.name,
        success: false,
        error: "No b64_json in response",
      };
    }

    const buffer = Buffer.from(imageData.b64_json, "base64");
    const outputPath = join(ASSETS_DIR, spec.name);
    await writeFile(outputPath, buffer);

    console.log(`  Saved ${spec.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return { name: spec.name, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  Failed ${spec.name}: ${message}`);
    return { name: spec.name, success: false, error: message };
  }
}

async function main(): Promise<void> {
  const apiKey = Bun.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY is not set. Add it to your .env file.");
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });

  await mkdir(ASSETS_DIR, { recursive: true });

  const total = IMAGES.length;
  const results: GenerationResult[] = [];

  for (let i = 0; i < IMAGES.length; i++) {
    const spec = IMAGES[i];
    const result = await generateImage(client, spec, i + 1, total);
    results.push(result);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success);
  const estimatedCost = succeeded * COST_PER_IMAGE_USD;

  console.log("\n--- Summary ---");
  console.log(`Generated: ${succeeded}/${total} images`);
  console.log(`Estimated cost: $${estimatedCost.toFixed(3)}`);
  console.log(`Output directory: ${ASSETS_DIR}`);

  if (failed.length > 0) {
    console.log("\nFailed images:");
    for (const f of failed) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
    process.exit(1);
  }
}

main();
