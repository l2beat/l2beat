There are two main paths for contract upgrades in the shared ZK stack ecosystem - standard and emergency - both converging on the shared upgrade management contract ProtocolUpgradeHandler.
The standard path involves a governance proposal and voting through the DAO, multiple timelock delays and finally approval by the Guardians or {{scApprovalThreshold}} SecurityCouncil participants.
The emergency path allows for contract upgrades without any delay by the EmergencyUpgradeBoard, which acts as a 3/3 Multisig between SecurityCouncil, Guardians and the FoundationMultisig.
## Standard path
### On ZKsync Era
Delegates can start new proposals by reaching a threshold of {{protocolStartProposalThresholdM}}M ZK tokens on the ZKsync Era Rollup's ZkProtocolGovernor contract.
This launches a {{protVotingDelayS}} 'voting delay' after which the {{protVotingPeriodS}} voting period starts. During these first two periods, the proposal can be canceled by the proposer or if it falls below the proposing threshold.
A proposal is only successful if it reaches both quorum ({{protocolQuorumM}}M ZK tokens) and simple majority. When it reaches quorum, a remaining voting period of {{protLateQuorumVoteExtensionS}} is guaranteed by a potential late quorum vote extension.
In the successful case, it can be queued in the {{protTlMinDelayS}} timelock which forwards it via the Gateway to Ethereum as an L2->L1 log.
### On Ethereum
After the execution of the proposal-containing batch ({{executionDelay}} delay), the proposal is now picked up by the ProtocolUpgradeHandler and enters the {{legalVetoStandardS}} 'legal veto period'.
This serves as a window in which a veto could be coordinated offchain, to be then enforced by non-approval of Guardians and SecurityCouncil. A threshold of {{guardiansExtendThreshold}} Guardians can extend the veto period to {{legalVetoExtendedS}}.
After this a proposal enters a *waiting* state of {{upgradeWaitOrExpireS}}, from which it can be immediately approved (cancelling the delay) by {{scApprovalThreshold}} participants of the SecurityCouncil.
For the unlikely case that the Security Council does not approve here, the Guardians can instead approve the proposal, or nobody. In the two latter cases, the waiting period is enforced in full.
A proposal cannot be actively cancelled in the ProtocolUpgradeHandler, but will expire if not approved within the waiting period. An approved proposal now enters the *pendingExecution* state for a final delay of {{upgradeDelayPeriodS}} and can then be executed.
### Other governance tracks
There are two other tracks of Governance also starting with DAO Delegate proposals the ZKsync Era rollup: 1) Token Program Proposals that add new minters, allocations or upgrade the ZK token and
2) Governance Advisory Proposals that e.g. change the ZK Credo or other offchain Governance Procedures without onchain targets.
The protocol for these two other tracks is similar to the first part of the standard path described above (albeit having different quorum and timelock values), and not passing over to the Ethereum L1.
Further customizations are that the ZkFoundationMultisig can propose to the ZkTokenGovernor without a threshold and that the Guardians' L2 alias can cancel proposals in the ZkTokenGovernor and the ZkGovOpsGovernor.
## Emergency path
SecurityCouncil ({{scThresholdString}}), Guardians ({{guardiansThresholdString}}) and ZkFoundationMultisig ({{zkFoundationStats}}) form a de-facto 3/3 Multisig
by pushing an immediate upgrade proposal through the EmergencyUpgradeBoard, which circumvents all delays and executes immediately via the ProtocolUpgradeHandler.
## Upgrade Delays
The cumulative duration of the upgrade paths from the moment of a voted 'successful' proposal is {{upgradeDelayWithScApprovalS}} or {{upgradeDelayWithScApprovalExtendedLegalVotingS}} (depending on Guardians extending the LegalVetoPeriod) for Standard, 0 for Emergency and {{upgradeDelayNoScS}} for the path in which the SecurityCouncil is not approving the proposal.
## Freezing
The SecurityCouncil can freeze (pause withdrawals and settlement) all chains connected to the current ChainTypeManager.
Either for a softFreeze of {{softFreezeS}} or a hardFreeze of {{hardFreezeS}}.
After a softFreeze and / or a hardFreeze, a proposal from the EmergencyUpgradeBoard has to be passed before subsequent freezes are possible.
Only the SecurityCouncil can unfreeze an active freeze.
## ZK cluster Admin and Chain Admin
Apart from the paths that can upgrade all shared implementations, the ZK stack governance system defines other roles that can modify the system:
A single *ZK cluster Admin* role who governs parameters in the shared contracts and a *Chain Admin* role (defined in each chain-specific diamond contract) for managing parameters of each individual ZK chain that builds on the stack.
These chain-specific actions include critical operations like setting a transaction filterer that can censor L1 -> L2 messages, changing the DA mode, migrating the chain to a different settlement layer and standard operations like setting fee parameters and adding / removing Validators in the ValidatorTimelock.
For rollups, data availability on Ethereum is validated by a RollupL1DAValidator contract (or a RelayedSLDAValidator on the Gateway). Each rollup can become a permanent rollup (through their Chain Admin) which disallows DA changes to non-whitelisted sources or settlement layers in the future.
The source of truth for rollup-compliant DA validator contracts is the RollupDAManager contract, which is administered via the ProtocolUpgradeHandler.
ZKsync Era's Chain Admin differs from the others as it also has the above *ZK cluster Admin* role in the shared ZK stack contracts.
