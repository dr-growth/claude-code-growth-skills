---
name: list-building
description: Build targeted account lists from signal engine data, existing campaign accounts, Clay enrichment, and HubSpot CRM. Uses hypothesis search angles to find companies matching campaign pain points. Outputs account JSONs ready for the signal engine and enrichment pipeline. Use when you have hypotheses and need target companies, when expanding an existing campaign list, or when looking for lookalikes of won accounts. Also use when the user says "build list", "find companies", "target accounts", "account list", "lookalike", or "similar companies".
---

# List Building

Build targeted account lists for campaigns using signal data, CRM, enrichment tools, and hypothesis-driven search criteria.

## Key Difference from Extruct

Extruct uses their proprietary search API (Instant, Lookalike, Deep Search). We use:

1. **Signal Engine** — sources detecting buying signals across target accounts
2. **HubSpot CRM** (MCP connected) — existing contacts, past engagement, lifecycle stage
3. **Clay** (MCP connected) — company enrichment, contact data, waterfall enrichment
4. **Existing campaigns** — account JSONs with domains and metadata
5. **Manually curated lists** — CSV imports from events, partner data, purchased lists

## When to Use

- After `hypothesis-building` (search angles guide targeting)
- When creating a new campaign and need target accounts
- When expanding an existing campaign with lookalike accounts

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Hypothesis set | `campaigns/{slug}/hypothesis_set.md` | Recommended |
| Campaign context | `campaigns/{slug}/context.md` | Yes |
| Seed accounts | User input, HubSpot, CSV | At least one source |

## Output

```
campaigns/{campaign-slug}/accounts/{company-slug}.json
```

One JSON per account with standardized schema.

## List Sources

### Source 1: Signal Engine Scan

Use when you have a target account list and want to prioritize by buying signals.

```python
from signals.signal_engine import SignalEngine

engine = SignalEngine()
results = engine.scan_batch(accounts, sources=["newsdata", "adzuna", "sec_edgar"])
```

**Best for:** Prioritizing existing lists. Accounts with high signal scores move to Tier 1.

### Source 2: HubSpot CRM

Query HubSpot for companies matching ICP criteria.

**Search criteria from ICP:**
- Company size range
- Industry vertical
- Lifecycle stage (not customer, not DNC)
- Past engagement (opened emails, attended events)
- Technology signals (if tracked)

**Best for:** Warm accounts with past engagement.

### Source 3: Clay Enrichment

Use Clay to find lookalike companies or enrich raw lists.

**Capabilities:**
- Company search by industry, size, technology
- Contact finding with waterfall enrichment
- AI research columns (similar to Extruct's AI Tables)

**Best for:** Expanding beyond CRM with net-new accounts.

### Source 4: BLITZ Campaign Import

Load existing campaign accounts:

```bash
ls campaigns/BLITZ-DEFENSE-Q2/accounts/*.json
```

**Best for:** Reusing researched account lists across campaigns.

### Source 5: CSV Import

User provides a CSV with company names and optional domains.

**Required columns:** `name` (or `company_name`)
**Optional columns:** `domain`, `industry`, `employee_count`, `source`

Parse CSV, create account JSONs, enrich with signal engine.

## Account JSON Schema

Every account gets a standardized JSON:

```json
{
  "name": "Lockheed Martin",
  "domain": "lockheedmartin.com",
  "slug": "lockheed-martin",
  "industry": "Aerospace & Defense",
  "employee_count": 116000,
  "source": "blitz-defense-q2",
  "added_date": "2026-03-05",
  "hypothesis_fit": {
    "engineering_drain": 4,
    "coverage_gaps": 5,
    "ai_readiness": 3
  },
  "signals_summary": {
    "total_signals": 12,
    "top_score": 85,
    "last_scanned": "2026-03-05"
  }
}
```

## Workflow

### Step 1: Define Targeting Criteria from Hypotheses

For each hypothesis in the set, extract the search angle:

| Hypothesis | Search Criteria |
|-----------|----------------|
| Engineering Capacity Drain | Companies hiring 3+ data engineers, Snowflake/Databricks users |
| AI/ML Readiness Block | Companies with ML job postings, recent AI initiatives in news |

### Step 2: Source Accounts

Query sources in priority order:
1. **CRM first** — warm accounts with past engagement
2. **BLITZ campaigns** — already researched accounts
3. **Signal engine** — scan for buying signals
4. **Clay / manual** — net-new accounts

### Step 3: Deduplicate

Merge accounts from multiple sources. Deduplicate by domain. Preserve the richest metadata.

### Step 4: Pre-Score Hypothesis Fit

For each account, estimate hypothesis fit (1-5) based on available data:
- Industry match → +1
- Tech stack match (Snowflake/Databricks/BigQuery) → +1
- Hiring signals matching hypothesis → +1
- News signals matching hypothesis → +1
- Past engagement in HubSpot → +1

This is a rough pre-score. Enrichment will refine it.

### Step 5: Save Account JSONs

Write one JSON per account to `campaigns/{slug}/accounts/`.

### Step 6: Summary

Output a summary:

```markdown
## List Summary

- **Total accounts:** {N}
- **Sources:** {breakdown by source}
- **Hypothesis coverage:**
  - #{1}: {N} accounts with fit >= 3
  - #{2}: {N} accounts with fit >= 3
- **Recommended next step:** Run enrichment-design to score hypothesis fit
```

## Account Volume Guidelines

| Campaign Type | Target List Size | Why |
|--------------|-----------------|-----|
| Tier 1 (high-touch) | 20-50 | Individual research + personalized email |
| Tier 2 (templated) | 100-300 | Hypothesis-templated emails |
| Full BLITZ | 30-50 | Multi-source signal monitoring |

## Output Consumers

- `enrichment-design` — accounts provide the rows to enrich
- `list-enrichment` — enriches each account with hypothesis scoring columns
- `list-segmentation` — segments accounts into Tier 1/2/3
- `signal engine` — can rescan accounts for fresh signals
- `people-search` — finds contacts at these accounts
