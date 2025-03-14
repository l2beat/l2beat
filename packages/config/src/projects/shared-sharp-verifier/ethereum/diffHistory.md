Generated with discovered.json: 0x95382d75cd121cf6b8b6f804b9f0a8a27505fdd9

# Diff at Tue, 04 Mar 2025 12:37:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 21951256
- current block number: 21973570

## Description

removed level 2 and 3 contracts because they are expired. see `isValidOnReference()` in the SHARPVerifier.

config related: starknet discodrive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21951256 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      sinceBlock:
+        20376819
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E)
    +++ description: None
```

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      sinceBlock:
+        16770549
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA)
    +++ description: None
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9)
    +++ description: None
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      sinceBlock:
+        13480127
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367)
    +++ description: None
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      sinceBlock:
+        20376820
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c)
    +++ description: None
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level3SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
-   Status: DELETED
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      sinceBlock:
+        20376818
    }
```

```diff
-   Status: DELETED
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1)
    +++ description: None
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sinceBlock:
+        20407220
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      sinceBlock:
+        20376785
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc)
    +++ description: None
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      sinceBlock:
+        20376819
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
-   Status: DELETED
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      sinceBlock:
+        20376818
    }
```

```diff
-   Status: DELETED
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      sinceBlock:
+        20376821
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc)
    +++ description: None
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd)
    +++ description: None
```

Generated with discovered.json: 0xa84d934cf1c8e32e772a9256c107c7b88ece99f3

# Diff at Sat, 01 Mar 2025 11:47:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a345eaeb3dc1d9d41bdaf608eb366f7f0aae874a block: 21766214
- current block number: 21951256

## Description

config related: renamed some starknet contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766214 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      name:
-        "SHARPVerifierProxy"
+        "SHARPVerifierCallProxy"
      values.upgradeActivationDelayFmt:
+        "0s"
      template:
+        "shared-sharp-verifier/SHARPVerifierCallProxy"
      description:
+        "Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay."
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      template:
+        "shared-sharp-verifier/CairoBootloaderProgram"
      description:
+        "Bootloader program for the SHARPVerifier."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level3SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      name:
-        "OldSHARPVerifier"
+        "Level3SHARPVerifier"
      template:
-        "shared-sharp-verifier/DeprecatedVerifier"
+        "shared-sharp-verifier/Level3SHARPVerifier"
      values.bootloaderProgramContractAddress:
-        "0x0000000000000000000000000000000000000008"
      values.cpuFrilessVerifiers:
-        []
      values.memoryPageFactRegistry:
-        "0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4"
      description:
+        "Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      template:
-        "shared-sharp-verifier/Verifier"
+        "shared-sharp-verifier/SHARPVerifier"
      description:
+        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: Bootloader program for the SHARPVerifier.
      template:
+        "shared-sharp-verifier/CairoBootloaderProgram"
      description:
+        "Bootloader program for the SHARPVerifier."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      template:
-        "shared-sharp-verifier/DeprecatedVerifier"
+        "shared-sharp-verifier/Level2SHARPVerifier"
      description:
+        "Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/MemoryPageFactRegistry"
      description:
+        "Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier."
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract OldMemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4)
    +++ description: None
```

Generated with discovered.json: 0x8b4d91c6e108abe69cf276f6947ea54a64b20646

# Diff at Mon, 03 Feb 2025 13:17:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3a66ce5694d8c3f9dfc80675eaa6c0bc1a2489b3 block: 20842982
- current block number: 21766214

## Description

Removed EOA permission.

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","via":[]}
      values.$admin:
-        ["0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]
+        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      name:
-        "SHARPVerifierGovernorMultisig"
+        "SHARPVerifierAdminMultisig"
    }
```

Generated with discovered.json: 0x3dfb5f7729604707a3662c768eb267e9ca64202e

# Diff at Mon, 20 Jan 2025 11:10:05 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20842982
- current block number: 20842982

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      receivedPermissions.0.from:
+        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
      issuedPermissions.1.to:
+        "0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
      issuedPermissions.0.target:
-        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
      issuedPermissions.0.to:
+        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
    }
```

Generated with discovered.json: 0x92de448ebe52681a228f7ddc64c08037654355c2

# Diff at Mon, 21 Oct 2024 11:10:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.7.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x4b25445a8e86b4620b9a19f747122b518d8973975ea73aa474b210395e277b66"
      values.$pastUpgrades.6.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.6.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x7c71592ea4c455371365d843f1a21bbf647aad7d6fae12f7187650ce24805f00"
      values.$pastUpgrades.5.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.5.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
      values.$pastUpgrades.4.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.4.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
      values.$pastUpgrades.3.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.3.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0xbaa8ffb1b7e5177dbf75de753b9b2ff2fc313b244ff910cfd6d7f1f6254b6e1a"
      values.$pastUpgrades.2.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.2.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0xc31b74237a0c68aa1b95fe2ed28ad54cf6d7df42a8beab1ea947532c95dda20a"
      values.$pastUpgrades.1.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.1.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x604e235c6207b7909f6fc8dc0bd86b410e935dcf2f6f6bd37a5567a89379353a"
      values.$pastUpgrades.0.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.0.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x80ebb7a22a207d00e26464db2f8a719d43eb3b836740a693aad13d5ef922f5e4"
    }
```

Generated with discovered.json: 0x6664bf1510a000dec22ac5848542740064506791

# Diff at Mon, 14 Oct 2024 10:55:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      sourceHashes:
+        ["0x412fb414e7fea74325d60a077f704a49cf6d23a7a1d43c9fd09be7e9a4e5e76f"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      sourceHashes:
+        ["0x6eb94f42b6ee59326d27f5ec055a5872adf1df7825af5df411459832c72ba175"]
    }
```

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      sourceHashes:
+        ["0x23119114187536afb19dd113fa8b7a5e59da2d76ff5ad78bde5efe9dabe09c67"]
    }
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      sourceHashes:
+        ["0x23119114187536afb19dd113fa8b7a5e59da2d76ff5ad78bde5efe9dabe09c67"]
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      sourceHashes:
+        ["0xa78b7bb374044ea6a603766c4b16c5d1ec5573ddc1dfb9b9413701020ebfe195"]
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      sourceHashes:
+        ["0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      sourceHashes:
+        ["0x6156385d69e1bf7290adaaaa1e5d33748df1c8da588f686403aca38710f05693"]
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      sourceHashes:
+        ["0x05c19e648542d62b4ddf24a4fa4c15a3a6e25cd850736e41c5544eb570a9f2a2"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      sourceHashes:
+        ["0x5014b4dd4ac75d575b7511cda643b511a4f57eaffccb5aad8fe12fd2a412be65"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      sourceHashes:
+        ["0xdea77b54fa6a0489f5a57f0dc4ade2e0082aa3017b33bb8b4c47b5c693c65383"]
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      sourceHashes:
+        ["0xf51c19545fc3804626755b86bd142a8c98efcbfacbd2499b1ae9ecda7a163540"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      sourceHashes:
+        ["0x8caeb68cf2d1508fc57800f8ff78ad1b3c9ad8d0f1f6e30998fd012c9b6182ba"]
    }
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      sourceHashes:
+        ["0xdb6522c746b47c8025bdd3942737207a45de03416b891219d4ad3328e3cbcb07"]
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      sourceHashes:
+        ["0x353a1ed6ef3ef47ed725cf0832c357c4e71680318751a7bbd706d607d8acb7aa"]
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      sourceHashes:
+        ["0xc6b85b7926407ac9352754cb496033d4bf5689bc99395d4b8b15d2d79b245209"]
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      sourceHashes:
+        ["0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"]
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      sourceHashes:
+        ["0x6eb94f42b6ee59326d27f5ec055a5872adf1df7825af5df411459832c72ba175"]
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      sourceHashes:
+        ["0x0bb18873bc3a6a2cc498c681c3bc67777185bf377294eb531123d4529deb8b38"]
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      sourceHashes:
+        ["0x388a630368c27b0a52e63f2233c93b88a5fc3100ba178780176dceba351487fa"]
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      sourceHashes:
+        ["0xcc5a725835dea04291bf4edd2b8b39c4d15358a01b6baa116e9aede7b897fdf4"]
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      sourceHashes:
+        ["0x7022113b2e37d8a13b820de3fc4a30b173169193b244b19c704a5d9411e37ad0"]
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      sourceHashes:
+        ["0x1cfb47b7d41edbe1b49e9d32ab6b39caae53d74feac405b948cc774b2d8db7a5","0x1993eaf381afc46f98a6d57b20658554efa839ecfb519a698bf45042d7ff5b27"]
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      sourceHashes:
+        ["0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"]
    }
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      sourceHashes:
+        ["0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      sourceHashes:
+        ["0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"]
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      sourceHashes:
+        ["0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"]
    }
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      sourceHashes:
+        ["0x7022113b2e37d8a13b820de3fc4a30b173169193b244b19c704a5d9411e37ad0"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      sourceHashes:
+        ["0x5014b4dd4ac75d575b7511cda643b511a4f57eaffccb5aad8fe12fd2a412be65"]
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: None
      sourceHashes:
+        ["0xf4a899549b88ecceef625c257853e823973744ca16b4e995c327f29be092cc3c"]
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      sourceHashes:
+        ["0x455c07ce6901510356c3380308551257434cb25c1460e324772f60468e46682a"]
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      sourceHashes:
+        ["0xb1d6c8068e8976bde7fbfd4294f8808b6d28efd5d87ca84820a7e3e890446761"]
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      sourceHashes:
+        ["0x6c96d348b73a5436aaac0d8de8c5f06a7a625c1ff02b0c069fc677f0ac01c009"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      sourceHashes:
+        ["0x353a1ed6ef3ef47ed725cf0832c357c4e71680318751a7bbd706d607d8acb7aa"]
    }
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      sourceHashes:
+        ["0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"]
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      sourceHashes:
+        ["0x0a08e622000c261c38a85bb0054bb2b50ae684e6edf79f0986e931d10fc5c277"]
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      sourceHashes:
+        ["0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"]
    }
```

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      sourceHashes:
+        ["0x4a3316e3eb418f807ad2271f24b4764f4069731c7be4041cf2574e66ee2b20cc"]
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      sourceHashes:
+        ["0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      sourceHashes:
+        ["0xdc9bb80d233601bb801b1e447c903b9c5a929f3630f4e158f75b9931e44beb9f"]
    }
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      sourceHashes:
+        ["0xa863111e2d969c242b95e592a09048d8ae0e7c2b8c4e5d237f420f2ae9d6b6b0"]
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      sourceHashes:
+        ["0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      sourceHashes:
+        ["0x16786b57094cb8c3157552703287a310748c4453d743f9f2fa22adc7a6bf991c"]
    }
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: None
      sourceHashes:
+        ["0x851b82890362af9467218d27c5666552421bca8023529b83632b6ebc4cc6bc8f"]
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      sourceHashes:
+        ["0x5595d4856475241caf1eea25b1f3921875fcd4f8f0481ef29d2cae21d74394fb"]
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      sourceHashes:
+        ["0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"]
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      sourceHashes:
+        ["0x130226ac91c1d6deb82b863eea95c84640b9c20c1e292b26cb88fc6db73c0b15"]
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      sourceHashes:
+        ["0x683cac2609eeb80f624fedec43b3622138b0579960bf74162c2f49eebd1e1b4d"]
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      sourceHashes:
+        ["0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"]
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      sourceHashes:
+        ["0x8caeb68cf2d1508fc57800f8ff78ad1b3c9ad8d0f1f6e30998fd012c9b6182ba"]
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      sourceHashes:
+        ["0xbeae5546b3ade5af5df9bfc3c26b178639a7c992a8d59b98a3fbb46dfe0c3a2c"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      sourceHashes:
+        ["0x7deae45fbdef9d73c9faefb89a11904e2f2bd48e4cb9365f1ba55739857cbc62"]
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      sourceHashes:
+        ["0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      sourceHashes:
+        ["0xb44fea2230221135a15c6fbca5ca2f96e5962e3c7e3ec951f0971b590d8962a5"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      sourceHashes:
+        ["0x7deae45fbdef9d73c9faefb89a11904e2f2bd48e4cb9365f1ba55739857cbc62"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      sourceHashes:
+        ["0x412fb414e7fea74325d60a077f704a49cf6d23a7a1d43c9fd09be7e9a4e5e76f"]
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      sourceHashes:
+        ["0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"]
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      sourceHashes:
+        ["0xc6b85b7926407ac9352754cb496033d4bf5689bc99395d4b8b15d2d79b245209"]
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      sourceHashes:
+        ["0x85234db76e94b2ff3ad7e2f2a1b16709e261ffc53900bb726e05cf1ee79811aa"]
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      sourceHashes:
+        ["0xbe473240e6de093ae7120378ade4c19b5ab4bbe69143651df5cc3fe66c33c3eb"]
    }
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      sourceHashes:
+        ["0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"]
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      sourceHashes:
+        ["0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"]
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      sourceHashes:
+        ["0x5595d4856475241caf1eea25b1f3921875fcd4f8f0481ef29d2cae21d74394fb"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      sourceHashes:
+        ["0xdb6522c746b47c8025bdd3942737207a45de03416b891219d4ad3328e3cbcb07"]
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      sourceHashes:
+        ["0x16540ae818b59b005fe1cee4b1fbc4d3e29806d95076929b196adc7e3f347522"]
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      sourceHashes:
+        ["0x16786b57094cb8c3157552703287a310748c4453d743f9f2fa22adc7a6bf991c"]
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      sourceHashes:
+        ["0xa863111e2d969c242b95e592a09048d8ae0e7c2b8c4e5d237f420f2ae9d6b6b0"]
    }
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: None
      sourceHashes:
+        ["0x122eb6d5583cc680f59abc49750d9d6c0a65ca937e292b2ce67e18e8a8cdb114"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      sourceHashes:
+        ["0x05c19e648542d62b4ddf24a4fa4c15a3a6e25cd850736e41c5544eb570a9f2a2"]
    }
```

```diff
    contract OldMemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) {
    +++ description: None
      sourceHashes:
+        ["0xb58bf9ec993cfca7aa0c9a3df23c2bbab281d357b8088ea5769d57a6a38352a6"]
    }
```

Generated with discovered.json: 0x655bf55d66d80bcdb4dd88847fe4b44a090b1bdf

# Diff at Tue, 01 Oct 2024 11:34:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@44a272605826a951722a52b2a862abdf86e16896 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-10-24T13:06:25.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2022-05-02T16:49:21.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2022-08-07T10:50:09.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2023-03-06T12:34:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-02-26T09:25:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-02-26T09:25:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-07-28T10:07:47.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-07-28T20:08:35.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]]]
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0xb29a39303bfc9827c15a8514e8c3e6f06ac66853

# Diff at Fri, 27 Sep 2024 15:54:28 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756791
- current block number: 20842982

## Description

Add signer to SHARPVerifierGovernorMultisig.

## Watched changes

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      values.$members.3:
+        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
      values.$members.2:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
      values.$members.1:
-        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.$members.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x0405107a60391Eb51821be373ff978115Ee58488"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x23ac602e5cc33add49f501507d85408bc3f89b74

# Diff at Sun, 15 Sep 2024 15:05:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20440714
- current block number: 20756791

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      values.bootloaderProgramContractAddress:
+        "0x0000000000000000000000000000000000000008"
      values.cpuFrilessVerifiers:
+        []
    }
```

Generated with discovered.json: 0xaeb113ee3aa75cca1c42a7ad41806c76eee26522

# Diff at Fri, 30 Aug 2024 07:59:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x65d0556fcac240a27d3265cc50da97e98f8a9c77

# Diff at Wed, 21 Aug 2024 10:05:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60","via":[]}]
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4","via":[]},{"permission":"upgrade","target":"0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","via":[]}]
    }
```

Generated with discovered.json: 0x86e2a6fc9a2b8c94699e05c077c90d8bf04f6370

# Diff at Fri, 09 Aug 2024 10:12:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]
      assignedPermissions.upgrade:
+        ["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0xebc8416179fE90854fe8B3f774801165572cfD7F","0x955B978F3ee7818dA71fA25c676062E6BC462Fec"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0xebc8416179fE90854fe8B3f774801165572cfD7F","0x955B978F3ee7818dA71fA25c676062E6BC462Fec"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xc4095b9fe151aa9ae9134c09679c785f7ae93b43

# Diff at Fri, 02 Aug 2024 12:00:46 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6303daac6763b37e188cf2b2de396f3d25372c89 block: 19531641
- current block number: 20440714

## Description

A new GpsStatementVerifier (SHARPVerifier) is deployed and registered with all its relatives:
- `constant N_BUILTINS` increased from 9 to 11 (https://docs.cairo-lang.org/how_cairo_works/builtins.html)
- introduction of `applicativeBootloaderProgramHash_` in addition to the old `simpleBootloaderProgramHash_`
- `OFFSET_N_VERIFIER_FRIENDLY_LAYERS` introduced in the offsets section
- `PROGRAM_SIZE` increased from 728 to 794

A related commit to the cairo repo [can be found here](https://github.com/starkware-libs/cairo-lang/commit/0e4dab8a6065d80d1c726394f5d9d23cb451706a). 

The discovery config now uses templates and recursively discovers old verifiers and their relatives.

### Applicative bootloader upgrade
Check out the excalidraw: https://app.excalidraw.com/s/1Pobo8fNXle/4L6PujZS81l
Copypaste summary from Bartek's research:
- Bootloader that they are using rn allows for running a list of Tasks. Each Task produces an output and these outputs are streamed to DA layer. It's very simple.
- Now they have introduced a new bootloader (CAIRO program) called applicative bootloader. Think about it as a program that runs a sequence of Base Tasks programs (e.g. StarkNet os), then runs an Aggregator Task program which takes output from Base programs, merges that output and produces "aggregated" output.
- If you tried to run the same sequence (couple of Base Tasks + Aggregator) you would produce output from both Base Tasks AND the Aggretor which kind of defeats the purpose of the Aggregator. With applicative bootloader you only have output from the Aggregator (+ hash of Base Task so that you know what was actually aggregated).
- my understanding is that Sharp is now "ready" but since they haven't upgraded the StarkNet core contract, they are not using this feature yet

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.callProxyImplementation:
-        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
+        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
      values.StarkWareProxy_callImplementation:
-        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
+        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      template:
-        "shared-sharp-verifier/Verifier"
+        "shared-sharp-verifier/DeprecatedVerifier"
    }
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/CairoBootloaderProgram.sol      |  809 +++
 ...-0x05C98569CA566a2035b87dE7d1b623C950798035.sol | 4408 +++++++++++++
 ...-0x351666E9EeA6E012f08695ccd1923f37519563f1.sol | 3208 ++++++++++
 ...-0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5.sol | 5047 +++++++++++++++
 ...-0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717.sol | 6512 ++++++++++++++++++++
 ...-0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46.sol | 5790 +++++++++++++++++
 ...-0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE.sol | 6252 +++++++++++++++++++
 ...-0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B.sol | 5067 +++++++++++++++
 ...-0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67.sol | 3584 +++++++++++
 ...-0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3.sol | 3080 +++++++++
 ...-0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E.sol | 3192 ++++++++++
 ...-0x243682b9A01455ac671c97D8dE686EBd4EE25791.sol | 3175 ++++++++++
 ...-0x3d57526c1C8D63fa2A8704487Df65e9000166c8E.sol | 3080 +++++++++
 ...-0x42AF9498647Be47A256C9cc8278eE94473Cb7771.sol | 3178 ++++++++++
 ...-0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1.sol | 3080 +++++++++
 ...-0xAaAe0edF6536de72E7163D293518c40011179f8a.sol | 3134 ++++++++++
 ...-0xe155154845950573EC5F518fC0D4950AB71303ff.sol | 3236 ++++++++++
 ...-0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb.sol | 5674 +++++++++++++++++
 ...-0x4742f8723CAE9C17Cb1D54708898904fB43621c9.sol | 6069 ++++++++++++++++++
 ...-0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17.sol | 3904 ++++++++++++
 ...-0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e.sol | 3029 +++++++++
 ...-0xA9db7bDfbc3664C8954f490e4d94B8607a080f23.sol | 3855 ++++++++++++
 ...-0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0.sol | 4849 +++++++++++++++
 ...-0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40.sol | 2957 +++++++++
 ...-0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84.sol | 3819 ++++++++++++
 .../ethereum/.flat/EcdsaPointsXColumn.sol          |  648 ++
 .../ethereum/.flat/EcdsaPointsYColumn.sol          |  648 ++
 .../ethereum/.flat/FriStatementContract.sol        | 1278 ++++
 .../ethereum/.flat/MemoryPageFactRegistry.sol      |  344 ++
 .../ethereum/.flat/MerkleStatementContract.sol     |  286 +
 .../ethereum/.flat/PedersenHashPointsXColumn.sol   | 1271 ++++
 .../ethereum/.flat/PedersenHashPointsYColumn.sol   | 1271 ++++
 ...-0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540.sol |   47 +
 ...-0xedFfEA8296945aA91FC035Aefc8c33D737dBc573.sol |   47 +
 ...-0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc.sol |   47 +
 ...-0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc.sol |   47 +
 ...-0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8.sol |   47 +
 ...-0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD.sol |   47 +
 ...-0x53daC4aB94955f35657463252a7b25F343A14451.sol |  183 +
 ...-0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF.sol |  183 +
 ...-0x032e5cDb729Ce94638ACA9e82A22688109B43046.sol |  104 +
 ...-0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2.sol |  104 +
 .../ethereum/.flat/SHARPVerifier.sol               |  889 +++
 43 files changed, 107479 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531641 (main branch discovery), not current.

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonPartialRoundKey0Column"
+        "Level2PoseidonPoseidonPartialRoundKey0Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey1Column"
+        "Level2PoseidonPoseidonFullRoundKey1Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonPartialRoundKey1Column"
+        "Level2PoseidonPoseidonPartialRoundKey1Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      name:
-        "CpuFrilessVerifier1"
+        "Level2CpuFrilessVerifier0"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey2Column"
+        "Level2PoseidonPoseidonFullRoundKey2Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly2"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      name:
-        "PedersenHashPointsXColumn"
+        "Level2PedersenHashPointsXColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      name:
-        "MemoryPageFactRegistry"
+        "Level2MemoryPageFactRegistry"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly3"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods2"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      name:
-        "CpuFrilessVerifier2"
+        "Level2CpuFrilessVerifier1"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      name:
-        "CpuFrilessVerifier3"
+        "Level2CpuFrilessVerifier2"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonPartialRoundKey1Column"
+        "Level2PoseidonPoseidonPartialRoundKey1Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      name:
-        "MerkleStatementContract"
+        "Level2MerkleStatementContract"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      name:
-        "CpuFrilessVerifier4"
+        "Level2CpuFrilessVerifier3"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods3"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      template:
+        "shared-sharp-verifier/DeprecatedVerifier"
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods4"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonPartialRoundKey0Column"
+        "Level2PoseidonPoseidonPartialRoundKey0Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey0Column"
+        "Level2PoseidonPoseidonFullRoundKey0Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      name:
-        "CpuFrilessVerifier5"
+        "Level2CpuFrilessVerifier4"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods5"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      name:
-        "EcdsaPointsYColumn"
+        "Level2EcdsaPointsYColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      name:
-        "CpuFrilessVerifier6"
+        "Level2CpuFrilessVerifier5"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      name:
-        "CairoBootloaderProgram"
+        "Level2CairoBootloaderProgram"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey2Column"
+        "Level2PoseidonPoseidonFullRoundKey2Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly4"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods6"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      name:
-        "CpuFrilessVerifier7"
+        "Level2CpuFrilessVerifier6"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey1Column"
+        "Level2PoseidonPoseidonFullRoundKey1Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      name:
-        "EcdsaPointsXColumn"
+        "Level2EcdsaPointsXColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods7"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly5"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      name:
-        "CpuFrilessVerifier8"
+        "Level2CpuFrilessVerifier7"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      name:
-        "SHARPVerifier"
+        "Level2SHARPVerifier"
      template:
+        "shared-sharp-verifier/Verifier"
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly6"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      name:
-        "FriStatementContract"
+        "Level2FriStatementContract"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly7"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey0Column"
+        "Level2PoseidonPoseidonFullRoundKey0Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      name:
-        "PedersenHashPointsYColumn"
+        "Level2PedersenHashPointsYColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

Generated with discovered.json: 0x42ce99e80cd13ef6a6889fb328565d57beecd590

# Diff at Thu, 18 Jul 2024 10:33:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531641
- current block number: 19531641

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531641 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]}
    }
```

Generated with discovered.json: 0x5c0ffa57659e38889ca2880a1ee7efda61b6d240

# Diff at Thu, 28 Mar 2024 09:13:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19468852
- current block number: 19531641

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19468852 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xaff8a6ad66c53b2303b9c9c77d308de4890151ad

# Diff at Tue, 19 Mar 2024 12:40:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@284847fdd85d7b4f5b56effe092db242cda5349d block: 19432182
- current block number: 19468852

## Description

Updated the names and references to new SHARP verfier contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432182 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x03Fa911dfCa026D9C8Edb508851b390accF912e8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x0C099caf7a87e4eB28bcd8D0608063f8a69bb434)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x217750c27bE9147f9e358D9FF26a8224F8aCC214)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x297951a67D1BF7795500C3802d21a8C846D9C962)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x3405F644F9390C3478f42Fd205CE6920CcAF3280)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey0Column (0x37070Fd8051f63E5A6D7E87026e086Cc19db1aBe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FriStatementContract (0x3E6118DA317f7A433031F03bB71ab870d87dd2DD)
    +++ description: None
```

```diff
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      name:
-        "GpsMemoryPageFactRegistry"
+        "MemoryPageFactRegistry"
    }
```

```diff
-   Status: DELETED
    contract CpuOods (0x43A1C0bBa540e1C98d4b413F876250bdCFd0b9e0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x4bf82e627D57cB3F455E740bcDA25848cDbd2FF7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x4CF5c11321d54b83bDAE84bBbd018c26621d2950)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey1Column (0x4d0E80AB34ee2B19295F2CaC3101d03452D874b8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey2Column (0x4FB05b7CC348C5a72C59a3f307baf66e3CA1F835)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsYColumn (0x519DA5F74503dA351EbBED889111377d33096002)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x52314e0b25b024c34480Ac3c75cfE98c2Ed6aa4a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerkleStatementContract (0x5899Efea757E0Dbd6d114b3375C23D7540f65fa4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsXColumn (0x593a71DC43e9B67FE009d7C76B6EfA925FB329B1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x630A97901Ac29590DF83f4A64B8D490D54caf239)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x68293272FEA2D6e74572BC18ffaD11F21344e090)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x691ca565B7416B681e4f9Fb56A1283Ae8b34E55e)
    +++ description: None
```

```diff
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      name:
-        "SHARPVerifier"
+        "OldSHARPVerifier"
      values.constructorArgs:
-        ["0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf","0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4",["0x217750c27bE9147f9e358D9FF26a8224F8aCC214","0x630A97901Ac29590DF83f4A64B8D490D54caf239","0x8488e8f4e26eBa40faE229AB653d98E341cbE57B","0x9E614a417f8309575fC11b175A51599661f2Bd21","0xC879aF7D5eD80e4676C203FD300E640C297F31e3","0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590","0xe9664D230490d5A515ef7Ef30033d8075a8D0E24","0x03Fa911dfCa026D9C8Edb508851b390accF912e8"],"3178097804922730583543126053422762895998573737925004508949311089390705597156","2962621603719000361370283216422448934312521782617806945663080079725495842070"]
      values.memoryPageFactRegistry:
+        "0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4"
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey0Column (0x812c2AD2161D099724A99C8114c539b9e5b449cd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x8488e8f4e26eBa40faE229AB653d98E341cbE57B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x8518F459A698038B4CCED66C042c48C6bB5B17fe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x89B7a7276cBc8Cb35Ec11fAE9da83b20Db3edf20)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x943248dA0FFd5834Da56c5AD5308E2E2991378EB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x9E614a417f8309575fC11b175A51599661f2Bd21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey1Column (0xb4711a4614368516529d6118C97905aB4B28e267)
    +++ description: None
```

```diff
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      name:
-        "GpsCairoBootloaderProgram"
+        "CairoBootloaderProgram"
    }
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xBE8bd7a41ba7DC7b995a53368e7fFE30Fd2BC447)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsXColumn (0xc4f21318937017B8aBe5fDc0D48f58dBc1d18940)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xC879aF7D5eD80e4676C203FD300E640C297F31e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xc9E067AF5d00eb4aA2E73843ac36AfF83C5CeeD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsYColumn (0xcA59f6FD499ffF50c78Ffb420a9bcd0d273abf29)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xd0aAdECA2d25AEFde0da214d27b04b6ea20D7418)
    +++ description: None
```

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      name:
-        "GpsStatementVerifier"
+        "SHARPVerifier"
      values.cairoVerifierContractAddresses:
-        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.cpuFrilessVerifiers:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xe9664D230490d5A515ef7Ef30033d8075a8D0E24)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xED219933b58e9c00E66682356588d42C7932EE8E)
    +++ description: None
```

```diff
    contract MemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) {
    +++ description: None
      name:
-        "MemoryPageFactRegistry"
+        "OldMemoryPageFactRegistry"
    }
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey0Column (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey1Column (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey1Column (0x20F10963eBCA608f8B24a5AEE275861B20ec868E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier1 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey2Column (0x2b159027d7F0E23D5C15b0517e33DdA838C46045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x450909cC615036Ca4772dDDd8a69988B031811c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x473E7B002f9A3109fd0FcdA4597935E4E610f367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier2 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier3 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey1Column (0x62960C874379653D7BBe3644Ac653736Da2eda12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier4 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x704DFf65eD9b3d121d469b7A790A9927C853607F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey0Column (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey0Column (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier5 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier6 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey2Column (0xB5A5759Dd063899F213eB9699906B445f855660D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xB62Dc40175812208f509B69506315A48C92fb15A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xB640935b164024EF1BC0b9e176432c440a5cd4dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier7 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey1Column (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier8 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xE5313feE344376D22A42C9F0919e7F0d43920CAc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey0Column (0xe7B835eA7e348B25aF2480272C4cA28429573293)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd)
    +++ description: None
```

Generated with discovered.json: 0xbb98743c8594276adcd76e065855646cd7c5ccea

# Diff at Thu, 14 Mar 2024 08:53:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0d9e81470e7f864bf251e22aca8c3ece6e6f4429 block: 19426040
- current block number: 19432182

## Description

Fetch addresses from GpsStatementVerifier that were internal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19426040 (main branch discovery), not current.

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      values.bootloaderProgramContractAddress:
+        "0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40"
      values.cairoVerifierContractAddresses:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.memoryPageFactRegistry:
+        "0x40864568f679c10aC9e72211500096a5130770fA"
    }
```

```diff
+   Status: CREATED
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: None
```

Generated with discovered.json: 0x8f966e62bd027d2c699e581a404494171a98fecc

# Diff at Wed, 13 Mar 2024 12:07:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4f6a54f5fa748334d34176673b2c233534ce2fbc block: 19376058
- current block number: 19426040

## Description

This value always should've been `false`.
If it was `true` it would mean that no upgrades can be happen in the SHARPVerifier.
But that is not the case, there were upgrades happening while this was set to "`true`" in our discovered.json.
The reason for this mistake is that in the StarkWare Proxy handler the wrong slot was copied for the FINALIZATION flag.
So this is the value that is actually correct.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19376058 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.isFinal:
-        true
+        false
    }
```

Generated with discovered.json: 0xa365edf645a8b7c07fb86981c0293b69f7b70d1d

# Diff at Wed, 06 Mar 2024 12:15:21 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 19063965
- current block number: 19376058

## Description

Increased the program size. Some functions have been renamed. The `Address` library has been added. Facts are now both checked on the new contract or the old one, if the current one cannot find them. The usage of the old one has an expiration time. My understanding is that this is to enable a smoother transition to the new contract. `N_BUILTINS` have been increased by one, but not sure what it means. Some more info can be found here: <https://docs.cairo-lang.org/how_cairo_works/builtins.html#layout>.

The upgrade delay is now zero, meaning that the risk of many project is now affected.

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.callImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      upgradeability.upgradeDelay:
-        2419200
+        0
      values.callProxyImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      values.getUpgradeActivationDelay:
-        2419200
+        0
    }
```

```diff
+   Status: CREATED
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code/GpsStatementVerifier/meta.txt   |   2 +
 .../starkware/solidity/components/FactRegistry.sol |  58 ++
 .../solidity/components/ReferableFactRegistry.sol  |  90 +++
 .../solidity/interfaces/IFactRegistry.sol          |  39 ++
 .../solidity/interfaces/IQueryableFactRegistry.sol |  30 +
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../solidity/verifier/PrimeFieldElement0.sol       | 104 +++
 .../verifier/cpu/CairoBootloaderProgram.sol        | 761 +++++++++++++++++++++
 .../verifier/cpu/CairoVerifierContract.sol         |  46 ++
 .../verifier/cpu/CpuPublicInputOffsetsBase.sol     |  45 ++
 .../verifier/cpu/MemoryPageFactRegistry.sol        | 273 ++++++++
 .../starkware/solidity/verifier/cpu/PageInfo.sol   |  31 +
 .../solidity/verifier/gps/GpsOutputParser.sol      | 294 ++++++++
 .../solidity/verifier/gps/GpsStatementVerifier.sol | 336 +++++++++
 15 files changed, 2191 insertions(+)
```

Generated with discovered.json: 0x41ebaeb687d81ee3b2d9b5dcb97e265f935903f6
