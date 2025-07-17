# TVS documentation

## Introduction

L2BEAT is tracking TVS of L2 projects, you can take a look at [Value Locked Page](https://l2beat.com/scaling/tvs). You can also see more detailed breakdown when you click on one of the projects, e.g. [Arbitrum](https://l2beat.com/scaling/projects/arbitrum/tvs-breakdown)

As you can see there are three types of value depending on the `source`:

- `canonical` - Canonically Bridged Value - locked in the L1 escrow contracts on Ethereum
- `external` - Externally Bridged Value - bridged from other chain via non-canonical bridge
- `native` - Natively Minted Value - minted natively on this chain

or type

- `ether` - ether 
- `stablecoin` - all stables 
- `other` - all other tokens


## Configuration

TVS configuration is represented as a set of JSON documents (one for each project) located in `/packages/config/src/tvs`. Each file represent an explicit list of tokens, along with all required properties which will be used to calculate project's TVS.


   - `mode` - it can be either  `auto` or  `custom` (more on this subject in [Automatic vs manual configuration](#Automatic-vs-manual-configuration) section)
   - `id` - arbitrarily assigned unique token identifier (usually in a form `<chain>-<symbol>`)
   - `priceId` - id of a token in 3rd party API (currently it's Coingecko)
   - `symbol` - symbol of a token
   - `name` - display name
   - `iconUrl`- url to toke icon (optional)
   - `amount` - formula to capture the amount of the token on a given chain along with it's value (amount * price)
   - `valueForProject` - formula to calculate value of the token within project's total (i.e. to prevent double counting when token was used for lock-minting some other token)
   - `valueForSummary` - formula to calculate value of the token within total of all projects (i.e. to prevent double counting when token was bridged from L2 to L3)
   - `category`- category of a token ( `ether`, `stablecoin`, `other`)
   - `source` - source of the token (`canonical`, `external`, `native`)
   -  `isAssociated`- is token associated with project (for example gov tokens)

### Formulas 

As there are endless possibilities for token implementation (native gas tokens, ERC-20, pre-minted, shared escrows, etc.) checking total supply or balance of an escrow would not suffice to handle all of them. Thus we have introduced `formulas` which allow to define how value will be calculated in a very generic way.

There are three types of formulas:

- `AmountFormula` - describes how the amount of a given token will be captured. Currently we support for types of amount formulas: `balanceOfEscrow`, `totalSupply`, `starknetTotalSupply`, `circulatingSupply` or `const`
```
{
   type: 'balanceOfEscrow'
   chain: string
   sinceTimestamp: UnixTime
   untilTimestamp?: UnixTime
   address: EthereumAddress | 'native'    // address of a token contract (if set to native we will check balance of a gas token)
   decimals: number
   escrowAddress: EthereumAddress         // address of escrow
 }
 
{
   type: 'totalSupply'
   chain: string
   sinceTimestamp: UnixTime
   untilTimestamp?: UnixTime
   address: EthereumAddress                // address of a token contract
   decimals: number
 }

 {
   type: 'starknetTotalSupply'
   chain: string
   sinceTimestamp: UnixTime
   untilTimestamp?: UnixTime
   address: string                        // address of a token contract
   decimals: number
 }
 
{
   type: 'circulatingSupply'
   sinceTimestamp: UnixTime
   untilTimestamp?: UnixTime
   apiId: string                          // id of a token in 3rd party API (currently it's Coingecko)
   decimals: number
 }
 
{
   type: 'const'
   sinceTimestamp: UnixTime
   untilTimestamp?: UnixTime
   value: string                          // constant value represented as BigInt string
   decimals: number
}
```
- `ValueFormula` - describes how the value of a given token will be transformed to value expressed in USD (amount * price)
```
{
   type: 'value'
   amount: AmountFormula | CalculationFormula
   priceId: string                        // id of a token in 3rd party API (currently it's Coingecko)
 }
```
- `CalculationFormula` - allows to apply various calculations on value and amount formulas
```
{
   type: 'calculation'
   operator: 'sum' | 'diff' | 'max' | 'min'
   arguments: (CalculationFormula | ValueFormula | AmountFormula)[]
}
```

Examples:

- simple ERC-20 token 

```
{
   "mode": "auto",
   "id": "arbitrum-ARB",
   "priceId": "arbitrum",
   "symbol": "ARB",
   "name": "Arbitrum",
   "amount": {
      "type": "circulatingSupply",
      "apiId": "arbitrum",
      "decimals": 18,
      "sinceTimestamp": 1679529600,
      "address": "0x912CE59144191C1204E64559FE8253a0e49E6548",
      "chain": "arbitrum"
   },
   "category": "other",
   "source": "native",
   "isAssociated": true
   },
```

- preminted token - to calculate value we need to subtract constant value from total supply

```
{
   "mode": "auto",
   "id": "celo-USDT-1",
   "priceId": "tether",
   "symbol": "USDT",
   "name": "Tether USD",
   "amount": {
      "type": "calculation",
      "operator": "diff",
      "arguments": [
         {
            "type": "totalSupply",
            "address": "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
            "chain": "celo",
            "decimals": 6,
            "sinceTimestamp": 1742960663
         }, 
         {
            "type": "const",
            "value": "323024420080000",
            "decimals": 6,
            "sinceTimestamp": 1742960663
         }
      ]
   },
   "category": "stablecoin",
   "source": "native",
   "isAssociated": false
   },
```

- lock-minting - to calculate value of a token (WBTC) for project's total we need to subtract value locked to mint some other token (SolveBTC) from it's total supply (otherwise we would be double counting)
```
{
   "mode": "custom",
   "id": "bob-WBTC",
   "priceId": "wrapped-bitcoin",
   "symbol": "WBTC",
   "name": "Wrapped BTC",
   "amount": {
      "type": "totalSupply",
      "address": "0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3",
      "chain": "bob",
      "decimals": 8,
      "sinceTimestamp": 1712862107
   },
   "valueForProject": {
      "type": "calculation",
      "operator": "diff",
      "arguments": [
         {
            "type": "value",
            "priceId": "wrapped-bitcoin",
            "amount": {
               "type": "totalSupply",
               "address": "0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3",
               "chain": "bob",
               "decimals": 8,
               "sinceTimestamp": 1712862107
            }
         },
         {
            "type": "value",
            "priceId": "wrapped-bitcoin",
            "amount": {
               "type": "balanceOfEscrow",
               "address": "0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3",
               "chain": "bob",
               "decimals": 8,
               "escrowAddress": "0x33b7A7a164B77433A61d4B49bD780a2718812e6e",
               "sinceTimestamp": 1712862107
            }
         }
      ]
   },
   "category": "other",
   "source": "canonical",
   "isAssociated": false,
   }
```


### Automatic vs manual configuration

TVS configuration can be either created manually by editing the JSON file and setting the mode of tokens to `manual` or automatically by using following script:

```
pnpm tvs:generate [project] [--include-zero-amounts | --exclude | --help]
```

- `project` - provide the id of a project for which you want to calculate TVS (if empty TVS will be calculated for all projects)
- `include-zero-amounts` - by default config generation remove tokens which final value is zero, you can disable this 
- `exclude` - coma delimited list of projects to exclude from config generation (in case of temporary issues) 

This script uses two inputs:

- Token list -  manually maintained list of tokens to track - `/packages/config/src/tokens/generated.json`
- Project configuration - `.ts` files with project definition (especially escrows and apis like RPC)

This two-step config generation script will be soon replace by Token Discovery


### Local execution

As TVS configuration can quickly become very complex we have introduced a tool that allows to execute it locally and verify the final values 

```
pnpm tvs:execute [project] [--timestamp | --help]
```

- `project` - provide the id of a project for which you want to calculate TVS (if empty TVS will be calculated for all projects)
- `timestamp` - provide a timestamp for which TVS will be calculated (if not provided `UTC.now() - 2h` will be assumed)


Sample output:

```
12:31:25.207 INFO Using timestamp 1745827200 (Mon, 28 Apr 2025 08:00:00 GMT)
12:31:25.213 INFO Preloading prices and amounts from DB
12:31:37.545 INFO TVS: $11.41B
12:31:37.545 INFO Go to ./scripts/tvs/breakdown.json for more details
12:31:37.545 INFO TVS execution completed in 12.34s
```

Detailed breakdown along with values for all configured tokens can be found in `./scripts/tvs/breakdown.json`


### Script setup

Both scripts `tvs:generate` and `tvs: execute` use share the same data and there are two things that can make execution much faster:

- local cache - it is enabled by default and persisted in JSON file: `/packages/backend/scripts/tvs/local-data.json`. It can grow in size pretty quickly so make sure you clean (delete) it once in a while
- DB connection - some of the data required to execute TVS may have already been fetched by our BE. If you provide connection string to via `TVS_DB_URL` env var the script will check it first. Make sure that you use READONLY credentials.

