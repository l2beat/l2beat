# @l2beat/backend

L2BEAT backend server.

## Setup

### Dependencies

To run or develop the backend you need to install and build its dependencies. You can do it by
running the following commands in the repository root:

```
pnpm install
pnpm build
```

### Database

After the nodejs dependencies have been installed you should also install a Postgres database (v15).
The recommended way is through docker using the commands below.

```
docker run -d --name=l2beat_postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_local'
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_test'
```

If you restart your system running `docker start l2beat_postgres` will bring the database back
online.

Alternatively you can simply run `./scripts/start_db.sh` which will always do what's needed.

To update database schema to the latest version run `pnpm dev:migrate`. That way you will have the
latest schema in your local database.

### Third party services

You should also obtain an api key for the following services:

- Alchemy: <https://alchemy.com>
- Etherscan: <https://etherscan.io/apis>

Optionally if you want to speed up the price collection obtain an api key from:

- Coingecko: <https://www.coingecko.com/en/api/pricing>

### Environment variables

Once you have everything create a `.env` file that configures the app's environment variables. One
variable per line `KEY=value`.

### Database

For local development you set the following variables:

```
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
```

If you used a different database setup modify those values accordingly. The `TEST_DB_URL` is used by
only the test suite. Omitting this variable will cause the database tests to be skipped.

### Features

The backend can do a lot of things and you most likely don't want to run it all locally. You can
enable/disable features by using the feature flag system configured via the `FEATURES` environment
variable.

Below are some examples of possible configurations:

```sh
# enable all features
FEATURES=*

# enable everything except tvs
FEATURES=*,!tvs

# enable only tvs
FEATURES=tvs

# enable tvs and activity
FEATURES=tvs,activity

# enable tvs, but not for arbitrum
FEATURES=tvs,!tvs.arbitrum

# enable tvs, but only for ethereum
FEATURES=tvs,!tvs.*,tvs.ethereum
```

### Common env variables

- `COINGECKO_API_KEY` - Optional. Speeds up price collection. See
  https://www.coingecko.com/en/api/pricing

- `ETHERSCAN_API_URL` - Etherscan API url
- `ETHERSCAN_API_KEY` - Etherscan API key Blockscout doesn't need it.

- `<CHAIN>_RPC_URL` - RPC url for the chain, for example from Alchemy
- `<CHAIN>_RPC_CALLS_PER_MINUTE` - Optional. Rate limits the number of calls to the RPC. Defaults to
  60
- `<CHAIN>_RPC_GETLOGS_MAX_RANGE` - Optional. Limits the range of getLogs calls

You can also append the feature name to the environment variables if you'd like a specific feature
to use a different endpoint. For example:

```
ETHEREUM_RPC_URL=https://example.provider/ethereum
```

### `tvs` feature

The tvs feature is configured via the following environment variables:

**Feature flags:**

- `tvs` - enables tvs feature
- `tvs.[project_id]` - enables tvs for project with given project_id

### `tracked-txs` feature

The tracked-txs feature is configured via the following environment variables:

- `BIGQUERY_CLIENT_EMAIL` - BigQuery credentials
- `BIGQUERY_PRIVATE_KEY` - BigQuery credentials
- `BIGQUERY_PROJECT_ID` - BigQuery credentials
- `BIGQUERY_LIMIT_GB` - Optional. Defaults to 15
- `BIGQUERY_WARNING_LIMIT_GB` - Optional. Defaults to 8

**Feature flags:**

- `tracked-txs` - enables tracked txs feature
- `tracked-txs.liveness` - enables liveness feature

### `activity` feature

The activity feature is configured via the following environment variables:

- `STARKEX_API_KEY`
- `STARKEX_CALLS_PER_MINUTE` - Optional. Rate limits the number of calls to the RPC. Defaults to 600

**Feature flags:**

- `activity` - enables activity feature

### `status` feature

The status feature doesn't require any configuration.

**Feature flags:**

- `status` - enables the status feature

### `updateMonitor` feature

The updateMonitor feature is configured via the following environment variables:

- `UPDATE_MONITOR_RUN_ON_START` - Optional. Defaults to true
- `DISCORD_TOKEN` - Optional. Discord bot token
- `INTERNAL_DISCORD_CHANNEL_ID` - Optional. Discord channel id for internal messages
- `PUBLIC_DISCORD_CHANNEL_ID` - Optional. Discord channel id for public messages

**Feature flags:**

- `updateMonitor` - enables the update monitor

### `cache` feature

The cache feature is running functions every 10 minutes that would be run on endpoint invoke.

**Feature flags:**

- `cache.liveness` - enables the cache for the liveness endpoint
- `cache.tvs` - enables the cache for the tvs endpoint

### Logging

You can configure the log level by setting the `LOG_LEVEL` variable. The possible values are:

- `NONE` (disables all logging)
- `CRITICAL`
- `ERROR`
- `WARN`
- `INFO` (default)
- `DEBUG`
- `TRACE`

## Scripts

- `pnpm build` - build
- `pnpm format:fix` - run biome automatic formatter
- `pnpm format` - check if formatting is correct with biome
- `pnpm lint:fix` - run biome automatic fixer
- `pnpm lint` - check if the code satisfies the biome configuration
- `pnpm start:dev` - run the backend server from source ts
- `pnpm start` - run the backend server from built js
- `pnpm test` - run tests
- `pnpm typecheck` - check if the code satisfies the typescript compiler
- `pnpm db:migrate` - apply the latest migration
- `pnpm tvs:generate` - regenerate TVS config from latest inputs (check --help for available
  options)
- `pnpm tvs:execute` - executes TVS with latest config (check --help for available options)
- `pnpm tvs:calculate-ids` - calculates IDs for amounts and prices. Examples:
```bash
pnpm tvs:calculate-ids --projects=unichain,arbitrum
```
```bash
pnpm tvs:calculate-ids --tokens=unichain-ETH,unichain-USDC
```
- `pnpm tvs:translate-id` - find out which config corresponds to given ID. Examples:
```bash
pnpm tvs:translate-id 5da09aa91cbd
```
- `scripts/rediscoverRawDevAll.sh` - re-runs raw discovery --dev on all existing projects

## Maintenance endpoints

The `/status` endpoints were created to see the current state of our backend.

- `/activity/status`
- `/status/discovery`
- `/status/tracked-txs`
- `/status/tvs`
