# Bridges CLI

## How to run?
1. Make sure you have envs configured. See list of chains in `./chains.ts`, variables should follow a pattern `<UPPER_CASE_NAME>_RPC_URL`. In most cases if you have previously run L2BEAT backend you would have them configured.
2. Run pnpm script from `backend` folder
```
pnpm bridges:cli
```
3. Script parameters (with examples)
- chains - Comma-separated list of chains, runs script only for them. If not provided will run for all chains. See chains.ts for possible values.
```
pnpm bridges:cli --chain=ethereum,arbitrum
```
- protocols - Comma-separated list of protocols, runs script only for them. If not provided will run for all protocols with decoders configured. See protocols.ts for possible values.
```
pnpm bridges:cli --protocols=across,gnosis
```
