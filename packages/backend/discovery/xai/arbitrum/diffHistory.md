Generated with discovered.json: 0x275442cd2cf2edcdd371a58695931131fb9430fd

# Diff at Fri, 16 Feb 2024 07:26:55 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a6356b2783ea71be1ce7003098f574ebc90b553b block: 177621512
- current block number: 181262302

## Description

Update in nonce, now ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 177621512 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      name:
-        "GnosisSafeL2"
+        "ExecutorMultisig"
      values.nonce:
-        2
    }
```

Generated with discovered.json: 0x1331038a7bf98dc70733792489ed180c671bcb35

# Diff at Mon, 05 Feb 2024 08:16:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7095f5c6435baaba0d0084960e2593a905aaf947 block: 175991369
- current block number: 177621512

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
      values.nonce:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset.keyCount:
-        3
+        5
      values.keySetUpdates:
-        2
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175991369 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.dacKeyset:
+        {"threshold":2,"keyCount":3}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x22CCA5Dc96a4Ac1EC32c9c7C5ad4D66254a24C35) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xb591cE747CF19cF30e11d656EB94134F523A9e77) {
    }
```

Generated with discovered.json: 0x598a2a43b1e79400ea587313e0534a96d5a69336

# Diff at Wed, 31 Jan 2024 08:11:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@367f818d32ce6c1ab18696a1cbeb7a6f368b6d78 block: 175366965
- current block number: 175991369

## Description

Start tracking the keySetUpdates.
Ignore totalSupply and nonce in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175366965 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
      name:
-        "GnosisSafeL2"
+        "GnosisSafeAdminMember"
      values.nonce:
-        5
      derivedName:
+        "GnosisSafeL2"
    }
```

```diff
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
      derivedName:
+        "esXai"
    }
```

```diff
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
      derivedName:
+        "Xai"
    }
```

```diff
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
      values.keySetUpdates:
+        2
    }
```

Generated with discovered.json: 0xc92ae2df53624132eb65c022f197837314f8a495

# Diff at Mon, 29 Jan 2024 11:22:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175366965

## Description

Add initial XAI config.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x000d8C5A70B8805DF02f409F2715d05B9A63E871) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x041F85dD87c46B941dc9b15c6628B19ee5358485) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0EE7AD3Cc291343C9952fFd8844e86d294fa513F) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x1E400568AD4840dbE50FB32f306B842e9ddeF726) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x36aDe24988E4C47602e38BD9a0Bd89031eF807a8) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x3a3f62034a42a35eA1686B199bB73006aa525eE4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x4972A8EF186Ee42A14Cdd3c47f52ec06a6dc495E) {
    }
```

```diff
+   Status: CREATED
    contract esXai (0x4C749d097832DE2FEcc989ce18fDc5f1BD76700c) {
    }
```

```diff
+   Status: CREATED
    contract Xai (0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x7dd8A76bdAeBE3BBBaCD7Aa87f1D4FDa1E60f94f) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x995a9d3ca121D48d21087eDE20bc8acb2398c8B1) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xaE21fDA3de92dE2FDAF606233b2863782Ba046F9) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD88c8E0aE21beA6adE41A41130Bb4cd43e6b1723) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```
