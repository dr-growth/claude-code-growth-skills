---
name: creating-marketing-collateral
description: Use this skill when creating marketing collateral such as infographics, one-pagers, flyers, data visualizations, or printable marketing materials. Also use when the user wants to design sales sheets, product overviews, data-driven charts, visual reports, or any marketing document rendered as PNG or PDF.
---

# Creating Marketing Collateral

Create professional marketing collateral — infographics, one-pagers, flyers, and data visualizations — using the HTML/CSS → Playwright → PNG pipeline with optional D3.js charts.

## Workflow

1. **Identify collateral type** — Consult [references/collateral-design-patterns.md](references/collateral-design-patterns.md) for layout patterns and guidelines.

2. **Create the HTML/CSS** — Write a self-contained HTML file using:
   - **Tailwind CSS** via CDN for styling
   - **Google Fonts** via CDN for typography
   - **D3.js** via CDN for data visualizations (see [references/d3-chart-patterns.md](references/d3-chart-patterns.md))
   - Set body dimensions to match the target output size

3. **Render to PNG**:
   ```bash
   # US Letter one-pager (default)
   node scripts/render-to-png.js collateral.html --output collateral.png

   # Infographic (long vertical)
   node scripts/render-to-png.js infographic.html --width 800 --height 2400 --output infographic.png

   # Landscape data sheet
   node scripts/render-to-png.js datasheet.html --width 1200 --height 800 --output datasheet.png

   # Full-page render (auto-detect height from content)
   node scripts/render-to-png.js infographic.html --width 800 --full-page --output infographic.png
   ```

4. **Review** — Check print safety zones, text legibility, and data accuracy.

## Standard Sizes

| Type | Width | Height | Notes |
|------|-------|--------|-------|
| US Letter | 816 | 1056 | Default, standard one-pager |
| A4 | 794 | 1123 | International standard |
| Infographic (short) | 800 | 1600 | 2-3 sections |
| Infographic (long) | 800 | 2400+ | 5+ sections, use `--full-page` |
| Landscape | 1200 | 800 | Presentations, data sheets |
| Square | 1080 | 1080 | Social-friendly format |
| Half Letter | 612 | 792 | Compact flyer |

## HTML Template Pattern

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 816px; height: 1056px; overflow: hidden; font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-white p-12">
  <!-- Header -->
  <header class="mb-8">
    <img src="logo.png" alt="Brand" class="h-8 mb-4" />
    <h1 class="text-3xl font-bold text-gray-900">Title</h1>
    <p class="text-lg text-gray-500 mt-1">Subtitle or description</p>
  </header>

  <!-- KPI Row -->
  <div class="grid grid-cols-4 gap-4 mb-8">
    <!-- Metric cards -->
  </div>

  <!-- Content sections -->
  <div class="grid grid-cols-2 gap-6">
    <!-- Charts, features, text blocks -->
  </div>

  <!-- Footer -->
  <footer class="absolute bottom-8 left-12 right-12 text-xs text-gray-400 flex justify-between">
    <span>company.com</span>
    <span>© 2025 Company Name</span>
  </footer>
</body>
</html>
```

## Design Principles

- **Visual hierarchy**: Big numbers → headlines → body text → fine print
- **Scanability**: Headers, bullet points, and visual breaks over dense paragraphs
- **Brand consistency**: Maintain colors, fonts, and logo placement
- **Data integrity**: Cite sources, use accurate scales, avoid misleading charts
- **Print-friendly**: Test at 50% zoom to simulate print viewing distance

## Dependencies

Requires `playwright` npm package. D3.js loads via CDN (no install needed):
```bash
npm install -g playwright && npx playwright install chromium
```
