---
name: campaign-sending
description: Upload approved outreach emails to sending platforms (personal email, Instantly, HeyReach, Nooks). Handles DNC checks, email verification, tier-matched channel routing, and send logging. Use when launching outreach campaigns, uploading to Instantly, or deploying multi-channel sequences. Also use when sending emails, scheduling SDR handoffs, or creating Instantly campaigns.
disable-model-invocation: true
---

# Campaign Sending

Upload approved emails to sending platforms. Different channels per tier.

## Key Difference from Extruct

Extruct sends everything through Instantly. We use tier-matched channels:

| Tier | Email Channel | LinkedIn Channel | Phone Channel |
|------|-------------|-----------------|---------------|
| **Tier 1** | Your personal email (your-email@company.com) | Your LinkedIn (manual or HeyReach) | Nooks parallel dialer |
| **Tier 2** | Instantly sequence | HeyReach (team accounts) | SDR team via Nooks |
| **Tier 3** | Not sent | Not sent | Not sent |

## Channel Strategy

### Personal Email (Tier 1)

- Highest deliverability (established sender reputation)
- Most authentic (comes from a real person the prospect can Google)
- Best for: Champions and Economic Buyers at Tier 1 accounts
- Volume: 5-15 emails per day max (preserve reputation)
- Tool: Gmail API or direct send (not via sequencing platform)

### Instantly (Tier 2)

- Email warming, rotation, and scheduling
- Multi-step sequences (first email → follow-up)
- Analytics: opens, clicks, replies
- Volume: 50-200 per day across warmed inboxes
- API for programmatic campaign creation and lead upload

### HeyReach (LinkedIn)

- Multi-account LinkedIn automation
- Connection requests + messages
- Team collaboration (assign SDRs to accounts)
- Sync with email sequences for multi-channel

### Nooks (Phone)

- Parallel dialing for SDR team
- AI research on prospects before call
- Existing tool — your SDR team already using it
- Best for: Tier 1 follow-ups, Tier 2 hot leads (replied)

## Channel Fallback Logic

When the primary channel is unavailable for a contact:

1. Email available → Use tier-matched email channel
2. No email, LinkedIn available → HeyReach connection request
3. No email, no LinkedIn → Phone via Nooks (if Tier 1)
4. No contact info → Skip, flag for manual research

Never send to a channel where the contact hasn't been verified.

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Approved emails | `campaigns/{slug}/emails/tier{N}_emails.csv` | Yes |
| Campaign context | `campaigns/{slug}/context.md` | For DNC check |
| Simulation results | `campaigns/{slug}/reviews/` | For Tier 1 |

## Pre-Send Checks

Before uploading ANYTHING:

1. **DNC check:** Remove any contact whose domain is on the DNC list
   - DNC sources:
     - Customer list: Salesforce "Customer" accounts (query via HubSpot MCP)
     - Bounce list: Prior campaign bounces from Instantly analytics
     - Opt-out list: Unsubscribe records from email platforms
     - Manual DNC: `campaigns/shared/dnc-manual.csv` (manually maintained)
2. **Customer check:** Remove any contact at an existing customer
3. **Duplicate check:** No contact should receive the same campaign twice
4. **Email verification:** Only send to `valid` or `risky` (Tier 1 only) emails
5. **Simulation gate:** Tier 1 emails must score 3.5+ in simulation
6. **Your approval:** First campaign of each type requires manual approval

## Workflow

### Step 1: Pre-Send Validation

Run all checks above. Output:

```markdown
## Pre-Send Report

**Tier 1:** {N} emails ready, {N} blocked
- DNC blocked: {N}
- Customer blocked: {N}
- Email invalid: {N}
- Simulation failed: {N}

**Tier 2:** {N} emails ready, {N} blocked
- DNC blocked: {N}
- Customer blocked: {N}
- Email invalid: {N}
```

### Step 2: Tier 1 — Personal Email

For each approved Tier 1 email:

1. Format email for Gmail (plain text, your signature)
2. Schedule send (spread across morning hours, not all at once)
3. Log send: recipient, subject, timestamp, email body hash
4. Track in campaign tracking database

**Sending schedule:**
- 3-5 emails between 8-10 AM recipient's timezone
- Space at least 15 minutes apart
- Never send on weekends

### Step 3: Tier 2 — Instantly Campaigns

Create Instantly campaign via API:

1. Create campaign with name: `{campaign-slug}-tier2-{hypothesis}`
2. Upload leads with required fields:
   - email, first_name, last_name, company_name
   - Custom fields: hypothesis, hook, variant
3. Set sequence:
   - Step 1: First email (day 0)
   - Step 2: Follow-up (day 3-5)
4. Set sending limits: max 50/day per inbox
5. Enable email warming

### Step 4: LinkedIn Outreach (Optional)

For Tier 1 accounts where LinkedIn is the better channel:

1. Send connection request with personalized note (< 300 chars)
2. If connected, send InMail with Variant C or D structure
3. Coordinate timing: LinkedIn first, email follow-up 2 days later

### Step 5: SDR Handoff (Nooks)

For Tier 1 accounts that need phone follow-up:

1. Export contact list with talking points
2. Assign to SDR in Nooks
3. Talking points include: hypothesis, trigger event, suggested opener
4. SDR calls 2-3 days after email (give time to read)

### Step 6: Log Everything

Save send log:

```
campaigns/{campaign-slug}/sends/
  ├── send_log.json       (every send with timestamp)
  ├── instantly_campaign.json  (Instantly campaign IDs)
  └── send_report.md      (summary)
```

```json
{
  "sends": [
    {
      "recipient": "jsmith@lm.com",
      "company": "Lockheed Martin",
      "channel": "personal_email",
      "tier": 1,
      "timestamp": "2026-03-06T09:15:00Z",
      "subject": "Data quality at scale",
      "hypothesis": "#1",
      "variant": "A",
      "status": "sent"
    }
  ]
}
```

## Progressive Autonomy for Sending

| Week | Approval Level |
|------|---------------|
| 1-4 | You approve every send |
| 5-8 | You approve Tier 1, Tier 2 auto-sends after 24h review window |
| 9-12 | Tier 2 auto-sends, you spot-check weekly |
| 13+ | All auto-send except flagged (competitive, large account, unusual) |

## Output Consumers

- `campaign-feedback` — reads send logs + reply data for learning loop
- `context-building` (Mode 3) — campaign results update context file
