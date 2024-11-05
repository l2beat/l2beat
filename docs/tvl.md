# TVL documentation

## Introduction

L2BEAT is tracking TVL of L2 projects, you can take a look at [Value Locked Page](https://l2beat.com/scaling/tvl). You can also see more detailed breakdown when you click on one of the projects, e.g. [Arbitrum](https://l2beat.com/scaling/projects/arbitrum/tvl-breakdown)

As you can see there are three types of value - the `source`:

- `canonical` - Canonically Bridged Value - locked in the L1 escrow contracts on Ethereum
- `external` - Externally Bridged Value - bridged from other chain via non-canonical bridge
- `native` - Natively Minted Value - minted natively on this chain

Each token can also have one of three methods of calculating its contribution to TVL - the `supply`:

- `totalSupply` - tracks the total supply of the token
- `circulatingSupply` - tracks the circulating supply of the token
- `zero` - does not contribute to TVL by itself

All this is achieved via proper configuration files in our repository.

## Token guide

1. Go to `config\src\tokens\tokens.jsonc`
2. Add your token to the proper chain

   Canonically bridged tokens (canonical) should always be added to Ethereum, since they use Ethereum as a main ledger and are bridged to the L2 through the canonical bridge.

   - The required fields are `symbol` & `address`.
   - Optional fields are: `source`, `supply`, `category`, `bridgedUsing` & `coingeckoId`.
   - By default, the `source` is `canonical`, the `supply` is `zero`, and the `category` is `other`.

   Externally bridged tokens (EBV) and natively minted tokens (NMV) should be added to the token list of a specific L2.

   - If the chain is missing in the file, you have to add it, see the next section for details
   - The required fields are `symbol`, `address`, `source`, `supply`. The optional fields are `category`, `bridgedUsing` & `coingeckoId`.
   - If the token is externally bridged, you have to add a `bridgedUsing` object, containing at least the `bridge` = the bridge name. If we have it on our website, you can also add a `slug`.
   - If the chain is not available when you run `pnpm coingecko:platforms`, you need to also specify the `coingeckoId`.

3. Save the file
4. Set environmental variables `<CHAIN>_RPC_URL` for the chains of the newly added tokens
5. Run `pnpm tokens` within `packages/config`

   **Never edit generated.json unless you know what you are doing.**

6. Commit changes & open the PR

## Chain guide

Go to the .ts file of the chain those are added to in `config\src\layer2s`,

- Check if there is `chainConfig` defined within `export const projectName: Layer2 = {}`
- If not, it should be added with the following information:
  - `name` of the chain - should be the same as defined in the `tokens.jsonc`
  - `chainId`
  - `explorerUrl`
  - `explorerApi{}`, containing `url` and `type`
  - `multicallContracts[]` - could be empty if not deployed
  - `minTimestampForTvl` - the timestamp of the first/second block on the chain
  - `coingeckoPlatform` - the name of the platform on Coingecko. Check `pnpm coingecko:platforms`.
