Generated with discovered.json: 0x7bba8c42406ddf92dd8b6735aa4a4ecd85ffeb3d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x12628108a8589b1512a709dd1fd11a662fb2cd34

# Diff at Mon, 28 Jul 2025 06:06:56 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 21285557
- current block number: 23015739

## Description

New owner proposed.

archive disco (this is connect - legacy which is long archived).

## Watched changes

```diff
    contract TransactionManager (0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09) {
    +++ description: None
      values.proposed:
-        "eth:0x0000000000000000000000000000000000000000"
+        "eth:0xed7c5FEfE0790DB355b0316F41269006ecd87653"
      values.proposedTimestamp:
-        0
+        1753521239
    }
```

Generated with discovered.json: 0x97d2ac286bdd00c7718d87d12c3101c9f5b09e77

# Diff at Mon, 14 Jul 2025 12:44:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21285557
- current block number: 21285557

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285557 (main branch discovery), not current.

```diff
    EOA  (0x155B15a7e9Ff0e34cEaF2439589D5C661ADC9493) {
    +++ description: None
      address:
-        "0x155B15a7e9Ff0e34cEaF2439589D5C661ADC9493"
+        "eth:0x155B15a7e9Ff0e34cEaF2439589D5C661ADC9493"
    }
```

```diff
    contract TransactionManager (0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09) {
    +++ description: None
      address:
-        "0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09"
+        "eth:0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09"
      values.interpreter:
-        "0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a"
+        "eth:0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a"
      values.owner:
-        "0x155B15a7e9Ff0e34cEaF2439589D5C661ADC9493"
+        "eth:0x155B15a7e9Ff0e34cEaF2439589D5C661ADC9493"
      values.proposed:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09:
-        "TransactionManager"
      implementationNames.eth:0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09:
+        "TransactionManager"
    }
```

```diff
    contract FulfillInterpreter (0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a) {
    +++ description: None
      address:
-        "0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a"
+        "eth:0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a"
      values.getTransactionManager:
-        "0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09"
+        "eth:0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09"
      implementationNames.0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a:
-        "FulfillInterpreter"
      implementationNames.eth:0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a:
+        "FulfillInterpreter"
    }
```

```diff
+   Status: CREATED
    contract TransactionManager (0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FulfillInterpreter (0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a)
    +++ description: None
```

Generated with discovered.json: 0x8029232daad544a77b161b4a5fefbbee2ae9698d

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21285557
- current block number: 21285557

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285557 (main branch discovery), not current.

```diff
    contract TransactionManager (0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09) {
    +++ description: None
      sinceBlock:
+        13548432
    }
```

```diff
    contract FulfillInterpreter (0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a) {
    +++ description: None
      sinceBlock:
+        13548432
    }
```

Generated with discovered.json: 0x77d20bee381b4412c296d4815718f24895dad59e

# Diff at Mon, 14 Oct 2024 10:50:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 17129653
- current block number: 17129653

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17129653 (main branch discovery), not current.

```diff
    contract TransactionManager (0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09) {
    +++ description: None
      sourceHashes:
+        ["0x5a10f30a0039faccfa89f130d4f1114d81bb965bf1e050e64d2806982289ad52"]
    }
```

```diff
    contract FulfillInterpreter (0x5b9E4D0Dd21f4E071729A9eB522A2366AbeD149a) {
    +++ description: None
      sourceHashes:
+        ["0xd97bc069bf47ba9568177032f0a27cb51ad0564b0a2c9480fdcd09f5e3dff02d"]
    }
```

