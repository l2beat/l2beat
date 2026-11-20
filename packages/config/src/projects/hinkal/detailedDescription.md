Hinkal Wallet gives the user a private account next to a public one, to pay, swap and receive from either. Private funds sit in a pool on Ethereum, so the pool pays a recipient and the user's address does not. Which deposit funds which withdrawal stays hidden, and so do transfers between private balances. Deposits, withdrawals and the tokens of every transaction are public.

The user trusts Hinkal, the operator. Its enclave can decrypt every note in the pool. Hinkal's {{multisig}} multisig can replace the verifiers after {{upgradeDelay}}, which can release every deposit. Leaving depends on Hinkal's relayers.

### Architecture

Balances are encrypted notes in a public tree of commitments. Spending a note publishes its nullifier, and a zk-SNARK proves the spend without revealing which note it was. Each note is encrypted to its recipient and to the enclave, a server of Hinkal in a Google Confidential Space VM.

The pool contract is immutable. The HinkalHelper contract builds the public inputs each proof is checked against and lists the relayers. External actions are contracts the pool hands tokens to for swaps and bridges.

### Flow

1. **Create a wallet.** The wallet makes a recovery phrase and derives a public and a private account from it. Seconds later it sends the private account's nullifying key, encrypted, to the enclave.
2. **Shield.** Your public account deposits into the pool. Its address, token and amount are public.
3. **Receive.** You share a private address or payment link. A payment from another private account stays in the pool. A payment from a wallet is a public deposit.
4. **Send.** The enclave or your browser builds the proof, your spending key signs it, and Hinkal's relayer submits it. To a private address it shows only the token.
5. **Unshield.** A payment to a public address is a withdrawal. Recipient, token and amount are public.

A send from the public account to a public address deposits and withdraws in one step. Both transactions carry the same amount, apart from the fee.

### Keys

The recovery phrase derives every key in the wallet. The nullifying key finds the user's notes, decrypts them and marks them spent. The spending key authorises each spend and stays in the wallet.

### App

The wallet is a Chrome extension with closed source. By default the enclave scans for the user's notes and builds proofs with the nullifying key. With Remote Proving off in Settings, the wallet downloads the pool's notes and proves in the browser. The wallet checks that the enclave is a Confidential Space VM with debugging off, run under Hinkal's service account. It does not check which image the VM runs.

Hinkal's server learns which public accounts belong to a private account. It also receives a privacy score that the wallet computes from the user's balances.

### Swaps

A swap or bridge spends notes to an external action contract. The contract trades through [LI.FI](https://li.fi) and returns the output to the pool as new notes, or pays it out. Tokens and amounts of the trade are public. The Emporium action runs a list of calls the user signed, from its own address or from an account that delegates to HinkalWallet.

### Exits

Every withdrawal goes through one of Hinkal's relayers. The pool also accepts a withdrawal that the user submits from their own address, which the wallet does not offer.

### Compliance

Screening happens offchain, and the contracts check none of it. Hinkal's relayers decide which spends they submit, and each spend tells them which notes it uses. Hinkal names [Chainalysis](https://hinkal-team.gitbook.io/hinkal/security-and-compliance/compliance) as its screening provider.

### Fees

Each transaction sets its own fee, which the relayer keeps: a flat amount for gas and a share of the amount. Hinkal's [fee table](https://hinkal-team.gitbook.io/hinkal/hinkal-wallet/fees) lists 0.25% on shields, unshields and private sends, and 0.35% on swaps.

### Anonymity set

Each token has its own anonymity set, since every transaction names its tokens. The charts count USDT and USDC transfers into and out of the pool, swaps and relayer fees included. ETH is not tracked.
