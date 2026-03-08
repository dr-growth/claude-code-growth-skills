---
name: creating-social-graphics
description: Use this skill when creating social media graphics, Instagram posts, LinkedIn images, Twitter cards, OG images, story graphics, or platform-specific visual content. Also use when the user wants to design social media visuals, generate shareable images, create carousel slides, make Open Graph images, or produce any graphic sized for social platforms.
---

# Creating Social Graphics

Generate platform-ready social media graphics using the HTML/CSS → Playwright → PNG pipeline.

## Workflow

1. **Identify platform and format** — Consult [references/platform-sizes-and-guidelines.md](references/platform-sizes-and-guidelines.md) for exact dimensions and design guidelines.

2. **Create the HTML/CSS** — Write a self-contained HTML file using:
   - **Tailwind CSS** via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
   - **Google Fonts** via CDN: `<link href="https://fonts.googleapis.com/css2?family=FontName&display=swap" rel="stylesheet">`
   - Inline styles for precise positioning when needed
   - The HTML document dimensions must match the target platform size exactly

3. **Render to PNG** — Execute the rendering script:
   ```bash
   node scripts/render-to-png.js graphic.html --width 1080 --height 1080 --output graphic.png
   ```

4. **Review and refine** — Check text legibility, safe zones, and visual hierarchy

## HTML Template Pattern

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: {WIDTH}px; height: {HEIGHT}px; overflow: hidden; font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <!-- Design content here -->
</body>
</html>
```

Replace `{WIDTH}` and `{HEIGHT}` with the target dimensions from the platform reference.

## Quick Reference

| Command | Output |
|---------|--------|
| `--width 1080 --height 1080` | Instagram square |
| `--width 1080 --height 1350` | Instagram portrait |
| `--width 1080 --height 1920` | Instagram story |
| `--width 1200 --height 627` | LinkedIn post |
| `--width 1200 --height 675` | Twitter/X post |
| `--width 1200 --height 630` | Open Graph image |

## Design Principles

- **Bold typography** — Social feeds are noisy; use large, high-contrast text
- **Minimal elements** — One clear message per graphic; avoid clutter
- **Brand consistency** — Maintain colors, fonts, and logo placement across graphics
- **Safe zones** — Keep critical content within center 80% of canvas
- **Hierarchy** — Lead with the hook; supporting details secondary
- **Contrast** — Ensure text is readable against all background areas

## Dependencies

Requires `playwright` npm package. Install globally or in project:
```bash
npm install -g playwright && npx playwright install chromium
```
