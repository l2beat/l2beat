STRK-20 lets you shield any ERC-20 token on Starknet, send it privately to other users, use it in DeFi and withdraw it to any address. Senders, amounts and which deposit funds which withdrawal stay hidden inside the pool. Deposits, withdrawals, the first payment to each new contact and DeFi calls are public.

Users trust the holder of the auditor key, which can decrypt every user's history, and the holder of the screener key, which must approve every deposit. A multisig can upgrade the [pool](https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a) without delay. Leaving needs StarkWare's sequencer, which alone checks proofs and includes pool transactions.

### Architecture

Each user registers a viewing key, which the pool stores encrypted to the auditor key. Payments travel over channels: the first payment to a contact opens one and names the recipient, later ones only add encrypted notes. A private transfer needs a registered recipient, and registering takes a transaction and fee from the recipient's own account. A note holds an amount of one token, and spending it publishes a nullifier. DeFi actions use open notes, whose amount a helper contract fills after the swap or loan.

### Flow

1. **Register.** The wallet publishes your viewing key, encrypted to the auditor key.
2. **Deposit.** The holder of the screener key signs off on your address, and the pool takes the tokens and creates a note. Address, token and amount are public.
3. **Transfer.** The wallet proves offchain that you may spend your notes and creates notes for the recipient. A paymaster submits the transaction and takes its fee from your notes.
4. **Withdraw.** The pool pays out to any address. Recipient, token and amount are public, and the withdrawing user is encrypted to the auditor key.

### Keys

Your Starknet account signs every action, and your viewing key decrypts your notes. Ready's servers create the viewing key for most accounts, while Xverse derives it from a wallet signature. Registration cannot be changed, so a leaked viewing key exposes your history for good.

### App

StarkWare lists Ready and Xverse as wallets, and both are closed source. Both send each action, with your viewing key, to their own servers for proving and note discovery. The [SDK](https://github.com/starkware-libs/starknet-privacy) is open, and a custom client on it can use its own [prover](https://github.com/starkware-libs/sequencer/tree/main/crates/starknet_transaction_prover)(high hardware requirements), its own note discovery and an oblivious relay. Deposits still need the screening signature.

### Compliance

Every deposit needs a fresh signature from the pool's screener key, also for users who run their own prover. Deposits from DeFi helpers follow a policy per helper that governance sets: some are exempt, the rest are screened. The auditor key is one public key in the pool's storage. Who holds the screener and auditor private keys is not visible onchain, and governance can replace either key at once.

### Fees

Every pool transaction pays a fixed STRK fee, which governance can change at any time, plus gas. Paymasters take their cost from the user's notes.

### Anonymity set

One pool holds every token, but each token forms its own set. Registered users are the upper bound.
