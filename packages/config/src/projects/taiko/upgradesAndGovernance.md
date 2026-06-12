Taiko Alethia has a governance structure relying primarily on a {{securityCouncilStats}} Security Council, checked by a token DAO that is limited to veto permissions. The closed operator whitelists are managed by the {{taikoMultisigStats}} Taiko Multisig and related EOAs. Governance proposals (both paths) hold all important upgrade and config permissions in the system.
# Standard proposals
A threshold of {{standardProposalThreshold}} approving Security Council members is required to create a Standard proposal. It is delayed while being publicly auditable by {{timelockPeriod}} in the OptimisticTokenVotingPlugin contract and can be vetoed by {{minVetoPercent}}% of votable TAIKO tokens during that time. If not vetoed, the standard proposal passes and can be executed.
# Emergency proposals
Emergency proposals are encrypted at proposal time and can only be read by Security Council members. If approved by {{emergencyProposalThreshold}} Security Council members, they can be immediately decrypted and executed.

# Proof system and operators
The proof system currently does not require zk proofs to validate state transitions and state can be finalized with SGX proofs only. The optional zk verifier contracts can be upgraded by Multisigs. Operator roles (sequencer, proposer) are closed and the whitelist is managed by the Taiko Multisig and related EOAs.
