# @l2beat/backend

L2BEAT Data collection script. Because of the extensive amounts of data fetching it uses a cache to speed up the execution time.

## Setup

To run or develop the backend you need to install and build its dependencies. You can do it by running the following commands in the repository root:

```
yarn
cd config && yarn build
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
