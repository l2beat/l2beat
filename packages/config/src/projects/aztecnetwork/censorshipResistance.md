The regular committee can be circumvented by the escape hatch, which uses RANDAO to designate a previously enrolled bonded candidate that may publish checkpoints without committee attestations. Enrollment requires {{escapeHatchBondString}}, a high bond intended to protect the single-proof system while providing a last-resort path around the regular sequencer set. Aztec's private execution environment can also make selective censorship harder because transaction contents are hidden.

### Selective censorship

On a live network with some censoring sequencers, users can submit private transactions or wait for an honest committee and proposer to include their public transaction.

### Blanket censorship

If the entire active set censors or stops producing checkpoints, a new sequencer can join through the permissionless staking queue, subject to its churn limits. A sufficiently capitalized account can instead enroll for the escape hatch, but enrollment, candidate-set snapshots, eligibility, and RANDAO selection are lagged. Specialized proving hardware is still required. Adversaries can also saturate the entry queue or candidate set and reduce an honest user's inclusion probability.

### Walkaway

Hatch opportunities occur approximately every {{escapeHatchFrequencyString}}, but the candidate set can be empty and selection, proposal, and proving can fail. The protocol therefore provides no deterministic maximum inclusion delay; permissionless validator entry and the bonded hatch only improve the probability that the chain eventually recovers.
