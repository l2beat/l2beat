Generated with discovered.json: 0x72e7f26ba26fbb0f3b57875c150d434325c29e00

# Diff at Fri, 20 Sep 2024 06:58:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3a7b22972e46f62825af8fb5cf9c7cfae5b267c0 block: 20735735
- current block number: 20790161

## Description

Vector proxy verified.

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
