## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid spends or withdrawals.
3. the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) or registers a malicious verifying key.
<br>
## Funds can be lost if
1. a user loses their note secrets, or loses access to both the account-owner wallet and any usable authorization keys.
<br>
## Privacy can be lost if
1. the TEE is compromised.
2. a registered auditor fetches the user's balance and transaction history through the Audit API.
3. a user exits through a forced withdrawal, which publicly links the spent notes and the withdrawal address to the account that registered the approval key.
