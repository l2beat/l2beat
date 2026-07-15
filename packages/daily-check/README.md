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
| `DAILY_CHECK_MODEL` | no | Agent and model in `<agent>:<model>` format, e.g. `claude:opus` or `codex:gpt-5.6-sol`. Default `claude:opus` |
| `CLAUDE_CODE_OAUTH_TOKEN` | one Claude credential | Subscription auth for `claude -p`; generate with `claude setup-token` |
| `ANTHROPIC_API_KEY` | one Claude credential | Direct Anthropic API auth for `claude -p`; alternative to `CLAUDE_CODE_OAUTH_TOKEN` |
| `CODEX_ACCESS_TOKEN` | Codex Business/Enterprise subscription | ChatGPT workspace access token for trusted automation |
| `CODEX_API_KEY` | Codex API billing | OpenAI Platform API auth; usage is billed separately from a ChatGPT subscription |
| `DAILY_CHECK_RUN_AT` | no | Daily run time `HH:MM`, default `09:00` |
| `TZ` | no | Timezone for `DAILY_CHECK_RUN_AT`, e.g. `Europe/Warsaw` |
| `PORT` | no | Health endpoint port, default `3000` |

### Model examples

| Value | Suggested use |
| --- | --- |
| `claude:best` | Strongest Claude model available to the account; currently Fable 5 when available, otherwise the latest Opus |
| `claude:opus` | Complex investigations requiring strong reasoning |
| `claude:sonnet` | Balanced choice for routine investigations |
| `claude:haiku` | Fast, lower-cost choice for simple checks |
| `claude:claude-opus-4-8` | Pin Claude to Opus 4.8 instead of following the moving `opus` alias |
| `codex:gpt-5.6-sol` | Most capable GPT-5.6 Codex model for complex, open-ended investigations |
| `codex:gpt-5.6-terra` | Balanced GPT-5.6 Codex model for everyday work |
| `codex:gpt-5.6-luna` | Fastest, lowest-cost GPT-5.6 Codex model for clear, repeatable work |

Claude aliases such as `opus`, `sonnet`, and `haiku` move to the recommended
version over time; use a full model ID when reproducibility matters. Actual
availability depends on the CLI version, authentication method, account, and
organization policy. See the official
[Claude Code model configuration](https://code.claude.com/docs/en/model-config)
and [Codex model list](https://developers.openai.com/codex/models). In an
interactive local session, `/model` shows the models available to the current
account.

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

## Setting up agents on a server

The Docker image includes both agent CLIs. Configure credentials only for the
agent selected by `DAILY_CHECK_MODEL`. Store credentials as secret environment
variables in the deployment platform; do not commit them or bake them into the
image.

### Claude

Choose one authentication method:

1. **Claude subscription:** on a trusted local machine logged in to a Claude
   Pro, Max, Team, or Enterprise account, generate a long-lived token:

   ```sh
   claude setup-token
   ```

   Copy the printed token to the server as `CLAUDE_CODE_OAUTH_TOKEN`.

2. **Anthropic API:** create an API key in the
   [Anthropic Console](https://platform.claude.com/) and add it to the server as
   `ANTHROPIC_API_KEY`.

Then select Claude and its model:

```dotenv
DAILY_CHECK_MODEL=claude:opus
CLAUDE_CODE_OAUTH_TOKEN=<secret>
```

When using API billing, replace `CLAUDE_CODE_OAUTH_TOKEN` with
`ANTHROPIC_API_KEY`.

### Codex

Choose one authentication method. Set only the credential for the method you
use.

1. **ChatGPT Business or Enterprise subscription:** create a token on the
   [ChatGPT access tokens page](https://chatgpt.com/admin/access-tokens). Store
   it on the server as `CODEX_ACCESS_TOKEN`:

   ```dotenv
   DAILY_CHECK_MODEL=codex:gpt-5.6-sol
   CODEX_ACCESS_TOKEN=<secret>
   ```

   This is the preferred option for trusted automation that should use the
   workspace's ChatGPT-managed Codex entitlement.

2. **ChatGPT Plus or Pro subscription:** persist the Codex CLI login directory
   using the [Coolify volume guide](#persisting-a-codex-login-in-coolify). After the volume is attached, open a
   shell in the running container as `appuser` and authenticate once:

   ```sh
   codex login --device-auth
   codex login status
   ```

   Complete the device authorization in a browser. Codex stores its credentials
   in `/home/appuser/.codex/auth.json` and refreshes them during use, so the
   volume must survive restarts and deployments. Treat the entire directory as
   a secret: never commit it, copy it into the image, or expose it in logs.

   Configure only the model as an environment variable:

   ```dotenv
   DAILY_CHECK_MODEL=codex:gpt-5.6-sol
   ```

3. **Separately billed OpenAI API:** create an API key in the
   [OpenAI Platform dashboard](https://platform.openai.com/api-keys), store it as
   `CODEX_API_KEY`, and select the model:

   ```dotenv
   DAILY_CHECK_MODEL=codex:gpt-5.6-sol
   CODEX_API_KEY=<secret>
   ```

   This method uses OpenAI Platform API billing, not usage included with a
   ChatGPT subscription.

#### Persisting a Codex login in Coolify

A container's own filesystem is replaced during a deployment. A persistent
volume is storage managed by Coolify and attached to the same path in each new
container, keeping Codex's refreshed login credentials between deployments.

The Dockerfile prepares `/home/appuser/.codex` with the correct owner and sets
it as `CODEX_HOME`. To attach persistent storage:

1. Open the daily-check application in Coolify.
2. Open **Persistent Storage** and add a **Volume**.
3. Give it a recognizable name, for example `daily-check-codex-auth`.
4. Set **Destination Path** to `/home/appuser/.codex`.
5. Save and redeploy the application.
6. Open the container terminal as `appuser` and run:

   ```sh
   codex login --device-auth
   codex login status
   ```

7. Complete the browser authorization. After a later redeployment, run
   `codex login status` again to verify that the login survived.

Use a Coolify volume rather than a bind mount unless the server operator needs
to manage a specific host directory. The Dockerfile intentionally does not use
the Docker `VOLUME` instruction: it cannot create or select Coolify's reusable
named storage and may otherwise leave anonymous volumes behind. See Coolify's
[persistent storage guide](https://coolify.io/docs/knowledge-base/persistent-storage)
for the platform-level details.

See the official [Codex authentication guide](https://learn.chatgpt.com/docs/auth),
[access token guide](https://learn.chatgpt.com/docs/enterprise/access-tokens),
and [advanced automation authentication guide](https://learn.chatgpt.com/docs/auth/ci-cd-auth)
for current limitations and security guidance.

## Deploying on Coolify

Create an application from this repository with:

- Build pack: Dockerfile, path `packages/daily-check/Dockerfile`,
  build context `.` (repository root)
- Health check: `GET /health` on port `3000`
- The environment variables above (set `TZ` so 09:00 means local time)
- Follow [Setting up agents on a server](#setting-up-agents-on-a-server) for the
  credential matching `DAILY_CHECK_MODEL`. Without it, red tiles are still
  reported — only the investigation step fails and says so in the channel.

The container runs as a daemon and posts once per day. To trigger a run
manually, restart with the start command overridden to
`node ./build/index.js --once`.
