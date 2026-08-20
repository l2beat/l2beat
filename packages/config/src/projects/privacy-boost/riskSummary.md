## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid spends or withdrawals.
3. the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) or registers a malicious verifying key.
<br>
## Funds can be lost if
1. a user loses the note secrets or the approval key required to spend their notes.
2. the operator and relays stop before a user's approval key is included in an auth snapshot.
<br>
## Privacy can be lost if
1. the TEE is compromised by a physical access attack.
2. a registered auditor fetches the user's balance and transaction history through the Audit API.
3. a user exits through a forced withdrawal, which publicly links the spent notes and the withdrawal address to the account that registered the approval key.
