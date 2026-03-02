# DeFiDisco Continuous Monitoring Service

## Overview

The DeFiDisco Monitor is a standalone background service that continuously watches DeFi protocols for smart contract changes, refreshes live financial data, and compiles publishable review artifacts.

It runs as a Digital Ocean App Platform **worker** (no HTTP port), backed by PostgreSQL (currently Neon free tier), and is triggered hourly.

### What it does

1. **Discovery** — Runs the L2Beat discovery engine on all DeFi projects listed in `defidisco-config.json`
2. **Diffing** — Compares results against the previous discovery stored in PostgreSQL
3. **Notification** — Sends Discord messages when contract changes are detected
4. **Funds Refresh** — Fetches live token balances and DeFi positions via DeBank API
5. **Review Compilation** — Produces a self-contained `compiled-review.json` per project, ready for D1 ingestion
6. **Cycle Summary** — Posts a Discord summary after every cycle (with change count and duration)

### What it does NOT do (researcher actions)

- Re-run call graph analysis (Slither)
- Re-run permission detection (AI or manual)
- Modify permission overrides, function scores, or review descriptions
- Push compiled reviews to D1 (deferred to a future task)

---

## Architecture

### Entry Point

`packages/backend/src/defidisco-monitor.ts` — process entry point that creates the config, application, and handles signals.

### Key Files

| File | Purpose |
|------|---------|
| `defidisco-monitor.ts` | Process entry point |
| `defidisco/monitorConfig.ts` | Standalone config from env vars (does not use full `makeConfig()`) |
| `defidisco/DefidiscoMonitorApplication.ts` | Main orchestrator — wires everything, runs the hourly loop |
| `defidisco/FundsRefresher.ts` | Wraps existing `fetchAllFundsForProject` from l2b |
| `defidisco/ReviewCompiler.ts` | Reads all project data files, computes v2 score, resolves templates, writes JSON |

### Reused Infrastructure

The monitor reuses these existing L2Beat/DeFiDisco modules without modification:

- **DiscoveryRunner** — contract analysis engine
- **UpdateNotifier** — Discord notification with throttling
- **DiscordClient** — Discord API wrapper (both PUBLIC and INTERNAL channels point to the same channel)
- **Clock** — hourly timer
- **createDiscoveryRunner** — factory that sets up providers, cache, template service
- **sanitizeDiscoveryOutput** / **diffDiscovery** — normalize and compare discoveries
- **fetchAllFundsForProject** — batch funds fetching via defiscan-endpoints
- **calculateV2Score** — V2 scoring engine with capital analysis

### Monitoring Loop

```
Every hour (Clock.onNewHour):
  For each project in defidisco-config.json:
    1. Discovery: runner.run(config, timestamp)
    2. Diff: diffDiscovery(sanitize(prev), sanitize(curr))
    3. Notify: if diff → Discord message via UpdateNotifier
    4. Store: db.updateMonitor.upsert(discovery snapshot)
    5. Funds: fetchAllFundsForProject → updates funds-data.json on disk
    6. Compile: ReviewCompiler.compile() → writes compiled-review.json
  After all projects:
    Post cycle summary to Discord (project count, duration, changes)
```

### Pre-Compilation Guards

Before compiling a review, the compiler checks for required data files. If missing, it skips compilation silently (log only, no Discord notification):

| Guard | Missing File | Behavior |
|-------|-------------|----------|
| No review config | `review-config.json` | Skipped — run `/generate-review` or create manually |
| No call graph | `call-graph-data.json` | Skipped — run call graph generation in the UI |

Discovery + diff + funds refresh still run regardless. Only the compilation step is gated.

---

## Compiled Review Schema

### Design Principle

The compiled review is **the exact data a frontend needs to render a protocol review page**. It joins V2 scoring data (contracts, functions, admins, dependencies, capital analysis) with human-written descriptions from `review-config.json`, resolves template variables, and produces a single self-contained JSON file.

### Data Sources → Compiled Fields

| Compiled Section | Source | Content |
|-----------------|--------|---------|
| `metadata` | `review-config.json` | Protocol name, chain, type, description |
| `totals` | V2 scoring (computed) | Aggregate counts and capital figures |
| `admins` | V2 scoring + `review-config.json` admins | Per-admin: type, functions, capital at risk, description |
| `dependencies` | V2 scoring + `review-config.json` dependencies | Per-dependency: entity, functions, description |
| `funds` | `funds-data.json` + `review-config.json` funds | Per-contract: balances, positions, description |
| `functions` | V2 scoring | Permissioned functions with impact scores |
| `contracts` | `contract-tags.json` | All contracts with external/governance/entity tags |
| `sections` | `review-config.json` sections | Code & Audits, free-form content |

### Template Variable Resolution

Review descriptions use `{{variableName}}` placeholders. The `dataKeys` map in `review-config.json` binds variable names to data paths:

```json
{
  "dataKeys": {
    "wethActivePoolBalance": "fundsdata.contracts[\"eth:0xeB5A...\"].balances.totalUsdValue",
    "borrowerOpsDirectCapital": "v2score.inventory.admins.breakdown[\"eth:0xa741...\"].totalDirectCapital"
  }
}
```

At compile time, the compiler:
1. Evaluates each data path against the V2 score result and funds data
2. Formats numeric values as USD strings (e.g., `$12.5M`)
3. Replaces all `{{variableName}}` occurrences in description fields

The compiled review contains **fully resolved text** — no template variables remain, no client-side data joining needed.

### Output Structure

See `ReviewCompiler.ts` for the full TypeScript interface definitions:

- `CompiledReview` — top-level structure
- `CompiledAdmin` — admin with functions, capital, description
- `CompiledDependency` — dependency with entity, functions, description
- `CompiledFundHolder` — fund holder with balances, positions, description
- `CompiledFunction` — permissioned function with impact
- `CompiledContract` — contract with tags

---

## Adding New Data to the Compiled Review

To extend the compiled review with new data (e.g., historical TVL, gas costs):

1. **Add a new top-level key** to the `CompiledReview` interface in `ReviewCompiler.ts`
2. **Add data fetching** to the monitoring loop in `DefidiscoMonitorApplication.updateProject()` (alongside funds refresh)
3. **Add compilation logic** to `ReviewCompiler.buildCompiledReview()`
4. **The frontend reads the new key** from `compiled-review.json` — no schema migration needed

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (currently Neon free tier) |
| `DISCORD_TOKEN` | No | — | Discord bot token |
| `DISCORD_CHANNEL_ID` | No | — | Single channel for all notifications |
| `ETHEREUM_RPC_URL_FOR_DISCOVERY` | Yes | — | Ethereum RPC endpoint |
| `ETHERSCAN_API_KEY` | Yes | — | Etherscan V2 API key |
| `DEBANK_API_KEY` | Yes | — | DeBank Pro API key |
| `ETHEREUM_RPC_URL` | No | — | For Morpho vault detection |
| `DEFISCAN_ENDPOINTS_PORT` | No | `3001` | In-process defiscan-endpoints port |
| `DISCOVERY_CACHE_ENABLED` | No | `true` | Enable RPC response caching |
| `DISCOVERY_CACHE_URI` | No | `postgres` | Cache backend |
| `RUN_ONCE` | No | `false` | Run single cycle and exit (for GitHub Actions cron) |
| `RUN_ON_START` | No | `true` | Run immediately on startup (long-running mode only) |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `DATABASE_SSL` | No | `false` | Enable SSL for PostgreSQL |

---

## Deployment

### Scheduling: GitHub Actions Cron

The monitor runs as a **GitHub Actions cron job** (`.github/workflows/monitor.yml`), scheduled daily at 8:00 CET (7:00 UTC). It can also be triggered manually from the Actions UI via `workflow_dispatch`.

Each run:
1. Builds the Docker image (`Dockerfile.monitor`) with layer caching
2. Runs Prisma migrations (separate step for clear error reporting)
3. Runs the monitor with `RUN_ONCE=true` — single cycle, then clean exit

### Database: Neon Free Tier (temporary)

The monitor uses a **Neon free tier** PostgreSQL database. This is a temporary setup — a managed database should be used for production.

**Security considerations**:
- Neon connection string stored as a GitHub Actions secret (encrypted at rest)
- Neon free tier has no IP allowlisting — any IP can connect with valid credentials
- The data stored is only discovery cache + update monitor snapshots — no user credentials or sensitive data
- Neon free tier compute scales to zero after inactivity, which may cause cold-start latency
- **Recommendation**: Migrate to a managed PostgreSQL once the service is validated in production

**Migrations**: The GitHub Actions workflow runs `prisma migrate deploy` as a separate step before each cycle. For initial setup, run locally:
```bash
cd packages/database
PRISMA_DB_URL="<neon-connection-string>" npx prisma migrate deploy
```

### Verifying

- Go to **Actions → DeFiDisco Monitor → Run workflow** (manual trigger)
- Check that the Docker build, migration, and monitor steps all pass
- Discord channel should receive "Monitor started (run-once)." followed by a cycle summary
- Per-project discovery diffs appear as individual Discord messages when changes are detected

---

## Project List

Projects are read from `packages/config/src/defidisco-config.json`:

```json
{
  "defiProjects": ["compound-v3", "uniswap-v2", "morpho", "lido", "liquity-v2", "ethena-test", "Steakhouse-USDC"]
}
```

To add or remove a project from monitoring, edit this file and redeploy. The per-project `config.jsonc` `defidisco.scanPermissions` flag is NOT used by the monitor — it reads the explicit list from `defidisco-config.json`.
