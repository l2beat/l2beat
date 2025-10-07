Generated with discovered.json: 0x63af4c4db40c523abedec43fc7843aa4c5a42b24

# Diff at Fri, 26 Sep 2025 12:44:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756130703
- current timestamp: 1756130703

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756130703 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xae8b45d6bdc0c78643fa7e9c0a205c07117348c3

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x795ec5fa9001fa7890fc45cef664405591aaf0d3

# Diff at Mon, 25 Aug 2025 14:06:41 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1752570323
- current timestamp: 1756130703

## Description

Upgrade to ArbOS v40 wasmModuleRoot.

## Watched changes

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
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

Generated with discovered.json: 0xa8075fbf9334e55f6d957d969b38e6803d2cda5c

# Diff at Tue, 15 Jul 2025 09:05:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22122647
- current block number: 22923572

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

Generated with discovered.json: 0x9df7ee62ea7185b61ec784366654d561ab0d7c1c

# Diff at Mon, 14 Jul 2025 12:44:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22122647
- current block number: 22122647

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

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
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      values.$admin:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
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
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      values.bridge:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.challengeManager:
-        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
+        "eth:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      values.inbox:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      values.owner:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      values.rollupEventInbox:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      values.sequencerInbox:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
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
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.4:
-        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
+        "eth:0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.5:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      values.validatorUtils:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "eth:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      values.validatorWalletCreator:
-        "0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
+        "eth:0x9CAd81628aB7D8e239F1A5B497313341578c5F71"
      implementationNames.0x1CA12290D954CFe022323b6A6Df92113ed6b1C98:
-        "RollupProxy"
      implementationNames.0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
-        "RollupAdminLogic"
      implementationNames.0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
-        "RollupUserLogic"
      implementationNames.eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98:
+        "RollupProxy"
      implementationNames.eth:0x9B56A789fEDD5df27dBaB53b085F7157397cA17D:
+        "RollupAdminLogic"
      implementationNames.eth:0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34:
+        "RollupUserLogic"
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
    EOA  (0x28bB9385A588EF4747264D19B9A9F1603591680c) {
    +++ description: None
      address:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "eth:0x28bB9385A588EF4747264D19B9A9F1603591680c"
    }
```

```diff
    EOA  (0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6) {
    +++ description: None
      address:
-        "0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6"
+        "eth:0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6"
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
    EOA  (0x380636029F3E079683fF06e80Dc3e1B7FAC30C86) {
    +++ description: None
      address:
-        "0x380636029F3E079683fF06e80Dc3e1B7FAC30C86"
+        "eth:0x380636029F3E079683fF06e80Dc3e1B7FAC30C86"
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
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
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      values.nativeToken:
-        "0xdD0ae774F7E300CdAA4EA371cD55169665Ee6AFe"
+        "eth:0xdD0ae774F7E300CdAA4EA371cD55169665Ee6AFe"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      values.rollup:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      values.sequencerInbox:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
      implementationNames.0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9:
-        "TransparentUpgradeableProxy"
      implementationNames.0xEfA1De858293593732a09c9dAA238BEC49595751:
-        "ERC20Bridge"
      implementationNames.eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xEfA1De858293593732a09c9dAA238BEC49595751:
+        "ERC20Bridge"
    }
```

```diff
    contract RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.rollup:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      implementationNames.0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20RollupEventInbox"
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
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
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
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.getProxyAdmin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.sequencerInbox:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
      implementationNames.0x56D8EC76a421063e1907503aDd3794c395256AEb:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
-        "ERC20Inbox"
      implementationNames.eth:0x56D8EC76a421063e1907503aDd3794c395256AEb:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
+        "ERC20Inbox"
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
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.$implementation:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.$pastUpgrades.0.2.0:
-        "0x19431dc37098877486532250FB3158140717C00C"
+        "eth:0x19431dc37098877486532250FB3158140717C00C"
      values.bridge:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      implementationNames.0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e:
-        "TransparentUpgradeableProxy"
      implementationNames.0x19431dc37098877486532250FB3158140717C00C:
-        "ERC20Outbox"
      implementationNames.eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x19431dc37098877486532250FB3158140717C00C:
+        "ERC20Outbox"
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
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.owner:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      implementationNames.0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b:
-        "ProxyAdmin"
      implementationNames.eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b:
+        "ProxyAdmin"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.$implementation:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.$pastUpgrades.0.2.0:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "eth:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "eth:0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      implementationNames.0x830D41c5624EE982cddEd92Ba01DAB3a4856116f:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "UpgradeExecutor"
      implementationNames.eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "UpgradeExecutor"
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
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
+        "eth:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
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
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.osp:
-        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
+        "eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
      values.resultReceiver:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      values.sequencerInbox:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
      implementationNames.0xb9e6987d1E0936b93f512bC89632E15DcA706d87:
-        "TransparentUpgradeableProxy"
      implementationNames.0x02E05A9245C5853f895daDcc3A8216C953C8736B:
-        "ChallengeManager"
      implementationNames.eth:0xb9e6987d1E0936b93f512bC89632E15DcA706d87:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x02E05A9245C5853f895daDcc3A8216C953C8736B:
+        "ChallengeManager"
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
    contract ERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      address:
-        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
+        "eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.$implementation:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.$pastUpgrades.0.2.0:
-        "0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
+        "eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"
      values.counterpartGateway:
-        "0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6"
+        "eth:0x2A5a79061b723BBF453ef7E07c583C750AFb9BD6"
      values.inbox:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      values.l2BeaconProxyFactory:
-        "0x380636029F3E079683fF06e80Dc3e1B7FAC30C86"
+        "eth:0x380636029F3E079683fF06e80Dc3e1B7FAC30C86"
      values.router:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xccaF21F002EAF230c9Fa810B34837a3739B70F7B:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
-        "L1OrbitERC20Gateway"
      implementationNames.eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848:
+        "L1OrbitERC20Gateway"
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
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      address:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
    }
```

```diff
    EOA  (0xD296d45171B97720D3aBdb68B0232be01F1A9216) {
    +++ description: None
      address:
-        "0xD296d45171B97720D3aBdb68B0232be01F1A9216"
+        "eth:0xD296d45171B97720D3aBdb68B0232be01F1A9216"
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
    contract GatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      address:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      values.$implementation:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.$pastUpgrades.0.2.0:
-        "0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
+        "eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"
      values.counterpartGateway:
-        "0xD296d45171B97720D3aBdb68B0232be01F1A9216"
+        "eth:0xD296d45171B97720D3aBdb68B0232be01F1A9216"
      values.defaultGateway:
-        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
+        "eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      values.inbox:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      values.owner:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.whitelist:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
-        "L1OrbitGatewayRouter"
      implementationNames.eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0:
+        "L1OrbitGatewayRouter"
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+        "eth:0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      implementationNames.0xeC475675629B38E42d4aC5d40761618268E7Ed21:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
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
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
      values.$admin:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
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
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      values.reader4844:
-        "0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
      values.rollup:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      implementationNames.0xF75206c49c1694594E3e69252E519434f1579876:
-        "TransparentUpgradeableProxy"
      implementationNames.0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
-        "SequencerInbox"
      implementationNames.eth:0xF75206c49c1694594E3e69252E519434f1579876:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
+        "SequencerInbox"
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
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

Generated with discovered.json: 0x8cd03141ce810b92636cddfaafb1714c6459d4b8

# Diff at Fri, 04 Jul 2025 12:18:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22122647
- current block number: 22122647

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

```diff
    EOA  (0x262711cA4DA6409Da795D8af9E18DDaF47397f80) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    EOA  (0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    EOA  (0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    EOA  (0x7D9A25f61865D5A211a8be80a4Ef6bd201112717) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

```diff
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
+        "eth:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
+        "eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.1.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.2.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.2.from:
-        "ethereum:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "eth:0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      receivedPermissions.3.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.3.from:
-        "ethereum:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "eth:0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      receivedPermissions.4.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.4.from:
-        "ethereum:0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      receivedPermissions.5.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.5.from:
-        "ethereum:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "eth:0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      receivedPermissions.6.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.6.from:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.7.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.7.from:
-        "ethereum:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
+        "eth:0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      receivedPermissions.8.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.8.from:
-        "ethereum:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
+        "eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      receivedPermissions.9.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.9.from:
-        "ethereum:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      receivedPermissions.10.via.1.address:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "eth:0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      receivedPermissions.10.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "eth:0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    EOA  (0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

```diff
    EOA  (0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

```diff
    EOA  (0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "eth:0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      receivedPermissions.1.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.2.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    EOA  (0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
+        "eth:0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    EOA  (0xf244224843657bb59A6456754992Ea973655D918) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF75206c49c1694594E3e69252E519434f1579876"
+        "eth:0xF75206c49c1694594E3e69252E519434f1579876"
    }
```

Generated with discovered.json: 0x2acabb40dc1ea3b7a48c96341d8c8271895f3fa3

# Diff at Wed, 18 Jun 2025 12:22:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22122647
- current block number: 22122647

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x4fae99df2ba7761ab785ea7aee34933e14d4c88f

# Diff at Tue, 27 May 2025 08:26:14 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22122647
- current block number: 22122647

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
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

Generated with discovered.json: 0xa943f2c0a6fa19c9fd23abb712ee5086b1f1d736

# Diff at Fri, 23 May 2025 09:40:52 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22122647
- current block number: 22122647

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    EOA  (0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
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
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
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
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
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
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
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
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.2.via:
+        [{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}]
      receivedPermissions.1.via:
-        [{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}]
      receivedPermissions.1.role:
+        ".validators"
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
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
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "validate"
+        "fastconfirm"
      directlyReceivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      directlyReceivedPermissions.1.role:
+        ".anyTrustFastConfirmer"
      directlyReceivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      directlyReceivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.role:
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

Generated with discovered.json: 0xa17c9d68ff2e35c48d15a6a8a629e2908fa86620

# Diff at Fri, 02 May 2025 17:23:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22122647
- current block number: 22122647

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x183b109eab57c4345e6dd2d707f0b366223dc225

# Diff at Tue, 29 Apr 2025 08:18:58 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22122647
- current block number: 22122647

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22122647 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}]},{"permission":"interact","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"}]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"}]},{"permission":"validate","to":"0x262711cA4DA6409Da795D8af9E18DDaF47397f80","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}]},{"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract ERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract GatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0x7D9A25f61865D5A211a8be80a4Ef6bd201112717","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xC410B8657FBB2CdbF0c5c5d5128576974467ba5e","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xCD795E6003Da105f4a1E11F73fb64b58B5C0f325","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"sequence","to":"0xf244224843657bb59A6456754992Ea973655D918","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
    }
```

Generated with discovered.json: 0xd33ceb22a24d017d7a9ed7715e05bb0e5259819c

# Diff at Tue, 25 Mar 2025 08:22:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 21993982
- current block number: 22122647

## Description

Minor upgrade of Bridge, Inbox and SequencerInbox:
- logic for tokens with custom decimals
- 7702 adjustments
- SequencerInbox upgraded to known implementation

## Watched changes

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
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
+        ["2025-03-24T11:51:11.000Z","0x5837fef008eaaa8871086f7e53f38a95b768926562e2e82cae17ddc7ab61b070",["0xEfA1De858293593732a09c9dAA238BEC49595751"]]
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"
+        "0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
      values.$pastUpgrades.1:
+        ["2024-07-29T13:18:23.000Z","0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]
      values.$pastUpgrades.0.2:
-        "2024-07-29T13:18:23.000Z"
+        ["0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "2025-03-24T16:55:11.000Z"
      values.$pastUpgrades.0.0:
-        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
+        "0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"
+        "0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
      values.$pastUpgrades.1:
+        ["2025-03-24T16:55:11.000Z","0x2ecdabc185a5e5350c23c45cfbf746bd874b272e363729adcf975533d38790b8",["0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"]]
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
 .../{.flat@21993982 => .flat}/Inbox/ERC20Inbox.sol | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0xa7e76e98ce24a6fefd54eb7b53d2101fe5e0c90d

# Diff at Tue, 18 Mar 2025 08:12:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21993982
- current block number: 21993982

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21993982 (main branch discovery), not current.

```diff
    contract Gelato Multisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "GelatoMultisig"
+        "Gelato Multisig"
    }
```

Generated with discovered.json: 0x017308d393885a185d4553953f31e55bddd16b4f

# Diff at Fri, 07 Mar 2025 09:06:24 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21895061
- current block number: 21993982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895061 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x4d82b8fb26abc86d0516afdbb4b4cf8ff1580e8d

# Diff at Thu, 06 Mar 2025 09:38:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21895061
- current block number: 21895061

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895061 (main branch discovery), not current.

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x56D8EC76a421063e1907503aDd3794c395256AEb","0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x3fc4a48ec0d822cb08fa17012bd41d43a3988d71

# Diff at Tue, 04 Mar 2025 10:38:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21895061
- current block number: 21895061

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895061 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        20569170
    }
```

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        20412468
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
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        20412468
    }
```

```diff
    contract RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        20412468
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        20412468
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        20412468
    }
```

```diff
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      sinceBlock:
+        20412468
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        20412468
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
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        20412468
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
    contract ERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        20412674
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
    contract GatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        20412674
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      sinceBlock:
+        21070177
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        20412468
    }
```

Generated with discovered.json: 0x089f9c0e734349aec5cf3d2cc7710d2bf9ab6421

# Diff at Thu, 27 Feb 2025 11:45:11 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21895061
- current block number: 21895061

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21895061 (main branch discovery), not current.

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract ERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract GatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

Generated with discovered.json: 0xf8eb02bd6abf08e79b58f4dc5e6958eb631bbea9

# Diff at Fri, 21 Feb 2025 13:42:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21628383
- current block number: 21895061

## Description

Add validators and batch posters.

## Watched changes

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.8:
+        {"permission":"validate","to":"0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.7:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}]}
      issuedPermissions.6:
+        {"permission":"validate","to":"0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.5:
+        {"permission":"validate","to":"0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.4.to:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      issuedPermissions.4.via.0:
-        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21"}
      issuedPermissions.3.to:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
      issuedPermissions.0.to:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        4
      values.stakerCount:
-        1
+        2
      values.validators.5:
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      values.validators.4:
+        "0xe778F5Bf5dDB8614a1ab6321Cc557EDbC90e615f"
      values.validators.3:
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
      values.validators.2:
+        "0x75feC8Bb2d99076D776A5D46D1E3d42686520eF1"
      values.validators.1:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x3648e2c562F00DeEA11B0b335Cf55C5EB2Df3A5F"
      values.validators.0:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x262711cA4DA6409Da795D8af9E18DDaF47397f80"
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      values.$members.0:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xD19ee3f6Bf22A3A23eCd25B5ED0C655a2a56F65E"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
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
-        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}
      issuedPermissions.1.via.0:
-        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"}
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.to:
-        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
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
-        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
+        "0x0181F0f0260Ac4149CA7Abf6c53d3E8053f95715"
      values.setIsBatchPosterCount:
-        1
+        3
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628383 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xff92082ae285db88573f71475be60900c396eac0

# Diff at Tue, 04 Feb 2025 12:30:45 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21628383
- current block number: 21628383

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628383 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.1.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.1.to:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
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

Generated with discovered.json: 0x1239d529d9c09ac8c7af5afe8666d31fb75c72c6

# Diff at Mon, 20 Jan 2025 11:09:13 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628383
- current block number: 21628383

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628383 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.4.to:
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.3.to:
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.to:
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.1.description:
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
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
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
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
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
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
    contract ERC20Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
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
    contract ERC20Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
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
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
      directlyReceivedPermissions.8.from:
+        "0xF75206c49c1694594E3e69252E519434f1579876"
      directlyReceivedPermissions.7.target:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      directlyReceivedPermissions.7.from:
+        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      directlyReceivedPermissions.6.target:
-        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      directlyReceivedPermissions.6.from:
+        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      directlyReceivedPermissions.5.target:
-        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      directlyReceivedPermissions.5.from:
+        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      directlyReceivedPermissions.4.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      directlyReceivedPermissions.4.from:
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      directlyReceivedPermissions.3.target:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      directlyReceivedPermissions.3.from:
+        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      directlyReceivedPermissions.2.target:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
      directlyReceivedPermissions.2.from:
+        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
      directlyReceivedPermissions.1.target:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      directlyReceivedPermissions.1.from:
+        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      directlyReceivedPermissions.0.target:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      directlyReceivedPermissions.0.from:
+        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
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
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.2.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.1.target:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.1.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
      directlyReceivedPermissions.0.from:
+        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
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
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
      receivedPermissions.10.from:
+        "0xF75206c49c1694594E3e69252E519434f1579876"
      receivedPermissions.9.target:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      receivedPermissions.9.from:
+        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      receivedPermissions.8.target:
-        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      receivedPermissions.8.from:
+        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      receivedPermissions.7.target:
-        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      receivedPermissions.7.from:
+        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      receivedPermissions.6.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.6.from:
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.5.target:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      receivedPermissions.5.from:
+        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      receivedPermissions.4.target:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
      receivedPermissions.4.from:
+        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
      receivedPermissions.3.target:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      receivedPermissions.3.from:
+        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      receivedPermissions.2.target:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      receivedPermissions.2.from:
+        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      receivedPermissions.1.target:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.1.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.0.target:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.0.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      directlyReceivedPermissions.0.from:
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
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
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
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

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.1.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.0.target:
-        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      directlyReceivedPermissions.0.from:
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
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
-        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
      issuedPermissions.0.to:
+        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0x6a54a0fd7daf04b8976ef20ce8fe0f9285dec5a6

# Diff at Wed, 15 Jan 2025 07:27:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465125
- current block number: 21628383

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

Generated with discovered.json: 0x3e8bada14db1634602dd66315d991a366c9a9355

# Diff at Wed, 08 Jan 2025 10:44:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465125
- current block number: 21465125

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465125 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xb03eba2011934698c1831c625981478d1fa487f0

# Diff at Mon, 23 Dec 2024 12:17:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21365549
- current block number: 21465125

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365549 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x133e45a7b85980d2d46e96a8670f308edb40acf2

# Diff at Mon, 09 Dec 2024 14:30:04 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21285821
- current block number: 21365549

## Description

Replace Upgrader EOA with Gelato Multisig.

## Watched changes

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
-        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.5:
-        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[]}
      issuedPermissions.4.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.4.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.4.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      issuedPermissions.4.via.0.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.3.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.3.via.0:
-        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}
      issuedPermissions.2.permission:
-        "fastconfirm"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.2.via.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.1.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      issuedPermissions.1.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.0:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.0.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
-        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      issuedPermissions.1.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

Generated with discovered.json: 0xc56d08f9f30d5cbaa4ffc4f77e37c6c9af949332

# Diff at Fri, 06 Dec 2024 08:09:24 GMT:

- chain: ethereum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21285821
- current block number: 21285821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285821 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0xf7230a2be77126fc984cb938e6200d57c45cf814

# Diff at Fri, 29 Nov 2024 11:28:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21285821
- current block number: 21285821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285821 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.2.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      issuedPermissions.2.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.1.via.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
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
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      directlyReceivedPermissions.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

Generated with discovered.json: 0x270f86133372a90f06709cc615d913bec2cf532d

# Diff at Fri, 29 Nov 2024 09:31:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285821
- current block number: 21285821

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285821 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6:
+        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.5:
+        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[]}
      issuedPermissions.4.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.4.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.4.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.4.via.0.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.3.via.0:
+        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}
      issuedPermissions.2.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.2.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.1.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      issuedPermissions.1.via.0.description:
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"}
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
+        {"permission":"upgrade","target":"0xF75206c49c1694594E3e69252E519434f1579876","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"},{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"}]}
      receivedPermissions.9.target:
-        "0xF75206c49c1694594E3e69252E519434f1579876"
+        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      receivedPermissions.8.target:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
      receivedPermissions.7.target:
-        "0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"
+        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
      receivedPermissions.6.target:
-        "0xb9e6987d1E0936b93f512bC89632E15DcA706d87"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.5.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
      receivedPermissions.4.target:
-        "0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"
+        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
      receivedPermissions.3.target:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
      receivedPermissions.2.target:
-        "0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"
+        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
      receivedPermissions.1.target:
-        "0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"
+        "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"
      receivedPermissions.1.via.1:
-        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"}
      receivedPermissions.1.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x05ec40ea682e69ebd949ae3f1f793cbc54a64952

# Diff at Thu, 28 Nov 2024 11:12:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21157823
- current block number: 21285821

## Description

Gelato MS added as second executor.

## Watched changes

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}]}
      issuedPermissions.3.via.0:
-        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}
    }
```

```diff
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract ERC20Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract ERC20Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0},{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}]}
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

Generated with discovered.json: 0x60328d02e5bafda640e6d043109767469962290a

# Diff at Fri, 15 Nov 2024 08:18:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21157823
- current block number: 21157823

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21157823 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.5:
-        {"permission":"upgrade","target":"0x257812604076712675ae9788F5Bd738173CA3CE0","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}]}
      issuedPermissions.4:
-        {"permission":"propose","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.3.permission:
-        "propose"
+        "validate"
      issuedPermissions.3.via.0:
+        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"Can propose new state roots (called nodes) and challenge state roots on the host chain."}
      issuedPermissions.2.permission:
-        "configure"
+        "validate"
      issuedPermissions.2.via.0:
-        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.1.via.0.address:
-        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.1.via.0.description:
-        "can challenge state roots on the host chain."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.via.0:
+        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."}
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"propose","target":"0x1CA12290D954CFe022323b6A6Df92113ed6b1C98","description":"can submit state roots to the RollupProxy contract on the host chain."}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "validate"
      directlyReceivedPermissions.1.description:
-        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      directlyReceivedPermissions.0.permission:
-        "challenge"
+        "configure"
      directlyReceivedPermissions.0.description:
-        "can challenge state roots on the host chain."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0xa78e2d60f2015678e5767d3af89e67ba9438a931

# Diff at Sun, 10 Nov 2024 14:19:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5f3c7e0644a7d5faea1ebbb16c0c873d426980fc block: 21071352
- current block number: 21157823

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071352 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.via.0.description:
-        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
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
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "a fast-confirmer can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
    }
```

Generated with discovered.json: 0x990e94088380ddf6010a3cfce46d87a0c9893ce1

# Diff at Mon, 04 Nov 2024 07:52:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21071352
- current block number: 21071352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21071352 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [28800,300,345600,3600]
+        {"delayBlocks":28800,"futureBlocks":300,"delaySeconds":345600,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x1f7fd3e5b6bbd027934d96f7eef325916030dadc

# Diff at Tue, 29 Oct 2024 13:03:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041819
- current block number: 21071352

## Description

Upgrade to ArbOS v32 and introduction of an anyTrustFastConfirmer address. The address, currently set to a multisig, is permissioned to call `fastConfirmNextNode()` in the RollupProxy's RollupUserLogic.sol and can thus finalize the latest node (state), disregarding the challenge period.

This project is now converted to use discoveryDriven data.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
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
      issuedPermissions.5:
+        {"permission":"upgrade","target":"0x257812604076712675ae9788F5Bd738173CA3CE0","via":[{"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}]}
      issuedPermissions.4:
+        {"permission":"propose","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[{"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"can submit state roots to the RollupProxy contract on the host chain."}]}
      issuedPermissions.3:
+        {"permission":"propose","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.2.target:
-        "0x257812604076712675ae9788F5Bd738173CA3CE0"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
      issuedPermissions.2.via.0.address:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      issuedPermissions.2.via.0.description:
+        "can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.1.permission:
-        "propose"
+        "challenge"
      issuedPermissions.1.via.0:
+        {"address":"0xeC475675629B38E42d4aC5d40761618268E7Ed21","delay":0,"description":"can challenge state roots on the host chain."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-10-29T07:26:23.000Z","0x9aba2d0318b145675916310787cdcc43b3b6d3db2739897a25acd6a8d6280b31",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0xeC475675629B38E42d4aC5d40761618268E7Ed21"
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
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
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-10-29T07:26:23.000Z","0x9aba2d0318b145675916310787cdcc43b3b6d3db2739897a25acd6a8d6280b31",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
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

```diff
+   Status: CREATED
    contract AlephZeroMultisig (0xeC475675629B38E42d4aC5d40761618268E7Ed21)
    +++ description: None
```

## Source code changes

```diff
.../.flat/AlephZeroMultisig/GnosisSafe.sol         | 953 +++++++++++++++++++++
 .../.flat/AlephZeroMultisig/GnosisSafeProxy.p.sol  |  35 +
 .../ChallengeManager/ChallengeManager.sol          | 404 ++++++---
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21041819 => .flat}/OneStepProver0.sol   | 765 ++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 +++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 +++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++---
 10 files changed, 3754 insertions(+), 945 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041819 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract ERC20Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
      displayName:
+        "Bridge"
    }
```

```diff
    contract ERC20Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract ERC20Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
      displayName:
+        "Outbox"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

Generated with discovered.json: 0x819d965689b66817fd0b11ba00b2088d4d6c9049

# Diff at Tue, 29 Oct 2024 07:59:36 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041819
- current block number: 21041819

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041819 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.2.via.0:
+        {"address":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","delay":0}
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"},{"permission":"upgrade","target":"0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0x56D8EC76a421063e1907503aDd3794c395256AEb","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0xb9e6987d1E0936b93f512bC89632E15DcA706d87","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0xccaF21F002EAF230c9Fa810B34837a3739B70F7B","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]},{"permission":"upgrade","target":"0xF75206c49c1694594E3e69252E519434f1579876","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x1CA12290D954CFe022323b6A6Df92113ed6b1C98"}
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.0.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x257812604076712675ae9788F5Bd738173CA3CE0"
      issuedPermissions.1.via.1:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
    }
```

Generated with discovered.json: 0x73263977a1b921c7b482dfc92374b5815ea95a48

# Diff at Mon, 28 Oct 2024 14:02:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041819
- current block number: 21041819

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041819 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x257812604076712675ae9788F5Bd738173CA3CE0"]
    }
```

Generated with discovered.json: 0xa1a3e02e9081b236d43083207617d548ab13b859

# Diff at Fri, 25 Oct 2024 09:45:46 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20942700
- current block number: 21041819

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"},{"permission":"upgrade","target":"0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"},{"permission":"upgrade","target":"0x56D8EC76a421063e1907503aDd3794c395256AEb"},{"permission":"upgrade","target":"0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"},{"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"permission":"upgrade","target":"0xb9e6987d1E0936b93f512bC89632E15DcA706d87"},{"permission":"upgrade","target":"0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"},{"permission":"upgrade","target":"0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"},{"permission":"upgrade","target":"0xF75206c49c1694594E3e69252E519434f1579876"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9"},{"permission":"upgrade","target":"0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d"},{"permission":"upgrade","target":"0x56D8EC76a421063e1907503aDd3794c395256AEb"},{"permission":"upgrade","target":"0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e"},{"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"},{"permission":"upgrade","target":"0xb9e6987d1E0936b93f512bC89632E15DcA706d87"},{"permission":"upgrade","target":"0xccaF21F002EAF230c9Fa810B34837a3739B70F7B"},{"permission":"upgrade","target":"0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"},{"permission":"upgrade","target":"0xF75206c49c1694594E3e69252E519434f1579876"}]
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xF75206c49c1694594E3e69252E519434f1579876","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xccaF21F002EAF230c9Fa810B34837a3739B70F7B","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xb9e6987d1E0936b93f512bC89632E15DcA706d87","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x56D8EC76a421063e1907503aDd3794c395256AEb","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9","via":[{"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"}]
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.0.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
      issuedPermissions.1.via.0:
+        {"address":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","delay":0}
    }
```

Generated with discovered.json: 0xd18f3acbe22a4fb0b4d0d4df19f457eba8fda0e1

# Diff at Wed, 23 Oct 2024 14:35:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x830D41c5624EE982cddEd92Ba01DAB3a4856116f","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x830D41c5624EE982cddEd92Ba01DAB3a4856116f"
+        "0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
-   Status: DELETED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

Generated with discovered.json: 0x875b985df115942d15bd053cf8b52d292750c4b9

# Diff at Mon, 21 Oct 2024 12:42:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x017d4afe5d013550036b173df420e83d37cc7409

# Diff at Mon, 21 Oct 2024 11:03:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
      values.$pastUpgrades.0.1:
-        ["0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
      values.$pastUpgrades.0.1:
-        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
+        "0x7d95b8115b846835b6da60e35cc04647b957e35301e9cb72b1d148b26acac93a"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
      values.$pastUpgrades.0.1:
-        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
+        "0x7d95b8115b846835b6da60e35cc04647b957e35301e9cb72b1d148b26acac93a"
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
      values.$pastUpgrades.0.1:
-        ["0x383f16fB2809a56fC639c1eE2c93Ad2aa7Ee130A"]
+        "0x16528bf78b7d2110129529a7a0435a35b5443e3638f89fb2f917a7c92ef587b9"
    }
```

Generated with discovered.json: 0x80bf54d7a3a1527ae5c1ddaca77fa7451578a154

# Diff at Wed, 16 Oct 2024 11:34:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x2b2566944f8ff8a256b39C6A36900991EC1fF3c6","via":[]}
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b"
+        "0xbc35c3fBd56318Bf360086f50576233Dc93AFF20"
    }
```

Generated with discovered.json: 0xf04be7855c62a3e6fdba3c76f89aa37616419125

# Diff at Mon, 14 Oct 2024 10:49:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20942700
- current block number: 20942700

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20942700 (main branch discovery), not current.

```diff
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

Generated with discovered.json: 0xe534319d537464183f9c8c88ad23b0e7e79abdca

# Diff at Fri, 11 Oct 2024 13:33:22 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 20942700

## Description

Standard Orbit stack Optimium with native token AZERO.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x1CA12290D954CFe022323b6A6Df92113ed6b1C98)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
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
    contract Bridge (0x41Ec9456AB918f2aBA81F38c03Eb0B93b78E84d9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x4e008aEeA79Fcd5708A7b46CA1732dFAf2a25B7d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x56D8EC76a421063e1907503aDd3794c395256AEb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x73bb50c32a3BD6A1032aa5cFeA048fBDA3D6aF6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7Deda2425eC2d4EA0DF689A78de2fBF002075576)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x80622fe04c5e1c3fbb3A9c62996dB27B53E9F77b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x830D41c5624EE982cddEd92Ba01DAB3a4856116f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xb9e6987d1E0936b93f512bC89632E15DcA706d87)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xccaF21F002EAF230c9Fa810B34837a3739B70F7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xF75206c49c1694594E3e69252E519434f1579876)
    +++ description: State batches / commitments get posted here.
```

