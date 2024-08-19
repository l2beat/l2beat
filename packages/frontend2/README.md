# @l2beat/frontend2

The dynamic Next.js frontend will be the new face of L2BEAT.

## Setup

To run or develop frontend2 you need to install and build its dependencies. You can do it by running the following
commands in the repository root:

```
yarn
yarn build:dependencies
```

## Scripts

- `yarn dev` - run the Next.js development server
- `yarn build` - compile the production build
- `yarn build:dependencies` - builds the dependencies of frontend2
- `yarn format` - run biome automatic formatter
- `yarn format:fix` - run biome automatic formatter and apply the recommended changes
- `yarn lint` - run Next.js doctor and ESLint
- `yarn test` - run the tests
- `yarn typecheck` - check if the code satisfies the typescript compiler

### Environment variables
Only required variables are listed there. For a complete list check out `src/env.js`.

- `DATABASE_URL` - database connection url (read-only access is sufficient)

*if you currently work at L2BEAT: feel free to directly connect to our staging DB* 😉

#### .env boilerplate:

```bash
DATABASE_URL=
```

### Known issues

`frontend2`, while on production, is still in the early stage of development. When running it locally and trying to navigate to a page that is not migrated yet (main page included), you'll encounter an Internal Server Error.

#### Fully ported pages
- /scaling
  * /risks
  * /data-availability
  * /finality
  * /costs
  * /liveness
- /donate
- /faq
- /glossary
- /governance
- /zk-catalog

### Work-in-progress pages:
- /scaling/summary (available at /scaling-next/summary)

The rest of pages are still present in the legacy frontend.
