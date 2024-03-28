Generated with discovered.json: 0xf6e236d0fdcead86c9a6017a6c0be0cb99c5d02a

# Diff at Thu, 28 Mar 2024 09:04:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19412042
- current block number: 19531598

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412042 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x004d2b7d11fdecf2f0a6c186a7e44db90726c052

# Diff at Mon, 11 Mar 2024 13:06:21 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176779
- current block number: 19412042

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176779 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xeb0c7bf141bfc7f188e3e3529f272eab8d5cb08f

# Diff at Wed, 07 Feb 2024 14:02:35 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175185
- current block number: 19176779

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175185 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
      values.sequencerInbox:
+        "0x0C57B7f3bAc278bE091431B52470fBAdBc4240E6"
    }
```

Generated with discovered.json: 0x46f4c52a626acd3dcf884cb34161e0d5fb8e3c00

# Diff at Wed, 07 Feb 2024 08:40:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19091597
- current block number: 19175185

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19091597 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x8a7c6367f7513d053a63c0ea8d4a59e06b34cdf8

# Diff at Fri, 26 Jan 2024 15:13:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19091597

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    }
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    }
```
