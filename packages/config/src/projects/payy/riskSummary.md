## Funds can be stolen if
1. the verifier or the circuits accept an invalid withdrawal.
2. the PayyMultisig upgrades the RollupV1 contract or overwrites the state root, which takes effect without delay.
<br>
## Funds can be lost if
1. a user loses the note data or the keys required to spend their notes.
2. the offchain transaction data becomes unavailable, as data availability is not verified on Ethereum.
3. the operators stop including withdrawals in proven state updates, as there is no forced exit mechanism.
<br>
## Privacy can be lost if
1. anyone with Payy's block data follows which notes fund which, from a deposit address to a withdrawal address (see public observer).
2. a path without splits or merges reveals every amount between a deposit and a withdrawal (see chain analyst).
3. the closed-source Payy app sends user data to third parties, which Payy can change at any time (see network observer).
4. Payy's backend, which ties each wallet to its KYC record, deposit address and notes, leaks or uses this data (see privileged insider).
5. the public per-transaction proofs, which are not zero-knowledge, or retained registry ciphertexts are opened in the future (see future adversary).
