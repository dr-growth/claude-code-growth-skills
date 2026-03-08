---
name: campaign-feedback
description: Close the learning loop by importing campaign results (opens, replies, meetings), analyzing what worked, updating hypotheses and proof library, and writing learnings back to your knowledge graph. This is the skill that makes the GTM system compound over time. Use after a campaign has run for 1-2 weeks and has reply data, when retiring or promoting hypotheses, or when preparing for the next campaign iteration. Also use when the user says "campaign results", "feedback loop", "what worked", "update hypotheses", "campaign learning", "reply analysis", or "how did the campaign do".
---

# Campaign Feedback

Close the learning loop. Import results, analyze patterns, update the system. This is what makes the GTM system compound over time.

## Why This Matters

Without this skill, every campaign starts from scratch. With it:
- Hypotheses move from "Testing" to "Validated" or "Retired"
- Proof points that work get promoted; ones that don't get dropped
- Email structural variants get refined per persona
- Signal types that correlate with replies get weighted higher
- The system gets smarter every cycle

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Send log | `campaigns/{slug}/sends/send_log.json` | Yes |
| Reply data | Instantly export, Gmail, or manual | Yes |
| Meeting data | Calendar, HubSpot, or manual | Recommended |
| Campaign context | `campaigns/{slug}/context.md` | Yes |
| Hypothesis set | `campaigns/{slug}/hypothesis_set.md` | Yes |

## Workflow

### Step 1: Import Results

Collect metrics from all channels:

**Email (Instantly + personal):**
- Opens, clicks, replies, bounces
- Positive replies vs negative replies vs auto-replies
- Which emails got forwarded (sign of Variant C working)

**LinkedIn (HeyReach):**
- Connection acceptance rate
- Message reply rate
- Profile view rate

**Phone (Nooks):**
- Connect rate, conversation rate
- Meeting booked rate

**Downstream:**
- Meetings booked (from HubSpot or calendar)
- Opportunities created (from Salesforce)
- Pipeline value generated

### Step 2: Analyze by Hypothesis

For each hypothesis in the campaign:

```markdown
### Hypothesis #{N}: {Name}

**Accounts targeted:** {N}
**Emails sent:** {N}
**Open rate:** {X%}
**Reply rate:** {X%}
**Positive reply rate:** {X%}
**Meetings booked:** {N}

**Verdict:** {Validated / Testing / Retired}
**Reasoning:** {Why — e.g., "3.2% positive reply rate, 2 meetings booked, both cited engineering time as pain"}

**Best performing P1 angle:** {which specific pain framing got replies}
**Worst performing:** {which didn't work}
```

### Step 3: Analyze by Structural Variant

```markdown
### Variant Performance

| Variant | Sent | Replies | Reply Rate | Notes |
|---------|------|---------|-----------|-------|
| A (Technical) | {N} | {N} | {X%} | {observation} |
| B (Founder) | {N} | {N} | {X%} | {observation} |
| C (Executive) | {N} | {N} | {X%} | {observation} |
| D (Peer) | {N} | {N} | {X%} | {observation} |
```

### Step 4: Analyze by Tier

```markdown
### Tier Performance

| Tier | Sent | Replies | Reply Rate | Meetings | Cost per Meeting |
|------|------|---------|-----------|----------|-----------------|
| 1 (Personal) | {N} | {N} | {X%} | {N} | ~${X} |
| 2 (Instantly) | {N} | {N} | {X%} | {N} | ~${X} |
```

### Step 5: Update Campaign Context

**Update Active Hypotheses:**
- Move hypotheses with >2% positive reply rate to "Validated"
- Move hypotheses with <0.5% positive reply rate to "Retired"
- Keep others in "Testing" with notes

**Update Proof Library:**
- Proof points cited in positive replies → promote (add "validated by campaign X")
- Proof points in emails with 0 replies → flag for review
- New proof points from reply content → add to library

**Update Campaign History:**
- Add row to Campaign History table with final metrics

### Step 6: Write Learnings to your knowledge graph

Persist learnings so they survive across campaigns:

```python
# ctx = YourKnowledgeGraphClient()

# Write learnings back to your knowledge graph
# ctx.add_memory({
#     "messages": [{"role": "user", "content":
#         f"Campaign {campaign_name}: Hypothesis '{hypothesis_name}' VALIDATED. "
#         f"Reply rate: {rate}%. Best P1: {best_angle}. "
#         f"Vertical: {vertical}. Date: {date}."
#     }],
#     "group_id": "your-org",
# })

# Write learnings back to your knowledge graph
# ctx.add_memory({
#     "messages": [{"role": "user", "content":
#         f"Campaign {campaign_name}: Hypothesis '{hypothesis_name}' RETIRED. "
#         f"Reason: {reason}. Reply rate: {rate}%."
#     }],
#     "group_id": "your-org",
# })

# Write learnings back to your knowledge graph
# ctx.add_memory({
#     "messages": [{"role": "user", "content":
#         f"Email insight: Variant {variant} performs {better/worse} for {persona}. "
#         f"Data: {N} sent, {rate}% reply rate. Campaign: {campaign_name}."
#     }],
#     "group_id": "your-org",
# })
```

### Step 7: Update Signal Scoring Weights

If certain signal types correlate with replies:

```markdown
### Signal-to-Reply Correlation

| Signal Type | Accounts with Signal | Reply Rate | Baseline Reply Rate | Lift |
|-------------|---------------------|-----------|-------------------|------|
| data_engineering_hiring | {N} | {X%} | {Y%} | {+Z%} |
| technology_adoption | {N} | {X%} | {Y%} | {+Z%} |
| contract_award | {N} | {X%} | {Y%} | {+Z%} |
```

Feed this back to the confidence scoring as weight adjustments.

### Step 8: Generate Feedback Report

```markdown
# Campaign Feedback Report: {Campaign Name}

**Date:** {date}
**Duration:** {start} to {end}

## Summary
- **Total sent:** {N} (Tier 1: {N}, Tier 2: {N})
- **Total replies:** {N} ({X%} reply rate)
- **Positive replies:** {N} ({X%})
- **Meetings booked:** {N}
- **Pipeline generated:** ${X}

## Key Learnings
1. {Most important learning}
2. {Second learning}
3. {Third learning}

## Hypothesis Updates
- Validated: {list}
- Retired: {list}
- Still testing: {list}

## Recommendations for Next Campaign
1. {Specific recommendation}
2. {Specific recommendation}

## System Updates Made
- Campaign context updated: {yes/no}
- Proof library updated: {yes/no}
- your knowledge graph updated: {yes/no}
- Signal weights updated: {yes/no}
```

Save to `campaigns/{campaign-slug}/feedback/report.md`.

## The Compounding Effect

After N campaigns, the system has:
- Validated hypotheses ranked by reply rate
- Proof points ranked by effectiveness
- Structural variants optimized per persona
- Signal types weighted by reply correlation
- Rich campaign history for pattern detection

This is the moat. Each campaign makes the next one better.

## Output Consumers

- `context-building` (Mode 3) — updates context with results
- `hypothesis-building` — reads validated/retired status for new campaigns
- `email-prompt-building` — uses validated patterns for future prompts
- `list-segmentation` — updated signal weights improve tiering
