Generated with discovered.json: 0xc925cc895047a84bc551f5b30fcf1a66753befcc

# Diff at Mon, 16 Nov 2026 10:54:13 GMT:

- id: 42671e03
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1794568266

## Description

Initial discovery of the governance, staking and token contracts that all Aztec rollup versions share. They moved here from aztecnetwork and aztecnetworkv6.

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
    contract Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e) [aztecnetwork/Governance]
    +++ description: DAO contract used for proposals and token voting. Heavily interdependent with the GSE for voting power snapshots.
```

```diff
+   Status: CREATED
    contract Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298) [aztecnetwork/Registry]
    +++ description: Central directory that tracks the current 'canonical' (active) Rollup contract address and key system contracts like the Reward Distributor.
```

```diff
+   Status: CREATED
    contract RewardDistributor (eth:0x555bAAc4757A89f1CE0c84fA35afE9dD7aa8E1d3) [aztecnetwork/RewardDistributor]
    +++ description: Holds tokens allocated for protocol rewards. The canonical Rollup contract, as defined by the Registry, can draw from the implicit reward pool while any address can claim only funds explicitly earmarked to it.
```

```diff
+   Status: CREATED
    contract ProtocolTreasury (eth:0x662De311f94bdbB571D95B5909e9cC6A25a6802a) [aztecnetwork/ProtocolTreasury]
    +++ description: Holds the protocol's funds controlled by Governance. It acts as a timelocked executor for spending or relaying transactions approved by the DAO.
```

```diff
+   Status: CREATED
    contract BaseStaker (eth:0x79075C8E314Ab4A84d54F90b1c7032Dc5469082d) [aztecnetwork/BaseStaker]
    +++ description: Implementation registered by the ATP Registry for upgradeable staker proxies that manage locked AZTEC positions.
```

```diff
+   Status: CREATED
    contract AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2) [aztecnetwork/Aztec]
    +++ description: AZTEC token contract
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
    contract AztecTokenPositionRegistry_ProtocolTreasury (eth:0xD938bE4A2cB41105Bc2FbE707dca124A2e5d0c80) [aztecnetwork/AztecTokenPositionRegistry]
    +++ description: AZTEC token-position Registry referenced by the ProtocolTreasury for its activation cutoff and by other ecosystem vesting contracts.
```
