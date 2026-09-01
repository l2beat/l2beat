Tornado Cash is a non-custodial mixer on Ethereum built around separate fixed-denomination pools, which prevents linking deposits and withdrawals via the amount. A deposit publishes a commitment into a Merkle tree producing a secret note, and a later withdrawal uses a zk-SNARK proof and the note to send the same denomination to a different address, breaking the deposit-withdrawal link. The note represents ownership of tokens in a Tornado cash pool, and losing it will effectively mean losing the tokens.

The core mixer contracts are immutable and have no admin, pause, or upgrade path, so funds can only move out with a valid proof. However Tornado cash features TORN token governance, which controls peripheral smart contracts: official pool registry, relayer registration requirement and TORN tokenomics.

### Privacy considerations

Tornado cash introduces a permissionless relayer network, which is essential for practical privacy. Relayers process withdrawals from Tornado cash pools on user's behalf for a fee, which enables withdrawals to fresh addresses without funding them before the withdrawal. Without an active relayer network, practical privacy of Tornado cash deteriorates significantly.

Practical privacy also depends on the timing of deposits and withdrawals, underlying network and browser used to interact with Tornado cash frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

The immutable Tornado Cash pools do not charge a protocol-level deposit or withdrawal fee. Withdrawals can include a relayer fee chosen offchain between the user and the relayer and passed to the pool withdrawal call.

### Compliance

Tornado cash does not have any protocol-level compliance features. However, it provides an optional [Compliance Tool](https://docs.tornado.cash/tornado-cash-classic/compliance-tool), which allows users to generate a proof linking a withdrawal to a specific deposit without revealing this information publicly onchain. This enables users to selectively disclose the origin of funds to third parties, such as exchanges or regulators.

Protocol pools were [sanctioned by OFAC in August 2022](https://home.treasury.gov/news/press-releases/jy0916), flagging funds moved through these smart contracts as illicit and resulting in broad censorship (mainly by block builders) of transactions touching the contracts. Sanctions were lifted on March 21, 2025.

### Anonymity set

A user's anonymity set consists of all previous deposits into the same bucket (i.e. deposits of the same token and amount). Deposits can be mixed only with other deposits of the same token and denomination. To maximize the anonymity set, users are advised to deposit into the buckets with the most usage.

### Secure frontend

For average users, the Tornado Cash frontend must be recognized as a critical part of the privacy protocol. If compromised, it can steal user assets and violate user privacy, which [was exploited in 2024](https://www.coindesk.com/business/2024/02/26/tornado-cash-reportedly-suffers-backend-exploit-user-deposits-at-risk).

The frontend's root of trust is the IPFS content hash registered for [tornadocash.eth](https://app.ens.domains/tornadocash.eth?tab=records) in the ENS smart contract on Ethereum. 
The latest hash can be fetched from a trusted ethereum node (e.g. your own or trusted light node rpc). 
There were incidents of malicious frontend hash updates passing onchain governance proposals before, so using a publicly audited or self-audited IPFS hash is advised. 
An example of an audit process with useful links can be found [here](https://gist.github.com/pcaversaccio/ea7f62fd21b6e22f301980007f7c767e) or [here](https://notes.ethereum.org/@GW1ZUbNKR5iRjjKYx6_dJQ/Bk8zsJ9xj).
The frontend can then be accessed by running a local IPFS node that automatically fetches the verified frontend hash (e.g. [dapp3.eth](https://github.com/apoorvlathey/dapp3) or [kubo](https://github.com/ipfs/kubo) + [ipfs-companion](https://github.com/ipfs/ipfs-companion) and serves it in the browser locally.
