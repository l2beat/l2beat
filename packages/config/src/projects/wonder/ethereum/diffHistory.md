Generated with discovered.json: 0x15827362a071612e2061624913f3bbe4c6e9b971

# Diff at Tue, 27 May 2025 15:26:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22574842

## Description

Initial discovery of a standard zk stack validium.

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
    contract Safe (0x4665ad531c35b02dE090E21FC57B69946434bf2b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract Safe (0x5e6C5551C1b0626e9061fD4Daca6DA866Fd405aC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x9381D943BcC1254723F85E9A85FFcc4Bb3C8deF6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1VerifierPlonk (0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e)
    +++ description: Verifies a zk-SNARK proof using an implementation of the PlonK proof system.
```

```diff
+   Status: CREATED
    contract zkVmDiamond (0xC8C4cB5AF7c723c7EfD360898B47920679f92C92)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```
