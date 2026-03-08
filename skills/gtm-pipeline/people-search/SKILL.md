---
name: people-search
description: Find decision makers at target accounts and map them to buying committee roles (Champion, Economic Buyer, Technical Evaluator, Blocker). Uses HubSpot, account researcher, Clay, LinkedIn, and ZoomInfo. Use when finding contacts at target accounts, building buying committees, or identifying decision makers. Also use when searching for people to target or mapping org charts.
disable-model-invocation: true
---

# People Search

Find decision makers at target accounts and map them to buying committee roles.

## Key Difference from Extruct

Extruct finds LinkedIn profiles via their people index. We map contacts to buying committee roles:

| Role | Title Pattern | Why They Matter |
|------|--------------|-----------------|
| **Champion** | VP/Dir Data Engineering | Owns the problem. Drives internal eval. |
| **Economic Buyer** | CTO, CPO, CDO | Signs the check. Needs ROI framing. |
| **Technical Evaluator** | Sr/Staff Data Engineer | Tests the product. Needs technical proof. |
| **Blocker** | Existing tool owner | Can kill the deal. Need to neutralize. |

## Role Coverage

Some roles should have multiple contacts:
- **Champion:** Primary + 1 backup (champions leave companies)
- **Technical Evaluator:** 1-2 (depends on org size — large orgs have platform teams)
- **Economic Buyer:** Usually 1 (VP/SVP level)
- **Blocker:** Identify but don't over-research — 1 is enough

## Source Priority (When Data Conflicts)

When multiple sources disagree on a contact's title/role/email:
1. HubSpot (if contact updated in last 30 days) — most current
2. Account researcher (deep research) — most contextual
3. Clay enrichment — broadest coverage
4. LinkedIn public profile — most self-reported accurate for title
5. ZoomInfo — most authoritative for firmographic data

Use the most recent data. If titles conflict, prefer the source that shows the person's LinkedIn activity most recently.

## Sources (Priority Order)

1. **HubSpot CRM** — existing contacts with engagement history (warmest)
2. **Account Researcher** — buying committee research from agent output
3. **Clay** — waterfall contact enrichment (LinkedIn + email + phone)
4. **LinkedIn** (manual or via HeyReach) — profile discovery
5. **ZoomInfo** — gated, for Tier 1 accounts only

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Account list | `campaigns/{slug}/accounts/*.json` | Yes |
| Segmentation | `campaigns/{slug}/segmentation.json` | Recommended |
| Account research | `cache/{company-slug}/account-researcher-*.md` | If available |

## Output

```
campaigns/{campaign-slug}/contacts/{company-slug}-contacts.json
```

```json
{
  "company": "Lockheed Martin",
  "contacts": [
    {
      "name": "Jane Smith",
      "title": "VP Data Engineering",
      "role": "champion",
      "linkedin": "https://linkedin.com/in/janesmith",
      "email": "jsmith@lockheedmartin.com",
      "email_verified": true,
      "phone": null,
      "source": "clay",
      "notes": "Posted about Snowflake migration challenges on LinkedIn"
    },
    {
      "name": "John Doe",
      "title": "CTO",
      "role": "economic_buyer",
      "linkedin": "https://linkedin.com/in/johndoe",
      "email": null,
      "email_verified": false,
      "source": "hubspot",
      "notes": "Attended company webinar in Jan 2026"
    }
  ]
}
```

## Workflow

### Step 1: Prioritize by Tier

- **Tier 1:** Find all 3 buying committee roles (Champion + Economic + Technical)
- **Tier 2:** Find Champion only (primary target for hypothesis-matched email)
- **Tier 3:** Skip people search (accounts on hold)

### Step 2: Check Existing Sources

For each account:

1. **HubSpot:** Query for existing contacts at company domain
2. **Research cache:** Check `cache/{slug}/account-researcher-*.md` for buying committee section
3. **Previous campaigns:** Check if contacts exist from prior campaigns

### Step 3: Enrich Missing Contacts

For contacts not found in existing sources:

**Clay waterfall enrichment:**
- Input: company name + domain + target title patterns
- Output: name, title, LinkedIn URL, email, phone
- Clay uses waterfall (multiple providers) for highest match rate

**LinkedIn search patterns:**
- Champion: "{Company} Director Data Engineering" OR "VP Data"
- Economic Buyer: "{Company} CTO" OR "Chief Data Officer"
- Technical Evaluator: "{Company} Staff Data Engineer" OR "Senior Data Engineer"

### Step 4: Verify Emails

For Tier 1 contacts, verify email deliverability before sending:
- Use email validation (EVA free tier or paid provider)
- Flag unverified emails — don't send without verification

### Step 5: Map to Structural Variants

Each contact gets an email structural variant assignment:

| Role | Structural Variant | Max Words |
|------|-------------------|-----------|
| Champion (VP/Dir) | Variant A: Technical Evaluator | 120 |
| Economic Buyer (CTO/CDO) | Variant C: Executive | 70 |
| Technical Evaluator (Staff/Sr) | Variant A: Technical Evaluator | 120 |
| Founder/CEO (small co) | Variant B: Founder | 90 |

### Step 6: Save and Report

```markdown
## Contact Search Summary: {Campaign}

**Tier 1 accounts:** {N} → {N} contacts found ({N} with verified email)
**Tier 2 accounts:** {N} → {N} champions found ({N} with verified email)

### Coverage
- Accounts with Champion: {N}/{total} ({%})
- Accounts with Economic Buyer: {N}/{total}
- Accounts with verified email: {N}/{total}

### Gaps
- {N} Tier 1 accounts missing Champion contact
- {N} contacts without verified email
```

## Output Consumers

- `email-prompt-building` — contact roles determine structural variant
- `email-generation` — contacts provide recipient data for personalization
- `campaign-sending` — contacts with verified emails uploaded to Instantly
