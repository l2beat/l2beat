Tornado Cash lets the user withdraw a deposit of ETH or a token to an address with no visible link to it. Each pool takes one amount, like 0.1 ETH, so amounts reveal nothing within a pool. Depositors, recipients and timing stay public.

No one can pause, upgrade or block the pools. TORN token holders govern the app pinned on tornadocash.eth, the router's list of pools and the relayer registry. Leaving needs no one: anyone can prove a withdrawal directly to a pool.

### Flow

1. **Deposit.** The app creates a secret note and sends its commitment to the pool through the router. Your address is public.
2. **Withdraw.** You paste the note into the app, which proves that it belongs to an unspent deposit without revealing which. A relayer submits the proof and pays the gas for a fee from the withdrawal.

### Keys

Each deposit has its own note, which the app shows once for the user to save. Whoever holds the note can withdraw, and losing it loses the funds. An optional note account backs notes up onchain, encrypted to a key from the user's wallet.

### App

The app is pinned on tornadocash.eth. Each proposal that changes it names the [source commit](https://github.com/tornado-dao/classic-ui) and a [build recipe](https://github.com/tornado-dao/tornado-ipfs-ui) that recomputes its IPFS hash, currently `{{appCid}}`. Gateways like eth.limo serve it. The user's own IPFS node takes the gateway out of the trust path. Tor Browser cannot reach a local node. The full setup opens the app from it in Firefox set to Tor's proxy, DNS included, which routes everything else through Tor. The app lists relayers from the registry and withdraws through a relayer without a wallet. It accepts the user's own RPC endpoint, but relayer name lookups always go to Pocket Network and global deposit event stats to The Graph. In 2024 a pinned version [sent users' notes to an attacker](https://www.coindesk.com/business/2024/02/26/tornado-cash-reportedly-suffers-backend-exploit-user-deposits-at-risk) ([code analysis here](https://github.com/sekuba/tornadocash-pwned)).

### Compliance

Tornado Cash has no screening or approval list. The app's [compliance page](https://github.com/tornado-dao/classic-ui/blob/17c54dae9ad91bb3c6d62a7860df6cd365ab76d4/pages/compliance.vue) builds a report that links one of the user's withdrawals to its deposit, for the user to share. The US sanctions on the pools were lifted in March 2025.

### Fees

The pools charge no fee. Relayers take their fee from the withdrawal. Registered relayers also burn part of their TORN stake on each withdrawal, at a rate governance sets.

### Anonymity set

Each pool has its own set: the deposits of that token and amount not yet withdrawn. Pools differ widely in size, and the ETH pools on Ethereum are by far the largest.
