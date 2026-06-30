There is no general mechanism to force the sequencer to include a transaction.
Forced inclusions are disabled in the current `MainnetInbox` implementation: `saveForcedInclusion()` always reverts and `propose()` only accepts zero forced inclusions.
If the selected proposer is down or censoring, user transactions that are not included by the permissioned proposer remain non-included.
