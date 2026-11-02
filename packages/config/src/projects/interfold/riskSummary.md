## Funds can be stolen if
1. the VotingEscrowMultisig deploys a malicious [upgrade](#upgrades-and-governance) of VotingEscrow, which holds locked FOLD, with no delay.
2. either Interfold multisig deploys a malicious [upgrade](#upgrades-and-governance) of VotingEscrow or BondingRegistry, which hold locked and bonded FOLD, with no delay.
<br>
## Privacy can be lost if
1. {{decryptionThreshold}} of the {{committeeMembers}} ciphernodes in a vote's committee combine their key shares (see privileged insider).
2. either Interfold multisig instantly shrinks future committees or swaps the program that sums future ballots for one that outputs a single ballot (see privileged insider).
3. one voter's power exceeds the totals of all but one option (see chain analyst and future adversary).
