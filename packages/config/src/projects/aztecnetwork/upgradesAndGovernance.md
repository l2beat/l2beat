# Standard path (sequencer signaling)

Sequencers stake AZTEC to secure the L2 and also participate in protocol governance. Every proposal is a smart contract payload on Ethereum. The public proposal flow takes at least {{governanceTotalDelayString}} before execution, after which Governance can change the bounded parameters described below or deploy and register a new canonical rollup version.

## 1. Signaling (`GovernanceProposer`)

Aztec uses an onchain "Empire" signaling system. The designated proposer for each slot on the canonical rollup can separately signal support for one payload on L1. A round consists of {{governanceSignalRoundSizeString}} slots. A payload that receives at least {{governanceSignalQuorumSizeString}} signals wins the round and can be submitted to `Governance`.

## 2. Token voting (`Governance`)

Once submitted, a proposal passes through these states:

* **Pending ({{governanceVotingDelayString}}):** voting power is snapshotted at the end of this delay.
* **Active ({{governanceVotingDurationString}}):** AZTEC holders vote. The snapshot must contain at least {{governanceMinimumTotalPowerString}} of total voting power, at least {{governanceQuorumString}} of that power must vote, and `yea` must be strictly greater than {{governanceApprovalThresholdString}} of votes cast (the configured `yea`-minus-`nay` margin is {{governanceRequiredYeaMarginString}}).
* **Queued ({{governanceExecutionDelayString}}):** a successful proposal waits before it can be executed. This final phase alone is shorter than the validator withdrawal delay, but the complete public process provides at least {{governanceTotalDelayString}} of notice. Initiating an exit immediately removes a validator from the active set, while its stake becomes withdrawable after {{validatorExitDelayString}}.
* **Executable ({{governanceGracePeriodString}}):** anyone can execute the proposal during this grace period; otherwise it expires.

## Emergency proposal path

If sequencer signaling is unavailable, anyone can call `proposeWithLock()` directly on `Governance`. The proposer must lock **{{governanceLockString}}**, roughly {{governanceLockShareOfSupplyString}} of the total supply, for {{governanceLockDelayString}}. The payload then follows the same pending, voting, queued, and executable phases as a signaled proposal.

## Immutable deployments and bounded ownership

The `Rollup`, verifier, `Inbox`, `Outbox`, and installed `EscapeHatch` code cannot be upgraded in place. Feature upgrades deploy a new stack and use Governance to register its Rollup in the `Registry` and GSE. Validators staked to the bonus instance (`{{bonusInstanceAddress}}`) follow the newest GSE Rollup automatically; validators explicitly bound to an older Rollup remain associated with it.

Governance owns the Rollup, but its setter surface is intentionally constrained: it can change the sequencer/prover reward split and checkpoint reward, only increase the mana target, change proving cost delayed and within bounds, and update validator-entry rate within non-zero values. It can queue a replacement Slasher with a {{slasherExecutionDelayString}} delay. The outgoing Slasher then remains active for {{legacySlasherDrainWindowString}}. The EscapeHatch, the reward distributor and reward-booster addresses are fixed for the deployment.

Governance also owns the GSE and can register a new latest Rollup or set the proof-of-possession gas limit too low for new validator deposits. These powers can move incentives and bonus-instance validators away from the current version, but they do not mutate this deployment's verifier, messaging contracts, or installed EscapeHatch.

## Slashing and the SlashVeto Council

Aztec's onchain slashing path uses `SlashingProposer` ballots and the `Slasher`. Governance can bypass the proposer and submit a payload directly to the Slasher, and can rotate the authorized Slasher through the delayed Rollup process described above. Both the ballot and direct-governance paths remain subject to payload vetoes and global pauses by the SlashVeto Council.

The **Vetoer** role is held by the SlashVeto Council. It cannot upgrade the protocol or relay arbitrary calls. It can:

* veto a specific payload permanently; and
* disable all slashing for {{slashingDisableDurationString}}. Calling the function again renews the pause, while the Council can also re-enable slashing early.

## Economics and treasury

* **CoinIssuer:** the owner can mint AZTEC within an annual cap of {{coinIssuerNominalAnnualPercentageCapString}} of the current total supply.
* **ProtocolTreasury:** the DAO's treasury is gated until approximately {{protocolTreasuryGatedUntilString}} and is additionally subject to an ATP-derived activation timestamp and proposal-ordering checks. Once every gate is satisfied, a Governance proposal can relay arbitrary calls and value through the treasury.
