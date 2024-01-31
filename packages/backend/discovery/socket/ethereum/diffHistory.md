Generated with discovered.json: 0x557a3f33a69a7f6cd9754ee887b8769d36fcd4ef

# Diff at Wed, 31 Jan 2024 16:00:37 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@651e5154adab97c11eebd6d7e362af2c46ea0c6e block: 19126484
- current block number: 19127499

## Description

New plugs added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126484 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab) {
    }
```

```diff
+   Status: CREATED
    contract USDT Vault (0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa) {
    }
```

```diff
+   Status: CREATED
    contract USDT Vault (0xD3F39174Ee7937381e19d682FfEa40968266FA3E) {
    }
```

```diff
+   Status: CREATED
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e) {
    }
```

Generated with discovered.json: 0x27bd701904bb21c706ab1fea624a84968e3fa15f

# Diff at Wed, 31 Jan 2024 12:32:59 GMT

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e27d63e182fc6d33d67f67df00e2990c9700987e block: 19085063
- current block number: 19126484

## Description

Two new plugs.
Ignore `globalMessageCount` in watch mode.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
      values.plugs[12]:
+        "0x37091ade7C4E1A914D3155449e25eE91DA08EbE4"
      values.plugs[11]:
+        "0x280D208f0eE2f053A0441099bcBFf298bc8b9444"
    }
```

Generated with discovered.json: 0x7e76d559dbb49ba64aaea7b6263c85048220674d

# Diff at Thu, 25 Jan 2024 17:16:49 GMT

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19085063

## Description

Several new Switchboards created: PolygonL1Switchboard, OptimismSwitchboard2, OptimismSwitchboard, FastSwitchboard, ArbitrumL1Switchboard.

## Initial discovery

```diff
+   Status: CREATED
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    }
```

```diff
+   Status: CREATED
    contract CapacitorFactory (0x11Fbb9116801DB54bB51fF4dF423e34E8b45fc9a) {
    }
```

```diff
+   Status: CREATED
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    }
```

```diff
+   Status: CREATED
    contract Hasher (0x5C71beE4a6b0D617D8c3d107D331292741789E27) {
    }
```

```diff
+   Status: CREATED
    contract USDC Vault (0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d) {
    }
```

```diff
+   Status: CREATED
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    }
```

```diff
+   Status: CREATED
    contract FastSwitchboard (0xD5a83a40F262E2247e6566171f9ADc76b745F5cD) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    }
```

```diff
+   Status: CREATED
    contract TransmitManager (0xeD037aFBffC65a94E9CC592947E851FB2f730341) {
    }
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0xf1ABF110d1B6ff0E2e8C05dd64FBF9eBA4d8af98) {
    }
```

```diff
+   Status: CREATED
    contract ExecutionManager (0xFB4dcD94A051a1D2cF3EaF713a2Ef686653884E0) {
    }
```
