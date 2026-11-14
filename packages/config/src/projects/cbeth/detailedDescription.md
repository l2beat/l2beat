{{symbol}} is Coinbase's liquid staking token for ETH. It represents ETH staked through Coinbase, plus accrued rewards, as a token whose ETH value rises over time through a reported exchange rate.

### Wrapping and minting

There is no onchain deposit. According to Coinbase, users wrap the staked-ETH balance they hold on its exchange into {{symbol}} and unwrap it back. Onchain this appears only as mints and burns by Coinbase keys, with no ETH attached, so backing rests on Coinbase's records. Minting goes through a rate-limited relay, one of the token's {{minterCount}} configured minters. {{mintSentence}}

![cbETH minting flow](/images/architecture/cbeth-deposits.png#center)

### Exchange rate

{{rateSentence}} No contract uses the rate. It is only published. Coinbase can replace the oracle at any time.

### Redeeming

{{symbol}} cannot be redeemed for ETH onchain. Coinbase holds the ETH, so the only exits are redeeming through Coinbase, on its terms and timelines, or selling on the secondary market. Pausing or blacklisting can stop a holder from transferring at all.

![cbETH exchange rate and exit flow](/images/architecture/cbeth-withdrawals.png#center)

### Governance

Every role is a single Coinbase key, and every change takes effect immediately. The two relays are not upgradeable, but their owners can change callers and limits.
