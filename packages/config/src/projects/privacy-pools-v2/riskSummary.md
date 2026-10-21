## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.
3. the upgrader key deploys a malicious [upgrade](#upgrades-and-governance) of the PoolVault, which holds every deposit, or a verifier that accepts any proof, with no delay.
<br>
## Funds can be lost if
1. a user loses the wallet whose signature derives their keys and the exported account key.
2. the payer loses a claim link before the recipient claims it.
3. Aave suffers a loss on the reserve behind a yield share.
<br>
## Privacy can be lost if
1. the ASP leaves deposits out of its latest list, which freezes every note from them, up to halting all private spends (see privileged insider).
2. the ASP keeps only a few labels in its latest list, so spends proven against it point to one of them (see privileged insider).
3. 0xbow's relayer refuses a withdrawal, so the user must self-relay from a public wallet (see chain analyst).
4. a note's label, which passes to every later payee, links to its deposit when timed against the ASP's updates (see chain analyst).
5. 0xbow pairs the IP of a deposit session with the IP of a withdrawal request across its ASP and relayer (see privileged insider).
6. a user keeps the default RPCs, which see their account at sign-in and can time it against the withdrawal (see network observer).
7. elliptic-curve cryptography is broken, which decrypts every onchain note from the published viewing keys (see future adversary).
