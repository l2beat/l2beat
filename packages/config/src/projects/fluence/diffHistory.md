Generated with discovered.json: 0xffc2081d496c2046b1cf4291ab377d2177ca2f95

# Diff at Fri, 26 Sep 2025 12:45:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756118020
- current timestamp: 1756118020

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756118020 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x037a548129bbc978c9358eb6a04778c4b38b993d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x6da4ed8b974ad065a52f24f90e9ca335caa531d0

# Diff at Mon, 25 Aug 2025 14:09:59 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1752570515
- current timestamp: 1756118020

## Description

Upgrade to ArbOS v40 wasmModuleRoot.

## Watched changes

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "ArbOS v40 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+        "0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a"
    }
```

Generated with discovered.json: 0x1b140ce9e0220821d98a44bca564711442e57b8b

# Diff at Tue, 15 Jul 2025 09:08:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22629685
- current block number: 22923588

## Description

Gelato MS: one signer removed, one changed.

## Watched changes

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.2:
-        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.8:
-        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x7e72e6680a3da3ae1f9cfaa8f7f7767945783174

# Diff at Mon, 14 Jul 2025 12:45:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22629685
- current block number: 22629685

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22629685 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
+        "eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
      implementationNames.0x0003A96B27ce73505b43ea1b71a5aB06bec568C4:
-        "OneStepProverHostIo"
      implementationNames.eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4:
+        "OneStepProverHostIo"
    }
```

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      address:
-        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
+        "eth:0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
    }
```

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.0.2.0:
-        "0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
+        "eth:0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
      values.$pastUpgrades.1.2.0:
-        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.getProxyAdmin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.sequencerInbox:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      implementationNames.0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
-        "ERC20Inbox"
      implementationNames.eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0x08dE8bf67c62e5cf73729372750f79E82388df6a) {
    +++ description: None
      address:
-        "0x08dE8bf67c62e5cf73729372750f79E82388df6a"
+        "eth:0x08dE8bf67c62e5cf73729372750f79E82388df6a"
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.owner:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      implementationNames.0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790:
-        "ProxyAdmin"
      implementationNames.eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790:
+        "ProxyAdmin"
    }
```

```diff
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
+        "eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
      implementationNames.0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB:
-        "OneStepProverMemory"
      implementationNames.eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      address:
-        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+        "eth:0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

```diff
    EOA  (0x27Cc0f325627dBaDC1731EF4D031126573e0E870) {
    +++ description: None
      address:
-        "0x27Cc0f325627dBaDC1731EF4D031126573e0E870"
+        "eth:0x27Cc0f325627dBaDC1731EF4D031126573e0E870"
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "eth:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.0.2.0:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "eth:0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
      values.$pastUpgrades.1.2.0:
-        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
+        "eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.osp:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.resultReceiver:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      values.sequencerInbox:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      implementationNames.0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F:
-        "TransparentUpgradeableProxy"
      implementationNames.0x02E05A9245C5853f895daDcc3A8216C953C8736B:
-        "ChallengeManager"
      implementationNames.eth:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
-        "ValidatorUtils"
      implementationNames.eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
+        "eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
      implementationNames.0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5:
-        "OneStepProver0"
      implementationNames.eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      address:
-        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
+        "eth:0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.$pastUpgrades.0.2.0:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      implementationNames.0x50Df2E43aDefee3b6510b637697d30e7dc155e13:
-        "TransparentUpgradeableProxy"
      implementationNames.0x19431dc37098877486532250FB3158140717C00C:
-        "ERC20Outbox"
      implementationNames.eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x19431dc37098877486532250FB3158140717C00C:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0x547D0F472309e4239b296D01e03bEDc101241a26) {
    +++ description: None
      address:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
    }
```

```diff
    EOA  (0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d) {
    +++ description: None
      address:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.$pastUpgrades.0.2.0:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.counterpartGateway:
-        "0x08dE8bf67c62e5cf73729372750f79E82388df6a"
+        "eth:0x08dE8bf67c62e5cf73729372750f79E82388df6a"
      values.inbox:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      values.l2BeaconProxyFactory:
-        "0x27Cc0f325627dBaDC1731EF4D031126573e0E870"
+        "eth:0x27Cc0f325627dBaDC1731EF4D031126573e0E870"
      values.router:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "eth:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
-        "L1OrbitERC20Gateway"
      implementationNames.eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
+        "L1OrbitERC20Gateway"
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0xEfA1De858293593732a09c9dAA238BEC49595751"
+        "eth:0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.$pastUpgrades.0.2.0:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "eth:0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
      values.$pastUpgrades.1.2.0:
-        "0xEfA1De858293593732a09c9dAA238BEC49595751"
+        "eth:0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      values.nativeToken:
-        "0x236501327e701692a281934230AF0b6BE8Df3353"
+        "eth:0x236501327e701692a281934230AF0b6BE8Df3353"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      values.rollup:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      values.sequencerInbox:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      implementationNames.0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEfA1De858293593732a09c9dAA238BEC49595751:
-        "ERC20Bridge"
      implementationNames.eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xEfA1De858293593732a09c9dAA238BEC49595751:
+        "ERC20Bridge"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x6BCe4c44668C77ff67730C14d2378857103F53C7:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      address:
-        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
+        "eth:0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      address:
-        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
+        "eth:0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
    }
```

```diff
    EOA  (0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52) {
    +++ description: None
      address:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.rollup:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      implementationNames.0x89De2771f84b8fd0d09560f75908D6F6a1273A6e:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.prover0:
-        "0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
+        "eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5"
      values.proverHostIo:
-        "0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
+        "eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4"
      values.proverMath:
-        "0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
+        "eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
      values.proverMem:
-        "0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
+        "eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB"
      implementationNames.0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC:
-        "OneStepProofEntry"
      implementationNames.eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC:
+        "OneStepProofEntry"
    }
```

```diff
    EOA  (0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621) {
    +++ description: None
      address:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
    }
```

```diff
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      address:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.1:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.2:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "eth:0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.3:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.4:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.5:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "eth:0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.6:
-        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
+        "eth:0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "eth:0x547D0F472309e4239b296D01e03bEDc101241a26"
      implementationNames.0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      address:
-        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
+        "eth:0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
    }
```

```diff
    contract GnosisSafeL2 (0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43) {
    +++ description: None
      address:
-        "0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+        "eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "eth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
+        "eth:0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      implementationNames.0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43:
+        "GnosisSafeProxy"
      implementationNames.eth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      address:
-        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
+        "eth:0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
    }
```

```diff
    EOA  (0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8) {
    +++ description: None
      address:
-        "0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8"
+        "eth:0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8"
    }
```

```diff
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
+        "eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD"
      implementationNames.0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD:
-        "OneStepProverMath"
      implementationNames.eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD:
+        "OneStepProverMath"
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.0.2.0:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "eth:0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
      values.$pastUpgrades.1.2.0:
-        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
+        "eth:0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.batchPosters.1:
-        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
+        "eth:0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      values.batchPosters.2:
-        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
+        "eth:0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
      values.batchPosters.3:
-        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
+        "eth:0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
      values.batchPosters.4:
-        "0xf244224843657bb59A6456754992Ea973655D918"
+        "eth:0xf244224843657bb59A6456754992Ea973655D918"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.reader4844:
-        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      values.rollup:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      implementationNames.0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
-        "SequencerInbox"
      implementationNames.eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      values.$admin:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      values.$implementation.0:
-        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
+        "eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$implementation.1:
-        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
+        "eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$pastUpgrades.0.2.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "eth:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.0.2.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "eth:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.1.2.0:
-        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
+        "eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1.2.1:
-        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
+        "eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.anyTrustFastConfirmer:
-        "0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+        "eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
      values.bridge:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      values.challengeManager:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "eth:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      values.inbox:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      values.owner:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      values.rollupEventInbox:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      values.sequencerInbox:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+        "eth:0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      values.validators.1:
-        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
+        "eth:0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.2:
-        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
+        "eth:0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.3:
-        "0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+        "eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
      values.validators.4:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.5:
-        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+        "eth:0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f:
-        "RollupProxy"
      implementationNames.0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
-        "RollupAdminLogic"
      implementationNames.0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
-        "RollupUserLogic"
      implementationNames.eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f:
+        "RollupProxy"
      implementationNames.eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
+        "RollupAdminLogic"
      implementationNames.eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
+        "RollupUserLogic"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      address:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      address:
-        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+        "eth:0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "eth:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      values.$admin:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      values.$implementation:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.$pastUpgrades.0.2.0:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.counterpartGateway:
-        "0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8"
+        "eth:0xCEC8A395617593B30BEC7c199a3Ae3Fe40186dB8"
      values.defaultGateway:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      values.inbox:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      values.owner:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
-        "L1OrbitGatewayRouter"
      implementationNames.eth:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      address:
-        "0xf244224843657bb59A6456754992Ea973655D918"
+        "eth:0xf244224843657bb59A6456754992Ea973655D918"
    }
```

```diff
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

Generated with discovered.json: 0xb0ed9f5c45e2c01f89eddec554fa0841bb7cc971

# Diff at Fri, 04 Jul 2025 12:19:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22629685
- current block number: 22629685

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22629685 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "eth:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "eth:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+        "eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+        "eth:0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
      receivedPermissions.1.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.2.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.1.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.1.from:
-        "ethereum:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "eth:0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.2.from:
-        "ethereum:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "eth:0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.3.from:
-        "ethereum:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "eth:0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.4.from:
-        "ethereum:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.5.from:
-        "ethereum:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "eth:0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.6.from:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.7.from:
-        "ethereum:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "eth:0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.8.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.9.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.10.via.1.address:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "eth:0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.10.from:
-        "ethereum:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "eth:0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "eth:0x6BCe4c44668C77ff67730C14d2378857103F53C7"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
    }
```

```diff
    contract GnosisSafeL2 (0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.1.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "eth:0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "eth:0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
    }
```

Generated with discovered.json: 0x5a1e514aaf883cbc9bbb8a6a1b0dfdf6e13e91ac

# Diff at Wed, 18 Jun 2025 12:22:49 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22629685
- current block number: 22629685

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22629685 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x866124199405e0e0bc9421e0da6caa85a7b7a005

# Diff at Wed, 04 Jun 2025 07:07:52 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2c1561a0dd20d4853f867f43267ae9042bbca2cd block: 22122735
- current block number: 22629685

## Description

add fastconfirmer with worst possible config: EOA, minimum assertion period 1 block.

## Watched changes

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"fastconfirm","from":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"}]}
      receivedPermissions.1:
+        {"permission":"validate","from":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"}]}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
+++ description: Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. 
      values.minimumAssertionPeriod:
-        75
+        1
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.validators.5:
+        "0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xC5Ec2e1EA44699FcF406aB19EA2aeB684CAC5C43)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 ++++++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0xa9b33d8dcfda3d020edcd4ba387cc4d66256b306

# Diff at Tue, 27 May 2025 08:26:53 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22122735
- current block number: 22122735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122735 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0xe5111fbc0ff22fdebeff6918175d6e8f1d434733

# Diff at Fri, 23 May 2025 09:40:56 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22122735
- current block number: 22122735

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122735 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      receivedPermissions.5.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.5.via.1:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.5.via.0.address:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.from:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.from:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.from:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.0.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

Generated with discovered.json: 0xc3a242e4975c2d0768bec45f15d0af6ebf6d49d0

# Diff at Fri, 02 May 2025 17:23:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22122735
- current block number: 22122735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122735 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x384d1e5c819368f4a31ca891b54d46e7599f9374

# Diff at Tue, 29 Apr 2025 08:19:03 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22122735
- current block number: 22122735

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122735 (main branch discovery), not current.

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0x7D9A25f61865D5A211a8be80a4Ef6bd201112717","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}]},{"permission":"validate","to":"0x262711cA4DA6409Da795D8af9E18DDaF47397f80","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}]
    }
```

Generated with discovered.json: 0xde63e1eef6fe9b7f14017a814c916dc5e81af9dd

# Diff at Tue, 25 Mar 2025 08:30:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 21994038
- current block number: 22122735

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
+        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.1:
+        ["2024-07-31T07:47:35.000Z","0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]
      values.$pastUpgrades.0.2:
-        "0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed"
+        ["0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"]
      values.$pastUpgrades.0.1:
-        "2024-07-31T07:47:35.000Z"
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "0xEfA1De858293593732a09c9dAA238BEC49595751"
      values.$pastUpgrades.1:
+        ["2024-07-31T07:47:35.000Z","0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.0.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x5837fef008eaaa8871086f7e53f38a95b768926562e2e82cae17ddc7ab61b070"
      values.$pastUpgrades.0.1:
-        "0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed"
+        "2025-03-24T11:51:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-07-31T07:47:35.000Z"
+        ["0xEfA1De858293593732a09c9dAA238BEC49595751"]
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.1:
+        ["2024-07-31T07:47:35.000Z","0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed",["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]]
      values.$pastUpgrades.0.2:
-        "0x84bba7868423bdd4e4d72eae2d4b2e6fc2e6fde66a1668a5009baae7625688ed"
+        ["0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"]
      values.$pastUpgrades.0.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        "2024-07-31T07:47:35.000Z"
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        1
+        2
      values.reader4844:
-        "0x7Deda2425eC2d4EA0DF689A78de2fBF002075576"
+        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 54 +++++++++++++
 .../{.flat@21994038 => .flat}/Inbox/ERC20Inbox.sol | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0xda760770d23a26716ee602a2bb29d502935a81fe

# Diff at Tue, 18 Mar 2025 08:12:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21994038
- current block number: 21994038

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21994038 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0xf9724296caf8f0725b3427c70c827b3fd7971106

# Diff at Fri, 07 Mar 2025 09:14:54 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21895095
- current block number: 21994038

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x5c8d9d4e5b98a890da7eb3a2db7b6e25fe7b33f2

# Diff at Thu, 06 Mar 2025 09:39:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21895095
- current block number: 21895095

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95","0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x50Df2E43aDefee3b6510b637697d30e7dc155e13"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xea30807906a1922cf77c25f8a44c357c0ee40fce

# Diff at Tue, 04 Mar 2025 10:39:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21895095
- current block number: 21895095

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20425137
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      sinceBlock:
+        20425137
    }
```

```diff
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569168
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20425137
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569167
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20425137
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        20425140
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20425137
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20425137
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20425137
    }
```

```diff
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569171
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569169
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20425137
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20425137
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        20425140
    }
```

Generated with discovered.json: 0xed972fda10a18a5a895356b635af14bbcc5d7cf4

# Diff at Thu, 27 Feb 2025 11:45:40 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21895095
- current block number: 21895095

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895095 (main branch discovery), not current.

```diff
    contract Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract ERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract GatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0x2ccab5c9573672a6b0c3bdc59126be89c7356b40

# Diff at Fri, 21 Feb 2025 13:45:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628392
- current block number: 21895095

## Description

Add operator addresses.
Config related: Set orbit stack contract categories.

## Watched changes

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}]}
      issuedPermissions.4:
+        {"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.3:
+        {"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.2:
+        {"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      issuedPermissions.1.via.1:
-        {"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"}
      issuedPermissions.1.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.batchPosters.4:
+        "0xf244224843657bb59A6456754992Ea973655D918"
      values.batchPosters.3:
+        "0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325"
      values.batchPosters.2:
+        "0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e"
      values.batchPosters.1:
+        "0x7D9A25f61865D5A211a8be80a4Ef6bd201112717"
      values.batchPosters.0:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.3:
+        {"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.to:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        3
      values.stakerCount:
-        1
+        2
      values.validators.4:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.3:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.2:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.1:
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.0:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0xe455b275da5573d6986c7d6fe9f4e08a120916a6

# Diff at Tue, 04 Feb 2025 12:31:25 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628392
- current block number: 21628392

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x04738e37860f895095793c4d8be068b8b077e546

# Diff at Mon, 20 Jan 2025 11:09:30 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628392
- current block number: 21628392

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628392 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      directlyReceivedPermissions.8.from:
+        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      directlyReceivedPermissions.7.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      directlyReceivedPermissions.7.from:
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      directlyReceivedPermissions.6.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      directlyReceivedPermissions.6.from:
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      directlyReceivedPermissions.5.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.5.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.4.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      directlyReceivedPermissions.4.from:
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      directlyReceivedPermissions.3.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      directlyReceivedPermissions.3.from:
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      directlyReceivedPermissions.2.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      directlyReceivedPermissions.2.from:
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      directlyReceivedPermissions.1.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      directlyReceivedPermissions.1.from:
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      directlyReceivedPermissions.0.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      directlyReceivedPermissions.0.from:
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      directlyReceivedPermissions.2.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.2.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.1.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.1.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.0.target:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      directlyReceivedPermissions.0.from:
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      receivedPermissions.10.from:
+        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
      receivedPermissions.9.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.9.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.8.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.8.from:
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.7.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.7.from:
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.6.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.6.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.5.from:
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.4.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.4.from:
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.3.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.3.from:
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.2.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.2.from:
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.1.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.1.from:
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.0.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.from:
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      directlyReceivedPermissions.0.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      directlyReceivedPermissions.0.from:
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
      issuedPermissions.0.to:
+        "0xAec3997252d4F9Cd92Cc49be2e8068e23065665a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.to:
+        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0x7bb1e93ccb9eb686cc6ff833cde3635272aca7e0

# Diff at Wed, 15 Jan 2025 07:29:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465176
- current block number: 21628392

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xa28b9655c364794cce276b17f69be431671b18cd

# Diff at Wed, 08 Jan 2025 10:44:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465176
- current block number: 21465176

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465176 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xde147673c5c765ebf4d721f2f95ea3f88ba51588

# Diff at Mon, 23 Dec 2024 12:27:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21365584
- current block number: 21465176

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365584 (main branch discovery), not current.

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x99e3dc72514eb973705c06743bfaf25897146ab4

# Diff at Mon, 09 Dec 2024 14:36:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21285836
- current block number: 21365584

## Description

Replace Upgrader EOA with Gelato Multisig.

## Watched changes

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.1.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
-        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.2.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
      issuedPermissions.2.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xe0c7728a837b0a8873fad914c75f0694ffa12dd6

# Diff at Fri, 06 Dec 2024 08:09:42 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xf63388a5c33dffe61ccdfb809ec05fc8da5ce1b6

# Diff at Fri, 29 Nov 2024 11:28:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x5dbb652288446df9c587ed6d23724e9f0ab385a2

# Diff at Fri, 29 Nov 2024 09:31:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd","via":[{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"},{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}]}
      receivedPermissions.9.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.9.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.9.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.8.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.8.via.1:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.8.via.0.address:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.7.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.6.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.4.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.3.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.2.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.1.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.0.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.3.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xb1461e556fc13132b9ea66329c0ded9de9b5f5c4

# Diff at Thu, 28 Nov 2024 11:15:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21270981
- current block number: 21285836

## Description

Gelato MS added as second executor.

## Watched changes

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 953 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0x23eeabd5772a47856f34b6f15686a7c5ec0c5b4f

# Diff at Tue, 26 Nov 2024 09:19:11 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2a3b80d2c777b6125ac0d9d7c441cf8578a57a5f block: 21128887
- current block number: 21270981

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21128887 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x7eb381761b7d1025a73c07541c04a05e5424be41

# Diff at Fri, 15 Nov 2024 08:18:10 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21128887
- current block number: 21128887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21128887 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBc54708fB6C6C97086e3f6554a517DE5EF16c304","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

Generated with discovered.json: 0x8e49aa93da332bcc7872bd4ace5e1d57eb67e23e

# Diff at Wed, 06 Nov 2024 13:24:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21128887

## Description

Standard orbit stack anytrust 1/2 optimium with naughty eoa admin (0.96 alienx similarity).

## Initial discovery

```diff
+   Status: CREATED
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd)
    +++ description: None
```

