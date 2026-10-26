InterfoldSafeA ({{safeAStats}}) and InterfoldSafeB ({{safeBStats}}) have the same signers. Through the Admin plugin, either can execute any InterfoldGovCore action instantly and without a vote. InterfoldGovCore owns the coordinator, the ciphernode and bonding registries and their proxy admins. The multisigs can therefore upgrade these contracts and change the committee size of future votes. CRISPProgram cannot be upgraded.

Governance proposals pass a CRISP vote of {{voteDuration}}, then need InterfoldSafeB's approval within {{approvalWindow}}.

VotingEscrowGovCore can upgrade the escrow that holds locked FOLD. It executes whatever its {{veMultisigThreshold}}-of-{{veMultisigMembers}} multisig plugin approves. InterfoldGovCore can also execute through it.
