# @l2beat/frontend

The next.js app that is the face of L2BEAT.

## Setup

To run or develop the frontend you need to install and build its dependencies. You can do it by running the following
commands in the repository root:

```
yarn
yarn build:mock
```

To learn why we use `build:mock` instead of `build` please refer to the backend&apos;s
[README](https://github.com/l2beat/l2beat/blob/master/backend/README.md).

## Scripts

- `yarn start` - run the development server
- `yarn dev` - same as start
- `yarn build` - compile the production static site
- `yarn format` - check if formatting is correct with prettier
- `yarn format:fix` - run prettier automatic formatter
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn lint:fix` - run eslint automatic fixer
- `yarn test:fix` - runs `lint:fix`, `format:fix` and `typecheck`
- `yarn typecheck` - check if the code satisfies the typescript compiler
- `yarn gen:og-img` - generates social media previews
