Privacy Pools v2 by 0xbow lets you shield ETH, USDC or USDT in one pool, then send, swap, earn Aave yield and withdraw without a visible link to the deposit. Only deposits that 0xbow's association set provider (ASP) approves can be spent privately. Depositors, recipients, amounts and timing at the pool's edges stay public.

Users trust 0xbow, which runs the ASP, the only relayer and the website, and one key that can upgrade every core contract without delay. The ASP can withhold or revoke approval for any deposit. Exiting is permissionless: a note's owner can always ragequit it from the vault, losing their privacy.

### Architecture

A note is a private record of value in one asset, owned by an Ethereum address and carrying the label of its deposit. The PoolVault holds all assets and a state tree of note commitments and spent nullifiers. The Keystore holds each account's registration: a hash of its nullifying key, its auth policy and an X25519 viewing public key. The ASPRegistry holds the latest root of the approved labels. USDC, USDT and ETH enter as yield shares, ppUSDC, ppUSDT and ppETH, which wrap Aave v3 deposits.

### Labels

Each deposit gets a label, a private ID that only the depositor and the ASP can tie to the deposit. Every note created from the deposit's funds carries the same label, including notes paid to others, so each recipient learns it. Notes from different deposits never merge. Each private spend proves that its notes' labels are on the ASP's latest list. Anyone who knows a label can hash it, find the list update that first approved it and look at the deposits made just before.

### Flow

1. **Register.** Two transactions from your wallet add your account to the Keystore and publish your viewing public key.
2. **Shield.** You deposit through the Entrypoint. USDC, USDT and ETH pass through a PPRouter that supplies Aave and deposits the shares. Your address, asset and amount are public, and the data that ties the deposit to its label goes onchain encrypted to the ASP.
3. **Approval.** The ASP screens the depositor, adds the label's hash to its list and posts the root onchain, with the list on IPFS.
4. **Send.** A transact proof spends your notes and creates one for the recipient, encrypted to their viewing key and published onchain, plus change for you. An unregistered recipient gets a claim link instead. 0xbow's relayer submits the proof onchain and takes its fee as a public withdrawal.
5. **Withdraw.** The relayer pays any address, minus its fee. Change stays as a note.

### Keys

All keys derive from one signature of the user's wallet. Contract wallets and signers that cannot sign the same way twice can use a passkey instead. The derived account key can be exported from the app. Sharing the viewing private key reveals every incoming note, a receipt reveals one payment. The revocable key can be rotated, and the old one stays valid for {{rootLiveness}}.

### App

The ratings assume the website at [privacypools.com](https://privacypools.com), built from [public source](https://github.com/0xbow-io/privacy-pools-website-v2) and hosted by 0xbow. It reads the chain from Alchemy under 0xbow's key unless the user sets an endpoint per chain. It downloads the pool's events whole from the ASP but offers only 0xbow's relayer. Its Tor option requires a user-run Tor gateway and covers only RPC calls. It does not support connecting a local node with Tor enabled. Privacy Pools v2 is deployed on BNB Chain, Citrea, Optimism, Base, Arbitrum and Robinhood Chain, which L2BEAT does not track.

### Swaps and yield

The yield shares keep a fixed share count while their value grows, so the share count encodes the exchange rate on the deposit day. Withdraw-and-swap sends the withdrawn asset through LI.FI to another token or chain, with the route bound into the proof. A reshield swaps into another pool asset and deposits again in the same transaction, as a fresh deposit that needs approval again.

### Exits

**Ragequit.** The note's current owner can take out its full value at any time, approved or not, directly from the vault, also while it is paused. It publishes the owner, the amount, the label and the commitment, which names the transaction that created the note.

**Claim link.** A payment to an unregistered address can only be claimed with the link the payer holds. Until then the funds can neither move nor exit.

**Relaying.** The contracts accept a proof from any address, and no relayer can change its recipient. A relayer other than 0xbow's needs the user's own build of the website or another client.

### Compliance

The ASP screens each depositor before approving the deposit, under 0xbow's own due diligence, and may reject it. A later list can drop an approved label, which freezes every note that carries it. A rejected deposit can leave only by ragequit.

### Fees

Deposits pay no vetting fee today. The relayer quotes its fee per request and takes it from the sent or withdrawn asset. You accept the fee before sending, and the relayer cannot raise it. A private transfer pays that fee as a public payout from the vault. The yield shares keep {{yieldFee}} of the Aave yield for 0xbow.

### Anonymity set

One vault holds every asset, but a withdrawal names its asset. The set is therefore the ASP-approved deposits of that asset whose notes still hold at least the withdrawn amount, including the notes that transfers and reshields created from them. We count every depositor of the asset, approved or not.
