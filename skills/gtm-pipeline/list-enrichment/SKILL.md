---
name: list-enrichment
description: Execute enrichment columns against account lists using signal engine, Clay, account researcher, HubSpot, and ZoomInfo. Routes each column to the cheapest backend and populates data per account. Use when enriching account lists, running enrichment, or populating data columns. Also use when researching accounts in bulk or filling firmographic and technographic data points.
disable-model-invocation: true
---

# List Enrichment

Execute enrichment columns against account lists. Takes column configs from enrichment-design and populates data per account using the appropriate backend.

## Key Difference from Extruct

Extruct runs all enrichment through their AI Tables API (1 credit/cell). We route to the cheapest/best backend for each column type:

| Backend | Cost | Best For |
|---------|------|----------|
| Signal engine | Free | Hiring, news, SEC, gov contracts |
| HubSpot MCP | Free | Past engagement, lifecycle stage |
| Gong (Snowflake) | Free | Call insights, objections |
| Account researcher | Tokens only | Deep custom research |
| Clay | Credits | Tech stack, company research |
| ZoomInfo | Gated | Authoritative firmographics |

Free sources run first. Paid sources only for gaps.

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Column configs | From `enrichment-design` output | Yes |
| Account list | `campaigns/{slug}/accounts/*.json` | Yes |
| Campaign context | `campaigns/{slug}/context.md` | Recommended |

## Output

Updated account JSONs with enrichment data:

```
campaigns/{campaign-slug}/accounts/{company-slug}.json
```

Each account JSON gets an `enrichment` key added:

```json
{
  "name": "Lockheed Martin",
  "domain": "lockheedmartin.com",
  "enrichment": {
    "de_headcount": {"value": 4, "source": "clay", "date": "2026-03-05"},
    "platform_complexity": {"value": "Complex (multi-cloud)", "source": "clay", "date": "2026-03-05"},
    "current_dq": {"value": "None visible", "source": "clay", "date": "2026-03-05"},
    "trigger_event": {"value": "Awarded $2.1B USAF data modernization contract", "source": "signal_engine", "date": "2026-03-05"},
    "fit_engineering_drain": {"value": 4, "source": "clay", "date": "2026-03-05"}
  }
}
```

## Workflow

### Step 1: Load Column Configs and Accounts

Read column configs (from enrichment-design output) and account list.

### Step 2: Route Columns to Backends

Group columns by backend:

```
signal_engine_columns = [cols where backend == "signal_engine"]
clay_columns = [cols where backend == "clay"]
researcher_columns = [cols where backend == "account_researcher"]
hubspot_columns = [cols where backend == "hubspot"]
zoominfo_columns = [cols where backend == "zoominfo"]
```

### Step 3: Execute Free Sources First

**Signal Engine:**
- Check if signals already exist in `campaigns/{slug}/accounts/{slug}-signals.json`
- If not, run `SignalEngine.scan_account()` for each account
- Map signal data to column values (e.g., hiring signals → DE headcount estimate)

**HubSpot MCP:**
- Query HubSpot for company engagement data
- Map to relevant columns (past engagement, lifecycle stage)

**Gong (Snowflake):**
- Query for call transcripts involving the account
- Extract relevant insights for enrichment columns

### Step 4: Execute Paid Sources for Gaps

**Clay:**
- For each account + clay column, run Clay AI research
- Batch where possible (Clay supports batch operations)

**ZoomInfo:**
- Only triggered if SynthesisTrigger evaluates as `auto` or `review`
- For high-value accounts needing authoritative firmographic data

**Account Researcher:**
- For deep custom research questions that other backends can't answer
- Run as Claude Code agent subprocess

### Step 5: Update Account JSONs

Write enrichment data back to account JSON files.

### Step 6: Quality Check

For each account, report:

```
{company}: {N}/{total} columns populated
  Missing: {column_names where value is null or "Unknown"}
```

If >30% of columns are missing for an account, flag it for re-enrichment or different backend.

### Step 7: Summary

```markdown
## Enrichment Summary

- **Accounts enriched:** {N}
- **Columns per account:** {N}
- **Completion rate:** {X}% of cells populated
- **By backend:** signal_engine: {N}, clay: {N}, hubspot: {N}, researcher: {N}
- **Accounts with gaps:** {list of accounts with <70% completion}
- **Estimated cost:** signal_engine: $0, clay: ~${N}, zoominfo: ~${N}
```

## Cost Optimization

1. **Signal engine first** — free, already running for campaign monitoring
2. **HubSpot/Gong second** — free, uses existing MCP connections
3. **Clay third** — credits, but powerful for custom research
4. **ZoomInfo last** — gated, only for high-value accounts
5. **Account researcher** — token cost, use for questions no other backend answers

Target: 60%+ of enrichment cells filled by free sources.

## Rate Limits & Batching

| Backend | Rate Limit | Batch Size | Retry |
|---------|-----------|------------|-------|
| Signal Engine | Unlimited | N/A (real-time) | N/A |
| HubSpot MCP | 100 calls/10 sec | 100 contacts | Exponential backoff |
| Clay | 100 requests/min | 100 contacts | Wait + retry |
| ZoomInfo | Plan-dependent (check admin) | 25 contacts | Exponential backoff |
| Account Researcher | N/A (token-limited) | 1 account (deep) | N/A |

Batch strategy: Process free sources for ALL accounts first, then batch paid sources in chunks. Never run Clay and ZoomInfo in parallel — sequential to avoid credit waste on duplicates.

## Output Consumers

- `list-segmentation` — uses enriched data for Tier 1/2/3 assignment
- `email-prompt-building` — knows which data fields are available
- `email-generation` — uses enrichment values for personalization
