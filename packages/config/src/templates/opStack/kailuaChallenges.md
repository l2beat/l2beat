{{challengeIntro}}

In the tree of proposed state roots, each parent node can have multiple children. These children are indirectly challenging each other in a tournament, which can only be resolved if but a single child survives. A state root can be resolved if it is **the only remaining proposal** due to any combination of the following elimination methods:
1. the proposal's challenge period of {{maxClockDuration}} has ended before a conflicting proposal was made
2. the proposal is proven correct with a full validity proof (invalidates all conflicting proposals)
3. a conflicting sibling proposal is proven faulty

Proving any of the {{proposalOutputCount}} intermediate state commitments in a proposal faulty invalidates the entire proposal. Proving a proposal valid invalidates all conflicting siblings. Pruning of a tournament's children happens strictly chronologically, which guarantees that the first faulty proposal of a given proposer is always pruned first. When pruned, an invalid proposal leads to the elimination of its proposer, which invalidates all their subsequent proposals, slashes their bond, and disallows future proposals by the same address. A slashed bond is transferred to an address chosen by the prover who caused the slashing.

A single remaining child in a tournament can be 'resolved' and will be finalized and usable for withdrawals after an execution delay of {{disputeGameFinalityDelaySeconds}} (time for the Guardian to manually blacklist malicious state roots).
