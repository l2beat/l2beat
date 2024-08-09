Generated with discovered.json: 0xffe38757b76ac47d79d3c1f13b9a384b23ce5767

# Diff at Fri, 09 Aug 2024 10:10:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xFb209827c58283535b744575e11953DCC4bEAD88"]
      assignedPermissions.upgrade:
+        ["0xFb209827c58283535b744575e11953DCC4bEAD88"]
    }
```

```diff
    contract ProxyAdmin 2 (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
      assignedPermissions.upgrade:
+        ["0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","0xE6841D92B0C345144506576eC13ECf5103aC7f49"]
    }
```

```diff
    contract ProxyAdmin (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b","0x304807A7ed6c1296df2128E6ff3836e477329CD2","0xA59075221b50C598aED0Eae0bB9869639513af0D","0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","0xc4448b71118c9071Bcb9734A0EAc55D18A153949"]
      assignedPermissions.upgrade:
+        ["0xA59075221b50C598aED0Eae0bB9869639513af0D","0xc4448b71118c9071Bcb9734A0EAc55D18A153949","0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58","0x304807A7ed6c1296df2128E6ff3836e477329CD2","0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd","0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b"]
    }
```

```diff
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"]
      assignedPermissions.upgrade:
+        ["0x658e8123722462F888b6fa01a7dbcEFe1D6DD709"]
    }
```

```diff
    contract ProxyAdmin 3 (0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x23122da8C581AA7E0d07A36Ff1f16F799650232f","0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf","0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48"]
      assignedPermissions.upgrade:
+        ["0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48","0x23122da8C581AA7E0d07A36Ff1f16F799650232f","0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf"]
    }
```

```diff
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"]
      assignedPermissions.upgrade:
+        ["0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23"]
    }
```

```diff
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"]
      assignedPermissions.upgrade:
+        ["0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3"]
    }
```

```diff
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3B0369CAD35d257793F51c28213a4Cf4001397AC"]
      assignedPermissions.upgrade:
+        ["0x3B0369CAD35d257793F51c28213a4Cf4001397AC"]
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x375906ADFD34D93236084F462BB2dB0D92129Fe1","0xfE2bf40f2A9183774BF8E871d634A4E50255158B","0x64379Dee676ab442B48925Ed603771f386510Ee7","0x290Aa3E7533c873B3326DabFe7579e86ed951428","0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C","0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"]
      assignedPermissions.upgrade:
+        ["0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87"]
    }
```

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.$multisigThreshold:
-        "9 of 12 (75%)"
      values.getOwners:
-        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.getThreshold:
-        9
      values.$members:
+        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.$threshold:
+        9
      values.multisigThreshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"]
      assignedPermissions.upgrade:
+        ["0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76"]
    }
```

Generated with discovered.json: 0x91c3df0b3713b5068c31ace1f2c7c86c9d7c612b

# Diff at Tue, 30 Jul 2024 11:13:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20406615
- current block number: 20406615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20406615 (main branch discovery), not current.

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xf44d03c7115a41e7b70885b746bb3fa529a6b6cd

# Diff at Sun, 28 Jul 2024 17:43:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@04dc4c7d175d5f4d1388774094bdb962fe7b7423 block: 20377214
- current block number: 20406615

## Description

1) SecurityCouncil signer rotation completed.
2) Changed naming to be consistent with the diagram.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20377214 (main branch discovery), not current.

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      name:
-        "L1ArbitrumTimelock"
+        "L1Timelock"
    }
```

Generated with discovered.json: 0x2d8674eaceb027327df8573b1d851f63d76771f7

# Diff at Tue, 21 May 2024 06:35:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 19883604
- current block number: 19916529

## Description

Scheduled transactions for the new SecurityCouncil cohort are executed.

## Watched changes

```diff
    contract SecurityCouncil (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

Generated with discovered.json: 0x14d481f36a76e3853d048fce96b26891fb8f5ce4

# Diff at Wed, 15 May 2024 12:20:50 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2a68252776877f0b82e9f7cf6261b744952be771 block: 19532012
- current block number: 19875341

## Description

Config related: Renamed two contracts to make them more descriptive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532012 (main branch discovery), not current.

```diff
    contract ProxyAdmin 1 (0x71D78dC7cCC0e037e12de1E50f5470903ce37148) {
    +++ description: None
      name:
-        "ProxyAdmin 1"
+        "ProxyAdmin"
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SecurityCouncil"
    }
```

Generated with discovered.json: 0xf7fb7f83bf7de129d4215d9d4d56037bafd44bf7

# Diff at Thu, 28 Mar 2024 10:28:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19488869
- current block number: 19532012

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19488869 (main branch discovery), not current.

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

Generated with discovered.json: 0xdab66b0648ddfea385056c8353105da61cbb132b

# Diff at Fri, 22 Mar 2024 08:07:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19390070
- current block number: 19488869

## Description

- added a batchPosterManager multisig. It can update whether an address is authorized to be a batch poster at the sequencer inbox. The DAO still has the same ability to revoke the Sequencer role; i.e., the DAO could update the batch poster manager (along with any batch posters).
- changed SequencerInbox implementation - added flag readers. The data posted has initial bytes used as certificate for certain flags, such as to show the data has used a certain merkelization strategy, or compression scheme: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
- added check if sequencerInbox is deployed on an Arbitrum chain (for L3s?). If data is posted with eip4844 format, since EIP 4844 is not supported on Arbitrum chains, it will revert.
- set the batch poster manager multisig that can rotate batcher keys.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (0x1efb116EBC38CE895Eb2E5e009234E0E0836f2F5)
    +++ description: None
```

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      upgradeability.implementation:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      implementations.0:
-        "0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9"
+        "0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7"
      values.maxTimeVariation.3:
-        3600
+        768
      values.maxTimeVariation.1:
-        12
+        64
      values.batchPosterManager:
+        "0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        false
      values.maxDataSize:
+        117964
      values.reader4844:
+        "0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x7a6C0503107858f82a790E481024134092e19979)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x8323B58C522690E6aFae94044825F0c79A93d236)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x9CBC3F14a57CE6eAD0e770F528E2f1E8b8C37613)
    +++ description: None
```

```diff
    contract ChallengeManager (0xA59075221b50C598aED0Eae0bB9869639513af0D) {
    +++ description: None
      upgradeability.implementation:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      implementations.0:
-        "0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566"
+        "0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566"
      values.osp:
-        "0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5"
+        "0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
    +++ description: None
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb5f6951AB2504442c3F6dD37fF1E1D1d253C5097)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BatchPosterManagerMultisig (0xd0FDA6925f502a3a94986dfe7C92FE19EBbD679B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 +
 .../contracts/base/FallbackManager.sol             |  53 ++
 .../implementation/contracts/base/GuardManager.sol |  50 ++
 .../contracts/base/ModuleManager.sol               | 133 +++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 ++
 .../contracts/external/GnosisSafeMath.sol          |  54 ++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 155 ++++++
 .../BatchPosterManagerMultisig/proxy/meta.txt      |   2 +
 .../ChallengeManager/implementation/meta.txt       |   2 +-
 .../implementation/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../implementation/src/bridge/IOwnable.sol         |   5 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/ChallengeManager.sol             |  19 +-
 .../src/challenge/IChallengeManager.sol            |   4 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../implementation/src/libraries/Constants.sol     |   8 +-
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         | 167 +++++-
 .../implementation/src/libraries/IGasRefunder.sol  |  26 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   9 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../OneStepProofEntry/meta.txt                     |   2 +-
 .../OneStepProofEntry/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProofEntry/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../src/osp/IOneStepProofEntry.sol                 |   2 +-
 .../OneStepProofEntry/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProofEntry.sol                  |   2 +-
 .../OneStepProofEntry/src/state/Deserialize.sol    |   4 +-
 .../OneStepProofEntry/src/state/GlobalState.sol    |   9 +-
 .../OneStepProofEntry/src/state/Instructions.sol   |   2 +-
 .../OneStepProofEntry/src/state/Machine.sol        |   2 +-
 .../OneStepProofEntry/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProofEntry/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProofEntry/src/state/StackFrame.sol     |   2 +-
 .../OneStepProofEntry/src/state/Value.sol          |   2 +-
 .../OneStepProofEntry/src/state/ValueArray.sol     |   2 +-
 .../OneStepProofEntry/src/state/ValueStack.sol     |   2 +-
 .../OneStepProver0/meta.txt                        |   2 +-
 .../OneStepProver0/src/bridge/IBridge.sol          | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProver0/src/bridge/IOwnable.sol         |   5 +-
 .../OneStepProver0/src/bridge/ISequencerInbox.sol  | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../OneStepProver0/src/libraries/IGasRefunder.sol  |  26 +-
 .../OneStepProver0/src/osp/IOneStepProver.sol      |   3 +-
 .../OneStepProver0/src/osp/OneStepProver0.sol      |   2 +-
 .../OneStepProver0/src/state/Deserialize.sol       |   4 +-
 .../OneStepProver0/src/state/GlobalState.sol       |   9 +-
 .../OneStepProver0/src/state/Instructions.sol      |   2 +-
 .../OneStepProver0/src/state/Machine.sol           |   2 +-
 .../OneStepProver0/src/state/MerkleProof.sol       |   2 +-
 .../OneStepProver0/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProver0/src/state/StackFrame.sol        |   2 +-
 .../OneStepProver0/src/state/Value.sol             |   2 +-
 .../OneStepProver0/src/state/ValueArray.sol        |   2 +-
 .../OneStepProver0/src/state/ValueStack.sol        |   2 +-
 .../OneStepProverHostIo/meta.txt                   |   2 +-
 .../OneStepProverHostIo/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverHostIo/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../OneStepProverHostIo/src/bridge/Messages.sol    |   2 +-
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverHostIo/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverHostIo.sol                | 110 +++-
 .../OneStepProverHostIo/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverHostIo/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverHostIo/src/state/Instructions.sol |   2 +-
 .../OneStepProverHostIo/src/state/Machine.sol      |   2 +-
 .../OneStepProverHostIo/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverHostIo/src/state/Module.sol       |   6 +-
 .../OneStepProverHostIo/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverHostIo/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverHostIo/src/state/Value.sol        |   2 +-
 .../OneStepProverHostIo/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverHostIo/src/state/ValueStack.sol   |   2 +-
 .../OneStepProverMath/meta.txt                     |   2 +-
 .../OneStepProverMath/src/bridge/IBridge.sol       | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMath/src/bridge/IOwnable.sol      |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMath/src/osp/IOneStepProver.sol   |   3 +-
 .../src/osp/OneStepProverMath.sol                  |   2 +-
 .../OneStepProverMath/src/state/Deserialize.sol    |   4 +-
 .../OneStepProverMath/src/state/GlobalState.sol    |   9 +-
 .../OneStepProverMath/src/state/Instructions.sol   |   2 +-
 .../OneStepProverMath/src/state/Machine.sol        |   2 +-
 .../OneStepProverMath/src/state/MerkleProof.sol    |   2 +-
 .../OneStepProverMath/src/state/Module.sol         |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMath/src/state/StackFrame.sol     |   2 +-
 .../OneStepProverMath/src/state/Value.sol          |   2 +-
 .../OneStepProverMath/src/state/ValueArray.sol     |   2 +-
 .../OneStepProverMath/src/state/ValueStack.sol     |   2 +-
 .../OneStepProverMemory/meta.txt                   |   2 +-
 .../OneStepProverMemory/src/bridge/IBridge.sol     | 124 +++--
 .../src/bridge/IDelayedMessageProvider.sol         |   5 +-
 .../OneStepProverMemory/src/bridge/IOwnable.sol    |   5 +-
 .../src/bridge/ISequencerInbox.sol                 | 215 ++++++--
 .../src/libraries/Error.sol => /dev/null           |  44 --
 .../src/libraries/IGasRefunder.sol                 |  26 +-
 .../OneStepProverMemory/src/osp/IOneStepProver.sol |   3 +-
 .../src/osp/OneStepProverMemory.sol                |   3 +-
 .../OneStepProverMemory/src/state/Deserialize.sol  |   4 +-
 .../OneStepProverMemory/src/state/GlobalState.sol  |   9 +-
 .../OneStepProverMemory/src/state/Instructions.sol |   2 +-
 .../OneStepProverMemory/src/state/Machine.sol      |   2 +-
 .../OneStepProverMemory/src/state/MerkleProof.sol  |   2 +-
 .../OneStepProverMemory/src/state/Module.sol       |   6 +-
 .../OneStepProverMemory/src/state/ModuleMemory.sol |  11 +-
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../OneStepProverMemory/src/state/StackFrame.sol   |   2 +-
 .../OneStepProverMemory/src/state/Value.sol        |   2 +-
 .../OneStepProverMemory/src/state/ValueArray.sol   |   2 +-
 .../OneStepProverMemory/src/state/ValueStack.sol   |   2 +-
 .../SequencerInbox/implementation/meta.txt         |   2 +-
 .../implementation/src/bridge/IBridge.sol          |  41 +-
 .../src/bridge/IDelayedMessageProvider.sol         |   2 +-
 .../implementation/src/bridge/IERC20Bridge.sol     |  37 ++
 .../src/bridge/IInbox.sol => /dev/null             | 193 -------
 .../implementation/src/bridge/IInboxBase.sol       |  86 +++
 .../implementation/src/bridge/IOutbox.sol          |  12 +-
 .../implementation/src/bridge/IOwnable.sol         |   2 +-
 .../implementation/src/bridge/ISequencerInbox.sol  | 117 ++++-
 .../implementation/src/bridge/Messages.sol         |   2 +-
 .../implementation/src/bridge/SequencerInbox.sol   | 582 ++++++++++++++++-----
 .../implementation/src/challenge/ChallengeLib.sol  |   2 +-
 .../src/challenge/IChallengeManager.sol            |   2 +-
 .../src/challenge/IChallengeResultReceiver.sol     |   2 +-
 .../src/libraries/ArbitrumChecker.sol              |  16 +
 .../src/libraries/Constants.sol => /dev/null       |  13 -
 .../src/libraries/DelegateCallAware.sol            |   2 +-
 .../implementation/src/libraries/Error.sol         |  51 +-
 .../src/libraries/GasRefundEnabled.sol             |  52 ++
 .../implementation/src/libraries/IGasRefunder.sol  |  30 +-
 .../implementation/src/libraries/IReader4844.sol   |  13 +
 .../implementation/src/libraries/MessageTypes.sol  |   2 +-
 .../implementation/src/osp/IOneStepProofEntry.sol  |   2 +-
 .../implementation/src/osp/IOneStepProver.sol      |   3 +-
 .../implementation/src/precompiles/ArbGasInfo.sol  | 152 ++++++
 .../implementation/src/precompiles/ArbSys.sol      | 152 ++++++
 .../implementation/src/rollup/IRollupCore.sol      |  19 +-
 .../src/rollup/IRollupEventInbox.sol               |   6 +-
 .../implementation/src/rollup/IRollupLogic.sol     | 136 +----
 .../implementation/src/rollup/Node.sol             |  16 +-
 .../src/rollup/RollupLib.sol => /dev/null          | 151 ------
 .../src/state/Deserialize.sol => /dev/null         | 302 -----------
 .../implementation/src/state/GlobalState.sol       |   2 +-
 .../implementation/src/state/Instructions.sol      |   2 +-
 .../implementation/src/state/Machine.sol           |   2 +-
 .../src/state/MerkleProof.sol => /dev/null         |  99 ----
 .../implementation/src/state/Module.sol            |   6 +-
 .../src/state/ModuleMemory.sol => /dev/null        |  43 --
 .../src/state/ModuleMemoryCompact.sol              |  17 +
 .../implementation/src/state/StackFrame.sol        |   2 +-
 .../implementation/src/state/Value.sol             |   2 +-
 .../implementation/src/state/ValueArray.sol        |   2 +-
 .../implementation/src/state/ValueStack.sol        |   2 +-
 .../null => discovery/nova/ethereum/.code/meta.txt |   2 +
 196 files changed, 4487 insertions(+), 2845 deletions(-)
```

Generated with discovered.json: 0xce1846ca8a71c542f62d345e25419cdb72e8f071

# Diff at Fri, 08 Mar 2024 11:12:54 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 19132347
- current block number: 19390070

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19132347 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
    +++ description: None
      values.dacKeyset.threshold:
-        2
      values.dacKeyset.keyCount:
-        6
      values.dacKeyset.requiredSignatures:
+        5
      values.dacKeyset.membersCount:
+        6
    }
```

Generated with discovered.json: 0x11137089528e466103478529e9825c95fb2f9c20

# Diff at Thu, 01 Feb 2024 08:18:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18564156
- current block number: 19132347

## Description

Add the SequencerInboxVersion handler. Updated OS version to ArbOS 11. Added other useful handlers.

## Watched changes

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.dacKeyset.keyCount:
-        8
+        6
      values.keySetUpdates:
-        10
+        11
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18564156 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
      values.dacKeyset:
+        {"threshold":2,"keyCount":8}
      values.keySetUpdates:
+        10
      values.sequencerVersion:
+        "0x88"
      derivedName:
+        "SequencerInbox"
    }
```

```diff
    contract ArbitrumProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      name:
-        "ArbitrumProxy"
+        "RollupProxy"
      values.challenges:
+        []
      values.setValidatorCount:
+        6
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","0x3B0369CAD35d257793F51c28213a4Cf4001397AC","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","0x610Aa279989F440820e14248BD3879B148717974","0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"]
      derivedName:
+        "ArbitrumProxy"
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    }
```

# Diff at Mon, 13 Nov 2023 16:26:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: master@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Some of the Security Council members were replaced.

Names of the owners of the EOAs listed below were manually found on public Arbitrum forums,
so they may be incorrect.

Removed EOAs:

- 0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF (Mo Dong?)
- 0x0E5011001cF9c89b0259BC3B050785067495eBf5 (Diane Dai?)
- 0x8688515028955734350067695939423222009623 (Celeb Lau?)
- 0x88910996671162953E89DdcE5C8137f9077da217 (??)
- 0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5 (Bryan Pellegrino?)

Added EOAs:

- 0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3 (Patrick McCorry?)
- 0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed (0xhombre?)
- 0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF (John Morrow?)
- 0xb07dc9103328A51128bC6Cc1049d1137035f5E28 (Omer Goldberg?)
- 0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23 (Matt Fiebach?)

## Watched changes

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

# Diff at Fri, 22 Sep 2023 07:25:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
