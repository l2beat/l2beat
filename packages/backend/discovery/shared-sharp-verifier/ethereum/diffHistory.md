Generated with discovered.json: 0x44c7b8f66db0ba70809441037dc1d34ee8a21b5b

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
