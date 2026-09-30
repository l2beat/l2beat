zk.money is a private DAI wallet by Aztec Labs. Funds are escrowed in the ZkMoneyPortal on Ethereum and recorded as private notes on Aztec, where users pay each other by tag (a zk.money name).

### Deposits
Users fund one-time deposit addresses (SIPAs) derived for their account. Anyone can sweep them into the portal. USDC and USDT are swapped to DAI through the Curve 3pool, the sweeper receives {{depositFee}} ({{registrationSweepFee}} when claiming a tag) and the remainder is sent to Aztec through the canonical Inbox.

Claiming a tag costs {{registrationFee}} by default, including the sweep fee, paid from the first deposit. The domain owner can sign custom prices that cover the sweep fee. The portal accepts at most {{depositLimit}} per {{depositRefillTime}}, and every deposit, payment and withdrawal is capped per transaction.

### Multi-proof system
Every payment and withdrawal needs both an Aztec validity proof and a signature from an AWS Nitro enclave registered on the portal (2/2). Anyone can register an enclave with a fresh AWS attestation of the approved image. Aztec Labs publishes the image without a reproducible build, so its correspondence to the published code cannot be checked. Stealing funds requires a failure of Aztec's private execution and of the enclave layer at the same time. Every exit depends on a live enclave, which sees each operation in plaintext.

### Fees
The portal takes {{fpcFundingCut}} from every deposit and withdrawal to sponsor Aztec fees through a fee-paying contract. Anyone can refill it. Sponsorship requires a tag signed by the domain owner or a voucher from such an account. The released wallet relies on this contract, so transactions wait when it is empty or Aztec fees exceed its allowance. Modified wallet code can also pay with the account's own Fee Juice.

### Tags, resolver and passkeys
- **Tags** publicly map to an account's Aztec address and keys on Ethereum. Every claim requires the domain owner's signature, issued by zk.money's closed-source claim server subject to its name blocklist. The released wallet also needs a tag to restore an account on a new device.
- **The resolver** handles payments to name.zk.money from outside the wallet, for example from MetaMask. It gets a fresh deposit address from the recipient's operator and checks its zk proof. Internal payments and deposit addresses created by the wallet use the Ethereum registry directly. Users can switch operators and anyone can register one, but the only operator is Aztec Labs' closed-source service. The proof circuit is unpublished.
- **Passkeys** belong to auth.zk.money. On every use, the browser requires that domain to authorize wallet.zk.money for both the hosted wallet and zk.money Desktop. A wallet served under auth.zk.money itself needs no such authorization, and the contracts do not check the signature's origin. Control of the domain determines where passkeys work.

### Compliance
Address screening runs in the wallet and Aztec Labs' services. The contracts and enclave enforce validity and amount limits without checking address lists:

- **Wallet:** deposits from a connected wallet, withdrawals, payment-link claims to Ethereum and deposit address recoveries send the Ethereum address to Predicate through zk.money. A flag or service outage blocks the operation. Funding a deposit address from another wallet skips this check.
- **Relayer:** before submitting an L1 operation, it simulates it and screens the target and all token senders and receivers against the OFAC SDN list, plus Predicate if configured. A hit blocks submission.
- **Resolver:** it screens a deposit address and its funders against the OFAC SDN list before announcing a payment to a zk.money name. A hit prevents notification and sweeping. Only the recipient can recover the funds, using their own tooling to re-derive the address.

The wallet lets users sweep deposits and finalize proven withdrawals on Ethereum themselves, bypassing relayer screening. Withdrawals still need an enclave signature. Another address or a modified desktop build can bypass wallet screening.

### Setups
- **Hosted web wallet:** loads code from zk.money on every visit. Control of the domain or deployment lets an attacker read all keys except the spending key and request harmful signatures, because passkey prompts do not show the operation. The default Aztec node is run by Aztec Labs and the Ethereum RPC is chosen by zk.money. Both endpoints and the enclave can be changed in settings.
- **zk.money Desktop with own Aztec node and Ethereum RPC:** runs a local build of the published wallet source. It still fetches contract addresses at startup from two unsigned lists run by Aztec Labs. The config profile has a bundled fallback, the Oxide deployment manifest does not. Address screening and passkey authorization also depend on zk.money.
- **Modified desktop build:** served under auth.zk.money, with local copies of both lists and Predicate screening removed, can operate without zk.money services. Users can submit sweeps and withdrawal finalizations with ETH and run an enclave on AWS. New tags still require the domain owner's signature, and only Aztec Labs publishes the approved enclave image. L2BEAT did not run such a build.

In every setup, the browser profile stores the master key unencrypted until sign-out, and viewing keys and decrypted notes until local wallet data is cleared. All keys except the spending key derive from the master key. Device access therefore exposes the user's history.
