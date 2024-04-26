# @l2beat/frontend

The statically generated frontend that is the face of L2BEAT.

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
- `yarn format` - check if formatting is correct with prettier
- `yarn format:fix` - run prettier automatic formatter
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn lint:fix` - run eslint automatic fixer
- `yarn tinify-logos` - resizes and optimizes logos
- `yarn typecheck` - check if the code satisfies the typescript compiler

### Environment variables

- `TINIFY_API_KEY` - API key for Tinify, useful if you are adding/changing logo of a project (500 compressions per month are free)

#### .env boilerplate:

```bash
TINIFY_API_KEY=
```

## Storybook

Production build requires (for some unknown reason) rebuilding dependencies in with ESM. Use `yarn storybook:build` to do exactly that.

##### Known issues

You should not import files that depend on node-related modules (e.g. fs) in stories. That will cause much pain searching for why the storybook is not working.
For example you should not import layer2s from config as it imports all projects and some of them use ProjectDiscovery that uses fs.
