Chainlink operates the price feeds that onchain protocols read to value their assets. This entry covers three of them: ETH/USD, stETH/USD, and rETH/ETH. Each feed is a proxy standing in front of an aggregator; consumers read the latest answer from the proxy, which forwards to whichever aggregator sits behind it.

### How a price is produced

Each feed runs Chainlink's OCR2 protocol. Offchain, the feed's oracle nodes observe a price and assemble a report carrying the median of their observations. To land onchain the report must be signed by a quorum of the feed's signers and relayed by one of its authorized transmitters. The aggregator recovers each signature, requires a quorum of distinct active signers, and records the report's median as the new answer. The quorum differs per feed: {{ethUsdQuorum}} signers for ETH/USD, {{stethUsdQuorum}} for stETH/USD, and {{rethEthQuorum}} for rETH/ETH.

Transmitters cannot alter a report, only submit it or withhold it; each is a forwarder contract that relays for a single node key set by the owner. The signers are the trust root: a colluding quorum can sign a report with any observations and move the reported price to almost any value. The only onchain check on the median is a floor of {{minAnswer}} (essentially zero at the feed's precision) and a ceiling so high it never binds, so the sole value the quorum cannot report is zero or a negative number.

### Governance and trust surface

A single {{safeStats}} Gnosis Safe owns every proxy and aggregator. Through it the operators can rewrite a feed's signer and transmitter sets and its quorum size, or repoint a proxy to an entirely different aggregator in a two-step propose-then-confirm, so the Safe can replace either the price source or the parties that control it. It also sets the nodes' payees and billing and manages who may read the feed.

Reads are not fully public: each aggregator gates its price reads to an owner-managed allowlist of contracts plus any account calling directly as an externally owned account. A consuming protocol therefore reads a feed through its allowlisted proxy rather than calling the aggregator itself.
