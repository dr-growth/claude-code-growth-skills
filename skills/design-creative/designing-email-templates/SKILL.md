---
name: designing-email-templates
description: Use this skill when designing HTML email templates using MJML for responsive, cross-client compatible emails. Also use when the user wants to create email layouts, build newsletter templates, design transactional emails, compile MJML to HTML, or produce any responsive email design. Complements designing-email-sequences which handles copy and strategy.
---

# Designing Email Templates

Create responsive, cross-client compatible HTML email templates using MJML. This skill handles email **design and layout** — for email **copy and strategy**, see the designing-email-sequences skill.

## Workflow

1. **Identify template type** — Consult [references/email-design-patterns.md](references/email-design-patterns.md) for structure and guidelines (transactional, newsletter, announcement, welcome).

2. **Write MJML** — Create the email template using MJML components:
   - Use semantic MJML tags (`<mj-section>`, `<mj-column>`, `<mj-text>`, `<mj-button>`)
   - Set global styles in `<mj-attributes>`
   - Add dark mode support via `<mj-style>`

3. **Compile to HTML** — Convert MJML to production-ready HTML:
   ```bash
   node scripts/compile-mjml.js email.mjml --output email.html
   ```

4. **Review compatibility** — Consult [references/email-client-compatibility.md](references/email-client-compatibility.md) for client-specific issues.

## MJML Starter Template

```xml
<mjml>
  <mj-head>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
    <mj-attributes>
      <mj-all font-family="Inter, Arial, sans-serif" />
      <mj-text font-size="16px" line-height="1.6" color="#333333" />
      <mj-button font-size="16px" font-weight="600" border-radius="6px" inner-padding="12px 24px" />
    </mj-attributes>
    <mj-style>
      @media (prefers-color-scheme: dark) {
        .dark-bg { background-color: #1a1a2e !important; }
        .dark-text { color: #e0e0e0 !important; }
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#f4f4f4" width="600px">
    <!-- Header -->
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-image src="logo.png" alt="Brand" width="120px" />
      </mj-column>
    </mj-section>

    <!-- Content -->
    <mj-section background-color="#ffffff" padding="20px 40px">
      <mj-column>
        <mj-text font-size="24px" font-weight="700">Your Headline</mj-text>
        <mj-text>Your message content here.</mj-text>
        <mj-button background-color="#2563eb" color="#ffffff" href="#">Call to Action</mj-button>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section padding="20px">
      <mj-column>
        <mj-text font-size="12px" color="#999999" align="center">
          Company Name · 123 Street · City, ST 12345<br/>
          <a href="#" style="color: #999999;">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

## Script Reference

```bash
# Basic compilation
node scripts/compile-mjml.js email.mjml

# Custom output path
node scripts/compile-mjml.js email.mjml --output dist/email.html

# Minified output for production
node scripts/compile-mjml.js email.mjml --minify --output dist/email.min.html

# Strict validation (exits on errors)
node scripts/compile-mjml.js email.mjml --validation-level strict
```

## Design Guidelines

- **Max width**: 600px (standard), 640px (max)
- **Font size**: 16px minimum for body, 14px minimum for secondary text
- **CTA buttons**: 44px minimum height, full-width on mobile
- **Images**: Always include alt text, use `width` attribute for Outlook
- **Colors**: Hex codes only, avoid pure black (#333 instead)
- **Spacing**: Consistent padding (20-40px sections, 10-20px elements)

## Dependencies

Requires `mjml` npm package:
```bash
npm install -g mjml
```
