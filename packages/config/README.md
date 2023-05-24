# @l2beat/config

This is the shared config for the L2BEAT website. It contains layer2 definitions and a list of tokens.

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

- `yarn build` - build the project
- `yarn format:fix` - run prettier automatic formatter
- `yarn format` - check if formatting is correct with prettier
- `yarn lint:fix` - run eslint automatic fixer
- `yarn lint` - check if the code satisfies the eslint configuration
- `yarn test` - run tests
- `yarn typecheck` - check if the code satisfies the typescript compiler
- `yarn check-verified-contracts` - verify whether source code of given address is verified on Etherscan
- `yarn tokens:add <address> <category>` - add new token to the config

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
| Metis                             | https://medium.com/@MetisDAO                             |
| myria                             | https://medium.com/@myriagames                           |
| OMGNetwork                        | -                                                        |
| Optimism                          | https://optimism.mirror.xyz/                             |
| Rhino.fi                          | https://rhino.fi/blog                                    |
| Sorare                            | https://medium.com/sorare                                |
| Starknet                          | https://medium.com/starkware                             |
| ZkSpace, ZkSwap V1, ZkSwap V2     | https://medium.com/@zkspaceofficial                      |
| zkSync                            | https://blog.matter-labs.io                              |
