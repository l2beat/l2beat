Generated with discovered.json: 0xe34461322774a5b2afee4b3aeb9dbe9faa71d9c0

# Diff at Fri, 24 Jul 2026 08:38:05 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1784626795
- current timestamp: 1784882216

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784626795 (main branch discovery), not current.

```diff
    contract SafeL2 (robinhood:0x3A0C507Cc7F8785C877359ad49d0476966d17a1C) [GnosisSafe] {
    +++ description: None
      deployerAddress:
+        "robinhood:0xBa86e3b54E3Ee00185EccB41ff40FC3d5Ee79ecA"
      sinceTimestamp:
+        1782749824
      sinceBlock:
+        460358
    }
```

```diff
    contract ProxyAdmin (robinhood:0xa3Acd31AFb851B4eB9DAD00F5204c01D924267dF) [global/ProxyAdmin] {
    +++ description: None
      deployerAddress:
+        "robinhood:0xBA7c7F9e20A1F6e11815D4Af08D911B21cb391Fd"
      sinceTimestamp:
+        1777567931
      sinceBlock:
+        2
    }
```

```diff
    contract NVIDIA • Robinhood Token (robinhood:0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC) [robinhood/rwa] {
    +++ description: ERC-20-compatible Robinhood Stock Token logic. Transfers, approvals and permits are permissionless for addresses that are not blocked in the shared AccessControlsRegistry; there is no onchain KYC or allowlist. The registry's roles can mint, burn arbitrary holders' balances, confiscate balances even while paused or blocked, pause this token or all tokens, change metadata and the UI multiplier, and upgrade the shared beacon implementation.
      deployerAddress:
+        "robinhood:0x5516B3451d4d6C9f63353Fe7Bc9537477ECCE000"
      sinceTimestamp:
+        1781031216
      sinceBlock:
+        45898
    }
```

```diff
    contract AccessControlsRegistry (robinhood:0xe10b6f6B275de231345c20D14Ab812db62151b00) [robinhood/accessControlsRegistry] {
    +++ description: Shared access-control registry and upgrade beacon for Robinhood Stock Tokens. Its roles apply across every token implementation that points to this registry: they control upgrades, global and per-token pauses, the shared blocklist, issuance, arbitrary holder burns, metadata and UI multipliers.
      deployerAddress:
+        "robinhood:0x074377a78A9710A1D47244f89797718b4f491279"
      sinceTimestamp:
+        1779401804
      sinceBlock:
+        7662
    }
```

Generated with discovered.json: 0x936c2f40238f505a040b9a4962fb955524287753

# Diff at Tue, 21 Jul 2026 11:00:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@99b417edd2cb262b6c8d01375e81bf5aac874a53 block: 1784626795
- current timestamp: 1784626795

## Description

Config change: remove category to suppress EOA warning for the non-critical infra.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784626795 (main branch discovery), not current.

```diff
    contract NVIDIA • Robinhood Token (robinhood:0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC) [robinhood/rwa] {
    +++ description: ERC-20-compatible Robinhood Stock Token logic. Transfers, approvals and permits are permissionless for addresses that are not blocked in the shared AccessControlsRegistry; there is no onchain KYC or allowlist. The registry's roles can mint, burn arbitrary holders' balances, confiscate balances even while paused or blocked, pause this token or all tokens, change metadata and the UI multiplier, and upgrade the shared beacon implementation.
      category:
-        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract AccessControlsRegistry (robinhood:0xe10b6f6B275de231345c20D14Ab812db62151b00) [robinhood/accessControlsRegistry] {
    +++ description: Shared access-control registry and upgrade beacon for Robinhood Stock Tokens. Its roles apply across every token implementation that points to this registry: they control upgrades, global and per-token pauses, the shared blocklist, issuance, arbitrary holder burns, metadata and UI multipliers.
      category:
-        {"name":"External Bridges","priority":1}
    }
```

Generated with discovered.json: 0xac11c67683467da72879642314dd59ea8cc02ea0

# Diff at Tue, 21 Jul 2026 09:46:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a47a1d8f7eea1d688c970ecc68d520c3181de8f block: 1784556704
- current timestamp: 1784626795

## Description

Config: add rwa access control contract to the monitoring.

## Watched changes

```diff
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A] {
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
      values.filteredTransactionsAdded:
-        6086
+        6087
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784556704 (main branch discovery), not current.

```diff
    EOA  (robinhood:0x0000000000000000000000000000000000000000) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"robinhood:0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract NVIDIA • Robinhood Token (robinhood:0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC) [robinhood/rwa]
    +++ description: ERC-20-compatible Robinhood Stock Token logic. Transfers, approvals and permits are permissionless for addresses that are not blocked in the shared AccessControlsRegistry; there is no onchain KYC or allowlist. The registry's roles can mint, burn arbitrary holders' balances, confiscate balances even while paused or blocked, pause this token or all tokens, change metadata and the UI multiplier, and upgrade the shared beacon implementation.
```

```diff
+   Status: CREATED
    contract AccessControlsRegistry (robinhood:0xe10b6f6B275de231345c20D14Ab812db62151b00) [robinhood/accessControlsRegistry]
    +++ description: Shared access-control registry and upgrade beacon for Robinhood Stock Tokens. Its roles apply across every token implementation that points to this registry: they control upgrades, global and per-token pauses, the shared blocklist, issuance, arbitrary holder burns, metadata and UI multipliers.
```

Generated with discovered.json: 0x0f00f51906b21f7041f0a11a84c72d1af63e2103

# Diff at Mon, 20 Jul 2026 14:13:02 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@b461afee5f10587a00295a471b2542eba2686ebb block: 1784044401
- current timestamp: 1784556704

## Description

Recent transaction-filtering increase due to a single wallet being blocked — the
honeypot behind the fake "Robinhood founder seed-phrase leak". Filtered
transactions rose from 278 to 6,086; none have been reversed.

Added the L1 timelock ProxyAdmin (OpenZeppelin v5.0.0) to the ProxyAdmin template.

## Watched changes

```diff
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A] {
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
      values.filteredTransactionsAdded:
-        278
+        6086
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784044401 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x4e393071053C5d95771b1B716857d65cdf5B1839) [global/ProxyAdmin] {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465","role":"admin"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465","role":"admin"}]
    }
```

```diff
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"eth:0x4e393071053C5d95771b1B716857d65cdf5B1839","role":".owner"}
    }
```

```diff
    contract Safe (eth:0x7Ae50886c7EA0394613aa7Dcc287a5c9650784b6) [GnosisSafe] {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465","role":"admin","via":[{"address":"eth:0x4e393071053C5d95771b1B716857d65cdf5B1839"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
    }
```

```diff
    contract TimelockController (eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465) [global/TimelockController] {
    +++ description: A timelock with access control. The current minimum delay is 7d.
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465","role":"admin","via":[{"address":"eth:0x4e393071053C5d95771b1B716857d65cdf5B1839"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
    }
```

```diff
    contract SafeL2 (robinhood:0x4C0360aFedD31e53718e4343F95E40b692402462) [GnosisSafe] {
    +++ description: None
      deployerAddress:
+        "robinhood:0xcFDab226f6DF33cd364Ff8E617bEB5Fe54E84Ebe"
      sinceTimestamp:
+        1782841228
      sinceBlock:
+        615418
    }
```

```diff
    contract TimelockController (robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173) [global/TimelockController] {
    +++ description: A timelock with access control. The current minimum delay is 7d.
      deployerAddress:
+        "robinhood:0xcFDab226f6DF33cd364Ff8E617bEB5Fe54E84Ebe"
      sinceTimestamp:
+        1782841253
      sinceBlock:
+        615454
    }
```

Generated with discovered.json: 0x444b94e2ff7a4ceaf6cbbd1a0604446941743a25

# Diff at Tue, 14 Jul 2026 15:55:02 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@40c68fc8d6e39f5b4f69bb2e62b69938a949b435 block: 1783461693
- current timestamp: 1784044401

## Description

The ArbFilteredTransactionsManager now reports 278 added filtered transaction
hashes, up from 2 in the previous discovery. No filtered transaction hash has
been deleted. Transaction filtering is active: an authorized filterer can register
a transaction hash and make the state transition fail that transaction, including
one force-included from L1.

Governance was restructured on both L1 and L2:

- The single 2-of-3 admin multisig was replaced by a 7-of-8 multisig and a
  7-day timelock. The 7-of-8 multisig remains a direct executor, so upgrades can
  still bypass the timelock delay.
- A separate 6-of-8 multisig can propose and cancel timelock actions.
- The timelock and its admin contracts are now verified on Etherscan and
  Blockscout.

## Watched changes

```diff
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe] {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x23A19d23e89166adedbDcB432518AB01e4272D94","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x23A19d23e89166adedbDcB432518AB01e4272D94","role":"admin","via":[{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]},{"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}]
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":".executors"}]
    }
```

```diff
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      values.accessControl.EXECUTOR_ROLE.members.0:
+        "eth:0x7Ae50886c7EA0394613aa7Dcc287a5c9650784b6"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5"
+        "eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465"
      values.executors.0:
+        "eth:0x7Ae50886c7EA0394613aa7Dcc287a5c9650784b6"
      values.executors.0:
-        "eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5"
+        "eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465"
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465","description":"manage all access control roles.","role":".defaultAdminAC"}
    }
```

```diff
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A] {
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
      values.filteredTransactionsAdded:
-        2
+        278
    }
```

```diff
-   Status: DELETED
    contract SafeL2 (robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
    contract L2UpgradeExecutor (robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09) [orbitstack/UpgradeExecutor] {
    +++ description: ArbOS chain owner (UpgradeExecutor). Manages the ArbOwner chain-owner set and the transaction-filterer set, and can upgrade ArbOS configuration without delay.
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "robinhood:0x6b9F63817F1442e40Bb9c3C2207758934C323FdC"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5"
+        "robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173"
      values.executors.1:
+        "robinhood:0x6b9F63817F1442e40Bb9c3C2207758934C323FdC"
      values.executors.1:
-        "robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5"
+        "robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173"
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"robinhood:0x672Da8B43058D1bC78956d71d9A208E168E2a3EF","role":".owner"}
      directlyReceivedPermissions.3:
+        {"permission":"interact","from":"robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173","description":"manage all access control roles.","role":".defaultAdminAC"}
    }
```

```diff
    EOA  (robinhood:0x663703B4bC1F5e896Af2854548d6380F45F1C5D0) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173","description":"manage all access control roles.","role":".defaultAdminAC","via":[{"address":"robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173","role":"admin","via":[{"address":"robinhood:0x672Da8B43058D1bC78956d71d9A208E168E2a3EF"},{"address":"robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09"}]}
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x0fc5c64074641e677Fb86bCE80303a2eE64344Ac) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4e393071053C5d95771b1B716857d65cdf5B1839) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x7Ae50886c7EA0394613aa7Dcc287a5c9650784b6) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xbFc2b53552513174A0B006D4799B39871fe0CA1d) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0xE1e825D15192457d05a251715C3e2Cab0F8CF465) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 7d.
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x3A0C507Cc7F8785C877359ad49d0476966d17a1C) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x4C0360aFedD31e53718e4343F95E40b692402462) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (robinhood:0x560C81fe78FcC276e460524428f1a62057Ca8173) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 7d.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (robinhood:0x672Da8B43058D1bC78956d71d9A208E168E2a3EF) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x6b9F63817F1442e40Bb9c3C2207758934C323FdC) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
...:0x4e393071053C5d95771b1B716857d65cdf5B1839.sol |  184 +++
 ...:0x672Da8B43058D1bC78956d71d9A208E168E2a3EF.sol |  189 +++
 .../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1216 +++++++++++++++
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1216 +++++++++++++++
 .../SafeProxy.p.sol                                |   42 +
 .../Safe.sol                                       | 1216 +++++++++++++++
 .../SafeProxy.p.sol                                |   42 +
 .../SafeL2.sol                                     |    0
 .../SafeProxy.p.sol                                |   42 +
 .../SafeL2.sol                                     | 1286 ++++++++++++++++
 .../SafeProxy.p.sol                                |   42 +
 .../SafeL2.sol                                     | 1286 ++++++++++++++++
 .../SafeProxy.p.sol                                |   42 +
 .../TimelockControllerUpgradeable.sol              | 1577 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 1038 +++++++++++++
 .../TimelockControllerUpgradeable.sol              | 1577 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 1038 +++++++++++++
 20 files changed, 12033 insertions(+)
```

Generated with discovered.json: 0xd4ee2b65c075a2e41ae1b9b1350dde933a74c0ac

# Diff at Tue, 07 Jul 2026 22:02:36 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1fd9d39064602bc28714717ec6eae23c740b472b block: 1782988636
- current timestamp: 1783461693

## Description

ProxyAdmin, Inbox and the eight upgradeable proxies became verified on Etherscan; the permission view now shows the upgrade chain through ProxyAdmin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1782988636 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD) [global/ProxyAdmin] {
    +++ description: None
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin"},{"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin"},{"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin"},{"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin"},{"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin"},{"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin"},{"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin"},{"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin"},{"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin"},{"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin"}]
      values.owner:
+        "eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"
      implementationNames.eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin"},{"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin"},{"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin"},{"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin"},{"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin"},{"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin"},{"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin"},{"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin"},{"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin"},{"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin"}]
    }
```

```diff
    contract Inbox (eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
    }
```

```diff
    contract RollupProxy (eth:0x23A19d23e89166adedbDcB432518AB01e4272D94) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xceae1f18c42f53fe2c8af2f1e6997f71f806199ea36af2e17279efdb25f798a6"
      implementationNames.eth:0x23A19d23e89166adedbDcB432518AB01e4272D94:
-        ""
+        "RollupProxy"
    }
```

```diff
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD","role":".owner"}
      implementationNames.eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract EdgeChallengeManager (eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa) [orbitstack/EdgeChallengeManager] {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract RollupEventInbox (eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Bridge (eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Outbox (eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
+   Status: CREATED
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A]
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09) [orbitstack/UpgradeExecutor]
    +++ description: ArbOS chain owner (UpgradeExecutor). Manages the ArbOwner chain-owner set and the transaction-filterer set, and can upgrade ArbOS configuration without delay.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (robinhood:0xa3Acd31AFb851B4eB9DAD00F5204c01D924267dF) [global/ProxyAdmin]
    +++ description: None
```

Generated with discovered.json: 0x1e2edb2d1a274576e1bfa40dd36649d8608e749a

# Diff at Mon, 06 Jul 2026 12:22:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1783340534

## Description

Adds L2 (robinhood chain) discovery of the ArbOS 61 transaction-filtering
mechanism, its authorized filterers, and the L2-side governance that controls it.

- **ArbFilteredTransactionsManager** (`robinhood:0x…74`) — the ArbOS 61
  transaction-filtering precompile. `filteredTransactionsAdded = 2`,
  `filteredTransactionsDeleted = 0`: two transactions are currently on the
  censored list. The state transition function forcibly fails a filtered
  transaction, including one force-included via the L1 delayed inbox, without
  delay. Its `transactionFilterers` set holds the addresses authorized to
  register/remove entries here. Precompiles have no verifiable on-chain
  bytecode, so its source is pointed at the Nitro implementation.
- **TransactionFilterer** (`robinhood:0xebDc…24b7`) — EOA authorized to
  register/remove transaction hashes in the precompile above.
- **L2UpgradeExecutor** (`robinhood:0x2A15…5C09`) — the sole ArbOS chain owner,
  which can add or remove transaction filterers.
- **SafeL2** (`robinhood:0x1F3B…31C5`) — the 2-of-3 Gnosis Safe holding
  `EXECUTOR_ROLE` on the L2UpgradeExecutor (same address as the L1 governance Safe).
- **ProxyAdmin** (`robinhood:0xa3Ac…67dF`) — admin of the L2UpgradeExecutor proxy.

## Changes

```diff
+   Status: CREATED
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A]
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09) [orbitstack/UpgradeExecutor]
    +++ description: ArbOS chain owner (UpgradeExecutor). Manages the ArbOwner chain-owner set and the transaction-filterer set, and can upgrade ArbOS configuration without delay.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (robinhood:0xa3Acd31AFb851B4eB9DAD00F5204c01D924267dF) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA TransactionFilterer (robinhood:0xebDc18A1F5C42fC25552eA233fAcf4054DF224b7)
    +++ description: None
```

Generated with discovered.json: 0x2c1745b43c2422d989b78335e3a9218864c2a226

# Diff at Thu, 02 Jul 2026 10:38:22 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1782988636

## Description

Initial discovery.

The chain uses ArbOS 61 core contracts, newer builds of standard Orbit contracts.

- **SequencerInbox** — [diff](https://disco.l2beat.com/diff/eth:0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7/eth:0xb015D78fb9B890e96FD3E23819b2C8D9fffA3cC5)
  Adds an owner-only `setFeeTokenPricer` (inert here: `isUsingFeeToken=false`, `feeTokenPricer=0x0`), a custom-DA header flag (`0x01`, unused — chain posts blobs), and delay-proof paths. No new actors beyond the existing owner/batchPoster.
- **RollupProxy (RollupAdminLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x7FC126FF51183a78C5E0437467f325f661D8Df17/eth:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82)
  ArbOS 61 admin logic; all setters (allowlist, fee-token, batch-poster mgr, AFK-whitelist) stay owner-gated — covered by the template `owner` permission.
- **RollupProxy (RollupUserLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x6490bA0a60Cc7d3a59C9eeE135D9eeD24553a60d/eth:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C)
  ArbOS 61 user logic; BoLD assertion/force-inclusion flow and `getValidators` proposer set unchanged.
- **RollupEventInbox** — [diff](https://disco.l2beat.com/diff/eth:0x6D576E220Cb44C3E8eF75D0EfBeb1Ff041e2E4A5/eth:0x796FeE4adceD1cb47a3e3d1B6925472F8fC8f1f9)
  BoLD event inbox; only `initialize` is rollup-gated, no standing permissions.
- **OneStepProofEntry** — [diff](https://disco.l2beat.com/diff/eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC/eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D)
  Proof dispatcher (ArbOS 61 opcode set); immutable constructor-set prover addresses, no mutable state, no permissions.
- **OneStepProver0** — [diff](https://disco.l2beat.com/diff/eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5/eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c)
  Stateless one-step WASM verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMath** — [diff](https://disco.l2beat.com/diff/eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD/eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114)
  Stateless math-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMemory** — [diff](https://disco.l2beat.com/diff/eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB/eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35)
  Stateless memory-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverHostIo** — [diff](https://disco.l2beat.com/diff/eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4/eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf)
  Host-io verifier (ArbOS 61 host-io/opcode updates); immutable `customDAValidator` (`0x0` here, so custom-DA proof paths revert), no mutable state, no permissions.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D) [orbitstack/Inbox]
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x23A19d23e89166adedbDcB432518AB01e4272D94) [orbitstack/RollupProxyBoLD]
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114) [orbitstack/OneStepProverMath]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D) [orbitstack/OneStepProofEntry]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor]
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35) [orbitstack/OneStepProverMemory]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB) [orbitstack/GatewayRouter]
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa) [orbitstack/EdgeChallengeManager]
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c) [orbitstack/OneStepProver0]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0) [orbitstack/ERC20Gateway]
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [orbitstack/SequencerInbox]
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4) [orbitstack/RollupEventInbox]
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Bridge (eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3) [orbitstack/Bridge]
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf) [orbitstack/OneStepProverHostIo]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9) [orbitstack/Outbox]
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract L1WethGateway (eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B) [N/A]
    +++ description: None
```
