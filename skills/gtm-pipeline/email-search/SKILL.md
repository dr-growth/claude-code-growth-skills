---
name: email-search
description: Find and verify email addresses and phone numbers for contacts using Clay waterfall enrichment, ZoomInfo, and email validation. Use when finding emails for outreach contacts, verifying email deliverability, or enriching phone numbers. Also use when preparing contact data for campaign sending or checking email validity.
disable-model-invocation: true
---

# Email & Contact Search

Find verified email addresses and phone numbers for contacts identified by people-search.

## Key Difference from Extruct

Extruct uses Prospeo or Fullenrich. We use:

1. **Clay** (MCP connected) — waterfall enrichment across 50+ data providers
2. **ZoomInfo** — gated by SynthesisTrigger, for Tier 1 accounts
3. **HubSpot** — existing contacts already have emails
4. **Email validation** — EVA (free) for pre-send verification

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Contact list | `campaigns/{slug}/contacts/*.json` | Yes |
| Segmentation | `campaigns/{slug}/segmentation.json` | For prioritization |

## Output

Updated contact JSONs with verified email and phone data.

## Workflow

### Step 1: Audit Existing Data

For each contact, check what we already have:
- Email from HubSpot → already verified (CRM source)
- Email from Clay → needs verification
- Email from account research → needs verification
- No email → needs enrichment

### Step 2: Enrich Missing Emails

**Priority order:**
1. Clay waterfall (highest match rate, uses 50+ providers)
2. ZoomInfo (Tier 1 only, most accurate)
3. LinkedIn email (if visible on profile)

### Step 3: Verify All Emails

Before any email is marked sendable:

**Free validation (EVA):**
- Check syntax, MX records, disposable domain
- Catch-all detection
- Result: valid / invalid / risky / unknown

**Verification thresholds:**
- `valid` → safe to send
- `risky` → send to Tier 1 only (personal email, higher deliverability)
- `invalid` → do not send
- `unknown` → treat as risky

### Step 4: Phone Number Enrichment (Optional)

For Tier 1 accounts where Nooks outreach is planned:
- Clay phone enrichment
- ZoomInfo direct dial

### Step 5: Update Contact JSONs

Add email verification status to each contact:

```json
{
  "email": "jsmith@company.com",
  "email_verified": true,
  "email_status": "valid",
  "email_source": "clay",
  "phone": "+1-555-0123",
  "phone_source": "zoominfo"
}
```

### Step 6: Export for Campaign Sending

Generate campaign-ready CSV:

```csv
first_name,last_name,email,company,title,role,tier,hypothesis,hook,variant
Jane,Smith,jsmith@company.com,Lockheed Martin,VP Data Engineering,champion,1,#1,Data modernization contract,A
```

## Output Consumers

- `email-generation` — recipient data for email generation
- `campaign-sending` — verified contacts uploaded to Instantly / personal email
