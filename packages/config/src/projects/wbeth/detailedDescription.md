{{symbol}} is Binance's liquid staking token for ETH. It wraps BETH, Binance's offchain balance for staked ETH, into a token whose ETH value rises as staking rewards accrue.

### Staking and minting

Anyone can deposit ETH in the token contract to mint {{symbol}} at the reported exchange rate. A Binance operator can move that ETH to Binance-controlled addresses or to the redemption queue. Validator balances and rewards are not tracked by the contracts.

Binance can also mint {{symbol}} through its `OperatorWallet` against BETH balances on the exchange. This issuance does not deposit ETH onchain, so users rely on Binance's accounting and custody.

![wBETH deposit and minting flow](/images/architecture/wbeth-deposits.png#center)

### Exchange rate

A Binance bot reports the ETH-per-{{symbol}} rate through a limiter currently allowing up to {{rateCapPercent}} of cumulative change over {{rateCapInterval}}. The contracts do not derive this rate from validator balances. Binance can reconfigure or replace the oracle immediately, bypassing the limit.

### Redeeming

Holders burn {{symbol}} at the reported rate to join an onchain ETH redemption queue. Claims are delayed by {{lockTime}}. The operator can change the delay but not below {{minLockTime}}. A claim is paid only after Binance funds and allocates enough ETH. Pausing or blacklisting can prevent requests or claims.

![wBETH exchange rate and withdrawal flow](/images/architecture/wbeth-withdrawals.png#center)

### Governance

Governance is centralized in Binance-controlled EOAs. They can move ETH, mint {{symbol}}, change the rate and operational roles, pause or blacklist users, and upgrade all three upgradeable contracts without delay.
