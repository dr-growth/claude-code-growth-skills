---
name: market-research
description: Conduct deep vertical research using signal sources, web research, and your knowledge graph to validate or discover pain hypotheses. Produces verified data points that feed hypothesis-building and enrichment-design. Use when entering a new vertical, when hypotheses need external validation, or when you need industry-specific proof points for outreach. Also use when the user says "research vertical", "market research", "validate hypotheses", "industry research", "deep research", or "what's happening in [vertical]".
---

# Market Research

Research vertical pain points using your signal sources, web research, and your knowledge graph. Validates hypotheses with external data. Produces verified data points for enrichment and email personalization.

## Key Difference from Extruct

Extruct uses Perplexity API for research. We use:

1. **Signal Engine** (8 sources) — SEC EDGAR, NewsAPI, Adzuna, USASpending, G2, HubSpot, Gong, Crossbeam
2. **Web research** — Claude's built-in web access for deep dives
3. **Your knowledge graph** — existing knowledge about the vertical from past campaigns
4. **Gong call data** — real objections and pain points from sales calls

## When to Use

- After `hypothesis-building` to validate hypotheses with external data
- When entering a vertical you DON'T know well (complement to hypothesis-building)
- When you need verified numbers for email personalization

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Hypothesis set | `campaigns/{slug}/hypothesis_set.md` | Recommended |
| Target vertical | User input | Yes |
| Campaign context | `campaigns/{slug}/context.md` | Recommended |

## Output

```
campaigns/{campaign-slug}/sourcing_research.md
```

## Workflow

### Step 1: Define Research Questions

For each hypothesis, generate 2-3 research questions:

| Hypothesis | Research Questions |
|-----------|-------------------|
| Engineering Capacity Drain | "What % of DE time goes to data quality in {vertical}?" "Average cost of data quality incidents in {vertical}?" |
| Late-Surfacing Incidents | "Recent data incidents in {vertical}?" "Regulatory fines for data quality in {vertical}?" |

### Step 2: Query Signal Sources

Use the signal engine to find vertical-level patterns:

```python
from signals.signal_engine import SignalEngine

engine = SignalEngine()

# Scan a set of representative companies in the vertical
for company in vertical_representative_companies:
    signals = engine.scan_account(company, sources=["newsdata", "adzuna", "sec_edgar"])
```

**What to look for:**
- Hiring patterns (adzuna) — are companies in this vertical hiring data quality roles?
- News patterns (newsdata) — data incidents, migrations, AI initiatives
- SEC filings (sec_edgar) — regulatory risk mentions, data governance disclosures
- Government contracts (usaspending) — data modernization spending

### Step 3: Web Research for Verification

For each hypothesis, find verified data points:

- Industry reports with specific numbers
- Analyst estimates (Gartner, Forrester, IDC)
- Case studies from the vertical
- Conference talks about data quality challenges
- Job posting analysis (what skills are in demand)

**Quality bar:** Every data point must have a source URL and date. No unattributed statistics.

### Step 4: Query Your Knowledge Graph for Internal Evidence

```python
# Import your knowledge graph client
# ctx = YourKnowledgeGraphClient()

# Replace with your knowledge graph queries
# wins = ctx.query_case_studies(industry=vertical)

# Search your knowledge graph for facts
# objections = ctx.search_facts(f"objections {vertical}", max_facts=10)

# Search your knowledge graph for facts
# messaging = ctx.search_facts(f"successful messaging {vertical}", max_facts=5)
```

### Step 5: Synthesize into Research Document

Organize findings by hypothesis, with confidence scores.

## Output Format

```markdown
# Sourcing Research: {Vertical}

**Generated:** {date}
**Sources queried:** {list}

---

## Research Summary

{2-3 paragraph overview of the vertical's data quality landscape}

---

## Hypothesis Validation

### #1 {Hypothesis Name}

**Verdict:** Confirmed / Partially Confirmed / Unconfirmed

**Data Points:**
- {Specific number or fact} — Source: {URL}, Date: {date}, Confidence: {0.XX}
- {Another data point} — Source: {URL}

**Signal Patterns:**
- {What signal engine found across companies in this vertical}

**Internal Evidence:**
- {Win case or Gong insight from your knowledge graph}

---

### #2 ...

---

## New Hypotheses Discovered

{Pain points found during research that weren't in the original hypothesis set}

### #N {New Hypothesis}
**Pain:** {description}
**Evidence:** {data points}
**Recommendation:** Add to hypothesis set? (Yes/No with reasoning)

---

## Enrichment Opportunities

{Data points that could become enrichment columns for list-segmentation}

| Data Point | Column Type | Why It Matters |
|-----------|------------|---------------|
| {point} | {text/grade/select} | {how it helps segment or personalize} |
```

## Research Quality Standards

- **0.80+ confidence:** Multiple independent sources confirm. Use in outreach.
- **0.60-0.79:** Single credible source. Use with hedging ("companies like yours often...").
- **Below 0.60:** Inference or estimate. Flag for validation. Don't use in email P1.

Claims in outreach must meet the same confidence bar as your knowledge base nodes.

## Output Consumers

- `hypothesis-building` — validates or adds hypotheses
- `enrichment-design` — data points become column ideas
- `email-prompt-building` — verified numbers for P1 and P2
- `context-building` (Mode 2) — research updates campaign context
