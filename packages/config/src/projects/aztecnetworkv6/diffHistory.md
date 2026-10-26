Generated with discovered.json: 0x3c703edbf968646995139fb461b7f622f75fa96b

# Diff at Mon, 26 Oct 2026 10:28:32 GMT:

- id: 6f5088c9
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1793010433

## Description

Aztec v6, canonical since governance proposal 5. New genesis, no state migration from v5. All contracts are immutable.
- Rollup: new governance setters for a sequencer reward calculator (cannot block proofs), a rate-limited protocol fee margin and the fee recipient. Attester keys can start rate-limited exits. Sequencer share 70% -> 90%. https://disco.l2beat.com/diff/eth:0x91fF8bbD8Ebb07893010D50A48A1609e5EBd8E34/eth:0xE37A2663Cc9c119BA41572C40fAb0bbb23a5402f
- Linked libraries 3 -> 5. https://disco.l2beat.com/diff/eth:0x516f010C9AB452d70E0c6f78b9E698249a66d2AC/eth:0x33AF347ef0C7C94Fe013514b2b6D976Ce11Beb7e https://disco.l2beat.com/diff/eth:0xD6E890c615d6f99681a00771C20ed04516288898/eth:0x6A76197044f6FFcA086523b1A89654E626778bf1 https://disco.l2beat.com/diff/eth:0xe4F0b9769Ca04a6E3d93b5BA732b5aD80797D411/eth:0x89ed816dfa4125Efd40AB978AC986446a4Cd8c69
- Inbox: rolling-hash buckets per L1 block replace per-checkpoint trees, and consumption stays forced. New messages revert once 4096 buckets wait for proving. https://disco.l2beat.com/diff/eth:0x7d4Ef0676c2032bbCC09227501D34d86641ab8cA/eth:0x603B06cEcC1d537Aad83f1d46651e32014c5B6aD
- HonkVerifier: new verification key for the v6 circuits, not reproduced yet. https://disco.l2beat.com/diff/eth:0x098f47c00F4df22a8030746Eb11378236C24b4bC/eth:0x09ae3B0362bCce6E447ce4130c4963630b5a67db
- EscapeHatch: seed timing fix, same parameters. https://disco.l2beat.com/diff/eth:0xF459348962F5eA3A9A101826B03A2CE1F459E51A/eth:0x613fF7D166C834816384FeaeA2B48568363A4D57
- SlashingProposer, SlashPayloadCloneable: interface changes only. https://disco.l2beat.com/diff/eth:0x8A36b8F2Ca71D8d8Bd98e03Ebf8B4D0939Daf0bA/eth:0xa2Ff1BF784D6B1D7Ba1BfD67c3538B85F9f85295 https://disco.l2beat.com/diff/eth:0x57576AbA1932df7Cc30F971ACC9d4Fc6E86B6e87/eth:0xe27d563BCeEa9b11d759609Cf40E2b4D8001117B
- Outbox, FeeJuicePortal, Slasher, RewardBooster: unchanged code.

## Initial discovery

```diff
+   Status: CREATED
    contract CoinIssuer (eth:0x02FAdF157d551aa6d761b2A2237D03Af68E41CA6) [aztecnetwork/CoinIssuer]
    +++ description: Manages the inflation and minting schedule of the Aztec token. It enforces an annual percentage cap and mints new tokens for the budget.
```

```diff
+   Status: CREATED
    contract GovernanceProposer (eth:0x06Ef1DcF87E419C48B94a331B252819FADbD63ef) [aztecnetwork/GovernanceProposer]
    +++ description: Intermediary contract through which the designated proposer for each L2 slot can signal support for an L1 payload. A signalling round comprises 1000 slots. A payload that receives at least 600 signals can be submitted to the L1 Governance contract within the configured lifetime.
```

```diff
+   Status: CREATED
    contract Slasher (eth:0x08B364720b6E4C2089FBdD8A6A722F474013a2B7) [aztecnetwork/Slasher]
    +++ description: Executes payload actions submitted by the authorized slashing proposer or Governance. Execution is blocked while slashing is disabled or when the vetoer has vetoed the payload; voting and execution-delay rules are enforced by the proposer, while Governance can bypass the proposer.
```

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x09ae3B0362bCce6E447ce4130c4963630b5a67db) [aztecnetwork/HonkVerifier_v6]
    +++ description: UltraHonk verifier for Aztec v6 epoch proofs with an immutable verification key.
```

```diff
+   Status: CREATED
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) [aztecnetwork/Governance]
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
```

```diff
+   Status: CREATED
    contract RewardBooster (eth:0x1b0bDD2Da1bD5Ea8541631A3F8647d8C178e4BCe) [aztecnetwork/RewardBooster]
    +++ description: Calculates boosted reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
+   Status: CREATED
    contract AttesterExitExtLib (eth:0x234D45DcA7b39EA927C581B9e7E32c1Ed05B773E) [aztecnetwork/AttesterExitExtLib]
    +++ description: Library immutably linked into the Rollup for validator exits started by the attester key instead of the withdrawer. The stake still goes to the withdrawer. Such exits are limited to about 5% of the validator set per Governance withdrawal delay, and only the canonical Rollup accepts them. Its functions operate on the calling Rollup's storage through DELEGATECALL, so direct getter calls on the library are ignored.
```

```diff
+   Status: CREATED
    contract RollupOperationsExtLib (eth:0x33AF347ef0C7C94Fe013514b2b6D976Ce11Beb7e) [aztecnetwork/RollupOperationsExtLib_v6]
    +++ description: Library immutably linked into the Rollup for checkpoint proposal, header, Inbox and blob validation, and pruning. Its functions operate on the calling Rollup's storage through DELEGATECALL, so direct getter calls on the library are ignored.
```

```diff
+   Status: CREATED
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) [aztecnetwork/Registry]
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
```

```diff
+   Status: CREATED
    contract FeeJuicePortal (eth:0x534361be805CA30Bdb6404eC5E6cDAFFB3E9f3b3) [aztecnetwork/FeeJuicePortal]
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
```

```diff
+   Status: CREATED
    contract RewardDistributor (eth:0x555bAAc4757A89f1CE0c84fA35afE9dD7aa8E1d3) [aztecnetwork/RewardDistributor]
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract, as defined by the Registry, can draw from the implicit reward pool while any address can claim only funds explicitly earmarked to it.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x603B06cEcC1d537Aad83f1d46651e32014c5B6aD) [aztecnetwork/Inbox_v6]
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1 and appends them to a rolling hash, snapshotted per L1 block in a fixed ring of buckets. Each checkpoint must consume every message that reached L1 at least one L1 slot before the previous L2 slot started, up to a per-checkpoint cap. This forces message inclusion. New messages revert while every ring bucket holds messages that the proven chain has not consumed.
```

```diff
+   Status: CREATED
    contract EscapeHatch (eth:0x613fF7D166C834816384FeaeA2B48568363A4D57) [aztecnetwork/EscapeHatch]
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. Candidates post a bond of 332,000,000 AZTEC and enter the candidate set. For each hatch, the contract snapshots the eligible set and uses RANDAO to select one designated proposer; posting a bond does not grant immediate proposal rights. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The minimum tax deducted from their bond is 1,660,000 AZTEC, even if the proposal is successful. The escape hatch regularly opens every 112 epochs, given there are any eligible bonded candidates.
```

```diff
+   Status: CREATED
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) [aztecnetwork/ProtocolTreasury]
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
```

```diff
+   Status: CREATED
    contract RewardExtLib (eth:0x6A76197044f6FFcA086523b1A89654E626778bf1) [aztecnetwork/RewardExtLib]
    +++ description: Library immutably linked into the Rollup for sequencer and prover reward accounting. Its functions operate on the calling Rollup's storage through DELEGATECALL, so direct getter calls on the library are ignored.
```

```diff
+   Status: CREATED
    contract BaseStaker (eth:0x79075C8E314Ab4A84d54F90b1c7032Dc5469082d) [aztecnetwork/BaseStaker]
    +++ description: Implementation registered by the ATP Registry for upgradeable staker proxies that manage locked AZTEC positions.
```

```diff
+   Status: CREATED
    contract ValidatorOperationsExtLib (eth:0x89ed816dfa4125Efd40AB978AC986446a4Cd8c69) [aztecnetwork/ValidatorOperationsExtLib]
    +++ description: Library immutably linked into the Rollup for validator entry, exits, slashing, and Slasher rotation. Its functions operate on the calling Rollup's storage through DELEGATECALL, so direct getter calls on the library are ignored.
```

```diff
+   Status: CREATED
    contract AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2) [aztecnetwork/Aztec]
    +++ description: AZTEC token contract
```

```diff
+   Status: CREATED
    contract SlashingProposer (eth:0xa2Ff1BF784D6B1D7Ba1BfD67c3538B85F9f85295) [aztecnetwork/SlashingProposer]
    +++ description: Collects one signed slashing ballot from the designated proposer in each slot. After the execution delay, anyone can tally the ballots per validator and penalty level, deploy the resulting payload, and ask the Slasher to execute it before the round expires.
```

```diff
+   Status: CREATED
    contract GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f) [aztecnetwork/GSE]
    +++ description: Central staking manager independent of Rollup implementations. Sequencers deposit stake here through their chosen Rollup contract. Their stake is then transferred to the Governance contract and activated for voting. The GSE tracks which rollup instance validators are securing, and gives them an option to automatically move to the latest Rollup version.
```

```diff
+   Status: CREATED
    contract SlashVeto Council (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EpochProofExtLib (eth:0xc9D215533Ab9397950a775f037F70CF56d646c5d) [aztecnetwork/EpochProofExtLib]
    +++ description: Library immutably linked into the Rollup for epoch proof verification, proven chain-tip advancement and Outbox root insertion. Its functions operate on the calling Rollup's storage through DELEGATECALL, so direct getter calls on the library are ignored.
```

```diff
+   Status: CREATED
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) [aztecnetwork/AztecTokenPositionRegistry]
    +++ description: AZTEC token-position Registry referenced by the ProtocolTreasury for its activation cutoff and by other ecosystem vesting contracts.
```

```diff
+   Status: CREATED
    contract SlashPayloadCloneable (eth:0xe27d563BCeEa9b11d759609Cf40E2b4D8001117B) [aztecnetwork/SlashPayloadCloneable]
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode one or more slashing actions (validators and amounts) that the Slasher executes.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xE37A2663Cc9c119BA41572C40fAb0bbb23a5402f) [aztecnetwork/Rollup_v6]
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xFD2a12658A82d7156DA56c7A8d49A69fC966c8D1) [aztecnetwork/Outbox]
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
```
