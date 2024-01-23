# TVL documentation

## Introduction

L2BEAT is tracking TVL of L2 projects, you can take a look at [Value Locked Page](https://l2beat.com/scaling/tvl). You can also see more detailed breakdown when you click on one of the projects, e.g. [Arbitrum](https://l2beat.com/scaling/projects/arbitrum/tvl-breakdown)

As you can see there are three types of value:

- native - minted natively on this chain
- external - bridged from other chain via non-canonical bridge
- canonical - locked in the L1 escrow contracts on Ethereum

Everything you see here is achieved via proper configuration files in our repository.

## Token guide

1. Go to `config\src\tokens\source.jsonc`
2. Add your token to the proper chain

   - required fields are: **symbol & address**
   - optional fileds are: type, formula, category, bridgedUsing & coingeckoId
   - for `ethereum` the `type` and `formula` are `CBV` and `locked` by default, for other chains you need to specify it
   - `category` is `other` by default
   - if you do not see your chain run `yarn coingecko:platforms` (TODO: update docs when dynamic chains functionality is merged)

3. Save the file
4. Set environmental variable `<CHAIN>_RPC_URL`
5. Run `yarn tokens`
6. Commit changes & open the PR

**Never edit generated.json until you know what you are doing**
