Generated with discovered.json: 0x616619b46862d7649368c11858319d5e420f5791

# Diff at Wed, 24 Jan 2024 08:06:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bef03f2ccf4bccd5d53aa62da5612827a762973f block: 19069632
- current block number: 19075194

## Description

Contracts have been verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19069632 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMemory"
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      unverified:
-        true
      derivedName:
-        ""
+        "OneStepProver0"
    }
```

# Diff at Tue, 23 Jan 2024 13:21:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 19032900
- current block number: 19069632

## Description

Added discovery of rollup validators.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032900 (main branch discovery), not current.

```diff
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
      name:
-        ""
+        "OneStepProverMemory"
      derivedName:
+        ""
    }
```

```diff
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
      values.validators:
+        ["0x56D33424edb428744597Ec02571f14B50a33b7de"]
    }
```

```diff
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
      derivedName:
+        "ProxyAdmin"
    }
```

```diff
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
      name:
-        ""
+        "OneStepProverMath"
      derivedName:
+        ""
    }
```

```diff
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
      name:
-        ""
+        "OneStepProverHostIo"
      derivedName:
+        ""
    }
```

```diff
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
      values.batchPosters:
+        ["0x5eAD389b57d533A94a0eacd570Dc1CC59C25F2D4"]
    }
```

```diff
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
      name:
-        ""
+        "OneStepProver0"
      derivedName:
+        ""
    }
```

# Diff at Thu, 18 Jan 2024 09:37:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18962479
- current block number: 19032900

## Description

Ignore nonce of GnosisSafe multisig

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18962479 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      name:
-        "GnosisSafe"
+        "OwnerMultisig"
      values.nonce:
-        9
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Mon, 08 Jan 2024 13:05:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 18962479

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x12485B9d469c1D51d05b5C39e009D50eF0170cF7) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x28c32059d7e6147cf5257DFC127f7258beA1cdf4) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x36E5DE57f862cf5bA28624845faB8c2fF6Aa41d2) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x5a961c7D162195a9Dc5a357Cc168b0694283382E) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x5D657b905275F36AD62C3d5C36966975613aFB96) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x6594085ca55a2B3a5fAD1C57A270D060eEa99877) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d4bE7c1a618D43bE4a1Bd7F8eC8E079Ff52Fb4d) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d) {
    }
```

```diff
+   Status: CREATED
    contract  (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract  (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa1c86E2362dba0525075622af6d5f739B1304D45) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xb4795A0edae98d7820C37F06f6b858e7acb51DF8) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD368b8dC5cB6fA26A53b7588db9A87E509A72d89) {
    }
```

```diff
+   Status: CREATED
    contract  (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
