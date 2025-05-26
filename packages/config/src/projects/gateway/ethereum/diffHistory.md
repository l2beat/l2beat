Generated with discovered.json: 0x7cbcae303e33eb7b7bf42a93ab4f08f50b691260

# Diff at Mon, 26 May 2025 10:02:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22566193

## Description

initial discovery of the gateway rollup: future settlement layer for zksync

## Initial discovery

```diff
+   Status: CREATED
    contract DualVerifier (0x079004D9C534Ff1dC3414F5dB31B4a0a1F4fc9d0)
    +++ description: A router contract for verifiers. Routes verification requests to 0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF or 0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e depending on the supplied proof type.
```

```diff
+   Status: CREATED
    contract L1VerifierFflonk (0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF)
    +++ description: Verifies a zk-SNARK proof using an implementation of the fflonk proof system.
```

```diff
+   Status: CREATED
    contract DiamondProxy (0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions. isPermanentRollup was set to true in this contract which prevents changing the DA mode to Validium in the future.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract InitiialGatewayTransactionFilterer (0x9B30061D077476a8B7e1b68c3da844Ed5FdE0432)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract ChainAdminOwnable (0xFe94B8AEB7950a26C276EA615a6d3C7289Fd2ac3)
    +++ description: None
```
