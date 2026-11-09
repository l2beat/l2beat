Tacit Pay lets you shield ETH into a private balance, pay any Tacit address privately and withdraw any part to any address. Inside the pool, who pays whom and how much stays hidden, and a withdrawal does not show which deposit paid it. Deposits and withdrawals show address and amount.

The contracts have no owner, pause or upgrade. Users trust Tacit's relay, which sends spends by default. They also trust Tacit's app owner, a single key that controls the app's name and the endpoints the app reads. Users can send their own spends and withdraw without Tacit.

### Architecture

A note is a private record of ETH, published only as a hash of its value, its owner's key and a random value. The TacitEvmPool holds all deposits, a tree of note hashes and the spent nullifiers. Spending a note publishes its nullifier, a hash only the owner can compute, which marks the note spent without naming it. Each transaction carries one proof that spends up to two notes and creates up to two. Each new note carries a memo with its value, encrypted to the recipient's view key. Wallets find their notes by decrypting memos on the device.

### Deposit addresses

A deposit address is an ordinary address derived from the user's keys. Anyone can pay it, and anyone can sweep its balance into the pool as a note for that user. The app issues a new one for each payer who asks. A payment link names one deposit address and carries a signature over it by the payee's view key.

### Flow

1. **Sign in.** Your wallet signs a fixed message, and the page derives your Tacit keys from the signature. Nothing goes onchain.
2. **Shield.** You deposit from your wallet, or pay one of your deposit addresses from any wallet, which the relay then sweeps in. Your address and the amount are public.
3. **Send.** The page proves on your device and the relay submits the proof. Only nullifiers, note hashes and encrypted memos become public.
4. **Withdraw.** The relay pays the address and amount you choose and takes its fee from your balance. The recipient and amount are public, the change stays a note.

### Keys

All keys derive from one signature of the user's wallet over a fixed message, so whoever obtains that signature controls the funds. Contract wallets cannot sign in. A Tacit address holds three public keys: one that checks spends, one behind each note's nullifier and one that payers encrypt memos to. A .wei, .gwei or .eth name can publish the whole address onchain in its `finance.tacit` text record, so payers can pay the name. Deposit addresses can be found again from the keys alone.

### App

anon.wei is one HTML page stored as contract code on Ethereum, each version immutable. The reviewed version is the TacitPay8244 contract below. Save it from your own node with `cast call 0x0000000d42137547140b0812E1178F025e08bc49 "html()(string)" --rpc-url <node> --json | jq -j '.[0]' > anon.html`, check that the file's sha256 is `3b94ab980316470756345dd754cd212dde57067e0ef95dce1531fcaecfde9c08` and serve it from localhost. Its sign-in note sends users to anon.wei.limo, which serves whichever version the app owner names. The page checks the proving files against pinned hashes.

### Network

The page reads the chain through public RPC nodes and syncs from the relay's history feed. It keeps a feed page only where the tree it builds matches a root the pool has held. The feed can still hide a note, which Rebuild recovers from chain logs. Under Endpoints the user can set their own node and another relay or none.

### Exits

Any account can submit a proof, and the proof fixes recipient, amount, relayer and fee, so a relayer can change none of them. A withdrawal that creates no notes cannot be made stale by other transactions. Any account can sweep a deposit address, and its owner can do so without a fee.

### Fees

The contracts take no fee. The relay charges the transaction's gas plus a margin, which the page checks against a ceiling. Sweeping a deposit address costs at most 0.25% of its balance, and the relay sweeps only balances that cover its gas.

### Anonymity set

The set counts each account that sent a deposit into the ETH pool on Ethereum. A deposit through a deposit address counts the account that sent the sweep, usually the relay. Accounts that withdraw their deposits back to themselves still count, though they hide no one.
