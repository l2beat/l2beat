Generated with discovered.json: 0x49b413678764a1719ce443f8afa5710f741dde09

# Diff at Fri, 03 Oct 2025 08:49:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1758893266
- current timestamp: 1759481302

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 2 (arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.2:
-        "arb1:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xe238621ae17688046a648fcfe2356cbe8bd9f753

# Diff at Fri, 26 Sep 2025 13:28:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756452867
- current timestamp: 1758893266

## Description

add new celestia nitro wasmmoduleroot

## Watched changes

```diff
    contract RollupProxy (arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "Celestia Nitro 3.3.2 wasmModuleRoot"
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3"
+        "0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756452867 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9b12c24192e0a309f9b907a877b1e38f70f6662c

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xd4163c02951fb6b8c17b813a8ad47e2820c46918

# Diff at Fri, 29 Aug 2025 07:38:56 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e68cba094085f7ab7e642304a942701f260f19fb block: 1755013885
- current timestamp: 1756452867

## Description

Conduit msig changes.

## Watched changes

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.2:
-        "arb1:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x0853f2ab4b771814065aa500b6f27fd3a491d00b

# Diff at Tue, 12 Aug 2025 15:53:40 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1752237572
- current timestamp: 1755013885

## Description

Conduit Multisig signer added.

## Watched changes

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.0:
+        "arb1:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x3292e277133015847d64faf19a9cd4d75cd1d85c

# Diff at Mon, 14 Jul 2025 12:44:23 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 356574084
- current block number: 356574084

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 356574084 (main branch discovery), not current.

```diff
    EOA  (0x026919DbCFab70a2A45775088C933331A7B25Ac6) {
    +++ description: None
      address:
-        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
+        "arb1:0x026919DbCFab70a2A45775088C933331A7B25Ac6"
    }
```

```diff
    EOA  (0x053970A9AA9638F54370764E6E9c7B2f5854Ef21) {
    +++ description: None
      address:
-        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
+        "arb1:0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
    }
```

```diff
    contract OneStepProverMemory (0x07d24d32D8F522793faEEebA16BbB97441664374) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x07d24d32D8F522793faEEebA16BbB97441664374"
+        "arb1:0x07d24d32D8F522793faEEebA16BbB97441664374"
      implementationNames.0x07d24d32D8F522793faEEebA16BbB97441664374:
-        "OneStepProverMemory"
      implementationNames.arb1:0x07d24d32D8F522793faEEebA16BbB97441664374:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0x0C79a90C94E1C1091D7D3a188730105be00798f9) {
    +++ description: None
      address:
-        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
+        "arb1:0x0C79a90C94E1C1091D7D3a188730105be00798f9"
    }
```

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "arb1:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"
+        "arb1:0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"
      values.$pastUpgrades.0.2.0:
-        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
+        "arb1:0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
      values.$pastUpgrades.1.2.0:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "arb1:0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.2.2.0:
-        "0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"
+        "arb1:0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.osp:
-        "0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d"
+        "arb1:0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d"
      values.resultReceiver:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      values.sequencerInbox:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      implementationNames.0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1:
-        "TransparentUpgradeableProxy"
      implementationNames.0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0:
-        "ChallengeManager"
      implementationNames.arb1:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0:
+        "ChallengeManager"
    }
```

```diff
    EOA  (0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E) {
    +++ description: None
      address:
-        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
+        "arb1:0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      values.$admin:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      values.$implementation.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$implementation.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$pastUpgrades.0.2.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "arb1:0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
      values.$pastUpgrades.0.2.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "arb1:0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
      values.$pastUpgrades.1.2.0:
-        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
+        "arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1.2.1:
-        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
+        "arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.anyTrustFastConfirmer:
-        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.challengeManager:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "arb1:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      values.inbox:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      values.loserStakeEscrow:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.outbox:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      values.owner:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      values.rollupEventInbox:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      values.sequencerInbox:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
+        "arb1:0x026919DbCFab70a2A45775088C933331A7B25Ac6"
      values.validators.1:
-        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
+        "arb1:0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
      values.validators.2:
-        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
+        "arb1:0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      values.validators.3:
-        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
+        "arb1:0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
      values.validators.4:
-        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
+        "arb1:0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
      values.validators.5:
-        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
+        "arb1:0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
      values.validators.6:
-        "0x83433d51B327392aA694455231D2db092eE2A5Db"
+        "arb1:0x83433d51B327392aA694455231D2db092eE2A5Db"
      values.validators.7:
-        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.validators.8:
-        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
+        "arb1:0xB180d28c01D3248C3fa88d67154a5070e5039135"
      values.validators.9:
-        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
+        "arb1:0xC929c820dC03C2a22e44F440721Af3c835e071fc"
      values.validators.10:
-        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
+        "arb1:0xD47FB043557CB2289B31d813dd4BC1223C91f872"
      values.validators.11:
-        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
+        "arb1:0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
      values.validators.12:
-        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
+        "arb1:0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
      values.validators.13:
-        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
+        "arb1:0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
      values.validators.14:
-        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
+        "arb1:0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
      values.validatorUtils:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      values.validatorWalletCreator:
-        "0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
+        "arb1:0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF"
      implementationNames.0x2633ea91d15BeE85105C9b27E068f406F2F36a4a:
-        "RollupProxy"
      implementationNames.0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
-        "RollupAdminLogic"
      implementationNames.0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
-        "RollupUserLogic"
      implementationNames.arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a:
+        "RollupProxy"
      implementationNames.arb1:0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446:
+        "RollupAdminLogic"
      implementationNames.arb1:0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77:
+        "RollupUserLogic"
    }
```

```diff
    EOA  (0x336dD5a1aB948058E4c699fD7732c2AA78C10d90) {
    +++ description: None
      address:
-        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
+        "arb1:0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
    }
```

```diff
    contract OneStepProver0 (0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad"
+        "arb1:0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad"
      implementationNames.0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad:
-        "OneStepProver0"
      implementationNames.arb1:0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad:
+        "OneStepProver0"
    }
```

```diff
    EOA  (0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f) {
    +++ description: None
      address:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "arb1:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
    }
```

```diff
    EOA  (0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe) {
    +++ description: None
      address:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "arb1:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
    }
```

```diff
    EOA  (0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5) {
    +++ description: None
      address:
-        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
+        "arb1:0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"
+        "arb1:0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"
      values.$pastUpgrades.0.2.0:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "arb1:0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
      values.$pastUpgrades.1.2.0:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.2.2.0:
-        "0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"
+        "arb1:0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.getProxyAdmin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.sequencerInbox:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      implementationNames.0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44:
-        "ERC20Inbox"
      implementationNames.arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44:
+        "ERC20Inbox"
    }
```

```diff
    EOA  (0x50930d652266EF4127FA3A1906B7Cb9951076628) {
    +++ description: None
      address:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "arb1:0x50930d652266EF4127FA3A1906B7Cb9951076628"
    }
```

```diff
    EOA  (0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885) {
    +++ description: None
      address:
-        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
+        "arb1:0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
    }
```

```diff
    EOA  (0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31) {
    +++ description: None
      address:
-        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
+        "arb1:0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
    }
```

```diff
    EOA  (0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a) {
    +++ description: None
      address:
-        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
+        "arb1:0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
    }
```

```diff
    EOA  (0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB) {
    +++ description: None
      address:
-        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
+        "arb1:0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0x6c21303F5986180B1394d2C89f3e883890E2867b"
+        "arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b"
      implementationNames.0x6c21303F5986180B1394d2C89f3e883890E2867b:
-        "ValidatorUtils"
      implementationNames.arb1:0x6c21303F5986180B1394d2C89f3e883890E2867b:
+        "ValidatorUtils"
    }
```

```diff
    contract OneStepProverHostIo (0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof.
      address:
-        "0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7"
+        "arb1:0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7"
      description:
-        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof."
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof."
      values.BLOBSTREAM:
-        "0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
+        "arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794"
      implementationNames.0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7:
+        "OneStepProverHostIo"
    }
```

```diff
    contract OneStepProofEntry (0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d"
+        "arb1:0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d"
      values.prover0:
-        "0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad"
+        "arb1:0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad"
      values.proverHostIo:
-        "0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7"
+        "arb1:0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7"
      values.proverMath:
-        "0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f"
+        "arb1:0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f"
      values.proverMem:
-        "0x07d24d32D8F522793faEEebA16BbB97441664374"
+        "arb1:0x07d24d32D8F522793faEEebA16BbB97441664374"
      implementationNames.0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d:
-        "OneStepProofEntry"
      implementationNames.arb1:0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d:
+        "OneStepProofEntry"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      address:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.$members.1:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "arb1:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$members.2:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "arb1:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.3:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "arb1:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.4:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.5:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "arb1:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.6:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "arb1:0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "arb1:0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.9:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "arb1:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.10:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "arb1:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      implementationNames.0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x79F4b4f9103298460486EC644499Df9985E34170) {
    +++ description: None
      address:
-        "0x79F4b4f9103298460486EC644499Df9985E34170"
+        "arb1:0x79F4b4f9103298460486EC644499Df9985E34170"
    }
```

```diff
    EOA  (0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7) {
    +++ description: None
      address:
-        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
+        "arb1:0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
    }
```

```diff
    EOA  (0x7CD925c107dE5C06C100F2084bFA0422F21140f0) {
    +++ description: None
      address:
-        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
+        "arb1:0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.owner:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      implementationNames.0x802c7B6585d20cb69524EF23fCbF919F671F808a:
-        "ProxyAdmin"
      implementationNames.arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x81175155D85377C337d92f1FA52Da166C3A4E7Ac) {
    +++ description: None
      address:
-        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
+        "arb1:0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
    }
```

```diff
    EOA  (0x83433d51B327392aA694455231D2db092eE2A5Db) {
    +++ description: None
      address:
-        "0x83433d51B327392aA694455231D2db092eE2A5Db"
+        "arb1:0x83433d51B327392aA694455231D2db092eE2A5Db"
    }
```

```diff
    EOA  (0x860e06Fe384D1A3340111e7D142E02642178c053) {
    +++ description: None
      address:
-        "0x860e06Fe384D1A3340111e7D142E02642178c053"
+        "arb1:0x860e06Fe384D1A3340111e7D142E02642178c053"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"
+        "arb1:0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"
      values.$pastUpgrades.0.2.0:
-        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
+        "arb1:0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
      values.$pastUpgrades.1.2.0:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.2.2.0:
-        "0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"
+        "arb1:0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"
      values.batchPosterManager:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.batchPosters.0:
-        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
+        "arb1:0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
      values.batchPosters.1:
-        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
+        "arb1:0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
      values.batchPosters.2:
-        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
+        "arb1:0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
      values.batchPosters.3:
-        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
+        "arb1:0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
      values.batchPosters.4:
-        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
+        "arb1:0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
      values.batchPosters.5:
-        "0x79F4b4f9103298460486EC644499Df9985E34170"
+        "arb1:0x79F4b4f9103298460486EC644499Df9985E34170"
      values.batchPosters.6:
-        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
+        "arb1:0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
      values.batchPosters.7:
-        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
+        "arb1:0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
      values.batchPosters.8:
-        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
+        "arb1:0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
      values.batchPosters.9:
-        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
+        "arb1:0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
      values.batchPosters.10:
-        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
+        "arb1:0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
      values.batchPosters.11:
-        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
+        "arb1:0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
      values.batchPosters.12:
-        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
+        "arb1:0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
      values.batchPosters.13:
-        "0xbE119cCc44373B15517e921e9a7D54362250662D"
+        "arb1:0xbE119cCc44373B15517e921e9a7D54362250662D"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      implementationNames.0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2CBa47e7734De9568C568C5b1b238B491Afbf73b:
-        "SequencerInbox"
      implementationNames.arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x2CBa47e7734De9568C568C5b1b238B491Afbf73b:
+        "SequencerInbox"
    }
```

```diff
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
    +++ description: None
      address:
-        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "arb1:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
+        "arb1:0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      implementationNames.0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4:
+        "GnosisSafeProxy"
      implementationNames.arb1:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x936cCC684c091b20806fA3C6668F7F1fD2B3C772) {
    +++ description: None
      address:
-        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
+        "arb1:0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
    }
```

```diff
    EOA  (0xA0737fea60F0601A192E3d2c98865A883ab0bda2) {
    +++ description: None
      address:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "arb1:0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
    }
```

```diff
    EOA  (0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038) {
    +++ description: None
      address:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "arb1:0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
    }
```

```diff
    EOA  (0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4) {
    +++ description: None
      address:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "arb1:0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

```diff
    EOA  (0xa65100caA20c06Bd278D83C60475ec4F69b23dc1) {
    +++ description: None
      address:
-        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
+        "arb1:0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
    }
```

```diff
    EOA  (0xB180d28c01D3248C3fa88d67154a5070e5039135) {
    +++ description: None
      address:
-        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
+        "arb1:0xB180d28c01D3248C3fa88d67154a5070e5039135"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.$pastUpgrades.0.2.0:
-        "0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
+        "arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      implementationNames.0xBA99217992620b76aae0D574c70bD313B30D3D1d:
-        "TransparentUpgradeableProxy"
      implementationNames.0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
-        "ERC20Outbox"
      implementationNames.arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x302275067251F5FcdB9359Bda735fD8f7A4A54c0:
+        "ERC20Outbox"
    }
```

```diff
    EOA  (0xbE119cCc44373B15517e921e9a7D54362250662D) {
    +++ description: None
      address:
-        "0xbE119cCc44373B15517e921e9a7D54362250662D"
+        "arb1:0xbE119cCc44373B15517e921e9a7D54362250662D"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.$pastUpgrades.0.2.0:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      values.executors.0:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "arb1:0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      implementationNames.0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
-        "UpgradeExecutor"
      implementationNames.arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0xC929c820dC03C2a22e44F440721Af3c835e071fc) {
    +++ description: None
      address:
-        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
+        "arb1:0xC929c820dC03C2a22e44F440721Af3c835e071fc"
    }
```

```diff
    EOA  (0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F) {
    +++ description: None
      address:
-        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
+        "arb1:0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
    }
```

```diff
    EOA  (0xD327b75C2CA829835b2B5EA9535827e9a06a480B) {
    +++ description: None
      address:
-        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
+        "arb1:0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
    }
```

```diff
    EOA  (0xD47FB043557CB2289B31d813dd4BC1223C91f872) {
    +++ description: None
      address:
-        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
+        "arb1:0xD47FB043557CB2289B31d813dd4BC1223C91f872"
    }
```

```diff
    EOA  (0xD6433a681832BD2020fc6d984Efb5f57fe9ac155) {
    +++ description: None
      address:
-        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
+        "arb1:0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
    }
```

```diff
    EOA  (0xd76a3aCEd4115B017301C54C211EC36aA5E37e05) {
    +++ description: None
      address:
-        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
+        "arb1:0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
    }
```

```diff
    EOA  (0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc) {
    +++ description: None
      address:
-        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
+        "arb1:0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
    }
```

```diff
    EOA  (0xe7685c09633B47Fe123ff47ebeA903C3763924a2) {
    +++ description: None
      address:
-        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
+        "arb1:0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
    }
```

```diff
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.$pastUpgrades.0.2.0:
-        "0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
+        "arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"
      values.bridge:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.rollup:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      implementationNames.0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC:
-        "TransparentUpgradeableProxy"
      implementationNames.0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb:
+        "ERC20RollupEventInbox"
    }
```

```diff
    EOA  (0xEBe1766201dd69A09a2953B08081829E90f4a8d3) {
    +++ description: None
      address:
-        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
+        "arb1:0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
    }
```

```diff
    EOA  (0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C) {
    +++ description: None
      address:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "arb1:0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
    }
```

```diff
    EOA  (0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0) {
    +++ description: None
      address:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "arb1:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

```diff
    EOA  (0xF3313C48BD8E17b823d5498D62F37019dFEA647D) {
    +++ description: None
      address:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "arb1:0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      values.$admin:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      values.$implementation:
-        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
+        "arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.$pastUpgrades.0.2.0:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "arb1:0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
      values.$pastUpgrades.1.2.0:
-        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
+        "arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      values.nativeToken:
-        "0xD77B108d4f6cefaa0Cae9506A934e825BEccA46E"
+        "arb1:0xD77B108d4f6cefaa0Cae9506A934e825BEccA46E"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      values.rollup:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      values.sequencerInbox:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      implementationNames.0xF3f01622Ac969156760c32190995F9dC5b3eb7FA:
-        "TransparentUpgradeableProxy"
      implementationNames.0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd:
-        "ERC20Bridge"
      implementationNames.arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd:
+        "ERC20Bridge"
    }
```

```diff
    EOA  (0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822) {
    +++ description: None
      address:
-        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
+        "arb1:0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
    }
```

```diff
    contract OneStepProverMath (0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f"
+        "arb1:0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f"
      implementationNames.0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f:
-        "OneStepProverMath"
      implementationNames.arb1:0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f:
+        "OneStepProverMath"
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x07d24d32D8F522793faEEebA16BbB97441664374)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (arb1:0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

Generated with discovered.json: 0xa71817198d688ce0b8e93620786e5a5476a166b9

# Diff at Fri, 11 Jul 2025 12:39:39 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 350405745
- current block number: 356574084

## Description

operator addresses changed.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        3
+        4
      values.stakerCount:
-        2
+        1
      values.validators.8:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.0:
-        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
      values.setIsBatchPosterCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x796c48feaf2060713c8996635295fe075f4033c9

# Diff at Fri, 04 Jul 2025 12:19:27 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 350405745
- current block number: 350405745

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 350405745 (main branch discovery), not current.

```diff
    EOA  (0x026919DbCFab70a2A45775088C933331A7B25Ac6) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x053970A9AA9638F54370764E6E9c7B2f5854Ef21) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x0C79a90C94E1C1091D7D3a188730105be00798f9) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "arb1:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      receivedPermissions.1.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.2.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x336dD5a1aB948058E4c699fD7732c2AA78C10d90) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.1.from:
-        "arbitrum:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "arb1:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.2.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.3.from:
-        "arbitrum:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.4.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.5.from:
-        "arbitrum:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.6.from:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.7.from:
-        "arbitrum:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.8.from:
-        "arbitrum:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    EOA  (0x79F4b4f9103298460486EC644499Df9985E34170) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x7CD925c107dE5C06C100F2084bFA0422F21140f0) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "arb1:0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "arb1:0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "arb1:0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "arb1:0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "arb1:0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "arb1:0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
    }
```

```diff
    EOA  (0x83433d51B327392aA694455231D2db092eE2A5Db) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0x936cCC684c091b20806fA3C6668F7F1fD2B3C772) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xa65100caA20c06Bd278D83C60475ec4F69b23dc1) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xB180d28c01D3248C3fa88d67154a5070e5039135) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xbE119cCc44373B15517e921e9a7D54362250662D) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "arb1:0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xC929c820dC03C2a22e44F440721Af3c835e071fc) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xD327b75C2CA829835b2B5EA9535827e9a06a480B) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xD47FB043557CB2289B31d813dd4BC1223C91f872) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xD6433a681832BD2020fc6d984Efb5f57fe9ac155) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xd76a3aCEd4115B017301C54C211EC36aA5E37e05) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "arb1:0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
    }
```

```diff
    EOA  (0xe7685c09633B47Fe123ff47ebeA903C3763924a2) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xEBe1766201dd69A09a2953B08081829E90f4a8d3) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

```diff
    EOA  (0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "arb1:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
    }
```

Generated with discovered.json: 0xa897014245e2076a8638888f0057d1b3e580f7d6

# Diff at Mon, 23 Jun 2025 15:27:17 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@399f5abaefa11c25467c604969aa558f53a49aa0 block: 343818309
- current block number: 350405745

## Description

Conduit: add 14 permissioned sequencers / validators.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        2
+        3
      values.stakerCount:
-        1
+        2
      values.validators.15:
+        "0x053970A9AA9638F54370764E6E9c7B2f5854Ef21"
      values.validators.14:
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.validators.13:
+        "0xB180d28c01D3248C3fa88d67154a5070e5039135"
      values.validators.12:
+        "0xC929c820dC03C2a22e44F440721Af3c835e071fc"
      values.validators.11:
+        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
      values.validators.10:
+        "0x1B15bb40898Ca818E28C0448Ebac4165d5Dd0b5E"
      values.validators.9:
+        "0xD47FB043557CB2289B31d813dd4BC1223C91f872"
      values.validators.8:
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      values.validators.7:
+        "0xe7685c09633B47Fe123ff47ebeA903C3763924a2"
      values.validators.6:
+        "0xf8b74E847cCa2EfF5E939B9B948Bf889F3DC0822"
      values.validators.5:
+        "0x026919DbCFab70a2A45775088C933331A7B25Ac6"
      values.validators.4:
+        "0x83433d51B327392aA694455231D2db092eE2A5Db"
      values.validators.3:
+        "0xEBe1766201dd69A09a2953B08081829E90f4a8d3"
      values.validators.2:
+        "0x6963d94D76D5315158B47DE0B0Ce1fd6E0F61bcB"
      values.validators.1:
-        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+        "0xd76a3aCEd4115B017301C54C211EC36aA5E37e05"
      values.validators.0:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x7Be767aFca580360eBD3dAD924B4D688daBCdaD7"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.batchPosters.14:
+        "0x936cCC684c091b20806fA3C6668F7F1fD2B3C772"
      values.batchPosters.13:
+        "0x54A51C10a3EF82Cb6B0fB6B1418882472e56Ff1a"
      values.batchPosters.12:
+        "0x50E91cb65a605E1b8B73be1fD558Fe40aBE59A31"
      values.batchPosters.11:
+        "0xE31C47980a005B6E6d6c93212388ff7e9721D2Fc"
      values.batchPosters.10:
+        "0x79F4b4f9103298460486EC644499Df9985E34170"
      values.batchPosters.9:
+        "0xCe957F6aFadFFA08dAa90cE5b47208C02a9b9B4F"
      values.batchPosters.8:
+        "0x7CD925c107dE5C06C100F2084bFA0422F21140f0"
      values.batchPosters.7:
+        "0xD6433a681832BD2020fc6d984Efb5f57fe9ac155"
      values.batchPosters.6:
+        "0xbE119cCc44373B15517e921e9a7D54362250662D"
      values.batchPosters.5:
+        "0xD327b75C2CA829835b2B5EA9535827e9a06a480B"
      values.batchPosters.4:
+        "0x4e597125DB0aDC355F084d09B945DBfc6B8e9BE5"
      values.batchPosters.3:
+        "0x336dD5a1aB948058E4c699fD7732c2AA78C10d90"
      values.batchPosters.2:
+        "0xa65100caA20c06Bd278D83C60475ec4F69b23dc1"
      values.batchPosters.1:
+        "0x50A4EB12BFbf3B83FFb5c2a6378e35Cd83e6d885"
      values.setIsBatchPosterCount:
-        1
+        2
    }
```

```diff
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
    +++ description: None
      values.$members.0:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x0C79a90C94E1C1091D7D3a188730105be00798f9"
    }
```

```diff
    EOA  (0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"fastconfirm","from":"arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"arbitrum:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]}
      receivedPermissions.1:
-        {"permission":"validate","from":"arbitrum:0x2633ea91d15BeE85105C9b27E068f406F2F36a4a","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}
      receivedPermissions.0.via:
-        [{"address":"arbitrum:0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]
    }
```

Generated with discovered.json: 0xf0b8bb0161cd405c80454887fa1e102fcf5c87c6

# Diff at Wed, 18 Jun 2025 12:22:06 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 343818309
- current block number: 343818309

## Description

config: wasmmoduleroot map updated.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 343818309 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x67ffb1853c3f18f1aa92a493117df12178e2a9f2

# Diff at Wed, 04 Jun 2025 12:25:19 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@243ef5b7e32e78ae0ff8985c4f129996d0c48c80 block: 336627087
- current block number: 343818309

## Description

conduit multisig signer change.

## Watched changes

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x9592e90f6dd024a4531e071d0667ac90fe3c70dd

# Diff at Tue, 27 May 2025 08:31:14 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 336627087
- current block number: 336627087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 336627087 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
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

Generated with discovered.json: 0x1d467d49ec1871bb2951a4c946510122d7976042

# Diff at Fri, 23 May 2025 09:41:13 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 336627087
- current block number: 336627087

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 336627087 (main branch discovery), not current.

```diff
    EOA  (0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
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
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
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
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
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
    EOA  (0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e) {
    +++ description: None
      receivedPermissions.2.permission:
-        "validate"
+        "fastconfirm"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.role:
+        ".anyTrustFastConfirmer"
      receivedPermissions.1.role:
+        ".validators"
      receivedPermissions.1.via:
+        [{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "validate"
      receivedPermissions.0.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      receivedPermissions.0.via:
-        [{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x19a8e99b62041e5dc518559400d21feb04c00741

# Diff at Wed, 14 May 2025 14:45:38 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e40b87963942c5b1b364373f150a7eda9e4eccd block: 331087763
- current block number: 336627087

## Description

upgrade to celestia nitro (blobstream), standard contracts and wasmmoduleroot.

## Watched changes

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      values.$implementation:
-        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
+        "0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"
      values.$pastUpgrades.2:
+        ["2025-01-22T18:17:09.000Z","0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$pastUpgrades.1.2:
-        ["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]
+        "0xe3dc71cb07fe7af204af6862884be9162b11cc7455660ff2be9562a12afd604c"
      values.$pastUpgrades.1.1:
-        "0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791"
+        "2025-05-12T22:18:44.000Z"
      values.$pastUpgrades.1.0:
-        "2025-01-22T18:17:09.000Z"
+        ["0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0"]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0xD89d54007079071cBA859127318b9F34eeB78049"
+        "0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d"
      implementationNames.0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED:
-        "ChallengeManager"
      implementationNames.0x78C5D1C5794C61122d2F4fEfc441B5d69e0a1Df0:
+        "ChallengeManager"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+        "0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      values.$implementation:
-        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"
      values.$pastUpgrades.2:
+        ["2024-05-15T18:56:14.000Z","0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.1.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.1.1:
-        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
+        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
      values.$pastUpgrades.1.0:
-        "2024-05-15T18:56:14.000Z"
+        "2025-04-25T21:55:46.000Z"
      values.$pastUpgrades.0.2:
-        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
+        "0xe3dc71cb07fe7af204af6862884be9162b11cc7455660ff2be9562a12afd604c"
      values.$pastUpgrades.0.1:
-        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
+        "2025-05-12T22:18:44.000Z"
      values.$pastUpgrades.0.0:
-        "2025-04-25T21:55:46.000Z"
+        ["0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44"]
      values.$upgradeCount:
-        2
+        3
      implementationNames.0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
-        "ERC20Inbox"
      implementationNames.0x2d682d33762eCd73fF07d1a7Ad95a06faE40CF44:
+        "ERC20Inbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x4030f12794a5a07697b98400d423a426b39fd6f2320b39ee377d700d4fafdc58"
      values.$implementation:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"
      values.$pastUpgrades.2:
+        ["2025-04-25T21:55:46.000Z","0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b",["0x7be08B013de2b23a6329De51C4994f841dcE1a10"]]
      values.$pastUpgrades.1.2.0:
-        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
      values.$pastUpgrades.1.1:
-        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
      values.$pastUpgrades.1.0:
-        "2025-04-25T21:55:46.000Z"
+        "2024-05-15T18:56:14.000Z"
      values.$pastUpgrades.0.2:
-        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
+        "0xe3dc71cb07fe7af204af6862884be9162b11cc7455660ff2be9562a12afd604c"
      values.$pastUpgrades.0.1:
-        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
+        ["0x2CBa47e7734De9568C568C5b1b238B491Afbf73b"]
      values.$pastUpgrades.0.0:
-        "2024-05-15T18:56:14.000Z"
+        "2025-05-12T22:18:44.000Z"
      values.$upgradeCount:
-        2
+        3
      values.sequencerVersion:
-        "0x88"
+        "0x63"
      values.CELESTIA_MESSAGE_HEADER_FLAG:
+        "0x63"
      implementationNames.0x7be08B013de2b23a6329De51C4994f841dcE1a10:
-        "SequencerInbox"
      implementationNames.0x2CBa47e7734De9568C568C5b1b238B491Afbf73b:
+        "SequencerInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x07d24d32D8F522793faEEebA16BbB97441664374)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x3524251c60e04889bB578fE6B2e2Ad86C6Fc48ad)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x74D50DbaCfef02d3dAC141b0bC40195886d7ECF7)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine. This version uses the Blobstream DA bridge (0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794) as source of truth for the DA referenced by the fault proof.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x759dbcB5E12E6bA091919c94BAa70A4797fd3D0d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xf951C50162Ce1aEC93464aCFe90F755EC9878b5f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../OneStepProverHostIo.sol                        | 1241 +++++++++++++++++++-
 .../SequencerInbox/SequencerInbox.sol              |  117 +-
 2 files changed, 1263 insertions(+), 95 deletions(-)
```

Generated with discovered.json: 0xfbe835a1e8baeb736fc86e3153560c6734dcc2a1

# Diff at Fri, 02 May 2025 17:25:23 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 331087763
- current block number: 331087763

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331087763 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x7e9c93fb7b22f2c597af59cc2c0527d62520d51b

# Diff at Tue, 29 Apr 2025 08:19:21 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331087763
- current block number: 331087763

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331087763 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]},{"permission":"interact","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]}]
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
    }
```

Generated with discovered.json: 0x491fbc5e9d3fa1bcd46a28962e0f8999246523d7

# Diff at Mon, 28 Apr 2025 11:58:17 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 315644762
- current block number: 331087763

## Description

Minor Arbitrum upgrade (non-18 decimals gas token support) [3.1.0](https://github.com/OffchainLabs/nitro-contracts/releases/tag/v3.1.0) that everyone is doing atm.

## Watched changes

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"
+        "0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2024-05-15T18:56:14.000Z","0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]
      values.$pastUpgrades.0.2:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b"
      values.$pastUpgrades.0.1:
-        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
+        ["0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]
      values.$pastUpgrades.0.0:
-        "2024-05-15T18:56:14.000Z"
+        "2025-04-25T21:55:46.000Z"
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"
+        "0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2025-04-25T21:55:46.000Z","0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b",["0x7be08B013de2b23a6329De51C4994f841dcE1a10"]]
      values.$upgradeCount:
-        1
+        2
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"
+        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
      sourceHashes.0:
-        "0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67"
+        "0x32c73666d391a33c17183e4ab20bcb0f2b925d8a99da436d2ff99c13f403e289"
      values.$implementation:
-        "0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"
+        "0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"
      values.$pastUpgrades.1:
+        ["2025-04-25T21:55:46.000Z","0xb219997f52a5ffaeb50fb6de4b69cefdd4f1844879a102820ce0878df63bc80b",["0xdF0eaCC3F37356DF320e5B5db16C7eD7A6b596dd"]]
      values.$upgradeCount:
-        1
+        2
      values.nativeTokenDecimals:
+        18
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         | 54 +++++++++++++
 .../Inbox/ERC20Inbox.sol                           | 92 +++++++++++++++++++---
 .../SequencerInbox/SequencerInbox.sol              | 24 ++++--
 3 files changed, 152 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x0217f25706aca6a4c17e41d77f7a9a8c956786ea

# Diff at Tue, 18 Mar 2025 08:15:02 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 315644762
- current block number: 315644762

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 315644762 (main branch discovery), not current.

```diff
    contract Conduit Multisig 2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "ConduitMultisig2"
+        "Conduit Multisig 2"
    }
```

Generated with discovered.json: 0x8de2807c97ac6f4c268c06c05fc139be573b5245

# Diff at Fri, 14 Mar 2025 15:37:30 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 305988230
- current block number: 315644762

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.9:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.8:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.7:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.6:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.5:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.3:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 9 (33%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x29741e2e0c248234bd7e32ff2bcb92e25ed8904a

# Diff at Thu, 06 Mar 2025 14:25:18 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x2fa921f9b0d6a355fc589c5e1eb0f870f9d8d056

# Diff at Thu, 06 Mar 2025 09:39:16 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 305988230
- current block number: 305988230

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0xBA99217992620b76aae0D574c70bD313B30D3D1d"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x8a2d8cf24bd994603ab787d1ae4872d4a2f07fae

# Diff at Tue, 04 Mar 2025 10:40:29 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        211603139
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        211603139
    }
```

```diff
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802957
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        211603139
    }
```

```diff
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802857
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        150599283
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sinceBlock:
+        155965667
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      sinceBlock:
+        211603139
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        211603139
    }
```

```diff
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4) {
    +++ description: None
      sinceBlock:
+        305331967
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        211603139
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        211603139
    }
```

```diff
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802990
    }
```

```diff
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802923
    }
```

```diff
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        211603139
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        211603139
    }
```

```diff
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        244802890
    }
```

Generated with discovered.json: 0x0310de51db7e12047796e75aeaa276a7a4fc2df7

# Diff at Thu, 27 Feb 2025 11:47:38 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 305988230
- current block number: 305988230

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0x9a090604fb314b0accec1491c16f0b16a3b1ab2c

# Diff at Fri, 21 Feb 2025 14:12:40 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 305988230
- current block number: 305988230

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305988230 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x39f8a3a7cb98d17221e8745782206be915c2219f

# Diff at Fri, 14 Feb 2025 13:33:36 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 298397636
- current block number: 305988230

## Description

Fastconfirmer added, minimum assertion set to 1 block.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"}]}
      issuedPermissions.3:
+        {"permission":"validate","to":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.to:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "interact"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
+++ description: Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. 
      values.minimumAssertionPeriod:
-        75
+        1
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.1:
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      values.validators.0:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4"
    }
```

```diff
+   Status: CREATED
    contract WinrFastconfirmerMultisig (0x8E4d378F7FB7CA940d88682B6f057b81D0495Cf4)
    +++ description: None
```

## Source code changes

```diff
.../WinrFastconfirmerMultisig/GnosisSafeL2.sol     | 1032 ++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 2 files changed, 1067 insertions(+)
```

Generated with discovered.json: 0x32529d0dfbff1c372c0dafeee03154a1ac447424

# Diff at Tue, 04 Feb 2025 12:33:58 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 298397636
- current block number: 298397636

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 298397636 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x32cce396247b2a884b03c604b202defb01099ddd

# Diff at Thu, 23 Jan 2025 10:01:23 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 296027530
- current block number: 298397636

## Description

ArbOs v32 upgrade to known contracts, no fastconfirmer set.

## Watched changes

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"
+        "0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"
      values.$pastUpgrades.1:
+        ["2025-01-22T18:17:09.000Z","0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791",["0x5AA806015FEC88669bF7DAd746BB4ADC1E79BcED"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8"
+        "0xD89d54007079071cBA859127318b9F34eeB78049"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
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
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      values.$implementation.1:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"
      values.$implementation.0:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446"
      values.$pastUpgrades.1:
+        ["2025-01-22T18:17:09.000Z","0xf99dd58af041164dc6a225a760822c2d28d41e836754dd84eefd9e4445a49791",["0xdD91f6e88576fEc4A38A518DA39C92e13CBB6446","0x1BeD37FeDFE8B2721a69A559313D2b58d16Ecd77"]]
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
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@296027530 => .flat}/OneStepProver0.sol  | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x144f8daf39e61a8e3cbf2323877d0ffa7d911e08

# Diff at Mon, 20 Jan 2025 11:10:35 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 296027530
- current block number: 296027530

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 296027530 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.2.to:
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      receivedPermissions.8.from:
+        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      receivedPermissions.7.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.7.from:
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.6.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.6.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.5.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.5.from:
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.4.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.4.from:
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.3.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.3.from:
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.2.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.2.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.1.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.1.from:
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.0.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.0.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.0.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      directlyReceivedPermissions.6.from:
+        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
      directlyReceivedPermissions.5.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      directlyReceivedPermissions.5.from:
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      directlyReceivedPermissions.4.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.4.from:
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      directlyReceivedPermissions.3.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      directlyReceivedPermissions.3.from:
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      directlyReceivedPermissions.2.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      directlyReceivedPermissions.2.from:
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      directlyReceivedPermissions.1.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      directlyReceivedPermissions.1.from:
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      directlyReceivedPermissions.0.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      directlyReceivedPermissions.0.from:
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.target:
-        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
      issuedPermissions.0.to:
+        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      directlyReceivedPermissions.2.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.2.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.1.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.1.from:
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      directlyReceivedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      directlyReceivedPermissions.0.from:
+        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
    }
```

Generated with discovered.json: 0xa3f69488451e8b0abe452b9fde3f2a215482af1f

# Diff at Thu, 16 Jan 2025 12:45:03 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 287773478
- current block number: 296027530

## Description

ConduitMultisig2 signer change.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.8:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "3 of 9 (33%)"
    }
```

Generated with discovered.json: 0x8c5b02b5e8971bf6a5a837a3e5dfbe0dd67861f6

# Diff at Wed, 08 Jan 2025 10:45:02 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287773478
- current block number: 287773478

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773478 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x22efdea3d60bcbda8329bb4b1bd96720a6048916

# Diff at Mon, 23 Dec 2024 12:55:33 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 278534982
- current block number: 287773478

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x94d2b8a64be99c328ae50979cd25ccf476590736

# Diff at Thu, 05 Dec 2024 12:03:13 GMT:

- chain: arbitrum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 278534982
- current block number: 278534982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x2d9ecf49087973742d1ee6e7e3362c1cb943f1a3

# Diff at Fri, 29 Nov 2024 11:28:52 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 278534982
- current block number: 278534982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278534982 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x1728f89b140ed4a3c5987d2081a514739f39b473

# Diff at Wed, 27 Nov 2024 13:45:26 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 269235450
- current block number: 278534982

## Description

Move to discoverydriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract ERC20Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

Generated with discovered.json: 0x6cac5b3fe80b7480ca7a97dd119e9891188696c9

# Diff at Fri, 15 Nov 2024 08:18:20 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 269235450
- current block number: 269235450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}]}
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
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0xa08f18c7789ba3492d37c76ba2a278a62c79e52c

# Diff at Mon, 04 Nov 2024 08:10:39 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 269235450
- current block number: 269235450

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 269235450 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
      issuedPermissions.2.via.0:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]}
      receivedPermissions.7.target:
-        "0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"
+        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
      receivedPermissions.6.target:
-        "0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.5.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
      receivedPermissions.4.target:
-        "0xBA99217992620b76aae0D574c70bD313B30D3D1d"
+        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
      receivedPermissions.3.target:
-        "0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"
+        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
      receivedPermissions.2.target:
-        "0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.2.via.1:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.2.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.1.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.1.via.1:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.1.via.0.address:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
+        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
      receivedPermissions.0.via.1:
-        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}
      receivedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x1277bbdfb18440f2be6d2b2885177fa2da68f65e

# Diff at Wed, 30 Oct 2024 13:14:45 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 268839923
- current block number: 269235450

## Description

Conduit MS2: Signer added.

## Watched changes

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      values.$members.7:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.0:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "2 of 7 (29%)"
+        "2 of 8 (25%)"
    }
```

Generated with discovered.json: 0x5745d27debfd01722979e1e671aa8138e70e20cc

# Diff at Tue, 29 Oct 2024 13:22:36 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267471744
- current block number: 268839923

## Description

Update challenge period to 1h.

## Watched changes

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s).
      values.confirmPeriodBlocks:
-        40320
+        300
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x6dbe7f6968298a514868837f6eddbe60c2492aa3

# Diff at Tue, 29 Oct 2024 08:54:08 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267471744
- current block number: 267471744

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.2.via.0:
+        {"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","delay":0}
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a","via":[{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"},{"address":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"}]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.1.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"
      issuedPermissions.0.via.1:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
    }
```

Generated with discovered.json: 0xa4c1ed93e4544fadc551fcef0b269c5e8d4f0723

# Diff at Mon, 28 Oct 2024 14:09:22 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471744
- current block number: 267471744

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471744 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56"]
    }
```

Generated with discovered.json: 0xac49af87c43f25ba2147d90879a7b47005138502

# Diff at Fri, 25 Oct 2024 10:05:53 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 264379343
- current block number: 267471744

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d"},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"},{"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42"},{"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456"},{"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d"},{"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"},{"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC"},{"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA"}]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.1.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xF3f01622Ac969156760c32190995F9dC5b3eb7FA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xBA99217992620b76aae0D574c70bD313B30D3D1d","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42","via":[{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"}
      receivedPermissions.0.target:
-        "0x2633ea91d15BeE85105C9b27E068f406F2F36a4a"
+        "0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1"
      receivedPermissions.0.via:
+        [{"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x802c7B6585d20cb69524EF23fCbF919F671F808a"}]
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
      issuedPermissions.0.via.0:
+        {"address":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","delay":0}
    }
```

Generated with discovered.json: 0x3c3833144cd0f8ce4b0ac00962bdfb6279c176f7

# Diff at Wed, 23 Oct 2024 14:37:09 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA"
+        "0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e"
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
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

Generated with discovered.json: 0xba79d90bfa299979a78b2babe4e629a4c70f2027

# Diff at Mon, 21 Oct 2024 12:51:52 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0xeccf11b5757373e91841845caa4191147f137fb2

# Diff at Mon, 21 Oct 2024 11:13:40 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
      values.$pastUpgrades.0.1:
-        ["0x5cA988F213EfbCB86ED7e2AACB0C15c91e648f8d"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754","0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
      values.$pastUpgrades.0.1:
-        ["0x7a299aD29499736994Aa3a9aFa3f476445FAEB2c"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
      values.$pastUpgrades.0.1:
-        ["0x18FD37A4FB9E1F06d9383958aFd236771F15A8cb"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
      values.$pastUpgrades.0.1:
-        ["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]
+        "0x42fc27511b05dc35424565463d5dd348283c330d05c963396ee1a68526ac56a5"
    }
```

Generated with discovered.json: 0xeda2de9d24f5e9c147da761055ac44819320a1e3

# Diff at Wed, 16 Oct 2024 11:44:42 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 264379343
- current block number: 264379343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264379343 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0xA7bDF7f042C8DED17C0573657da4d920Df9a7d1e","via":[]}
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x802c7B6585d20cb69524EF23fCbF919F671F808a","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x802c7B6585d20cb69524EF23fCbF919F671F808a"
+        "0x1A48A9e82dDb9cd157a67493Cc5E246D0cDd8307"
    }
```

Generated with discovered.json: 0x66b77d12751a018b1ea8760b08851019d46b97ca

# Diff at Wed, 16 Oct 2024 10:19:58 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b6ff61526cf3d704839d0155008ae72cc9070de8 block: 262718848
- current block number: 264379343

## Description

Rename shared Conduit MS.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262718848 (main branch discovery), not current.

```diff
    contract ConduitMultisig2 (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      name:
-        "WinrMultisig"
+        "ConduitMultisig2"
    }
```

Generated with discovered.json: 0x3bb8c4e52d94ba51f6b905d4110e2925ba2a9a30

# Diff at Mon, 14 Oct 2024 10:59:21 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 262718848
- current block number: 262718848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262718848 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract WinrMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

Generated with discovered.json: 0xb45c598cff89f47d8c91b6f97e76d89807592643

# Diff at Fri, 11 Oct 2024 14:19:22 GMT:

- chain: arbitrum
- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 262718848

## Description

Standard Orbit stack Optimium, .97 similar to PoP Boss. Shared Admin Multisig with ProofOfPlay Chains!

## Initial discovery

```diff
+   Status: CREATED
    contract ChallengeManager (0x0E40E41E6095A4f0607144a52d31C2F11a3FF1a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2633ea91d15BeE85105C9b27E068f406F2F36a4a)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4FeBaEF286Ca477402dafCEeB17C64de481aFB42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x526a6E634aD36bB0007c4422586c135F1F9B525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WinrMultisig (0x79C2abE3eBA9dc119318FdAaA48118e1CDB53F56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x800dA62bE6626127F71B34E795286C34C04D6712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x802c7B6585d20cb69524EF23fCbF919F671F808a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x8AeDdE55Cb361e73a0B0c0cF2A5bB35E97a20456)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xb20107bfB36D3B5AcA534aCAfbd8857b10b402a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0xBA99217992620b76aae0D574c70bD313B30D3D1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xc555b2F1D559Fbb854569b33640990D178F94747)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc5d17f6e0025a23c0AAFf7832Cc531B3034602DA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xe8709022B9C9D7347856c75910fe07e10C904446)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xe966442c0E8F28C48eF4F02BfF7a29876Dcd30CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xF3f01622Ac969156760c32190995F9dC5b3eb7FA)
    +++ description: None
```

