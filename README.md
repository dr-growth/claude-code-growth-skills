# Claude Code Growth Skills

81 Claude Code skills for growth marketing. Open source.

> I built these while running growth at a Series B data company.
> They cover the full stack: outbound pipeline, SEO, content,
> paid ads, conversion, video, and design.
> Every skill follows Anthropic's SKILL.md format and works out of the box.

**[Live showcase](https://skills.davidronen.com)**

## What's Inside

| Category | Skills | What It Does |
|:---------|:------:|:-------------|
| GTM Pipeline | 17 | Full outbound pipeline: context, hypotheses, list building, enrichment, segmentation, email generation, sending, and feedback loop |
| Marketing & Copy | 8 | Write, edit, and strategize marketing content across channels |
| Conversion | 6 | Optimize pages, forms, signup flows, onboarding, popups, and paywalls |
| SEO | 13 | Full-stack SEO: audits, technical, content, schema, sitemaps, programmatic, hreflang, and GEO |
| Design & Creative | 13 | Banners, email templates, frontend components, design systems, SVGs, and social graphics |
| Strategy & Planning | 7 | Marketing psychology, launch planning, free tools, competitor pages, and persona translation |
| Distribution & Analytics | 5 | Paid ads, A/B testing, analytics tracking, and website audits |
| Video Production | 6 | Director-orchestrated pipeline: analysis, scripting, screen gen, assembly, and personalization |
| Meta | 6 | Build skills, engineer prompts, create MCP servers, and review designs |

## The GTM Pipeline

17 sequential steps from campaign context to closed-loop feedback:

```
Context Building -> Hypothesis Building -> Market Research -> List Building ->
Enrichment Design -> List Enrichment* -> List Segmentation -> People Search* ->
Email Search* -> Email Prompt Building -> Email Generation* -> Response Simulation ->
Campaign Sending* -> Campaign Feedback -> CRM Sync* -> Pipeline Reporting ->
Content Publishing*
```

*Manual-only (costs money or publishes externally)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/dr-growth/claude-code-growth-skills.git

# Copy all skills to your Claude skills directory
cp -r claude-code-growth-skills/skills/*/* ~/.claude/skills/

# Or copy a specific category
cp -r claude-code-growth-skills/skills/seo/* ~/.claude/skills/

# Or use the install script
chmod +x claude-code-growth-skills/install.sh
./claude-code-growth-skills/install.sh
```

## How Skills Work

Each skill is a folder with a `SKILL.md` file. The file has:

1. **YAML frontmatter** with `name` and `description` — Claude uses the description to decide when to auto-invoke the skill
2. **Markdown body** with detailed instructions, workflow steps, and output format

Example:

```yaml
---
name: writing-copy
description: When the user wants to write marketing copy for any page. Also use when the user says "write copy", "landing page copy", "homepage copy", or "rewrite this page".
---

# Writing Copy

[Detailed instructions for Claude...]
```

### Auto vs Manual

- **Auto-invoke** (74 skills): Claude detects when a skill matches your request and uses it automatically
- **Manual-only** (7 skills): Skills with `disable-model-invocation: true` in frontmatter. These require explicit invocation because they cost API credits or write to external systems

### Manual-Only Skills

These 7 skills have safety gates:

| Skill | Why Manual |
|:------|:----------|
| List Enrichment | Calls enrichment APIs (Clay, ZoomInfo) |
| People Search | Queries contact databases |
| Email Search | Runs email verification |
| Email Generation | Generates personalized outbound at scale |
| Campaign Sending | Sends emails/LinkedIn via Instantly, HeyReach |
| CRM Sync | Writes to HubSpot/Salesforce |
| Content Publishing | Publishes to WordPress/CMS |

## Customize

Fork and edit any SKILL.md. The GTM Pipeline skills use generic placeholders:

- `your product/company` — replace with your company name
- `your knowledge base` — replace with your context file path
- `primary competitor` — replace with your actual competitor
- `your knowledge graph` — replace with your data source

## About

Built by [David Ronen](https://davidronen.com). Director of Growth. Building in public.

- [GitHub](https://github.com/dr-growth)
- [LinkedIn](https://linkedin.com/in/davidjronen)

MIT License
