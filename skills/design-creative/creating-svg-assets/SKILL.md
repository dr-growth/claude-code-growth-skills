---
name: creating-svg-assets
description: Use this skill when creating SVG assets including logos, icons, badges, geometric illustrations, or vector graphics. Also use when the user wants to design SVG icons, optimize SVG files, export SVGs to PNG, create vector logos, build icon sets, or produce any scalable vector graphic.
---

# Creating SVG Assets

Create optimized SVG assets — logos, icons, badges, and illustrations — with optional PNG export.

## Workflow

1. **Determine asset type** — Consult [references/svg-design-patterns.md](references/svg-design-patterns.md) for type-specific guidelines (icon vs logo vs badge vs illustration).

2. **Write the SVG** — Create clean, semantic SVG markup:
   - Always include `viewBox` attribute
   - Use `currentColor` for themeable icons
   - Group related elements with `<g>`
   - Add `<title>` for accessibility

3. **Optimize** — Run SVGO optimization:
   ```bash
   node scripts/optimize-svg.js icon.svg --output icon.min.svg
   ```

4. **Export to PNG** (optional) — Convert to raster at target size:
   ```bash
   node scripts/svg-to-png.js icon.svg --width 512 --output icon-512.png
   ```

## Script Reference

### optimize-svg.js
```bash
node scripts/optimize-svg.js input.svg                    # Optimize in-place
node scripts/optimize-svg.js input.svg --output out.svg   # Output to new file
node scripts/optimize-svg.js input.svg --precision 2      # Fewer decimal places
node scripts/optimize-svg.js input.svg --remove-dimensions  # Strip width/height, keep viewBox
node scripts/optimize-svg.js input.svg --keep-ids          # Preserve element IDs
```

### svg-to-png.js
```bash
node scripts/svg-to-png.js icon.svg                        # Original size, transparent bg
node scripts/svg-to-png.js icon.svg --width 512            # Scale to 512px wide
node scripts/svg-to-png.js icon.svg --height 256           # Scale to 256px tall
node scripts/svg-to-png.js icon.svg --background white     # White background
node scripts/svg-to-png.js icon.svg --output favicon.png   # Custom output path
```

## SVG Template: Icon

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Design on 24x24 grid with 2px padding -->
</svg>
```

## SVG Template: Logo

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <!-- Horizontal logo layout -->
  <g class="logo-mark"><!-- Icon/symbol --></g>
  <g class="logo-text"><!-- Text as paths --></g>
</svg>
```

## Dependencies

- **@resvg/resvg-js** — High-quality SVG to PNG conversion (no browser needed)
- **svgo** — SVG optimization and minification

Install:
```bash
npm install -g @resvg/resvg-js svgo
```
