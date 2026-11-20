# @l2beat/config

This is the shared config for the ETHBEAT website. It contains layer2 definitions and a list of tokens.

### Environment variables

Once you have everything create a `.env` file that configures the app's
environment variables. One variable per line `KEY=value`.

- `ETHERSCAN_API_KEY` - API key for Etherscan
- `CONFIG_ALCHEMY_API_KEY` - API key for Alchemy

#### .env boilerplate:

```bash
ETHERSCAN_API_KEY=
CONFIG_ALCHEMY_API_KEY=
```

## Scripts

- `pnpm build` - build the project
- `pnpm format:fix` - run biome automatic formatter
- `pnpm format` - check if formatting is correct with biome
- `pnpm lint:fix` - run biome automatic fixer
- `pnpm lint` - check if the code satisfies the biome configuration
- `pnpm test` - run tests
- `pnpm typecheck` - check if the code satisfies the typescript compiler
- `pnpm tokens` - update `src/tokens/generated.json` based on `src/tokens/tokens.jsonc`. `generated.jsonc` is a source of truth about each token data.
- `pnpm tokens:verify` - when checking a PR run it to see whether tokens were added using a script

### How to check PR which adds a new token?

1. Restore `generated.json` to state before PR `git checkout main --src/tokens/generated.json`
2. Run `pnpm tokens`
3. See whether git detected any changes - if not then it was added using our script

There is a handy script for it: `pnpm tokens:verify`

### How to review a privacy project?

Follow the [privacy adversaries framework](https://forum.ethbeat.org/t/privacy-adversaries-framework/455). The site publishes it at `/publications/privacy-methodology`.

### How to list a liquid staking protocol before reviewing it?

Add `src/projects/<id>/<id>.ts` with `liquidStakingListing` from `src/templates/liquidStakingListing.ts`, list it in `src/processing/refactored.ts`, and add `packages/frontend/static/icons/<id>.png`. The protocol gets a row on `/defi/liquid-staking` with "Not reviewed" in place of the risks, and no project page. Track as much as you can:

- TVL: `tvl: { source: 'l2beat' }` with a `tvs.json` next to the project file, or `source: 'defillama'` with the protocol's slug.
- Yield: `tracking.contracts` of type `rate`, with the view that returns the ETH one token is worth.
- Cost of exit: `tracking.marketQuotes`, the pools that sell the token for ETH or WETH.

To review it later, replace the template with a full project and add `liquidStaking.risks`.

### Tests dependencies

In some tests rpc calls to ethereum network are performed through Alchemy. In order to remove default mainnet url flakiness out of the equation it is possible to use a dedicated key through `CONFIG_ALCHEMY_API_KEY` environment variable (`.env` file is supported).

## Project blogs to get the news from

| Project                           | Blog URL                                                 |
| --------------------------------- | -------------------------------------------------------- |
| Arbitrum One, Arbitrum Nova       | https://medium.com/offchainlabs                          |
| Aztec, Aztec Connect              | https://medium.com/aztec-protocol                        |
| Boba Network                      | https://boba.network/blog/                               |
| DeGate                            | https://medium.com/degate                                |
| dYdX                              | https://dydx.exchange/blog                               |
| Fuel                              | https://fuel-labs.ghost.io/                              |
| Gluon                             | https://blog.leverj.io/                                  |
| Hermez                            | https://blog.hermez.io/, https://blog.polygon.technology |
| ImmutableX                        | https://medium.com/@immutablex                           |
| Layer2.Finance, Layer2.Finance-zk | https://blog.celer.network/                              |
| Loopring                          | https://medium.com/loopring-protocol                     |
| Metis                             | https://metisl2.medium.com/                             |
| myria                             | https://medium.com/@myriagames                           |
| OMGNetwork                        | -                                                        |
| Optimism                          | https://optimism.mirror.xyz/                             |
| Rhino.fi                          | https://rhino.fi/blog                                    |
| RSS3, Value Sublayer              | https://rss3.io/blog                                     |
| Sorare                            | https://medium.com/sorare                                |
| Starknet                          | https://medium.com/starkware                             |
| ZkSpace, ZkSwap V1, ZkSwap V2     | https://medium.com/@zkspaceofficial                      |
| zkSync                            | https://blog.matter-labs.io                              |
