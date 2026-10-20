{{symbol}} is Coinbase's liquid staking token for ETH. It represents ETH staked through Coinbase, plus accrued rewards, as a token whose ETH value rises over time through a reported exchange rate.

### Wrapping and minting

There is no onchain deposit. Users stake ETH on Coinbase's exchange and wrap the resulting staked-ETH balance into {{symbol}}, which Coinbase mints to them; unwrapping burns {{symbol}} and credits the balance back on the exchange. Minting goes through a rate-limited relay, one of the token's {{minterCount}} configured minters: {{mintCallerCount}} Coinbase keys may mint through it, the most permissive up to {{maxMintAllowance}} {{symbol}} over {{maxMintInterval}}. No ETH is attached to a mint. The contracts never hold ETH and do not track beacon-chain balances, so backing rests on Coinbase's records and custody.

![cbETH minting flow](/images/architecture/cbeth-deposits.png#center)

### Exchange rate

A Coinbase key reports the ETH-per-{{symbol}} rate through a limiter that currently allows a cumulative move of {{rateCapEth}} ETH per {{symbol}} over {{rateCapInterval}}, about {{rateCapMultiple}} the current rate, so the limit does not bind in practice. The token only requires the rate to be non-zero and uses it in no function of its own; it is a published reference value. Coinbase can reconfigure or replace the oracle immediately.

### Redeeming

{{symbol}} cannot be redeemed for ETH onchain. The only exit is unwrapping on Coinbase's exchange, subject to Coinbase's terms and the beacon-chain unstaking queue, or selling on the secondary market. Pausing or blacklisting can stop a holder from transferring at all.

![cbETH exchange rate and exit flow](/images/architecture/cbeth-withdrawals.png#center)

### Governance

All roles are Coinbase-controlled EOAs. They can mint {{symbol}}, change the rate and the operational roles, pause or blacklist any address, and upgrade the token contract, each without delay. The two relays are not upgradeable, but their owners can rewire callers and limits instantly.
