# Contributing to this repository

🔍 step-by-step guide for creating a Pull Request - [link](https://www.notion.so/l2beat/How-to-add-milestones-0e8684a83c3c48ce8bc7b605d9c9a1bf)

## Don't see your issue? Open one

You can browse [existing issues](https://github.com/l2beat/l2beat/issues) on our github repository.

If you find something wrong with the website or the data feel free to [open an issue](https://github.com/l2beat/l2beat/issues/new).

## Cloning the repository

We encourage you to fork our repository first and then clone your fork. That way the changes you make will be visible in your repository after you push and you can easily make pull requests. It's easy:

https://github.com/l2beat/l2beat/fork

## Installing dependencies

To do any development work, even simple config changes you probably want to have the project running locally. To install dependencies do the following.

1. Install [node.js](https://nodejs.org/en/) version 16. To easily manage node versions we recommend [fnm](https://github.com/Schniz/fnm)
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable), preferably through `npm i -g yarn`
3. In the repository root run `yarn` to install project specific dependencies

## Running the website locally

If you're planning working only on the frontend part of the website (i.e. you don't care what data is actually displayed) then it's quite easy. Just run the following commands after having cloned the repository:

```
yarn
yarn build:frontend
cd packages/frontend
yarn start
```

## Add your L2 project to the website

If you want to add a new L2 project you can do that by opening a PR. To do this you need to:

1. Read the specification in `packages/config/src/projects/types/Project.ts`. It contains an annotated data format for the project definition.
2. Modify `packages/config/src/projects` by adding a new file describing your project. You can use the existing projects as reference.
3. Add your project into `packages/config/src/projects/index.ts`. The order of the projects should be kept alphabetical.
4. Add an 256x256 png project icon under 10KB into `packages/frontend/static/icons`.
5. Open a PR :D

Adding a new project in this way will automatically update both the data fetching logic as well as the frontend.

### Add missing tokens

If while adding your L2 you find that some of the tokens locked in it are missing from our token list do not worry.

1. Read the token definition in `packages/config/src/tokens.ts`
2. Check if the token matches the requirements.
3. Add your token to the list. The order of the tokens should be kept alphabetical.

## Contribute research

Each project defined in `packages/config/src/projects` described by a set of parameters (`details.parameters`). Those values are a result of research conducted by the L2BEAT contributors. As with all research there may be mistakes, outdated information or missing data in those files.

You are encouraged to provide your feedback on the data presented on L2BEAT by [opening an issue](https://github.com/l2beat/l2beat/issues/new). Once consensus is reached on what the data presented should be we also very much welcome PRs.

## Contribute code

The L2BEAT website repository is a monorepo consisting of many interdependent packages.

1. `packages/common` - common utils used by the other packages
2. `packages/config` - the shared configuration that defines what projects and tokens are tracked by the website
3. `packages/backend` - a backend server that downloads balances from chain and exposes and API for the frontend
4. `packages/frontend` - statically generated site which displays data fetched from the backend API

To learn more about each of the projects read their respective README's.
