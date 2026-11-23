## Funds can be stolen if
1. whoever made the single phase 2 contribution of the [trusted setup](#trusted-setups) kept or leaks its secret, which allows forged proofs.
2. the zk proof system is broken, allowing invalid spends or withdrawals.
3. the 2/3 multisig registers a malicious verifier or helper through the timelock, which takes effect after {{timelockDelay}}.
4. the 2/3 multisig upgrades the Emporium through the timelock, which can then move the funds of every public account delegated to the HinkalWallet.
<br>
## Funds can be lost if
1. a user loses the recovery phrase or the wallet whose signature derives their keys.
<br>
## Funds can be frozen if
1. Hinkal's relayers refuse a withdrawal, since no released app can submit it from the user's own wallet.
<br>
## Privacy can be lost if
1. Hinkal reads notes with its enclave key, to which every note is encrypted (see privileged insider).
2. a user signs in to Hinkal Pay, or keeps the extension's default Remote Proving, which send keys to Hinkal's enclave (see privileged insider).
3. most deposits of a token leave again as the same amount, so few deposits hide a withdrawal (see chain analyst).
4. a public RPC ties the public accounts it reads to a withdrawal, by the requests the extension makes while waiting for it (see network observer).
5. elliptic-curve cryptography is broken, which opens every note through the enclave key or the sender's published H1 (see future adversary).
