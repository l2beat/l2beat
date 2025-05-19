Generated with discovered.json: 0xd529ad03cd26e11a684896ba9f915ebe4f0ce3ac

# Diff at Tue, 29 Apr 2025 08:19:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208380
- current block number: 22208380

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208380 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x0B3476949e1C82160575295f58720E16EeD2BF7b","via":[]},{"permission":"propose","to":"0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3D389212A78FD7D4600C9483470e59630C293416","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x4712454AddDbAbACaAb84916546899CA9690A6fF","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions:
-        [{"permission":"interact","to":"0xc0CE2761d5cC92d25dB6ccD95e4b9483eD22D11B","description":"can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure.","via":[]},{"permission":"upgrade","to":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

Generated with discovered.json: 0xcc8389bac96d0ee1c7c30328a9616e3690c2b8b4

# Diff at Sun, 06 Apr 2025 08:20:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22194762
- current block number: 22208380

## Description

Operators change, no change to implementations.

## Watched changes

```diff
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.permission:
-        "propose"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.2.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.to:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
      issuedPermissions.0.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
      values.$pastUpgrades.2:
+        ["2025-04-05T13:02:59.000Z","0x36b019357e2b55f4676855c5ae23f1e9d02c42fd9e01bbe2873f51be02ec3b8f",["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]]
      values.$pastUpgrades.1:
+        ["2024-07-17T10:46:23.000Z","0x3dc0389b8d624e6c853fcbcba1321b88a48cefdcf2000af75c986263414c312d",["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]]
      values.$pastUpgrades.0.2:
-        "2024-07-17T10:46:23.000Z"
+        ["0xA9D78F579f1B30194F3c2Ca1987A9B91A33BDF08"]
      values.$pastUpgrades.0.1:
-        "0x3dc0389b8d624e6c853fcbcba1321b88a48cefdcf2000af75c986263414c312d"
+        "0xe6eedfdce548f3eaa2abd10d1d2195d00cc231b28017490753ea5739bc26bdca"
      values.$pastUpgrades.0.0:
-        ["0xA3facd35d9a0BD9Df1603E00F10D7b0f9Ee5f587"]
+        "2025-04-05T12:57:35.000Z"
      values.$upgradeCount:
-        1
+        3
+++ severity: HIGH
      values.challenger:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
      values.CHALLENGER:
-        "0x9f8b2470ffECbca2FFda20B9e10f6a12F33BC2Ce"
+        "0x0B3476949e1C82160575295f58720E16EeD2BF7b"
+++ severity: HIGH
      values.proposer:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
      values.PROPOSER:
-        "0x7a7690bBAb496537Ac59B45B4c59d789233BcA16"
+        "0xA1ddae0829c3bD4096c34aEC58b2BC21e3a6d10E"
    }
```

```diff
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD) {
    +++ description: None
      values.$members.3:
+        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.2:
+        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.1:
+        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
      values.$members.0:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "3 of 4 (75%)"
      receivedPermissions:
+        [{"permission":"interact","from":"0x5a4ebF927338EA6af377caEee99C85088908f57D","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]},{"permission":"upgrade","from":"0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

```diff
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.2.to:
-        "0x3D389212A78FD7D4600C9483470e59630C293416"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.2.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x3D389212A78FD7D4600C9483470e59630C293416"
      issuedPermissions.1.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
      issuedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.to:
-        "0x73c98Cf34AF1f7D798e8e6f34b16037530Bffc41"
+        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
      values.batcherHash:
-        "0x73c98Cf34AF1f7D798e8e6f34b16037530Bffc41"
+        "0x4712454AddDbAbACaAb84916546899CA9690A6fF"
      values.unsafeBlockSigner:
-        "0x843458b6De651E02dFD5bFFea0e9cfb3eca293EF"
+        "0xa54e493641d097d164A6a2D8F9895303344d88A9"
    }
```

```diff
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.0:
+        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x052a8cd5967bc3Bdb5660c989a3A68bCA683A077"
      issuedPermissions.0.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.0.via.0:
-        {"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}
    }
```

```diff
    contract Funki (0xf0AE006C6f810831DA1d2A061288575fB5082144) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0x5a4ebF927338EA6af377caEee99C85088908f57D","description":"set and change address mappings.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x1A9aE6486caEc0504657351ac473B3dF8A1367cb","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xD39a6CcCFa23cb741bB530497e42EC337f1215a8","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]},{"permission":"upgrade","from":"0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD","via":[{"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"},{"address":"0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.to:
-        "0xf0AE006C6f810831DA1d2A061288575fB5082144"
+        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
      issuedPermissions.1.via.1:
-        {"address":"0xD069C4724f9bC15FA53b3b2516594512AEf8c957"}
      issuedPermissions.1.via.0.address:
-        "0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD"
+        "0xD069C4724f9bC15FA53b3b2516594512AEf8c957"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194762 (main branch discovery), not current.

```diff
    contract AltLayer 3 (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      name:
+        "AltLayer 3"
    }
```

```diff
    contract AltLayer 1 (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      name:
+        "AltLayer 1"
    }
```

```diff
    contract AltLayer 2 (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      name:
+        "AltLayer 2"
    }
```

```diff
    contract Funki (0xf0AE006C6f810831DA1d2A061288575fB5082144) {
    +++ description: None
      name:
+        "Funki"
    }
```

Generated with discovered.json: 0x605763006a0f1065b16ec3e6bbbf961f5c924bba

# Diff at Fri, 04 Apr 2025 10:09:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194762

## Description

Standard Orbit chain.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1A9aE6486caEc0504657351ac473B3dF8A1367cb)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract Funki Multisig 2 (0x3D389212A78FD7D4600C9483470e59630C293416)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x5a4ebF927338EA6af377caEee99C85088908f57D)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x87e75DcC1BB4e5B42cB5c52eB5832d6eCC3bFeF4)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Funki Multisig 1 (0x89CB6669f87c165E7128F4a57476EE4Daa7ffbCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x8F56a665c376A08b604DD32ee6E88667A6093172)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x94519dD4BA8ba20Aaad14f7C6cD00fa1bB0192E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD069C4724f9bC15FA53b3b2516594512AEf8c957)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD39a6CcCFa23cb741bB530497e42EC337f1215a8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xD3B2Ee457Cf8F05f00c17BFe509b43BA04c9e5a2)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xF40b807c2407e1d7dabb85f3ceefd5EACc7bF3CD)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```
