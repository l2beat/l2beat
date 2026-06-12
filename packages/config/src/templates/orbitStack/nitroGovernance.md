All critical system smart contracts are upgradeable (can be arbitrarily changed). This permission is governed by the Arbitrum Decentralized Autonomous Organization (DAO)
and their elected Security Council. The Arbitrum DAO controls Arbitrum One and Arbitrum Nova through upgrades and modifications to their smart contracts on Layer 1 Ethereum and the Layer 2s.
While the DAO governs through token-weighted governance in their associated ARB token, the Security Council can directly act through
multisigs on all three chains. Although they are technically separate and connect to different target permissions,
their member- and threshold configuration is kept in sync by a manager contract on Arbitrum One sending crosschain transactions.

Regular upgrades, Admin- and Owner actions originate from either the Arbitrum DAO or the non-emergency (Proposer-) Security Council on Arbitrum One
and pass through multiple delays and timelocks before being executed at their destination. Contrarily, the three Emergency Security Council multisigs
(one on each chain: Arbitrum One, Ethereum, Arbitrum Nova) can skip delays and directly access all admin- and upgrade functions of all smart contracts.
These two general paths have the same destination: the respective UpgradeExecutor smart contract.

Regular upgrades are scheduled in the L2 Timelock. The proposer Security Council can do this directly and the Arbitrum DAO (ARB token holders and delegates) must meet a
CoreGovernor-enforced {{l2CoreQuorumPercent}}% threshold of the votable tokens. The L2 Timelock queues the transaction for a {{l2TimelockDelay}} delay and then sends it to the Outbox contract on Ethereum. This incurs another delay (the challenge period) of {{challengeWindowSeconds}}, which is extended by an additional {{challengeGracePeriodSeconds}} if the top-level assertion has been challenged.
When that has passed, the L1 Timelock delays for additional {{l1TimelockDelay}}. Both timelocks serve as delays during which the transparent transaction contents can be audited,
and, in the case of the final L1 timelock, cancelled by the Emergency Security Council. Finally, the transaction can be executed, calling Admin- or Owner restricted functions of the respective destination smart contracts
through the UpgradeExecutor on Ethereum. If the predefined  transaction destination is Arbitrum One or -Nova, this last call is executed on L2 through the canonical bridge and the aliased address of the L1 Timelock.

Operator roles like the Sequencers and Validators are managed using the same paths.
Sequencer changes can be delegated to a Batch Poster Manager role.

Transactions targeting the Arbitrum DAO Treasury can be scheduled in the {{treasuryTimelockDelay}}
Treasury Timelock by meeting a TreasuryGovernor-enforced {{l2TreasuryQuorumPercent}}% threshold of votable ARB tokens. The Security Council cannot regularly cancel
these transactions or schedule different ones but can overwrite them anyway by having upgrade permissions for all the underlying smart contracts.
