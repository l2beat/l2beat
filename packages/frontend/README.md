# @l2beat/frontend

The legacy, statically generated frontend that is the face of L2BEAT.

## Frontend migration

This is the legacy frontend and most of the work is now happening in `../frontend2`. Some pages will return 404, in which case it (probably) means that the page has been migrated to the new Next.js codebase.

## Setup

To run or develop the frontend you need to install and build its dependencies. You can do it by running the following
commands in the repository root:

```
yarn
yarn build:frontend
```

## Scripts

- `yarn start` - run the development server
- `yarn build` - compile the production static site
- `yarn format` - check if formatting is correct with biome
- `yarn format:fix` - run biome automatic formatter
- `yarn lint` - check if the code satisfies the biome configuration
- `yarn lint:fix` - run biome automatic fixer
- `yarn typecheck` - check if the code satisfies the typescript compiler


#### .env boilerplate:

```bash
TINIFY_API_KEY=
```

## Storybook

Production build requires (for some unknown reason) rebuilding dependencies with ESM. Use `yarn storybook:build` to do exactly that.

##### Known issues

You should not import files that depend on node-related modules (e.g. fs) in stories. That will cause much pain searching for why the storybook is not working.
For example you should not import layer2s from config as it imports all projects and some of them use ProjectDiscovery that uses fs.
