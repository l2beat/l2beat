Ethereum has no deterministic forced-inclusion mechanism on mainnet. Its live-chain censorship resistance comes from rotating stake-weighted proposers and from a selected proposer retaining the option to construct a block locally instead of using an external builder.

### Selective censorship

A user can broadcast a transaction to the public mempool and wait for a proposer, or a builder selected by that proposer, that is willing to include it. Each non-censoring stake-weighted proposer slot is another probabilistic inclusion opportunity. An honest proposer can use local block production if its connected builders or relays censor the transaction, but the user cannot force this choice and there is no bounded protocol delay.

### Blanket censorship

If the active proposer set continues producing blocks while coordinating to censor a transaction, Ethereum has no protocol queue or live inclusion list that the user can invoke to bypass it. Depositing 32 ETH only enters the activation queue and does not grant immediate proposal rights.

### Walkaway

If enough validators go offline to stop finality while some blocks are still produced, inactivity penalties reduce the weight of offline validators until the remaining online stake can finalize again. If all block production stops, the chain cannot process new validator deposits or activations. Ethereum has no external settlement layer to exit to, so recovery from a complete halt requires existing validators to return or social coordination around a client restart or fork.
