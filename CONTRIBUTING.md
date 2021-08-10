# Contributing to this repository

## Don't see your issue? Open one

You can browse [existing issues](https://github.com/l2beat/l2beat/issues) on our github repository.

If you find something wrong with the website or the data feel free to [open an issue](https://github.com/l2beat/l2beat/issues/new).

## Add your L2 project to the website

If you want to add a new L2 project you can do that by opening a PR. To do this you need to:

1. Fork the repository
2. Read the specification in `config/src/projects/types/Project.ts`. It contains an annotated data format for the project definition.
3. Modify `config/src/projects` by adding a new file describing your project. You can use the existing projects as reference.
4. Add your project into `config/src/projects/index.ts`. The order of the projects should be kept alphabetical.
5. Open a PR :D

Adding a new project in this way will automatically update both the data fetching logic as well as the frontend.

### Add missing tokens

If while adding your L2 you find that some of the tokens locked in it are missing from our token list do not worry.

1. Read the token definition in `config/src/tokens.ts`
2. Add your token to the list. The order of the tokens should be kept alphabetical.

## Contribute research

Each project defined in `config/src/projects` described by a set of parameters (`details.parameters`). Those values are a result of research conducted by the L2BEAT contributors. As with all research there may be mistakes, outdated information or missing data in those files.

You are encouraged to provide your feedback on the data presented on L2BEAT by [opening an issue](https://github.com/l2beat/l2beat/issues/new). Once consensus is reached on what the data presented should be we also very much welcome PRs.

## Contribute code

Make sure that you have the required dependencies installed:

- [node.js](https://nodejs.org/en/) - version 14
- [Yarn](https://classic.yarnpkg.com/en/docs/install) - version 1.22.0 or later

The L2BEAT website repository is a monorepo consisting of three interdependent projects.

1. `config` - the shared configuration that defines what projects and tokens are tracked by the website
2. `backend` - node script that fetches data from the blockchain and calculates metrics like TVL
3. `website` - statically generated site which displays data fetched by the backend

To learn more about each of the projects read their respective README's.
