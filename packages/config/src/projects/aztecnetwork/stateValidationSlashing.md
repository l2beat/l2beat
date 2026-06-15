Each stake of {{activationThresholdString}} that is locked to join the sequencer set and vote in governance can be slashed under certain conditions. Slashing is voted on by sequencers each time they propose a checkpoint and is grouped in rounds that span {{epochsPerRound}} epochs ({{roundDuration}}) each.

Slashing conditions are programmed into each sequencer node and can be changed by node operators by updating or editing their node software. Nodes usually submit votes to slash automatically on L1. The `TallySlashingProposer` contract only enforces the formalities of the slashing system:
* A given slashing round's votes always target the checkpoint proposals from {{slashOffsetRounds}} rounds ago.
* As soon as a round's votes have reached a quorum of {{tallySlashQuorum}}/{{slotsPerRound}}, it enters an execution delay of {{slashPayloadExecutionDelayRounds}} rounds ({{slashExecutionDelay}})
* An automatically generated slashing payload is executable by anyone on L1 after the execution delay, applying the slashing penalties defined by the sequencer votes.

Slashing penalties are defined onchain in three levels: large ({{slashAmountLarge}}), medium ({{slashAmountMedium}}), and small ({{slashAmountSmall}}). Offenses that lead to slashing usually include:
* Inactivity: A sequencer fails to attest or propose when selected.
* Data Withholding: A sequencer proposes a checkpoint including state diff data availability on L1 but withholds the public transaction bodies and/or CHONK proofs required for permissionless proving.
* Invalidity: A sequencer attests to invalid proposals, multiple conflicting proposals, with invalid signatures, or proposes a block that is not proven in time.

The above offense list is not exhaustive and not defined onchain but usually in the software the sequencers decide to run. This is also where the mapping of offenses to the slashing penalty levels can be defined.

The SlashVeto Council is a {{slashVetoStats}} Multisig that can veto specific proposals and/or all slashing for {{slashingDisableDurationString}} at a time.
