---
name: finding-design-resources
description: Use this skill when searching for CSS components, SVG icons, design patterns, or visual inspiration from the web. Also use when the user wants to find UI elements, look up loading spinners, search for animations, fetch code snippets, or browse design resources like CodePen and UIVerse.
---

# Design Lookup

Search the web for CSS components, SVG icons, animations, and design resources. Return usable code with attribution.

## Tools

### `scripts/fetch-page.js` — Playwright browser fetcher

Bypasses Cloudflare protection and renders SPAs. Use this for sites that block WebFetch (CodePen, UIVerse, etc.).

```bash
# Extract HTML/CSS/JS code from a CodePen pen (returns clean JSON)
node scripts/fetch-page.js "https://codepen.io/user/pen/ID" --codepen-code

# Fetch any protected page as text
node scripts/fetch-page.js "https://uiverse.io/user/component-slug"

# Extract specific elements with CSS selector
node scripts/fetch-page.js "https://example.com" --selector ".code-block"

# Increase timeout for slow pages
node scripts/fetch-page.js "https://example.com" --wait 20
```

**When to use:** After WebSearch finds promising URLs on Cloudflare-protected sites (CodePen, UIVerse, etc.), use this script to fetch the actual code.

**When NOT to use:** For sites where WebFetch works fine (CSS-Tricks, GitHub raw, dev.to, MDN). WebFetch is faster.

## Workflow

1. **Classify the request** — Determine what the user needs:
   - **CSS component** (button, card, loader, toggle, etc.)
   - **SVG icon** (UI icon, brand logo, etc.)
   - **CSS animation/effect** (hover effect, transition, keyframe animation)
   - **SVG graphic** (illustration, wave, blob, background)
   - **Design inspiration** (visual reference, not code)

2. **Choose sources** — Consult [references/sources.md](references/sources.md) for the best sources and search patterns. Use the "Search Strategy by Request Type" table.

3. **Search broadly** — Run 2-3 parallel WebSearch queries combining:
   - `site:{source} {query}` for targeted source searches
   - A general `{query} CSS/SVG` search as fallback
   - Vary terminology (e.g., "loader" vs "spinner" vs "loading animation")

4. **Fetch code** — Use the appropriate extraction method per source:

   **CodePen pens** — Use `fetch-page.js --codepen-code` to extract clean HTML/CSS/JS as JSON.

   **UIVerse components** — Use `fetch-page.js` to get the page text (includes code with line numbers inline).

   **SVG icons** — Fetch raw SVGs directly from GitHub with WebFetch:
   - Lucide: `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/{name}.svg`
   - Heroicons: `https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/outline/{name}.svg` (also `solid/`, `20/solid/`)
   - Tabler: `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/{name}.svg` (also `filled/`)
   - Feather: `https://raw.githubusercontent.com/feathericons/feather/main/icons/{name}.svg`
   - Simple Icons: `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/{name}.svg`

   **Articles/tutorials** — Fetch directly with WebFetch (CSS-Tricks, MDN, dev.to, blogs all work).

5. **Present results** — Format output as:

```
## {Description of component}
Source: {URL}

{code block with HTML/CSS/SVG}

{One-line note on how to customize, if relevant}
```

Provide 2-4 options when possible so the user or design agent can choose.

## Guidelines

- **Clean up extracted code** — Remove unnecessary vendor prefixes, framework-specific wrappers, or unrelated styles. Present minimal, self-contained snippets.
- **Note licenses** — If a source requires attribution (e.g., Flaticon free tier), mention it.
- **For SVG icons** — Prefer inline SVG code over links to icon fonts. Include `viewBox` and strip unnecessary metadata.
- **For generators** (waves, blobs, gradients) — Suggest the generator URL so the user can tweak parameters, and provide a sample output.
