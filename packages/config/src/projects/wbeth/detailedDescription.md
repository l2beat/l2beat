{{symbol}} (Wrapped Binance Beacon ETH) is the onchain form of Binance's ETH staking product. On the exchange, staked ETH is credited as BETH, a 1:1 balance that pays rewards as more BETH; {{symbol}} is the reward-accruing wrapper of that balance, and one {{symbol}} is redeemable for a growing amount of ETH. 

### Contract layout

All contracts on Ethereum are controlled by Binance keys. The oracle, `ExchangeRateUpdater`, is a small non-upgradeable relay that the token trusts to write the exchange rate. 
The staking itself happens from Binance-controlled addresses and is not visible through onchain {{symbol}} contracts.

### Depositing onchain

Deposit is open to anyone and mints tokens to the caller based on the current exchange rate. It reverts while the token is paused or if the caller is blacklisted. There is no minimum, cap or fee. The ETH lands in the token contract and stays there until `moveToStakingAddress(amount)`, which is `onlyOperator` and forwards any amount to the `ethReceiver` address; the operator can also route it to the redemption queue with `moveToUnwrapAddress(amount)`. Both the operator and the receiver are plain addresses set by the owner.

The `ethReceiver` is an account set by Binance's owner key that forwards everything it receives to a Binance exchange hot wallet. There is a dedicated withdrawal-credential address that transfers beacon chain ETH into the same receiver, so validator rewards travel the same path to be restaked. None of these roles are enforced by the contracts, and that the accounts are Binance's is inferred from the flow pattern and the exchange wallet's public label.

### Minting on the exchange

The `OperatorWallet` contract is configured as a minter (with other {{minterCount}} minters) with an unlimited allowance. Its mint(token, recipient, amount) is `onlyOperatorAndOwner` and restricts the recipient to the OperatorWallet contract itself or one of {{hotWalletCount}} registered hot wallets; the wallet's owner can bypass that restriction. Tokens minted this way are backed by balances on the exchange, not by ETH in any contract, and account for the bulk of the {{symbol}} supply. 

The consequence is that the {{symbol}} supply is not backed by ETH in any contract. It is backed by Binance's statement that an equal amount of BETH is held against it and that BETH is backed by validators Binance runs. The token contract can verify none of that; it only checks the minter's allowance, which is effectively unlimited.

![wBETH deposit and minting flow](/images/architecture/wbeth-deposits.png#center)

### The exchange rate

The registered oracle is `ExchangeRateUpdater`, a relay with a whitelist of {{oracleCallerCount}} caller. Its `updateExchangeRate` is `onlyCallers`, computes the absolute change against the current rate, and requires it to be within the caller's remaining allowance. The allowance is {{rateCapPercent}} of one ETH per {{rateCapInterval}} and refills linearly with time, so the caller can move the rate up or down by that much in total over the period, in as many steps as it likes. That is the only bound on the rate anywhere in the system. 

The oracle can be updated by the owner through `updateOracle(newOracle)` and takes effect immediately, so the owner key can point the token at any address and write any rate at or above 1e18 in a single transaction. The oracle's own owner, the same key, can also reconfigure the whitelist and allowance with `configureCaller` at any time.

Nothing derives the rate from validators. It is Binance's daily statement of the BETH:{{symbol}} ratio, relayed onchain by a bot.

### Redeeming

Redeeming is open to any holder through the `WrapTokenV3ETH.requestWithdrawEth(wbethAmount)` function. It computes the redeeamble ethAmount based on the exchange rate, burns the tokens, and calls `UnwrapTokenV1ETH.requestWithdraw` to record a claim for that amount. The claim is paid by `claimWithdraw(index)` once three conditions hold: at least `lockTime` ({{lockTime}}; the operator can change it, with a floor of {{minLockTime}}) has passed since the request; the claim has been allocated, which happens automatically on request if the queue already held enough ETH and the request is at the head of the line, and otherwise only when the operator calls `allocate()`; and the contract's ETH balance covers it. The queue holds no ETH of its own. Only ETH sent by the token operator or the `rechargeAddress` counts toward allocation, and the operator can move any surplus back out with `moveToBackAddress`.

So the redemption path allows any holder who is not blacklisted to burn and record a claim (while the token is not paused), but whether and when ETH arrives to pay it depends on Binance's operator keeping the queue funded. `claimWithdraw` also reverts while the queue is paused or the claimant is blacklisted. {{claimsRecorded}} claims have been recorded in the queue's lifetime; most redemption happens on the exchange rather than through this contract.

![wBETH exchange rate and withdrawal flow](/images/architecture/wbeth-withdrawals.png#center)

### Governance
There is no governance: no multisig, timelock or DAO. Every role is an externally owned account, and {{adminKeyPhrase}}. That key can, with no delay, pause the token and the redemption queue, blacklist any holder, add minters that create unbacked {{symbol}}, replace the oracle, operator and ethReceiver, and rewrite the rate limiter.
