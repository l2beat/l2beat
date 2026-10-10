Privacy Pools lets you withdraw ETH or a token to an address with no visible link to your deposit, in one go or in parts. Only deposits that 0xbow's association set provider (ASP) currently approves can leave privately. Depositors, recipients, amounts and timing stay public.

Users trust 0xbow, which runs the ASP and hosts the website, and the {{multisigStats}} multisig that can upgrade the Entrypoint without delay. The ASP can withhold approval for any deposit or remove it at any time. Exiting is permissionless: the depositing address can always ragequit its funds from the immutable pools, in public.

### Flow

1. **Deposit.** You send funds through the Entrypoint, which keeps the vetting fee and adds a commitment to the asset's pool. Your address and the amount are public.
2. **Approval.** The ASP adds the deposit's label to its approved list, usually within hours. It posts the list's root onchain and the list itself on IPFS.
3. **Withdraw.** The website proves that you own an approved, unspent deposit without revealing which. A relayer submits the proof and pays the gas for a fee from the withdrawal. What you leave in the pool stays behind as a change note.

### Keys

All notes derive from one recovery phrase. The website creates a random one or derives it from a signature of your wallet. Losing it loses the funds.

### App

The ratings assume the website at [privacypools.com](https://privacypools.com), built from [public source](https://github.com/0xbow-io/privacy-pools-website) and hosted by 0xbow. It accepts your own RPC endpoint and a sign-in with the recovery phrase alone. It offers two relayers, Fast Relay and Cloaked Relay. Over Tor, Fast Relay often refuses the connection and the website switches to Cloaked Relay. Accounts from the older 12-word key method send their deposit labels to 0xbow while they migrate.

### Exits

**Ragequit.** The depositing address can take out a note's funds at any time, approved or not, directly from the pool. It reveals which deposit the funds belong to, and for a change note, the withdrawal that left it.

### Compliance

The ASP screens each depositing address before approving its deposit, under 0xbow's own due diligence. It may ask for a Proof of Association, which 0xbow's [separate app](https://tornado.0xbow.io) creates for Tornado Cash withdrawals. Every withdrawal must prove against the ASP's latest list, so a later list can revoke an earlier approval. A deposit without approval can leave only by ragequit.

### Fees

Deposits pay a vetting fee, which the Entrypoint owner can withdraw. Relayers set their own fee per withdrawal, within a cap per asset:
{{feeSummary}}

A withdrawal you submit yourself pays no relayer fee.

### Anonymity set

Each pool has its own set: the approved deposits whose notes still hold at least the withdrawn amount. Deposits the ASP has not approved never count. Smaller withdrawals from larger pools hide among more deposits.
