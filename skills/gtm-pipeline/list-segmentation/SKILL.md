---
name: list-segmentation
description: Segment enriched account lists into Tier 1 (full personalization), Tier 2 (hypothesis-templated), and Tier 3 (hold/re-process) using compound confidence scoring from your signal engine plus enrichment data. Use after list-enrichment completes, when you need to prioritize which accounts get high-touch outreach, or when re-tiering after new signal data arrives. Also use when the user says "segment list", "tier accounts", "prioritize accounts", "which accounts first", "tiering", or "who should we go after first".
---

# List Segmentation

Segment accounts into tiers based on hypothesis fit, signal strength, and data richness. Each tier gets different treatment in the email pipeline.

## Key Difference from Extruct

Extruct tiers on enrichment data richness + hypothesis fit. We add:

1. **Confidence scoring** — our signal engine already scores accounts across 10 categories
2. **SynthesisTrigger** — auto/review/override decisions for enrichment escalation
3. **Signal strength over time** — accounts with growing signal counts rank higher

## Tier Definitions

### Tier 1: Full Personalization (10-20% of list)

- Individual research via account researcher
- Custom email with specific hooks from enrichment data
- Email reviewed by `email-response-simulation` before send
- Sent from your personal email
- Multi-threaded: Champion + Economic Buyer + Technical Evaluator

**Criteria:**
- Compound confidence score >= 70 OR SynthesisTrigger = `auto`
- 4+ enrichment columns populated with non-generic data
- At least one specific personalization hook (trigger event, leader quote, competitor tool)
- Hypothesis fit score >= 4 on primary hypothesis

### Tier 2: Hypothesis-Templated (50-60% of list)

- Hypothesis-matched email (different P1 per hypothesis group)
- No individual research beyond enrichment
- Spot-check 5-10 emails for quality
- Sent via Instantly sequence
- Single thread: best-fit persona

**Criteria:**
- Compound confidence score 40-69 OR SynthesisTrigger = `review`
- 2-3 enrichment columns populated
- Hypothesis fit score >= 2 on at least one hypothesis
- Generic hook available (industry trend, hiring pattern)

### Tier 3: Hold or Re-Process (20-30% of list)

- Do NOT email yet
- Options: re-enrich with different columns, save for broader campaign, or drop

**Criteria:**
- Compound confidence score < 40
- 0-1 enrichment columns populated
- No clear hypothesis fit
- No personalization hooks available

## Scoring Formula

```
tier_score = (
    hypothesis_fit * 0.30 +     # Best hypothesis fit score (1-5, normalized)
    signal_strength * 0.25 +    # Compound confidence / 20 (0-5 scale)
    data_richness * 0.25 +      # Populated enrichment fields / total fields * 5
    hook_quality * 0.20          # 0=none, 2=generic, 4=specific, 5=personal
)

Tier 1: score >= 3.5
Tier 2: score >= 2.0
Tier 3: score < 2.0
```

Weight justification:
- 2x signals (trigger_event, current_dq_tool): Validated by campaign feedback — these predict reply rates most strongly
- 1.5x signals (platform_complexity, de_headcount): Strong business logic correlation with deal size
- 1x signals (remaining): Useful context but weaker predictors on their own

Calibration: Review tier cutoffs quarterly. If Tier 1 reply rate drops below 2%, lower the Tier 1 score threshold. If Tier 2 reply rate exceeds 1%, raise the Tier 2 floor — you're leaving quality on the table.

## Workflow

### Step 1: Load Enriched Accounts

Read all account JSONs from `campaigns/{slug}/accounts/`.

### Step 2: Calculate Tier Scores

For each account:

1. **hypothesis_fit:** Best fit score from enrichment data (e.g., `fit_engineering_drain: 4`)
2. **signal_strength:** From compound confidence scorer output, or `signals_summary.top_score / 20`
3. **data_richness:** Count of non-null, non-"Unknown" enrichment values / total enrichment columns * 5
4. **hook_quality:**
   - 5 = has leader quote or specific trigger event mentioning a named person/project
   - 4 = has specific trigger event (funding, contract, incident)
   - 2 = has generic signal (industry hiring trend, generic news)
   - 0 = no personalization hook

### Step 3: Assign Tiers

Sort by tier_score descending. Apply thresholds.

**Override rules:**
- SynthesisTrigger `auto` → force Tier 1 regardless of score
- Account is existing HubSpot contact with past engagement → bump up one tier
- Account is on DNC list → exclude entirely
- Current customer → exclude

### Step 4: Group Tier 2 by Hypothesis

Within Tier 2, group accounts by their best-fit hypothesis:

```
Tier 2 / Hypothesis #1 (Engineering Drain): 45 accounts
Tier 2 / Hypothesis #3 (Coverage Gaps): 28 accounts
Tier 2 / Hypothesis #5 (AI Readiness): 19 accounts
```

Each group gets a slightly different P1 in the email prompt.

### Step 5: Output

Save tiering to campaign:

```
campaigns/{campaign-slug}/segmentation.json
```

```json
{
  "campaign": "BLITZ-DEFENSE-Q2",
  "generated": "2026-03-05",
  "summary": {
    "tier_1": 8,
    "tier_2": 156,
    "tier_3": 72,
    "excluded": 4
  },
  "tiers": {
    "tier_1": [
      {"name": "Lockheed Martin", "score": 4.2, "top_hypothesis": "#1", "hook": "Awarded $2.1B data modernization contract"}
    ],
    "tier_2": {
      "hypothesis_1": [{"name": "Raytheon", "score": 2.8}],
      "hypothesis_3": [{"name": "BAE Systems", "score": 2.5}]
    },
    "tier_3": [
      {"name": "Small Defense Co", "score": 1.4, "reason": "Low data richness"}
    ],
    "excluded": [
      {"name": "Your Company", "reason": "Existing customer"}
    ]
  }
}
```

### Step 6: Summary Report

```markdown
## Segmentation Summary: {Campaign Name}

**Total accounts:** {N}
**Distribution:** Tier 1: {N} ({%}) | Tier 2: {N} ({%}) | Tier 3: {N} ({%}) | Excluded: {N}

### Tier 1 (Full Personalization)
{list with scores and top hooks}

### Tier 2 by Hypothesis
- Hypothesis #{N}: {count} accounts
- Hypothesis #{N}: {count} accounts

### Tier 3 Recommendations
- {N} accounts could upgrade with additional enrichment on: {missing columns}
- {N} accounts should be dropped (no hypothesis fit)

### Distribution Health Check
{flag if distribution is unhealthy — see table below}
```

## Distribution Health Check

| Issue | Diagnosis | Fix |
|-------|-----------|-----|
| 80%+ in Tier 3 | Hypotheses don't match the list | Rebuild hypotheses or rebuild list |
| 50%+ in Tier 1 | Tiering too lenient | Tighten hook_quality requirement |
| 0% in Tier 1 | No personalization data | Run enrichment-design in personalization mode |
| Even 33/33/33 | Usually healthy | Proceed |
| No Tier 2 groups | Hypotheses not scored in enrichment | Add hypothesis fit columns |

## Output Consumers

- `people-search` — prioritize Tier 1 for contact finding
- `email-prompt-building` — different prompts per tier + hypothesis group
- `email-generation` — generates emails with tier-appropriate treatment
- `email-response-simulation` — reviews Tier 1 emails only
- `campaign-sending` — separate Instantly campaigns per tier
