## Funds can be stolen if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. all [trusted setup](#trusted-setups) participants collude or leak their secrets, allowing forged proofs.
<br>
## Funds can be lost if
1. a user loses the wallet whose signature derives their keys.
2. a user signs the Tacit identity message on a malicious site, which can then spend their notes.
3. a user sends a token other than ETH to a deposit address, which releases only ETH.
<br>
## Privacy can be lost if
1. few depositors use the pool, so timing and amounts can pair a withdrawal with its deposit (see chain analyst).
2. Tacit's relay, the only one running, refuses a withdrawal, so the user must self-relay from a public wallet (see chain analyst).
3. a user keeps the default RPC nodes, which receive the deposit addresses and the withdrawal recipient in one session (see network observer).
4. Tacit's account points anon.wei at another page or changes the default relay host and RPC nodes, without delay (see privileged insider).
5. elliptic-curve cryptography is broken, which opens every note derived from a wallet that signed in and sent a transaction (see future adversary).
