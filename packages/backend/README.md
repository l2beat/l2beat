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

- Alchemy: https://alchemy.com
- Etherscan: https://etherscan.io/apis

Optionally if you want to speed up the price collection obtain an api key from:

- Coingecko: https://www.coingecko.com/en/api/pricing

### Environment variables

Once you have everything create a `.env` file that configures the app's
environment variables. One variable per line `KEY=value`.

#### Required

- `LOCAL_DB_URL` - Database url used in `yarn start`. You most likely want to set this to `postgresql://postgres:password@localhost:5432/l2beat_local`
- `TEST_DB_URL` - Database url used in `yarn test`. You most likely want to set this to `postgresql://postgres:password@localhost:5432/l2beat_test`
- `DATABASE_URL` - Database url used in production deployment
- `ETHERSCAN_API_KEY` - API key for Etherscan
- `ALCHEMY_API_KEY` - API key for Alchemy
- `STARKEX_API_KEY` - Starkex API key

#### Optional

- `COINGECKO_API_KEY` (Optional) - API key for Coingecko
- `LOG_LEVEL` (Optional) - Integer specifying the log level. `0` - none, `1` - error, `2` - warn, `3` - info, `4` - debug
- `PORT` (Optional) - The port on which the application exposes the api
- `SYNC_DISABLED` (default `false`) - When set to `true` it will prevent app from syncing, useful for local debugging
- `FRESH_START` (default `false`) - When set to `true` it will rollback all database migrations on start before migrating to latest version
- `ACTIVITY_ENABLED` (default `false`) - When set to `true` activity feature is enabled
- `TVL_SYNC_ENABLED` (default `true`) - When set to `true` tvl sync is enabled
- `WATCHMODE_ENABLED` (Optional) - Enable update monitor's watch mode
- `PUBLIC_DISCORD_CHANNEL_ID` - public channel id the message will be sent to
- `INTERNAL_DISCORD_CHANNEL_ID` - internal channel id the message will be sent to
- `DISCORD_TOKEN` - Bot account authentication token, for more details go to `DiscordClient.ts`
- `STATUS_ENABLE`(default `true`) - enable/disable status module

#### Optional (local development)

- `DISCOVERY_BLOCK_NUMBER` (Optional) - Override the block number used during local discovery
- `UPDATE_MONITOR_RUN_ON_START` (default `true`) - Prevent UpdateMonitor from running on start when developing locally

#### .env boilerplate:

```bash
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
DATABASE_URL=

ETHERSCAN_API_KEY=
ALCHEMY_API_KEY=
STARKEX_API_KEY=

#-----OPTIONAL-----
#COINGECKO_API_KEY=
#LOG_LEVEL=
#PORT=
#SYNC_DISABLED=
#FRESH_START=
#ACTIVITY_ENABLED=
#TVL_SYNC_ENABLED=
#DISCOVERY_BLOCK_NUMBER=
#WATCHMODE_ENABLED=
#PUBLIC_DISCORD_CHANNEL_ID=
#INTERNAL_DISCORD_CHANNEL_ID=
#DISCORD_TOKEN=
#UPDATE_MONITOR_RUN_ON_START=
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

The `/status` endpoints were created to see the current progress of the Updaters.

### Endpoints:

- `/status/prices`
- `/status/balances`
- `/status/reports`
- `/status/discovery`
