---
name: email-response-simulation
description: Simulate a skeptical buyer reading your outreach email before sending. Builds the prospect's world from enrichment data and your persona context, evaluates the email through their eyes, and flags issues. Quality gate for Tier 1 emails. Use after email-generation produces drafts, when you want to stress-test an email against a specific persona, or when reply rates are dropping and you need to diagnose why. Also use when the user says "simulate response", "review email", "buyer simulation", "skeptical review", "email quality check", or "would this email work".
---

# Email Response Simulation

Simulate a skeptical buyer reading your email before you send it. Quality gate for Tier 1 emails.

## Key Difference from Extruct

Extruct builds prospect "worlds" from LinkedIn research at runtime. We use:

1. **Your persona context** — pre-built buyer personas with known pain points, objectives, objections
2. **Account planning research** — deep company context if available from prior research
3. **Enrichment data** — company-specific signals and data points
4. **Objection handlers** — pre-built responses from your knowledge base

This means our simulation is grounded in REAL objection patterns from actual sales cycles.

## When to Use

- **Always** for Tier 1 emails before sending
- **Spot-check** 5-10 Tier 2 emails per hypothesis group
- **Never** for Tier 3 (not sending those)

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Email to review | From `email-generation` output | Yes |
| Contact info | Contact JSON (name, title, company) | Yes |
| Enrichment data | Account enrichment JSON | Recommended |
| Campaign context | `campaigns/{slug}/context.md` | Recommended |
| Persona context | Your persona query | Recommended |

## Simulation Process

### Phase 1: Build the Prospect's World

Construct what this person cares about, knows, and is skeptical of.

**From your persona templates:**
```python
# Import your knowledge graph client
# ctx = YourKnowledgeGraphClient()
# Replace with your knowledge graph queries
# personas = ctx.query_personas()
# Match contact role to closest persona
```

**From enrichment data:**
- Company size, industry, tech stack
- Current DQ tooling (competitor in use?)
- Recent trigger events
- Hypothesis fit scores

**From account planning research (if available):**
- Company overview, pain hypotheses
- Buying committee context
- Known challenges

**Construct the prospect profile:**

```markdown
## Prospect Profile: {Name}, {Title} at {Company}

**Daily reality:**
- Reports to: {likely reporting structure}
- KPIs: {what they're measured on}
- Current pain: {from enrichment + hypothesis}
- Tools they use: {tech stack from enrichment}
- Recent context: {trigger events}

**What they're skeptical of:**
- Cold emails from vendors (default skepticism: HIGH)
- Claims without proof (data leaders are analytical)
- "AI-powered" anything (overused term)
- Products that require ripping out existing tools

**What would get their attention:**
- Specific reference to their company situation
- Peer proof (similar company, similar challenge)
- Low-friction ask (not "30 min demo")
- Technical credibility (shows understanding of their stack)

**Known objections (from your battlecards):**
{Pull from your objection handlers}
```

### Phase 2: Read the Email as the Prospect

Walk through the email paragraph by paragraph:

**P1 (Opener):**
- Would this stop them from deleting? (Yes/No)
- Is the pain statement specific to THEIR company? (Yes/No)
- Would they think "this person did their homework"? (Yes/No)
- Does it reference something they'd recognize? (Yes/No)
- Red flags: generic opener, flattery, incorrect assumption

**P2 (Value):**
- Does this explain what your product does clearly? (Yes/No)
- Is it relevant to their specific pain? (Yes/No)
- Would they understand it in 10 seconds? (Yes/No)
- Red flags: too much jargon, too many claims, no specificity

**P3 (CTA):**
- Is this a reasonable ask? (Yes/No)
- Would they actually do this? (Yes/No)
- Red flags: "hop on a call", "30 minutes", meeting request

**P4 (Proof, if present):**
- Is the proof company a peer they'd respect? (Yes/No)
- Is the claim specific enough to be believable? (Yes/No)
- Red flags: citing a much smaller company, vague claims

### Phase 3: Score and Recommend

**Scoring dimensions (1-5 each):**

| Dimension | What It Measures |
|-----------|-----------------|
| Relevance | Would this person care about the pain described? |
| Specificity | Does this feel researched or templated? |
| Credibility | Would they believe the claims? |
| CTA quality | Would they actually respond? |
| Voice fit | Does it match the tone they'd expect from the sender? |

**Overall verdict:**
- **4.0+ average:** Send as-is
- **3.0-3.9:** Minor edits recommended (specify what to fix)
- **2.0-2.9:** Major rewrite needed (specify the problems)
- **Below 2.0:** Do not send. Wrong angle or wrong target.

### Phase 4: Suggest Improvements

If score < 4.0, provide specific rewrites:

```markdown
## Simulation Result: {Recipient Name} at {Company}

**Verdict:** {Send / Edit / Rewrite / Do Not Send}
**Score:** {X.X}/5.0

### What Worked
- {specific thing that would resonate}

### What Didn't
- P1: {specific issue — e.g., "pain statement too generic, doesn't reference their Snowflake migration"}
- P2: {specific issue}

### Suggested Rewrite
{If score < 4.0, provide a revised version with explanations}

### Objection Risk
- Most likely objection: "{from objection handlers}"
- Pre-emptive: "{how the email could address this}"}
```

## Batch Review Mode

For Tier 2 spot-checks (5-10 emails per hypothesis group):

1. Pick the 5 most diverse companies in the group (different sizes, sub-verticals)
2. Run simulation on each
3. If 4/5 score 3.5+, the hypothesis template is good — proceed with batch
4. If 2+ score below 3.0, revise the prompt template and re-generate the group

## Output

```
campaigns/{campaign-slug}/reviews/
  ├── {company-slug}-review.md  (per Tier 1 email)
  └── tier2-spot-check.md       (batch review summary)
```

## Output Consumers

- `email-generation` — re-generates emails flagged for rewrite
- `campaign-sending` — only sends emails that pass simulation (3.5+)
- `campaign-feedback` — simulation scores become training data for prompt improvement
