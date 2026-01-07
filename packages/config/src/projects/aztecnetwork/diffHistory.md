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
