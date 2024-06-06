Generated with discovered.json: 0x412c3152a7e9266e259ca114662031a4d33f2e21

# Diff at Thu, 06 Jun 2024 05:15:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@508157754f563221cb69d9a7257ec7bb4f731937 block: 20025625
- current block number: 20030638

## Description

Reconfigured discovery to ignore token related values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20025625 (main branch discovery), not current.

```diff
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1) {
    +++ description: None
      values.getVaultAvailableAmount:
-        [0,"310422643444773035033"]
      values.latestRoundID:
-        17
      values.withdrawAmountDust:
-        0
    }
```

Generated with discovered.json: 0xd8292d70fd71441d43b5cde9d3e77785b0a78059

# Diff at Wed, 05 Jun 2024 12:27:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20025625

## Description

Initial discovery: Orbit stack L2 by Gelato RaaS with AnyTrust 1/1 DAC. The custom native token is backed by  LSTs and the according Vaults are EOA-governed. (strategyManager unverified)

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x369001149fe80892665a7b0c17fe8Db6BeFC7F5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x39D2EEcC8B55f46aE64789E2494dE777cDDeED03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x490f337Ac108b2a555183f5b5fd2ee84a7F45a18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x503C5a576E2F72Ca9aD213D64bc775cbD81E0F2C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x51C4a227D59E49E26Ea07D8e4E9Af163da4c87A0)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract StrategyManager (0x5Cba18d504D4158dC1A18C5Dc6BB2a30B230DdD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Minter (0x655756824385F8903AC8cFDa17B656cc26f7C7da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x679D4C1cC6855C57726BEA1784F578315d6431f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x8592Ca44dE1D354A20F75160F5602E5933D33761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xB032ff02cd6425e4b816137207AA8560932180f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridger (0xbf2F26cadbC10C4d61ac7e424D514d79a12126f8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Real (0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xD6A4868a15d98b0BF4E9063BE707B4b89D067C3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf538671ddd60eE54BdD6FBb0E309c491A7A2df11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssetsVault (0xf985E2c73d74BefF3C8c16EFC4fa5ab4cfb62294)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RealVault (0xFC1db08622e81b2AFd643318f6B8B79E9980A5e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xfC89B875970122E24C6C5ADd4Dea139443943ea7)
    +++ description: None
```
