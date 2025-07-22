# Bridges CLI

## How to run?
1. Make sure you have envs configured. See list of chains in `./chains.ts`, variables should follow a pattern `<UPPER_CASE_NAME>_RPC_URL`. In most cases if you have previously run L2BEAT backend you would have them configured.
2. Run pnpm script from `backend` folder
```
pnpm bridges:cli <protocol> <chain> <block> <chain> <block>
```

## Examples

### LayerZero V1
```
pnpm bridges:cli layerzerov1 ethereum 22970814 arbitrum 360189207
```
```
pnpm bridges:cli layerzerov1 ethereum 22969147 arbitrum 360108534
```
```
pnpm bridges:cli layerzerov1 ethereum 22956392 arbitrum 359491994
```
