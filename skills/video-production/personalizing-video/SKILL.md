---
name: personalizing-video
description: Create personalized video variants from a master template by swapping variable layers — company names, industry data, product screens, stats, and CTAs. Use for ABM campaign videos, prospect-specific demos, industry-variant versions, or any batch video personalization workflow.
---

# Personalizing Video

Take a master video template and produce personalized variants by swapping variable layers — company names, industry data, product screens, stats, and CTAs. This is the scale engine for 1-to-many video production.

## When to Use

- Creating company-specific demo videos for prospect pages
- Producing industry-variant versions of a master video
- Personalizing CTAs, opening hooks, or closing messages per audience
- Batch rendering videos for ABM campaigns

## Workflow

### Step 1: Define the Variable Map

Start from the visual code document's "Personalization Slots" section. Create a structured variable map:

```json
{
  "template": "product-overview-v2",
  "variables": {
    "company_name": { "type": "text", "scenes": [1, 14], "default": "your organization" },
    "industry": { "type": "text", "scenes": [3, 4, 5], "default": "enterprise" },
    "table_name": { "type": "text", "scenes": [4, 5, 6], "default": "finance.cc_transactions" },
    "data_description": { "type": "text", "scenes": [4], "default": "credit card transaction data" },
    "segment_names": { "type": "array", "scenes": [6, 7], "default": ["fuel", "fastfood"] },
    "stack_logos": { "type": "array", "scenes": [3], "default": ["snowflake", "databricks"] },
    "alert_channel": { "type": "enum", "options": ["slack", "teams", "email", "pagerduty"], "scenes": [11], "default": "slack" },
    "cta_url": { "type": "url", "scenes": [14], "default": "yourcompany.com/demo" },
    "record_count": { "type": "number", "scenes": [9], "default": 461 },
    "passing_runs": { "type": "number", "scenes": [6], "default": 687 }
  },
  "variants": []
}
```

### Step 2: Build Variant Data

For each prospect/segment, fill the variable map:

```json
{
  "variant_id": "acme-financial",
  "company_name": "Acme Financial",
  "industry": "financial services",
  "table_name": "acme.core_transactions",
  "data_description": "payment processing data for retail banking customers",
  "segment_names": ["wire_transfers", "ach_payments"],
  "stack_logos": ["snowflake", "dbt", "looker"],
  "alert_channel": "slack",
  "cta_url": "yourcompany.com/demo?ref=acme",
  "record_count": 2847,
  "passing_runs": 1200
}
```

### Step 3: Generate Variant Assets

For each variant, run `/generating-video-screens` with the variant data to produce personalized screens. The screen templates accept these variables and render company-specific UI.

### Step 4: Assemble Variants

Use `/assembling-video` with Remotion's programmatic rendering API to batch-produce all variants. Each variant gets the same master composition but with different inputProps.

### Step 5: Voiceover Variants (Optional)

For script personalization:
1. Generate variant scripts from the master script template (find/replace variable slots)
2. Send to TTS API (ElevenLabs) for audio generation
3. Include in the Remotion composition as the audio track

For minimal personalization (just company name in opening/closing), consider:
- Pre-recording generic audio
- Only TTS-generating the personalized opening/closing sentences
- Splicing them into the master audio track

## Output

- `variants/` directory with one `.mp4` per variant
- `variant-map.json` with all variable data for each variant
- Optionally: variant-specific voiceover audio files

## Scale Targets

| Tier | Variants | Personalization Depth | Method |
|------|---------|----------------------|--------|
| ABM 1:1 | 5-10 | Full (screens + VO + CTA) | Manual review per variant |
| Industry | 10-20 | Medium (industry data + screens) | Template + batch render |
| Segment | 50-100 | Light (company name + CTA) | Text overlay swap only |

## Dependencies

- Variable map from visual code document
- Screen templates from `/generating-video-screens`
- Remotion project from `/assembling-video`
- ElevenLabs API (for TTS voiceover variants)
