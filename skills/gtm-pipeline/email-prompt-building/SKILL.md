---
name: email-prompt-building
description: Build self-contained email prompt templates for cold outreach by synthesizing campaign context (voice, value prop, proof points) with hypothesis research and enrichment data. Produces prompts that email-generation runs per-row against a contact CSV, with structural variants by buying committee role. Use when you have enriched lists and need to generate outreach, when creating role-specific email variants, or when refreshing email templates for a new campaign phase. Also use when the user says "cold email", "outreach prompt", "email campaign", "email template", "draft email prompt", or "write outbound emails".
---

# Email Prompt Builder

Build self-contained prompt templates for outreach. Each prompt encodes voice, research, value prop, proof points, and personalization rules. No external file references at runtime.

## Key Difference from Extruct

Extruct builds generic GTM prompts. Ours are grounded in:

1. **Your product-specific positioning** — key differentiators, competitive battlecard data
2. **Buying committee role → structural variant** — different email structure per role
3. **Pain segmentation framework** — pain categories map to P1 angles
4. **Signal engine data** — real-time trigger events for P1 hooks
5. **Confidence-scored proof points** — only use claims above 0.80 confidence

## Architecture

```
                    BUILD TIME (this skill)
                    ┌──────────────────────────────────────┐
campaign context ──▶│                                      │
hypothesis set ────▶│  Synthesize into self-contained      │──▶ prompt template (.md)
enrichment cols ───▶│  prompt with all logic baked in      │
signal data ───────▶│                                      │
                    └──────────────────────────────────────┘

                    RUN TIME (email-generation skill)
                    ┌──────────────────────────────────────┐
prompt template ───▶│                                      │
contact CSV ───────▶│  Generate emails per row             │──▶ emails CSV
                    └──────────────────────────────────────┘
```

## Inputs

| Input | What to Extract |
|-------|-----------------|
| Campaign context | Voice, sender, value prop, proof library, banned words, DNC |
| Hypothesis set | Numbered hypotheses with pain descriptions, evidence, messaging hooks |
| Enrichment columns | Available personalization and segmentation fields per account |
| Signal data | Recent trigger events for P1 hooks |
| Segmentation | Tier assignment determines treatment level |

## Output

```
campaigns/{campaign-slug}/prompts/first_email.md
campaigns/{campaign-slug}/prompts/follow_up.md
```

## Structural Variants (by Buying Committee Role)

### Variant A: Technical Evaluator (VP/Dir Data Eng, Staff/Sr Data Eng)

4 paragraphs, max 120 words.

- **P1:** Pain with concrete data point from enrichment. Reference specific signal if available. Use pain category language.
- **P2:** Product capability match. Lead with your key differentiators. Include specific number (e.g., a concrete product metric). Use email-safe value prop.
- **P3:** Low-friction CTA. "Worth a 15-minute look?" or "Want to see how it works on [their warehouse]?" Never "hop on a call."
- **P4 (PS):** Peer proof point from a similar company. Must pass three selection criteria.

### Variant B: Founder/CEO (small company, <200 employees)

3 paragraphs, max 90 words. No PS.

- **P1:** Pain tied to their stage or recent move (funding, scaling, etc.)
- **P2:** Value + proof merged. One product differentiator + one customer result.
- **P3:** CTA — direct and simple.

### Variant C: Executive/CDO/Board (delegates decisions)

2-3 paragraphs, max 70 words. Must be forwardable.

- **P1:** One sharp observation about their data challenge. Reference their company specifically.
- **P2:** One sentence value + CTA combined. "[Product] does X — worth forwarding to your team?"
- **P3 (optional):** Name-drop proof point only if it's a company they'd recognize (Fortune 500).

### Variant D: Peer (built something adjacent or competing)

2 paragraphs, max 60 words. Peer-to-peer tone.

- **P1:** Acknowledge shared context. No explaining basics.
- **P2:** Specific offer or observation. No product pitch.

### Follow-Up Email (all variants)

2 paragraphs, max 60 words. Different angle from first email.

- **P1:** Case study + different capability than first email + example.
- **P2:** Sector-shaped CTA (different ask than first email).
- Never say "following up," "circling back," or "checking in."

## Building the Prompt

### Step 1: Read All Upstream Data

Read campaign context, hypothesis set, enrichment column list, and signal data.

### Step 2: Synthesize (The Reasoning Step)

**Voice → from context:**
- Copy sender name, tone, constraints, banned words verbatim into prompt.
- Never invent voice rules.

**P1 → from hypotheses + signals + enrichment:**
- For each hypothesis, write a rich P1 template using:
  - The pain mechanism (WHY it hurts, not just THAT it hurts)
  - Specific data from market research
  - Signal data reference (if available for the account)
  - Enrichment field names for personalization
- NEVER use generic framing. Reference the company's actual situation.

**P2 → from context + differentiators:**
- Map each hypothesis to the best product differentiator:
  - {Pain category 1} → {Differentiator match}
  - {Pain category 2} → {Differentiator match}
  - {Pain category 3} → {Differentiator match}
  - {Pain category 4} → {Differentiator match (vs primary competitor)}
  - {Pain category 5} → {Differentiator match}

**P4 → from proof library (three-dimensional selection):**

| Criteria | Logic |
|----------|-------|
| Peer relevance | Proof company same size or larger than prospect |
| Hypothesis alignment | Proof validates same hypothesis as P1 |
| Non-redundancy | Stat not already used in P2 |

If no proof meets all three → drop P4 entirely (shorter variant).

**Competitive awareness:**
- If enrichment shows prospect uses a competitor: position as "addition to" not "replacement for"
- If prospect built a competing tool: Variant D or deprioritize

### Step 3: Assemble the Prompt Template

Write the `.md` file with all logic baked in:

```markdown
You are {sender} at {company}. {tone description}.

## Core Pain
{2-3 sentences from research about this vertical's data quality challenge}

## Hard Constraints
{voice rules from context — copied verbatim}

## Enrichment Data Fields
| Field | What It Tells You | How to Use |
|-------|-------------------|-----------|
| {field} | {meaning} | {use in email} |

## Hypothesis-Based P1 Rules
### If hypothesis_fit == "#1 Engineering Drain":
{Rich P1 template with mechanism, evidence, numbers}

### If hypothesis_fit == "#3 Coverage Gaps":
{Different P1 template}

## Structural Variant Selection
- If role == "champion" or "technical_evaluator" → Variant A (4P, 120 words)
- If role == "economic_buyer" and company_size < 200 → Variant B (3P, 90 words)
- If role == "economic_buyer" and company_size >= 200 → Variant C (2-3P, 70 words)

## P2 Value Angles (by hypothesis)
{Synthesized from differentiators, matched to hypothesis}

## P3 CTA Examples
{Campaign-specific, low-friction asks}

## P4 Proof Point Selection
{Proof points with conditions for when to use each}

## Output Format
Return JSON: {"recipient_name", "recipient_company", "subject", "body", "variant_used"}

## Banned Phrasing
{From context voice rules + campaign-specific additions}
```

### Step 4: Self-Containment Check

Before saving, verify:
- [ ] All voice rules from context (not invented)
- [ ] Structural variants defined with role-based selection
- [ ] P1 uses enrichment fields, not generic framing
- [ ] P2 uses email-safe value prop
- [ ] P4 proof points pass three criteria (or P4 dropped)
- [ ] Competitive awareness rules included
- [ ] No references to external files
- [ ] Banned words included
- [ ] Output format specified as JSON

## Output Consumers

- `email-generation` — runs this prompt per-row against contact CSV
- `email-response-simulation` — uses this prompt to understand what was intended
