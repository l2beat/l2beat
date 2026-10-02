Generated with discovered.json: 0x1d9f2ae26ae0e436adaff4af8ad1a611bc607dd9

# Diff at Fri, 02 Oct 2026 07:58:36 GMT:

- id: cf39ada6
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@f2656072394a0d215412884ecfaf57f4f0941ea0 block: 1787668956
- current timestamp: 1790927850

## Description

Upgrade to the BoLD dispute protocol (nitro-contracts v3.1.0), then RollupProxy logic upgraded to nitro-contracts v3.2.0.

RollupProxy replaced by a BoLD rollup (`isPostBoLD: true`). Validator whitelist stays enabled. Stake token ETH → WETH. `baseStake` 0.1 ETH → 0. `confirmPeriodBlocks` 45818 → 50400. `validatorAfkBlocks` 45818 → 201600. `challengeGracePeriodBlocks` set to 14400.

ChallengeManager replaced by EdgeChallengeManager: 1 big-step level. No stake is required to propose an assertion or open a challenge (`baseStake` 0, all edge stakes 0): if the validator whitelist is dropped, delay and resource exhaustion attacks cost only gas.

SafeL2 threshold lowered from 5 of 8 to 3 of 8.

Implementation diffs:

- RollupAdminLogic: https://disco.l2beat.com/diff/arb1:0xF9725312bd91CcfA3aD797e78A8A10b6d692FCd6/arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82
- RollupUserLogic: https://disco.l2beat.com/diff/arb1:0xF916Bfe431B7A7AaE083273F5b862e00a15d60F4/arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C
- ChallengeManager -> EdgeChallengeManager: https://disco.l2beat.com/diff/arb1:0x079840Cc8959Ef60d414E5AFC6ED0493b8eAf514/arb1:0x1Ef281CD6BD48affD9C44Cb590858FCfF92DE821
- SequencerInbox: https://disco.l2beat.com/diff/arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10/arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1
- Bridge: https://disco.l2beat.com/diff/arb1:0x234e937F1a2926737b0084Fb7498772579497735/arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7
- Inbox: https://disco.l2beat.com/diff/arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255/arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1
- Outbox (source unchanged): https://disco.l2beat.com/diff/arb1:0xCf66F830c4e5E1904B599ED61249601901E55D89/arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95
- RollupEventInbox: https://disco.l2beat.com/diff/arb1:0x3e9A459089758E760bEA267aBB9485EE5b47a909/arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B
- OneStepProofEntry: https://disco.l2beat.com/diff/arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98/arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4
- OneStepProver0: https://disco.l2beat.com/diff/arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585/arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612
- OneStepProverMemory: https://disco.l2beat.com/diff/arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d/arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1
- OneStepProverMath: https://disco.l2beat.com/diff/arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01/arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb
- OneStepProverHostIo: https://disco.l2beat.com/diff/arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389/arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "Arbitrum proxy"
      name:
+        "RollupProxy"
      template:
+        "orbitstack/RollupProxyBoLD"
      sourceHashes:
+        ["0xc66527a2dd7fcfbb954018194b0db35218725aa1072451f6ec2470d103b4a0a2","0xf63d847cedf2798da9b8a2094930914aaa88bd781d26aa55dc6e210f542672f5"]
      description:
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators)."
      critical:
+        true
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
      sinceTimestamp:
+        1790339300
      sinceBlock:
+        508762192
      values:
+        {"$admin":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D","$implementation":["arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C"],"$pastUpgrades":[["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0x8dA371823A4937e5F371B7b53876Ee34d5d5E520","arb1:0x56411606380fD9eF28DB1AAc3897Bd4a24F26606"]],["2026-09-25T13:08:14.000Z","0xd78dca6e63ea83f3ee4198c1029026360b29db580a74a64b71d45b5beede9efa",["arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C"]]],"$upgradeCount":2,"anyTrustFastConfirmer":"arb1:0x0000000000000000000000000000000000000000","arbOsFromWmRoot":"ArbOS v51.1 wasmModuleRoot","baseStake":0,"bridge":"arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300","chainId":32766,"challengeGracePeriodBlocks":14400,"challengeManager":"arb1:0xf2990AFA6b36ec53BE8088ebedF876aE6E8b147F","challenges":[],"confirmPeriodBlocks":50400,"genesisAssertionHash":"0x75c2df1d9a6f98d1de62c8fc955f91b87f16fefa2fafe4d6b52118fc30e1c278","getValidators":["arb1:0x702a73680122D6EA59c275c6c6978811fD581B2e"],"inbox":"arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD","isPostBoLD":true,"latestConfirmed":"0x2ce4dde2f8b4e1eaf42e6cfe07bf01aa9e9ff670ddd8db6441076429670ccd77","loserStakeEscrow":"arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9","minimumAssertionPeriod":75,"outbox":"arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9","owner":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D","paused":false,"rollupDeploymentBlock":26054465,"rollupEventInbox":"arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4","sequencerInbox":"arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807","stakerCount":1,"stakeToken":"arb1:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1","totalWithdrawableFunds":0,"validatorAfkBlocks":201600,"validatorWalletCreator":"arb1:0xc8C95B8b35772Ce4bF9E602336082696C2dC0DB8","validatorWhitelistDisabled":false,"wasmModuleRoot":"0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c"}
      fieldMeta:
+        {"paused":{"severity":"MEDIUM"},"rollupEventInbox":{"severity":"HIGH"},"sequencerInbox":{"severity":"HIGH"},"outbox":{"severity":"HIGH"},"inbox":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"loserStakeEscrow":{"severity":"HIGH"},"stakeToken":{"severity":"HIGH"},"baseStake":{"severity":"HIGH"},"validatorAfkBlocks":{"severity":"HIGH"},"challengeGracePeriodBlocks":{"severity":"HIGH"},"$admin":{"severity":"HIGH"},"getValidators":{"severity":"LOW"},"anyTrustFastConfirmer":{"severity":"HIGH"},"minimumAssertionPeriod":{"severity":"HIGH","description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "},"confirmPeriodBlocks":{"description":"Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."},"wasmModuleRoot":{"severity":"HIGH","description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."},"arbOsFromWmRoot":{"description":"ArbOS version derived from known wasmModuleRoots."},"challenges":{"description":"Emitted on createChallenge() in RollupUserLogic."}}
      implementationNames:
+        {"arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda":"RollupProxy","arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82":"RollupAdminLogic","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C":"RollupUserLogic"}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot","0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39":"ArbOS v32 wasmModuleRoot","0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a":"ArbOS v40 wasmModuleRoot","0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499":"ArbOS v51 wasmModuleRoot","0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c":"ArbOS v51.1 wasmModuleRoot","0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97":"ArbOS v61 wasmModuleRoot","0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287":"Celestia Nitro 3.2.1 wasmModuleRoot","0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3":"Celestia Nitro 3.3.2 wasmModuleRoot","0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d":"Celestia Nitro ArbOS v40 wasmModuleRoot"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) [orbitstack/ChallengeManager]
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
+        "0xd9d7945b3c909d8777cc1798e1b56051640a57595cc65064235a913104f4e9e9"
      values.$implementation:
-        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
+        "arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"
      values.$pastUpgrades.2:
+        ["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.rollup:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      values.feeTokenPricer:
+        "arb1:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.isDelayBufferable:
+        true
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
-        "SequencerInbox"
      implementationNames.arb1:0xC08A4543b011fd4f1EfC9e26521F4e157433b3b1:
+        "SequencerInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "arb1:0xCf66F830c4e5E1904B599ED61249601901E55D89"
+        "arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"
      values.$pastUpgrades.1:
+        ["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      implementationNames.arb1:0xCf66F830c4e5E1904B599ED61249601901E55D89:
-        "ERC20Outbox"
      implementationNames.arb1:0x99761fAc22FcE23498F8004ac4025F822fEdce95:
+        "ERC20Outbox"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0xb33f29d585cf178f81b64440ee9a3c598cd398ad18d2b3c6dc6c711eaf63d5e4"
+        "0x03939c3cbd6c108ea9a077f61bb7ec6c3254fe21911bf5dfdb3c0efcb636e796"
      values.$implementation:
-        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
+        "arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"
      values.$pastUpgrades.2:
+        ["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
-        "ERC20Inbox"
      implementationNames.arb1:0x08b1395a2Ee51073d6B9ebF9E97FBeb09dcAcAf1:
+        "ERC20Inbox"
    }
```

```diff
    EOA (arb1:0x702a73680122D6EA59c275c6c6978811fD581B2e) {
    +++ description: None
      receivedPermissions.0.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.0.from:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
    }
```

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) [GnosisSafe] {
    +++ description: None
      values.$threshold:
-        5
+        3
      values.multisigThreshold:
-        "5 of 8 (63%)"
+        "3 of 8 (38%)"
      receivedPermissions.0.from:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      receivedPermissions.1.via.0:
-        {"address":"arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536"}
      receivedPermissions.1.from:
-        "arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      receivedPermissions.7:
-        {"permission":"upgrade","from":"arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33","role":"admin","via":[{"address":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"arb1:0xf2990AFA6b36ec53BE8088ebedF876aE6E8b147F","role":"admin","via":[{"address":"arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536"},{"address":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D"}]}
    }
```

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) [global/ProxyAdmin] {
    +++ description: None
      directlyReceivedPermissions.0:
-        {"permission":"upgrade","from":"arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"arb1:0xf2990AFA6b36ec53BE8088ebedF876aE6E8b147F","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A) [orbitstack/ValidatorUtils]
    +++ description: This contract implements view only utilities for validators.
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x4c274427254eb8042a8e9148268a82f423f009b03cb95a03301576bd2019277d"
+        "0xcf23a1556783b1256851289ed1e962cbab0633dca95bc20654f016b52c1d4fae"
      values.$implementation:
-        "arb1:0x234e937F1a2926737b0084Fb7498772579497735"
+        "arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"
      values.$pastUpgrades.1:
+        ["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      implementationNames.arb1:0x234e937F1a2926737b0084Fb7498772579497735:
-        "ERC20Bridge"
      implementationNames.arb1:0x31127A9c0308d8E3F6db5158a14aD674f22946d7:
+        "ERC20Bridge"
    }
```

```diff
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x35bd9f6436158f2147578ce95b85de68f435e81f1f3ed3858f7523a8c4825a1a"
+        "0x30d86d66b2eba9a29c67fd3a446f636d4d7835b6d679dab61a2cfc6e10b97b23"
      values.$implementation:
-        "arb1:0x3e9A459089758E760bEA267aBB9485EE5b47a909"
+        "arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"
      values.$pastUpgrades.1:
+        ["2026-09-25T12:28:20.000Z","0x860a45d698bee648eb02dbbd827d05d6bfdb017d472759f532a3494d60f1952e",["arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B"]]
      values.$upgradeCount:
-        1
+        2
+++ severity: HIGH
      values.rollup:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      implementationNames.arb1:0x3e9A459089758E760bEA267aBB9485EE5b47a909:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0x9fD20D42Cf52B1A0dEf8e95AD8d2E92B58ECa51B:
+        "ERC20RollupEventInbox"
    }
```

```diff
-   Status: DELETED
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm]
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.from:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      directlyReceivedPermissions.2.from:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) [orbitstack/OneStepProverMath]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    EOA (arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9) {
    +++ description: None
      receivedPermissions.0.from:
-        "arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      receivedPermissions.1.via.0:
-        {"address":"arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536"}
      receivedPermissions.1.from:
-        "arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870"
+        "arb1:0x2E3f48e1A9B9849e5c0e4Fe987AEa2dA1702Ddda"
      receivedPermissions.7:
-        {"permission":"upgrade","from":"arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33","role":"admin","via":[{"address":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"arb1:0xf2990AFA6b36ec53BE8088ebedF876aE6E8b147F","role":"admin","via":[{"address":"arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536"},{"address":"arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D"}]}
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x18Cc27B3a95a6FdEf9EAA391eff28F48F42fFe3F) [orbitstack/OneStepProverHostIo]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x583F8BA007580c83EFB4B02C66694096cD5c56d1) [orbitstack/OneStepProverMemory]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0x61006c8566fac9a3315F646dA4624C00BbCF15E4) [orbitstack/OneStepProofEntry]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0x78B101eC9736c4Ab06b0833f01Fd4c011f7CA612) [orbitstack/OneStepProver0]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xB08Ca18499389ABfDF7b14b09BD2Bd4d56D7fbbb) [orbitstack/OneStepProverMath]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (arb1:0xf2990AFA6b36ec53BE8088ebedF876aE6E8b147F) [orbitstack/EdgeChallengeManager]
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  414 +-
 .../ChallengeManager.sol => /dev/null              | 1389 ------
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3859 +++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  816 +++-
 .../OneStepProofEntry.sol                          |  679 +--
 .../{.flat@1787668956 => .flat}/OneStepProver0.sol |  553 +--
 .../OneStepProverHostIo.sol                        |  696 +--
 .../OneStepProverMath.sol                          |  152 +-
 .../OneStepProverMemory.sol                        |  472 ++-
 .../Outbox/ERC20Outbox.sol                         |  155 +-
 .../RollupEventInbox/ERC20RollupEventInbox.sol     |  822 +++-
 .../RollupProxy/RollupAdminLogic.1.sol             | 4276 +++++++++++--------
 .../RollupProxy/RollupProxy.p.sol                  | 1866 ++++----
 .../RollupProxy/RollupUserLogic.2.sol              | 4450 +++++++++++---------
 .../SequencerInbox/SequencerInbox.sol              | 1227 ++++--
 .../ValidatorUtils.sol => /dev/null                | 1668 --------
 17 files changed, 13783 insertions(+), 9729 deletions(-)
```

Generated with discovered.json: 0xc025c8217f476057cc45f9ca0c8f4dc0be6c9131

# Diff at Wed, 23 Sep 2026 05:46:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1787668956
- current timestamp: 1787668956

## Description

Refresh config-derived discovery metadata at the main-branch block.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668956 (main branch discovery), not current.

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x9699807820e218b7a2e0bc11443f27fc52b4e327

# Diff at Mon, 21 Sep 2026 11:23:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@231e4a5828ee5ff5a863f7b80215466ca39a5b1e block: 1787668956
- current timestamp: 1787668956

## Description

ossification re-review: field severities

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668956 (main branch discovery), not current.

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.severity:
+        "HIGH"
      fieldMeta.isUsingFeeToken:
+        {"severity":"HIGH"}
      fieldMeta.isDelayBufferable:
+        {"severity":"HIGH"}
      fieldMeta.rollup:
+        {"severity":"HIGH"}
      fieldMeta.bridge:
+        {"severity":"HIGH"}
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.batchPosterManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      fieldMeta:
+        {"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      fieldMeta:
+        {"paused":{"severity":"MEDIUM"},"allowListEnabled":{"severity":"HIGH"},"sequencerInbox":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      fieldMeta:
+        {"proverMem":{"severity":"HIGH"},"proverMath":{"severity":"HIGH"},"proverHostIo":{"severity":"HIGH"},"prover0":{"severity":"HIGH"}}
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      fieldMeta.sequencerInbox:
+        {"severity":"HIGH"}
      fieldMeta.$admin:
+        {"severity":"HIGH"}
    }
```

```diff
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      fieldMeta:
+        {"rollup":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x4df1607dca95f51c14d3e409f1248fdd40c4c23b

# Diff at Fri, 18 Sep 2026 10:24:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2faf827d006bceee5fb0904599ba325066c7674 block: 1787668956
- current timestamp: 1787668956

## Description

critical contracts and severities for the ossification perimeter

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668956 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      critical:
+        true
    }
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.batchPosters:
+        {"severity":"LOW"}
      fieldMeta.dacKeyset:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      critical:
+        true
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      critical:
+        true
    }
```

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      critical:
+        true
    }
```

```diff
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      critical:
+        true
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.wasmModuleRoot.severity:
+        "HIGH"
      fieldMeta.validators:
+        {"severity":"LOW"}
      fieldMeta.anyTrustFastConfirmer:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      critical:
+        true
      fieldMeta:
+        {"executors":{"severity":"LOW"}}
    }
```

```diff
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

Generated with discovered.json: 0x8d782db79cf43b6b1644510c5c06b44d4c8282e3

# Diff at Tue, 25 Aug 2026 14:43:42 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@bba6c9e66ca2dd99590b6f233fe8f6509dc767a0 block: 1779461890
- current timestamp: 1787668956

## Description

Config-related: the shared wasmModuleRoot type map gained the ArbOS v61 label. No onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779461890 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97:
+        "ArbOS v61 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x40bd7b68cb2249266f663c0a6314dc70df237600

# Diff at Fri, 12 Jun 2026 10:18:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1779461890
- current timestamp: 1779461890

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779461890 (main branch discovery), not current.

```diff
    EOA  (arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
      eoaWithUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x29bd3e018339d3f8b07fcc6d40e089c612a8dbac

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1779461890
- current timestamp: 1779461890

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779461890 (main branch discovery), not current.

```diff
    EOA  (arb1:0x702a73680122D6EA59c275c6c6978811fD581B2e) {
    +++ description: None
      receivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

```diff
    EOA  (arb1:0xe12128A5c958b299c7F033D1D52F90feb12De81D) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

Generated with discovered.json: 0xfb01c4ece3d42f53632430dd2c0e60ecd058e0a8

# Diff at Fri, 22 May 2026 14:59:17 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@af480cdcac217110f9e99ef400ba0185c35a6c55 block: 1772656885
- current timestamp: 1779461890

## Description

RollupProxy `wasmModuleRoot` rotated from ArbOS v40 to ArbOS v51.1 (consensus-v51.1, ArbOS 51 Dia, Fusaka-compatible). New root added to `globalConfig.jsonc`.

## Watched changes

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v40 wasmModuleRoot"
+        "ArbOS v51.1 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a"
+        "0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c:
+        "ArbOS v51.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x99c9dcc2beed278faf0336ac5030534cd2cb9b43

# Diff at Fri, 15 May 2026 12:35:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1772656885
- current timestamp: 1772656885

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
+        "0x9e22e05e7953684e6f00507684bb902908d6d4383b2e82ecdce789027bebc33a"
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
+        "0x1eba00857f5477dbcd075b48ce8af9c74d5cb4f93a5e714dd27b3df498737e54"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
+        "0x081875b93df655e91ec23245390ad21db0990c12125dad497f1cbf118501ccc2"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
+        "0x294155e99018f1d390be420f29ef940f9843f3ce54ed4e515d998653e2ce4293"
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.1:
-        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
+        "0x6639f412df425cd0592b0ca4cf5e4ad9d39436f0e7255e83726bb7ac6a9e37b4"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
+        "0x063a1b3c4451e69f827acd833c42e986c2c617bfaabb13884fb438185b192407"
    }
```

Generated with discovered.json: 0x0edcbdd175b97519c9b69c1bab42b214245cd663

# Diff at Fri, 08 May 2026 07:51:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1772656885
- current timestamp: 1772656885

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
    }
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x2e969e0e83aea53307795f6826413e39bb416a64bc6da18f3a339ffeef444d32"
+        "0xd64745a0edbb2ada69b81d849f2737d7c082d18ca14a715c23c4165e4eecc637"
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sourceHashes.1:
-        "0xfc1c087eedce3e4be0593d2e01fcd357b4980c69e03399574b4606e4f3b9ee04"
+        "0xb9f7bc73978fab23b0df754fac230d706fee0d774d97b8533b62b3014d5561a8"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0xb33f29d585cf178f81b64440ee9a3c598cd398ad18d2b3c6dc6c711eaf63d5e4"
    }
```

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"
+        "0x076f4dffc7979344d7d248e876b1a947d75ebdf18b5746e3e2305d62eab1ab05"
    }
```

```diff
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A) [orbitstack/ValidatorUtils] {
    +++ description: This contract implements view only utilities for validators.
      sourceHashes.0:
-        "0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"
+        "0xebcd95194086ae9c3b9095578172a3192d9d209e5b159956f1d266910d248334"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) [orbitstack/OneStepProofEntry] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x96f85480073b58d0e985cd6c68956f4a52f5ed8b2ce751b18868e2e830be3678"
+        "0xb926f057e4fad7ff5b169aeec58691133fd46de25932d8356d3dc28e4e793d3a"
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x4c274427254eb8042a8e9148268a82f423f009b03cb95a03301576bd2019277d"
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.0:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
+        "0xb739f8156f36efd1dca81c7048413241da1e5bf4a5f98001523a474136b8defd"
      sourceHashes.1:
-        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
+        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

```diff
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) [orbitstack/OneStepProverMath] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3de1ddc210fe283d7298c5f06879df577c6a475329a206b1928c74d10db656d5"
+        "0xd38b92884347e76d4ce463bc343cbf508eefb150146ed51cb80c2aee8c565122"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) [orbitstack/OneStepProver0] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x642d283934aef1189cf62e1bcd34a5081762b33fdd3ec8e823f304f874e48748"
+        "0xdec29538ea8b9a7f83edc119a9fbd3761ab24c5e0b512ecfdecc46dcdefccdc1"
    }
```

Generated with discovered.json: 0xb37134c681410eb6ab7be0d90dff0f9d3846a7c2

# Diff at Tue, 05 May 2026 10:22:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1772656885
- current timestamp: 1772656885

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772656885 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      deployerAddress:
+        "arb1:0xB3aA47edBc9A1178B56bB55D1a9E3821845870e8"
    }
```

```diff
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536) {
    +++ description: None
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A) {
    +++ description: This contract implements view only utilities for validators.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "arb1:0xe5e3eEC4c5F443B04C5c883384674FD9e3eA93D9"
    }
```

```diff
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

Generated with discovered.json: 0xbbf3beb4e0d5a8ac6fbed920b8f7565305d3f41e

# Diff at Wed, 04 Mar 2026 20:42:56 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1f42a041d14cb36a5f8712dbec0c3046cea37573 block: 1767802188
- current timestamp: 1772656885

## Description

One member of SafeL2 (AlchemyMultisig2) was rotated: 0xA351...700a replaced by 0x04a2...7Bd.

## Watched changes

```diff
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.$members.5:
-        "arb1:0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
+        "arb1:0x04a25F65200E56EAd142652b7E5eF372E169F2Bd"
    }
```

Generated with discovered.json: 0x95afca38de1bef98fa2e27b1c756532ffbda25cc

# Diff at Wed, 07 Jan 2026 16:10:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@b319218f320edec871f10dbd490519684995e58e block: 1761914121
- current timestamp: 1767802188

## Description

Inbox and SequencerInbox upgrade:
- 7702 adjustments

## Watched changes

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593:
-        "SequencerInbox"
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
+        "SequencerInbox"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535:
-        "ERC20Inbox"
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
+        "ERC20Inbox"
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xa5fc21cc15e92c13dcd4fb27c46c67ac71f02400

# Diff at Mon, 05 Jan 2026 17:44:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1761914121
- current timestamp: 1761914121

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761914121 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x51b011ebb00a1871d1aada8630291abf104dfc63

# Diff at Fri, 31 Oct 2025 13:06:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1761914121

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
