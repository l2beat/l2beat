Generated with discovered.json: 0xa3c5a2d76a5b4b32986ab4385619bf23a04db567

# Diff at Wed, 02 Oct 2024 14:22:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871625
- current block number: 20878383

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871625 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-04T21:23:47.000Z",["0x2434564f3524b44258B11643729343Ef57D60989"]],["2024-07-20T01:29:35.000Z",["0xc6217f1549Cab6f22ac4AC56d42e6C248731a33D"]]]
    }
```

Generated with discovered.json: 0x62904dc488f9c12751a30fa4fc056944696bdb3a

# Diff at Tue, 01 Oct 2024 15:45:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20735735
- current block number: 20871625

## Description

Vector proxy verified. New verifier.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 ...0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol} |    0
 2 files changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      unverified:
-        true
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x6439fce17e3e9e6443d267d35aba6c3a3f3ca927

# Diff at Fri, 13 Sep 2024 08:14:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@db4bedcf90d9785b74ad29fd9c12386741eb1cd5 block: 20735735
- current block number: 20735735

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735735 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xDEd0000E32f8F40414d3ab3a830f735a3553E18e","0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666"]}}
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x7F2f87B0Efc66Fea0b7c30C61654E53C37993666)
    +++ description: None
```

Generated with discovered.json: 0xc436404d20a195a814b6beef4caade0ec87eee63

# Diff at Thu, 12 Sep 2024 16:30:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20735125
- current block number: 20735735

## Description

Update config to fetch relayers, ignore noisy values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20735125 (main branch discovery), not current.

```diff
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d) {
    +++ description: None
      values.isRelayerApproved:
+        true
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "succinct/SP1Vector"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SuccinctGatewaySP1Multisig"
    }
```

Generated with discovered.json: 0x34e799459a1f0f40298882ee5a06293de6b3511b

# Diff at Thu, 12 Sep 2024 14:28:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20735125

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Vector (0x02993cdC11213985b9B13224f3aF289F03bf298d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier_OLD (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
