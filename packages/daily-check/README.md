# @l2beat/daily-check

Automates the morning daily check. Every day it reads the **Control Plane**
dashboard (configured by its saved-object id) from Kibana, evaluates every
tile directly against Elasticsearch,
posts a green/amber/red summary to Discord, and — when any tile is red —
runs an AI investigation (Claude with an `es_search` tool) that drills into
the logs and posts a root-cause report with proposed next steps.

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
5. For red tiles, the AI investigation runs through Claude Code
   (`claude -p`, restricted to curl): it queries the same indices for error
   samples and breakdowns, then posts a report. It authenticates the same
   way Claude Code does — your local login when running locally, or a
   `CLAUDE_CODE_OAUTH_TOKEN` on a server — so no Anthropic API key is
   needed.

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
| `CLAUDE_CODE_OAUTH_TOKEN` | no | Auth for `claude -p` on servers; generate once with `claude setup-token`. Not needed locally when you are logged in to Claude Code |
| `DAILY_CHECK_MODEL` | no | Model passed to `claude -p`, default `opus` |
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

If there are red tiles, the dry run also exercises the AI investigation via
your local Claude Code login (`claude -p`) and prints its report to the
console.

## Deploying on Coolify

Create an application from this repository with:

- Build pack: Dockerfile, path `packages/daily-check/Dockerfile`,
  build context `.` (repository root)
- Health check: `GET /health` on port `3000`
- The environment variables above (set `TZ` so 09:00 means local time)
- For the AI investigation, run `claude setup-token` on your machine and set
  the result as `CLAUDE_CODE_OAUTH_TOKEN` (the image ships the Claude Code
  CLI). Without it, red tiles are still reported — only the investigation
  step fails and says so in the channel.

The container runs as a daemon and posts once per day. To trigger a run
manually, restart with the start command overridden to
`node ./build/index.js --once`.
