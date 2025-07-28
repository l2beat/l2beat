# Bridges CLI

## How to run?
1. Make sure you have envs configured. See list of chains in `./chains.ts`, variables should follow a pattern `<UPPER_CASE_NAME>_RPC_URL`. In most cases if you have previously run L2BEAT backend you would have them configured.
2. Run pnpm script from `backend` folder
``` bash
pnpm bridges:cli <protocol> <chain> <block> <chain> <block>
```

## Examples

### LayerZero V1
``` bash
pnpm bridges:cli layerzerov1 ethereum 22970814 arbitrum 360189207
```
``` bash
pnpm bridges:cli layerzerov1 ethereum 22969147 arbitrum 360108534
```
``` bash
pnpm bridges:cli layerzerov1 ethereum 22956392 arbitrum 359491994
```

### AggLayer
``` bash
pnpm bridges:cli agglayer ethereum 22980710 polygonzkevm 24133897
```
``` bash
pnpm bridges:cli agglayer ethereum 22980856 katana 6519624
```

### Stargate
``` bash
pnpm bridges:cli stargate ethereum 22995640 arbitrum 361391483
```
``` bash
pnpm bridges:cli stargate base 33245251 arbitrum 360748226
```

### DeBridge
```bash
pnpm bridges:cli debridge ethereum 23017084 base 33454777
```
``` bash
pnpm bridges:cli debridge arbitrum 362432916 base 33455583
```
