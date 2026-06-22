# Standard Path (Signaling)
Because sequencers stake AZTEC tokens to secure the L2 network, they are also the primary governors of the system. Any governance proposal must be encoded and deployed as a smart contract payload on Ethereum. While core contracts are immutable, the onchain Governance system can designate a new 'canonical' rollup with a {{governanceExecutionDelayString}} delay and has access to critical configuration permissions that can freeze or compromise the Rollup system. These permissions can only be accessed through the process described below.

## 1. The Signaling Phase (`GovernanceProposer`)
Aztec uses an onchain "Empire" signaling system. Active sequencers operating on the 'canonical rollup' (as defined by the Registry) call `signal(payloadAddress)` on the L1 `GovernanceProposer` contract during their designated L2 slots to support a specific upgrade payload. A voting round consists of {{governanceSignalRoundSizeString}} slots. To win a round and become a formal proposal, a payload must receive signals from at least {{governanceSignalQuorumSizeString}} slots. Once quorum is reached, the payload is submitted to the L1 `Governance` contract.

## 2. The Voting Phase (`Governance`)
Once submitted, the proposal enters a delay and voting flow:
*   **Pending ({{governanceVotingDelayString}}):** At the end of this delay, voting power is snapshotted.
*   **Active ({{governanceVotingDurationString}}):** AZTEC token holders can vote. To pass, a proposal must reach a {{governanceQuorumString}} Quorum of all staked power, and the `yea` votes must exceed a required margin of {{governanceRequiredYeaMarginString}}.
*   **Queued ({{governanceExecutionDelayString}}):** If successful, the proposal enters an execution delay. This acts as an exit window, allowing dissenting sequencers to initiate a withdrawal of their staked tokens before the malicious/disagreed-upon code is executed.
*   Executable ({{governanceGracePeriodString}}): The proposal enters a grace period where anyone can call `execute()`. If not executed, it expires.

Total standard delay from proposal to execution: **{{governanceTotalDelayString}}**.

### Emergency Path (Circumvent Signaling)
If the L2 sequencer set is offline, censoring, or acting maliciously, the `GovernanceProposer` cannot be used. To ensure liveness, anyone can bypass the Sequencer signaling phase using the `proposeWithLock()` function directly on the `Governance` contract.
*   An actor must lock **{{governanceLockString}}**, roughly {{governanceLockShareOfSupplyString}} of total supply
*   These funds are locked for an extended {{governanceLockDelayString}}.
*   Once proposed, the payload enters the exact same {{governanceTotalDelayString}} Voting Phase (Pending -> Active -> Queued -> Executable) as the standard path.

### Rollup Immutability
The smart contract code of `Rollup`, its verifier and its canonical messaging contracts cannot be changed. For feature upgrades, users need to migrate to a new Rollup. Migrating Rollups involves a `Governance` action that designates a new `Rollup` contract address as canonical. The `GSE` (Governance Staking Escrow) automatically migrates the voting power and stake of all active sequencers to the new rollup version if they staked to the default magic address `{{bonusInstanceAddress}}` instead of a specific immutable rollup. Importantly, `Governance` has revoked ownership and access to all critical config options of the current core Rollup contract, which makes it fully autonomous in that Governance can only remove staking incentives by creating a new 'canonical' Rollup. They can also brick the sequencer queue via `GSE.setProofOfPossessionGasLimit(0)`, leaving the Escape Hatch as the only fully immutable option to progress the L2 in the worst case.

### Slashing and the SlashVeto Council
Aztec features onchain slashing for equivocation or missing attestations, managed by `Slasher` and `TallySlashingProposer`. 

There is a protective **Vetoer** role held by the SlashVeto Council. The Council cannot upgrade the protocol, alter governance, or steal funds. Instead it is limited to two permissions:
*   call `vetoPayload()` to stop a specific slashing event.
*   call `setSlashingEnabled(false)`, which pauses all slashing in the protocol for a period of {{slashingDisableDurationString}}.

### Economics & Treasury
*   **Coin Issuer:** The `CoinIssuer` contract is owned by Governance and is authorized to mint new AZTEC tokens up to a cap of {{coinIssuerNominalAnnualPercentageCapString}} of the current total supply per year.
*   **Protocol Treasury:** Funds owned by the DAO sit in the `ProtocolTreasury`. The Treasury has a hardcoded timestamp (approx. {{protocolTreasuryGatedUntilString}}). Before this date, the DAO cannot spend Treasury funds. After this date, Treasury funds and token ownership can be moved with a Governance Proposal.
