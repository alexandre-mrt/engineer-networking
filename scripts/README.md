# Image Generation Pipeline

Two scripts to generate 9 custom illustrations for the EngineerHub website.

## Option A: Pollinations.ai (free, no login, recommended)

Uses FLUX model via pollinations.ai. Completely free, no API key needed.

```sh
bun install
bun run scripts/generate-images.ts
```

## Option B: ChatGPT GPT-Image 2.0 (free tier, browser automation)

Opens your real Chrome browser (with your logged-in ChatGPT session) and prompts GPT-Image 2.0 directly. Free tier allows ~3 images/day, so run over multiple days for all 9.

```sh
bun add puppeteer-core
bun run scripts/generate-images-browser.ts
```

Requires: Google Chrome installed, logged into chatgpt.com.

## Output

| File | Section |
|------|---------|
| `hero-mesh.png` | Hero background |
| `ai-shift-icon.png` | AI Shift section icon |
| `networking-icon.png` | Networking section icon |
| `human-skills-icon.png` | Human Skills section icon |
| `resources-icon.png` | Resources section icon |
| `case-study-collison.png` | Case study portrait |
| `case-study-rauch.png` | Case study portrait |
| `case-study-hightower.png` | Case study portrait |
| `case-study-nadella.png` | Case study portrait |

Images are saved to `src/assets/` as PNG files.
