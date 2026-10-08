## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.
3. the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) or registers a malicious verifying key.
<br>
## Funds can be lost if
1. a user loses their note secrets, or both the account-owner wallet and every usable authorization key.
<br>
## Privacy can be lost if
1. the TEE or its hardware vendor is compromised (see privileged insider).
2. an appointed auditor fetches the user's history through the Audit API.
3. a user exits through a forced withdrawal (see public observer).
