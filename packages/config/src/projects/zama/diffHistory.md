Generated with discovered.json: 0x932de52e6ba4cf577e86c1ff30233783570eb622

# Diff at Fri, 26 Jun 2026 14:52:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1782485499

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ZamaGovMemberDAO (eth:0x31bBD7a242A38372DE92CA304fE29C12C90A382C) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract HCULimit (eth:0x3b4da65e45Fda2CAa0285A735ab4361a44F171E2) [zama/ZamaHCULimit]
    +++ description: Tracks and enforces homomorphic computation unit limits for FHEVM operation requests.
```

```diff
+   Status: CREATED
    EOA  (eth:0x4202860Fa6afAF3e2977cD139Ac693a05e4f9450)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialSteakcUSDCWrapper (eth:0x66Bf74E96900D1a19c7070D939D124f2F565C458) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x69E55790880d0ABa56E48Ee1f7fc3834b0F5c223) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Staking (Coprocessor) (eth:0x7147485b892158f2B875f7aC5Ea48A9937C66AE8) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialXAUTWrapper (eth:0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract KMSVerifier (eth:0x77627828a55156b04Ac0DC0eb30467f1a552BB03) [zama/ZamaKMSVerifier]
    +++ description: Verifies KMS signatures over public decryption results before those results are accepted onchain.
```

```diff
+   Status: CREATED
    contract ConfidentialZAMAWrapper (eth:0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialBRONWrapper (eth:0x85dE671c3bec1aDeD752c3Cea943521181C826bc) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8c0E2c46F96756C49DBd6723F4C57a03a254B4B0) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x97E18544e156724E4076945F10c288ecBBC94e54) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialTGBPWrapper (eth:0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ConfidentialUSDTWrapper (eth:0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract DAO (eth:0xB6D69D5F334d8B97B194617B53c6aB62f8681Ef3) [zama/ZamaDAO]
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
```

```diff
+   Status: CREATED
    contract ConfidentialBbqTGBPWrapper (eth:0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
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
    contract ConfidentialWETHWrapper (eth:0xda9396b82634Ea99243cE51258B6A5Ae512D4893) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract ZamaGovMultisigA (eth:0xE43c73aAb2b6aBBad6d0461997ce1cfea5ABe66f) [zama/Multisig]
    +++ description: Aragon multisig plugin for creating proposals and collecting approvals against a configurable threshold.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xE53e32a669357Ab0360103d8f294812B914AF9e4) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfidentialUSDCWrapper (eth:0xe978F22157048E5DB8E5d07971376e86671672B2) [zama/ConfidentialWrapperV3]
    +++ description: ERC-20 wrapper that escrows an underlying token and issues confidential balances. It supports encrypted transfers, wrapping, unwrapping, local blocking, and optional underlying-token denylist checks.
```

```diff
+   Status: CREATED
    contract Staking (KMS) (eth:0xe9b176CCaA8840DC3b3567bb83e2cD2a6c36F4Ab) [zama/ProtocolStaking]
    +++ description: Staking contract that escrows ZAMA, issues non-transferable staked voting tokens, and mints protocol rewards to eligible stakers at a configurable reward rate.
```

```diff
+   Status: CREATED
    contract ConfidentialTokenWrappersRegistry (eth:0xeb5015fF021DB115aCe010f23F55C2591059bBA0) [zama/ConfidentialTokenWrappersRegistry]
    +++ description: Registry for Zama confidential token wrappers.
```

```diff
+   Status: CREATED
    contract Decryption (zama:0x0f6024a97684f7d90ddb0fAAD79cB15F2C888D24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract InputVerification (zama:0xcB1bB072f38bdAF0F328CdEf1Fc6eDa1DF029287) [N/A]
    +++ description: None
```
