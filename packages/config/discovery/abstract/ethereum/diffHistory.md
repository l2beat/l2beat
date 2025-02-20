Generated with discovered.json: 0xed65e73dc0702fb1ce1dd6bad5b98b9068596ca5

# Diff at Tue, 04 Feb 2025 12:30:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766582
- current block number: 21766582

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x674c6922ca8e75284a49d609c7a653e7fd981967

# Diff at Mon, 03 Feb 2025 14:33:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21721728
- current block number: 21766582

## Description

[ZIP-002] 'Reduce the execution delay from 21 hours to 3 hours' executed.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      description:
-        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h."
+        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h."
      values.executionDelay:
-        75600
+        10800
      values.executionDelay_fmt:
-        "21h"
+        "3h"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21721728 (main branch discovery), not current.

```diff
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x2fd072c69ab58c22ba7eb15cfd5ffa2ac2254fb0d049d065ad3bad87f16948f2","expirationTimestamp":1737973871,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x462241a0f97be04c623bbc09f1d40025f82626b6

# Diff at Tue, 28 Jan 2025 08:21:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21721728

## Description

Initial discovery: ZK stack rollup on known protocol version 25 (latest) contracts with ETH as gasToken. TxFilterer not deployed.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract AbstractZkEvm (0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9)
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

```diff
+   Status: CREATED
    contract AbstractChainAdminMultisig (0x7F3EaB9ccf1d8B9705F7ede895d3b4aC1b631063)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainAdmin (0xA1f75f491f630037C4Ccaa2bFA22363CEC05a661)
    +++ description: None
```
