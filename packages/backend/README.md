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

After the nodejs dependencies have been installed you should also install a Postgres database. The recommended way is through docker using the commands below.

```
docker run -d --name=l2beat_postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_local'
docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_test'
```

If you restart your system running `docker start l2beat_postgres` will bring the database back online.

### Third party services

You should also obtain an api key for the following services:

- Alchemy: https://alchemy.com
- Etherscan: https://etherscan.io/apis

Optionally if you want to speed up the price collection obtain an api key from:

- Coingecko: https://www.coingecko.com/en/api/pricing

### Environment variables

Once you have everything create a `.env` file that configures the app's
environment variables. One variable per line `KEY=value`.

- `ETHERSCAN_API_KEY` - Api key for Etherscan
- `ALCHEMY_API_KEY` - Api key for Alchemy
- `DATABASE_URL` - Database url used in production deployment
- `LOCAL_DB_URL` - Database url used in `yarn start`. You most likely want to set this to `postgresql://postgres:password@localhost:5432/l2beat_local`
- `TEST_DB_URL` - Database url used in `yarn test`. You most likely want to set this to `postgresql://postgresql://postgres:password@localhost:5432/l2beat_test`
- `STARKEX_API_URL` - Starkex api url, used while counting transactions from strakex based systems.
- `STARKEX_API_KEY` - Starkex api key
- `COINGECKO_API_KEY` - (Optional) Api key for Coingecko
- `LOG_LEVEL` - (Optional) Integer specifying the log level. `0` - none, `1` - error, `2` - info, `3` - debug
- `PORT` - (Optional) The port on which the application exposes the api
- `SYNC_DISABLED` (default `false`) - When set to `true` it will prevent app from syncing, useful for local debugging
- `FRESH_START` (default `false`) - When set to `true` it will rollback all database migrations on start before migrating to latest version

Example:

```
ETHERSCAN_API_KEY=your_etherscan_key
ALCHEMY_API_KEY=your_alchemy_key
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
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

- `add(T): number` - adds a new record and returns it's id
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
