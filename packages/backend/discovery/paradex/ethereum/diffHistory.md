Generated with discovered.json: 0xb15a2532273ec56424a924c846c951de4ee51aaf

# Diff at Thu, 11 Jan 2024 12:24:29 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f4fd8a33866a1a7eab89875fb7e0473f7609e88b block: 18941335
- current block number: 18983662

## Description

The program hash is updated (with tx 0x4dc1b43e0b932f665a95af3d2cb61f280a1b7a63f7464b3b27edfde5d183bd8a).

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.programHash:
-        "3258367057337572248818716706664617507069572185152472699066582725377748079373"
+        "54878256403880350656938046611252303365750679698042371543935159963667935317"
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18941335 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
      name:
-        "GnosisSafe"
+        "ParadexImplementationGovernorMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Fri, 05 Jan 2024 13:21:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@93d6aaf3e23d92ddfefa09b5758d1e10c888e66a block: 18812636
- current block number: 18941335

## Description

A new Starknet governor (2/5 MultiSig) is added to the Paradex contract.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.governors[1]:
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    }
```

## Source code changes

```diff
.../.code/GnosisSafe/implementation/GnosisSafe.sol | 422 +++++++++++++++++++++
 .../GnosisSafe/implementation/base/Executor.sol    |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../GnosisSafe/implementation/common/Enum.sol      |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../GnosisSafe/implementation/common/Singleton.sol |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../.code/GnosisSafe/implementation/meta.txt       |   2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     | 155 ++++++++
 .../ethereum/.code/GnosisSafe/proxy/meta.txt       |   2 +
 18 files changed, 1233 insertions(+)
```

# Diff at Mon, 18 Dec 2023 11:40:25 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@636723aa928b9ac461db31dd0b5005a916961be5

## Description

Change in the deposit limits of the USDC Bridge contract:

- The maximum amount per deposit is increased to 500K USDC
- The maximum amount that can be locked across all users is increased to 10M USDC

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
      values.maxDeposit:
-        200000000000
+        500000000000
      values.maxTotalBalance:
-        5000000000000
+        10000000000000
    }
```

# Diff at Tue, 31 Oct 2023 10:57:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    }
```

```diff
+   Status: CREATED
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    }
```
