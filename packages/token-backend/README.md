# @l2beat/token-backend

Token Service exposes high-level interface to access data about Abstract Tokens, Deployed Tokens
and their connections, e.g. finding all related tokens (even if connections are not direct).

## Important Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TOKEN_INGESTION_ENABLED` | No | `false` | Enable the background token ingestion loop. |
| `TOKEN_INGESTION_INTERVAL_MS` | No | `60000` | Interval between ingestion runs, in milliseconds. |
| `TOKEN_INGESTION_AUTOAPPROVE` | No | `false` | If `true`, newly ingested tokens go straight to `pending` and will be processed automatically. If `false`, they are placed in a `staged` state awaiting manual approval. |
| `TOKEN_INGESTION_MAX_PROCESSED_PER_RUN` | No | `1000` | Prevents infinite-loop. Maximum number of pending queue entries processed in one ingestion run before the drain stops and leaves the rest pending. |
| `COINGECKO_API_KEY` | No | — | CoinGecko API key. If present, token-backend uses the Pro API URL. |
| `COINGECKO_CALLS_PER_MINUTE` | No | `400` with `COINGECKO_API_KEY`, otherwise `10` | CoinGecko client rate limit for automatic ingestion and token UI checks. |
| `CF_TEAM_DOMAIN` | Yes* | — | Cloudflare Access team domain (e.g. `https://myteam.cloudflareaccess.com`). Required when `DEPLOYMENT_ENV` is `staging` or `production`. |
| `CF_ACCESS_AUD` | Yes* | — | Cloudflare Access application AUD. Required when `DEPLOYMENT_ENV` is `staging` or `production`. |
| `TOKEN_BACKEND_READONLY_AUTH_TOKEN` | No | — | Static bearer token that grants read-only access to the API. |
| `TOKEN_BACKEND_JSON_BODY_LIMIT_MB` | No | `20` | Maximum allowed JSON body size in megabytes. |
| `LOG_LEVEL` | No | `INFO` | Logger verbosity level. |

\* Required only under the conditions described in the **Description** column.

### Script-only variables

The following variables are read by helper scripts shipped with the package, not the running service itself:

| Variable | Description |
|----------|-------------|
| `LOCAL_DB_URL` | Used by `scripts/import-generated.ts` to connect to the token database. |
| `TOKEN_BACKEND_TRPC_URL` | Used by `scripts/test-client.ts` — URL of the tRPC API to call. |
| `TOKEN_BACKEND_CF_TOKEN` | Used by `scripts/test-client.ts` — Cloudflare Access token for authentication. |

## Design docs

All TokenDB design docs live under
[docs/mdbook/specs/l2b_specs/token_db/](../../docs/mdbook/specs/l2b_specs/token_db/).
These documents MUST be kept up to date when their subjects change:

- [Automatic token ingestion](../../docs/mdbook/specs/l2b_specs/token_db/automatic_token_ingestion.md) —
  the background loop that keeps TokenDB in sync with the interop
  transfer table and CoinGecko.
- [Intent / Plan / Execute](../../docs/mdbook/specs/l2b_specs/token_db/intent_plan_execute.md) —
  the pipeline behind every human-driven write from token-UI (intents →
  plans → commands), and the rationale (visible blast radius +
  concurrency safety)..
