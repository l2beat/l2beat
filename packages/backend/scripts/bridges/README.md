# Bridges CLI

## How to run?
1. Make sure you have envs configured. See list of chains in `./chains.ts`, variables should follow a pattern `<UPPER_CASE_NAME>_RPC_URL`. In most cases if you have previously run L2BEAT backend you would have them configured.
2. Run pnpm script from `backend` folder
```
pnpm bridges:cli
```
3. Script parameters (with examples)
- start - Starting block. If not passed will use "latest - range". Currently there is no support for per-chain starting blocks, you can only see latest for multiple chains.
```
pnpm bridges:cli --start=22867650
```
- range - Specify how many blocks to fetch (starting from starting block). Defaults to 100.
```
pnpm bridges:cli --range=10
```
- chains - Comma-separated list of chains, runs script only for them. If not provided will run for all chains. See chains.ts for possible values.
```
pnpm bridges:cli --chain=ethereum,arbitrum
```
- protocols - Comma-separated list of protocols, runs script only for them. If not provided will run for all protocols with decoders configured. See protocols.ts for possible values.
```
pnpm bridges:cli --protocols=across,gnosis
```

## Example output
```
across on ethereum (FilledRelay)
    {
      origin: 'base',
      destination: 'ethereum',
      token: 'WETH',
      amount: 0.0039,
      sender: '0xd3824172c4a02a9be95a4ddb68743b517fc82489',
      receiver: '0xd3824172c4a02a9be95a4ddb68743b517fc82489',
      txHash: '0x67215340aef856d1dc174253889bc8cc1db720501b535bcdfbd7214d65467a5b',
      explorerLink: 'https://etherscan.io/tx/0x67215340aef856d1dc174253889bc8cc1db720501b535bcdfbd7214d65467a5b',
      id: '4205024'
    }
```
