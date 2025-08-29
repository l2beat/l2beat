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
- `pnpm start` - start the production server
- `pnpm start:mock` - start the production server with mock data
- `pnpm og-images` - generate OpenGraph images
- `pnpm tinify` - optimize images
- `pnpm new-project` - run og-images and tinify scripts (use after adding a new project in config)
- `pnpm performance-test` - run performance tests
- `pnpm size-test` - run data size tests
- `pnpm build:dependencies` - builds the dependencies of frontend
- `pnpm watch:dependencies` - watch and rebuild dependencies on changes
- `pnpm lint` - run linter
- `pnpm lint:fix` - run linter and fix issues
- `pnpm format` - run biome formatter
- `pnpm format:fix` - run biome formatter and fix issues
- `pnpm test` - run the tests
- `pnpm typecheck` - check if the code satisfies the typescript compiler
- `pnpm test-all-pages` - test all pages

### Environment variables
If you are running `pnpm dev:mock` you do not need any environment variables.

If you are running `pnpm dev` or `pnpm build` you need to set the following environment variables:
- create file `.env` in frontend root folder
- `DATABASE_URL` - database connection url (read-only access is sufficient)

*if you currently work at L2BEAT: feel free to directly connect to our staging DB* 😉