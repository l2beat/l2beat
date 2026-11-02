## Funds can be stolen if
1. the proof system or virtual Starknet execution model is broken, allowing invalid actions.
2. the Starknet sequencer includes a transaction with fabricated proof facts.
3. the 7/12 multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or of the anonymizer, which owns every shadow account, with no delay.
4. the 2/4 multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or of the anonymizer, with a one-day delay.
5. an external DeFi helper or target protocol invoked by the user mishandles assets.
<br>
## Funds can be lost if
1. a user loses the Starknet account key or viewing key required to spend their notes.
2. the pool is paused or upgraded so that valid actions fail.
<br>
## Privacy can be lost if
1. the holder of the auditor key decrypts users' viewing keys, which exposes their whole history (see privileged insider).
2. the wallet's prover or note discovery service, which receives the viewing key, leaks or keeps it (see privileged insider).
3. an app driving a shadow account or a swap through the pool links it to the user's main address (see privileged insider).
4. a first payment to a new contact, a channel opened beside a deposit or a unique amount links activity (see public observer and chain analyst).
5. Bramble sends CoinGecko every privately held token at each balance check, which can single out holders of rare tokens (see network observer).
6. elliptic-curve cryptography is broken, which opens the auditor key and with it every user's history (see future adversary).
