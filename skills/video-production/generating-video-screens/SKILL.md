---
name: generating-video-screens
description: Generate visual assets for video frames — product UI screenshots, text overlay cards, data visualizations, integration grids, and personalized screens. Uses Playwright HTML-to-PNG and Gemini image generation to produce video-ready assets from a script's shot directions.
---

# Generating Video Screens

Create the visual assets (product UI screens, data visualizations, text cards, integration grids) that will be composited into video frames. Extends the existing Playwright HTML-to-PNG and Nana Banana Pro workflows into video-ready assets.

## When to Use

- Producing product demo screens for a video
- Creating text overlay cards (headlines, taglines, callouts)
- Generating data visualizations that will be animated
- Building integration/logo grids
- Creating personalized screens (company-specific data, industry-specific examples)

## Workflow

### Step 1: Read the Script

Every screen maps to a scene in the script. Read the script's `Visual:` field for each scene to understand what needs to be produced.

### Step 2: Choose the Right Tool

| Asset Type | Tool | Why |
|-----------|------|-----|
| Product UI screenshots | Playwright HTML-to-PNG | Pixel-perfect, brand-consistent, text-accurate |
| Text overlay cards | Playwright HTML-to-PNG | Clean typography with brand fonts |
| Data visualizations | D3.js -> Playwright | Animated-ready SVG charts |
| Integration logo grids | Playwright HTML-to-PNG | Precise logo placement |
| Atmospheric/hero imagery | Nana Banana Pro (Gemini) | Visual richness, texture, mood |
| Abstract backgrounds | Nana Banana Pro or CSS | Depends on complexity |

### Step 3: Production Standards

- **Resolution:** 1920x1080 (1080p) minimum. 3840x2160 (4K) preferred for zoom-in shots.
- **Naming:** `scene-[NN]-[description].png` (e.g., `scene-03-table-overview.png`)
- **Browser chrome:** For product demos, wrap in the standard browser frame (gray rounded rect, three dots top-left). See existing video frames for reference.
- **Cursor:** Render the cursor as a separate asset or composited layer. Use the standard black arrow cursor for overview shots, hand cursor for click interactions.
- **Color accuracy:** Match exact brand hex codes from `brand/visual-identity.md`. Cross-reference against the visual code document.
- **Personalization:** For variable screens, create a template HTML that accepts parameters (company name, table name, segment names, etc.).

### Step 4: Organize Output

```
video-analysis/<project>/screens/
  scene-01-logo.png
  scene-02-alerts.png
  scene-03-product-overview.png
  ...
  templates/          <- Parameterized HTML for personalized screens
    table-overview.html
    rca-chart.html
```

## Output

A `screens/` directory with all visual assets needed for video assembly, plus reusable templates for personalized variants.

## Dependencies

- `tools/scripts/render-to-png.js` (Playwright)
- `tools/scripts/generate-image.js` (Gemini)
- `brand/visual-identity.md`
- Script from `/scripting-video`
