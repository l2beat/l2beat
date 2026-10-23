Generated with discovered.json: 0x0a246cfd097afec3c6b9f0d2f30636173427d13d

# Diff at Tue, 20 Oct 2026 16:20:58 GMT:

- id: 55eab8a8
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1792491622

## Description

Initial discovery of Coinbase's cbETH: the token, its rate-limited oracle relay and its rate-limited minting relay.

## Initial discovery

```diff
+   Status: CREATED
    contract MintForwarder (eth:0x6D44bfB8432d17882bB6e84652f5C3B36fcC8280) [cbeth/MintForwarder]
    +++ description: Rate-limited minting relay registered as a minter of the token. Whitelisted callers mint tokens to any address through it, each within an allowance that caps the amount per refill interval; the allowance refills linearly. No ETH is attached to a mint, so minted tokens are backed only by the issuer's off-chain records.
```

```diff
+   Status: CREATED
    contract ExchangeRateUpdater (eth:0x9b37180d847B27ADC13C2277299045C1237Ae281) [shared-wrapped-tokens/ExchangeRateUpdater]
    +++ description: Rate-limited relay registered as the token's oracle. Whitelisted callers write the exchange rate through it, and each caller has an allowance that caps the cumulative absolute change it may push; the allowance refills linearly over the caller's interval. Apart from the token's own minimum-value check, this is the only bound on the exchange rate, and the token owner can bypass it by repointing the oracle.
```

```diff
+   Status: CREATED
    contract cbETH (eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704) [cbeth/StakedTokenV1]
    +++ description: Value-accruing staked-ETH token (cbETH) built on Circle's FiatToken code with an exchange-rate layer on top. The contract has no deposit or redemption function and holds no ETH: supply changes only through mint() and burn() by configured minters, and the ETH-per-token exchange rate is a single storage value written by the oracle address, bounded only to be non-zero. Transfers, approvals, mints and burns revert while the token is paused or when either party is blacklisted.
```
