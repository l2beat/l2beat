# @l2beat/frontend2

The dynamic, public-facing Next.js frontend of L2BEAT.

## Setup

To run or develop frontend2 you need to install and build its dependencies. You can do it by running the following
commands in the repository root:

```
yarn
yarn build:dependencies
```

## Scripts

- `yarn dev` - run the Next.js development server
- `yarn dev:mock` - run the Next.js development server with mock data
- `yarn build` - compile the production build
- `yarn build:dependencies` - builds the dependencies of frontend2
- `yarn format` - run biome automatic formatter
- `yarn format:fix` - run biome automatic formatter and apply the recommended changes
- `yarn lint` - run Next.js doctor and ESLint
- `yarn test` - run the tests
- `yarn typecheck` - check if the code satisfies the typescript compiler
- `yarn tinify-logos` - resizes and optimizes logos

### Environment variables
If you are running `yarn dev:mock` you do not need any environment variables.

If you are running `yarn dev` or `yarn build` you need to set the following environment variables:
- create file `.env.local` in frontend2 root folder
- `DATABASE_URL` - database connection url (read-only access is sufficient)

*if you currently work at L2BEAT: feel free to directly connect to our staging DB* 😉