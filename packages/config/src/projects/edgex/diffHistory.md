Generated with discovered.json: 0x457f760bd58e7157b21d2b9ff44ee85830b64944

# Diff at Mon, 13 Oct 2025 15:14:12 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1760351153

## Description

Init discovery of EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582)
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
```

```diff
+   Status: CREATED
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e)
    +++ description: DAC that allows admin adding new members, unless isFinalized is set to true. List of admins is not discoverable, so it is not in the fields of this contract.
```

```diff
+   Status: CREATED
    reference SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562)
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PerpetualEscapeVerifier (eth:0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD)
    +++ description: Special verifier for the escape() function.
```

```diff
+   Status: CREATED
    contract TransferRegistry (eth:0xBE9a129909EbCb954bC065536D2bfAfBd170d27A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgeXDepositor (eth:0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5)
    +++ description: This smart contract implements a deposit wrapper that allows users deposit arbitrary tokens into EdgeX. Underlying logic swaps given tokens into USDT via a 1inch aggregation router and deposits USDT under user's starkKey into StarkPerpetual. This contract also defines withdrawals that are not connected with StarkPerpetual, so users must withdraw on StarkPerpetual contract.
```

```diff
+   Status: CREATED
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD)
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```
