## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. whoever made the single [trusted setup](#trusted-setups) contribution of a circuit kept its secret, allowing forged proofs.
3. Hinkal's multisig registers a verifier that accepts any proof or replaces the HinkalHelper, and users stay in the pool past the {{upgradeDelay}} [timelock](#upgrades-and-governance).
4. the HinkalHelper, whose code is unverified, passes the verifiers inputs that differ from the transaction.
<br>
## Funds can be lost if
1. a user loses their recovery phrase.
<br>
## Use can be stopped if
1. Hinkal's relayers refuse a spend, since the wallet offers no withdrawal without them.
<br>
## Privacy can be lost if
1. a user sends from the public account to a public address, which deposits and pays out the same amount seconds apart (see chain analyst).
2. a user relies on the anonymity set, which is too small to hide in (see chain analyst).
3. a public RPC node pairs the public account it sees in a session with a withdrawal by timing (see network observer).
4. Hinkal reads the notes and keys its enclave receives, or publishes a wallet version that leaks more (see privileged insider).
5. elliptic-curve cryptography is broken, which decrypts every note through the enclave's long-lived public key (see future adversary).
