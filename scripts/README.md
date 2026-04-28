# Image Generation Pipeline

Generates 9 custom illustrations for the EngineerHub website using OpenAI's `gpt-image-1` model.

## Setup

1. Copy `.env.example` to `.env` at the project root and fill in your key:
   ```sh
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY=sk-...
   ```

2. Install dependencies (once):
   ```sh
   bun install
   ```

## Run

```sh
bun run scripts/generate-images.ts
```

Images are saved to `src/assets/` as PNG files.

## Output

| File | Size | Section |
|------|------|---------|
| `hero-mesh.png` | 1536x1024 | Hero background |
| `ai-shift-icon.png` | 1024x1024 | AI Shift section icon |
| `networking-icon.png` | 1024x1024 | Networking section icon |
| `human-skills-icon.png` | 1024x1024 | Human Skills section icon |
| `resources-icon.png` | 1024x1024 | Resources section icon |
| `case-study-collison.png` | 1024x1024 | Case study portrait |
| `case-study-rauch.png` | 1024x1024 | Case study portrait |
| `case-study-hightower.png` | 1024x1024 | Case study portrait |
| `case-study-nadella.png` | 1024x1024 | Case study portrait |

## Cost

Model: `gpt-image-1` at `low` quality — approximately **$0.005 per image**.
Full run of 9 images costs roughly **$0.045**.

## Notes

- Images are generated sequentially to stay within API rate limits.
- Failed images are skipped with an error message; the script exits with code 1 if any failed.
- Re-running the script overwrites existing files in `src/assets/`.
