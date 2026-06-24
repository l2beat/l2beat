Generated with discovered.json: 0x388e4c6a4377db7bf19476d39ab0d20f334e4e47

# Diff at Wed, 24 Jun 2026 12:07:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1782302763

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit]
    +++ description: Tracks and enforces homomorphic computation unit limits for FHEVM operation requests.
```

```diff
+   Status: CREATED
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier]
    +++ description: Verifies KMS signatures over public decryption results before those results are accepted onchain.
```

```diff
+   Status: CREATED
    contract USD Coin Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) [tokens/circle/USDC]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract PauserSet (eth:0xbBfE1680b4a63ED05f7F80CE330BED7C992A586C) [zama/ZamaPauserSet]
    +++ description: Maintains the pauser account set used in pause-control checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigB (eth:0xBc860b6a4C860C5424B84A056E53ACFb2C99a38F) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract ACL (eth:0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6) [zama/ZamaACL]
    +++ description: Access-control registry for encrypted handles, storing handle allowances and delegation state for ciphertext references.
```

```diff
+   Status: CREATED
    contract InputVerifier (eth:0xCe0FC2e05CFff1B719EFF7169f7D80Af770c8EA2) [zama/ZamaInputVerifier]
    +++ description: Verifies signed encrypted input bundles before they are accepted as ciphertext handles.
```

```diff
+   Status: CREATED
    contract FHEVMExecutor (eth:0xD82385dADa1ae3E969447f20A3164F6213100e75) [zama/ZamaFHEVMExecutor]
    +++ description: FHEVM executor that accepts encrypted operation requests, accounts for computation usage, and stores ciphertext handles for operation results.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract ConfidentialUSDCWrapper (eth:0xe978F22157048E5DB8E5d07971376e86671672B2) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and underlying-token denylist checks.
```
