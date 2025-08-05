Generated with discovered.json: 0x81a5cd7598e02382dfccc9276617272e3ada4aa9

# Diff at Tue, 05 Aug 2025 07:14:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378050

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e) {
    +++ description: Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract.
      values.depositIndex:
-        6523
+        6651
      values.depositTreeRoot:
-        "0x9b023e3f7aa1506627d5916156dff4c621df3646e0b7ae0512b375b520c4f3e5"
+        "0x341374c06925c6fe07caaba3fb027676e648d51e26eb526c8d403b219eff444c"
      values.getLatestBlockNumber:
-        6973
+        7185
      values.lastProcessedDepositId:
-        6523
+        6651
    }
```

```diff
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5) {
    +++ description: None
      values.getCurrentPeriod:
-        44
+        45
      values.nullifierNonce:
-        1956
+        1998
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754295529 (main branch discovery), not current.

```diff
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e) {
    +++ description: Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract.
      description:
+        "Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract."
    }
```

```diff
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      description:
+        "Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals."
    }
```

Generated with discovered.json: 0x6d973104ebb03d14919aea82bf28f2d88044c16a

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract WithdrawalPlonkVerifier (0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 2 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ClaimPlonkVerifier (0xaBA5fD516B665C12d7577Db36831474ac16aEe0a)
    +++ description: None
```
