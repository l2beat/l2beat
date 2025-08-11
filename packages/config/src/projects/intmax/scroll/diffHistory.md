Generated with discovered.json: 0x40cdd85ceb684d62332ada750e1f11a2eac6b24b

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0xfea1029ed46c0758c6e6cb976d43a4fde0b82b81

# Diff at Tue, 05 Aug 2025 07:17:58 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378270

## Description

Added descriptions.

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
