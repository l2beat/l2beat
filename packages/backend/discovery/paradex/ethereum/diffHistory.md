Generated with discovered.json: 0x44eb161c66f4b404ab266f476c9ef78fac1b7823

# Diff at Thu, 28 Mar 2024 10:35:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19467601
- current block number: 19532051

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467601 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x55dc427d90067c7f872f6e28295faff5e1cf4097

# Diff at Tue, 19 Mar 2024 08:27:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@38751f18e662e502e9656add6b7ab03bb7fb62f8 block: 19433460
- current block number: 19467601

## Description

Program hash changed.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.programHash:
-        "109586309220455887239200613090920758778188956576212125550190099009305121410"
+        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
    }
```

Generated with discovered.json: 0x3ca3ccb9df16f0d2cc3faf50d40b7a4cdbc6be4b

# Diff at Thu, 14 Mar 2024 13:11:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19411688
- current block number: 19433460

## Description

Upgraded to the new implementation to support blobs - it's actually the same implementation used by Starknet so check its changelog for the changes. The program hash is also the same.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      upgradeability.implementation:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      upgradeability.proxyGovernance.1:
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
      implementations.0:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.identify:
-        "StarkWare_Starknet_2023_6"
+        "StarkWare_Starknet_2024_8"
      values.implementation:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.programHash:
-        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
+        "109586309220455887239200613090920758778188956576212125550190099009305121410"
    }
```

## Source code changes

```diff
.../Paradex/implementation/meta.txt                |   2 +-
 .../starkware/solidity/components}/Governance.sol  |   6 +-
 .../solidity/components}/GovernedFinalizable.sol   |   8 +-
 .../components}/OnchainDataFactTreeEncoder.sol     |  13 +-
 .../starkware/solidity/components}/Operator.sol    |   8 +-
 .../solidity/interfaces}/BlockDirectCall.sol       |   4 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../solidity/interfaces}/IFactRegistry.sol         |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../starkware/solidity/interfaces}/MGovernance.sol |   4 +-
 .../starkware/solidity/interfaces}/MOperator.sol   |   6 +-
 .../solidity/interfaces}/ProxySupport.sol          |  12 +-
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../solidity/libraries/NamedStorage8.sol}          |  23 ++-
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../starkware/starknet/solidity}/Output.sol        |  38 ++--
 .../starkware/starknet/solidity}/Starknet.sol      | 219 ++++++++++++++++-----
 .../starknet/solidity}/StarknetGovernance.sol      |   8 +-
 .../starknet/solidity}/StarknetMessaging.sol       |  14 +-
 .../starknet/solidity}/StarknetOperator.sol        |   8 +-
 .../starkware/starknet/solidity}/StarknetState.sol |   6 +-
 22 files changed, 271 insertions(+), 140 deletions(-)
```

Generated with discovered.json: 0xcf708385b5c467d77a70de0b7dfb36c5e9df798d

# Diff at Mon, 11 Mar 2024 11:54:57 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a20664a6b5ee1585ee305022d1fb61c48648854 block: 19126264
- current block number: 19411688

## Description

The maximum allowed balance of the bridge in USDC is doubled from 10 to 20 million USDC.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.maxTotalBalance:
-        10000000000000
+        20000000000000
    }
```

Generated with discovered.json: 0x9add5ea9290632cfcb71c7da24b5711ae9e16a1d

# Diff at Wed, 31 Jan 2024 11:48:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2226ccb2f9affe507b9708f9072c87989d180e43 block: 18983662
- current block number: 19126264

## Description

Updated the `programHash` and `configHash`.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.configHash:
-        "1946969884474626573154270293480115261427695072308490075958253509832033340430"
+        "2741190170141984203224468507008497105532196084369172236871397222510074358631"
      values.programHash:
-        "54878256403880350656938046611252303365750679698042371543935159963667935317"
+        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
    }
```

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
