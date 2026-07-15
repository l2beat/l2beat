Each {{activationThresholdString}} stake used to join the sequencer set and vote in governance can be slashed. The designated proposer for each slot can submit one separate signed ballot on L1. Ballots are grouped into rounds spanning {{epochsPerRound}} epochs ({{roundDuration}}).

Slashing conditions are implemented in sequencer-node software and can change when operators update or modify that software. The onchain `SlashingProposer` enforces the voting and execution rules:

* Ballots in a round target committee members from {{slashOffsetRounds}} rounds earlier.
* Quorum is evaluated separately for each validator position and penalty level, not for the round as a whole. At least {{slashQuorum}} matching ballots out of up to {{slotsPerRound}} slots are required. Votes for a higher penalty also count toward every lower level, and each validator is slashed once at the highest level that reaches quorum.
* A round becomes executable after more than {{slashPayloadExecutionDelayRounds}} rounds (approximately {{slashExecutionDelay}}) and expires at age {{slashLifetimeRounds}} rounds, leaving a {{slashExecutionWindowRounds}}-round execution window.
* Anyone can call `executeRound()` during that window. It verifies committee commitments, skips escape-hatch epochs, deploys a deterministic payload for the approved actions, and asks the authorized Slasher to execute it.

The current onchain penalty levels are large ({{slashAmountLarge}}), medium ({{slashAmountMedium}}), and small ({{slashAmountSmall}}). Offenses that node software can ballot for include:

* **Inactivity:** a sequencer fails to attest or propose when selected.
* **Data withholding:** a sequencer publishes state-diff blobs but withholds public transaction bodies or CHONK proofs needed for permissionless proving.
* **Invalidity or equivocation:** a sequencer attests to an invalid proposal, signs conflicting proposals or attestations, or uses an invalid signature.

This list and the mapping of offenses to penalty levels are not exhaustive or defined by the L1 contracts; they depend on the software each sequencer runs.

The SlashVeto Council is a {{slashVetoStats}} Multisig. It can permanently veto a specific payload, repeatedly renew a global {{slashingDisableDurationString}} pause, or re-enable slashing before a pause expires. Governance can submit Slasher payloads without ballot approval, but it cannot bypass these veto and pause checks.
