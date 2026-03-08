---
name: content-publishing
description: Publish SEO/GEO content to WordPress via the REST API. Handles formatting, scheduling, category assignment, and post-publish verification. Use when content is ready to go live on your website.
disable-model-invocation: true
---

# Content Publishing

Publish content to WordPress via the REST API. Handles the last mile from "content is ready" to "content is live and verified."

## When to Use

- After seo-content or seo-page produces publish-ready content
- When GEO agents complete content optimizations
- For scheduled content calendar publishing
- For glossary page updates and expansions

## Inputs

1. **Content** — markdown or HTML body
2. **Title** — page/post title
3. **Slug** — URL slug
4. **Type** — post (blog) or page (glossary, landing)
5. **Category** — blog category or parent page
6. **Status** — draft, publish, or scheduled
7. **Schedule** — publish date/time (if scheduled)

## Process

### 1. Format Content
- Convert markdown to WordPress-compatible HTML
- Ensure heading hierarchy (H2 > H3 > H4)
- Add internal links to related content
- Format code blocks, tables, and lists

### 2. Prepare Metadata
- SEO title and meta description
- Open Graph tags
- Schema markup (if applicable)
- Featured image (if provided)
- Categories and tags

### 3. Publish via API
- WordPress REST API: `POST /wp-json/wp/v2/posts` or `/pages`
- Authentication: app password from `WP_APP_PASSWORD`
- Site: `https://www.your-domain.com`

### 4. Verify
- Confirm HTTP 201 response
- Fetch published URL and verify content renders
- Check meta tags are correct
- Submit URL to Google Search Console for indexing

## Output

```markdown
## Publish Report
- **URL:** [published URL]
- **Status:** published / scheduled / draft
- **Type:** post / page
- **Word count:** [count]
- **GSC submitted:** yes / no
```

## Safety

This skill has `disable-model-invocation: true` because it publishes content externally. Always get explicit approval before publishing. Use `status: draft` for review before going live.

## Dependencies

- WordPress API credentials (`WP_APP_PASSWORD` in env)
- Google Search Console service account (for indexing)
- Content from seo-content or GEO agents
