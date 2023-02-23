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
- `yarn typecheck` - check if the code satisfies the typescript compiler

## Storybook

Production build requires (for some unknown reason) rebuilding dependencies in with ESM. Use `yarn storybook:build` to do exactly that. Run `yarn storybook:screenshot` to automatically screenshot whole storybook (used to enable visual regression).

##### Known issues

You should not import files that depend on node-related modules (e.g. fs) in stories. That will cause much pain searching for why the storybook is not working.
For example you should not import layer2s from config as it imports all projects and some of them use ProjectDiscovery that uses fs.

## Meta images

We use dedicated subpages (with storybooks) like: `meta-images/overview-scaling-activity/` to render meta images for given pages. Later these pages are crawled and screenshoted during build process (`packages/frontend/src/build/buildMetaImages.ts`) to generate final meta images. Meta image paths should be used in `getPageMetadata` files.
