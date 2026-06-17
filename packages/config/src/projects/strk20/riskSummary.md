## Funds can be stolen if
1. the proof system or virtual Starknet execution model is broken, allowing invalid server actions to be applied.
2. governance grants upgrade power and executes a malicious implementation.
3. an external DeFi helper or target protocol invoked by the user mishandles assets during an open-note flow.
<br>
## Funds can be lost if
1. a user loses the Starknet account key or private viewing key required to spend their notes.
2. the pool is paused or upgraded in a way that prevents users from applying valid actions.
<br>
## Privacy can be lost if
1. the auditor private key holder decrypts registered users' viewing keys or auditor-encrypted withdrawal and open-note metadata.
2. the currently private SDK or prover leaks user secrets or metadata.
3. deposits, withdrawals, open-note fills, timing, unique amounts, or DeFi helper calldata make a user's activity linkable.
4. a malicious upgrade changes the protocol to expose private state or weaken proof checks.
