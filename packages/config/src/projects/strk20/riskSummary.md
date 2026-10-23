## Funds can be stolen if
1. the proof system or virtual Starknet execution model is broken, allowing invalid actions.
2. the Starknet sequencer includes a transaction with fabricated proof facts.
3. a multisig deploys a malicious pool upgrade, which takes effect without delay.
4. an external DeFi helper or target protocol invoked by the user mishandles assets.
5. a multisig upgrades the anonymizer, which takes effect without delay and can move everything shadow accounts hold (see [upgrades and governance](#upgrades-and-governance)).
<br>
## Funds can be lost if
1. a user loses the Starknet account key or viewing key required to spend their notes.
2. the pool is paused or upgraded so that valid actions fail.
<br>
## Privacy can be lost if
1. the holder of the auditor key decrypts users' viewing keys, which exposes their whole history (see privileged insider).
2. the wallet's prover or note discovery service, which receives the viewing key with every action, leaks or keeps it (see privileged insider).
3. an app driving a shadow account or a swap through the pool links it to the user's main address (see privileged insider).
4. a first payment to a new contact, a channel opened beside a deposit or a unique amount links activity (see public observer, chain analyst).
5. elliptic-curve cryptography is broken, which opens the auditor key and with it every user's history (see future adversary).
