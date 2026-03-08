---
name: hypothesis-building
description: Generate testable pain hypotheses from your knowledge graph or context files, pain segmentation framework, your knowledge base, and user knowledge. No API keys required. Outputs a hypothesis set with search angles that guide list-building and signal monitoring. Use when launching a campaign and you need pain angles, when existing hypotheses feel stale, or when pivoting to a new vertical. Also use when the user says "build hypotheses", "pain hypotheses", "campaign angles", "search angles", "what pain points", or "why would they buy".
---

# Hypothesis Building

Generate testable pain hypotheses grounded in your knowledge graph and your domain expertise. No external API calls. Pure reasoning from organizational context + user knowledge.

## Key Difference from Extruct

Extruct builds hypotheses from a flat context file + user conversation. We build from:

1. **Your pain segmentation framework** — your product/company's pain categories
2. **Your knowledge graph or context files** — win patterns, objection history, competitive intel
3. **Signal engine data** — if signals exist for target accounts, use them
4. **User knowledge** — vertical expertise, observed patterns

This means our hypotheses are grounded in PROVEN pain patterns from real deals, not generic reasoning.

## When to Use

- After `context-building`, before `list-building`
- When entering a new vertical or campaign
- When refining campaign angles based on results

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Campaign context | `campaigns/{slug}/context.md` | Yes |
| Target vertical | User input | Yes |
| Signal data | `campaigns/{slug}/accounts/` signals | No |
| Existing hypotheses | Previous campaign context | No |

## Output

```
campaigns/{campaign-slug}/hypothesis_set.md
```

## Workflow

### Step 1: Load Your Pain Framework

Start with your pain segmentation framework. These are your PROVEN categories:

| # | Pain Category | Typical Evidence | Typical Persona |
|---|--------------|-----------------|-----------------|
| 1 | {Pain category 1} | {evidence} | {persona} |
| 2 | {Pain category 2} | {evidence} | {persona} |
| 3 | {Pain category 3} | {evidence} | {persona} |
| ... | ... | ... | ... |

### Step 2: Query Your Knowledge Graph for Vertical-Specific Patterns

```python
# Import your knowledge graph client
# ctx = YourKnowledgeGraphClient()

# Replace with your knowledge graph queries
# wins = ctx.query_case_studies(industry=target_vertical)

# Search your knowledge graph for facts
# objections = ctx.search_facts(f"objections from {target_vertical} companies", max_facts=10)

# Replace with your knowledge graph queries
# competitive = ctx.query_competitive_intel("primary competitor")
```

### Step 3: Map Pain Categories to Vertical

For each of your pain categories, assess:

1. **Relevance to vertical** — Does this pain apply? (High/Medium/Low/None)
2. **Evidence strength** — Do we have wins proving this? (Confirmed/Inferred/Assumed)
3. **Signal detectability** — Can our signal engine find evidence of this? (Yes/Partial/No)
4. **Competitive advantage** — Do we win on this vs primary competitor / status quo? (Strong/Moderate/Weak)

Filter to the 3-7 hypotheses that score highest across all four dimensions.

### Step 4: Draft Hypotheses

Each hypothesis MUST have:

```markdown
### #N [Short Name] (Pain Category: #{1-7})

**Pain:** [2-3 sentences — the specific pain in this vertical, grounded in evidence]

**Evidence:** [What confirms this — win case reference, signal data, graph facts]
- Confidence: {0.XX}

**Best fit:** [Company profile within the vertical — size, tech stack, stage]

**Search angle:** [Specific criteria for signal engine or list building]
- Signal types to watch: {from your signal engine}
- Enrichment columns needed: {for scoring hypothesis fit}

**Messaging hook:** [One-sentence angle for email P1]

**Proof point:** [Reference to specific win case for email P4]
```

### Step 5: Add Signal-Based Hypotheses

If signal data exists for target accounts, look for patterns:

- Multiple accounts showing the same signal type → potential hypothesis
- High compound confidence scores in a category → validated pain
- SynthesisTrigger auto-triggers → strong hypothesis candidates

These become hypotheses #8+ (beyond the Existential framework).

### Step 6: Score and Rank

Score each hypothesis:

```
hypothesis_score = (
    relevance * 0.25 +      # How relevant to vertical (1-5)
    evidence * 0.25 +        # How much proof we have (1-5)
    detectability * 0.25 +   # Can we find/score companies (1-5)
    win_rate * 0.25           # Do we win deals on this (1-5)
)
```

Rank by score. Top 3-5 become the campaign's active hypotheses.

### Step 7: Review with User

Present the ranked hypotheses and ask:
- "Do these match your understanding of this vertical?"
- "Any to add, merge, or remove?"
- "Are the search angles specific enough for the signal engine?"

Expect 1-2 rounds of refinement.

### Step 8: Save

Save to `campaigns/{campaign-slug}/hypothesis_set.md`.

## Output Format

```markdown
# Hypothesis Set: {Campaign Name}

**Vertical:** {vertical}
**Generated:** {date}
**Hypotheses:** {count}

---

### #1 {Short Name} (Pain Category: #{N})

**Pain:** {2-3 sentences}

**Evidence:** {sources}
- Confidence: {0.XX}

**Best fit:** {company profile}

**Search angle:** {signal types + enrichment columns}

**Messaging hook:** {one sentence for P1}

**Proof point:** {win case reference for P4}

---

### #2 ...
```

## Integration with Signal Engine

Hypotheses directly map to signal types in your signal engine:

| Pain Category | Relevant Signal Types |
|--------------|----------------------|
| {Category 1} | {signal types} |
| {Category 2} | {signal types} |
| {Category 3} | {signal types} |
| ... | ... |

When the signal engine detects these signals for an account, the confidence score for the matching hypothesis increases.

## Output Consumers

- `list-building` — search angles guide targeting
- `enrichment-design` — hypotheses drive segmentation columns
- `list-segmentation` — matches companies to hypotheses for tiering
- `email-prompt-building` — hypotheses become P1 angles
- `email-response-simulation` — evaluates copy against hypothesis fit
- `campaign-feedback` — validates/retires hypotheses based on results
