---
name: enrichment-design
description: Design enrichment columns that bridge pain hypotheses to account scoring and email personalization. Two modes -- segmentation columns (score hypothesis fit per company) and personalization columns (company-specific email hooks). Outputs column configs consumed by list-enrichment. Use when you have a hypothesis set and need to define what data to collect per account, when redesigning enrichment for a new campaign angle, or when email personalization feels generic. Also use when the user says "enrichment columns", "column design", "what to research", "segmentation columns", or "personalization columns".
---

# Enrichment Design

Bridge the gap between pain hypotheses and account-level data. Define WHAT to research about each company to score hypothesis fit and find personalization hooks.

## Key Difference from Extruct

Extruct designs columns for their AI Tables API. We design columns for:

1. **Signal Engine** — your signal sources already detect buying signals
2. **Clay AI Research** — Clay's agent columns for custom research
3. **Account Researcher** — your existing research agent can be tasked with specific questions
4. **ZoomInfo enrichment** — triggered by SynthesisTrigger for high-value accounts

The enrichment "columns" map to different execution backends depending on the data needed.

## Two Modes

### Mode 1: Segmentation

**Goal:** Score each account's fit against campaign hypotheses.

**Input:** Hypothesis set from `campaigns/{slug}/hypothesis_set.md`

**Process:**

For each hypothesis, design 1-2 columns that confirm or deny fit:

| Hypothesis | Column | Type | Execution Backend |
|-----------|--------|------|-------------------|
| Engineering Capacity Drain | Data Engineering Headcount | grade (1-5) | Clay or account researcher |
| Engineering Capacity Drain | DQ Tool in Use | select | Signal engine (adzuna hiring signals) |
| Coverage Gaps | Data Platform Complexity | grade (1-5) | Clay research |
| AI/ML Readiness | Active AI Initiative | boolean + evidence | Signal engine (newsdata) |

### Mode 2: Personalization

**Goal:** Find company-specific hooks for email customization.

**Input:** Target accounts + what hooks matter for this campaign

**Common personalization columns:**

| Column | What It Captures | Use In Email |
|--------|-----------------|-------------|
| Recent Trigger Event | Funding, hiring surge, migration, incident | P1 opener |
| Leadership Quote | Public statement from target persona | P1 hook |
| Tech Stack Detail | Specific tools used | P2 relevance |
| Competitive Tool | Current DQ/monitoring tool if any | P1/P2 positioning |
| Hiring Signal | Open roles matching hypothesis | P1 evidence |

## Interactive Column Design

Walk through this with the user:

**Step 1: Present the framework**

Show both modes. Ask which applies (usually both — 3 segmentation + 2 personalization).

**Step 2: Propose initial columns**

Based on hypotheses, propose 4-6 columns. For each:

```
Column: {name}
Type: {text / grade / select / boolean_with_evidence}
Backend: {signal_engine / clay / aaps_researcher / zoominfo}
Query/Prompt: {what to ask}
Why: {what this tells us}
```

**Step 3: Refine together**

Ask:
- "Any columns to add?"
- "Any to remove or merge?"
- "Should any queries be more specific?"

**Step 4: Confirm column budget**

- 4-6 columns is the sweet spot
- 7+ adds noise — push back and suggest merging
- Every column must serve either segmentation OR personalization (not vague "nice to know")

**Step 5: Output column configs**

## Column Config Schema

```json
[
  {
    "name": "Data Engineering Headcount",
    "key": "de_headcount",
    "type": "grade",
    "backend": "clay",
    "query": "How many data engineers does {company} have? Estimate from LinkedIn and job postings. Rate 1 (< 5) to 5 (50+).",
    "hypothesis": "#1 Engineering Capacity Drain",
    "mode": "segmentation"
  },
  {
    "name": "Recent Trigger Event",
    "key": "trigger_event",
    "type": "text",
    "backend": "signal_engine",
    "query": "Most significant recent event (funding, hiring, migration, incident) in last 6 months",
    "hypothesis": null,
    "mode": "personalization"
  }
]
```

## Backend Selection Guide

| Data Need | Best Backend | Why | Cost |
|-----------|-------------|-----|------|
| Hiring signals | Signal engine (Adzuna) | Already scanning, free tier | Free |
| News + events | Signal engine (Newsdata) | Already scanning, free tier | Free |
| SEC filings | Signal engine (SEC EDGAR) | Already scanning, no key needed | Free |
| Gov contracts | Signal engine (USASpending) | Already scanning, no key needed | Free |
| Tech stack detail | Clay AI research | Deep web research per company | Credits |
| Company size/revenue | ZoomInfo | Authoritative B2B data | Gated by SynthesisTrigger |
| Custom research Q | Account researcher | Your own agent, deep research | Tokens |
| Buyer intent | G2 Intent | Buyer activity on G2 | API key needed |
| Past engagement | HubSpot | CRM data, email opens, event attendance | MCP connected |
| Call insights | Gong (via Snowflake) | Objections, questions from real calls | Snowflake query |

## Pre-Built Column Library

### Segmentation Columns

**Hypothesis Fit Score (template):**
```json
{
  "name": "Fit: {Hypothesis Name}",
  "key": "fit_{hypothesis_key}",
  "type": "grade",
  "backend": "clay",
  "query": "Rate how well {company} fits this hypothesis on 1-5: '{hypothesis_description}'. Consider: {specific_criteria}."
}
```

**Data Platform Complexity:**
```json
{
  "name": "Data Platform Complexity",
  "key": "platform_complexity",
  "type": "select",
  "labels": ["Simple (1 warehouse)", "Moderate (2-3 tools)", "Complex (multi-cloud)", "Unknown"],
  "backend": "clay",
  "query": "What data platforms does {company} use? Look at job postings, tech blogs, case studies."
}
```

**Current DQ Approach:**
```json
{
  "name": "Current DQ Approach",
  "key": "current_dq",
  "type": "select",
  "labels": ["None visible", "DIY/custom", "Primary competitor", "Competitor B", "Competitor C", "Other tool", "Unknown"],
  "backend": "clay",
  "query": "Does {company} use any data quality or data observability tool? Check job postings, case studies, and tech stack databases."
}
```

### Personalization Columns

**Leadership Data Quote:**
```json
{
  "name": "Data Leader Quote",
  "key": "leader_quote",
  "type": "text",
  "backend": "clay",
  "query": "Find a recent public statement from a data leader at {company} about data quality, data trust, or data infrastructure. LinkedIn posts, conference talks, blog posts. 1-2 sentence summary with source."
}
```

**Competitor in Use:**
```json
{
  "name": "Competitor Tool",
  "key": "competitor_tool",
  "type": "text",
  "backend": "clay",
  "query": "Does {company} currently use [primary competitor], [competitor B], [competitor C], or any competing tool? Evidence from job postings, case studies, G2 reviews."
}
```

## Output Consumers

- `list-enrichment` — executes the column configs against accounts
- `list-segmentation` — uses enriched data for tiering
- `email-prompt-building` — knows which columns are available for personalization
