# @protocol-beat/backend

## Setup

### Dependencies

To run or develop the backend you need to install and build its dependencies. You can do it by running the following commands in the repository root:

```
yarn
yarn build
```

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

- `ETHERSCAN_API_KEY` - API key for Etherscan
- `ALCHEMY_API_KEY` - API key for Alchemy

#### Optional

- `LOG_LEVEL` (Optional) - Integer specifying the log level. `0` - none, `1` - error, `2` - warn, `3` - info, `4` - debug
- `PORT` (Optional) - The port on which the application exposes the api

#### .env boilerplate:

```bash
ETHERSCAN_API_KEY=
ALCHEMY_API_KEY=
#LOG_LEVEL=
#PORT=
```

## Scripts

- `yarn build` - build
- `yarn format:fix` - run prettier automatic formatter
- `yarn format` - check if formatting is correct with prettier
- `yarn lint:fix` - run eslint automatic fixer
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn dev` - run the backend server from source ts
- `yarn start` - run the backend server from built js
- `yarn test` - run tests
- `yarn typecheck` - check if the code satisfies the typescript compiler
