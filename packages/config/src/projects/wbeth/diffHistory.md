Generated with discovered.json: 0x52d5cab5d69f724dc42f9bc1363586161d38db86

# Diff at Sat, 29 Aug 2026 22:18:34 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1788041852

## Description

Initial discovery of Binance's wBETH: the token, its unwrap queue, the rate-limited oracle and the exchange-side minting wallet.

## Initial discovery

```diff
+   Status: CREATED
    contract UnwrapTokenV1ETH (eth:0x79973d557CD9dd87eb61E250cc2572c990e20196) [wbeth/UnwrapTokenV1ETH]
    +++ description: Redemption queue for wBETH. The token contract records a claim here when a holder burns wBETH; the claim becomes payable once ETH has been allocated to it (automatically on request if the queue already holds enough, otherwise by the operator) and the lock time of 10d has passed. Only ETH sent by the token operator or the rechargeAddress counts toward allocation; the contract has no way to pull ETH from validators. 134 claims have been recorded so far. The operator can also send any surplus ETH back to the ethBackAddress.
```

```diff
+   Status: CREATED
    contract ExchangeRateUpdater (eth:0x81720695e43A39C52557Ce6386feB3FAAC215f06) [wbeth/ExchangeRateUpdater]
    +++ description: Rate-limited relay that is the token's registered oracle. Whitelisted callers write the wBETH exchange rate through it, and each caller has an allowance that caps the cumulative absolute change it may push; the allowance refills linearly over the caller's interval. This is the only bound on the exchange rate anywhere in the system, and it can be bypassed by the token owner repointing the oracle.
```

```diff
+   Status: CREATED
    contract wBETH (eth:0xa2E3356610840701BDf5611a53974510Ae27E2e1) [wbeth/WrapTokenV3ETH]
    +++ description: Liquid staking token (wBETH) built on Circle's FiatToken code with a staking layer on top. Anyone can mint by sending ETH to deposit(), receiving ETH ÷ exchangeRate tokens; the ETH stays in this contract until the operator moves it to the ethReceiver. Redemption is requestWithdrawEth(): the tokens are burned at the current rate and an ETH claim is recorded in the unwrap contract. Neither path is open while the token is paused or the caller is blacklisted. The exchange rate is a single storage value written by the oracle address, bounded only to be at least 1e18. Configured minters can additionally mint tokens with no ETH backing, up to their allowance; 3175308537299494959722021 is the live supply.
```

```diff
+   Status: CREATED
    contract OperatorWallet (eth:0xb05a6449f383a1A43A172970858B97394FEcDAD6) [wbeth/OperatorWallet]
    +++ description: Binance's minting wallet. It is the only configured wBETH minter and its allowance is unlimited. Its operator or owner can mint wBETH to itself or to a registered hot wallet with no ETH deposited on-chain; this is how wBETH is issued to users who wrap BETH on the exchange, and it accounts for nearly all of the supply. The owner can also add hot wallets, pause the wallet, and execute arbitrary calls from it, which lets it mint to any address.
```
