Generated with discovered.json: 0xe79306268aba3256561531002dfe9c35d92891a1

# Diff at Wed, 26 Aug 2026 12:56:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fb74901bb22c00c7f3247db342eff035b686ebbd block: 1787230295
- current timestamp: 1787230295

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787230295 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x368Fa5E37EF1aCefF359Dc2E9DC7393C1CbCC4A3) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xA7b88A746FA457578D5abd6234471f07D895F46b) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xaBAc0E0AB68FC34441b36015bB952cD8f378283F) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xb54CD1e74f232C6de444464C81f81D13E6978816) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xC86ab72dc6da7eF91a96650f3BC23125cD997130) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x3683d67de9a541b825bee6739813885877800c4b

# Diff at Thu, 20 Aug 2026 13:17:37 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@00219f808cbf3466c6d2af96ddc96440efc3714c block: 1787035190
- current timestamp: 1787230295

## Description

Verified source code of 3 proxy admins and external call executor. The sources of two more contract were not identified

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787035190 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x368Fa5E37EF1aCefF359Dc2E9DC7393C1CbCC4A3) [global/ProxyAdmin] {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
      implementationNames.eth:0x368Fa5E37EF1aCefF359Dc2E9DC7393C1CbCC4A3:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract ProxyAdmin (eth:0xaBAc0E0AB68FC34441b36015bB952cD8f378283F) [global/ProxyAdmin] {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
      implementationNames.eth:0xaBAc0E0AB68FC34441b36015bB952cD8f378283F:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract ExternalCallExecutor (eth:0xAE0361b1C3454b297129e01046057F1D294c7974) [N/A] {
    +++ description: The default executor in the ExternalCallAdapter: it executes external calldata attached to DLN orders.
      unverified:
-        true
      description:
-        "Unverified contract registered as the default executor in the ExternalCallAdapter: it executes external calldata attached to DLN orders."
+        "The default executor in the ExternalCallAdapter: it executes external calldata attached to DLN orders."
      values.ADAPTER_ROLE:
+        "0xdbeb657137b1822b3d5418bea6fd641226d964b4c3871ef23546db2622258871"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      implementationNames.eth:0xAE0361b1C3454b297129e01046057F1D294c7974:
-        ""
+        "ExternalCallExecutor"
      sourceHashes:
+        ["0x6c5aae59f2a5722455f7f6b27b17e514a918ab56299c83ae29aed90c2f8863b0"]
    }
```

```diff
    contract ProxyAdmin (eth:0xb54CD1e74f232C6de444464C81f81D13E6978816) [global/ProxyAdmin] {
    +++ description: None
      name:
-        ""
+        "ProxyAdmin"
      unverified:
-        true
      values.UPGRADE_INTERFACE_VERSION:
+        "5.0.0"
      implementationNames.eth:0xb54CD1e74f232C6de444464C81f81D13E6978816:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

Generated with discovered.json: 0xf9e9961ba5caa63fe68c0ace8aa0932fdf5aebef

# Diff at Tue, 18 Aug 2026 06:41:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@288dd9f3392793b0bfa7f3e6e155408cf3c705ba block: 1786706330
- current timestamp: 1787035190

## Description

Common theme: support for fee-on-transfer/rebasing tokens on the fulfillment path by measuring actual received amounts instead of requiring exact transfers.

- DlnSource 1.7.1 -> 1.8.0 ([impl diff](https://disco.l2beat.com/diff/eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF/eth:0x2b426a0Ac391490e88d15B304436e7a84Df78611))
- DlnDestination 1.7.0 -> 1.7.1 ([impl diff](https://disco.l2beat.com/diff/eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5/eth:0xD9b4f9CacFFB59F2B982ad3c45096e3AA4B4020e))
- ExternalCallAdapter 1.1.0 -> 1.2.0 ([impl diff](https://disco.l2beat.com/diff/eth:0x7EA200f06c17cB9f64A3c8973a76DD8359fd68FA/eth:0xE143DbAEC892cEf2Af836dB49870A0Bcf9d5E6A1))
- DeBridgeRouter 3.1.0 -> 3.2.0 ([impl diff](https://disco.l2beat.com/diff/eth:0x3c857eD51c8a2747EE8c6F30EdDA5ea0D487CC64/eth:0xCe56012E880851baa234cD092aF516A0fcA9CFe3))

No significant permission or governance changes

## Watched changes

```diff
    contract ExternalCallAdapter (eth:0x61eF2e01E603aEB5Cd96F9eC9AE76cc6A68f6cF9) [debridge/ExternalCallAdapter] {
    +++ description: Escrow and dispatcher for external calls attached to DLN orders: it receives the taker's funds of orders that carry calldata and releases them when the calldata is executed by the registered executor, or refunds the order authority on cancellation.
      sourceHashes.1:
-        "0x9e1d6978ce2fd4ad04aa5969d3bcef97fd54b2ded7c0d62599131196aec314dc"
+        "0x18bbebb819a937958472cbe9848d10adb1983dbffea723e7ba5e79e2ac6a50f2"
      values.$implementation:
-        "eth:0x7EA200f06c17cB9f64A3c8973a76DD8359fd68FA"
+        "eth:0xE143DbAEC892cEf2Af836dB49870A0Bcf9d5E6A1"
      values.$pastUpgrades.3:
+        ["2026-08-17T10:20:35.000Z","0x30e7e8dac55cb6f8ac7b7cc81c9132f01acb5fbb87ed1f44b568183518670fbb",["eth:0xE143DbAEC892cEf2Af836dB49870A0Bcf9d5E6A1"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.1.0"
+        "1.2.0"
      implementationNames.eth:0x7EA200f06c17cB9f64A3c8973a76DD8359fd68FA:
-        "DlnExternalCallAdapter"
      implementationNames.eth:0xE143DbAEC892cEf2Af836dB49870A0Bcf9d5E6A1:
+        "DlnExternalCallAdapter"
    }
```

```diff
    contract DeBridgeRouter (eth:0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251) [debridge/DeBridgeRouter] {
    +++ description: Optional periphery router that can swap input tokens via whitelisted DEX routers and forward the proceeds into the DLN contracts (order creation, or order fulfillment on the hardcoded DlnDestination via fillCrossChain) in a single transaction. It does not custody funds across transactions and is not part of the DLN critical path.
      sourceHashes.1:
-        "0xfbd0e32e74cd0871ed9aaf242684ccae1423b67493f683b6c31d4282d6813a6a"
+        "0xbb3368874361b195a217b8488d3a15b0b0f5a6e5a1189b88964a97715889bbc8"
      values.$implementation:
-        "eth:0x3c857eD51c8a2747EE8c6F30EdDA5ea0D487CC64"
+        "eth:0xCe56012E880851baa234cD092aF516A0fcA9CFe3"
      values.$pastUpgrades.10:
+        ["2026-08-17T10:20:35.000Z","0x30e7e8dac55cb6f8ac7b7cc81c9132f01acb5fbb87ed1f44b568183518670fbb",["eth:0xCe56012E880851baa234cD092aF516A0fcA9CFe3"]]
      values.$upgradeCount:
-        10
+        11
      values.version:
-        310
+        320
      values.dlnDestination:
+        "eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f"
      implementationNames.eth:0x3c857eD51c8a2747EE8c6F30EdDA5ea0D487CC64:
-        "DeBridgeRouter"
      implementationNames.eth:0xCe56012E880851baa234cD092aF516A0fcA9CFe3:
+        "DeBridgeRouter"
    }
```

```diff
    contract DlnDestination (eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f) [debridge/DlnDestination] {
    +++ description: Destination side of the deBridge Liquidity Network (DLN) intent protocol: takers fulfill orders here permissionlessly by paying the 'take' amount, which is forwarded to the order recipient in the same transaction (this contract holds no user funds). The taker then sends an unlock message back to the source chain's DlnSource through the deBridge messaging protocol to claim the escrowed maker funds.
      sourceHashes.1:
-        "0x925d0cfe1e1388a72765060d6905fa5bfd29e5a50bf4dcd11c2747a9d3097825"
+        "0xcca702480efa62cd07a9ea9b50d25bd2fec07bdb974ed969b52461235e056c6b"
      values.$implementation:
-        "eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5"
+        "eth:0xD9b4f9CacFFB59F2B982ad3c45096e3AA4B4020e"
      values.$pastUpgrades.5:
+        ["2026-08-17T10:20:35.000Z","0x30e7e8dac55cb6f8ac7b7cc81c9132f01acb5fbb87ed1f44b568183518670fbb",["eth:0xD9b4f9CacFFB59F2B982ad3c45096e3AA4B4020e"]]
      values.$upgradeCount:
-        5
+        6
      values.version:
-        "1.7.0"
+        "1.7.1"
      implementationNames.eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5:
-        "DlnDestination"
      implementationNames.eth:0xD9b4f9CacFFB59F2B982ad3c45096e3AA4B4020e:
+        "DlnDestination"
    }
```

```diff
    contract DlnSource (eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66) [debridge/DlnSource] {
    +++ description: Source-side escrow of the deBridge Liquidity Network (DLN) intent protocol: users lock the 'give' funds of a cross-chain order directly in this contract. Funds are released to the taker (claimUnlock) or refunded to the maker (claimCancel) only on a message from the DlnDestination configured for the order's destination chain, authenticated via the CallProxy of the deBridge messaging protocol (i.e. ultimately by deBridge validator signatures).
      sourceHashes.1:
-        "0x1ee6b36758f7c1cb71e4ed6d4e731d42a09413cdfeaf71a16c0554633c6047c9"
+        "0x1a65dd672c1d690b7748bf1c367c91be2553be1610e4efa604279e7855978cb5"
      values.$implementation:
-        "eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF"
+        "eth:0x2b426a0Ac391490e88d15B304436e7a84Df78611"
      values.$pastUpgrades.5:
+        ["2026-08-17T10:20:35.000Z","0x30e7e8dac55cb6f8ac7b7cc81c9132f01acb5fbb87ed1f44b568183518670fbb",["eth:0x2b426a0Ac391490e88d15B304436e7a84Df78611"]]
      values.$upgradeCount:
-        5
+        6
      values.version:
-        "1.7.1"
+        "1.8.0"
      implementationNames.eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF:
-        "DlnSource"
      implementationNames.eth:0x2b426a0Ac391490e88d15B304436e7a84Df78611:
+        "DlnSource"
    }
```

## Source code changes

```diff
.../DeBridgeRouter/DeBridgeRouter.sol              | 442 +++++++++++-
 .../DlnDestination/DlnDestination.sol              | 125 +++-
 .../DlnSource/DlnSource.sol                        | 101 ++-
 .../ExternalCallAdapter/DlnExternalCallAdapter.sol | 738 ++++++++++++---------
 4 files changed, 1023 insertions(+), 383 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1786706330 (main branch discovery), not current.

```diff
    contract DeBridgeRouter (eth:0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251) [debridge/DeBridgeRouter] {
    +++ description: Optional periphery router that can swap input tokens via whitelisted DEX routers and forward the proceeds into the DLN contracts (order creation, or order fulfillment on the hardcoded DlnDestination via fillCrossChain) in a single transaction. It does not custody funds across transactions and is not part of the DLN critical path.
      description:
-        "Optional periphery router that can swap input tokens via whitelisted DEX routers and forward the proceeds into the DLN contracts in a single transaction. It does not custody funds across transactions and is not part of the DLN critical path."
+        "Optional periphery router that can swap input tokens via whitelisted DEX routers and forward the proceeds into the DLN contracts (order creation, or order fulfillment on the hardcoded DlnDestination via fillCrossChain) in a single transaction. It does not custody funds across transactions and is not part of the DLN critical path."
    }
```

```diff
    contract DlnSource (eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66) [debridge/DlnSource] {
    +++ description: Source-side escrow of the deBridge Liquidity Network (DLN) intent protocol: users lock the 'give' funds of a cross-chain order directly in this contract. Funds are released to the taker (claimUnlock) or refunded to the maker (claimCancel) only on a message from the DlnDestination configured for the order's destination chain, authenticated via the CallProxy of the deBridge messaging protocol (i.e. ultimately by deBridge validator signatures).
      fieldMeta.intentManagerRights.description:
-        "Immutable allowlist contract: addresses it validates can create orders with custom or zero protocol fees (createSaltedOrderForIntent)."
+        "Immutable allowlist contract: addresses it validates can create orders with custom or zero protocol fees and can designate an arbitrary address as the order maker (createSaltedOrderForIntent)."
    }
```

Generated with discovered.json: 0x7afcf14042868e28950376055745c27d87c409a4

# Diff at Fri, 14 Aug 2026 11:20:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3df3e1e3d350c8e7f96d14fe99deec9c2fcf3771 block: 1753092647
- current timestamp: 1786706330

## Description

Full rediscovery of deBridge on Ethereum for the interop research: extended the discovery from the DeBridgeGate messaging/token bridge to the complete deployed stack including DLN (DlnSource/DlnDestination), the external call contracts (ExternalCallAdapter, unverified ExternalCallExecutor), the periphery DeBridgeRouter, and the new intent-manager stack (DeBridgeIntentManager, DeBridgeAllowanceHolder, IntentManagerValidator). Added debridge/* templates with descriptions and dynamic permissions (validator set, admin roles, fee collector, governance cancel role, allowance holder spender role). Notable: the intent-manager stack is administered and upgradeable by a single EOA (0x844e5b...) via unverified ProxyAdmins, unlike the multisig-governed core.

## Watched changes

```diff
    EOA  (eth:0x391276932b5105C2DB8eE928dfd8872564d6d246) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","description":"withdraw accumulated DLN protocol fees (not user principal) to itself.","role":".feeCollectorAC"}
    }
```

```diff
    contract Admin Multisig (eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) [GnosisSafe] {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","description":"set the trusted DlnSource address (message receiver) for each supported chain, replace the external call adapter that custodies funds of orders with attached calldata, unpause the contract, and grant/revoke all roles.","role":".defaultAdminAC"}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","description":"set the trusted DlnDestination address for each supported chain (a malicious address there can drain all escrowed order funds via forged unlock messages), change DLN fees without upper bound, unpause the contract, and grant/revoke all roles.","role":".defaultAdminAC"}
    }
```

```diff
    contract DlnDestination (eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f) [debridge/DlnDestination] {
    +++ description: Destination side of the deBridge Liquidity Network (DLN) intent protocol: takers fulfill orders here permissionlessly by paying the 'take' amount, which is forwarded to the order recipient in the same transaction (this contract holds no user funds). The taker then sends an unlock message back to the source chain's DlnSource through the deBridge messaging protocol to claim the escrowed maker funds.
      sourceHashes.1:
-        "0x5ed9ca82d8103a5414cd152cef8ee9140f15a2e0e8dc0a36b7074ccb95098566"
+        "0x925d0cfe1e1388a72765060d6905fa5bfd29e5a50bf4dcd11c2747a9d3097825"
      values.$implementation:
-        "eth:0x33B72F60F2CEB7BDb64873Ac10015a35bed81717"
+        "eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5"
      values.$pastUpgrades.4:
+        ["2026-02-13T12:08:35.000Z","0xf187915dcb7b435138135f96d4a9bf6f606255d5247b00f0282afd2516bc02d2",["eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5"]]
      values.$upgradeCount:
-        4
+        5
      values.chainEngines:
-        [0,0,0,0,0]
      values.dlnSourceAddresses:
-        ["0x","0x","0x","0x","0x"]
+++ description: Maximum number of orders that can be unlocked in a single batch message to an EVM source chain.
      values.maxOrderCountPerBatchEvmUnlock:
-        10
+        50
      values.version:
-        "1.3.0"
+        "1.7.0"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]},"GOVERNANCE_DELEGATED_ORDER_CANCEL_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x0746e7e4d15F30885616B4ac3D274393354E80c0"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
+++ description: The admin-configured DlnSource address per source chain ID, used as the receiver of outbound unlock/cancel messages.
      values.dlnSourceAddressesMap:
+        {"10":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","56":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","137":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","250":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","4663":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","8453":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","42161":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","43114":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","59144":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","7565164":"0x0d0720fe448de59d8811e24d6df917dc8d0d98b392ddf4dd2b622a747a60fded","100000001":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000002":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000003":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000004":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000005":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000006":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000008":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000009":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000010":"eth:0xA13771CAbd2e44dcA8DeA846cc954D1FbAc0623b","100000012":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000013":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000014":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000015":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000017":"eth:0xA13771CAbd2e44dcA8DeA846cc954D1FbAc0623b","100000019":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000020":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000021":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000022":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000023":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000024":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000025":"eth:0xA13771CAbd2e44dcA8DeA846cc954D1FbAc0623b","100000026":"eth:0xE6f924E3C42350684aF70F798c3cA2533A4c5Bd0","100000027":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000028":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000029":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000030":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","100000031":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66"}
      values.govCancelAC:
+        ["eth:0x0746e7e4d15F30885616B4ac3D274393354E80c0"]
      values.GOVERNANCE_DELEGATED_ORDER_CANCEL_ROLE:
+        "0x01bd451848033b83db2d5c21b44e19dc2cf0e3067ae17fafefe1ac665572eeb3"
      values.subscriptionId:
+        0
      errors:
-        {"chainEngines":"Processing error occurred.","dlnSourceAddresses":"Processing error occurred."}
      implementationNames.eth:0x33B72F60F2CEB7BDb64873Ac10015a35bed81717:
-        "DlnDestination"
      implementationNames.eth:0xE540eb6BfEE129d28d47E26Ad33a138d66FD78f5:
+        "DlnDestination"
      template:
+        "debridge/DlnDestination"
      description:
+        "Destination side of the deBridge Liquidity Network (DLN) intent protocol: takers fulfill orders here permissionlessly by paying the 'take' amount, which is forwarded to the order recipient in the same transaction (this contract holds no user funds). The taker then sends an unlock message back to the source chain's DlnSource through the deBridge messaging protocol to claim the escrowed maker funds."
      fieldMeta:
+        {"dlnSourceAddressesMap":{"description":"The admin-configured DlnSource address per source chain ID, used as the receiver of outbound unlock/cancel messages."},"externalCallAdapter":{"description":"Admin-settable contract that receives the taker's funds of orders carrying attached calldata before executing it (a malicious adapter could steal the funds of every such order)."},"maxOrderCountPerBatchEvmUnlock":{"description":"Maximum number of orders that can be unlocked in a single batch message to an EVM source chain."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DlnSource (eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66) [debridge/DlnSource] {
    +++ description: Source-side escrow of the deBridge Liquidity Network (DLN) intent protocol: users lock the 'give' funds of a cross-chain order directly in this contract. Funds are released to the taker (claimUnlock) or refunded to the maker (claimCancel) only on a message from the DlnDestination configured for the order's destination chain, authenticated via the CallProxy of the deBridge messaging protocol (i.e. ultimately by deBridge validator signatures).
      sourceHashes.1:
-        "0x9523aef2a126e91098e5c19a00872b86dc7fee8ba257f2015672763d85b2b683"
+        "0x1ee6b36758f7c1cb71e4ed6d4e731d42a09413cdfeaf71a16c0554633c6047c9"
      values.$implementation:
-        "eth:0xbF20cB9614a0059bBe4b599d1D04358aFe31eDfb"
+        "eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF"
      values.$pastUpgrades.3:
+        ["2025-09-15T11:47:11.000Z","0xf1d50e3b14cf974394d925c71087896c185c14c9e79506744a9fd57d5f2aa738",["eth:0xe13a85137f8752AbE4c5A614Dc3BaF396b00308D"]]
      values.$pastUpgrades.4:
+        ["2025-12-08T14:40:11.000Z","0x25b20353a5814918c4c569e1f9e8fede74138c9b7ab2043428a60f1c632d0ce6",["eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF"]]
      values.$upgradeCount:
-        3
+        5
      values.chainEngines:
-        [0,0,0,0,0]
      values.dlnDestinationAddresses:
-        ["0x","0x","0x","0x","0x"]
      values.version:
-        "1.5.0"
+        "1.7.1"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]},"FEE_COLLECTOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x391276932b5105C2DB8eE928dfd8872564d6d246"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
+++ description: The admin-configured DlnDestination address per destination chain ID. Messages authenticated as coming from these addresses can unlock or refund all escrowed order funds.
      values.dlnDestinationAddressesMap:
+        {"10":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","56":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","137":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","250":"0x","4663":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","8453":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","42161":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","43114":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","59144":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","7565164":"0xa192b7f8b3eddc1e930a8e141564bb0ddc9d23f607cf13fd3a9fc15a638ed033","100000001":"0x","100000002":"0x","100000003":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000004":"0x","100000005":"0x","100000006":"0x","100000008":"0x","100000009":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000010":"0x","100000012":"0x","100000013":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000014":"0x","100000015":"0x","100000017":"0x","100000019":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000020":"0x","100000021":"0x","100000022":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000023":"0x","100000024":"0x","100000025":"0x","100000026":"eth:0xe8E2948B1E24E05C017aca0dCe44630595c464eb","100000027":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000028":"0x","100000029":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000030":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","100000031":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f"}
      values.feeCollectorAC:
+        ["eth:0x391276932b5105C2DB8eE928dfd8872564d6d246"]
      values.intentManager:
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: Immutable allowlist contract: addresses it validates can create orders with custom or zero protocol fees (createSaltedOrderForIntent).
      values.intentManagerRights:
+        "eth:0x4247c6f71407359E4C8D29787E98D752F264CD4b"
      errors:
-        {"chainEngines":"Processing error occurred.","dlnDestinationAddresses":"Processing error occurred."}
      implementationNames.eth:0xbF20cB9614a0059bBe4b599d1D04358aFe31eDfb:
-        "DlnSource"
      implementationNames.eth:0x322B481088143d9Ff74e4169Fb7f12F7808690DF:
+        "DlnSource"
      template:
+        "debridge/DlnSource"
      description:
+        "Source-side escrow of the deBridge Liquidity Network (DLN) intent protocol: users lock the 'give' funds of a cross-chain order directly in this contract. Funds are released to the taker (claimUnlock) or refunded to the maker (claimCancel) only on a message from the DlnDestination configured for the order's destination chain, authenticated via the CallProxy of the deBridge messaging protocol (i.e. ultimately by deBridge validator signatures)."
      fieldMeta:
+        {"dlnDestinationAddressesMap":{"description":"The admin-configured DlnDestination address per destination chain ID. Messages authenticated as coming from these addresses can unlock or refund all escrowed order funds."},"globalFixedNativeFee":{"description":"Flat protocol fee in native tokens charged per order (refunded if the order is cancelled)."},"globalTransferFeeBps":{"description":"Variable protocol fee in basis points deducted from the order's give amount (no upper bound check; admin changes apply to new orders immediately)."},"intentManagerRights":{"description":"Immutable allowlist contract: addresses it validates can create orders with custom or zero protocol fees (createSaltedOrderForIntent)."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    EOA  (eth:0x0746e7e4d15F30885616B4ac3D274393354E80c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x368Fa5E37EF1aCefF359Dc2E9DC7393C1CbCC4A3) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract IntentManagerValidator (eth:0x4247c6f71407359E4C8D29787E98D752F264CD4b) [debridge/IntentManagerValidator]
    +++ description: Immutable allowlist contract referenced by DlnSource: addresses holding the INTENT_MANAGER_ROLE can create DLN orders with custom or zero protocol fees. It grants no access to existing funds.
```

```diff
+   Status: CREATED
    contract  (eth:0x6D83EAEb957986FEA14Ff0E88AF23736598e22cc) [N/A]
    +++ description: Unverified proxy referenced as the feeTreasury of the DeBridgeIntentManager.
```

```diff
+   Status: CREATED
    contract  (eth:0xaBAc0E0AB68FC34441b36015bB952cD8f378283F) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0xb54CD1e74f232C6de444464C81f81D13E6978816) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0xd2a4cA9DA7B84c16B888df340d96a5a92aA44F07) [N/A]
    +++ description: Unverified proxy holding the INTENT_MANAGER_ROLE on the IntentManagerValidator, allowing it to create DLN orders with custom or zero protocol fees.
```

```diff
+   Status: CREATED
    contract DeBridgeAllowanceHolder (eth:0xddddddddd4B6472c5002F95610b194D1161223d0) [debridge/DeBridgeAllowanceHolder]
    +++ description: Immutable allowance sink of the deBridge intent system: users approve this contract (directly or as Permit2 spender) so that the upgradeable executor contracts never hold approvals themselves. Its transfer functions carry no intent-level checks: any ALLOWED_SPENDER_ROLE holder can move any approved token from any approver to any recipient.
```

```diff
+   Status: CREATED
    contract DeBridgeIntentManager (eth:0xDDDDDDDdeB2E68Ee19832e356FCB5537124A9708) [debridge/DeBridgeIntentManager]
    +++ description: Fills user-signed intents by creating DLN orders on their behalf: it pulls input tokens from users through the DeBridgeAllowanceHolder (Permit2 or direct approvals) and forwards them into DlnSource in the same transaction, charging a variable fee that is NOT part of the user-signed intent. It is non-custodial in steady state. Note that the EIP-712 signature users sign covers only an opaque intent hash, and fills are permissionless unless the intent restricts senders.
```

## Source code changes

```diff
.../TransparentUpgradeableProxy.p.sol              |  876 ++
 .../TransparentUpgradeableProxy.p.sol              |  876 ++
 .../debridge/.flat/DeBridgeAllowanceHolder.sol     | 1122 +++
 .../DeBridgeIntentManager.sol                      | 8556 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  876 ++
 .../DlnDestination/DlnDestination.sol              | 3243 ++++----
 .../DlnSource/DlnSource.sol                        |  909 ++-
 .../debridge/.flat/IntentManagerValidator.sol      |  502 ++
 8 files changed, 15044 insertions(+), 1916 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753092647 (main branch discovery), not current.

```diff
    EOA  (eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    contract DeBridgeGate (eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) [debridge/DeBridgeGate] {
    +++ description: Central hub of the deBridge messaging protocol on this chain: it emits cross-chain submissions (asset transfers and/or arbitrary messages), locks and releases native assets, mints and burns deBridge-wrapped assets (deTokens), and executes claimed submissions after their validator signatures are checked by the SignatureVerifier. Claiming is permissionless: anyone can execute a submission that carries enough validator signatures.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]},"GOVMONITORING_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
      values.govMonitoringAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
      template:
+        "debridge/DeBridgeGate"
      description:
+        "Central hub of the deBridge messaging protocol on this chain: it emits cross-chain submissions (asset transfers and/or arbitrary messages), locks and releases native assets, mints and burns deBridge-wrapped assets (deTokens), and executes claimed submissions after their validator signatures are checked by the SignatureVerifier. Claiming is permissionless: anyone can execute a submission that carries enough validator signatures."
      fieldMeta:
+        {"signatureVerifier":{"description":"Contract that verifies deBridge validator signatures for all submissions claimed on this chain."},"callProxy":{"description":"Contract that executes arbitrary calldata attached to claimed submissions."},"feeProxy":{"description":"The only address allowed to withdraw protocol fees accrued in the gate."},"deBridgeTokenDeployer":{"description":"Factory (and beacon) for deBridge-wrapped tokens (deTokens) on this chain."},"globalFixedNativeFee":{"description":"Default flat protocol fee in native tokens charged per submission."},"globalTransferFeeBps":{"description":"Default variable protocol fee in basis points charged on transferred amounts."},"excessConfirmations":{"description":"Elevated number of validator signatures required for claims above the per-asset amount threshold and for new deToken deployments (effective only if higher than the SignatureVerifier's minConfirmations)."},"paused":{"description":"Whether all sends, claims and deToken deployments through the gate are currently paused."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    EOA  (eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    contract Admin Multisig (eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","description":"pause the DeBridgeGate, stopping all sends, claims and deToken deployments on this chain (only the admin can unpause).","role":".govMonitoringAC"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","description":"replace the SignatureVerifier (and with it the entire validation layer of the deBridge messaging protocol), the CallProxy and the deToken deployer, censor individual submissions (blockSubmission), toggle supported chains, set all fees and per-address fee discounts, designate the fee withdrawal contract, unpause the gate, and grant/revoke all roles. Most of these setters emit no events.","role":".defaultAdminAC"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x61eF2e01E603aEB5Cd96F9eC9AE76cc6A68f6cF9","description":"replace the executor contract that handles external calldata of DLN orders and pause the adapter.","role":".defaultAdminAC"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251","description":"manage the whitelist of swap routers and forwarding targets this contract may call with arbitrary calldata (and grant infinite token approvals to), set the service fee and fee treasury, and sweep any funds held by the router.","role":".defaultAdminAC"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","description":"administer all deployed deTokens: pause their transfers and grant/revoke minter rights, including the ability to grant itself the right to mint unbacked deTokens.","role":".deBridgeTokenAdmin"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","description":"replace the implementation of all deTokens at once (this contract acts as their beacon), change the admin assigned to newly deployed deTokens, and override deToken names/symbols. None of these setters emit events.","role":".defaultAdminAC"}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","description":"grant and revoke the DEBRIDGE_GATE_ROLE that authorizes contracts to execute arbitrary external calls through the CallProxy.","role":".defaultAdminAC"}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"add and remove deBridge validators (oracles), change all signature thresholds (quorum must remain a majority of the oracle set), and re-point the gate contract allowed to request verification. Threshold changes emit no events.","role":".defaultAdminAC"}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","description":"grant/revoke the FEE_COLLECTOR_ROLE that receives all deBridge protocol fees, pause fee withdrawals, and change the referenced gate contract.","role":".defaultAdminAC"}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x61eF2e01E603aEB5Cd96F9eC9AE76cc6A68f6cF9","role":"admin","via":[{"address":"eth:0xA7b88A746FA457578D5abd6234471f07D895F46b"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251","role":"admin","via":[{"address":"eth:0xC86ab72dc6da7eF91a96650f3BC23125cD997130"}]}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f","role":"admin","via":[{"address":"eth:0xA7b88A746FA457578D5abd6234471f07D895F46b"}]}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66","role":"admin","via":[{"address":"eth:0xA7b88A746FA457578D5abd6234471f07D895F46b"}]}
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0xA7b88A746FA457578D5abd6234471f07D895F46b","role":".owner"}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0xC86ab72dc6da7eF91a96650f3BC23125cD997130","role":".owner"}
    }
```

```diff
    contract DeBridgeTokenDeployer (eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) [debridge/DeBridgeTokenDeployer] {
    +++ description: Deploys deBridge-wrapped token (deToken) contracts when an asset is bridged to this chain for the first time (callable only by the DeBridgeGate). All deTokens are beacon proxies whose beacon is this contract itself, so its tokenImplementation applies to every deToken on this chain at once.
      values.implementation:
-        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
      template:
+        "debridge/DeBridgeTokenDeployer"
      description:
+        "Deploys deBridge-wrapped token (deToken) contracts when an asset is bridged to this chain for the first time (callable only by the DeBridgeGate). All deTokens are beacon proxies whose beacon is this contract itself, so its tokenImplementation applies to every deToken on this chain at once."
      fieldMeta:
+        {"tokenImplementation":{"description":"The shared implementation contract behind all deToken beacon proxies on this chain. Changing it (setTokenImplementation, which emits no event) upgrades all deTokens at once."},"deBridgeTokenAdmin":{"description":"The admin assigned to every deployed deToken (receives DEFAULT_ADMIN_ROLE and PAUSER_ROLE on each deToken)."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    EOA  (eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0x874f46124C1DAaD4749B94f82eD142754826240E) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    contract CallProxy (eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) [debridge/CallProxy] {
    +++ description: Sandbox that executes arbitrary calldata attached to claimed cross-chain submissions on behalf of the DeBridgeGate. Calls are performed from this contract's address with attacker-choosable target and data, so external contracts must never trust it as a caller; it isolates such calls from the gate's balances.
      values.submissionChainIdFrom:
-        0
      values.submissionNativeSender:
-        "0x"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]},"DEBRIDGE_GATE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
      template:
+        "debridge/CallProxy"
      description:
+        "Sandbox that executes arbitrary calldata attached to claimed cross-chain submissions on behalf of the DeBridgeGate. Calls are performed from this contract's address with attacker-choosable target and data, so external contracts must never trust it as a caller; it isolates such calls from the gate's balances."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SignatureVerifier (eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) [debridge/SignatureVerifier] {
    +++ description: Validation layer of the deBridge messaging protocol on this chain: it accepts a cross-chain submission if at least minConfirmations of the registered validators (oracles) have signed its submission ID with a plain ECDSA signature, and every validator flagged as 'required' has signed. There is no other proof system.
      values.oracles:
-        ["eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526","eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205","eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5","eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214","eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC","eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8","eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426","eth:0x874f46124C1DAaD4749B94f82eD142754826240E","eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0","eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF","eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D","eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
+++ description: The registered deBridge validators (oracles) whose signatures authenticate cross-chain submissions.
      values.oracleAddresses:
+        ["eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526","eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205","eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5","eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214","eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC","eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8","eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426","eth:0x874f46124C1DAaD4749B94f82eD142754826240E","eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0","eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF","eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D","eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"]
      template:
+        "debridge/SignatureVerifier"
      description:
+        "Validation layer of the deBridge messaging protocol on this chain: it accepts a cross-chain submission if at least minConfirmations of the registered validators (oracles) have signed its submission ID with a plain ECDSA signature, and every validator flagged as 'required' has signed. There is no other proof system."
      fieldMeta:
+        {"oracleAddresses":{"description":"The registered deBridge validators (oracles) whose signatures authenticate cross-chain submissions."},"minConfirmations":{"description":"Baseline number of validator signatures required to accept a cross-chain submission."},"confirmationThreshold":{"description":"Per-block circuit breaker: once more than this many submissions are approved within a single block, further submissions in that block require excessConfirmations signatures."},"excessConfirmations":{"description":"Elevated number of validator signatures required for submissions beyond the per-block confirmationThreshold."},"requiredOraclesCount":{"description":"Number of validators flagged as 'required': each of them must sign every submission in addition to the normal quorum (each is individually a liveness single point of failure and, collectively, a veto)."}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    EOA  (eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    contract SimpleFeeProxy (eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) [debridge/SimpleFeeProxy] {
    +++ description: The only contract allowed to withdraw protocol fees accrued in the DeBridgeGate. Fees are paid out directly to the caller of withdrawFees(), so the effective fee destination is whoever holds the FEE_COLLECTOR_ROLE.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]},"FEE_COLLECTOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x391276932b5105C2DB8eE928dfd8872564d6d246"]}}
      values.defaultAdminAC:
+        ["eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"]
      values.feeCollectorAC:
+        ["eth:0x391276932b5105C2DB8eE928dfd8872564d6d246"]
      template:
+        "debridge/SimpleFeeProxy"
      description:
+        "The only contract allowed to withdraw protocol fees accrued in the DeBridgeGate. Fees are paid out directly to the caller of withdrawFees(), so the effective fee destination is whoever holds the FEE_COLLECTOR_ROLE."
    }
```

```diff
    contract DeBridgeToken (eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) [debridge/DeBridgeToken] {
    +++ description: Implementation contract for deBridge-wrapped tokens (deTokens). Minting and burning of deTokens is restricted to the MINTER_ROLE, which is held by the DeBridgeGate.
      values.DOMAIN_SEPARATOR:
-        "0x71bd255e7e19bf7288abced32839ac7a63f38747292d2e97b6813c403f8024fc"
      values.totalSupply:
-        0
      template:
+        "debridge/DeBridgeToken"
      description:
+        "Implementation contract for deBridge-wrapped tokens (deTokens). Minting and burning of deTokens is restricted to the MINTER_ROLE, which is held by the DeBridgeGate."
    }
```

```diff
    EOA  (eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
    EOA  (eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","description":"sign cross-chain submissions as a deBridge validator. A quorum of these signers can authorize arbitrary messages, mint deTokens and unlock collateral from the deBridge gate on this chain.","role":".oracleAddresses"}]
    }
```

```diff
+   Status: CREATED
    contract ExternalCallAdapter (eth:0x61eF2e01E603aEB5Cd96F9eC9AE76cc6A68f6cF9) [debridge/ExternalCallAdapter]
    +++ description: Escrow and dispatcher for external calls attached to DLN orders: it receives the taker's funds of orders that carry calldata and releases them when the calldata is executed by the registered executor, or refunds the order authority on cancellation.
```

```diff
+   Status: CREATED
    contract DeBridgeRouter (eth:0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251) [debridge/DeBridgeRouter]
    +++ description: Optional periphery router that can swap input tokens via whitelisted DEX routers and forward the proceeds into the DLN contracts in a single transaction. It does not custody funds across transactions and is not part of the DLN critical path.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xA7b88A746FA457578D5abd6234471f07D895F46b) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExternalCallExecutor (eth:0xAE0361b1C3454b297129e01046057F1D294c7974) [N/A]
    +++ description: Unverified contract registered as the default executor in the ExternalCallAdapter: it executes external calldata attached to DLN orders.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xC86ab72dc6da7eF91a96650f3BC23125cD997130) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DlnDestination (eth:0xE7351Fd770A37282b91D153Ee690B63579D6dd7f) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DlnSource (eth:0xeF4fB24aD0916217251F553c0596F8Edc630EB66) [N/A]
    +++ description: None
```

Generated with discovered.json: 0xa9bef6b2520c2a2f5589eb2badd18eece47b299c

# Diff at Fri, 08 May 2026 07:51:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1753092647
- current timestamp: 1753092647

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753092647 (main branch discovery), not current.

```diff
    contract DeBridgeGate (eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xcd8bce7612cc46b4eb6dae7d913880fdd47ee8fcd03d90bd5d99fe145638685c"
+        "0x3d57a786d8c79ccc942d2a3375eaf1689a6851ee180123f59f8acea2f8887998"
    }
```

```diff
    contract Admin Multisig (eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract DeBridgeTokenDeployer (eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0x90a8fe0eeb8f61a691fd579cb10499f4fd9167497e9aeab3b1ce4f6427fabc96"
+        "0xff2a8bb5572e1959e22acdc6818bcb1da107807340ef1416129cae0cf740d02a"
    }
```

```diff
    contract CallProxy (eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xd67e23441d8b22dcf363c048ad14a86a4de64b242cb242fd7ef0fa11da2cb6ff"
+        "0x9b964fcb858bec965b5b4ed4acaf48a574fb1f40262511974c332b0aeea50b14"
    }
```

```diff
    contract SignatureVerifier (eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xbda27aaf69ce4f365f73f0436a7e06bffede3a693579569ec42ae41718b94c75"
+        "0x935f17b78605c215122116db0dace0d318ba1f183cb0372d2dcc3f68c4a4ac62"
    }
```

```diff
    contract SimpleFeeProxy (eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0x90a1adff0012e17a22d9eb35cecd932a71923919b443758b02b2c43ad666a352"
+        "0x6f2663359a667325f9c0eb5f1347674f6f48403728de36a9f61e0e8cad5f8232"
    }
```

```diff
    contract DeBridgeToken (eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x13def2c5fc95163873f1d15d260b9e03ac811bd830b6ed282e527268e3ca7759"
+        "0xe06ac978b2bdb39e529b3f1100c773c0aafc641c30f76bc1a526daf4d070e8ef"
    }
```

Generated with discovered.json: 0x8b97b34d0fff646274b3c2954a18df0b3e284bdf

# Diff at Tue, 05 May 2026 10:22:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1753092647
- current timestamp: 1753092647

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753092647 (main branch discovery), not current.

```diff
    contract DeBridgeGate (eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

```diff
    contract Admin Multisig (eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      deployerAddress:
+        "eth:0x9f856fC3e2ea6D2ef7b1f030D4A8BF34556eAc5d"
    }
```

```diff
    contract DeBridgeTokenDeployer (eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

```diff
    contract CallProxy (eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

```diff
    contract SignatureVerifier (eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

```diff
    contract SimpleFeeProxy (eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

```diff
    contract DeBridgeToken (eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      deployerAddress:
+        "eth:0x51256C824B193909F1B1BCD9F4a5Fa200cBCee78"
    }
```

```diff
    contract ProxyAdmin (eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      deployerAddress:
+        "eth:0xd6F0DabbBccd143f7d526a82Ca176b5395cCc844"
    }
```

Generated with discovered.json: 0x6a6aced6f6ba01565af4f1973d2a6240e691eb0a

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa049533418f1813e2419e47fae95eb86f648ab5f

# Diff at Tue, 26 Aug 2025 13:36:35 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1753092647
- current timestamp: 1753092647

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753092647 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","role":"admin","via":[{"address":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"}]},{"permission":"upgrade","from":"eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","role":"admin","via":[{"address":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"}]},{"permission":"upgrade","from":"eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","role":"admin","via":[{"address":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"}]},{"permission":"upgrade","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","role":"admin","via":[{"address":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"}]},{"permission":"upgrade","from":"eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","role":"admin","via":[{"address":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","role":"admin"},{"permission":"upgrade","from":"eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","role":"admin"},{"permission":"upgrade","from":"eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","role":"admin"},{"permission":"upgrade","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","role":"admin"},{"permission":"upgrade","from":"eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","role":"admin"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","role":"admin"},{"permission":"upgrade","from":"eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","role":"admin"},{"permission":"upgrade","from":"eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","role":"admin"},{"permission":"upgrade","from":"eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","role":"admin"},{"permission":"upgrade","from":"eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","role":"admin"}]
    }
```

Generated with discovered.json: 0x9fc38e40b3cbc3001eddd81d028e24a39d1a2b81

# Diff at Mon, 21 Jul 2025 10:11:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 19531527
- current block number: 22966882

## Description

SimpleFeeProxy [upgraded](https://disco.l2beat.com/diff/eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C/eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE):
- flash loans removed
- AMB function added (sends only message, no tokens)
- treasury deprecated, fees can now be removed by a permissioned actor

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885)
    +++ description: None
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sourceHashes.1:
-        "0xc18d3818f9e809ced3dcce60fbe4287220ce2fced4f6c66711de5e704738bb9a"
+        "0x90a1adff0012e17a22d9eb35cecd932a71923919b443758b02b2c43ad666a352"
      values.$implementation:
-        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE"
      values.$pastUpgrades.2:
+        ["2025-07-16T10:55:35.000Z","0x2891ca2643f9cb857b006952744b633088f22b57a8a04495abec7b79a500f1e3",["eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE"]]
      values.$upgradeCount:
-        2
+        3
      values.getChainId:
-        1
      values.treasury:
-        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      values.version:
-        400
+        410
      values.FEE_COLLECTOR_ROLE:
+        "0x2dca0f5ce7e75a4b43fe2b0d6f5d0b7a2bf92ecf89f8f0aa17b8308b67038821"
      implementationNames.eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
-        "SimpleFeeProxy"
      implementationNames.eth:0xa1cc7E623423169e1C10e6e5CC8Ae6f1d11042DE:
+        "SimpleFeeProxy"
    }
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         | 953 ---------------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |  35 -
 .../SimpleFeeProxy/SimpleFeeProxy.sol              |  98 ++-
 3 files changed, 56 insertions(+), 1030 deletions(-)
```

Generated with discovered.json: 0xe7e0aa86404a86ca4b592bedd640b11d1f0fe52a

# Diff at Mon, 14 Jul 2025 12:44:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    EOA  (0x1c0720B124e7251e881a0fbCfe259d085C59f205) {
    +++ description: None
      address:
-        "0x1c0720B124e7251e881a0fbCfe259d085C59f205"
+        "eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205"
    }
```

```diff
    EOA  (0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96) {
    +++ description: None
      address:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
    }
```

```diff
    EOA  (0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0) {
    +++ description: None
      address:
-        "0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
+        "eth:0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
    }
```

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      address:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x797161BCC625155D2302251404ccB93c2632658e"
+        "eth:0x797161BCC625155D2302251404ccB93c2632658e"
      values.$pastUpgrades.0.2.0:
-        "0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"
+        "eth:0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"
      values.$pastUpgrades.1.2.0:
-        "0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"
+        "eth:0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"
      values.$pastUpgrades.2.2.0:
-        "0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"
+        "eth:0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"
      values.$pastUpgrades.3.2.0:
-        "0xc8550d85759BAbE6851235212563Fa2Ff04961BF"
+        "eth:0xc8550d85759BAbE6851235212563Fa2Ff04961BF"
      values.$pastUpgrades.4.2.0:
-        "0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"
+        "eth:0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"
      values.$pastUpgrades.5.2.0:
-        "0x797161BCC625155D2302251404ccB93c2632658e"
+        "eth:0x797161BCC625155D2302251404ccB93c2632658e"
      values.callProxy:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      values.deBridgeTokenDeployer:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      values.feeContractUpdater:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.feeProxy:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      values.gap1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.signatureVerifier:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.wethGate:
-        "0xFCf83648b8cDeF62e5d03319a6f1FCE16e4D6A59"
+        "eth:0xFCf83648b8cDeF62e5d03319a6f1FCE16e4D6A59"
      implementationNames.0x43dE2d77BF8027e25dBD179B491e8d64f38398aA:
-        "TransparentUpgradeableProxy"
      implementationNames.0x797161BCC625155D2302251404ccB93c2632658e:
-        "DeBridgeGate"
      implementationNames.eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x797161BCC625155D2302251404ccB93c2632658e:
+        "DeBridgeGate"
    }
```

```diff
    EOA  (0x4bC16662A2cE381E7bb54Dc577c05619C5E67526) {
    +++ description: None
      address:
-        "0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
+        "eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
    }
```

```diff
    EOA  (0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D) {
    +++ description: None
      address:
-        "0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
+        "eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
    }
```

```diff
    EOA  (0x573F5E2940789B378BA09cf7d3fD010C422a9ff5) {
    +++ description: None
      address:
-        "0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
+        "eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
    }
```

```diff
    EOA  (0x59CE95b8955F0E7Be128d5Af77161B36f6084214) {
    +++ description: None
      address:
-        "0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
+        "eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
    }
```

```diff
    EOA  (0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426) {
    +++ description: None
      address:
-        "0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
+        "eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      address:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
+        "eth:0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
      values.$members.1:
-        "0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
+        "eth:0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
      values.$members.2:
-        "0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
+        "eth:0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
      values.$members.3:
-        "0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
+        "eth:0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
      values.$members.4:
-        "0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
+        "eth:0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
      values.$members.5:
-        "0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
+        "eth:0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
      values.$members.6:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
      values.$members.7:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
      implementationNames.0x6bec1faF33183e1Bc316984202eCc09d46AC92D5:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x6f572a24c5C009fC8C844Fab5352edf79F132FBD) {
    +++ description: None
      address:
-        "0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
+        "eth:0x6f572a24c5C009fC8C844Fab5352edf79F132FBD"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      address:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
+        "eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
      values.$pastUpgrades.0.2.0:
-        "0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
+        "eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"
      values.debridgeAddress:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.deBridgeTokenAdmin:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      values.implementation:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      values.tokenImplementation:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      implementationNames.0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491:
-        "DeBridgeTokenDeployer"
      implementationNames.eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491:
+        "DeBridgeTokenDeployer"
    }
```

```diff
    EOA  (0x83f81E7f9E284AAFFEDED797008663595f7342bF) {
    +++ description: None
      address:
-        "0x83f81E7f9E284AAFFEDED797008663595f7342bF"
+        "eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF"
    }
```

```diff
    EOA  (0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1) {
    +++ description: None
      address:
-        "0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
+        "eth:0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1"
    }
```

```diff
    EOA  (0x874f46124C1DAaD4749B94f82eD142754826240E) {
    +++ description: None
      address:
-        "0x874f46124C1DAaD4749B94f82eD142754826240E"
+        "eth:0x874f46124C1DAaD4749B94f82eD142754826240E"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      address:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
+        "eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
      values.$pastUpgrades.0.2.0:
-        "0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"
+        "eth:0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"
      values.$pastUpgrades.1.2.0:
-        "0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"
+        "eth:0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"
      values.$pastUpgrades.2.2.0:
-        "0x752A9e96e8683400ae238270C97c1D0160861fEF"
+        "eth:0x752A9e96e8683400ae238270C97c1D0160861fEF"
      values.$pastUpgrades.3.2.0:
-        "0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"
+        "eth:0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"
      values.$pastUpgrades.4.2.0:
-        "0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"
+        "eth:0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"
      values.$pastUpgrades.5.2.0:
-        "0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
+        "eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"
      implementationNames.0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824:
-        "TransparentUpgradeableProxy"
      implementationNames.0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8:
-        "CallProxy"
      implementationNames.eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8:
+        "CallProxy"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      address:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
+        "eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
      values.$pastUpgrades.0.2.0:
-        "0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"
+        "eth:0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"
      values.$pastUpgrades.1.2.0:
-        "0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
+        "eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"
      values.debridgeAddress:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.oracles.0:
-        "0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
+        "eth:0x4bC16662A2cE381E7bb54Dc577c05619C5E67526"
      values.oracles.1:
-        "0x1c0720B124e7251e881a0fbCfe259d085C59f205"
+        "eth:0x1c0720B124e7251e881a0fbCfe259d085C59f205"
      values.oracles.2:
-        "0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
+        "eth:0x573F5E2940789B378BA09cf7d3fD010C422a9ff5"
      values.oracles.3:
-        "0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
+        "eth:0x59CE95b8955F0E7Be128d5Af77161B36f6084214"
      values.oracles.4:
-        "0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
+        "eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
      values.oracles.5:
-        "0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
+        "eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
      values.oracles.6:
-        "0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
+        "eth:0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426"
      values.oracles.7:
-        "0x874f46124C1DAaD4749B94f82eD142754826240E"
+        "eth:0x874f46124C1DAaD4749B94f82eD142754826240E"
      values.oracles.8:
-        "0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
+        "eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
      values.oracles.9:
-        "0x83f81E7f9E284AAFFEDED797008663595f7342bF"
+        "eth:0x83f81E7f9E284AAFFEDED797008663595f7342bF"
      values.oracles.10:
-        "0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
+        "eth:0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D"
      values.oracles.11:
-        "0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
+        "eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
      implementationNames.0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c:
-        "TransparentUpgradeableProxy"
      implementationNames.0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4:
-        "SignatureVerifier"
      implementationNames.eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4:
+        "SignatureVerifier"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      address:
-        "0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
+        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
+        "eth:0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0"
      values.$members.1:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
      values.$members.2:
-        "0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
+        "eth:0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"
      implementationNames.0xa0D6062Be29710c666aE850395Ac1A2AeCd14885:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5) {
    +++ description: None
      address:
-        "0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
+        "eth:0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5"
    }
```

```diff
    EOA  (0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC) {
    +++ description: None
      address:
-        "0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
+        "eth:0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      address:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      values.$admin:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.$implementation:
-        "0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
      values.$pastUpgrades.0.2.0:
-        "0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"
+        "eth:0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"
      values.$pastUpgrades.1.2.0:
-        "0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
+        "eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C"
      values.debridgeGate:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      values.treasury:
-        "0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
+        "eth:0xa0D6062Be29710c666aE850395Ac1A2AeCd14885"
      implementationNames.0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636:
-        "TransparentUpgradeableProxy"
      implementationNames.0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
-        "SimpleFeeProxy"
      implementationNames.eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x37a52ddb753c924f8C914de65ef00b5210Caa83C:
+        "SimpleFeeProxy"
    }
```

```diff
    EOA  (0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D) {
    +++ description: None
      address:
-        "0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
+        "eth:0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D"
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      address:
-        "0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
+        "eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B"
      implementationNames.0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B:
-        "DeBridgeToken"
      implementationNames.eth:0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B:
+        "DeBridgeToken"
    }
```

```diff
    EOA  (0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C) {
    +++ description: None
      address:
-        "0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
+        "eth:0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C"
    }
```

```diff
    EOA  (0xd725E456D5beD8275E297C4Dd11135e3C5cDe544) {
    +++ description: None
      address:
-        "0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
+        "eth:0xd725E456D5beD8275E297C4Dd11135e3C5cDe544"
    }
```

```diff
    EOA  (0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0) {
    +++ description: None
      address:
-        "0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
+        "eth:0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      address:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
+        "eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      values.owner:
-        "0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
+        "eth:0x6bec1faF33183e1Bc316984202eCc09d46AC92D5"
      implementationNames.0xE4427af3555CD9303D728C491364FAdFDD7494Fe:
-        "ProxyAdmin"
      implementationNames.eth:0xE4427af3555CD9303D728C491364FAdFDD7494Fe:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7) {
    +++ description: None
      address:
-        "0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
+        "eth:0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7"
    }
```

```diff
    EOA  (0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54) {
    +++ description: None
      address:
-        "0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
+        "eth:0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54"
    }
```

```diff
    EOA  (0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8) {
    +++ description: None
      address:
-        "0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
+        "eth:0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8"
    }
```

```diff
+   Status: CREATED
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe)
    +++ description: None
```

Generated with discovered.json: 0x2aec27aa64c5336f9f1e1f2957396d766dc2b892

# Diff at Fri, 04 Jul 2025 12:18:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
+        "eth:0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      receivedPermissions.1.from:
-        "ethereum:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "eth:0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.2.from:
-        "ethereum:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "eth:0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.3.from:
-        "ethereum:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "eth:0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.4.from:
-        "ethereum:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "eth:0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
    }
```

Generated with discovered.json: 0x62c48ba0316e0f94063edffc7ccee8713777df56

# Diff at Fri, 23 May 2025 09:40:55 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 19531527
- current block number: 19531527

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0xd6029f7ef5c3015d7c96cf6969574ecf5b2e19b3

# Diff at Tue, 29 Apr 2025 08:19:01 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 19531527
- current block number: 19531527

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

Generated with discovered.json: 0xc7cb760e359451fedc76481953dc788c525a2df7

# Diff at Tue, 04 Mar 2025 10:39:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      sinceBlock:
+        13665321
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      sinceBlock:
+        13654184
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      sinceBlock:
+        13666681
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      sinceBlock:
+        13667557
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      sinceBlock:
+        13667289
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      sinceBlock:
+        13653314
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sinceBlock:
+        13669463
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      sinceBlock:
+        18025232
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      sinceBlock:
+        13665292
    }
```

Generated with discovered.json: 0x71cdeaa76c797a37d111425eb50b0b8acf584260

# Diff at Mon, 20 Jan 2025 11:09:24 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19531527
- current block number: 19531527

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
      issuedPermissions.0.to:
+        "0xE4427af3555CD9303D728C491364FAdFDD7494Fe"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.target:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      receivedPermissions.4.from:
+        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      receivedPermissions.3.target:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.3.from:
+        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      receivedPermissions.2.target:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.2.from:
+        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      receivedPermissions.1.target:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.1.from:
+        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
      receivedPermissions.0.target:
-        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
      receivedPermissions.0.from:
+        "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
    }
```

Generated with discovered.json: 0x15ec9b6408709ac2627b2bf9c4d3ad3f60b39c89

# Diff at Mon, 21 Oct 2024 11:05:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x797161BCC625155D2302251404ccB93c2632658e"]
      values.$pastUpgrades.5.1:
-        ["0x797161BCC625155D2302251404ccB93c2632658e"]
+        "0x4c0887fede83ae4bb405125f1f08a3e6604ca712ae7c135de79e4595a9b408dd"
      values.$pastUpgrades.4.2:
+        ["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]
      values.$pastUpgrades.4.1:
-        ["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]
+        "0xd71afcf98347af3e96dc8ba6a61c4c9cdbb213e82893639945a1b8d4ab51d9e2"
      values.$pastUpgrades.3.2:
+        ["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]
      values.$pastUpgrades.3.1:
-        ["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]
+        "0x361b7193ffb8462e6ccb8a6237cbbf67f3367a08a9e8f781ac245f8b72c5783c"
      values.$pastUpgrades.2.2:
+        ["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]
      values.$pastUpgrades.2.1:
-        ["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]
+        "0x7a4bc7d90aada3516e4fc057714f46e5b25dcaf4c2524e49148f5c317a04b149"
      values.$pastUpgrades.1.2:
+        ["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]
      values.$pastUpgrades.1.1:
-        ["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]
+        "0x0cd2756ab739a46f966c013e709225d6e5e8a10f30bc0842b207205f6aa32670"
      values.$pastUpgrades.0.2:
+        ["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]
      values.$pastUpgrades.0.1:
-        ["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]
+        "0x1f191abb3e293e615df529fef0c7f1f0a9c5a9dacd44154c47df269d2a68d8b8"
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]
      values.$pastUpgrades.0.1:
-        ["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]
+        "0x291ee8bccd951b70182aee107393bc15fe0f12aa49d9759b196040f8c7ba219b"
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]
      values.$pastUpgrades.5.1:
-        ["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]
+        "0xd5a418a542f27929f6bbf34f70ce62607626d83b8503bda49bcef3e5e0591ce9"
      values.$pastUpgrades.4.2:
+        ["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]
      values.$pastUpgrades.4.1:
-        ["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]
+        "0x883ba2edf63b460976d0de98a7089f3ea4d0a26257cfeb94af96d557e8e02f25"
      values.$pastUpgrades.3.2:
+        ["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]
      values.$pastUpgrades.3.1:
-        ["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]
+        "0x6d3f1f876d002a58b8c95bc7ebcbd107bae9d1474e9e92125d83b4bec578a2da"
      values.$pastUpgrades.2.2:
+        ["0x752A9e96e8683400ae238270C97c1D0160861fEF"]
      values.$pastUpgrades.2.1:
-        ["0x752A9e96e8683400ae238270C97c1D0160861fEF"]
+        "0x580899ecfd63515c52fec86f09211a5c68fc6945256cd13ef45f5e4fc8aaba61"
      values.$pastUpgrades.1.2:
+        ["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]
      values.$pastUpgrades.1.1:
-        ["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]
+        "0xc3bf11577e383e1292663bd254b218f4c4f4d9dd682a6d51f2a7149eb0991420"
      values.$pastUpgrades.0.2:
+        ["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]
      values.$pastUpgrades.0.1:
-        ["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]
+        "0x36e5d0f595838f33403445a5570b731087b16f2d7cb133aeb584f1ac1d444e3d"
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]
      values.$pastUpgrades.1.1:
-        ["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]
+        "0x190291e3c01fd074908fb41309a0438c8458d7b7f0f659dcfc5d9dbb5ea3807f"
      values.$pastUpgrades.0.2:
+        ["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]
      values.$pastUpgrades.0.1:
-        ["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]
+        "0xd8f65ce63f16eefd8816d0faa6c975cb1422ef4d6bbb58bd8e7507fb27b2dc5f"
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]
      values.$pastUpgrades.1.1:
-        ["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]
+        "0x67612f4676f3c141f8360be940caf971519f9bf1265465f94a6c13ed1e64adca"
      values.$pastUpgrades.0.2:
+        ["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]
      values.$pastUpgrades.0.1:
-        ["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]
+        "0xd83a1e2513ffd001193b5d56264f9a3acce5eb31ccd7f122256afa5505c3213d"
    }
```

Generated with discovered.json: 0x56312b08d1c137713e20f36913e328b2e18c72f8

# Diff at Mon, 14 Oct 2024 10:50:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xcd8bce7612cc46b4eb6dae7d913880fdd47ee8fcd03d90bd5d99fe145638685c"]
    }
```

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x90a8fe0eeb8f61a691fd579cb10499f4fd9167497e9aeab3b1ce4f6427fabc96"]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xd67e23441d8b22dcf363c048ad14a86a4de64b242cb242fd7ef0fa11da2cb6ff"]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xbda27aaf69ce4f365f73f0436a7e06bffede3a693579569ec42ae41718b94c75"]
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xc18d3818f9e809ced3dcce60fbe4287220ce2fced4f6c66711de5e704738bb9a"]
    }
```

```diff
    contract DeBridgeToken (0xCAceBE8c354b70Fa6E3107f3F6F699e4Fbb3A98B) {
    +++ description: None
      sourceHashes:
+        ["0x13def2c5fc95163873f1d15d260b9e03ac811bd830b6ed282e527268e3ca7759"]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

Generated with discovered.json: 0xcc37d0b5927f57a7bfcca5b67187d28a067d781f

# Diff at Tue, 01 Oct 2024 10:50:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T15:36:30.000Z",["0xB1A20D1c885fd775df97396397d6f8F07Abdd20D"]],["2021-12-16T14:53:55.000Z",["0xFCe0502293dCacbFc2d663f7814b2771dEcfd576"]],["2022-01-18T09:29:57.000Z",["0x51bFD427D06B2a5FC3588f9d023994A9f70e0Ce0"]],["2022-02-16T13:27:21.000Z",["0xc8550d85759BAbE6851235212563Fa2Ff04961BF"]],["2022-03-15T12:17:48.000Z",["0x24455aa55DED7728783c9474bE8eA2f5C935f8EB"]],["2022-12-15T10:58:59.000Z",["0x797161BCC625155D2302251404ccB93c2632658e"]]]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T20:43:22.000Z",["0x4c7CA8fcFFE77281A8B81D4580CFf8257d785491"]]]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T23:54:37.000Z",["0x4e446b6Cf4d127827c83Ca0c848Db0B43841c391"]],["2022-01-18T09:32:02.000Z",["0xd5317E82BFEFf70b4773f0fcab5e2ABFA3c7D63b"]],["2022-02-16T12:55:04.000Z",["0x752A9e96e8683400ae238270C97c1D0160861fEF"]],["2022-05-02T14:08:42.000Z",["0x0C4B79205F6Cc20c0E0201b61b99e77F3CE3B67A"]],["2022-05-19T13:24:39.000Z",["0xe5a04b307B31Af07F4DfCaA840952Ff7d3845c7e"]],["2022-05-28T12:04:47.000Z",["0xBd3d657AE87671eC6f8D6272A9f431a7c4a9B6f8"]]]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-22T22:58:34.000Z",["0x2a3e72eD893b5958690e16c3BBe1BD92137b6250"]],["2021-12-17T11:09:26.000Z",["0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4"]]]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-23T07:17:24.000Z",["0x27406EbF0b76923d93b4C6c6224bCaB7fFf11f87"]],["2022-02-16T12:53:26.000Z",["0x37a52ddb753c924f8C914de65ef00b5210Caa83C"]]]
    }
```

Generated with discovered.json: 0x7d79e2d69c93c74c05856e4aaf1e5fa49701aa6e

# Diff at Fri, 30 Aug 2024 07:51:51 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xde56002fbef5f5aaa8156ca51c09c6a39036544e

# Diff at Fri, 23 Aug 2024 09:51:52 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4ddc94444b30e4de717b40d2aa458862856ca290

# Diff at Wed, 21 Aug 2024 10:02:37 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract DeBridgeGate (0x43dE2d77BF8027e25dBD179B491e8d64f38398aA) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract DeBridgeTokenDeployer (0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract CallProxy (0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SignatureVerifier (0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract SimpleFeeProxy (0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xE4427af3555CD9303D728C491364FAdFDD7494Fe","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","via":[]},{"permission":"upgrade","target":"0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","via":[]},{"permission":"upgrade","target":"0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","via":[]},{"permission":"upgrade","target":"0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","via":[]},{"permission":"upgrade","target":"0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","via":[]}]
    }
```

Generated with discovered.json: 0x7a5b0751cc93b478d827595729c278e302cbf4b0

# Diff at Fri, 09 Aug 2024 11:59:07 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
+        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
      assignedPermissions.upgrade.3:
-        "0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"
+        "0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"
      assignedPermissions.upgrade.2:
-        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
+        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
      assignedPermissions.upgrade.1:
-        "0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824"
+        "0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464"
    }
```

Generated with discovered.json: 0xe26b5f1f4100a80a7834bb9a137a63ab5b73bf24

# Diff at Fri, 09 Aug 2024 10:09:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531527
- current block number: 19531527

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531527 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        5
      values.$members:
+        ["0xbA7cE717928A6C51ab530aD9AdB69bA6E76D09B5","0xC351f905d810Cb33c54fE771e1bE4ec5A5048c2D","0xD4Aa80C7a35B2C996Ef3F83baf91D5721c86dA2C","0x874B1d14bF4FE455C9eCAcDf66b629e10664c6E1","0xE9666D80e5617bA1470E2cA09F2D9B0C8CCd56B7","0x6f572a24c5C009fC8C844Fab5352edf79F132FBD","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x360f6cF86D3ed3c77E79dA6cE374aff842DfB0A0","0xd725E456D5beD8275E297C4Dd11135e3C5cDe544","0x24C0E1C19c8eC997b781dF4B4A0f812aE9667c96"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xE4427af3555CD9303D728C491364FAdFDD7494Fe) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636"]
      assignedPermissions.upgrade:
+        ["0x43dE2d77BF8027e25dBD179B491e8d64f38398aA","0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824","0x8244d6Ffe0695B30b2bAD424683Ee3bc534Ea464","0xC2bAC0DB5B18B0c3225581Ba14BD0B448c623636","0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c"]
    }
```

Generated with discovered.json: 0x34f9ac97eab2ad6732a9a06b5a7ee8bd82790948

# Diff at Thu, 28 Mar 2024 08:50:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18168455
- current block number: 19531527

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18168455 (main branch discovery), not current.

```diff
    contract Admin Multisig (0x6bec1faF33183e1Bc316984202eCc09d46AC92D5) {
    +++ description: None
      upgradeability.threshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract GnosisSafe (0xa0D6062Be29710c666aE850395Ac1A2AeCd14885) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

