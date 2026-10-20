{{symbol}} is Coinbase's liquid staking token for ETH. It represents ETH staked through Coinbase, plus accrued rewards, as a token whose ETH value rises over time through a reported exchange rate.

### Wrapping and minting

There is no onchain deposit. According to Coinbase, users wrap the staked-ETH balance they hold on its exchange into {{symbol}} and unwrap it back; onchain this appears only as mints and burns by Coinbase keys, and nothing ties a mint to staked ETH. Minting goes through a rate-limited relay, one of the token's {{minterCount}} configured minters. {{mintCallerCount}} Coinbase keys may mint through it, to any address: the largest single allowance is {{maxMintAllowance}} {{symbol}} over {{maxMintInterval}}, and the fastest-refilling key can sustain about {{maxMintPerDay}} {{symbol}} per day. No ETH is attached to a mint. The contracts never hold ETH and do not track beacon-chain balances, so backing rests on Coinbase's records and custody.

![cbETH minting flow](/images/architecture/cbeth-deposits.png#center)

### Exchange rate

A Coinbase key reports the ETH-per-{{symbol}} rate through a limiter that currently allows a cumulative move of {{rateCapEth}} ETH per {{symbol}} over {{rateCapInterval}}, about {{rateCapMultiple}} the current rate, so the limit does not bind in practice. The token only requires the rate to be non-zero and uses it in no function of its own; it is a published reference value. Coinbase can reconfigure or replace the oracle immediately.

### Redeeming

{{symbol}} cannot be redeemed for ETH onchain. The only exit is custodial redemption through Coinbase, on its terms and timelines, or selling on the secondary market. Pausing or blacklisting can stop a holder from transferring at all.

![cbETH exchange rate and exit flow](/images/architecture/cbeth-withdrawals.png#center)

### Governance

All roles are Coinbase-controlled EOAs. They can mint {{symbol}}, change the rate and the operational roles, pause or blacklist any address, and upgrade the token contract, each without delay. The two relays are not upgradeable, but their owners can rewire callers and limits instantly.
