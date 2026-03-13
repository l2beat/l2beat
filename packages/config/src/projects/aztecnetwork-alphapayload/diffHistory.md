Generated with discovered.json: 0xa40757fdb9f1b28556a74c8c8a11f40b01b1fe54

# Diff at Fri, 13 Mar 2026 12:07:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@701a1d1ad3b6c6bb36a1a5ed8937206d44c94fb9 block: 1772790297
- current timestamp: 1773403587

## Description

config: remove canonical rollup from aztecnetwork disco (adding it here automatically).

## Watched changes

```diff
    contract AlphaPayload (eth:0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e) {
    +++ description: The Alpha Upgrade Governance Payload encoding the recipe for bringing execution to the next Aztec rollup smart contract system.
      values.getActions.4.data:
-        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f3400000000000000000000000000000000000000000000659f6e5e74d408f00000"
+        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f34000000000000000000000000000000000000000000006490616e0ff6afd00000"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772790297 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
-   Status: DELETED
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617)
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
```

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      type:
-        "Reference"
+        "Contract"
      targetType:
-        "Contract"
      targetProject:
-        "aztecnetwork"
      template:
+        "aztecnetwork/ignition/Rollup"
      sourceHashes:
+        ["0x31e588d1304692f4bded80c6a0ee63f0cc4371047cb2679da34efa68ee1aa410"]
      proxyType:
+        "immutable"
      description:
+        "Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates."
      sinceTimestamp:
+        1762995155
      sinceBlock:
+        23786836
      values:
+        {"_epochProofVerifier":"eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5","$immutable":true,"archive":"0x059cbff7a7ea04acb4458ec3eba7355c72f0c530314f16647e3dc10f24dd46b8","checkBlob":true,"eip712Domain":{"fields":"0x0f","name":"Aztec Rollup","version":"1","chainId":1,"verifyingContract":"eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"getActivationThreshold":"200000000000000000000000","getActiveAttesterCount":3990,"getAvailableValidatorFlushes":4,"getBlockReward":"400000000000000000000","getBurnAddress":"eth:0x4355415548584943414c4c490000000000000000","getCurrentBlobCommitmentsHash":"0x002f7e8faddfdae7aa71285faa00abdd4750c713522e44e4c23b3e16a8e5402c","getCurrentEpoch":4251,"getCurrentSampleSeed":"54421933149097480834637893723321535214044702915517443517126633778596618525489","getCurrentSlot":136043,"getEarliestRewardsClaimableTimestamp":1770818400,"getEjectionThreshold":"100000000000000000000000","getEntryQueueFlushSize":4,"getEntryQueueLength":0,"getEpochDuration":32,"getEpochForBlock":[],"getExitDelay":345600,"getFeeAsset":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getFeeAssetPerEth":10000000000,"getFeeAssetPortal":"eth:0xe05dc9D5969272831757181fFf1532B066254bf1","getGenesisTime":1762995155,"getGSE":"eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f","getInbox":"eth:0x15c718C05B8c0dbec4D648b6711d6Ce8793969Ee","getIsBootstrapped":true,"getL1FeesAt":[],"getLagInEpochs":2,"getLocalEjectionThreshold":"196000000000000000000000","getManaLimit":0,"getManaTarget":0,"getNextFlushableEpoch":4248,"getOutbox":"eth:0xf006c41097861AFeb18b05e586B921c081411Ee9","getPendingBlockNumber":114055,"getProofSubmissionEpochs":1,"getProvenBlockNumber":114047,"getProvingCostPerManaInEth":0,"getProvingCostPerManaInFeeAsset":0,"getRewardConfig":{"rewardDistributor":"eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0","sequencerBps":7000,"booster":"eth:0x7101a6703491A4D808aeAbE9F62bC1Dc6a20bdf4","blockReward":"400000000000000000000"},"getRewardDistributor":"eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0","getSampleSeedAt":[],"getSamplingSizeAt":[],"getSlasher":"eth:0x91A3745c685c220595B997E53311EbF660144889","getSlotAt":[],"getSlotDuration":72,"getStakingAsset":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getTargetCommitteeSize":24,"getTips":{"pendingBlockNumber":114055,"provenBlockNumber":114047},"getVersion":0,"isRewardsClaimable":true,"L1_BLOCK_AT_GENESIS":23786836,"owner":"eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e"}
      fieldMeta:
+        {"_epochProofVerifier":{"description":"immutable, defined in constructor"},"getManaLimit":{"severity":"HIGH","description":"gas limit, currently 0 to prevent transactions"},"getEntryQueueFlushSize":{"description":"number of sequencers flushable per epoch: will move from the entry queue to the active validator set if flushed"}}
    }
```

```diff
-   Status: DELETED
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb)
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
```

```diff
-   Status: DELETED
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348)
    +++ description: ZK proof verification contract.
```

```diff
    reference EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B) {
    +++ description: None
      type:
-        "Contract"
+        "Reference"
      template:
-        "aztecnetwork/EscapeHatch"
      sourceHashes:
-        ["0x075ee4b441a07410b5aa3c5fc868789251bc02707bc5ba28a174648dafad785d"]
      proxyType:
-        "immutable"
      description:
-        "Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates."
      sinceTimestamp:
-        1772654171
      sinceBlock:
-        24586323
      values:
-        {"$immutable":true,"getActiveDuration":2,"getBondSize":"332000000000000000000000000","getBondSizeFmt":"332,000,000","getBondToken":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getCandidateCount":0,"getCurrentHatch":0,"getFailedHatchPunishment":"9600000000000000000000000","getFailedHatchPunishmentFmt":"9,600,000","getFrequency":112,"getLagInHatches":1,"getProposingExitDelay":2592000,"getRollup":"eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962","getWithdrawalTax":"1660000000000000000000000","LAG_IN_EPOCHS_FOR_RANDAO":1,"LAG_IN_EPOCHS_FOR_SET_SIZE":2}
      fieldMeta:
-        {"getBondSizeFmt":{"description":"The amount of tokens required to join the candidate set."},"getCandidateCount":{"severity":"HIGH","description":"Hatch proposer candidates who posted the bond."},"getBondToken":{"description":"The ERC20 token used for candidate bonds."},"getFailedHatchPunishmentFmt":{"description":"The amount deducted from the bond if the designated proposer fails to fulfill their duties."},"getWithdrawalTax":{"description":"The amount deducted from the bond when a candidate voluntarily exits the active set."},"getFrequency":{"description":"The number of epochs between escape hatch windows."},"getActiveDuration":{"description":"The number of epochs an escape hatch remains open."},"getLagInHatches":{"description":"The number of hatches ahead for which candidates are deterministically selected."},"getProposingExitDelay":{"description":"The additional time (in seconds) a proposer must wait after their hatch ends before they can exit."},"LAG_IN_EPOCHS_FOR_RANDAO":{"description":"The number of epochs to look back from the start of the hatch for a stable RANDAO seed."},"LAG_IN_EPOCHS_FOR_SET_SIZE":{"description":"The number of epochs to look back from the start of the hatch to snapshot the stable candidate set."},"getRollup":{"description":"The address of the core Rollup contract."}}
      usedTypes:
-        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      targetType:
+        "Contract"
      targetProject:
+        "aztecnetwork"
    }
```

```diff
-   Status: DELETED
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578)
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
```

```diff
-   Status: DELETED
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958)
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
```

```diff
-   Status: DELETED
    contract SlashPayloadCloneable (eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445)
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
```

```diff
    reference Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962) {
    +++ description: None
      type:
-        "Contract"
+        "Reference"
      template:
-        "aztecnetwork/Rollup"
      sourceHashes:
-        ["0x21cee9d37dad194e69c515e0f50b13b0dcc334145b92dc9e962db46eb134cac3"]
      proxyType:
-        "immutable"
      description:
-        "Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates."
      sinceTimestamp:
-        1772654159
      sinceBlock:
-        24586322
      values:
-        {"_epochProofVerifier":"eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348","$immutable":true,"archive":"0x15684c8c3d2106918d3860f777e50555b7166adff47df13cc652e2e5a50bf5c7","checkBlob":true,"eip712Domain":{"fields":"0x0f","name":"Aztec Rollup","version":"1","chainId":1,"verifyingContract":"eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"getActivationThreshold":"200000000000000000000000","getActiveAttesterCount":0,"getAvailableValidatorFlushes":0,"getBurnAddress":"eth:0x4355415548584943414c4c490000000000000000","getCheckpointReward":"500000000000000000000","getCurrentBlobCommitmentsHash":"0x0000000000000000000000000000000000000000000000000000000000000000","getCurrentEpoch":59,"getCurrentSampleSeed":"1908693173873725939445094070174056598148160322491928596367728137445313221342","getCurrentSlot":1890,"getEarliestRewardsClaimableTimestamp":0,"getEjectionThreshold":"100000000000000000000000","getEntryQueueFlushSize":0,"getEntryQueueLength":0,"getEpochDuration":32,"getEscapeHatch":"eth:0x0000000000000000000000000000000000000000","getEthPerFeeAsset":11729988,"getExitDelay":345600,"getFeeAsset":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getFeeAssetPortal":"eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617","getGenesisTime":1772654159,"getGSE":"eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f","getInbox":"eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578","getIsBootstrapped":false,"getLagInEpochsForRandao":1,"getLagInEpochsForValidatorSet":2,"getLocalEjectionThreshold":"190000000000000000000000","getManaLimit":150000000,"getManaTarget":75000000,"getNextFlushableEpoch":0,"getOutbox":"eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0","getPendingCheckpointNumber":0,"getProofSubmissionEpochs":1,"getProvenCheckpointNumber":0,"getProvingCostPerManaInEth":25000000,"getProvingCostPerManaInFeeAsset":2131289477875,"getRewardConfig":{"rewardDistributor":"eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0","sequencerBps":7000,"booster":"eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80","checkpointReward":"500000000000000000000"},"getRewardDistributor":"eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0","getSlasher":"eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb","getSlotDuration":72,"getStakingAsset":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getTargetCommitteeSize":48,"getTips":{"pending":0,"proven":0},"getVersion":2934756905,"isRewardsClaimable":false,"L1_BLOCK_AT_GENESIS":24586322,"owner":"eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e"}
      fieldMeta:
-        {"_epochProofVerifier":{"description":"immutable, defined in constructor"},"getManaLimit":{"description":"gas limit"},"getEntryQueueFlushSize":{"description":"number of sequencers flushable per epoch: will move from the entry queue to the active validator set if flushed"},"getEscapeHatch":{"description":"Address of the EscapeHatch contract used as a fallback for trustless proposal generation if the committee stalls."},"getCheckpointReward":{"description":"The amount of reward tokens distributed per proven checkpoint."},"getLagInEpochsForValidatorSet":{"description":"The delay in epochs for the validator set selection to become active, preventing rapid targeted restructuring."},"getLagInEpochsForRandao":{"description":"The delay in epochs for the RANDAO seed to be applied to validator selection to prevent manipulation."}}
      targetType:
+        "Contract"
      targetProject:
+        "aztecnetwork"
    }
```

```diff
-   Status: DELETED
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0)
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x15c718C05B8c0dbec4D648b6711d6Ce8793969Ee)
    +++ description: Handles L1-to-L2 messaging. Users deposit funds or send messages here, which are organized into a Merkle tree for the sequencer to include in an L2 block.
```

```diff
+   Status: CREATED
    contract RewardBooster (eth:0x7101a6703491A4D808aeAbE9F62bC1Dc6a20bdf4)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5)
    +++ description: ZK proof verification contract.
```

```diff
+   Status: CREATED
    contract TallySlashingProposer (eth:0x7a318c3DaA9f21f8fc8238c65755eB0394Fbf189)
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
```

```diff
+   Status: CREATED
    contract SlashPayloadCloneable (eth:0x82c592b4Bb7E1f50f68E75d86743c3330beAaba4)
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
```

```diff
+   Status: CREATED
    contract Slasher (eth:0x91A3745c685c220595B997E53311EbF660144889)
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
```

```diff
+   Status: CREATED
    contract FeeJuicePortal (eth:0xe05dc9D5969272831757181fFf1532B066254bf1)
    +++ description: A one-way public bridge to deposit AZTEC tokens to the Rollup.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf006c41097861AFeb18b05e586B921c081411Ee9)
    +++ description: Handles L2-to-L1 messaging. It stores Merkle roots of messages exiting the rollup, allowing users to prove inclusion and finalize withdrawals or actions on L1.
```

Generated with discovered.json: 0xd2884699d4bd950fe84a8f8d3868ffca40856f38

# Diff at Fri, 06 Mar 2026 09:47:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@464f5fa94dac665b855f973e6cbee143f2fbb4bd block: 1772702345
- current timestamp: 1772790297

## Description

config related.

## Watched changes

```diff
    contract AlphaPayload (eth:0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e) {
    +++ description: The Alpha Upgrade Governance Payload encoding the recipe for bringing execution to the next Aztec rollup smart contract system.
      values.getActions.4.data:
-        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f340000000000000000000000000000000000000000000066831d13e84649900000"
+        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f3400000000000000000000000000000000000000000000659f6e5e74d408f00000"
    }
```

Generated with discovered.json: 0x1baddc5bf75259746f29033b2f69a97111e89f86

# Diff at Thu, 05 Mar 2026 11:17:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772702345

## Description

Initial disco for the alpha upgrade including the upgrade payload.

## Initial discovery

```diff
+   Status: CREATED
    reference Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
+   Status: CREATED
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617)
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
```

```diff
+   Status: CREATED
    reference Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298)
    +++ description: None
```

```diff
+   Status: CREATED
    reference RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x4355415548584943414c4c490000000000000000)
    +++ description: None
```

```diff
+   Status: CREATED
    reference Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb)
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
```

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348)
    +++ description: ZK proof verification contract.
```

```diff
+   Status: CREATED
    contract AlphaPayload (eth:0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e)
    +++ description: The Alpha Upgrade Governance Payload encoding the recipe for bringing execution to the next Aztec rollup smart contract system.
```

```diff
+   Status: CREATED
    contract FlushRewarder (eth:0x7C9a7130379F1B5dd6e7A53AF84fC0fE32267B65)
    +++ description: Incentivizes 'flushing' of the sequencer join queue. Flushing is needed to add sequencers to the active set at a preset rate limit and incurs gas costs. Adding one sequencer is rewarded by 100 AZTEC as long as supply lasts.
```

```diff
+   Status: CREATED
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B)
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578)
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
```

```diff
+   Status: CREATED
    reference AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958)
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
```

```diff
+   Status: CREATED
    reference GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SlashPayloadCloneable (eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445)
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962)
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
```

```diff
+   Status: CREATED
    reference Safe (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0)
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
```

```diff
+   Status: CREATED
    contract FlushRewarder (eth:0xf1AcfB0C6ADd7104e700b8FAd3Ea025dbB041F34)
    +++ description: Incentivizes 'flushing' of the sequencer join queue. Flushing is needed to add sequencers to the active set at a preset rate limit and incurs gas costs. Adding one sequencer is rewarded by 100 AZTEC as long as supply lasts.
```
