---
name: designing-banners
description: Use this skill when designing display ads, web banners, hero banners, promotional banners, or IAB standard ad units. Also use when the user wants to create ad creatives, banner campaigns, HTML5 animated ads, multi-size banner sets, leaderboard ads, or any rectangular promotional graphics.
---

# Designing Banners

Create display ads, web banners, and promotional graphics using the HTML/CSS → Playwright → PNG pipeline. Supports both static and HTML5 animated banners.

## Workflow

1. **Identify banner type and sizes** — Consult [references/iab-sizes-and-guidelines.md](references/iab-sizes-and-guidelines.md) for standard dimensions and guidelines.

2. **Create the HTML/CSS** — Write a self-contained HTML banner using:
   - **Tailwind CSS** via CDN for styling
   - **Google Fonts** via CDN for typography
   - CSS animations for animated banners (keyframes, transitions)
   - Use `{WIDTH}` and `{HEIGHT}` placeholders for responsive multi-size templates

3. **Render** — Choose the rendering approach:

   **Single size:**
   ```bash
   node scripts/render-to-png.js banner.html --width 300 --height 250 --output banner-300x250.png
   ```

   **Multi-size batch (recommended for ad campaigns):**
   ```bash
   node scripts/render-batch.js banner.html --sizes 300x250,728x90,160x600,320x50,970x250 --output ./banners
   ```

4. **Review** — Verify CTA visibility, text legibility, and brand consistency across all sizes.

## HTML Template Pattern

### Static Banner
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: {WIDTH}px; height: {HEIGHT}px; overflow: hidden; font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col items-center justify-center p-4">
  <h1 class="text-xl font-bold text-center mb-2">Your Headline Here</h1>
  <p class="text-sm text-center mb-4 opacity-90">Supporting message</p>
  <div class="bg-white text-blue-800 font-bold px-6 py-2 rounded-full text-sm">Learn More</div>
</body>
</html>
```

### Animated Banner
```html
<!-- Add CSS keyframes for entrance animations, hover states, and CTA pulse -->
<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-fade { animation: fadeIn 0.6s ease-out forwards; }
  .animate-slide { animation: slideUp 0.6s ease-out 0.3s forwards; opacity: 0; }
</style>
```

## Multi-Size Design Strategy

1. Design at **300x250** first (most common, tests visual hierarchy)
2. Use `{WIDTH}` and `{HEIGHT}` template variables for the batch renderer
3. Use flexbox/grid layouts that adapt to different aspect ratios
4. Test CTA readability at the smallest size (320x50)

## Common IAB Size Presets

| Preset | Sizes |
|--------|-------|
| Standard 5 | `300x250,728x90,160x600,320x50,970x250` |
| Desktop only | `300x250,728x90,160x600,970x250,300x600` |
| Mobile only | `320x50,320x100,300x250,320x480` |
| Full set | `300x250,728x90,160x600,320x50,970x250,336x280,300x600,320x100,970x90` |

## Dependencies

Requires `playwright` npm package:
```bash
npm install -g playwright && npx playwright install chromium
```
