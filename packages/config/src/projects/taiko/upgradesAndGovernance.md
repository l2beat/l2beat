Taiko Alethia has a governance structure relying primarily on a {{securityCouncilStats}} Security Council, checked by a token DAO that is limited to veto permissions. The closed operator whitelists are managed by the {{taikoMultisigStats}} Taiko Multisig and related EOAs. Governance proposals (both paths) hold all important upgrade and config permissions in the system.
# Standard proposals
A threshold of {{standardProposalThreshold}} approving Security Council members is required to forward a Standard proposal to the OptimisticTokenVotingPlugin contract. It can be vetoed by {{minVetoPercent}}% of votable TAIKO tokens during a {{standardProposalDuration}} public veto period. If not vetoed, a further {{timelockPeriod}} timelock applies before the proposal can be executed.
# Emergency proposals
Emergency proposals are encrypted at proposal time and can only be read by Security Council members. If approved by {{emergencyProposalThreshold}} Security Council members, they can be immediately decrypted and executed.

# Proof system and operators
A separate {{risc0SafeStats}} Safe controls shared RISC0 verifier routes through a {{risc0TimelockDelay}} timelock. It can also freeze RISC0 verifiers immediately. Operator roles (sequencer, proposer) are closed and the whitelist is managed by the Taiko Multisig and related EOAs.
