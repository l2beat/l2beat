Generated with discovered.json: 0x8d78d8a857ffa3d722259c1c029db1f0aa1eef21

# Diff at Fri, 15 May 2026 12:35:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1778677605
- current timestamp: 1778677605

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778677605 (main branch discovery), not current.

```diff
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6) [aztecnetwork/CoinIssuer] {
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
      sourceHashes.0:
-        "0x1d15ddcef143af4f3d374008011da56260376d0e551fb224430d1fc6cceba8bb"
+        "0x86f1b9c3f3e7c46b2cf8763469012b305eb713ae13dfda1dbafa3bb694a2d415"
    }
```

```diff
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) [aztecnetwork/GovernanceProposer] {
    +++ description: Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal.
      sourceHashes.0:
-        "0x822a0467a3c36f3ad5006f5b0a0921686eff01e6adf5204dcc5f235263dadfc3"
+        "0x71cf96d5e84750d1559a917cdd144ff72a02d1545e89ffffa0e3eaadce53b381"
    }
```

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) [aztecnetwork/Governance] {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      sourceHashes.0:
-        "0x4818e078ed920ba17929b5ff19b2390b5af9aea3bcfd7cc47274d4c7afedc718"
+        "0x0ce6e4dfb9032a183db9db78aed6db53131df8c04b34950cff771cf97ee52e70"
    }
```

```diff
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80) [aztecnetwork/RewardBooster] {
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
      sourceHashes.0:
-        "0xd88e52f8a67390118e6ca6308dcaa66116e76b793e891200be19354d545d0562"
+        "0xa55a151792fd54a06d45a214430777fdcc77649e3e3366b05a30ed49607b1d6e"
    }
```

```diff
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617) [aztecnetwork/FeeJuicePortal] {
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
      sourceHashes.0:
-        "0xefcc58eb6e18ab3015db23e7b5ca1f48f5332955771faa13269730f8f16b5a21"
+        "0xc7593f2bfd237067a4f9c2e0235082023defc4aec53c7f075d4c0e0d30c12557"
    }
```

```diff
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) [aztecnetwork/Registry] {
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
      sourceHashes.0:
-        "0xd4419feb9d3fbefcecfeb3fb93d1f7963d68289fd55800ee46df9ea1cec59a9f"
+        "0x14fcd61358d6410f1ead6e0e5c6d72d0492755aaff76b5460c5886e8a128f3dc"
    }
```

```diff
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0) [aztecnetwork/RewardDistributor] {
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers.
      sourceHashes.0:
-        "0x6070cf13583054dcdcdff5ca9834c0822f5b19bbc4cc3dcbbed27f849c768cff"
+        "0xdc25555be83a4afb19d53051d224785fb0fb7eeab2471ece49c3f4b103239cb9"
    }
```

```diff
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) [aztecnetwork/ProtocolTreasury] {
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
      sourceHashes.0:
-        "0x47a6b396b5e4531818f04a9d4657c9e92c2bc02e75647fe06a0221dd4dc5bfd8"
+        "0xf4048df5d13c662b8981abcf7c9411fc2cbfa6692dab1a7d601f76942cea85d0"
    }
```

```diff
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348) [aztecnetwork/HonkVerifier] {
    +++ description: ZK proof verification contract.
      sourceHashes.0:
-        "0xbb00c1d733934fe4f475e43a86fa9af450fba4c9a5d956e53c2a9540cc0802b5"
+        "0x51de74b0f3bb93a136ac42d9ce84ea1064de040df73d36111378ddc0c1fb9508"
    }
```

```diff
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B) [aztecnetwork/EscapeHatch] {
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
      sourceHashes.0:
-        "0xaf030f696223208ac572e052a593e9c1e8b5c533c49e60529c37b01a1466f564"
+        "0x8be1af559fa2783895bf1e8e6bbd342a1a2647155053612e621b15ddcc65e015"
    }
```

```diff
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578) [aztecnetwork/Inbox] {
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
      sourceHashes.0:
-        "0xbb549e7279a308b9cc7d57b1b4496cd0ee0fffc107deea34dce5514db6b376c9"
+        "0x2d3743808043a53dd1ba2ed90d831a27cf0086c271251cf36846a6584bf91257"
    }
```

```diff
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958) [aztecnetwork/TallySlashingProposer] {
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
      sourceHashes.0:
-        "0x36a4a21da5b9c1b8650619998b8c14d14dd3ae6198357d2c1de03db66141ff39"
+        "0x3400d2f1f605f55a5f01114dcb37590633d756230f7829fa3949433b038befa2"
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) [aztecnetwork/GSE] {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      sourceHashes.0:
-        "0x86c38f8c5576e356aa3f79d2f0e0d9cfd2d02cc4d36583627fea6d16cbc3adb2"
+        "0x25ba11bed3e4573e049efd5cea98a8d47ccd23a404f2777f5cd2c6d101b1eb4f"
    }
```

```diff
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962) [aztecnetwork/Rollup] {
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      sourceHashes.0:
-        "0x2d136d48b42c226a0e64b451623ffc9b66f62ad5f2f628f73ee276005826c283"
+        "0xa60bb5f8f4c3654fa6cc8d33bfde2b72af58a55740d815a0c52832dca5ec3a57"
    }
```

```diff
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0) [aztecnetwork/Outbox] {
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
      sourceHashes.0:
-        "0xd49b9c80dbe4876e76020713ee3920aad9a1b60c16428b900cd104e3190cfac4"
+        "0x5d430a5b1a91a9f29eeed4c85c3345203f05756ebe1a5bcbb57eb0af57924d6f"
    }
```

Generated with discovered.json: 0x1c1a3e2a2ba4409ce855715c755bd366ceb63c35

# Diff at Wed, 13 May 2026 13:08:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@997302eeeb5feeafaefdf45fdcde9800fc0de1ba block: 1776865911
- current timestamp: 1778677605

## Description

AZUP-1: Cut the Leash is queued after a successful sequencer signaling round. The proposal aims to make the escape hatch of the current rollup immutable and get it to Stage 2. Details here: https://aztecgov.nethermind.io/3. The executable payload address is https://etherscan.io/address/0xa156E3a14f45099ecdF9C6A393a118809C5d06e6#code and is simple:
- revoke ownership of the rollup
- gov execution delay 30d -> 2d

## Watched changes

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) [aztecnetwork/Governance] {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      values.proposalCount:
-        3
+        4
    }
```

Generated with discovered.json: 0x037947290dce4fd67d2e27b45452f68da58fc4d7

# Diff at Fri, 08 May 2026 07:51:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1776865911
- current timestamp: 1776865911

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1776865911 (main branch discovery), not current.

```diff
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6) [aztecnetwork/CoinIssuer] {
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
      sourceHashes.0:
-        "0xa4f3bbaa9fb563fd7e37fc9a04d3c9f85603ad6dc3c53ee6e21fc0b91583cf51"
+        "0x1d15ddcef143af4f3d374008011da56260376d0e551fb224430d1fc6cceba8bb"
    }
```

```diff
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) [aztecnetwork/GovernanceProposer] {
    +++ description: Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal.
      sourceHashes.0:
-        "0xf5d24826d1f40e6e4796bdde6cee8f8b3fa9bc6f2a859fdb79c591cd8c6bbfb6"
+        "0x822a0467a3c36f3ad5006f5b0a0921686eff01e6adf5204dcc5f235263dadfc3"
    }
```

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) [aztecnetwork/Governance] {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      sourceHashes.0:
-        "0x108c41fbc4c83c17c0f1cade9547878fd22dbf5b378a3da7815cf2eacf863b0e"
+        "0x4818e078ed920ba17929b5ff19b2390b5af9aea3bcfd7cc47274d4c7afedc718"
    }
```

```diff
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80) [aztecnetwork/RewardBooster] {
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
      sourceHashes.0:
-        "0x7e3d88822760fe6d4eef2faf9c6e14ae481b4ce38a65abe838a87511e128b9f0"
+        "0xd88e52f8a67390118e6ca6308dcaa66116e76b793e891200be19354d545d0562"
    }
```

```diff
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617) [aztecnetwork/FeeJuicePortal] {
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
      sourceHashes.0:
-        "0xffe7fdf0f7de8b1be186c7c37b6553238928c1f70255d06d9c8abf22082ec4b0"
+        "0xefcc58eb6e18ab3015db23e7b5ca1f48f5332955771faa13269730f8f16b5a21"
    }
```

```diff
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) [aztecnetwork/Registry] {
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
      sourceHashes.0:
-        "0x2668189921df08d463ad0d3e7381bb520057ff2a687d45bed1ec160de02a6c87"
+        "0xd4419feb9d3fbefcecfeb3fb93d1f7963d68289fd55800ee46df9ea1cec59a9f"
    }
```

```diff
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0) [aztecnetwork/RewardDistributor] {
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers.
      sourceHashes.0:
-        "0x2f431ac339a6130443de9108067868e7bdd0c6f33644cb46128b9fb1c4c39fcc"
+        "0x6070cf13583054dcdcdff5ca9834c0822f5b19bbc4cc3dcbbed27f849c768cff"
    }
```

```diff
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) [aztecnetwork/ProtocolTreasury] {
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
      sourceHashes.0:
-        "0x7b8550d2aa8397c59330dca1f180e102e8bbbab775c39cbcd9c48d35358530db"
+        "0x47a6b396b5e4531818f04a9d4657c9e92c2bc02e75647fe06a0221dd4dc5bfd8"
    }
```

```diff
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348) [aztecnetwork/HonkVerifier] {
    +++ description: ZK proof verification contract.
      sourceHashes.0:
-        "0x8ccbd9969496e6e190b97c2988df87d248cdf18d3173a7f4bf1184de23202e78"
+        "0xbb00c1d733934fe4f475e43a86fa9af450fba4c9a5d956e53c2a9540cc0802b5"
    }
```

```diff
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B) [aztecnetwork/EscapeHatch] {
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
      sourceHashes.0:
-        "0x075ee4b441a07410b5aa3c5fc868789251bc02707bc5ba28a174648dafad785d"
+        "0xaf030f696223208ac572e052a593e9c1e8b5c533c49e60529c37b01a1466f564"
    }
```

```diff
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578) [aztecnetwork/Inbox] {
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
      sourceHashes.0:
-        "0x77499f55b21f6d83387db70ed134f13e8b7b19d731a747016064f81465e2aac5"
+        "0xbb549e7279a308b9cc7d57b1b4496cd0ee0fffc107deea34dce5514db6b376c9"
    }
```

```diff
    contract AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2) [aztecnetwork/Aztec] {
    +++ description: AZTEC token contract
      sourceHashes.0:
-        "0xd5b487c2f69097daa1e35d596189814c087e6c52d35f2808b8c2f542821105b5"
+        "0x6018c4d73b9151449ab94fa44cb69a1f9d6eaa71dbf36cbf9f262a54b77e20da"
    }
```

```diff
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958) [aztecnetwork/TallySlashingProposer] {
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
      sourceHashes.0:
-        "0x0b4f1c707812b207e031a78710120f6962597aca1d9bfa47b0aa4c940fadbbdb"
+        "0x36a4a21da5b9c1b8650619998b8c14d14dd3ae6198357d2c1de03db66141ff39"
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) [aztecnetwork/GSE] {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      sourceHashes.0:
-        "0x547457f5ff4ac8ea3f42813204d953274a213c147ab1709fdcfd4973a9e98c37"
+        "0x86c38f8c5576e356aa3f79d2f0e0d9cfd2d02cc4d36583627fea6d16cbc3adb2"
    }
```

```diff
    contract SlashPayloadCloneable (eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445) [aztecnetwork/SlashPayloadCloneable] {
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
      sourceHashes.0:
-        "0xfbadea8713d96309e9bd97fddd93c7a26deaa423e3bc6380fea3583b1479c3ef"
+        "0x675553ce11773dc33f90165a629cf5899125e69c4272a3cf7b62b1cdcc0bc67b"
    }
```

```diff
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962) [aztecnetwork/Rollup] {
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      sourceHashes.0:
-        "0x21cee9d37dad194e69c515e0f50b13b0dcc334145b92dc9e962db46eb134cac3"
+        "0x2d136d48b42c226a0e64b451623ffc9b66f62ad5f2f628f73ee276005826c283"
    }
```

```diff
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0) [aztecnetwork/Outbox] {
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
      sourceHashes.0:
-        "0x268c3927e6d7e9e7e84f7cb8d1557c6a593638888c766837b2aac1a0e4c3e64c"
+        "0xd49b9c80dbe4876e76020713ee3920aad9a1b60c16428b900cd104e3190cfac4"
    }
```

```diff
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) [aztecnetwork/AztecTokenPositionRegistry] {
    +++ description: Used to set the time at which AZTEC tokens owned by the ProtocolTreasury are unlocked.
      sourceHashes.0:
-        "0x5bec86caaab8c1c4f3acc5289ed1e63204996e1060b8cc0b3659805297f969f5"
+        "0x6b4881b4d3b0b5aaa49b8a1e3784bd49053169584e8b661678a44b65a5b15db1"
    }
```

Generated with discovered.json: 0x3951fcc1c3887ff312b94eae3ab02b78c3a3816e

# Diff at Tue, 05 May 2026 10:21:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1776865911
- current timestamp: 1776865911

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1776865911 (main branch discovery), not current.

```diff
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6) {
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) {
    +++ description: Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80) {
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617) {
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) {
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0) {
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb) {
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) {
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348) {
    +++ description: ZK proof verification contract.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B) {
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578) {
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2) {
    +++ description: AZTEC token contract
      deployerAddress:
+        "eth:0xCbE23F4EBd9150e3A9d3A80442d145FAD624751d"
    }
```

```diff
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958) {
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      deployerAddress:
+        "eth:0x85e51a78FE8FE21d881894206A9adbf54e3Df8c3"
    }
```

```diff
    contract SlashPayloadCloneable (eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445) {
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962) {
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) {
    +++ description: None
      deployerAddress:
+        "eth:0x7EAbE4F636B937628A7Fe503bD7F06772C047FEe"
    }
```

```diff
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0) {
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
      deployerAddress:
+        "eth:0xA8aA9eb611709454601425CEc7B8C9B142781560"
    }
```

```diff
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) {
    +++ description: Used to set the time at which AZTEC tokens owned by the ProtocolTreasury are unlocked.
      deployerAddress:
+        "eth:0xA8085a1e881c7c0F32ea69cf41A3C21b67ed5f1D"
    }
```

Generated with discovered.json: 0x4f701faaf630d166ba07c681058fb6a8db703e6f

# Diff at Wed, 22 Apr 2026 13:53:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b0c9883f4f9da8504a0490bf6e80c8c08daa0cb0 block: 1776071799
- current timestamp: 1776865911

## Description

slashing is back after a slashveto council pause.

## Watched changes

```diff
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb) {
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
      values.isSlashingEnabled:
-        false
+        true
    }
```

Generated with discovered.json: 0xf1cc5eb6e31d7af45d5272b52e5ca985fcf89551

# Diff at Mon, 13 Apr 2026 09:17:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a2f0d255f241d65a403d105d2fa770f7305170 block: 1775561692
- current timestamp: 1776071799

## Description

the slashVeto council vetoes slashing for 3d because of [this request](https://github.com/aztec-slash-veto/council/issues/7). Affected payloads can be seen on https://slashveto.me. The argument is that v4.1.3 was a bugfix release on a friday and the wave of slashing can be attributed to people not having updated in time.

one slashVeto council member is replaced (https://forum.aztec.network/t/join-the-slashveto-council/8521).

## Watched changes

```diff
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb) {
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
      values.isSlashingEnabled:
-        true
+        false
      values.slashingDisabledUntil:
-        0
+        1776137255
    }
```

```diff
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) {
    +++ description: None
      values.$members.6:
-        "eth:0xb31e6d9661720A93d54AF7D1815d9bb399280629"
+        "eth:0x8138c46A572D989E54837d5e5dEB506889edFb5D"
    }
```

Generated with discovered.json: 0x36253eb4bd41b547d115e00ec21edefefdba852e

# Diff at Tue, 07 Apr 2026 11:42:01 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@6939c1061ac26e2572f4c6c6aafc9329a8ef2113 block: 1774847186
- current timestamp: 1775561692

## Description

Rollup contract has reached enough validators, so isBootstrapped is set to true.
Now the rate of adding new validators is limited by the `getEntryQueueFlushSize` function (max 0.25% of the validator set growth per epoch, at least 1, at most 4).

## Watched changes

```diff
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962) {
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      values.getIsBootstrapped:
-        false
+        true
    }
```

Generated with discovered.json: 0xcc5c74614ececfc88f9b206262b6dc2365290fbf

# Diff at Tue, 31 Mar 2026 10:55:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ce5575dd68185a9de68c046c28335bccb254fcff block: 1771254730
- current timestamp: 1774847186

## Description

config: forcibly register post-alpha contracts. remove from config.jsonc as soon as the payload is executed.

## Watched changes

```diff
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) {
    +++ description: Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal.
      values.getInstance:
-        "eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12"
+        "eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962"
    }
```

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      values.getConfiguration.executionDelay:
-        604800
+        2592000
      values.proposalCount:
-        2
+        3
      receivedPermissions.1.from:
-        "eth:0x91A3745c685c220595B997E53311EbF660144889"
+        "eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb"
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962","description":"change the escape hatch address and disable the escape hatch, change the slasher address which can slash arbitrary sequencers, change the sequencer queue config and disallow new sequencers joining, set the ejection threshold that exits sequencers from the active set, change various critical fee and reward configurations.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract Inbox (eth:0x15c718C05B8c0dbec4D648b6711d6Ce8793969Ee)
    +++ description: Handles L1-to-L2 messaging. Users deposit funds or send messages here, which are organized into a Merkle tree for the sequencer to include in an L2 block.
```

```diff
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) {
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
      values.getCanonicalRollup:
-        "eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12"
+        "eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962"
      values.getVersion.1:
+        2934756905
      values.numberOfVersions:
-        1
+        2
    }
```

```diff
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0) {
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers.
      values.canonicalRollup:
-        "eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12"
+        "eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962"
    }
```

```diff
-   Status: DELETED
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12)
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
```

```diff
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) {
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
      values.getActivationTimestamp:
-        1799366400
+        1795150800
    }
```

```diff
-   Status: DELETED
    contract RewardBooster (eth:0x7101a6703491A4D808aeAbE9F62bC1Dc6a20bdf4)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
-   Status: DELETED
    contract HonkVerifier (eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5)
    +++ description: ZK proof verification contract.
```

```diff
-   Status: DELETED
    contract TallySlashingProposer (eth:0x7a318c3DaA9f21f8fc8238c65755eB0394Fbf189)
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
```

```diff
-   Status: DELETED
    contract SlashPayloadCloneable (eth:0x82c592b4Bb7E1f50f68E75d86743c3330beAaba4)
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
```

```diff
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B) {
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "EscapeHatch"
      template:
+        "aztecnetwork/EscapeHatch"
      sourceHashes:
+        ["0x075ee4b441a07410b5aa3c5fc868789251bc02707bc5ba28a174648dafad785d"]
      description:
+        "Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates."
      sinceTimestamp:
+        1772654171
      sinceBlock:
+        24586323
      values:
+        {"$immutable":true,"getActiveDuration":2,"getBondSize":"332000000000000000000000000","getBondSizeFmt":"332,000,000","getBondToken":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","getCandidateCount":0,"getCurrentHatch":8,"getFailedHatchPunishment":"9600000000000000000000000","getFailedHatchPunishmentFmt":"9,600,000","getFrequency":112,"getLagInHatches":1,"getProposingExitDelay":2592000,"getRollup":"eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962","getWithdrawalTax":"1660000000000000000000000","getWithdrawalTaxFmt":"1,660,000","LAG_IN_EPOCHS_FOR_RANDAO":1,"LAG_IN_EPOCHS_FOR_SET_SIZE":2}
      fieldMeta:
+        {"getBondSizeFmt":{"description":"The amount of tokens required to join the candidate set."},"getWithdrawalTaxFmt":{"description":"The amount deducted from the bond when a candidate exits the candidate set. This is the minimum that a candidate loses of their bond by becoming a candidate and cannot be circumvented."},"getCandidateCount":{"severity":"HIGH","description":"Hatch proposer candidates who posted the bond."},"getBondToken":{"description":"The ERC20 token used for candidate bonds."},"getFailedHatchPunishmentFmt":{"description":"The amount deducted from the bond if the designated proposer fails to fulfill their duties."},"getFrequency":{"description":"The number of epochs between escape hatch windows."},"getActiveDuration":{"description":"The number of epochs an escape hatch remains open."},"getLagInHatches":{"description":"The number of hatches ahead for which candidates are deterministically selected."},"getProposingExitDelay":{"description":"The additional time (in seconds) a proposer must wait after their hatch ends before they can exit."},"LAG_IN_EPOCHS_FOR_RANDAO":{"description":"The number of epochs to look back from the start of the hatch for a stable RANDAO seed."},"LAG_IN_EPOCHS_FOR_SET_SIZE":{"description":"The number of epochs to look back from the start of the hatch to snapshot the stable candidate set."},"getRollup":{"description":"The address of the core Rollup contract."}}
      implementationNames:
+        {"eth:0x8c189ead28D5987A48e522162f9225124D50AD1B":"EscapeHatch"}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
-   Status: DELETED
    contract Slasher (eth:0x91A3745c685c220595B997E53311EbF660144889)
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
```

```diff
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958) {
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "TallySlashingProposer"
      template:
+        "aztecnetwork/TallySlashingProposer"
      sourceHashes:
+        ["0x0b4f1c707812b207e031a78710120f6962597aca1d9bfa47b0aa4c940fadbbdb"]
      description:
+        "Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher."
      sinceTimestamp:
+        1772654159
      sinceBlock:
+        24586322
      values:
+        {"$immutable":true,"COMMITTEE_SIZE":48,"eip712Domain":{"fields":"0x0f","name":"TallySlashingProposer","version":"1","chainId":1,"verifyingContract":"eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"EXECUTION_DELAY_IN_ROUNDS":28,"getCurrentRound":237,"INSTANCE":"eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962","LIFETIME_IN_ROUNDS":34,"MAX_ROUND_SIZE":1024,"QUORUM":65,"ROUND_SIZE":128,"ROUND_SIZE_IN_EPOCHS":4,"ROUNDABOUT_SIZE":128,"SLASH_AMOUNT_LARGE":"2000000000000000000000","SLASH_AMOUNT_MEDIUM":"2000000000000000000000","SLASH_AMOUNT_SMALL":"2000000000000000000000","SLASH_OFFSET_IN_ROUNDS":2,"SLASH_PAYLOAD_IMPLEMENTATION":"eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445","SLASHER":"eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb","SLASHING_PROPOSER_TYPE":1,"VOTE_TYPEHASH":"0x18b6b90f234e6d028d4c9800043cedef34624eedddd14e60eba01934728014fe"}
      implementationNames:
+        {"eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958":"TallySlashingProposer"}
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      values.getLatestRollup:
-        "eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12"
+        "eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962"
    }
```

```diff
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) {
    +++ description: None
      receivedPermissions.0.from:
-        "eth:0x91A3745c685c220595B997E53311EbF660144889"
+        "eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb"
    }
```

```diff
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) {
    +++ description: Used to set the time at which AZTEC tokens owned by the ProtocolTreasury are unlocked.
      values.getExecuteAllowedAt:
-        1798761600
+        1794546000
      values.getGlobalLockParams.startTime:
-        1798761600
+        1794546000
      values.getRevoker:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0x92Ba0FD39658105FaC4dF2B9BADE998B5816b350"
+++ severity: HIGH
      values.getUnlockStartTime:
-        1798761600
+        1794546000
    }
```

```diff
-   Status: DELETED
    contract FeeJuicePortal (eth:0xe05dc9D5969272831757181fFf1532B066254bf1)
    +++ description: A one-way public bridge to deposit AZTEC tokens to the Rollup.
```

```diff
-   Status: DELETED
    contract Outbox (eth:0xf006c41097861AFeb18b05e586B921c081411Ee9)
    +++ description: Handles L2-to-L1 messaging. It stores Merkle roots of messages exiting the rollup, allowing users to prove inclusion and finalize withdrawals or actions on L1.
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
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578)
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
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
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0)
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
```

## Source code changes

```diff
.../projects/aztecnetwork/.flat/EscapeHatch.sol    | 3918 +++++++++
 .../{.flat@1771254730 => .flat}/FeeJuicePortal.sol |   91 +-
 .../{.flat@1771254730 => .flat}/HonkVerifier.sol   | 3866 ++++-----
 .../{.flat@1771254730 => .flat}/Inbox.sol          |  605 +-
 .../{.flat@1771254730 => .flat}/Outbox.sol         |  173 +-
 .../{.flat@1771254730 => .flat}/RewardBooster.sol  |  242 +-
 .../{.flat@1771254730 => .flat}/Rollup.sol         | 9087 ++++++++++----------
 .../SlashPayloadCloneable.sol                      |   23 +-
 .../TallySlashingProposer.sol                      |  515 +-
 9 files changed, 11157 insertions(+), 7363 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771254730 (main branch discovery), not current.

```diff
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6) {
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","description":"mint unlimited amounts of the AZTEC token and transfer the ownership of the contract.","role":".owner"}]
    }
```

```diff
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) {
    +++ description: Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal.
      description:
-        "Intermediary contract that allows the L2 system (or specific L2 signals) to submit formal proposals to the L1 Governance contract."
+        "Intermediary contract that allows the L2 Sequencers operating the canonical rollup (as defined by the Registry) to submit formal proposals to the L1 Governance contract by signalling their support of any smart contract payload on L1 with each checkpoint proposal. A signalling round comprises 1000 checkpoints. 600 signals or more during one round allow submitting the payload as a governance proposal."
      category:
+        {"name":"Governance","priority":3}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e","description":"create proposals.","role":".governanceProposer","condition":"the proposal payload passed the sequencer signalling round."}]
    }
```

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      category:
+        {"name":"Governance","priority":3}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6","description":"mint new AZTEC in the bounds of the minting caps and forward the acceptOwnership() call to the eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","role":".owner","via":[{"address":"eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a","condition":"the GATED_UNTIL timestamp has passed."}]},{"permission":"interact","from":"eth:0x91A3745c685c220595B997E53311EbF660144889","description":"slash sequencers from the active set.","role":".GOVERNANCE"},{"permission":"interact","from":"eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f","description":"add a new rollup address, which automatically triggers all sequencers staked in the bonus address to be migrated to the new rollup.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a","role":".GOVERNANCE","condition":"the GATED_UNTIL timestamp has passed."}]
    }
```

```diff
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) {
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
      values.getRollup:
-        ["eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12"]
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0) {
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers.
      description:
-        "Holds tokens allocated for protocol rewards. The canonical Rollup contract calls this to distribute payments to sequencers and provers."
+        "Holds tokens allocated for protocol rewards. The canonical Rollup contract (as defined by the Registry) calls this to distribute payments to sequencers and provers."
    }
```

```diff
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) {
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6","description":"mint new AZTEC in the bounds of the minting caps and forward the acceptOwnership() call to the eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","role":".owner"}]
    }
```

```diff
    contract HonkVerifier (eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5) {
    +++ description: ZK proof verification contract.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Slasher (eth:0x91A3745c685c220595B997E53311EbF660144889) {
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
      values.SLASHING_DISABLE_DURATION_fmt:
+        "3d"
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) {
    +++ description: None
      name:
-        "Safe"
+        "SlashVeto Council"
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x91A3745c685c220595B997E53311EbF660144889","description":"veto specific slashing payloads and/or disable all slashing for 3d at a time.","role":".VETOER"}]
    }
```

Generated with discovered.json: 0xf9e8d293d9a2d9527f9fdfb1e50708d8f0ebadd8

# Diff at Thu, 05 Mar 2026 10:33:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4100d91208092499341e9181894e315cc8ef1f26 block: 1771254730
- current timestamp: 1771254730

## Description

config: move old ignition templates to make space for alpha.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771254730 (main branch discovery), not current.

```diff
    contract Inbox (eth:0x15c718C05B8c0dbec4D648b6711d6Ce8793969Ee) {
    +++ description: Handles L1-to-L2 messaging. Users deposit funds or send messages here, which are organized into a Merkle tree for the sequencer to include in an L2 block.
      template:
-        "aztecnetwork/Inbox"
+        "aztecnetwork/ignition/Inbox"
    }
```

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      template:
-        "aztecnetwork/Rollup"
+        "aztecnetwork/ignition/Rollup"
    }
```

```diff
    contract FeeJuicePortal (eth:0xe05dc9D5969272831757181fFf1532B066254bf1) {
    +++ description: A one-way public bridge to deposit AZTEC tokens to the Rollup.
      template:
-        "aztecnetwork/FeeJuicePortal"
+        "aztecnetwork/ignition/FeeJuicePortal"
    }
```

```diff
    contract Outbox (eth:0xf006c41097861AFeb18b05e586B921c081411Ee9) {
    +++ description: Handles L2-to-L1 messaging. It stores Merkle roots of messages exiting the rollup, allowing users to prove inclusion and finalize withdrawals or actions on L1.
      template:
-        "aztecnetwork/Outbox"
+        "aztecnetwork/ignition/Outbox"
    }
```

Generated with discovered.json: 0x66b1aa14ba13d1e6d8f56a79f297a6bf0dc329cf

# Diff at Fri, 20 Feb 2026 20:44:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3edf2b3bacf84cf46a7d5d7c744851af89730742 block: 1771254730
- current timestamp: 1771254730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1771254730 (main branch discovery), not current.

```diff
    contract AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2) {
    +++ description: AZTEC token contract
      name:
-        "Aztec"
+        "AZTEC Token"
    }
```

Generated with discovered.json: 0xd11bc141182aa6d49b30900edad6f62b44bda83c

# Diff at Mon, 16 Feb 2026 15:13:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bb0201789c97cc74af8432f172609bc8ef3357f0 block: 1769432788
- current timestamp: 1771254730

## Description

TGE happened. Sequencers can claim block production rewards, AZTEC is transferable and tradable on uniswap. Token governance is launched.

## Watched changes

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      values.isRewardsClaimable:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769432788 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract StakingRegistry (eth:0x042dF8f42790d6943F41C25C2132400fd727f452)
    +++ description: Manages staking providers for delegation.
```

```diff
-   Status: DELETED
    contract BaseStaker (eth:0x0Cb8fe28D35fD4763C4f3E3761904bAcF829BbF8)
    +++ description: A template contract used for staker proxies within the StakingRegistry.
```

```diff
-   Status: DELETED
    contract ATPWithdrawableAndClaimableStakerV2 (eth:0x11ED6b4a9D44cf8bC4e1763D08304eF20c998c95)
    +++ description: Standard escrow implementation used to simplify and manage staking with locked AZTEC tokens.
```

```diff
-   Status: DELETED
    contract BaseStaker (eth:0x6131D4900CD8dC328FB3CF6DFFEfbC628F02e7d9)
    +++ description: A template contract used for staker proxies within the StakingRegistry.
```

```diff
-   Status: DELETED
    contract AztecTokenPositionRegistry_Sequencers (eth:0x63841bAD6B35b6419e15cA9bBBbDf446D4dC3dde)
    +++ description: A registry for contracts related to Sequencer staking and token unlock parameters.
```

```diff
-   Status: DELETED
    contract TGEPayload (eth:0x77A5EEF319E23615B848a09Ebd151744547b959C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ATPWithdrawableAndClaimableStaker (eth:0x7C009AE557234d094D798A03D21E3c1C1CAD3b42)
    +++ description: Standard escrow implementation used to simplify and manage staking with locked AZTEC tokens.
```

```diff
-   Status: DELETED
    contract GovernanceAcceleratedLock (eth:0x7d6DECF157E1329A20c4596eAf78D387E896aa4e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AztecTokenPositionRegistry_Sequencers (eth:0x8F778768aDed86AB778a47cd81b3b42B4b3F655B)
    +++ description: A registry for contracts related to Sequencer staking and token unlock parameters.
```

Generated with discovered.json: 0x23e18f2b5d441f0d11e389024ea3e9e2f7bc0e9b

# Diff at Mon, 26 Jan 2026 13:07:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daff52088f9d57f8a71e0b6d63dada6f9cf51d36 block: 1769000209
- current timestamp: 1769432788

## Description

TGE proposal active after passing signaling by sequencers. voting will start soon, proposal will become executable on 9.2 and cause TGE on 11.2. as [explained here](https://forum.aztec.network/t/reference-for-triggering-the-aztec-token-generation-event-tge/8366).

## Watched changes

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      values.proposalCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x07fa245479aa701d832a287655c12852208bc187

# Diff at Wed, 21 Jan 2026 12:58:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@244fb212545a72797e49afed711b24371c1ca962 block: 1767796183
- current timestamp: 1769000209

## Description

add TGEPayload for verification by governance.

entry queue flush increase payload was executed.

## Watched changes

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
+++ description: number of sequencers flushable per epoch: will move from the entry queue to the active validator set if flushed
      values.getEntryQueueFlushSize:
-        1
+        4
    }
```

```diff
    contract TGEPayload (eth:0x77A5EEF319E23615B848a09Ebd151744547b959C) {
    +++ description: None
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      name:
+        "TGEPayload"
      template:
+        "aztecnetwork/TGEPayload"
      sourceHashes:
+        ["0xc2410dd48add80f68a5d7e354ca701a42d52f1a651c686a180e524179a08ed12"]
      sinceTimestamp:
+        1768592243
      sinceBlock:
+        24249428
      values:
+        {"$immutable":true,"ATP_REGISTRY":"eth:0x63841bAD6B35b6419e15cA9bBBbDf446D4dC3dde","AZTEC_TOKEN":"eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2","DATE_GATED_RELAYER_SHORT":"eth:0x7d6DECF157E1329A20c4596eAf78D387E896aa4e","END_DAY":3,"END_OF_WORKDAY":54000,"getURI":"https://github.com/AztecProtocol/ignition-contracts/","JAN_1_2026_CET":1767222000,"ROLLUP":"eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12","ROLLUP_REGISTRY":"eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298","STAKER":"eth:0x11ED6b4a9D44cf8bC4e1763D08304eF20c998c95","STAKING_REGISTRY":"eth:0x042dF8f42790d6943F41C25C2132400fd727f452","START_DAY":1,"START_OF_WORKDAY":28800,"VIRTUAL_LBP_STRATEGY":"eth:0xd53006d1e3110fD319a79AEEc4c527a0d265E080"}
      implementationNames:
+        {"eth:0x77A5EEF319E23615B848a09Ebd151744547b959C":"TGEPayload"}
    }
```

```diff
+   Status: CREATED
    contract ATPWithdrawableAndClaimableStakerV2 (eth:0x11ED6b4a9D44cf8bC4e1763D08304eF20c998c95)
    +++ description: Standard escrow implementation used to simplify and manage staking with locked AZTEC tokens.
```

```diff
+   Status: CREATED
    contract BaseStaker (eth:0x6131D4900CD8dC328FB3CF6DFFEfbC628F02e7d9)
    +++ description: A template contract used for staker proxies within the StakingRegistry.
```

```diff
+   Status: CREATED
    contract AztecTokenPositionRegistry_Sequencers (eth:0x63841bAD6B35b6419e15cA9bBBbDf446D4dC3dde)
    +++ description: A registry for contracts related to Sequencer staking and token unlock parameters.
```

```diff
+   Status: CREATED
    contract GovernanceAcceleratedLock (eth:0x7d6DECF157E1329A20c4596eAf78D387E896aa4e)
    +++ description: None
```

## Source code changes

```diff
.../.flat/ATPWithdrawableAndClaimableStakerV2.sol  | 1630 ++++++++++++++++++++
 ...0x63841bAD6B35b6419e15cA9bBBbDf446D4dC3dde.sol} |    0
 ...:0x8F778768aDed86AB778a47cd81b3b42B4b3F655B.sol |  830 ++++++++++
 ...0x0Cb8fe28D35fD4763C4f3E3761904bAcF829BbF8.sol} |    0
 ...:0x6131D4900CD8dC328FB3CF6DFFEfbC628F02e7d9.sol |  635 ++++++++
 .../.flat/GovernanceAcceleratedLock.sol            |  340 ++++
 .../src/projects/aztecnetwork/.flat/TGEPayload.sol |  142 ++
 7 files changed, 3577 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1767796183 (main branch discovery), not current.

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      fieldMeta.getEntryQueueFlushSize:
+        {"description":"number of sequencers flushable per epoch: will move from the entry queue to the active validator set if flushed"}
    }
```

Generated with discovered.json: 0x81ec4de1642da7c445f9d9fe819d793bdb31b9a7

# Diff at Wed, 07 Jan 2026 14:30:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e74ab9b13ecd61cbe4ef6104ebbb10b35ae037e block: 1764601178
- current timestamp: 1767796183

## Description

First gov proposal passed signalling phase:

[Increase Ignition Queue Throughput](https://forum.aztec.network/t/increase-ignition-queue-throughput/8211)
- does what it says, goal is to flush the entire queue until TGE and especially before the first upgrade of the rollup contract.

## Watched changes

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      values.proposalCount:
-        0
+        1
    }
```

Generated with discovered.json: 0x59001b0afa38a0be7888f1b42054d97af51a5a39

# Diff at Mon, 01 Dec 2025 15:07:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9d76c328276d849f78accd8054caeafb4f665931 block: 1764164738
- current timestamp: 1764601178

## Description

config: add zk verifier from constructor vars.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764164738 (main branch discovery), not current.

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
+++ description: immutable, defined in constructor
      values._epochProofVerifier:
+        "eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5"
      fieldMeta._epochProofVerifier:
+        {"description":"immutable, defined in constructor"}
    }
```

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x77e3bA096355510e0E9f60D292010B42d662d2B5)
    +++ description: ZK proof verification contract.
```

Generated with discovered.json: 0xdcaace9732e56a9363f04491fed545ae18b6dffe

# Diff at Wed, 26 Nov 2025 13:46:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd7c1c00cfe8eb7b4034082d8812fb8962098918 block: 1763978160
- current timestamp: 1764164738

## Description

Config: description finesse.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1763978160 (main branch discovery), not current.

```diff
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) {
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
      description:
-        "DAO contract used for proposals and token voting"
+        "DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots."
    }
```

```diff
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) {
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
      description:
-        "Central staking hub. Validators (attesters) deposit stake here to register. It manages delegation of voting power and tracks which rollup instance validators are securing."
+        "Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transfered to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version."
    }
```

```diff
    contract FeeJuicePortal (eth:0xe05dc9D5969272831757181fFf1532B066254bf1) {
    +++ description: A one-way public bridge to deposit AZTEC tokens to the Rollup.
      description:
-        "A specific bridge allowing the Aztec token ('Fee Juice') to be deposited into L2 specifically for paying gas fees. AZTEC tokens accruing in this escrow can only be used as fees for sequencers."
+        "A one-way public bridge to deposit AZTEC tokens to the Rollup."
    }
```

Generated with discovered.json: 0xab43bd863efb9401422ee555d861ee7c61a846ae

# Diff at Mon, 24 Nov 2025 14:16:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a7f22580fca8d48e9cc5f7f28da38d6b8725e891 block: 1763649088
- current timestamp: 1763978160

## Description

config: yeeted flushrewarder (not core contract), ignored more noisy vars, cleaned up the disco

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1763649088 (main branch discovery), not current.

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      fieldMeta:
+        {"getManaLimit":{"severity":"HIGH","description":"gas limit, currently 0 to prevent transactions"}}
    }
```

```diff
-   Status: DELETED
    contract BaseStaker (eth:0x79075C8E314Ab4A84d54F90b1c7032Dc5469082d)
    +++ description: An template contract used for staker proxies within the StakingRegistry.
```

```diff
-   Status: DELETED
    contract FlushRewarder (eth:0x7C9a7130379F1B5dd6e7A53AF84fC0fE32267B65)
    +++ description: None
```

```diff
    EOA  (eth:0x92Ba0FD39658105FaC4dF2B9BADE998B5816b350) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80","description":"set the time at which the ProtocolTreasury funds can be transfered and manage staker implementations referenced by this contract.","role":".owner"}]
    }
```

```diff
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) {
    +++ description: Used to set the time at which AZTEC tokens owned by the ProtocolTreasury are unlocked.
      name:
-        "StakingRegistry"
+        "AztecTokenPositionRegistry_ProtocolTreasury"
      template:
-        "aztecnetwork/StakingRegistry"
+        "aztecnetwork/AztecTokenPositionRegistry"
      description:
+        "Used to set the time at which AZTEC tokens owned by the ProtocolTreasury are unlocked."
      fieldMeta:
+        {"getUnlockStartTime":{"severity":"HIGH"}}
    }
```

```diff
+   Status: CREATED
    contract StakingRegistry (eth:0x042dF8f42790d6943F41C25C2132400fd727f452)
    +++ description: Manages staking providers for delegation.
```

```diff
+   Status: CREATED
    contract BaseStaker (eth:0x0Cb8fe28D35fD4763C4f3E3761904bAcF829BbF8)
    +++ description: A template contract used for staker proxies within the StakingRegistry.
```

```diff
+   Status: CREATED
    contract ATPWithdrawableAndClaimableStaker (eth:0x7C009AE557234d094D798A03D21E3c1C1CAD3b42)
    +++ description: Standard escrow implementation used to simplify and manage staking with locked AZTEC tokens.
```

```diff
+   Status: CREATED
    contract AztecTokenPositionRegistry_Sequencers (eth:0x8F778768aDed86AB778a47cd81b3b42B4b3F655B)
    +++ description: A registry for contracts related to Sequencer staking and token unlock parameters.
```

Generated with discovered.json: 0x33d374ce8a5ffbbbbf65e438918bff1c8cd9b50b

# Diff at Thu, 20 Nov 2025 14:51:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b9fb6935244c163272f55e2acbd987c21dfd4d2 block: 1763566766
- current timestamp: 1763649088

## Description

config: silence disco.

## Watched changes

```diff
    contract FlushRewarder (eth:0x7C9a7130379F1B5dd6e7A53AF84fC0fE32267B65) {
    +++ description: None
      values.rewardsAvailable:
-        "1000000000000000000000000"
+        "998300000000000000000000"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1763566766 (main branch discovery), not current.

```diff
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12) {
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
      values.getBlobCommitmentsHash:
-        []
      values.getBlock:
-        []
    }
```

```diff
+   Status: CREATED
    contract FlushRewarder (eth:0x7C9a7130379F1B5dd6e7A53AF84fC0fE32267B65)
    +++ description: None
```

Generated with discovered.json: 0x7b64fdfa08d102a097f08c9ad6cf17b47f08a101

# Diff at Wed, 19 Nov 2025 16:23:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1763566766

## Description

initial disco: aztec is in 'ignition' phase, network will launch with empty blocks for 3 months: https://aztec.network/aztec-roadmap.

## Initial discovery

```diff
+   Status: CREATED
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6)
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
```

```diff
+   Status: CREATED
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef)
    +++ description: Intermediary contract that allows the L2 system (or specific L2 signals) to submit formal proposals to the L1 Governance contract.
```

```diff
+   Status: CREATED
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e)
    +++ description: DAO contract used for proposals and token voting
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x15c718C05B8c0dbec4D648b6711d6Ce8793969Ee)
    +++ description: Handles L1-to-L2 messaging. Users deposit funds or send messages here, which are organized into a Merkle tree for the sequencer to include in an L2 block.
```

```diff
+   Status: CREATED
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298)
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
```

```diff
+   Status: CREATED
    contract RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0)
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract calls this to distribute payments to sequencers and provers.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12)
    +++ description: Core rollup logic contract. It processes block proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
```

```diff
+   Status: CREATED
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a)
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
```

```diff
+   Status: CREATED
    contract RewardBooster (eth:0x7101a6703491A4D808aeAbE9F62bC1Dc6a20bdf4)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
+   Status: CREATED
    contract BaseStaker (eth:0x79075C8E314Ab4A84d54F90b1c7032Dc5469082d)
    +++ description: An template contract used for staker proxies within the StakingRegistry.
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
    contract Aztec (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2)
    +++ description: AZTEC token contract
```

```diff
+   Status: CREATED
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f)
    +++ description: Central staking hub. Validators (attesters) deposit stake here to register. It manages delegation of voting power and tracks which rollup instance validators are securing.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRegistry (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeJuicePortal (eth:0xe05dc9D5969272831757181fFf1532B066254bf1)
    +++ description: A specific bridge allowing the Aztec token ('Fee Juice') to be deposited into L2 specifically for paying gas fees. AZTEC tokens accruing in this escrow can only be used as fees for sequencers.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf006c41097861AFeb18b05e586B921c081411Ee9)
    +++ description: Handles L2-to-L1 messaging. It stores Merkle roots of messages exiting the rollup, allowing users to prove inclusion and finalize withdrawals or actions on L1.
```
