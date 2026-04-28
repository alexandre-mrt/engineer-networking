import puppeteer from "puppeteer-core";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const USER_DATA_DIR = `${process.env.HOME}/Library/Application Support/Google/Chrome`;

const IMAGES = [
  {
    name: "hero-mesh.png",
    prompt:
      "Generate an image: Abstract gradient mesh with interconnected glowing nodes forming a network pattern. " +
      "Warm blues and purples on dark background. Modern minimal editorial style. No text. " +
      "Clean geometric lines, subtle glow on nodes, smooth gradient transitions. Landscape 16:9 ratio.",
  },
  {
    name: "ai-shift-icon.png",
    prompt:
      "Generate an image: Minimalist flat illustration of a robot hand and human hand reaching toward each other " +
      "forming a bridge. Blue and purple tones on clean white background. " +
      "Clean vector style, simple geometric shapes, no text, centered composition. Square format.",
  },
  {
    name: "networking-icon.png",
    prompt:
      "Generate an image: Minimalist flat illustration of interconnected people silhouettes as nodes forming a constellation pattern. " +
      "Blue accent color on white background. Clean modern geometric style. " +
      "Circular nodes with thin connecting lines, no text, centered. Square format.",
  },
  {
    name: "human-skills-icon.png",
    prompt:
      "Generate an image: Minimalist flat illustration of a brain split in half. Left side has digital circuit patterns, " +
      "right side has organic tree branches with leaves. Purple and green tones on white background. " +
      "Clean editorial style, symmetric composition, no text. Square format.",
  },
  {
    name: "resources-icon.png",
    prompt:
      "Generate an image: Minimalist flat illustration of stacked books with a glowing lightbulb emerging from the top. " +
      "Blue and warm amber tones on white background. Modern editorial style, " +
      "clean geometric shapes, subtle glow effect, no text, centered. Square format.",
  },
  {
    name: "case-study-collison.png",
    prompt:
      "Generate an image: Abstract geometric portrait silhouette of a young tech founder. " +
      "Blue tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of triangles and lines on white background. No text. Square.",
  },
  {
    name: "case-study-rauch.png",
    prompt:
      "Generate an image: Abstract geometric portrait silhouette of a creative coder and builder. " +
      "Purple tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of polygons and lines on white background. No text. Square.",
  },
  {
    name: "case-study-hightower.png",
    prompt:
      "Generate an image: Abstract geometric portrait silhouette of a community leader speaking at a podium. " +
      "Green tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of polygons and lines on white background. No text. Square.",
  },
  {
    name: "case-study-nadella.png",
    prompt:
      "Generate an image: Abstract geometric portrait silhouette of a corporate executive leader. " +
      "Deep navy blue tones, minimal polygonal shapes, modern editorial illustration. " +
      "No real face, abstract silhouette made of polygons and lines on white background. No text. Square.",
  },
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForImageGeneration(page: puppeteer.Page): Promise<string | null> {
  console.log("  Waiting for image generation (up to 120s)...");

  for (let i = 0; i < 60; i++) {
    await sleep(2000);

    const imgUrl = await page.evaluate(() => {
      const images = document.querySelectorAll('img[src*="oaidalleapiprodscus"], img[src*="dalle"], img[alt*="Generated"], img[src*="openai"]');
      if (images.length > 0) {
        const last = images[images.length - 1] as HTMLImageElement;
        return last.src;
      }

      const allImgs = document.querySelectorAll('article img, [data-message-author-role="assistant"] img');
      for (const img of allImgs) {
        const src = (img as HTMLImageElement).src;
        if (src && !src.includes('avatar') && !src.includes('icon') && !src.includes('logo') && src.startsWith('http')) {
          return src;
        }
      }
      return null;
    });

    if (imgUrl) {
      console.log("  Image detected!");
      return imgUrl;
    }

    const hasError = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("unable to generate") || text.includes("limit") || text.includes("sign up");
    });

    if (hasError) {
      console.log("  Error or limit reached.");
      return null;
    }
  }

  console.log("  Timeout waiting for image.");
  return null;
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(outputPath, buffer);
    console.log(`  Saved (${(buffer.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=== EngineerHub Image Pipeline (ChatGPT GPT-Image 2.0 via Browser) ===");
  console.log("Uses your logged-in Chrome session. Free tier: ~3 images/day.\n");

  await mkdir(ASSETS_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    userDataDir: USER_DATA_DIR,
    headless: false,
    args: [
      "--no-first-run",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1400,900",
    ],
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();

  let succeeded = 0;
  const total = IMAGES.length;

  for (let i = 0; i < IMAGES.length; i++) {
    const spec = IMAGES[i];
    console.log(`\n[${i + 1}/${total}] ${spec.name}`);

    await page.goto("https://chatgpt.com", { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(3000);

    const inputSelector = 'div[contenteditable="true"], textarea[placeholder], #prompt-textarea';
    await page.waitForSelector(inputSelector, { timeout: 15000 });

    await page.click(inputSelector);
    await sleep(500);

    await page.keyboard.type(spec.prompt, { delay: 10 });
    await sleep(500);

    await page.keyboard.press("Enter");
    console.log("  Prompt sent.");

    const imgUrl = await waitForImageGeneration(page);

    if (imgUrl) {
      const outputPath = join(ASSETS_DIR, spec.name);
      const ok = await downloadImage(imgUrl, outputPath);
      if (ok) {
        succeeded++;
      } else {
        console.log("  Download failed, trying screenshot fallback...");
        const imgElement = await page.$('article img:not([src*="avatar"])');
        if (imgElement) {
          await imgElement.screenshot({ path: outputPath });
          console.log("  Saved via screenshot fallback.");
          succeeded++;
        }
      }
    } else {
      console.log("  Skipping (no image generated).");
    }

    if (i < IMAGES.length - 1) {
      console.log("  Cooling down 5s...");
      await sleep(5000);
    }
  }

  await browser.close();

  console.log("\n--- Summary ---");
  console.log(`Generated: ${succeeded}/${total} images`);
  console.log(`Cost: $0.00 (ChatGPT free tier)`);
  console.log(`Output: ${ASSETS_DIR}`);
  console.log("\nNote: Free tier allows ~3 images/day. Run multiple days for all 9.");
}

main().catch(console.error);
