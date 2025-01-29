Generated with discovered.json: 0xdebbc5e77f619631ba0dcbf6f16a4ea100053075

# Diff at Wed, 29 Jan 2025 15:52:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21730951

## Description

Initial Discovery: Standard TokenBridge validated by 6/8 Validators and secured by a 3/4 Multisig.

## Initial discovery

```diff
+   Status: CREATED
    contract ValidatorsRegistry (0x72965045A6691E5A74299D1e878f303264D4D910)
    +++ description: Registry of the current validator set. Validators can have different weights and be changed on each state update (signed by the current validators).
```

```diff
+   Status: CREATED
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SonicGatewayOpsMultisig (0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MPTProofVerifier (0x921B147a90Ef738BBb7c2c89D88ea9d8Af3e9306)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SonicGatewayMultisig (0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20)
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
```

```diff
+   Status: CREATED
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4)
    +++ description: Entry point for state (oracle) updates.
```

```diff
+   Status: CREATED
    contract StateOracle (0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4)
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
```
