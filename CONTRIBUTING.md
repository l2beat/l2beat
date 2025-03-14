# Contributing to this repository

🔍 step-by-step guide for creating a Pull Request, using the Milestones as an example -
[link](https://l2beat.notion.site/How-to-add-milestones-to-L2BEAT-0e8684a83c3c48ce8bc7b605d9c9a1bf)

## Don't see your issue? Open one

You can browse [existing issues](https://github.com/l2beat/l2beat/issues) on our github repository.

If you find something wrong with the website or the data feel free to
[open an issue](https://github.com/l2beat/l2beat/issues/new).

## Cloning the repository

We encourage you to fork our repository first and then clone your fork. That way the changes you
make will be visible in your repository after you push and you can easily make pull requests. It's
easy:

https://github.com/l2beat/l2beat/fork

## Installing dependencies

To do any development work, even simple config changes you probably want to have the project running
locally. To install dependencies do the following.

1. Install [node.js](https://nodejs.org/en/) version 18. To easily manage node versions we recommend
   [fnm](https://github.com/Schniz/fnm).
2. In the repository root, run `node --version > .node-version` to set the node version. Please do not commit this file.
3. Install [pnpm](https://pnpm.io/installation#using-corepack), preferably using Corepack
   `corepack enable pnpm`
4. In the repository root, run `pnpm install` to install project specific dependencies.
5. In the repository root, run `pnpm build:dependencies` to build the dependencies.

Please note that you will want to run `pnpm install` after you perform a `git pull` on your cloned repository. You may also need to run `pnpm build:dependencies` if new dependencies have been added. Failure to do this may result in errors that are difficult to diagnose.

## Running the website locally

If you're planning working only on the frontend part of the website (i.e. you don't care what data
is actually displayed) then it's quite easy. Just run the following commands after having cloned the
repository:

```
pnpm install
pnpm build:dependencies
cd packages/frontend
pnpm dev:mock
```

Once you have the frontend website running, you will probably wish to explore the `discovery` tool described in its [README](packages/discovery/README.md).

To explore the projects currently tracked, see the TypeScript files under [packages/config/src/projects](packages/config/src/projects).

The website will be available on http://localhost:3000/

## Running the website with data

Running the website with data requires a database. Setting up that database is complicated and underdocumented for the moment. Please raise an issue or contact L2Beat support if you require assistance.

If you are a member of the L2Beat organization on GitHub, opening a pull request will prompt [vercel](https://vercel.com) to run a container including live data. Vercel will comment on your PR with the container's URL. NB: Vercel's post-commit hook will also respond to _draft_ PRs so you may wish to use a draft PR to avoid spamming administrators until you are ready for their review.

## Add tokens to a project

If while adding your project you find that some of the tokens locked in it are missing from our
token list do not worry.

General token prerequisites (without these your token CANNOT be added):
* Price data on Coingecko: Every token needs to be listed with current price data on Coingecko. (Not just as preview, not just on CoingeckoTerminal)
* For natively minted tokens: Circulating supply data on Coingecko is essential.

### Steps to add a token

1. Study the general prerequisites (see above) and check if your token complies.
2. Add your token to the list (`packages/config/src/tokens/tokens.jsonc`). The order of the tokens should be kept alphabetical.
3. Run `pnpm tokens` in the `packages/config/` directory.

Refer to the [docs - tvl.md](docs/tvl.md) for further token insights.

## Add your project project to the website

If you want to add a new project you can do that by opening a PR. To do this you need to:

1. Read the specification in `packages/config/src/internalTypes.ts`. It
   contains an annotated data format for the project definition.
2. Add a directory to describe your project inside
   `packages/config/src/projects`. You can use the existing projects and
   templates (e.g. OP stack and Orbit stack templates in
   `packages/config/src/templates/`) as reference.
3. Add your project into `packages/config/src/processing/layer2s.ts` or
   `packages/config/src/processing/layer3s.ts`. The order of the projects
   should be kept alphabetical.
4. Add a square PNG project icon with a minimum size of 128x128 pixels to
   `packages/frontend/public/icons`. From the `packages/frontend` directory run
   `pnpm tinify-logos` afterwards to reduce its size.
5. Run the website locally to check out your changes. (optional, see above)
6. Make sure that things like linting, formatting and tests are all passing. To
   check their status you can run `pnpm lint:fix`, `pnpm format:fix` or `pnpm
   test` respectively. We greatly encourage doing this before the last step as
   it shortens the amount of time needed for your project to be added.
7. Open a PR :D
8. If your changes contain any errors we might want to fix them ourselves. To
   make this as easy as possible please enable **"Allow edits by
   maintainers"**. Otherwise the latency before we can merge a PR greatly
   increases.

Adding a new project in this way will automatically update both the data fetching logic as well as
the frontend.

## Contribute research

Each project defined in `packages/config/src/projects` described by a set of parameters
(`details.parameters`). Those values are a result of research conducted by the L2BEAT contributors.
As with all research there may be mistakes, outdated information or missing data in those files.

You are encouraged to provide your feedback on the data presented on L2BEAT by
[opening an issue](https://github.com/l2beat/l2beat/issues/new). Once consensus is reached on what
the data presented should be we also very much welcome PRs.

## Contribute code

The L2BEAT website repository is a monorepo consisting of many interdependent packages. To learn more about each of the projects read their respective README's.
