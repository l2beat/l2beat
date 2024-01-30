Generated with discovered.json: 0x3302e4ba6cac61c151ac35627e4c8bdfe701eebe

# Diff at Fri, 26 Jan 2024 10:56:26 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19061375
- current block number: 19090321

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19061375 (main branch discovery), not current.

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0x0d84b992f8771a97aab0e3b0217bb0556c350a83

# Diff at Mon, 22 Jan 2024 09:26:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 19040782
- current block number: 19061375

## Description

L2 Block gas limit decreased, but still increased from the previous 30000000.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.gasLimit:
-        100000000
+        50000000
    }
```

# Diff at Fri, 19 Jan 2024 12:03:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a25b693cc3754074753705b502d4656fdd29ecbb block: 18927709
- current block number: 19040782

## Description

L2 Block gas limit increased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.gasLimit:
-        30000000
+        100000000
    }
```

# Diff at Wed, 03 Jan 2024 15:26:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been increased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        166667
+        333333
    }
```

# Diff at Tue, 19 Dec 2023 14:23:07 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a5f45641c9d10d62e395e1cd088a79446ab63c09

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        700000
+        166667
    }
```

# Diff at Thu, 30 Nov 2023 10:07:56 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@d4d01e687218065c65077f4e7616188f47938ed3

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.scalar:
-        1000000
+        700000
    }
```

# Diff at Fri, 17 Nov 2023 12:11:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

System configuration parameters used for L2 fee calculation have been decreased:

- overhead: 2100 -> 1000
- scalar: 1300000 -> 1000000

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.overhead:
-        2100
+        1000
      values.scalar:
-        1300000
+        1000000
    }
```

# Diff at Mon, 02 Oct 2023 13:46:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract ProxyAdmin (0xa2DCa85BB892De55D8B262d1806114733106e8D1) {
      values.owner:
-        "0x4b1A788B20bb85eb19f8e9B69B8a584e7fA29fe5"
+        "0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0x3c46C05c2eba8eDd0B0f0C8B1D2fBf9fc53ea01E) {
    }
```

# Diff at Tue, 26 Sep 2023 10:12:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x30c789674ad3B458886BBC9abf42EEe19EA05C1D) {
      values.deletedOutputs:
+        []
    }
```

# Diff at Wed, 20 Sep 2023 14:08:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@baff89f527efcf9b2e09db38bebde3bbd142837c

## Watched changes

```diff
    contract SystemConfig (0x895E00269A05848F3c9889EfA677D02fF7351a5D) {
      values.batcherHash:
-        "0x000000000000000000000000a76e31d8471d569efdd3d95d1b11ce6710f4533f"
+        "0xA76E31D8471D569EfDd3D95d1b11Ce6710f4533F"
      derivedName:
+        "SystemConfig"
    }
```
