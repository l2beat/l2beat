Generated with discovered.json: 0x4e0056f24bc34f386e47c1093b1bb8285d08196f

# Diff at Fri, 12 Apr 2024 09:02:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19638502

## Description

Orbit stack chains with the additional functionality that ewETH is used as the native asset which is minted when ETH is deposited into Lido using the Edgeless Deposit contract. For each token an investing strategy can be defined. Currently there's only the one for ETH that stakes on Lido. To withdraw, there has to be enough ETH funds in the escrow. If not, the max possible would be withdrawn and the operator has to request and finalize the withdrawal from Lido and then the rest can be withdrawn. The strategies are permissioned and can be changed at any moment.

## Initial discovery

```diff
+   Status: CREATED
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7)
    +++ description: None
```
