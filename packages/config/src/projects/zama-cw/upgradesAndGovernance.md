
ZamaGovMultisigA ({{multisigAStats}}) and ZamaGovMultisigB ({{multisigBStats}}) each control the protocol through ZamaGovCore, an Aragon governance contract that owns the core contracts. Either multisig can upgrade core contracts, change every compliance setting, manage KMS signer sets and trigger FHE key generation.

ZamaDeFiGovCore, a second such contract and one member of ZamaGovMultisigA, acts through its own multisig ({{defiMultisigStats}}). It can upgrade ConfidentialSwap instantly, appoint its market makers and pausers, and pause or retune the vault batchers.

SafeL2 ({{gatewaySafeStats}}) owns the Gateway contracts and can change coprocessors and KMS settings there or disconnect Ethereum. Any of {{aclPauserCount}} pausers can pause the ACL, and any of {{gatewayPauserCount}} the Gateway. Either halts every token until its owner unpauses.
