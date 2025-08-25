Generated with discovered.json: 0x65bf705945a876349908fe3269eeadd2c58a602e

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

config: ignore some vals in watch mode, add description for contribution contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0xd910381437ce057b4a96883cad106762af7ca351

# Diff at Tue, 05 Aug 2025 07:17:57 GMT:

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
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E) {
    +++ description: Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS.
      description:
+        "Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS."
    }
```

```diff
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      description:
+        "Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check."
    }
```

Generated with discovered.json: 0xbba2961125fdd21445f0710fd366f0c2125562df

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (0x38f6001e8ac11240f903CBa56aFF72A1425ae371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7153803C06d6a36D6d91aEB3C1ed8e5b934Df601)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 1 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 3 (0xe147e23753505e2C83b5f9ef229a9B7e7B3F50Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PredicateServiceManager (0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2)
    +++ description: None
```
