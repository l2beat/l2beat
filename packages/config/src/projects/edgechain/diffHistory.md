Generated with discovered.json: 0xa2aba18a53c4e90237c2d310b8a652d640ecd53f

# Diff at Sun, 04 Oct 2026 05:55:32 GMT:

- id: 62deb5da
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d93c5b9cfdcdcc765058a84ce4841fd148b2ec6d block: 1790927856
- current timestamp: 1790927856

## Description

Ossification review: critical flags and field severities.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790927856 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      fieldMeta.confirmPeriodBlocks.severity:
+        "HIGH"
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.isUsingFeeToken:
-        {"severity":"HIGH"}
      fieldMeta.isDelayBufferable:
-        {"severity":"HIGH"}
      fieldMeta.batchPosterManager.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

Generated with discovered.json: 0x1980e634ae5eecbab2b074fb807ecff880053a0b

# Diff at Fri, 02 Oct 2026 07:58:41 GMT:

- id: c578a282
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@f2656072394a0d215412884ecfaf57f4f0941ea0 block: 1787668963
- current timestamp: 1790927856

## Description

Upgrade to the BoLD dispute protocol (nitro-contracts v3.1.0), then RollupProxy logic upgraded to nitro-contracts v3.2.0. Both executed via the UpgradeExecutor by an EOA that was added as executor.

RollupProxy replaced by a BoLD rollup (`isPostBoLD: true`). Validator whitelist stays enabled; validators 3 → 1: two GnosisSafeL2 removed as validators, one of them kept as `anyTrustFastConfirmer`. Stake token ETH → WETH. `minimumAssertionPeriod` 5 → 75. `validatorAfkBlocks` 45818 → 201600. `challengeGracePeriodBlocks` set to 14400.

ChallengeManager replaced by EdgeChallengeManager: 1 big-step level. No stake is required to propose an assertion or open a challenge (`baseStake` 0, all edge stakes 0): if the validator whitelist is dropped, delay and resource exhaustion attacks cost only gas.

SafeL2 threshold lowered from 5 of 8 to 3 of 8.

Implementation diffs:

- RollupAdminLogic: https://disco.l2beat.com/diff/arb1:0xF9725312bd91CcfA3aD797e78A8A10b6d692FCd6/arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82
- RollupUserLogic: https://disco.l2beat.com/diff/arb1:0xF916Bfe431B7A7AaE083273F5b862e00a15d60F4/arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C
- ChallengeManager -> EdgeChallengeManager: https://disco.l2beat.com/diff/arb1:0x079840Cc8959Ef60d414E5AFC6ED0493b8eAf514/arb1:0x1Ef281CD6BD48affD9C44Cb590858FCfF92DE821
- SequencerInbox: https://disco.l2beat.com/diff/arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2/arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B
- Bridge: https://disco.l2beat.com/diff/arb1:0x466AA18cE75f1a3039D4C06A3c31786d0d0386c8/arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096
- Inbox: https://disco.l2beat.com/diff/arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447/arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639
- Outbox (source unchanged): https://disco.l2beat.com/diff/arb1:0x51882B52bcc3EF8008f9F7772B0229eA2551FDdc/arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A
- RollupEventInbox (source unchanged): https://disco.l2beat.com/diff/arb1:0xd9E17C6012A50F8725aCDA0196Cecaa40657e8cB/arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3
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
    contract RollupProxy (arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e) [orbitstack/RollupProxyBoLD] {
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
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
      sinceTimestamp:
+        1790677576
      sinceBlock:
+        510000614
      values:
+        {"$admin":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf","$implementation":["arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C"],"$pastUpgrades":[["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0x8dA371823A4937e5F371B7b53876Ee34d5d5E520","arb1:0x56411606380fD9eF28DB1AAc3897Bd4a24F26606"]],["2026-09-29T10:56:54.000Z","0xacd63af2a42c503c486934295705135553e882b42941c4a538c07e7710e8b7d8",["arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C"]]],"$upgradeCount":2,"anyTrustFastConfirmer":"arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836","arbOsFromWmRoot":"ArbOS v51.1 wasmModuleRoot","baseStake":0,"bridge":"arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0","chainId":3343,"challengeGracePeriodBlocks":14400,"challengeManager":"arb1:0xedC476079a899382ff54790e943315bcBb3de7f7","challenges":[],"confirmPeriodBlocks":50400,"genesisAssertionHash":"0x75c2df1d9a6f98d1de62c8fc955f91b87f16fefa2fafe4d6b52118fc30e1c278","getValidators":["arb1:0x3f90c4913621e6758eB8767EA934FCa59ae5Dee8"],"inbox":"arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c","isPostBoLD":true,"latestConfirmed":"0x7d27f008db3522eb67b290c4107844f86b2de35b20be4100248aea2beb5df094","loserStakeEscrow":"arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28","minimumAssertionPeriod":75,"outbox":"arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764","owner":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf","paused":false,"rollupDeploymentBlock":26082513,"rollupEventInbox":"arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD","sequencerInbox":"arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479","stakerCount":1,"stakeToken":"arb1:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1","totalWithdrawableFunds":0,"validatorAfkBlocks":201600,"validatorWalletCreator":"arb1:0xc8C95B8b35772Ce4bF9E602336082696C2dC0DB8","validatorWhitelistDisabled":false,"wasmModuleRoot":"0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c"}
      fieldMeta:
+        {"paused":{"severity":"MEDIUM"},"rollupEventInbox":{"severity":"HIGH"},"sequencerInbox":{"severity":"HIGH"},"outbox":{"severity":"HIGH"},"inbox":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"loserStakeEscrow":{"severity":"HIGH"},"stakeToken":{"severity":"HIGH"},"baseStake":{"severity":"HIGH"},"validatorAfkBlocks":{"severity":"HIGH"},"challengeGracePeriodBlocks":{"severity":"HIGH"},"$admin":{"severity":"HIGH"},"getValidators":{"severity":"LOW"},"anyTrustFastConfirmer":{"severity":"HIGH"},"minimumAssertionPeriod":{"severity":"HIGH","description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "},"confirmPeriodBlocks":{"description":"Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."},"wasmModuleRoot":{"severity":"HIGH","description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."},"arbOsFromWmRoot":{"description":"ArbOS version derived from known wasmModuleRoots."},"challenges":{"description":"Emitted on createChallenge() in RollupUserLogic."}}
      implementationNames:
+        {"arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e":"RollupProxy","arb1:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82":"RollupAdminLogic","arb1:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C":"RollupUserLogic"}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot","0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39":"ArbOS v32 wasmModuleRoot","0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a":"ArbOS v40 wasmModuleRoot","0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499":"ArbOS v51 wasmModuleRoot","0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c":"ArbOS v51.1 wasmModuleRoot","0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97":"ArbOS v61 wasmModuleRoot","0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287":"Celestia Nitro 3.2.1 wasmModuleRoot","0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3":"Celestia Nitro 3.3.2 wasmModuleRoot","0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d":"Celestia Nitro ArbOS v40 wasmModuleRoot"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm]
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389) [orbitstack/OneStepProverHostIo]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    EOA (arb1:0x3f90c4913621e6758eB8767EA934FCa59ae5Dee8) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836"}]}
      receivedPermissions.1:
-        {"permission":"interact","from":"arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836"}]}
      receivedPermissions.2.via.0.address:
-        "arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005"
+        "arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836"
      receivedPermissions.2.role:
-        ".validators"
+        ".anyTrustFastConfirmer"
      receivedPermissions.2.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      receivedPermissions.2.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      receivedPermissions.3.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.3.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0:
-        {"permission":"interact","from":"arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer"}
      directlyReceivedPermissions.1.role:
-        ".validators"
+        ".anyTrustFastConfirmer"
      directlyReceivedPermissions.1.description:
-        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      directlyReceivedPermissions.1.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x119b09babba836df00fa9ed5177d4471f6c8fe8c09d7d1cdf8a96bce9b5d6533"
+        "0x29acc2652c0eb213e1a10f1c211600303d26e856116587d65e6fb4d40f0e6bae"
      values.$implementation:
-        "arb1:0x466AA18cE75f1a3039D4C06A3c31786d0d0386c8"
+        "arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096"
      values.$pastUpgrades.1:
+        ["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      implementationNames.arb1:0x466AA18cE75f1a3039D4C06A3c31786d0d0386c8:
-        "Bridge"
      implementationNames.arb1:0x81F6f682cA9bB29D759ce12d7067E1c6EF533096:
+        "Bridge"
    }
```

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) [global/ProxyAdmin] {
    +++ description: None
      directlyReceivedPermissions.5:
-        {"permission":"upgrade","from":"arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f","role":"admin"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"arb1:0xedC476079a899382ff54790e943315bcBb3de7f7","role":"admin"}
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
      receivedPermissions.0:
+        {"permission":"interact","from":"arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf"}]}
      receivedPermissions.0.role:
-        ".owner"
+        "admin"
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2:
-        {"permission":"upgrade","from":"arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF","role":"admin","via":[{"address":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f","role":"admin","via":[{"address":"arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6"},{"address":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"arb1:0xedC476079a899382ff54790e943315bcBb3de7f7","role":"admin","via":[{"address":"arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6"},{"address":"arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf"}]}
    }
```

```diff
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "arb1:0x51882B52bcc3EF8008f9F7772B0229eA2551FDdc"
+        "arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A"
      values.$pastUpgrades.1:
+        ["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      implementationNames.arb1:0x51882B52bcc3EF8008f9F7772B0229eA2551FDdc:
-        "Outbox"
      implementationNames.arb1:0x4ca08847418DE7860a6da0De2e5536F1Cd78458A:
+        "Outbox"
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
+++ severity: LOW
      values.executors.1:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
      directlyReceivedPermissions.1.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      directlyReceivedPermissions.2.from:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
    }
```

```diff
-   Status: DELETED
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager]
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01) [orbitstack/OneStepProverMath]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      values.$implementation:
-        "arb1:0xd9E17C6012A50F8725aCDA0196Cecaa40657e8cB"
+        "arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3"
      values.$pastUpgrades.1:
+        ["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3"]]
      values.$upgradeCount:
-        1
+        2
+++ severity: HIGH
      values.rollup:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      implementationNames.arb1:0xd9E17C6012A50F8725aCDA0196Cecaa40657e8cB:
-        "RollupEventInbox"
      implementationNames.arb1:0xf4d69939895E5f1d1ddCa96E5f93A878c80368c3:
+        "RollupEventInbox"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) [GnosisSafe]
    +++ description: None
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
+        "0xd9d7945b3c909d8777cc1798e1b56051640a57595cc65064235a913104f4e9e9"
      values.$implementation:
-        "arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2"
+        "arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B"
      values.$pastUpgrades.2:
+        ["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B"]]
      values.$upgradeCount:
-        2
+        3
+++ severity: HIGH
      values.rollup:
-        "arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF"
+        "arb1:0x0D9cCeB5Cd108CC9B0b7Ac3aACe3d85c28243c9e"
      values.feeTokenPricer:
+        "arb1:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.isDelayBufferable:
+        true
      implementationNames.arb1:0x066a4D939302470Bd83F1868A1Ae2485Fe75ccF2:
-        "SequencerInbox"
      implementationNames.arb1:0xfEB2537afD8519d16d0CcEa741A70f97f3D4288B:
+        "SequencerInbox"
    }
```

```diff
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x079413b2ba56c63471a9435a6cbf3759e7d14eb942e6ce789b0b893ec3e6f947"
+        "0xa8ec42edee4ac983b2d5fed2ee80ff160072927ebae439c96414a1b729fd6455"
      values.$implementation:
-        "arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447"
+        "arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639"
      values.$pastUpgrades.2:
+        ["2026-09-29T10:26:16.000Z","0x01dcca0e3a70def4762a7859bdaaf4c44124ee208d64e742e0b1d7a79a535f6f",["arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.arb1:0x6C6cf18f13C3e9b969e3acE6b8F21DfF95d4D447:
-        "Inbox"
      implementationNames.arb1:0xDD262dfDf2FCe29696f54eC5bB82C6994Ec2F639:
+        "Inbox"
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
    contract EdgeChallengeManager (arb1:0xedC476079a899382ff54790e943315bcBb3de7f7) [orbitstack/EdgeChallengeManager]
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

## Source code changes

```diff
.../{.flat@1787668963 => .flat}/Bridge/Bridge.sol  |  313 +-
 .../ChallengeManager.sol => /dev/null              | 1389 ------
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3859 +++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../GnosisSafeL2}/GnosisSafeL2.sol                 |    0
 .../GnosisSafeL2}/GnosisSafeProxy.p.sol            |    0
 .../GnosisSafeL2.sol => /dev/null                  | 1108 -----
 .../GnosisSafeProxy.p.sol => /dev/null             |   38 -
 .../{.flat@1787668963 => .flat}/Inbox/Inbox.sol    |  935 ++--
 .../OneStepProofEntry.sol                          |  679 +--
 .../{.flat@1787668963 => .flat}/OneStepProver0.sol |  553 +--
 .../OneStepProverHostIo.sol                        |  696 +--
 .../OneStepProverMath.sol                          |  152 +-
 .../OneStepProverMemory.sol                        |  472 ++-
 .../{.flat@1787668963 => .flat}/Outbox/Outbox.sol  |  151 +-
 .../RollupEventInbox/RollupEventInbox.sol          |  196 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 4276 +++++++++++--------
 .../RollupProxy/RollupProxy.p.sol                  | 1866 ++++----
 .../RollupProxy/RollupUserLogic.2.sol              | 4450 +++++++++++---------
 .../SequencerInbox/SequencerInbox.sol              | 1227 ++++--
 .../ValidatorUtils.sol => /dev/null                | 1668 --------
 21 files changed, 13026 insertions(+), 11020 deletions(-)
```

Generated with discovered.json: 0x4db2028aeadfaa5a15739528932bedaec9e8b3ee

# Diff at Wed, 23 Sep 2026 05:46:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1787668963
- current timestamp: 1787668963

## Description

Refresh config-derived discovery metadata at the main-branch block.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668963 (main branch discovery), not current.

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xaf030d146d13ea18746e8336614c281d62ab232e

# Diff at Mon, 21 Sep 2026 11:23:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@231e4a5828ee5ff5a863f7b80215466ca39a5b1e block: 1787668963
- current timestamp: 1787668963

## Description

ossification re-review: field severities

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668963 (main branch discovery), not current.

```diff
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) [orbitstack/GatewayRouter] {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      fieldMeta:
+        {"whitelist":{"severity":"HIGH"},"router":{"severity":"HIGH"},"inbox":{"severity":"HIGH"},"counterpartGateway":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      fieldMeta.sequencerInbox:
+        {"severity":"HIGH"}
      fieldMeta.$admin:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      fieldMeta:
+        {"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
    }
```

```diff
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      fieldMeta:
+        {"rollup":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
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
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      fieldMeta:
+        {"paused":{"severity":"MEDIUM"},"allowListEnabled":{"severity":"HIGH"},"sequencerInbox":{"severity":"HIGH"},"bridge":{"severity":"HIGH"},"$admin":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x153deed63f1842a853274b26a0baa8f6a5804a06

# Diff at Fri, 18 Sep 2026 10:24:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2faf827d006bceee5fb0904599ba325066c7674 block: 1787668963
- current timestamp: 1787668963

## Description

critical contracts and severities for the ossification perimeter

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787668963 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      critical:
+        true
    }
```

```diff
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB) [orbitstack/ERC20Gateway] {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      critical:
+        true
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
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
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) [orbitstack/GatewayRouter] {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
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
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      critical:
+        true
    }
```

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      critical:
+        true
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      critical:
+        true
      fieldMeta:
+        {"executors":{"severity":"LOW"}}
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      critical:
+        true
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
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      critical:
+        true
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
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
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
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

Generated with discovered.json: 0xd8fdc4bf9803214cd989765942856cff8a7aa14c

# Diff at Tue, 25 Aug 2026 14:43:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@bba6c9e66ca2dd99590b6f233fe8f6509dc767a0 block: 1781176973
- current timestamp: 1787668963

## Description

Config-related: the shared wasmModuleRoot type map gained the ArbOS v61 label. No onchain changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781176973 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97:
+        "ArbOS v61 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x2eb24f7988d10215973c5d9d7b181d913cebfb4b

# Diff at Thu, 11 Jun 2026 11:24:25 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@91b2eba1ff9c1c8341d0eaf6594dac4179405ef6 block: 1780398259
- current timestamp: 1781176973

## Description

RollupProxy `wasmModuleRoot` updated to ArbOS v51.1.

## Watched changes

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
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

Generated with discovered.json: 0xc20a98d52ec760bca1b9aa10d6b38fe82e79198c

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1780398259
- current timestamp: 1780398259

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780398259 (main branch discovery), not current.

```diff
    EOA  (arb1:0x3f90c4913621e6758eB8767EA934FCa59ae5Dee8) {
    +++ description: None
      receivedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
      receivedPermissions.1.permission:
-        "validate"
+        "interact"
      receivedPermissions.2.permission:
-        "validate"
+        "interact"
      receivedPermissions.3.permission:
-        "validate"
+        "interact"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "fastconfirm"
+        "interact"
      directlyReceivedPermissions.1.permission:
-        "validate"
+        "interact"
    }
```

```diff
    EOA  (arb1:0x9f787F6e07469BBA84f0BE488c42eDC4c766cC83) {
    +++ description: None
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "validate"
+        "interact"
    }
```

Generated with discovered.json: 0x4c9d53d834194bbc9004513c884d4ecb0e052b6b

# Diff at Tue, 02 Jun 2026 11:05:54 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1779198854
- current timestamp: 1780398259

## Description

SequencerInbox DAC keyset grew 3 → 5 members; threshold unchanged at 2, so committee shifted 2-of-3 → 2-of-5.

## Watched changes

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset.membersCount:
-        3
+        5
      values.dacKeyset.blsSignatures.3:
+        "YA8PdhR9G6EFhblLWymAJ931fvjjb4tOk4a377DXogOfYChxbQETJT3GBYtAvIMmlRUujXEY4uCXjmv5toOcVoDkU4w1wYSvoK3r441hwJw7pG+R+aeGUINtROsxI9sqwhiafKADPPdxLy80mUTK5oIaPztF7RG2WhKMFNK7Ebjsrn4si90qAKRIt7sfneEO4wdeuC5erBen3tLJ7lE32uCi13sEJZYU7UKfr2cwoDQSZyvYePb2KX9U3bHhTpXBbwGKg2pIUGZ5g5GiOuV42wdbfqMjrsOZiLuMbgyYfVl3OOUpDUPGZyupZdGvkzk0rhGY/O/dF1Pv+BCcuX9qUCldfrFYiAvWqYcny+5xKXSQLSlU9cBdTePXy/dotyR7vA=="
      values.dacKeyset.blsSignatures.4:
+        "YBP6/hdXzakIwPZ68/ORUMDJcuhMwQr/C9anzOd5pbWBokbORN1nrEGAOJMmRfLLtRdcABs+DNEopeD4JnwdzbB5e3pHjqqhJvFJzPQ+Rvvo3uPhbECR/Ptf0Umd35mD+AQPB0rLQbAngxs8tNUnS6IllQIW/FeEGm3LwjZ32m+D08Vh5rgqMKWOpGk/Op4sIhGP3Ishpq6yC/kd+GVSDj+vc30oOuNzVtsuAGMTTy8SmlNR47eVX9eMW9bEWIk65QCAaO4T5EqH5IWNKmWZI0Q0yGSHgvslmUZHApw2vIXn0rrzc5DwyUcgn3XZz2H5vhUXvV95qFARTQ9V7SDIXr134ixoaAmhEHqeav9vhlVZE13e9ghd5iNr6BZQn7SrpQ=="
      values.keySetUpdates:
-        1
+        2
    }
```

Generated with discovered.json: 0x486adf499f2bef2ac4caadaece48b8cab420a301

# Diff at Fri, 22 May 2026 15:41:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1b7024bc804124af9b25421eca5fac952454cb09 block: 1779198854
- current timestamp: 1779198854

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779198854 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c:
+        "ArbOS v51.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xdebe3f1eeae26f719735b4e402d4eecdca41445e

# Diff at Tue, 19 May 2026 13:55:18 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@307f5c3dfdab6a4f88448861a0bb75f0043b762b block: 1773325467
- current timestamp: 1779198854

## Description

UpgradeExecutor: one of two `EXECUTOR_ROLE` members removed. `arb1:0x871e290d5447b958131F6d44f915F10032436ee6` remains as the sole executor.

## Watched changes

```diff
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
      values.executors.0:
-        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

Generated with discovered.json: 0x44ba260c9085210d27ab4d1157ae9ed9db316391

# Diff at Fri, 15 May 2026 12:35:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1773325467
- current timestamp: 1773325467

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
+        "0x9e22e05e7953684e6f00507684bb902908d6d4383b2e82ecdce789027bebc33a"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.1:
-        "0x689a6510e734cb5e6032f5fca6ce6cb72b6e3af01d74b228d9d2cfd926a25b66"
+        "0x6639f412df425cd0592b0ca4cf5e4ad9d39436f0e7255e83726bb7ac6a9e37b4"
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
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
+        "0x1eba00857f5477dbcd075b48ce8af9c74d5cb4f93a5e714dd27b3df498737e54"
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

Generated with discovered.json: 0x301903fd0790a03feae2108a92a473dac9809118

# Diff at Fri, 08 May 2026 07:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1773325467
- current timestamp: 1773325467

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) [orbitstack/OneStepProverMemory] {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sourceHashes.0:
-        "0x3955092d1dbd80f0910d7782a25da1e3da45533c7890928a1c6c63cbf5def5bf"
+        "0xa163417851e926098130f55736a5b43084164e0070f9647198131e57b45a947d"
    }
```

```diff
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB) [orbitstack/ERC20Gateway] {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sourceHashes.1:
-        "0x12b277cae4866b3d1f1772fcb7f861dc23247452179f0736c9dbe7012f6c14f6"
+        "0xbcc7c87f75509deb2df1f6e2f6388514c4bdb5807f953974c9687b19d36b2475"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) [orbitstack/RollupProxy_fastConfirm] {
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
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) [orbitstack/GatewayRouter] {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sourceHashes.1:
-        "0x61cc407871b0c56af41887c99354633d150e4586f0a6d237c6efd10966b17bd7"
+        "0x4600f997060ae2ef832240d3416d7837131270d347c85a9227f193804349f0d1"
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
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x55f3048e868b865115b52aeb3d84b856d34786d8c32f79ae01314c2d0ea8b6aa"
+        "0x119b09babba836df00fa9ed5177d4471f6c8fe8c09d7d1cdf8a96bce9b5d6533"
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sourceHashes.1:
-        "0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"
+        "0x11607080f3c3b6b77778e75183e140bfe8604333e71de324adebee0f02b9dbcc"
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) [orbitstack/ChallengeManager] {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
+        "0x8a2753d8b3f1ce86250bd4a4e7e502d04dd36a5a670b519b7510af6b33618693"
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
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x6ce471861570d55dc6e9a09337d990c13efb0c7abb47f36a5de48a9a7086f6e8"
+        "0x6aedbb6059216584b86626e8ce4bc3f123bb7cdf3890b83063e1d3ef2b16be19"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"
+        "0xf88f29d444411e68fef376c8e035ef1f39314143a7b6aff952709203095663bd"
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x38fab1c44903c11839e1113e339b7268b07f99808721133182f57fdd891be63a"
    }
```

```diff
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x84cd273689e720a0b7c657b57d9fb127684f3abb87fc4b337a2f0decd9464120"
+        "0x079413b2ba56c63471a9435a6cbf3759e7d14eb942e6ce789b0b893ec3e6f947"
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

Generated with discovered.json: 0xcbd9ba65aea27895ebe384d77e5d81923912a6a7

# Diff at Tue, 05 May 2026 10:22:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1773325467
- current timestamp: 1773325467

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1773325467 (main branch discovery), not current.

```diff
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

```diff
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
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
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005) {
    +++ description: None
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      deployerAddress:
+        "arb1:0xc2507E8d43AE685fd1e98805bc96C6d31bBB5c28"
    }
```

```diff
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      deployerAddress:
+        "arb1:0xa4b1cd457E5635b64eBc8c5be3a1cA7543F7984D"
    }
```

Generated with discovered.json: 0xc9e0f5476cf07c3634e48bdedbe86e65ce495b0e

# Diff at Thu, 12 Mar 2026 14:25:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1773325467

## Description

Initial discovery of Edge Chain, an Arbitrum Orbit L3 (AnyTrust) by EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (arb1:0x107695630130919cb040B095b9b20511D6e211bB)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0x14FdC47483e79d5A76599a74A2D622DA1cf97BBF)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GatewayRouter (arb1:0x3616995dF5D07B28f2B186F1386cace9EB9Bbd20)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0x42124A2E725E6458701b8Ef46B78Db55827fA836)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0x6F4836aFD5e21EDcee9b838C5a4125829EC198d0)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8420251362dA42f5Be2285B2DEa2f20D16332fE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x9f427c80C4DF962726808d4c876fc2c55474a764)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
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
    contract UpgradeExecutor (arb1:0xabf2650D259213d6b3E1bC46Fc1eDb7405d48Fdf)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0xACAec98D879E39d83a30F914A36bf4877424D04f)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xdA3102d2f80CaD9571a9Eb3656e808e973620dBD)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (arb1:0xDbB10Cdb2F0611C311E7D7057794a690E7872005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0xe44B83D8a3A86994043C809E29B723a44FAEE479)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0xeB88b89e085D6B747Dd6b9CEaf2716bdd89F1E7c)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
