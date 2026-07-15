# @l2beat/daily-check

Automates the morning daily check. Every day it reads the **Control Plane**
dashboard (configured by its saved-object id) from Kibana, evaluates every
tile directly against Elasticsearch,
posts a green/amber/red summary to Discord, and — when any tile is red —
runs an AI investigation through Claude Code or Codex that drills into the logs
and posts a root-cause report with proposed next steps.

## How it works

Nothing is hardcoded. On every run the service:

1. Fetches the dashboard by id from the Kibana saved objects API.
2. Parses each Lens metric tile: its index pattern, KQL queries, aggregation
   (count / sum / max / min / average / percentile / last_value, formulas and
   `terms` breakdowns) and the "color by value" thresholds.
3. Replays the same aggregation against Elasticsearch over the dashboard's
   time window and classifies the value using the tile's own color stops.
4. Posts the summary grouped by dashboard section. Tiles it cannot evaluate
   (e.g. Vega visualizations) are listed as "verify manually" — never
   silently skipped.
5. For red tiles, the AI investigation runs through the agent selected by
   `DAILY_CHECK_MODEL`: Claude Code (`claude -p`) or Codex (`codex exec`). It
   queries the same indices with curl for error samples and breakdowns, then
   posts a report. Each CLI uses its normal local login or its server credential.

Add or edit a tile in Kibana and the next run picks it up automatically.

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `KIBANA_URL` | yes | e.g. `https://kibana-v9.l2beat.com` |
| `KIBANA_API_KEY` | yes | API key with read access to saved objects |
| `ELASTICSEARCH_URL` | yes | Elasticsearch endpoint |
| `ELASTICSEARCH_API_KEY` | yes | API key with read access to the log indices |
| `DISCORD_WEBHOOK_URL` | yes | Webhook of the channel receiving the report |
| `DAILY_CHECK_DASHBOARD_ID` | yes | Saved-object id of the dashboard (URL: `/app/dashboards#/view/<id>`) |
| `DAILY_CHECK_MODEL` | no | Agent and model in `<agent>:<model>` format, e.g. `claude:opus-4.8` or `codex:gpt-5.6-sol`. Default `claude:opus` |
| `CLAUDE_CODE_OAUTH_TOKEN` | for Claude on servers | Auth for `claude -p`; generate once with `claude setup-token`. Not needed locally when logged in to Claude Code |
| `CODEX_API_KEY` | for Codex on servers | Auth for a non-interactive `codex exec`. Not needed locally when logged in to Codex |
| `DAILY_CHECK_RUN_AT` | no | Daily run time `HH:MM`, default `09:00` |
| `TZ` | no | Timezone for `DAILY_CHECK_RUN_AT`, e.g. `Europe/Warsaw` |
| `PORT` | no | Health endpoint port, default `3000` |

## Running locally

Create `packages/daily-check/.env` with at least `KIBANA_URL`,
`KIBANA_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY` and
`DAILY_CHECK_DASHBOARD_ID`, then:

```sh
# dry run: evaluates everything and prints the report to the console,
# nothing is posted to Discord (DISCORD_WEBHOOK_URL not needed)
pnpm dev

# one-shot with a real Discord post, then exit
pnpm exec tsx src/index.ts --once

# daemon: serves /health and runs every day at DAILY_CHECK_RUN_AT
pnpm build && pnpm start
```

If there are red tiles, the dry run also exercises the selected AI CLI and
prints its report to the console. Install and log in to Claude Code or Codex
locally according to `DAILY_CHECK_MODEL`.

## Deploying on Coolify

Create an application from this repository with:

- Build pack: Dockerfile, path `packages/daily-check/Dockerfile`,
  build context `.` (repository root)
- Health check: `GET /health` on port `3000`
- The environment variables above (set `TZ` so 09:00 means local time)
- For the AI investigation, set the credential matching `DAILY_CHECK_MODEL`:
  `CLAUDE_CODE_OAUTH_TOKEN` for Claude or `CODEX_API_KEY` for Codex. The image
  ships both CLIs. Without the selected credential, red tiles are still
  reported — only the investigation step fails and says so in the channel.

The container runs as a daemon and posts once per day. To trigger a run
manually, restart with the start command overridden to
`node ./build/index.js --once`.
