---
name: email-generation
description: Generate personalized outreach emails by applying prompt templates to contact data. Tier-aware treatment with individual Tier 1 emails, hypothesis-templated Tier 2, and Tier 3 skipped. Includes quality validation for word count, banned words, and generic content. Use when generating emails, writing outreach, or creating personalized campaigns. Also use when producing email CSVs for campaign sending.
disable-model-invocation: true
---

# Email Generation

Apply a prompt template to a contact CSV to generate personalized outreach emails. Tier-aware treatment.

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Prompt template | `campaigns/{slug}/prompts/first_email.md` | Yes |
| Contact CSV | From email-search output | Yes |
| Segmentation | `campaigns/{slug}/segmentation.json` | Yes |
| Enrichment data | `campaigns/{slug}/accounts/*.json` | Yes |

## Output

```
campaigns/{campaign-slug}/emails/
  ├── tier1_emails.csv
  ├── tier2_emails.csv
  └── generation_report.md
```

## Workflow

### Step 1: Load Prompt + Contacts + Enrichment

- Read prompt template (self-contained, no external lookups needed)
- Read contact CSV (name, email, company, title, role, tier, hypothesis)
- Read enrichment data per account (merge into contact row)

### Step 2: Generate Tier 1 Emails (Individual)

For each Tier 1 contact:

1. Build full context row: contact data + all enrichment fields + signal data
2. Select structural variant based on role
3. Send to LLM with prompt template + context row
4. Validate output:
   - Word count within variant limit?
   - Subject line present?
   - No banned words?
   - Company name mentioned?
   - No generic filler ("I noticed your company...")?
5. Save to `tier1_emails.csv`

**Quality bar for Tier 1:** Each email must reference something specific to the company (trigger event, leader quote, hiring signal, or specific tech). If the LLM produces a generic email, flag it for re-generation with more context.

### Step 3: Generate Tier 2 Emails (Batched by Hypothesis)

Group Tier 2 contacts by hypothesis:

```
Hypothesis #1 group: 45 contacts
Hypothesis #3 group: 28 contacts
```

For each group:
1. Generate 3-5 example emails for spot-check
2. If examples pass quality check, generate the rest
3. Tier 2 emails are hypothesis-personalized (same P1 angle) but not individually researched
4. Still reference the company name and industry
5. Save to `tier2_emails.csv`

### Step 4: Skip Tier 3

Do not generate emails for Tier 3. Log them in the report.

### Step 5: Quality Validation

For all generated emails, check:

| Check | Threshold | Action if Failed |
|-------|-----------|-----------------|
| Word count | Within variant limit | Re-generate with stricter constraint |
| Banned words | Zero matches | Re-generate |
| Company name | Must appear | Re-generate |
| Subject line | Must exist, <60 chars | Re-generate |
| Generic detection | No "I noticed your company..." | Re-generate |
| CTA present | Must end with clear ask | Re-generate |
| P4 proof point | Passes 3 criteria or omitted | Adjust or remove P4 |

### Step 6: Output

**tier1_emails.csv:**
```csv
recipient_name,recipient_email,company,subject,body,variant,hypothesis,tier,status
Jane Smith,jsmith@lm.com,Lockheed Martin,"Data quality at scale","{email body}",A,#1,1,ready
```

**tier2_emails.csv:**
```csv
recipient_name,recipient_email,company,subject,body,variant,hypothesis,tier,status
Bob Jones,bjones@rtx.com,Raytheon,"Engineering time on data checks","{email body}",A,#1,2,ready
```

**generation_report.md:**
```markdown
## Email Generation Report: {Campaign}

**Generated:** {date}
**Tier 1:** {N} emails ({N} passed quality, {N} flagged)
**Tier 2:** {N} emails ({N} passed quality, {N} flagged)
**Tier 3:** {N} accounts skipped

### Quality Issues
- {N} emails re-generated due to banned words
- {N} emails re-generated due to generic content
- {N} emails flagged for manual review (competitive awareness)

### Variant Distribution
- Variant A (Technical): {N}
- Variant B (Founder): {N}
- Variant C (Executive): {N}
- Variant D (Peer): {N}
```

## Output Consumers

- `email-response-simulation` — reviews Tier 1 emails before sending
- `campaign-sending` — uploads approved emails to Instantly / personal email
