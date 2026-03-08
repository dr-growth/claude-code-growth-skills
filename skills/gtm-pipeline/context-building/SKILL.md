---
name: context-building
description: Build and maintain unified campaign context files by synthesizing from your knowledge graph or context files, your knowledge base, and campaign hypotheses. Produces ICP, voice, proof library, hypotheses, campaign history, and DNC list in one file that all downstream GTM skills consume. Use when starting a new campaign, refreshing stale campaign context, or preparing for any outbound motion. Also use when the user says "build context", "campaign context", "refresh context", "set up campaign", "ICP", "proof points", "campaign history", or "DNC list".
---

# Campaign Context Builder

One context file per campaign. Every downstream GTM skill reads from this file for voice, value prop, ICP, proof points, and campaign learnings.

## Key Difference from Extruct

Extruct builds context from user input (manual). We build context from three sources:

1. **Your knowledge graph or context files** — personas, competitive intel, value props, case studies, objection handlers
2. **Your knowledge base** — structured knowledge about your product's positioning
3. **User input** — campaign-specific additions, vertical focus, DNC rules

The context file is a campaign-scoped SNAPSHOT of what's relevant from these sources, not a duplicate of the entire knowledge base.

## Context File Location

```
campaigns/{campaign-slug}/context.md
```

One file per campaign. References the global knowledge but scopes to campaign audience.

## Modes

### Mode 1: Create

Use when starting a new campaign.

**Step 1:** Ask the user for campaign scope:
- Campaign name and slug
- Target vertical / segment
- Target roles (map to your buyer personas)
- Geographic focus
- Campaign goal (pipeline, awareness, re-engagement)

**Step 2:** Query your knowledge graph for relevant context:

```python
# Import your knowledge graph client
# ctx = YourKnowledgeGraphClient()

# Replace with your knowledge graph queries
# personas = ctx.query_personas()

# Replace with your knowledge graph queries
# value_props = ctx.query_value_props()

# Replace with your knowledge graph queries
# competitive = ctx.query_competitive_intel("primary competitor")

# Replace with your knowledge graph queries
# case_studies = ctx.query_case_studies(industry=target_vertical)

# Replace with your knowledge graph queries
# for company in seed_companies:
#     company_ctx = ctx.query_company_context(company)
```

**Step 3:** Read your knowledge base for structured data:

| Knowledge Node | What to Extract |
|---------------|----------------|
| Buyer personas | Pain points, objectives, discovery questions for target roles |
| Value propositions | Messaging pillars matching campaign angle |
| Customer wins | Proof points with real numbers |
| Competitive battlecards | Win patterns against known competitors |
| Technical capabilities | Product claims with confidence scores |
| Objection handlers | Pre-built objection responses |

**Step 4:** Assemble the context file using the schema below.

**Step 5:** Present to user for review. Adjust based on feedback.

### Mode 2: Update

Use when context file exists and new information is available.

**Step 1:** Read existing context file.

**Step 2:** Determine what changed:
- New win case from Gong/Slack
- Campaign results feedback
- New hypothesis validated or retired
- DNC list additions
- Competitive intel update

**Step 3:** Query your knowledge graph for fresh data on the changed topic.

**Step 4:** Append to relevant section. Never overwrite existing entries.

### Mode 3: Feedback Loop

Use when importing campaign results.

**Step 1:** Read campaign results (CSV, Instantly export, or manual data).

**Step 2:** Extract metrics: open rate, reply rate, positive reply rate, which hypotheses got replies.

**Step 3:** Update Campaign History table.

**Step 4:** Update Active Hypotheses: promote high-performers to Validated, demote failures to Retired.

**Step 5:** If new proof points surfaced, add to Proof Library.

**Step 6:** Write learnings back to your knowledge graph:

```python
# Write learnings back to your knowledge graph
# ctx.add_memory({
#     "messages": [{"role": "user", "content": f"Campaign {name}: {key_learning}"}],
#     "group_id": "your-org",
# })
```

## Context File Schema

```markdown
# Campaign Context: {Campaign Name}

**Created:** {date}
**Vertical:** {vertical}
**Target Roles:** {roles}
**Geography:** {geo}
**Goal:** {pipeline/awareness/re-engagement}

---

## What We Do

**Product:** [Your product description]

**Value prop:** {selected from value propositions based on campaign angle}

**Email-safe value prop:** {rewritten without banned words}

**Key numbers:**
- [Your competitive win data]
- [customer examples] with [deal values]
- {additional numbers from case studies matching vertical}

**Key differentiators:**
1. {Differentiator 1}
2. {Differentiator 2}
3. {Differentiator 3}
4. {Differentiator 4}

---

## Voice

**Sender:** [Your name], [Your title] at [Your company]

**Tone:** Direct, no-BS. Builder-to-builder. Short paragraphs.

**Language level:** Clear, simple sentences. No corporate jargon.

**Hard constraints:**
- No em dashes
- No exclamation marks
- No emojis in outreach
- No buzzwords (synergy, leverage, unlock)
- No flattery ("I love what you're doing at...")
- Sentence case only

**Banned words:** synergy, leverage, unlock, excited, thrilled, game-changer, disruptive

**Scope boundaries:** {Define what your product IS and ISN'T}

---

## ICP

### Primary Profiles

{Pulled from your buyer personas}

| Profile | Company Size | Roles | Why They Buy |
|---------|-------------|-------|-------------|
| {persona 1} | {size} | {titles} | {pain + trigger} |
| {persona 2} | {size} | {titles} | {pain + trigger} |

### Pain Categories (Pain Segmentation)

{From your pain segmentation framework}

1. {Pain category 1} — {description}
2. {Pain category 2} — {description}
3. {Pain category 3} — {description}
4. {Pain category 4} — {description}
5. {Pain category 5} — {description}
6. {Pain category 6} — {description}
7. {Pain category 7} — {description}

### Anti-Patterns

- {Anti-pattern 1 — e.g., too small}
- {Anti-pattern 2 — e.g., no platform fit}
- {Anti-pattern 3 — e.g., existing customer}

---

## Win Cases

{Pulled from your customer wins}

| Customer | Vertical | What Worked | Result | Confidence |
|----------|----------|------------|--------|-----------|
| {customer} | {vertical} | {resonating message} | {concrete outcome} | {0.XX} |

---

## Proof Library

Pre-written proof point sentences for email P4 (PS line).

| Proof Point | Best for Audience | Best for Hypothesis | Source Win |
|-------------|-------------------|--------------------|----|
| "{Full sentence ready for email}" | {audience type} | {hypothesis name} | {win case} |

Rules:
- Every proof point traces to a real win case above
- Write the full sentence as it would appear in email
- Pick 2-3 per campaign that match the audience + hypothesis

---

## Competitive Intel

{Pulled from your knowledge graph + your competitive battlecards}

### vs Primary Competitor
- {key win pattern}
- {key differentiator}

### vs Status Quo (manual SQL/dbt)
- {key argument}

---

## Campaign History

| Campaign | Vertical | List Size | Reply Rate | Top Hypothesis | Key Learning | Date |
|----------|----------|-----------|------------|---------------|-------------|------|
| {name} | {vert} | {N} | {X%} | {#N} | {1-sentence} | {date} |

---

## Active Hypotheses

### Validated (reply rate > X%)
{moved here from hypothesis-building after campaign results}

### Testing
{current hypotheses for this campaign}

### Retired
{hypotheses that didn't work, with reason}

---

## Do Not Contact

| Domain | Reason | Added |
|--------|--------|-------|
| {domain} | {reason} | {date} |
```

## Cross-Skill References

This context file is consumed by:
- `hypothesis-building` — reads ICP, Win Cases, pain categories
- `email-prompt-building` — reads Voice, What We Do, Proof Library, Active Hypotheses
- `list-building` — reads ICP and signals for targeting
- `enrichment-design` — reads hypotheses for column design
- `list-segmentation` — reads hypotheses for tiering logic
- `email-response-simulation` — reads Voice rules for constraints
- `campaign-sending` — reads DNC list for exclusions
- `campaign-feedback` — writes back results to Campaign History

## Data Sources

| Source | What It Provides | Priority |
|--------|-----------------|----------|
| Your knowledge graph or context files | Personas, competitive intel, value props, case studies | Primary |
| Your knowledge base | Structured knowledge nodes | Primary |
| User input | Campaign-specific scope, DNC, adjustments | Required |
| Signal engine output | Company signals for campaign targeting | Optional |
| Account planning agent output | Account research, business cases | Optional |
