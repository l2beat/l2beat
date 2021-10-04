# @l2beat/backend

L2BEAT Data collection script. Because of the extensive amounts of data fetching it uses a cache to speed up the execution time.

## Setup

To run or develop the backend you need to install and build its dependencies. You can do it by running the following commands in the repository root:

```
yarn
yarn build:mock
```

## Scripts

- `yarn build` - [described later](#production-build)
- `yarn build:mock` - [described later](#mock-build)
- `yarn build:precomputed` - [described later](#precomputed-build)
- `yarn format` - check if formatting is correct with prettier
- `yarn format:fix` - run prettier automatic formatter
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn lint:fix` - run eslint automatic fixer
- `yarn typecheck` - check if the code satisfies the typescript compiler
- `yarn test` - run tests

## Mock build

The backend offers two build modes: mock and production. The mock build is triggered by `yarn build:mock` and produces a `build/data.json` file filled with fake data. It is useful to run this build if you want to develop the frontend without needing to configure a production run.

## Production build

The production build is triggered using `yarn build`. You will need to configure your environment to be able to run it:

1. Obtain an Etherscan API key
2. Obtain a JSON-RPC url for an archive node (e.g. Alchemy)
3. Create a `.env` file that includes the following lines:

```
ETHERSCAN_API_KEY=your-etherscan-key
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-alchemy-key
```

The build makes use of a cache stored in the `cache` folder. The `cache/precomputed.json` is used to bootstrap the cache so that not all of the historical data has to be downloaded.

The result of this build is the `build/data.json` file which contains up to date information about the various L2 protocols.

## Precomputed build

A precomputed build has the same requirements as the production build but also updates the precomputed.json file after the build is finished.

# UNDER CONSTRUCTION: Backend server

This section describes a new version of the backend which is a long running server process. It is under active development.

L2BEAT Data collection script. Because of the extensive amounts of data fetching it uses a cache to speed up the execution time.

## Setup

To run or develop the backend you need to install and build its dependencies. You can do it by running the following commands in the repository root:

```
yarn
yarn build:mock
```

After the nodejs dependencies have been installed you should also install a Postgres database. The recommended way is through docker using the commands below.

```
docker run -d --name=l2beat_postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
docker exec -it postgres psql -U postgres -c 'CREATE DATABASE l2beat_local'
docker exec -it postgres psql -U postgres -c 'CREATE DATABASE l2beat_test'
```

If you restart your system running `docker start postgres` will bring the database back online.

You should also obtain an api key for the following services:

- Alchemy: https://alchemy.com
- Etherscan: https://etherscan.io/apis

Once you have everything create a `.env` file with the following contents:

```
ETHERSCAN_API_KEY=your_etherscan_key
ALCHEMY_API_KEY=your_alchemy_key
LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
TEST_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_test
```

## Environment variables

You can configure the behavior of the app with the following environment variables:

- `ETHERSCAN_API_KEY` - Api key for Etherscan
- `ALCHEMY_API_KEY` - Api key for Alchemy
- `DATABASE_URL` - Database url used in production deployment
- `LOCAL_DB_URL` - Database url used in `yarn start`
- `TEST_DB_URL` - Database url used in `yarn test`
- `LOG_LEVEL` - Integer specifying the log level. See `src/services/Logger.ts`
- `PORT` - The port on which the application exposes the api

## Scripts

The scripts are the same with one new addition.

- `yarn start` - run the backend server.
