---
name: crm-sync
description: Write campaign results, contact data, and engagement metrics back to HubSpot or Salesforce. Use after campaign execution to sync lead status, engagement scores, and pipeline attribution data into CRM systems.
disable-model-invocation: true
---

# CRM Sync

Write campaign results and contact data back to HubSpot/Salesforce so pipeline attribution is complete and sales has full context.

## When to Use

- After campaign-sending completes a batch
- When enrichment data needs to flow into CRM contact records
- To update lead scores or lifecycle stages based on engagement
- To sync campaign performance metrics for reporting

## Inputs

1. **Campaign data** — from campaign-feedback skill output
2. **Contact records** — enriched contacts with engagement data
3. **Target CRM** — HubSpot (default) or Salesforce
4. **Sync mode** — create, update, or upsert

## Process

### 1. Validate Data
- Check required fields: email, company, campaign source
- Deduplicate against existing CRM records
- Flag conflicts for manual review

### 2. Map Fields
- Map your system fields to CRM properties
- Handle custom properties (create if missing in HubSpot)
- Apply data transformations (date formats, picklist values)

### 3. Execute Sync
- Batch API calls (100 records per batch for HubSpot)
- Track success/failure per record
- Retry failed records with exponential backoff

### 4. Verify
- Confirm record counts match expected
- Spot-check 3 random records for field accuracy
- Report sync summary

## Output

```markdown
## CRM Sync Report
- **Target:** HubSpot / Salesforce
- **Records synced:** X created, Y updated, Z failed
- **Campaign:** [campaign name]
- **Sync time:** [timestamp]
- **Failures:** [list with reasons]
```

## Safety

This skill has `disable-model-invocation: true` because it writes to external CRM systems. Always confirm with the user before executing. Never overwrite existing CRM data without explicit approval.

## Dependencies

- HubSpot MCP connection (or HubSpot API key)
- campaign-feedback skill output
- Contact records with email as primary key
