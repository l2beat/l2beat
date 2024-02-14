# @l2beat/backend

L2BEAT backend server.

## Setup

### Dependencies

To run or develop the backend you need to install and build its dependencies. You can do it by running the following commands in the repository root:

```
yarn
yarn build
```

### Database

After the nodejs dependencies have been installed you should also install a Postgres database (v14). The recommended way is through docker using the commands below.

```
docker run -d --name=l2beat_postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_local'
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_test'
```

If you restart your system running `docker start l2beat_postgres` will bring the database back online.

Alternatively you can simply run `./scripts/start_db.sh` which will always do what's needed.

### Third party services

You should also obtain an api key for the following services:

- Alchemy: <https://alchemy.com>
- Etherscan: <https://etherscan.io/apis>

Optionally if you want to speed up the price collection obtain an api key from:

- Coingecko: <https://www.coingecko.com/en/api/pricing>

### Environment variables

Once you have everything create a `.env` file that configures the app's
environment variables. One variable per line `KEY=value`.

### Database

For local development you set the following variables:

```
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
```

If you used a different database setup modify those values accordingly. The
`TEST_DB_URL` is used by only the test suite. Omitting this variable will cause
the database tests to be skipped.

You might want to clear the database before running the backend. You can do it
by setting `FRESH_START=true` env variable.

### Features

The backend can do a lot of things and you most likely don't want to run it all locally. You can enable/disable features by using the feature flag system configured via the `FEATURES` environment variable.

Below are some examples of possible configurations:

```sh
# enable all features
FEATURES=*

# enable everything except tvl
FEATURES=*,!tvl

# enable only tvl
FEATURES=tvl

# enable tvl and activity
FEATURES=tvl,activity

# enable tvl, but not for arbitrum
FEATURES=tvl,!tvl.arbitrum

# enable tvl, but only for ethereum
FEATURES=tvl,!tvl.*,tvl.ethereum
```

### `tvl` feature

The tvl feature is configured via the following environment variables:

- `ERROR_ON_UNSYNCED_TVL` - Optional. Defaults to false

- `COINGECKO_API_KEY` - Optional. Speeds up price collection. See https://www.coingecko.com/en/api/pricing

And a set the following variables for each enabled chain:

- `TVL_<CHAIN>_PROVIDER_URL` - RPC url for the chain, for example from Alchemy
- `TVL_<CHAIN>_RPC_CALLS_PER_MINUTE` - Optional. Rate limits the number of calls to the RPC. Defaults to 60
- `TVL_<CHAIN>_ETHERSCAN_API_KEY` - Etherscan API key. Only needed if the chain uses Etherscan. Blockscout doesn't need it.

### `liveness` feature

The liveness feature is configured via the following environment variables:

- `LIVENESS_CLIENT_EMAIL` - BigQuery credentials
- `LIVENESS_PRIVATE_KEY` - BigQuery credentials
- `LIVENESS_PROJECT_ID` - BigQuery credentials
- `LIVENESS_BIGQUERY_LIMIT_GB` - Optional. Defaults to 15
- `LIVENESS_BIGQUERY_WARNING_LIMIT_GB` - Optional. Defaults to 8

### `finality` feature

- `FINALITY_ETHEREUM_PROVIDER_URL` - Ethereum RPC url
- `FINALITY_ETHEREUM_PROVIDER_CALLS_PER_MINUTE` - Optional. Rate limits the number of calls to the RPC. Defaults to 600

In development.

### `activity` feature

The activity feature is configured via the following environment variables:

- `STARKEX_API_KEY`
- `STARKEX_CALLS_PER_MINUTE` - Optional. Rate limits the number of calls to the RPC. Defaults to 600
- `ACTIVITY_PROJECTS_EXCLUDED_FROM_API` - Optional. Space separated list of project ids to exclude from the API.

And a set the following variables for each enabled chain:

- `ACTIVITY_<CHAIN>_URL` - RPC url for the chain, for example from Alchemy
- `ACTIVITY_<CHAIN>_CALLS` - Optional. Rate limits the number of calls to the RPC

### `status` feature

The status feature doesn't require any configuration.

### `updateMonitor` feature

The updateMonitor feature is configured via the following environment variables:

- `UPDATE_MONITOR_RUN_ON_START` - Optional. Defaults to true
- `DISCORD_TOKEN` - Optional. Discord bot token
- `INTERNAL_DISCORD_CHANNEL_ID` - Optional. Discord channel id for internal messages
- `PUBLIC_DISCORD_CHANNEL_ID` - Optional. Discord channel id for public messages

And a set the following variables for each enabled chain:

- `DISCOVERY_<CHAIN>_RPC_URL` - RPC url for the chain, for example from Alchemy
- `DISCOVERY_<CHAIN>_RPC_GETLOGS_MAX_RANGE` - Optional. Limits the range of getLogs calls
- `DISCOVERY_<ENV_NAME>_ETHERSCAN_API_KEY` - Etherscan API key

### `diffHistory` feature

The diffHistory feature is configured per chain with the same variables as the `updateMonitor` feature.

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

- `yarn build` - build
- `yarn format:fix` - run prettier automatic formatter
- `yarn format` - check if formatting is correct with prettier
- `yarn lint:fix` - run eslint automatic fixer
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn start:dev` - run the backend server from source ts
- `yarn start` - run the backend server from built js
- `yarn test` - run tests
- `yarn typecheck` - check if the code satisfies the typescript compiler

- `scripts/rediscoverRawDevAll.sh` - re-runs raw discovery --dev on all existing projects

## Repository naming convention

- `add(T): number` - adds a new record and returns its id
- `addMany(T[]): R[]` - adds many new records and returns their ids
- `getAll(): T[]` - returns an array of all records
- `getByKey(K): T[]` - returns an array of all matching records
- `findByKey(K): T?` - returns a single matching record or undefined
- `deleteAll(): number` - removes all records and returns the number of removed records
- `deleteByKey(K): number` - removes all matching records and returns the number of removed records
- `save(T): boolean` - updates a record and returns boolean indicating if record was updated

## Maintenance endpoints

The `/status` endpoints were created to see the current state of our backend.

- `/activity/status`
- `/status/discovery`
- `/status/liveness`
- `/status/tvl`
