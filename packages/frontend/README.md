# @l2beat/frontend

The dynamic, public-facing Next.js frontend of L2BEAT.

## Setup

To run or develop frontend you need to install and build its dependencies. You can do it by running the following
commands in the repository root:

```
pnpm install
pnpm build:dependencies
```

## Scripts

- `pnpm dev` - run the Next.js development server
- `pnpm dev:mock` - run the Next.js development server with mock data
- `pnpm build` - compile the production build
- `pnpm build:dependencies` - builds the dependencies of frontend
- `pnpm format` - run biome automatic formatter
- `pnpm format:fix` - run biome automatic formatter and apply the recommended changes
- `pnpm lint` - run linter
- `pnpm test` - run the tests
- `pnpm typecheck` - check if the code satisfies the typescript compiler
- `pnpm tinify-logos` - resizes and optimizes logos

### Environment variables
If you are running `pnpm dev:mock` you do not need any environment variables.

If you are running `pnpm dev` or `pnpm build` you need to set the following environment variables:
- create file `.env` in frontend root folder
- `DATABASE_URL` - database connection url (read-only access is sufficient)

*if you currently work at L2BEAT: feel free to directly connect to our staging DB* 😉