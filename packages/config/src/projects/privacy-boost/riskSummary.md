## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.
3. the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or registers a malicious verifying key, with no delay.
<br>
## Funds can be lost if
1. a user loses their note secrets, or both the account-owner wallet and every usable authorization key.
<br>
## Privacy can be lost if
1. the TEE's hardware vendor, or anyone with physical access to the enclave, breaks its isolation (see privileged insider).
2. an auditor appointed by the admin multisig fetches the user's history through the Audit API (see privileged insider).
3. a user exits through a forced withdrawal (see public observer).
4. a user relies on today's anonymity set, which is too small to hide in (see chain analyst).
5. the operator deploys an enclave image or a closed SDK core that leaks user data (see privileged insider).
6. Alchemy pairs the signed-in wallet with the withdrawal by timing (see network observer).
7. elliptic-curve cryptography is broken, which decrypts every note through the enclave's long-lived public key (see future adversary).
