### Enforcement

The ASP reviews the depositing address of each deposit under 0xbow's own policy. Its [docs](https://docs.privacypools.com/protocol/asp/what-is-an-asp) name sanctions screening, blocklist checks and AML rules. It approves the deposit, rejects it or asks the depositor to prove the funds' origin first. The PoolVault accepts a private spend only with a proof against the ASP's latest list. Removing a deposit therefore freezes every note that descends from it, including notes other users received as payment. 0xbow's [terms](https://github.com/0xbow-io/privacy-pools-website-v2/blob/5dc5434b443b10aa33c7db5421824d84b71a08b4/config/legal/terms-of-use.ts#L201) let it deny, pause or withdraw an approval at any time. The contracts accept no second list and check no recipient or withdrawal address. The ASP's rules are closed. Its lists are public on IPFS, and it publishes a hash of each label it rejected, without a reason.

### Data access

The app's wallet check, which the user starts, names the wallet to the ASP before any deposit. 0xbow's [privacy policy](https://github.com/0xbow-io/privacy-pools-website-v2/blob/5dc5434b443b10aa33c7db5421824d84b71a08b4/config/legal/privacy-policy.ts#L502) lets it share screening records with analytics providers and authorities.

### Proof of clean origin

A recipient reads the proof from the transaction and needs nothing from the user. It speaks for 0xbow's list alone. To show more, the user shares a receipt or their viewing key.
