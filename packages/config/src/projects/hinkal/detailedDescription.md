Hinkal lets users hold ETH and ERC-20 tokens privately on Ethereum, send them to other Hinkal accounts, swap them and withdraw to any address. Who pays whom inside the pool stays hidden, and so does which deposit funds which withdrawal. Deposits and withdrawals are public, and every transaction names its tokens.

The user trusts Hinkal, the operator. A key of its enclave can decrypt every note, and its relayers submit every transaction the extension sends. Its {{multisigStats}} multisig can replace the proof verifiers and the transaction checks after {{timelockDelay}}.

### Architecture

Balances are notes, published only as hashes in one tree for all tokens. Spending a note publishes its nullifier, and a zk-SNARK proves the spend without showing which note it was. Each note is encrypted to its recipient and to a fixed key of Hinkal's enclave, a server in a Google Confidential Space VM. The pool contract is immutable. The HinkalHelper builds the public inputs each proof is checked against and lists the relayers.

### Flow

1. **Shield.** A public account of the wallet deposits into the pool. Its address, the token and the amount are public.
2. **Send.** A private send creates a note for another private address. Hinkal's relayer submits it, and only the token and the fee are public. The fee reveals roughly the amount.
3. **Receive.** You share a private address or a payment link. A payer without a private balance deposits to it in public.
4. **Unshield.** The pool pays any address. Recipient, token and amount are public.

### Keys

The wallet derives its public accounts and one private account from a recovery phrase. The nullifying key finds the user's notes, decrypts them and computes their nullifiers. The spending key signs each spend on the device. A wallet created with a Google account keeps its encrypted recovery phrase on Hinkal's server.

### App

The [Hinkal Wallet](https://chromewebstore.google.com/detail/khfjgapjfcdoffmklchibpepboholpbe) Chrome extension, version 0.0.65, has closed source. By default it sends the nullifying key to Hinkal's enclave seconds after the wallet is created. The enclave then finds the user's notes and builds the proofs. With Remote Proving off in Settings, the wallet downloads the pool's notes and proves on the device. The wallet checks that the enclave is a Confidential Space VM under Hinkal's account, but not which code it runs. It reads the chain through fixed public RPC nodes and Hinkal's servers, which also store the list of the user's public accounts.

### Swaps and public accounts

A transaction can hand shielded funds to an external action, a contract registered on the pool. The action returns the result as new notes, with tokens and amounts public. The pool checks its balance after every action, so an action can lose what its own transaction sent it and nothing more. Swaps use the LI.FI action.

Hinkal Wallet also creates a public address for each user, only this public address can interact with dApps. Public account delegates control to HinkalWallet and upgradeable contract Emporium, so an Emporium upgrade can move everything these accounts hold.

### Exits

A proof fixes recipient, amount, relayer and fee, so a relayer can change none of them. The contracts accept a withdrawal that users submit from their own address, but the extension only sends through Hinkal's relayers.

### Fees

The contracts take no protocol fee. The wallet charges 0.25% on shields, private sends and unshields and 0.35% on swaps and bridges, plus gas, all paid to Hinkal's relayer. A private send adds its 0.25% to the public flat fee.

### Anonymity set

Each token has its own anonymity set, since every transaction names its tokens. Many deposits are followed within minutes by a withdrawal of about the same amount, and these hide no one.
