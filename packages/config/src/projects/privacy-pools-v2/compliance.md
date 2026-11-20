### Enforcement

0xbow's [docs](https://docs.privacypools.com/protocol/asp/what-is-an-asp) name sanctions screening, blocklist checks and AML rules. The ASP approves a deposit, rejects it or asks the depositor to prove the funds' origin first. The PoolVault accepts a private spend only with a proof against the ASP's latest list. Removing a deposit therefore freezes every note that descends from it, including notes other users received as payment. 0xbow's [terms](https://github.com/0xbow-io/privacy-pools-website-v2/blob/5dc5434b443b10aa33c7db5421824d84b71a08b4/config/legal/terms-of-use.ts#L201) let it deny, pause or withdraw an approval at any time. The contracts accept no second list and check no recipient or withdrawal address. The ASP's lists are public on IPFS. It also publishes a hash of each label it rejected, without a reason.

### Access to private data

A label is the private ID that every note from one deposit carries. Each payee learns it, and a ragequit publishes it. The app's wallet check, which the user starts, names the wallet to the ASP before any deposit. 0xbow's [privacy policy](https://github.com/0xbow-io/privacy-pools-website-v2/blob/5dc5434b443b10aa33c7db5421824d84b71a08b4/config/legal/privacy-policy.ts#L502) lets it share screening records with analytics providers and authorities.

### Proof of clean origin

A recipient reads the proof from the transaction and needs nothing from the user. The label is its price: a payee can often trace a received label to its deposit. The proof speaks for 0xbow's list alone. To show more, the user shares a receipt for one payment or the viewing key for every incoming note.
