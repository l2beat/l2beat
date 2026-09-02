{{symbol}} (Wrapped Binance Beacon ETH) is the on-chain form of Binance's ETH staking product. On the exchange, staked ETH is credited as BETH, a 1:1 balance that pays rewards as more BETH; {{symbol}} is the reward-accruing wrapper of that balance, and one {{symbol}} is redeemable for a growing amount of ETH. The exchange rate started at 1 on 27 April 2023 and reads {{exchangeRate}} ETH per {{symbol}} today. {{totalSupply}} {{symbol}} are outstanding.

The contracts are small and the trust model is short: the code enforces very little, and Binance's keys and off-chain operations do the rest. Everything below is what the code does and does not bind.

### Contract layout

Three contracts on Ethereum, all controlled by Binance keys. The token is a proxy in the Circle FiatToken pattern (`FiatTokenProxy`, ZeppelinOS admin slot) whose implementation, `WrapTokenV3ETH`, extends `FiatTokenV2_1` with a staking layer. The redemption queue, `UnwrapTokenV1ETH`, is a second proxy behind the same admin key. The oracle, `ExchangeRateUpdater`, is a small non-upgradeable relay that the token trusts to write the exchange rate. A fourth contract, Binance's `OperatorWallet`, is the token's only configured minter; nothing on-chain points to it, so it was found through the token's `MinterConfigured` event and seeded by hand.

There is no beacon-chain deposit contract in the graph, no withdrawal-credential contract and no accounting contract for validators. The staking itself happens from Binance-controlled addresses and is not visible to any of the three contracts.

### Depositing on-chain

`WrapTokenV3ETH.deposit(referral)` is open to anyone and mints `msg.value × 1e18 / exchangeRate()` tokens to the caller. It reverts while the token is paused or if the caller is blacklisted, and there is no minimum, cap or fee. The ETH lands in the token contract and stays there until `moveToStakingAddress(amount)`, which is `onlyOperator` and forwards any amount to `ethReceiver()`; the operator can also route it to the redemption queue with `moveToUnwrapAddress(amount)`. Both the operator and the receiver are plain addresses set by the owner.

Since launch, on-chain deposits account for a small fraction of the supply: about 26,000 ETH has entered through `deposit()`, and about 24,000 ETH of it has been moved out to the `ethReceiver`. The receiver is an account set by Binance's owner key that has forwarded everything it received to a Binance exchange hot wallet, and the withdrawal-credential address of roughly ninety thousand validators (about 3.9M ETH deposited cumulatively, across all of Binance's ETH staking) drains into the same receiver, so validator rewards travel the same hop. None of this is enforced by the contracts, and that the accounts are Binance's is inferred from the flow pattern and the exchange wallet's public label; it is what the transaction history shows.

### Minting on the exchange

`StakedTokenV3.mint(amount)` is `onlyMinters` and mints to `msg.sender` up to the caller's `minterAllowed` balance; the inherited `mint(to, amount)` does the same to any address. Neither takes ETH. {{minterCount}} minter is configured, Binance's `OperatorWallet`, with an allowance of 2^256 − 1 set by the master minter at deployment. That wallet's `mint(token, recipient, amount)` is `onlyOperatorAndOwner` and may send the minted tokens only to itself or to one of {{hotWalletCount}} registered exchange hot wallets; the wallet's owner can also route around that check through `execTransaction`. This is how users who wrap BETH on the exchange receive {{symbol}} they can withdraw, and it has produced more than 99% of all tokens ever minted.

The consequence is that the {{symbol}} supply is not backed by ETH in any contract. It is backed by Binance's statement that an equal amount of BETH is held against it and that BETH is backed by validators Binance runs. The token contract can verify none of that; it only checks the minter's allowance, which is effectively unlimited.

![wBETH deposit and minting flow](/images/architecture/wbeth-deposits.png#center)

### The exchange rate

`exchangeRate()` is one storage slot. `updateExchangeRate(newRate)` is `onlyOracle` and requires only `newRate >= 1e18`; the token does not compare the new value with the old one, does not check a timestamp, and reads no balance anywhere. `deposit()` and `requestWithdrawEth()` both use whatever the slot holds.

The registered oracle is `ExchangeRateUpdater`, a relay with a whitelist of {{oracleCallerCount}} caller. Its `updateExchangeRate` is `onlyCallers`, computes the absolute change against the current rate, and requires it to be within the caller's remaining allowance. The allowance is {{rateCapPercent}} of one ETH per {{rateCapInterval}} and refills linearly with time, so the caller can move the rate up or down by that much in total over the period, in as many steps as it likes. That is the only bound on the rate anywhere in the system. The whitelisted caller is the same externally owned account that serves as the token's operator, and it has written the rate roughly once a day since launch, always upward, by a few thousandths of a percent.

The bound is not durable. `updateOracle(newOracle)` on the token is `onlyOwner` and takes effect immediately, so the owner key can point the token at any address and write any rate at or above 1e18 in a single transaction. The oracle's own owner, the same key, can also reconfigure the whitelist and allowance with `configureCaller` at any time.

Nothing derives the rate from validators. It is Binance's daily statement of the BETH:{{symbol}} ratio, relayed on-chain by a bot.

### Redeeming

`WrapTokenV3ETH.requestWithdrawEth(wbethAmount)` is open to any holder. It computes `ethAmount = wbethAmount × exchangeRate() / 1e18`, burns the tokens, and calls `UnwrapTokenV1ETH.requestWithdraw`, which is `onlyWrapTokenAddress`, to record a claim for that amount. The claim is paid by `claimWithdraw(index)` once three conditions hold: at least `lockTime` ({{lockTime}}; the operator can change it, with a floor of {{minLockTime}}, and it stood at 60 days for part of late 2025) has passed since the request; the claim has been allocated, which happens automatically on request if the queue already held enough ETH and the request is at the head of the line, and otherwise only when the operator calls `allocate()`; and the contract's ETH balance covers it. The queue holds no ETH of its own. Only ETH sent by the token operator or the `rechargeAddress` counts toward allocation, and the operator can move any surplus back out with `moveToBackAddress`.

So the redemption path is contractual in form and discretionary in substance. Any holder who is not blacklisted can, while the token is not paused, burn and record a claim, but whether and when ETH arrives to pay it depends on Binance's operator keeping the queue funded. `claimWithdraw` also reverts while the queue is paused or the claimant is blacklisted. {{claimsRecorded}} claims have been recorded in the queue's lifetime; most redemption happens on the exchange rather than through this contract.

![wBETH exchange rate and withdrawal flow](/images/architecture/wbeth-withdrawals.png#center)

### The keys

Discovery finds no multisig, timelock or governance contract. Every role resolves to an externally owned account, and {{adminKeyPhrase}}. Those roles let it:

- pause the token (`Pausable.pause`, `onlyPauser`), which stops transfers, `deposit()` and `requestWithdrawEth()` at once, and pause the queue, which stops `claimWithdraw`;
- blacklist any address on either contract (`Blacklistable.blacklist`, `onlyBlacklister`), freezing that holder's tokens and claims;
- configure minters and allowances (`configureMinter`, `onlyMasterMinter`), so any address can be made able to mint unbacked {{symbol}};
- replace the oracle, operator and `ethReceiver` (`updateOracle`, `updateOperator`, `updateEthReceiver`, `onlyOwner`), which together give it the exchange rate and every ETH the token contract holds;
- rewrite the oracle relay's whitelist and allowance (`RateLimit.configureCaller`, `onlyOwner`).

Separately, {{upgradePhrase}}: `FiatTokenProxy.upgradeTo` is `ifAdmin` with no delay, and the implementation has been replaced twice (September 2023 and November 2024). An upgrade can change any of the above, including the `>= 1e18` floor on the rate and the burn path. The minting wallet has its own owner, operator and proxy admin, also externally owned accounts.

### What the code does not guarantee

Nothing in the contracts ensures that {{symbol}} is backed by ETH, that the exchange rate reflects validator balances, or that a redemption claim is ever funded. Nothing prevents the owner key from minting, freezing, repricing or moving the contract's ETH at will, and nothing delays it. What the code does fix is small: the rate cannot drop below 1e18 without an upgrade; the rate-limiting relay caps a single bot's drift to {{rateCapPercent}} per {{rateCapInterval}} for as long as the owner leaves it in place; the redemption lock cannot be set below {{minLockTime}}; and tokens the exchange wallet's operator mints can only go to registered hot wallets. Holding {{symbol}} is, in practice, holding a claim on Binance.
