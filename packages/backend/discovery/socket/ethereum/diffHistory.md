Generated with discovered.json: 0xce7bfd338e208ebb4e3ce8a443525d2c636ed6ce

# Diff at Fri, 05 Apr 2024 08:24:08 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@a911910b5e2265ea9037cf3122956a3c9707d183 block: 19532195
- current block number: 19588327

## Description

A plug is added.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
+++ description: Array of plug contract addresses
+++ type: CODE_CHANGE
+++ severity: LOW
      values.plugs.18:
+        "0x6A769e25081396a49a6702758d0830920ac1163A"
    }
```

```diff
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2986807183575385281668118"
+        "2997542922595290340510005"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532195 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract WBTC Vault (0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SNX Vault (0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault 2 (0xB39DF6BBB1Cf2B609DeE43F109caFEFF1A7CCBEa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH Vault (0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH Vault (0xeBB5D642aA8ccDeE98373D6aC3ee0602b63824b3)
    +++ description: None
```

Generated with discovered.json: 0x5f06851d6935822ec7d2e9ae5ae731d06d295cb6

# Diff at Thu, 28 Mar 2024 11:05:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19497754
- current block number: 19532195

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19497754 (main branch discovery), not current.

```diff
    contract USDCVaultOwner (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x255f035589a4edd15c65708c90afa4cdecca5909

# Diff at Fri, 22 Mar 2024 07:51:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@022e2fdbd062a978ff7ecc702973b614915f5846 block: 19483658
- current block number: 19488785

## Description

More bridging fee changes.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5884471559011500
+        4244501643700500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        3278655744000
+        824668780000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        4307646578800500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        340928172000
+        359338720000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        5568057713790000
+        3270848270917500
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        6280699596483000
+        4386707880087000
    }
```

Generated with discovered.json: 0x9c077c8bf899c1f9ec86477b7bf996418783348f

# Diff at Thu, 21 Mar 2024 14:34:30 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@550e8c13dc36da304ad797c4c213a735d633c96b block: 19389434
- current block number: 19483658

## Description

Bridging fees are raised (doubled) for the optimism switchboards.

## Watched changes

```diff
    contract PolygonL1Switchboard (0x053407DFA30267f6332f3c94a9e9F704A55e62CD) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2700564286365000
+        5884471559011500
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        1196689560000
+        3278655744000
    }
```

```diff
    contract OptimismSwitchboard2 (0x0E674e057EC0FF97eeA57B6A350DBAAD22FE41BA) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        319607508000
+        340928172000
    }
```

```diff
    contract OptimismSwitchboard (0x139f39DC7dC05F7aC2DB3DB6af4f2e1a9De7c287) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2251544461254000
+        5568057713790000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        44002200000
+        52013156000
    }
```

```diff
    contract ArbitrumL1Switchboard (0xdf5f7dfDFc26ee5F629949e330bEf56906319CAe) {
    +++ description: None
+++ description: Fee charged by the switchboard for processing a transaction
+++ severity: LOW
      values.switchboardFees:
-        2458955286249000
+        6280699596483000
+++ description: Fee charged for verifying transaction
+++ severity: LOW
      values.verificationOverheadFees:
-        55000000000000
+        6500000000000
    }
```

Generated with discovered.json: 0x2f2ba4933ab604e3fea69cb0554f79110c0ea619

# Diff at Fri, 08 Mar 2024 09:05:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a10be30b5303dc6a457478efdaca424c246501ca block: 19375693
- current block number: 19389434

## Description

Two new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[17]:
+        "0xdCcFb24f983586144c085426dbfa3414045E19a3"
      values.plugs[16]:
+        "0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5"
    }
```

Generated with discovered.json: 0x37cb2efea554c7c5038c7efcd12e8cd84046d16f

# Diff at Wed, 06 Mar 2024 11:01:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@724fc93d9bd160395a856b93ce5016ca876c6436 block: 19212794
- current block number: 19375693

## Description

Three new plugs.

## Watched changes

```diff
    contract Socket (0x943AC2775928318653e91d350574436A1b9b16f9) {
    +++ description: None
      values.plugs[15]:
+        "0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660"
      values.plugs[14]:
+        "0x8F4e67C61232167584333e23D7d67BD73d80a4F5"
      values.plugs[13]:
+        "0x68411d61adF1341A6392C87A93941FdD3EE7DF8E"
    }
```

Generated with discovered.json: 0xbe11b5db1a4e90286ad51c890467859b0f633f8f

# Diff at Mon, 12 Feb 2024 15:19:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@49775e355a1eff76df613908442249b787dac181 block: 19126484
- current block number: 19212794

## Description

Ignored nonce for usdc vault owner.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126484 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x246d38588b16Dd877c558b245e6D5a711C649fCF) {
      name:
-        "GnosisSafe"
+        "USDCVaultOwner"
      derivedName:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x27bd701904bb21c706ab1fea624a84968e3fa15f

# Diff at Wed, 31 Jan 2024 12:32:59 GMT:

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

# Diff at Thu, 25 Jan 2024 17:16:49 GMT:

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
