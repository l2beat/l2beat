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

#### Required

- `LOCAL_DB_URL` - Database url used in `yarn start`. You most likely want to set this to `postgresql://postgres:password@localhost:5432/l2beat_local`
- `TEST_DB_URL` - Database url used in `yarn test`. You most likely want to set this to `postgresql://postgres:password@localhost:5432/l2beat_test`
- `DATABASE_URL` - Database url used in production deployment
- `TVL_ETHEREUM_ETHERSCAN_API_KEY` - API key for Etherscan
- `TVL_ETHEREUM_PROVIDER_URL` - API Url for Ethereum QuickNode provider

#### Optional

- `STARKEX_API_KEY` - Starkex API key
- `COINGECKO_API_KEY` (Optional) - API key for Coingecko
- `LOG_LEVEL` (Optional) - String specifying the log level, options: "NONE", "CRITICAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"
- `PORT` (Optional) - The port on which the application exposes the api
- `FRESH_START` (default `false`) - When set to `true` it will rollback all database migrations on start before migrating to latest version
- `ACTIVITY_ENABLED` (default `false`) - When set to `true` activity feature is enabled
- `TVL_ENABLED` (default `true`) - When set to `true` tvl module is enabled
- `TVL_ETHEREUM_ENABLED` (default `true`) - When set to `true` ethereum tvl sync is enabled
- `TVL_ARBITRUM_ENABLED` (default `false`) - When set to `true` arbitrum tvl sync is enabled
- `TVL_OPTIMISM_ENABLED` (default `false`) - When set to `true` optimism tvl sync is enabled
- `TVL_BASE_ENABLED` (default `false`) - When set to `true` base tvl sync is enabled
- `TVL_ARBITRUM_PROVIDER_URL` - API Url for Arbitrum QuickNode provider
- `TVL_OPTIMISM_PROVIDER_URL` - API Url for Optimism QuickNode provider
- `TVL_BASE_PROVIDER_URL` - API Url for Base QuickNode provider
- `TVL_ARBITRUM_ETHERSCAN_API_KEY` - API key for Arbiscan
- `TVL_OPTIMISM_ETHERSCAN_API_KEY` - API key for Optimistic etherscan
- `TVL_BASE_ETHERSCAN_API_KEY` - API key for Basescan
- `STATUS_ENABLE`(default `true`) - enable/disable status module
- `ACTIVITY_PROJECTS_EXCLUDED_FROM_API` - allows to exclude certain projects from the activity API response

#### Discovery/Bot related

- `DISCOVERY_ETHEREUM_RPC_URL`
- `DISCOVERY_ETHEREUM_RPC_GETLOGS_MAX_RANGE` - maximum range for getLogs() call. Optional, by default no limit.
- `DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY`
- `WATCHMODE_ENABLED` (Optional) - Enable update monitor's watch mode
- `UPDATE_MONITOR_RUN_ON_START` (default `true`) - Prevent UpdateMonitor from running on start when developing locally
- `PUBLIC_DISCORD_CHANNEL_ID` - public channel id the message will be sent to
- `INTERNAL_DISCORD_CHANNEL_ID` - internal channel id the message will be sent to
- `DISCORD_TOKEN` - Bot account authentication token, for more details go to `DiscordClient.ts`

##### Multichain discovery CLI

If you want to use multichain discovery cli, make sure you include the `RPC_URL` and `ETHERSCAN_API_KEY` for desired chains. If you want to use one RPC provider, all of them (unless stated in brackets) are supported by <https://www.quicknode.com/> and <https://www.ankr.com/>. Etherscan API key should be created by creating an account on Etherscan instance for every chain separately (check config.discovery.ts for etherscan links).

- `DISCOVERY_ARBITRUM_RPC_URL` (Optional)
- `DISCOVERY_ARBITRUM_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_OPTIMISM_RPC_URL` (Optional)
- `DISCOVERY_OPTIMISM_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_POLYGON_POS_RPC_URL` (Optional)
- `DISCOVERY_POLYGON_POS_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_BSC_RPC_URL` (Optional)
- `DISCOVERY_BSC_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_AVALANCHE_RPC_URL` (Optional)
- `DISCOVERY_AVALANCHE_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_CELO_RPC_URL` (Optional)
- `DISCOVERY_CELO_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_LINEA_RPC_URL` (Optional) (Infura)
- `DISCOVERY_LINEA_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_BASE_RPC_URL` (Optional)
- `DISCOVERY_BASE_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_POLYGON_ZKEVM_RPC_URL` (Optional)
- `DISCOVERY_POLYGON_ZKEVM_ETHERSCAN_API_KEY` (Optional)
- `DISCOVERY_GNOSIS_RPC_URL` (Optional)
- `DISCOVERY_GNOSIS_ETHERSCAN_API_KEY` (Optional)

#### .env boilerplate

```bash
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
DATABASE_URL=

ETHERSCAN_API_KEY=
ETHEREUM_PROVIDER_URL=

ETHEREUM_ALCHEMY_API_KEY=

#-----OPTIONAL-----
# STARKEX_API_KEY=
# COINGECKO_API_KEY=
# LOG_LEVEL=
# PORT=
# FRESH_START=
# ACTIVITY_ENABLED=
# TVL_ENABLED=
# ETHEREUM_TVL_ENABLED=
# ARBITRUM_TVL_ENABLED=
# ARBISCAN_API_KEY=
# ARBITRUM_PROVIDER_URL=
## Should tvl endpoint return 404 if data is not synced yet? - defaults to false
# ERROR_ON_UNSYNCED_TVL=true
# UPDATE_MONITOR_RUN_ON_START=
# ACTIVITY_PROJECTS_EXCLUDED_FROM_API=project-a project-b

#-----DISCOVERY-----
# WATCHMODE_ENABLED=
# PUBLIC_DISCORD_CHANNEL_ID=
# INTERNAL_DISCORD_CHANNEL_ID=
# DISCORD_TOKEN=
# DISCOVERY_ETHEREUM_RPC_URL=
# DISCOVERY_ETHEREUM_RPC_GETLOGS_MAX_RANGE=
# DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY=

#-----DISCOVERY CLI (MULTICHAIN, OPTIONAL)-----
# DISCOVERY_ARBITRUM_RPC_URL=
# DISCOVERY_ARBITRUM_ETHERSCAN_API_KEY=
# DISCOVERY_OPTIMISM_RPC_URL=
# DISCOVERY_OPTIMISM_ETHERSCAN_API_KEY=
# DISCOVERY_POLYGON_POS_RPC_URL=
# DISCOVERY_POLYGON_POS_ETHERSCAN_API_KEY=
# DISCOVERY_BSC_RPC_URL=
# DISCOVERY_BSC_ETHERSCAN_API_KEY=
# DISCOVERY_AVALANCHE_RPC_URL=
# DISCOVERY_AVALANCHE_ETHERSCAN_API_KEY=
# DISCOVERY_CELO_RPC_URL=
# DISCOVERY_CELO_ETHERSCAN_API_KEY=
# DISCOVERY_LINEA_RPC_URL=
# DISCOVERY_LINEA_ETHERSCAN_API_KEY=
# DISCOVERY_BASE_RPC_URL=
# DISCOVERY_BASE_ETHERSCAN_API_KEY=
# DISCOVERY_POLYGON_ZKEVM_RPC_URL=
# DISCOVERY_POLYGON_ZKEVM_ETHERSCAN_API_KEY=


```

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

---

#### `/status/discovery`

Discovery dashboard showing current discovered.json & potential diffs for every project

Example

```
https://api.l2beat.com/status/discovery
```

#### `/status/tvl`

Endpoint showing the current sync status of our TVL module

Example

```
https://api.l2beat.com/status/tvl
```

#### `/status/prices`

Query parameters:

- `from` - (number) UTC timestamp from when to start the query (default earliest)
- `to` - (number) UTC timestamp when to end the query (default latest)

Example

```
https://api.l2beat.com/status/prices?from=1687599307&to=1690191307
```

---

#### `/status/balances`

Query parameters:

- `from` - (number) UTC timestamp from when to start the query (default earliest)
- `to` - (number) UTC timestamp when to end the query (default latest)
- `chainId` - (number) which chainId to check the status of (default 1 (ETH))

Example

```
https://api.l2beat.com/status/balances?chainId=1&from=1687599307&to=1690191307
```

---

#### `/status/reports`

Query parameters:

- `from` - (number) UTC timestamp from when to start the query (default earliest)
- `to` - (number) UTC timestamp when to end the query (default latest)
- `chainId` - (number) which chainId to check the status of (default 1 (ETH))
- `type` - (string) which value type to check the status of(default CBV)

Example

```
https://api.l2beat.com/status/reports/?chainId=1&type=CBV&from=1687599307&to=1690191307
```

---
