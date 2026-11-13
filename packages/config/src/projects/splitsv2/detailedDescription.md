A split stores only a hash of its recipients and shares. Whoever triggers a payout passes the full list, which the split's events publish. Each split is a small proxy that runs the code of an immutable implementation.

A split's creator can set a reward of up to {{maxIncentivePercent}}% of each payout for whoever triggers it. Shares round down and the remainder stays with the split.

### The Warehouse

The Warehouse holds ETH and tokens as a balance per address. Anyone can trigger a withdrawal, and the funds always go to the address that owns the balance. That address can reserve withdrawals for itself, or offer a reward to whoever withdraws for it. It can also move its balance to another address inside the Warehouse.

Push splits use the Warehouse as a fallback. ETH that a recipient does not accept is credited there in the recipient's name.

### Split owners

A split created without an owner never changes. The owner of any other split can replace its recipients, pause its payouts and make any call from the split, which includes moving its funds. The owner can also sign messages as the split, pass the role on or give it up.

An owner who sets a withdrawal reward for a pull split itself exposes its funds. Anyone can then withdraw the split's Warehouse balance for the reward, put the rest back and repeat.

### How a split gets stuck

- **A token refuses one push split recipient.** A push split pays all recipients in one transaction, with no fallback for ERC-20 transfers. If a token's issuer blacklists one recipient, none of them gets that token.
- **A recipient contract blocks a push split's ETH** by calling the split again while being paid. This works in splits of up to about ten recipients.
- **A split has too many recipients** to pay out within a transaction's gas limit. There is no cap.

The owner of a stuck split can replace its recipients or move its funds. A split without an owner has no way out.

### Unsupported tokens

Pull splits rely on tokens that transfer the exact amount. A token that charges a transfer fee or shrinks balances leaves the Warehouse short of that token. The recipients who withdraw it last cannot get their full share.

### Versions

Three versions are live, each with its own factories and implementations: v2.0 from {{v20Date}}, v2.1 from {{v21Date}} and v2.2 from {{v22Date}}. All use the same Warehouse, and a split stays on the version that created it.

On Ethereum, a v2.0 pull split cannot pay out USDT, because USDT's approval function returns no value. A v2.1 pull split can, but its first USDT deposit into the Warehouse burns about 97% of its gas and needs at least 2.6 million. Beyond about 16 recipients, that deposit and the payout no longer fit in one transaction and take two. v2.2 pays out USDT normally.

### Interfaces

Splits Lite is an open-source interface that creates v2.2 push splits and triggers payouts of existing splits, in ETH and eleven listed tokens. It reads a split's recipients from event logs through Alchemy and contacts no Splits server. For a pull split, the payout also withdraws every recipient's share from the Warehouse. The Splits team also runs an explorer at explorer.splits.org, whose source is not among its public repositories.

The same contracts are deployed at the same addresses on other chains. This page covers Ethereum.
