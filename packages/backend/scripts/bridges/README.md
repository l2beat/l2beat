# Bridges CLI

## How to run?
1. Make sure you have envs configured. See list of chains in `./chains.ts`, variables should follow a pattern `<UPPER_CASE_NAME>_RPC_URL`. In most cases if you have previously run L2BEAT backend you would have them configured.
2. Run pnpm script from `backend` folder
``` bash
pnpm bridges:cli <protocol> <chain> <block> <chain> <block>
```

## Examples

To find more examples go to https://explorer.range.org/transactions

### Across
```bash
pnpm bridges:cli across ethereum 23025199 base 33503830
```
```bash
pnpm bridges:cli across arbitrum 362819685 ethereum 23025205
```

### Agglayer
``` bash
pnpm bridges:cli agglayer ethereum 22980710 polygonzkevm 24133897
```
``` bash
pnpm bridges:cli agglayer ethereum 22980856 katana 6519624
```
```bash
pnpm bridges:cli agglayer katana 5380874 ethereum 22914279
```

### CCTP v1
```bash
pnpm bridges:cli cctpv1 arbitrum 363107844 base 33540292
```
```bash
pnpm bridges:cli cctpv1 base 33539279 ethereum 23031165
```

### CCTP v2
```bash
pnpm bridges:cli cctpv2 ethereum 23031281 base 33540613
```
```bash
pnpm bridges:cli cctpv2 base 33540730 arbitrum 363115009
```

### DeBridge
#### Orders
```bash
pnpm bridges:cli debridge ethereum 23017084 base 33454777
```
``` bash
pnpm bridges:cli debridge arbitrum 362432916 base 33455583
```
#### Messages
two claimed events in one transaction
```bash
pnpm bridges:cli debridge ethereum 23017204 base 33455479
```

### Hyperlane
```bash
pnpm bridges:cli hyperlane arbitrum 363163130 base 33546744
```
```bash
pnpm bridges:cli hyperlane base 33547228 optimism 139142527
```
```bash
pnpm bridges:cli hyperlane base 33576185 ethereum 23037172
```

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

### LayerZero V2
```bash
pnpm bridges:cli layerzerov2 arbitrum 363451284 base 33582730
```
```bash
pnpm bridges:cli layerzerov2 ethereum 23038245 arbitrum 363451759
```

### Stargate
``` bash
pnpm bridges:cli stargate ethereum 22995640 arbitrum 361391483
```
``` bash
pnpm bridges:cli stargate base 33245251 arbitrum 360748226
```

### Wormhole Portal
```bash
pnpm bridges:cli wormhole-portal base 33582518 ethereum 23038332
```
```bash
pnpm bridges:cli wormhole-portal ethereum 23026060 arbitrum 362865582
```

### Wormhole CCTP
```bash
pnpm bridges:cli wormhole-cctp base 33544977 ethereum 23032106
```
```bash
pnpm bridges:cli wormhole-cctp arbitrum 362121993 ethereum 23010854
```
