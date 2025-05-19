Generated with discovered.json: 0xce736a957f962cb3138b1a5b5ffcab6d53781286

# Diff at Mon, 19 May 2025 15:23:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ba4be7822b161a6616bac837b3f7f03225f5cb9 block: 29878278
- current block number: 30439434

## Description

upgrade to unverified bridge contract.

## Watched changes

```diff
    EOA  (0x01F010a5e001fe9d6940758EA5e8c777885E351e) {
    +++ description: None
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3","via":[{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"},{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]}
      receivedPermissions.7.from:
-        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
+        "0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3"
      receivedPermissions.6.from:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
      receivedPermissions.5.from:
-        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      receivedPermissions.4.from:
-        "0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"
+        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
    }
```

```diff
-   Status: DELETED
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3","via":[{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"},{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]}
      receivedPermissions.7.from:
-        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
+        "0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3"
      receivedPermissions.6.from:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
      receivedPermissions.5.from:
-        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      receivedPermissions.4.from:
-        "0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"
+        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: None
      template:
-        "orbitstack/Bridge"
      sourceHashes:
-        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"]
      description:
-        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
      values.$implementation:
-        "0x8F0169dcF705E3c500a5f44C8966a18F7E3bdF7A"
+        "0x56C2e7691441fDcDfA15BcCfe5a1Aec9d031e656"
      values.$pastUpgrades.1:
+        ["2024-10-23T21:19:03.000Z","0x43cadcfbccd1c9d31753b79afeee54298787a85289a611d531abf2bd1467ee52",["0x8F0169dcF705E3c500a5f44C8966a18F7E3bdF7A"]]
      values.$pastUpgrades.0.2:
-        ["0x8F0169dcF705E3c500a5f44C8966a18F7E3bdF7A"]
+        "2025-05-17T04:53:55.000Z"
      values.$pastUpgrades.0.1:
-        "2024-10-23T21:19:03.000Z"
+        "0x26d71626c5c2f49878d6ee14ba27d028a0ddc3ce91279e4abf1c2940767f3ef4"
      values.$pastUpgrades.0.0:
-        "0x43cadcfbccd1c9d31753b79afeee54298787a85289a611d531abf2bd1467ee52"
+        ["0x56C2e7691441fDcDfA15BcCfe5a1Aec9d031e656"]
      values.$upgradeCount:
-        1
+        2
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
      values.allowedDelayedInboxList:
-        ["0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f","0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"]
      values.allowedOutboxList:
-        ["0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"]
      values.delayedMessageCount:
-        5380
      values.inboxHistory:
-        ["0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f","0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"]
      values.nativeToken:
-        "0xcD2F22236DD9Dfe2356D7C543161D4d260FD9BcB"
      values.nativeTokenDecimals:
-        18
      values.outboxHistory:
-        ["0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"]
      values.rollup:
-        "0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09"
      values.sequencerInbox:
-        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
      values.sequencerMessageCount:
-        14758
      values.sequencerReportedSubMessageCount:
-        2589814
      fieldMeta:
-        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
      implementationNames.0x8F0169dcF705E3c500a5f44C8966a18F7E3bdF7A:
-        "ERC20Bridge"
      implementationNames.0x56C2e7691441fDcDfA15BcCfe5a1Aec9d031e656:
+        ""
      category:
-        {"name":"Local Infrastructure","priority":5}
      unverified:
+        true
    }
```

```diff
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD) {
    +++ description: None
      directlyReceivedPermissions.6:
-        {"permission":"upgrade","from":"0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3"}
      directlyReceivedPermissions.5.from:
-        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
+        "0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3"
      directlyReceivedPermissions.4.from:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
      directlyReceivedPermissions.3.from:
-        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      directlyReceivedPermissions.2.from:
-        "0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"
+        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
    }
```

```diff
    EOA  (0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7) {
    +++ description: None
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3","via":[{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"},{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]}
      receivedPermissions.7.from:
-        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
+        "0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3"
      receivedPermissions.6.from:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x400f7c5DaC37aAEe3cE007e43Db54424414743f5"
      receivedPermissions.5.from:
-        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      receivedPermissions.4.from:
-        "0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"
+        "0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"
    }
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol => /dev/null            | 1120 --------------------
 .../ERC20RollupEventInbox.sol => /dev/null         |  130 ---
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  629 -----------
 3 files changed, 1879 deletions(-)
```

Generated with discovered.json: 0x03768a1f8a0634a16002192ad2f4c7dcd9fa36d2

# Diff at Wed, 07 May 2025 07:56:57 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0ad97a28a4acd494070977b13284d597fbcc6048 block: 29878278
- current block number: 29878278

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29878278 (main branch discovery), not current.

```diff
    EOA  (0x01F010a5e001fe9d6940758EA5e8c777885E351e) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x67226c2e16f551ef5427ca9e7233b94024862358

# Diff at Tue, 06 May 2025 15:38:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f365211458ce8b1ced035f6b5e4a56c9f10d2546 block: 28317508
- current block number: 29878278

## Description

Added a new UpgradeExecutor EOA.

Config:
Marking EOAs if they control the highest number of upgrade permissions in the project.

## Watched changes

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      values.accessControl.EXECUTOR_ROLE.members.2:
+        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x01F010a5e001fe9d6940758EA5e8c777885E351e"
      values.executors.2:
+        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
      values.executors.1:
-        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      values.executors.0:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x01F010a5e001fe9d6940758EA5e8c777885E351e"
    }
```

Generated with discovered.json: 0x553105daf483a5d92c42d46ab1eb0a9aa80f4b26

# Diff at Fri, 02 May 2025 17:25:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 28317508
- current block number: 28317508

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28317508 (main branch discovery), not current.

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x720d01684dd2361f9acb1ee989152e4434b48790

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 28317508
- current block number: 28317508

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28317508 (main branch discovery), not current.

```diff
    contract Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"sequence","to":"0xDbc9207a27aD463f0C383c05fC03AeDf1b3D90b1","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"fastconfirm","to":"0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","via":[{"address":"0x327b96a94763c50D5EC56D79a0324f5eb9527306"}]},{"permission":"interact","to":"0x871e290d5447b958131F6d44f915F10032436ee6","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]},{"permission":"interact","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]},{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"}]},{"permission":"validate","to":"0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]},{"permission":"validate","to":"0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[{"address":"0x327b96a94763c50D5EC56D79a0324f5eb9527306"}]}]
    }
```

```diff
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x871e290d5447b958131F6d44f915F10032436ee6","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]},{"permission":"upgrade","to":"0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7","via":[{"address":"0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"},{"address":"0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD"}]}]
    }
```

Generated with discovered.json: 0x7fb4ffa70c742524c3f53372b332ca6e18c8884c

# Diff at Mon, 31 Mar 2025 12:32:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 25463362
- current block number: 28317508

## Description

Alchemy MS signer change.

## Watched changes

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      values.$members.7:
+        "0x001271c57AeC639952B5201D052767c316755512"
      values.$members.6:
+        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.5:
+        "0xFB00073F931A817b244bF211aA2E5DCBfff8B1ca"
      values.$members.4:
-        "0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01"
+        "0x0a214444613E3970049BD74a8d72d5bF9EF0094c"
      values.$members.3:
-        "0x39CF304731099e756204219BF0a8cCc4738dE9dD"
+        "0xA351A874b48dCEdf1883dD4F4049bE3d9923700a"
      values.$members.2:
-        "0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"
+        "0xeD9919D57162D518014C391a687AA8fb9DB55654"
      values.$members.1:
-        "0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6"
+        "0x35A2079110aa30d1De381cf75aCd1836b6dEE1d7"
      values.$members.0:
-        "0x2e42cEfC761e64Bf4442694220d31C2464a6EE21"
+        "0xd1447Dd15D9e24ddFF99f0fE3C88Bf64d23D1670"
      values.$threshold:
-        3
+        5
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x3f0fcdce564dcff2358190f8a0aa4e401b02e3d5

# Diff at Thu, 06 Mar 2025 14:26:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x37f94d354ded45f5d4d32e073183f67ad34e944b

# Diff at Thu, 06 Mar 2025 09:39:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 25463362
- current block number: 25463362

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f","0x6D67FD4af128eAb051EE8976e6aa65664A4806EE"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xbdcf85c8c0718c16e0f03db8ccaa3bde3ab05d9a

# Diff at Tue, 04 Mar 2025 10:40:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract OneStepProver0 (0x109b5d31a5D431B856Ae30E121A1e04302bA9872) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118849
    }
```

```diff
    contract GnosisSafeL2 (0x327b96a94763c50D5EC56D79a0324f5eb9527306) {
    +++ description: None
      sinceBlock:
+        22453856
    }
```

```diff
    contract Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        21464498
    }
```

```diff
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverHostIo (0x55c6253DB419EDaE4A3d86e44064a4A5f1422751) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118909
    }
```

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverMemory (0x696FC111c7a3E31951426660a0B1da9396056a29) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118869
    }
```

```diff
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        21464498
    }
```

```diff
    contract Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        21464498
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      sinceBlock:
+        21811174
    }
```

```diff
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProofEntry (0x9464dC1403b83432e573f4ff20ba4aF58De59226) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118929
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        21464498
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        21464498
    }
```

```diff
    contract ValidatorUtils (0xa51F58cdE1955754329E071626C7e74d860C0406) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18119011
    }
```

```diff
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD) {
    +++ description: None
      sinceBlock:
+        21464498
    }
```

```diff
    contract OneStepProverMath (0xbB13eB1C56cf1408f657c6f3d56eFf188665B896) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        18118889
    }
```

Generated with discovered.json: 0x5a79f6f561d2c480ce439f4967ff9be0107770f5

# Diff at Thu, 27 Feb 2025 11:47:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 25463362
- current block number: 25463362

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

Generated with discovered.json: 0xd8e055291d07bab82ff8d8e5a788063e607f28c7

# Diff at Fri, 21 Feb 2025 14:13:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 25463362
- current block number: 25463362

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x6631c3812f7b0813ade0b17f84eb1674a66b2b6f

# Diff at Tue, 04 Feb 2025 12:34:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25463362
- current block number: 25463362

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25463362 (main branch discovery), not current.

```diff
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.permission:
-        "fastconfirm"
+        "interact"
      issuedPermissions.2.to:
-        "0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f"
+        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
      issuedPermissions.2.description:
-        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.2.via.0.address:
-        "0x327b96a94763c50D5EC56D79a0324f5eb9527306"
+        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.to:
-        "0xfb6A52Ac0fe3d60895518e393243e5d1F2f43cB7"
+        "0x871e290d5447b958131F6d44f915F10032436ee6"
      issuedPermissions.0.permission:
-        "configure"
+        "fastconfirm"
      issuedPermissions.0.to:
-        "0x871e290d5447b958131F6d44f915F10032436ee6"
+        "0x97B942C591C484bBdDBb1cd04560924cf8a8fe3f"
      issuedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root."
      issuedPermissions.0.via.0.address:
-        "0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B"
+        "0x327b96a94763c50D5EC56D79a0324f5eb9527306"
    }
```

```diff
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x553b6c797cdaa6d3e4461b0047c0d0e9f3c03bb5

# Diff at Fri, 24 Jan 2025 10:54:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 25463362

## Description

Initial discovery: standard v32 AnyTrust (with fastconfirmer) orbit stack with custom gasToken GHST.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProver0 (0x109b5d31a5D431B856Ae30E121A1e04302bA9872)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x327b96a94763c50D5EC56D79a0324f5eb9527306)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x32AB85A3F0C702EbE74f73C5934b7Fb8452B492f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x400f7c5DaC37aAEe3cE007e43Db54424414743f5)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x55c6253DB419EDaE4A3d86e44064a4A5f1422751)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x58E3fe88b1E8a7e2D578000aCD9C6d5989FE9e09)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x696FC111c7a3E31951426660a0B1da9396056a29)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x6D67FD4af128eAb051EE8976e6aa65664A4806EE)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x7cF0a5D0211AC30365bA8C1cB8CFD4caF64b2D60)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract AlchemyMultisig2 (0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x92BD2232110BEd46f1d65f1FA0916f52443DFCa3)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9464dC1403b83432e573f4ff20ba4aF58De59226)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x95E613a501a0AaB5a1C5Cbe682B29d4d300EAc3B)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x9F904Fea0efF79708B37B99960e05900fE310A8E)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xa51F58cdE1955754329E071626C7e74d860C0406)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xaDD83738fd8a1cdCccab49e761F36ED1C93805FD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xbB13eB1C56cf1408f657c6f3d56eFf188665B896)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
