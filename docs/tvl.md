# TVL documentation

## Introduction

L2BEAT is tracking TVL of L2 projects, you can take a look at [Value Locked Page](https://l2beat.com/scaling/tvl). You can also see more detailed breakdown when you click on one of the projects, e.g. [Arbitrum](https://l2beat.com/scaling/projects/arbitrum/tvl-breakdown)

As you can see there are three types of value:

- native - minted natively on this chain
- external - bridged from other chain via non-canonical bridge
- canonical - locked in the L1 escrow contracts on Ethereum

Everything you see here is achieved via proper configuration files in our repository.

## Token guide
1. Go to `config\src\tokens\tokens.jsonc`
2. Add your token to the proper chain

→ Canonically bridged tokens (CBV) should always be added to Ethereum, since they use Ethereum as a main ledger and are bridged to the L2 through the canonical bridge.
- The required fields are `symbol` **&** `address`.
- Optional fields are: `type`, `formula`, `category`, `bridgedUsing` & `coingeckoId`.
- By default, the `type` is `CBV`, the `formula` is `locked`, and the `category` is `other`.

→ Externally bridged tokens (EBV) and natively minted tokens (NMV) should be added to the token list of a specific L2.
- If the chain is missing in the file, you have to add it
- The required fields are symbol, address, type, formula. The optional fields are `category`, `bridgedUsing` & `coingeckoId`.
    - If the token is externally bridged, you have to add a `bridgedUsing` object, containing at least the `bridge` = the bridge name. If we have it on our website, you can also add a `slug`.
    - Make sure to run `yarn coingecko:platforms`. If the chain is not available there, you need to also specify the `coingeckoId`.
3. Save the file

4. If you’re adding externally bridged or natively minted tokens, go to the .ts file of the chain those are added to in `config\src\layer2s`
    - Check if there is `chainConfig` defined within `export const projectName: Layer2 = {}`
    - If not, it should be added with the following information:
        - `name` of the chain - should be the same as defined in the `tokens.jsonc` = the name of the .ts file
        - `chainId`
        - `explorerUrl`
        - `explorerApi{}`, containing `url` and `type`
        - `multicallContracts[]` - could be empty if not deployed
        - `minTimestampForTvl` - the timestamp of the first/second block on the chain
5. Save the file
6. Set environmental variables `<CHAIN>_RPC_URL` for the chains of the newly added tokens
7. Run `yarn tokens` within `\config`
**Never edit generated.json unless you know what you are doing.**
8. Commit changes & open the PR
