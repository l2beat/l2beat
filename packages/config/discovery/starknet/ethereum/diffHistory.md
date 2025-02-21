Generated with discovered.json: 0x45e431692ef478029d25c7ea048f6302fbece42a

# Diff at Wed, 19 Feb 2025 16:19:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db146cf0a2ae2ee66e75c589f22ad2e266fe95a9 block: 21872746
- current block number: 21881526

## Description

give SECURITY_AGENT permission (can limit withdrawals) to the StarkgateSecurityAgentMultisig in some bridges.

## Watched changes

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872746 (main branch discovery), not current.

```diff
    contract StarkgateSecurityAgentMultisig (0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5) {
    +++ description: None
      name:
-        "StarkgateETHSecurityAgentMultisig"
+        "StarkgateSecurityAgentMultisig"
    }
```

Generated with discovered.json: 0x29be27d9add222db7f9524fc4f59c2a719f8b786

# Diff at Tue, 18 Feb 2025 10:46:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21829283
- current block number: 21872746

## Description

StarkgateETHSecurityAgentMultisig threshold = 1.

## Watched changes

```diff
    contract StarkgateETHSecurityAgentMultisig (0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5) {
    +++ description: None
      values.$threshold:
-        2
+        1
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "1 of 3 (33%)"
    }
```

Generated with discovered.json: 0x05d59101790c6bc4d07b88f4a179106d1bc46dab

# Diff at Wed, 12 Feb 2025 08:41:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21786555
- current block number: 21829283

## Description

Grant some bridge roles to the StarkgateBridgeMultisig, who already had all admin roles (does not change permissions).
Grant an EOA the permission to remove and blacklist tokens from the Starkgate bridge.

## Watched changes

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      values.accessControl.APP_ROLE_ADMIN.members.0:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.TOKEN_ADMIN.members.0:
+        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      values.accessControl.APP_ROLE_ADMIN.members.0:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.TOKEN_ADMIN.members.0:
+        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
    }
```

```diff
    contract StarknetAdminMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      values.$members.5:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.$members.4:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.$members.3:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.$members.2:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
      values.$members.1:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
      values.$members.0:
-        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
+        "0x8e814672F5c559b15af2975fBf6Fab819A4B7Dd5"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 6 (33%)"
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      values.$pastUpgrades.6:
+        ["2025-02-09T12:58:23.000Z","0xccb802ed2caee6856e9141983a642a0d4881cd64a209436d3fdeb4776c841175",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        6
+        7
      values.accessControl.SECURITY_ADMIN.members.0:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

Generated with discovered.json: 0xf1e5fed307b8635c5552bff67a9b591c1abb4c1d

# Diff at Thu, 06 Feb 2025 09:33:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21778537
- current block number: 21786555

## Description

Added SC.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x83C0A700114101D1283D1405E2c8f21D3F03e988","via":[]}
      issuedPermissions.0.to:
-        "0x83C0A700114101D1283D1405E2c8f21D3F03e988"
+        "0x15e8c684FD095d4796A0c0CF678554F4c1C7C361"
      values.$admin:
-        "0x83C0A700114101D1283D1405E2c8f21D3F03e988"
+        ["0x83C0A700114101D1283D1405E2c8f21D3F03e988","0x15e8c684FD095d4796A0c0CF678554F4c1C7C361"]
      values.governors.1:
+        "0x15e8c684FD095d4796A0c0CF678554F4c1C7C361"
    }
```

```diff
+   Status: CREATED
    contract StarknetSecurityCouncil (0x15e8c684FD095d4796A0c0CF678554F4c1C7C361)
    +++ description: None
```

## Source code changes

```diff
.../.flat/StarknetSecurityCouncil/Safe.sol         | 1088 ++++++++++++++++++++
 .../.flat/StarknetSecurityCouncil/SafeProxy.p.sol  |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0x99f128e8053ca8b32bccf74a8aa15f2e0a07625f

# Diff at Wed, 05 Feb 2025 06:38:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24a3610845e7ae2b3cc2daf90feff25e498e4068 block: 21765269
- current block number: 21778537

## Description

Multisig added as operator.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.operators.1:
-        "0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7"
+        "0xF6b0B3e8f57396CecFD788D60499DB49Ee6AbC6B"
      values.operators.0:
-        "0xFf6B2185E357b6e9136A1b2ca5d7C45765D5c591"
+        "0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7"
    }
```

```diff
+   Status: CREATED
    contract StarknetOperatorMultisig (0xF6b0B3e8f57396CecFD788D60499DB49Ee6AbC6B)
    +++ description: None
```

## Source code changes

```diff
.../.flat/StarknetOperatorMultisig/Safe.sol        | 1088 ++++++++++++++++++++
 .../.flat/StarknetOperatorMultisig/SafeProxy.p.sol |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xd63083b31c120e6eaa19d4fff58d8b9323daf233

# Diff at Mon, 03 Feb 2025 12:59:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3a66ce5694d8c3f9dfc80675eaa6c0bc1a2489b3 block: 21715743
- current block number: 21765269

## Description

Admin EOAs were removed from Starknet and SHARP governance. The other permissions remain the same as before (Multisigs mostly). 

## Watched changes

```diff
    contract StarkgateBridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0xf76e6bF9e2df09D0f854F045A3B724074dA1236B"}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb"}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"}
      receivedPermissions.9.from:
-        "0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"
+        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
      receivedPermissions.8.from:
-        "0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"
+        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
      receivedPermissions.7.from:
-        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
+        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
      receivedPermissions.6.from:
-        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
+        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
      receivedPermissions.5.from:
-        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
+        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
      receivedPermissions.4.from:
-        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
+        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
      receivedPermissions.3.from:
-        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
+        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
      receivedPermissions.2.from:
-        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
+        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
      receivedPermissions.1.from:
-        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
+        "0x1268cc171c54F2000402DfF20E93E60DF4c96812"
      receivedPermissions.0.from:
-        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
+        "0x0c5aE94f8939182F2D06097025324D1E537d5B60"
    }
```

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.$admin:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.APP_ROLE_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      values.accessControl.TOKEN_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.$admin:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xC91EC49Ad0843E5Cca55b4c4e5f68de54F6cB2Ae","via":[]}
      values.$admin:
-        ["0xC91EC49Ad0843E5Cca55b4c4e5f68de54F6cB2Ae","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263","via":[]}
      values.$admin:
-        ["0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263","0x83C0A700114101D1283D1405E2c8f21D3F03e988"]
+        "0x83C0A700114101D1283D1405E2c8f21D3F03e988"
      values.governors.1:
-        "0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd"
      values.governors.0:
-        "0x16C8B90390468c1AA81f68B2Fb9fcc3d46e0eA3E"
+        "0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd"
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.$admin:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.APP_GOVERNOR.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      values.accessControl.APP_ROLE_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      issuedPermissions.0.to:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.$admin:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715743 (main branch discovery), not current.

```diff
    contract StarkgateBridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      name:
-        "BridgeMultisig"
+        "StarkgateBridgeMultisig"
    }
```

```diff
    contract StarknetAdminMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      name:
-        "ProxyMultisig"
+        "StarknetAdminMultisig"
    }
```

```diff
    contract StarknetOpsMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      name:
-        "ImplementationMultisig"
+        "StarknetOpsMultisig"
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      fieldMeta.isFinalized:
+        {"severity":"HIGH","description":"Finalizes most of the configuration of the Starknet contract, which cannot be changed afterwards (only thorugh an upgrade)."}
    }
```

Generated with discovered.json: 0x0ef342a524fe078de93e3c7066c59a6d6b0a45d7

# Diff at Mon, 27 Jan 2025 12:20:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21635833
- current block number: 21715743

## Description

MakerDAO Governance removed from disco, unused.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635833 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract MakerDAO Governance (0x0a3f6849f78076aefaDf113F5BED87720274dDC0)
    +++ description: None
```

Generated with discovered.json: 0xb9503031051fa02f99e862e89799c59f17f066ff

# Diff at Mon, 20 Jan 2025 11:10:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635833
- current block number: 21635833

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635833 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"
      receivedPermissions.9.from:
+        "0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"
      receivedPermissions.8.target:
-        "0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"
      receivedPermissions.8.from:
+        "0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"
      receivedPermissions.7.target:
-        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
      receivedPermissions.7.from:
+        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
      receivedPermissions.6.target:
-        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
      receivedPermissions.6.from:
+        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
      receivedPermissions.5.target:
-        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
      receivedPermissions.5.from:
+        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
      receivedPermissions.4.target:
-        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
      receivedPermissions.4.from:
+        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
      receivedPermissions.3.target:
-        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
      receivedPermissions.3.from:
+        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
      receivedPermissions.2.target:
-        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
      receivedPermissions.2.from:
+        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
      receivedPermissions.1.target:
-        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
      receivedPermissions.1.from:
+        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
      receivedPermissions.0.target:
-        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
      receivedPermissions.0.from:
+        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
    }
```

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      issuedPermissions.0.to:
+        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      issuedPermissions.0.to:
+        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"
      receivedPermissions.0.from:
+        "0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xC91EC49Ad0843E5Cca55b4c4e5f68de54F6cB2Ae"
      issuedPermissions.1.to:
+        "0xC91EC49Ad0843E5Cca55b4c4e5f68de54F6cB2Ae"
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263"
      issuedPermissions.1.to:
+        "0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263"
      issuedPermissions.0.target:
-        "0x83C0A700114101D1283D1405E2c8f21D3F03e988"
      issuedPermissions.0.to:
+        "0x83C0A700114101D1283D1405E2c8f21D3F03e988"
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      issuedPermissions.0.to:
+        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
      issuedPermissions.0.to:
+        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      issuedPermissions.0.to:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
      issuedPermissions.0.to:
+        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
    }
```

Generated with discovered.json: 0x2628c3ddf425826024d28dd0149fd9690b0d27bd

# Diff at Mon, 20 Jan 2025 09:25:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21635833
- current block number: 21635833

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635833 (main branch discovery), not current.

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      fieldMeta.programHash.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0xfc5f74026a824d06653c797febe62bc4319357fa

# Diff at Thu, 16 Jan 2025 08:25:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21358044
- current block number: 21635833

## Description

New 'hat' role (root permission in this Maker Gov contract).

## Watched changes

```diff
    contract MakerDAO Governance (0x0a3f6849f78076aefaDf113F5BED87720274dDC0) {
    +++ description: None
      values.hat:
-        "0x329Feb1E300d6bf54d4969Df5089ff7bC79694B6"
+        "0x5985E06E47e0dd10230393e5dEF7200516262ed9"
    }
```

Generated with discovered.json: 0xb5d9d9dcd9618d5c0084c17afd27719d7febec40

# Diff at Tue, 10 Dec 2024 11:08:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21358044
- current block number: 21358044

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21358044 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract MakerDAO Governance (0x0a3f6849f78076aefaDf113F5BED87720274dDC0)
    +++ description: None
```

Generated with discovered.json: 0xe7ea72fdb3d4832eb7aa5b7eceb44fe8b6271e08

# Diff at Sun, 08 Dec 2024 13:23:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21285629
- current block number: 21358044

## Description

LidoAgent added as second SecurityAdmin of the wstETHBridge (ignored).

## Watched changes

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      values.accessControl.SECURITY_ADMIN.members.1:
+        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
    }
```

Generated with discovered.json: 0x0b06620a2094a6e93f038629a2befd2aedf38699

# Diff at Thu, 28 Nov 2024 10:33:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cba708dac9336030203b425721a33c9db2b14313 block: 21064813
- current block number: 21285629

## Description

Starknet [upgrade v0.13.3](https://community.starknet.io/t/starknet-v0-13-3/115053) with new agggregator and StarknetOS programHashes.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.aggregatorProgramHash:
-        "1161178844461337253856226043908368523817098764221830529880464854589141231910"
+        "15787695375210609250491147414005894154890873413229882671403677761527504080"
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ severity: HIGH
      values.programHash:
-        "853638403225561750106379562222782223909906501242604214771127703946595519856"
+        "2397984267054479079853548842566103781972463965746662494980785692480538410509"
      values.programHashHistory.8:
+        "853638403225561750106379562222782223909906501242604214771127703946595519856"
    }
```

Generated with discovered.json: 0xfd3de3014f3317e7380259ce06d3bf6eda73c83f

# Diff at Mon, 21 Oct 2024 11:10:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20964358
- current block number: 20964358

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20964358 (main branch discovery), not current.

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x64608BDF1867110f622391196989bF4cE37BBb33"]
      values.$pastUpgrades.0.1:
-        ["0x64608BDF1867110f622391196989bF4cE37BBb33"]
+        "0xfdb16d2b1cb55969801447ea8bc0cb00c4825ed75dcb1266a0d94c03699e7a28"
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x642F04899B6cA155c2a5eAdD4e4ed634f1B07Dd7"]
      values.$pastUpgrades.0.1:
-        ["0x642F04899B6cA155c2a5eAdD4e4ed634f1B07Dd7"]
+        "0x54e1021653aaca692f4ead2a85e5bd32648919d01953e88693a833d45c583fab"
    }
```

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.7.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.6.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.6.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.5.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.5.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x426174e7e63465569d28b3ca3e807e69859f9a2650702487260b9a45646d5f32"
      values.$pastUpgrades.4.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.4.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x64910ea21a212ae671687842ec3c4fcd187e935ddf2d6cc90f41b6d99b592964"
      values.$pastUpgrades.3.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.3.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0xb638d945b6a6feba94d6219f1618a6e279720e105d4476db19063abd4164117f"
      values.$pastUpgrades.2.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.2.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0x5bc722c79d5a4303b76638f6fc75d26c5dbfba39202c2a7ced89b96d3ead97e7"
      values.$pastUpgrades.1.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.1.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0xc450cc918a45c46057f13a072c41a646e78f52af5e36f82b7061b478e44b7fb3"
      values.$pastUpgrades.0.2:
+        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
      values.$pastUpgrades.0.1:
-        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
+        "0xeedccfe88453ea74a342ca57926a88b6033057eb15b43291332f0fa19c197eee"
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.2.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x083f442a6f6154d565fca76e15e4b7ff09a9ca6fc8efec588139a52896e67d4c"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x8a85416efb74a9a7b95f6596bbcf947bdea2e1664c1401fee191dbc35ed63b9e"
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]
      values.$pastUpgrades.6.1:
-        ["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.5.2:
+        ["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]
      values.$pastUpgrades.5.1:
-        ["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]
+        "0x1f56cc90fd40bcc00a27f94c989e93cb414a884e2fe971323426f40d58c71306"
      values.$pastUpgrades.4.2:
+        ["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]
      values.$pastUpgrades.4.1:
-        ["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]
+        "0x64910ea21a212ae671687842ec3c4fcd187e935ddf2d6cc90f41b6d99b592964"
      values.$pastUpgrades.3.2:
+        ["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]
      values.$pastUpgrades.3.1:
-        ["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]
+        "0x826f7e63249e192040d6b9301a68a0c7fc1130d06339ab0c758ff14799f9adfb"
      values.$pastUpgrades.2.2:
+        ["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]
      values.$pastUpgrades.2.1:
-        ["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]
+        "0xa31315fda290a9ee1abf459ba81a8c5986c5c9da58cda4c20a144ab16e3a9ba1"
      values.$pastUpgrades.1.2:
+        ["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]
      values.$pastUpgrades.1.1:
-        ["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]
+        "0x9b76ede78b75c332ea2ae855b62a2363c197ee521522ab1a14aa5517f2610dd5"
      values.$pastUpgrades.0.2:
+        ["0x0205172F25e791975edB4dEF203f3789B01f43bb"]
      values.$pastUpgrades.0.1:
-        ["0x0205172F25e791975edB4dEF203f3789B01f43bb"]
+        "0x4c7952f4056367ec557d94b41d0784b7eb247d1f9de7378bdff7a5218c85314d"
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.7.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.6.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.6.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.5.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.5.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xe594bd2581f3da0e554ad8664aecc1441280850cc7827a9e42d172bbf54cac5d"
      values.$pastUpgrades.4.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.4.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x64910ea21a212ae671687842ec3c4fcd187e935ddf2d6cc90f41b6d99b592964"
      values.$pastUpgrades.3.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.3.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0xac209ae933b3ae24348f926df5f8978093617c711baaceefa21b90c08c82a0af"
      values.$pastUpgrades.2.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.2.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0x33fdbe5a0d1ba784eb5e2f0f34b42d57c5c2b6b0bd3562746c7ee0447f7767aa"
      values.$pastUpgrades.1.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.1.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0x55d370d26d45d7aee7f06e7f741d5f0d37154889faa1fa4e393370cae31a0f0f"
      values.$pastUpgrades.0.2:
+        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
      values.$pastUpgrades.0.1:
-        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
+        "0x3e25166c11d40ded7d1ae272a9e4eb416b2d35a8f4919ca0a07c55f0065de787"
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.3.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.2.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.2.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x4eb13c68776e5aa840ab59c3c4ff369372fd461bab760eee12d1ae7ccf7baa6e"
      values.$pastUpgrades.0.2:
+        ["0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"]
      values.$pastUpgrades.0.1:
-        ["0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"]
+        "0xb4de1aa42c3ade894dd66e06e6125549e8004d2d6857cf456ef5bde3f583ea7c"
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.$pastUpgrades.8.2:
+        ["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]
      values.$pastUpgrades.8.1:
-        ["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]
+        "0x4186d705e39a8e7cb19069c9426e4b211fad28f97cb7f641e4bd240971318e8d"
      values.$pastUpgrades.7.2:
+        ["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]
      values.$pastUpgrades.7.1:
-        ["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]
+        "0xb9cd560bbc6f0478eeb5bed042a06d988ef6ebfd1cc9bfb509b4d8202b517ecc"
      values.$pastUpgrades.6.2:
+        ["0x16938E4b59297060484Fa56a12594d8D6F4177e8"]
      values.$pastUpgrades.6.1:
-        ["0x16938E4b59297060484Fa56a12594d8D6F4177e8"]
+        "0x640cb38b6ffa91068da7cc15730268402661ec3f62f084b2a58522f600d89277"
      values.$pastUpgrades.5.2:
+        ["0x739A654271c565839F0408546706bBea2F1FfE42"]
      values.$pastUpgrades.5.1:
-        ["0x739A654271c565839F0408546706bBea2F1FfE42"]
+        "0x861257880dfe325f603d4371a10888daa8fb0a16c205bb43647e8c5547298e36"
      values.$pastUpgrades.4.2:
+        ["0xE267213B0749Bb94c575F6170812c887330d9cE3"]
      values.$pastUpgrades.4.1:
-        ["0xE267213B0749Bb94c575F6170812c887330d9cE3"]
+        "0x6f7ff0be4f155165290702052683f0a87b5e660812949c6e10eac6602c6aa5e7"
      values.$pastUpgrades.3.2:
+        ["0x2B3B750f1f10c85c8A6D476Fc209A8DC7E4Ca3F8"]
      values.$pastUpgrades.3.1:
-        ["0x2B3B750f1f10c85c8A6D476Fc209A8DC7E4Ca3F8"]
+        "0x65e31a14e45c3f909c1f90e67b3bb9a54e256d28cb8a27432f73268a19ebab84"
      values.$pastUpgrades.2.2:
+        ["0xDC109C4a1A3084Ed15A97692FBEF3e1FB32A6955"]
      values.$pastUpgrades.2.1:
-        ["0xDC109C4a1A3084Ed15A97692FBEF3e1FB32A6955"]
+        "0x4e551f471810ea806502b1e24f9ef6793f0a0b68f24c3cdec44df444921d7689"
      values.$pastUpgrades.1.2:
+        ["0x944960b90381d76368aecE61F269bD99FFfd627e"]
      values.$pastUpgrades.1.1:
-        ["0x944960b90381d76368aecE61F269bD99FFfd627e"]
+        "0xf928abd9eb81afac14d1e8f76a52de80f9c38cbe0e72d2f1ec922caf7bf1cad0"
      values.$pastUpgrades.0.2:
+        ["0xD8Cd77206fCb239BdDaaDDdA8C87CBFe7d67Ca2b"]
      values.$pastUpgrades.0.1:
-        ["0xD8Cd77206fCb239BdDaaDDdA8C87CBFe7d67Ca2b"]
+        "0xccde4b2c417c0361ca34b8896ff8ee8a471aeab423613db8175463d903d4c2fe"
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      values.$pastUpgrades.5.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.5.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.4.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.4.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.3.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.3.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x7c5561efa149f2be36fac917f47b0b107218b43de1eac56ceb97d008257bd850"
      values.$pastUpgrades.2.2:
+        ["0x7f2a18900A978D4390a3640e34739BB697777A71"]
      values.$pastUpgrades.2.1:
-        ["0x7f2a18900A978D4390a3640e34739BB697777A71"]
+        "0xe8154cce45dafa5cfcb95d134f3da8a13c80c6546da07ca92c88d5c54286cdc3"
      values.$pastUpgrades.1.2:
+        ["0x052C81F05595B5DeF4fdFEdbD7CA7b4A8a7B50C1"]
      values.$pastUpgrades.1.1:
-        ["0x052C81F05595B5DeF4fdFEdbD7CA7b4A8a7B50C1"]
+        "0x42056631084f574f2ed5f49bef3d1aabab22008266ac97afea3e5f42649bd7c3"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x4ea20358347292f048a26277477a9f145add434e50e3f64c85f494469768c876"
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.3.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.2.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.2.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x5420188e3cc869219076d140de7359aa4b930c51263c00728bb81e3a68c1ba8c"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x90d66157a3812393338739b0ee7a84d0d310b72a8282946e5874824c60d30c51"
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.2.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x083f442a6f6154d565fca76e15e4b7ff09a9ca6fc8efec588139a52896e67d4c"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x368efd40dcf16ad376c8f38adf1e68361874e2b5b2de52d7088cd7de6b38f02a"
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.2.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x083f442a6f6154d565fca76e15e4b7ff09a9ca6fc8efec588139a52896e67d4c"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x591030492947a546e11122e42c12975237d800d3d509d284b9c8aaf541dbdc79"
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.2.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0x4a1c60505d4d6d22f51b164696b7eadba1955278a577c7e712b2cd0347bee330"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x1157d4bd2b7d00a0f9833ef0832822bc331d5f904c0c3f9f14fa7942678fbf58"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0xa67fa2a98e3b92d67fe9ea402dd53955fc2d74f6af3ee0183e20afad68ac5621"
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x594cCaDF93F860dc42Cf9fd7bCea47Ff4d135D7A"]
      values.$pastUpgrades.0.1:
-        ["0x594cCaDF93F860dc42Cf9fd7bCea47Ff4d135D7A"]
+        "0x52b4a75a83546e4e463a919cf778cb9a4882d536c4bf7b80a62098698c741fd8"
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.7.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0xcd8680d72a4b8e347cd5036a1f2ac89b3e106f7c82d705d3cfc35bb6e849d026"
      values.$pastUpgrades.6.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.6.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0xd25ca910a4b7d0bab41828bce014a70f75642449f7c0426a3849ad46a6e60364"
      values.$pastUpgrades.5.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.5.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x147393fe2175d3bd2a267730c8066afd475199c52a1895b5524100c3b2ca2c07"
      values.$pastUpgrades.4.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.4.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x64910ea21a212ae671687842ec3c4fcd187e935ddf2d6cc90f41b6d99b592964"
      values.$pastUpgrades.3.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.3.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x1c54434b6dab2c13187d16161d7da8b6286b4f71d3ff3ab580ffcc90ac387d31"
      values.$pastUpgrades.2.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.2.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0x100be562b99e029f2419718dfa5e722c6d27cd99e9e5fbbd61dbda223d8872c2"
      values.$pastUpgrades.1.2:
+        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
      values.$pastUpgrades.1.1:
-        ["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]
+        "0x8c5f529b4aea40150673a24be2daf67b98dfea900848e2e4bfe863b29397cb16"
      values.$pastUpgrades.0.2:
+        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
      values.$pastUpgrades.0.1:
-        ["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]
+        "0x7fee1d4145372b9f1a39594bc71c9074f5982c5c546135c1aba6810c5c33cd15"
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
      values.$pastUpgrades.2.1:
-        ["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]
+        "0x80c2489d99e1aa4593e1749d905120a22bc688a8c62343edce82130c4566de72"
      values.$pastUpgrades.1.2:
+        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
      values.$pastUpgrades.1.1:
-        ["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]
+        "0x2513dff6fab1fe6b7f95d9e436c18c8dd79965a3c7217f79c69787b2f42abc4a"
      values.$pastUpgrades.0.2:
+        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
      values.$pastUpgrades.0.1:
-        ["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]
+        "0x9e8cd16d463bff3aaa9aca2f741819ccdba2148450f935446facdb498a424a1e"
    }
```

Generated with discovered.json: 0x9d5839003aae453217ec5dfedc4fb6dfdce30703

# Diff at Mon, 14 Oct 2024 14:20:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f799449f5bf9f715885662e0303a221ca27f97a5 block: 20878376
- current block number: 20964358

## Description

Starkgate escrows are batch-upgraded to the same new implementation. The only change is an addidtional `require()` in the flow of legacy token withdrawals.

## Watched changes

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.7:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        7
+        8
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.2:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        2
+        3
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.7:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        7
+        8
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.3:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        3
+        4
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.5:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        5
+        6
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.3:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        3
+        4
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.2:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        2
+        3
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.2:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        2
+        3
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.2:
+        ["2024-10-13T15:56:47.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        2
+        3
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.7:
+        ["2024-10-13T15:59:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        7
+        8
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      sourceHashes.1:
-        "0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"
+        "0x8f135fc371babc0f7b9fd3b63668e1c35eed87f3dedd2416ebe0e7a118c4fd0a"
      values.$implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
      values.$pastUpgrades.2:
+        ["2024-10-13T15:57:11.000Z",["0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"]]
      values.$upgradeCount:
-        2
+        3
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2.0_4"
+        "StarkWare_StarknetERC20Bridge_2.0_5"
      values.implementation:
-        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
+        "0x6ad74D4B79A06A492C288eF66Ef868Dd981fdC85"
    }
```

## Source code changes

```diff
.../{.flat@20878376 => .flat}/FRAXBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/FXSBridge/StarknetERC20Bridge.sol  | 9 +++++++--
 .../{.flat@20878376 => .flat}/LUSDBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/STRKBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/UNIBridge/StarknetERC20Bridge.sol  | 9 +++++++--
 .../{.flat@20878376 => .flat}/USDCBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/USDTBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/WBTCBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../{.flat@20878376 => .flat}/rETHBridge/StarknetERC20Bridge.sol | 9 +++++++--
 .../sfrxETHBridge/StarknetERC20Bridge.sol                        | 9 +++++++--
 .../wstETHBridge/StarknetERC20Bridge.sol                         | 9 +++++++--
 11 files changed, 77 insertions(+), 22 deletions(-)
```

Generated with discovered.json: 0x0eb7614d43218c52384933a777864f5e26462107

# Diff at Mon, 14 Oct 2024 10:56:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878376
- current block number: 20878376

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878376 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract LORDSBridge (0x023A2aAc5d0fa69E3243994672822BA43E34E5C9) {
    +++ description: None
      sourceHashes:
+        ["0x2f705f817a66ebdf99961fe9f40d30fe99be28e3a316d15a490048e7cb149b67"]
    }
```

```diff
    contract DAIBridge (0x0437465dfb5B79726e35F08559B0cBea55bb585C) {
    +++ description: None
      sourceHashes:
+        ["0xe3c0ee54209bc4a4d457bc5e251aff40a83fc784e37b8b90fd9158c6b0f29e5c"]
    }
```

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      sourceHashes:
+        ["0xdb5ce51bea459e0dd74612d6fe08407bb4f57d4f524e3ef397b8ef53beeceb0c","0x542e548d4e5b9c6da6613f9a5618cfe1f3f2aedf1449c2f52fa6c565eb90e51d"]
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      sourceHashes:
+        ["0xdb5ce51bea459e0dd74612d6fe08407bb4f57d4f524e3ef397b8ef53beeceb0c","0xe185bff4846e41d1ea1bffd2a1905568a7206a93b2923a300f9b61990293218b"]
    }
```

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      sourceHashes:
+        ["0x81a134f478bcc2b72c5f77df62e5b52cd55cefd6329f8e306ac6d28f31d467c2","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      sourceHashes:
+        ["0x25ddd183db6d49cd35a4294bab199e312eed0aab84414abff63a55010799f854","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract TheLordsToken (0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0) {
    +++ description: None
      sourceHashes:
+        ["0xd22c33bc5166fe7e453c9664a212eef8bc1ea65785e04e7fa2e5981f6a782970"]
    }
```

```diff
    contract StarkgateETHSecurityAgentMultisig (0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ImplementationMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1DaiGateway (0x9F96fE0633eE838D0298E8b8980E6716bE81388d) {
    +++ description: None
      sourceHashes:
+        ["0xea3ba1600e1949cef23ec7d1ebcf724de2bb6be9602c2339dd29582e6c00c9f5"]
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      sourceHashes:
+        ["0x2c95972415c771f5ef6d71449bae168597b6c35245fbe8769425e5c9c753e918","0x7e4d647efdbbd67f7c4af48b29a4ece562fe1383101cd94625402008a572ba87"]
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      sourceHashes:
+        ["0x81a134f478bcc2b72c5f77df62e5b52cd55cefd6329f8e306ac6d28f31d467c2","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      sourceHashes:
+        ["0x53dd98b4b8b7867686e1dba07dd739c1bdb6b4a5e11d04efbbe743cb975dbc8c","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      sourceHashes:
+        ["0xce548bceca83c22eb3686987781754a8d9527dde81c86ae4a13d5a9ba5395d62","0x2738adbe41339934ae57e5c96fb9d7e42a43ba2b112878bc9227cc1c81de8ee6"]
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      sourceHashes:
+        ["0xdb5ce51bea459e0dd74612d6fe08407bb4f57d4f524e3ef397b8ef53beeceb0c","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      sourceHashes:
+        ["0xfd5ac94c5a362e7426efd613abbaca3b838cf7f6089b44d9c0d4f675ca4467b3","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      sourceHashes:
+        ["0x25ddd183db6d49cd35a4294bab199e312eed0aab84414abff63a55010799f854","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      sourceHashes:
+        ["0x25ddd183db6d49cd35a4294bab199e312eed0aab84414abff63a55010799f854","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      sourceHashes:
+        ["0xfd5ac94c5a362e7426efd613abbaca3b838cf7f6089b44d9c0d4f675ca4467b3","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      sourceHashes:
+        ["0xdb5ce51bea459e0dd74612d6fe08407bb4f57d4f524e3ef397b8ef53beeceb0c","0xd3e96d9fb623969bd9cc3e5fed6779ce42c5de753b49fc73da783863d4043a2f"]
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      sourceHashes:
+        ["0x81a134f478bcc2b72c5f77df62e5b52cd55cefd6329f8e306ac6d28f31d467c2","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      sourceHashes:
+        ["0x28ffce7fadb62d041968d5ce5d5fe471d2bedf36c28e342957a33d63a00b872c","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

Generated with discovered.json: 0x189728c26919137285f5bec6804ea26f63b62ce1

# Diff at Wed, 02 Oct 2024 14:21:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871596
- current block number: 20878376

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871596 (main branch discovery), not current.

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-07T17:04:11.000Z",["0x64608BDF1867110f622391196989bF4cE37BBb33"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-07T17:05:11.000Z",["0x642F04899B6cA155c2a5eAdD4e4ed634f1B07Dd7"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-06T20:20:06.000Z",["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]],["2022-07-12T12:56:17.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2022-11-20T14:07:11.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2023-03-28T15:06:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T10:13:23.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-12T09:54:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        7
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-23T12:22:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-11T10:08:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-03-21T10:19:20.000Z",["0x0205172F25e791975edB4dEF203f3789B01f43bb"]],["2022-04-10T13:08:21.000Z",["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]],["2022-11-20T14:07:11.000Z",["0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37"]],["2023-03-28T15:08:23.000Z",["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]],["2024-02-08T10:13:23.000Z",["0x455603AD9ae671F6c1f0f746F24d7904cA603581"]],["2024-02-12T11:55:59.000Z",["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]],["2024-04-21T14:18:35.000Z",["0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"]]]
      values.$upgradeCount:
+        7
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-06T20:27:48.000Z",["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]],["2022-07-12T12:57:34.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2022-11-20T14:07:11.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2023-03-28T15:07:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T10:13:23.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-12T10:13:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        7
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-05-30T13:31:11.000Z",["0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"]],["2024-02-08T18:13:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-15T12:26:20.000Z",["0xD8Cd77206fCb239BdDaaDDdA8C87CBFe7d67Ca2b"]],["2022-01-26T10:45:21.000Z",["0x944960b90381d76368aecE61F269bD99FFfd627e"]],["2022-03-21T09:06:14.000Z",["0xDC109C4a1A3084Ed15A97692FBEF3e1FB32A6955"]],["2022-06-15T09:20:58.000Z",["0x2B3B750f1f10c85c8A6D476Fc209A8DC7E4Ca3F8"]],["2022-09-11T06:59:08.000Z",["0xE267213B0749Bb94c575F6170812c887330d9cE3"]],["2023-03-29T10:21:47.000Z",["0x739A654271c565839F0408546706bBea2F1FfE42"]],["2023-05-24T05:31:23.000Z",["0x16938E4b59297060484Fa56a12594d8D6F4177e8"]],["2024-03-12T14:15:23.000Z",["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]],["2024-08-28T14:32:59.000Z",["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]]]
      values.$upgradeCount:
+        9
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-10T17:21:23.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-01-14T13:34:23.000Z",["0x052C81F05595B5DeF4fdFEdbD7CA7b4A8a7B50C1"]],["2024-01-14T16:30:23.000Z",["0x7f2a18900A978D4390a3640e34739BB697777A71"]],["2024-02-12T15:17:11.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        5
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-04T12:42:11.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T22:37:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-23T12:22:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-11T10:08:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-23T12:22:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-11T10:08:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-29T13:54:59.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T22:57:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-07T17:06:11.000Z",["0x594cCaDF93F860dc42Cf9fd7bCea47Ff4d135D7A"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-07-06T20:27:48.000Z",["0xaec1fB35875a3816a5d09D61F086FeB6c252e096"]],["2022-07-12T12:57:34.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2022-11-20T14:07:11.000Z",["0x56e233d613743297CdD27fafc5c1f5c1DC2a381b"]],["2023-03-28T15:07:47.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T10:13:23.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-12T10:15:59.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]],["2024-04-21T14:18:35.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        7
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-23T11:52:23.000Z",["0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"]],["2024-02-08T22:52:47.000Z",["0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x91f6afaf24fc1e2434d43f9d7e5a81ee661d5b16

# Diff at Tue, 01 Oct 2024 15:40:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20634500
- current block number: 20871596

## Description

SECURITY_AGENT role given to new Multisig. Can only activate the withdrawLimit for the ETH escrow (added to permissions). Higher perms are EOA-governed.

## Watched changes

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      values.accessControl.SECURITY_AGENT.members.0:
+        "0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5"
    }
```

```diff
+   Status: CREATED
    contract StarkgateETHSecurityAgentMultisig (0x77Dd0cf03e1cCbDC750c9E5FDc34b8A3671f88c5)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0x2c4b0cd0339b8c428f9a437291bccbded87a1c38

# Diff at Thu, 29 Aug 2024 13:21:54 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@612fba37e9862b944ddc0ced2cc0892ca74b4eae block: 20461688
- current block number: 20634500

## Description

* aggregatorProgramHash is now introduced allowing for aggregation
* more than one blob is now allowed

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.$implementation:
-        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
+        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
      values.identify:
-        "StarkWare_Starknet_2024_8"
+        "StarkWare_Starknet_2024_9"
      values.implementation:
-        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
+        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ severity: HIGH
      values.programHash:
-        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
+        "853638403225561750106379562222782223909906501242604214771127703946595519856"
      values.programHashHistory.7:
+        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
      values.aggregatorProgramHash:
+        "1161178844461337253856226043908368523817098764221830529880464854589141231910"
    }
```

## Source code changes

```diff
.../Starknet/Starknet.sol                          | 297 ++++++++++++++++-----
 1 file changed, 223 insertions(+), 74 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20461688 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
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

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x3e8cca328df6b88ca5d67846f51f0281443512db

# Diff at Wed, 21 Aug 2024 10:06:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20461688
- current block number: 20461688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20461688 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x283751A21eafBFcD52297820D27C1f1963D9b5b4","0x66ba83ba3D3AD296424a2258145d9910E9E40B7C","0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B","0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb","0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816","0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419","0xbb3400F107804DFB482565FF1Ec8D8aE66747605","0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4","0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2","0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x283751A21eafBFcD52297820D27C1f1963D9b5b4","via":[]},{"permission":"upgrade","target":"0x66ba83ba3D3AD296424a2258145d9910E9E40B7C","via":[]},{"permission":"upgrade","target":"0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419","via":[]},{"permission":"upgrade","target":"0xbb3400F107804DFB482565FF1Ec8D8aE66747605","via":[]},{"permission":"upgrade","target":"0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B","via":[]},{"permission":"upgrade","target":"0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4","via":[]},{"permission":"upgrade","target":"0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2","via":[]},{"permission":"upgrade","target":"0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8","via":[]},{"permission":"upgrade","target":"0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb","via":[]},{"permission":"upgrade","target":"0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816","via":[]}]
    }
```

```diff
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}]
    }
```

```diff
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}]
    }
```

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4","via":[]}]
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]},{"permission":"upgrade","target":"0xC91EC49Ad0843E5Cca55b4c4e5f68de54F6cB2Ae","via":[]}]
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x83C0A700114101D1283D1405E2c8f21D3F03e988","via":[]},{"permission":"upgrade","target":"0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263","via":[]}]
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}]
    }
```

```diff
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5751a83170BeA11fE7CdA5D599B04153C021f21A","via":[]}]
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec","via":[]}]
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF689688640E88160c07C6FC5cc63039F29EDe86b","via":[]}]
    }
```

Generated with discovered.json: 0xbb05fc769a50c1da5187cb7501dafd8918e99bc5

# Diff at Fri, 09 Aug 2024 12:02:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20461688
- current block number: 20461688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20461688 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"
+        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
      assignedPermissions.upgrade.8:
-        "0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"
+        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
      assignedPermissions.upgrade.7:
-        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
+        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
      assignedPermissions.upgrade.6:
-        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
+        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
      assignedPermissions.upgrade.5:
-        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
+        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
      assignedPermissions.upgrade.4:
-        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
+        "0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816"
      assignedPermissions.upgrade.3:
-        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
+        "0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"
      assignedPermissions.upgrade.2:
-        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
+        "0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B"
      assignedPermissions.upgrade.1:
-        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
+        "0x66ba83ba3D3AD296424a2258145d9910E9E40B7C"
      assignedPermissions.upgrade.0:
-        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
+        "0x283751A21eafBFcD52297820D27C1f1963D9b5b4"
    }
```

Generated with discovered.json: 0x85689bbff687a988bd303605a6c31d404df1df4a

# Diff at Fri, 09 Aug 2024 10:12:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20461688
- current block number: 20461688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20461688 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x283751A21eafBFcD52297820D27C1f1963D9b5b4","0x66ba83ba3D3AD296424a2258145d9910E9E40B7C","0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B","0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb","0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816","0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419","0xbb3400F107804DFB482565FF1Ec8D8aE66747605","0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4","0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2","0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"]
      assignedPermissions.upgrade:
+        ["0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4","0x283751A21eafBFcD52297820D27C1f1963D9b5b4","0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419","0xbb3400F107804DFB482565FF1Ec8D8aE66747605","0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B","0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8","0x66ba83ba3D3AD296424a2258145d9910E9E40B7C","0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2","0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816","0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb"]
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0","0x64F4396bb0669C72858Cc50C779b48EB25F45770"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0","0x64F4396bb0669C72858Cc50C779b48EB25F45770"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"]
      assignedPermissions.upgrade:
+        ["0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"]
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x804d60CB1ade94511f7915A2062948685Ca8C81f","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x804d60CB1ade94511f7915A2062948685Ca8C81f","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract ImplementationMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x804d60CB1ade94511f7915A2062948685Ca8C81f","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x804d60CB1ade94511f7915A2062948685Ca8C81f","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x59232aC80E6d403b6381393e52f4665ECA328558","0xCe958D997F4a5824D4d503A128216322C6C223a0"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xdf70fa10bc3bf5e87a51e225e83391bb434571e0

# Diff at Mon, 05 Aug 2024 10:12:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a10ea834b693784d902e97d5c36c5e68d2da815 block: 20362649
- current block number: 20461688

## Description

Add historical programHashes to discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362649 (main branch discovery), not current.

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      values.programHashHistory:
+        ["1921772108187713503530008849184725638117898887391063185252422808224349294626","3258367057337572248818716706664617507069572185152472699066582725377748079373","407700941260678649793204927710478760533239334662847444187959202896452163393","1865367024509426979036104162713508294334262484507712987283009063059134893433","54878256403880350656938046611252303365750679698042371543935159963667935317","2479841346739966073527450029179698923866252973805981504232089731754042431018","109586309220455887239200613090920758778188956576212125550190099009305121410"]
    }
```

Generated with discovered.json: 0x13fc950b65e71d459867208e05c7b82df54267ca

# Diff at Tue, 30 Jul 2024 11:14:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20362649
- current block number: 20362649

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362649 (main branch discovery), not current.

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      fieldMeta:
+        {"programHash":{"severity":"HIGH","description":"The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated."}}
    }
```

Generated with discovered.json: 0x11244fe284c19d4642f60d9cf293f1b9bf2169a3

# Diff at Thu, 18 Jul 2024 10:33:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20124846
- current block number: 20124846

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20124846 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      assignedPermissions.admin.9:
+        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
      assignedPermissions.admin.8:
-        "0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8"
+        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
      assignedPermissions.admin.7:
-        "0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2"
+        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
      assignedPermissions.admin.6:
-        "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4"
+        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
      assignedPermissions.admin.5:
-        "0xbb3400F107804DFB482565FF1Ec8D8aE66747605"
+        "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419"
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4"]}
    }
```

Generated with discovered.json: 0xa90897d43ca0bbceb292a749f278c3e3834553c3

# Diff at Wed, 19 Jun 2024 09:19:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 20084426
- current block number: 20124846

## Description

The Dai Gateway for starknet is paused by Maker, preventing deposits and forced withdrawals in the contract.

## Watched changes

```diff
    contract L1DaiGateway (0x9F96fE0633eE838D0298E8b8980E6716bE81388d) {
    +++ description: None
      values.isOpen:
-        1
+        0
    }
```

Generated with discovered.json: 0xf7441a8727825d8791f09a020f6a8e4595a25ac4

# Diff at Thu, 13 Jun 2024 17:36:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@537b14297d331d7c0c0ad653fc9c95653626c5ff block: 19718686
- current block number: 20084426

## Description

New StarkGate escrow added. This one supports multiple tokens but we currently only track the EKUBO token. The new StarkgateManager and -Registry support permissionless listing of new tokens, as long as they are not blacklisted. A token admin EOA can pause deposits and blacklist tokens that are not yet supported.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718686 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract StarkgateManager (0x0c5aE94f8939182F2D06097025324D1E537d5B60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkgateRegistry (0x1268cc171c54F2000402DfF20E93E60DF4c96812)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiBridge (0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb)
    +++ description: None
```

Generated with discovered.json: 0x3dcb7d18697752a7b58f62f50842ff17e9897e65

# Diff at Tue, 23 Apr 2024 14:28:50 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@8820c130ebfb55b88a3d890b44871a746006e3b5 block: 19617533
- current block number: 19718686

## Description

### Bridge changes

- An upgradeDelay of three days is introduced to 7 starkgate bridges. This is correctly reflected on the frontend. (Affected bridges: wbtc, usdt, wsteth, STRK, reth, usdc, eth)
- The ProxyGovernance for 6 bridges of the above 7 is changed to the BridgeMultisig alone. (Before each bridge had an additional EOA, affected bridges: wbtc, usdt, wsteth, STRK, reth, usdc)
  - Special case: Out of the above, rETH and wstETH only had a single admin before, which is now also replaced by the BridgeMultisig

These changes are reflected on our frontend.

## Watched changes

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.1:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0xdc29f0F7742ec462Af475AceeCECC57601991D23"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.1:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0x8dB2469f3355d6769932B853F29e32df06122981"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.0:
-        "0xcA9fC2Da27ce25F35B994b152d27d480C6f62245"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0xcA9fC2Da27ce25F35B994b152d27d480C6f62245"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0xcA9fC2Da27ce25F35B994b152d27d480C6f62245"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0xcA9fC2Da27ce25F35B994b152d27d480C6f62245"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.0:
-        "0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
    +++ description: None
      upgradeability.upgradeDelay:
-        0
+        259200
      upgradeability.proxyGovernance.1:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0xf5EF70bb0975cAF85461523e0cB3910c35cb30b4"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      values.getUpgradeActivationDelay:
-        0
+        259200
    }
```

Generated with discovered.json: 0x0a699237c3f5ed3341ede06e075c71837e9cf706

# Diff at Thu, 28 Mar 2024 11:09:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19467860
- current block number: 19532213

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467860 (main branch discovery), not current.

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract ImplementationMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xf0238ed10ceca3dd8e5681d6939ad2464cd124c8

# Diff at Mon, 18 Mar 2024 09:11:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6554807e96aa5206aec95eab7b2ae23cf107941b block: 19432590
- current block number: 19460707

## Description

The programHash of Starknet OS (L2 cairo state machine) is changed, no changes on L1.

## Watched changes

```diff
    contract ImplementationMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      values.nonce:
-        20
+        21
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
+++ description: The hash changes when the L2 cairo state machine logic changes.
+++ type: CODE_CHANGE
+++ severity: MEDIUM
      values.programHash:
-        "109586309220455887239200613090920758778188956576212125550190099009305121410"
+        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
    }
```

Generated with discovered.json: 0x4335af2ffbc06336f597863bea89ad0352e95c0c

# Diff at Thu, 14 Mar 2024 10:15:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@24c5721630392f8b6f59093376472db03d18b2c2 block: 19411249
- current block number: 19432590

## Description

The main Starknet contract has been updated to support blobs. Small changes in emitted events when processing L2 to L1 messages. Some other changes to NamedStorage, in particular they added an AddressToAddress mapping.

### How the DA verification works now

#### CALLDATA

The `updateState` function is called. The `USE_KZG_DA_OFFSET` is checked to be zero because we are not using blobs. The onchain data hash that includes the statediff is encoded into a keccak commitment and passed to the `updateStateInternal` function. This function checks in the fact registry whether the state diff was proven before (using just the commitment!) and then the state root is updated.

#### BLOBS

The `updateStateKzgDA` function is called and a kzg proof is passed as a param. The `USE_KZG_DA_OFFSET` is checked to be one. The `verifyKzgProof` function is called. This function only checks the first blob, implying that they will always just publish one per tx. The function takes `blobhash(0)` and verifies a point evaluation using the precompile. After this verification the point evaluation info is committed and checked against the fact registry as before. The correct usage of the precompile can be checked only if we also look into the program being proven, which we don't do at this stage. In fact, the program hash has been updated.

## Watched changes

```diff
    contract ProxyMultisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
    +++ description: None
      values.getOwners[4]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.3:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.2:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.1:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
      values.getOwners.0:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
    }
```

```diff
    contract ImplementationMultisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
    +++ description: None
      values.nonce:
-        19
+        20
    }
```

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
    +++ description: None
      upgradeability.implementation:
-        "0x16938E4b59297060484Fa56a12594d8D6F4177e8"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      implementations.0:
-        "0x16938E4b59297060484Fa56a12594d8D6F4177e8"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.identify:
-        "StarkWare_Starknet_2023_6"
+        "StarkWare_Starknet_2024_8"
      values.implementation:
-        "0x16938E4b59297060484Fa56a12594d8D6F4177e8"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.programHash:
-        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
+        "109586309220455887239200613090920758778188956576212125550190099009305121410"
    }
```

## Source code changes

```diff
.../Starknet/implementation/meta.txt               |   2 +-
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

Generated with discovered.json: 0xeae0d0cdb66222ce999d96aa721fc58284e15e23

# Diff at Mon, 11 Mar 2024 10:26:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0a20664a6b5ee1585ee305022d1fb61c48648854 block: 19275345
- current block number: 19411249

## Description

Update the discovery with the Starkware Proxy handler updated to understand
version 5.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19275345 (main branch discovery), not current.

```diff
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    +++ description: None
      upgradeability.proxyGovernance[0]:
+        "0xcA9fC2Da27ce25F35B994b152d27d480C6f62245"
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
    +++ description: None
      upgradeability.proxyGovernance[0]:
+        "0xF689688640E88160c07C6FC5cc63039F29EDe86b"
    }
```

Generated with discovered.json: 0x1386d87ab58bc19b1c69fbb556c97c261450bf99

# Diff at Wed, 21 Feb 2024 10:10:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5eac5af1d838f52a31d2a40aa5a4dbe720a0c417 block: 19219087
- current block number: 19275345

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19219087 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract STRKBridge (0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4) {
    }
```

Generated with discovered.json: 0x080da638902a1d509df830a7384f2c65b76c2793

# Diff at Tue, 13 Feb 2024 12:27:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@129897f96b3abfd4a0b655fc3454caadeba39bdc block: 19183671
- current block number: 19219087

## Description

Bridges have been updated to support a new message format that includes the token address in the payload and to support a new permissioning model.

There are now 9 roles:

1. Governance Admin: can update the App Role Admin and Upgrade Governor roles.
2. App Governor: can set the L2 token bridge. Can set the max total balance.
3. App Role Admin: can update the App Governor, Operator, Token Admin roles.
4. Operator: not used?
5. Token Admin: not used?
6. Upgrade Governor: not used?
7. Security Admin: can disable withdrawal limits. Can update the Security Agent role and itself.
8. Security Agent: can enable withdrawal limits.
9. Manager: can initiate the "enrollement" of a token or deactivate a token.

Also the bridge implementation for ERC20 and Ether are different but overall very similar.

## Watched changes

```diff
    contract WBTCBridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract FXSBridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract ETHBridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      upgradeability.implementation:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      implementations.0:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.bridgedToken:
-        "0x0000000000000000000000000000000000000000"
+        "0x0000000000000000000000000000000000455448"
      values.identify:
-        "StarkWare_StarknetEthBridge_2023_1"
+        "StarkWare_StarknetEthBridge_2.0_4"
      values.implementation:
-        "0x455603AD9ae671F6c1f0f746F24d7904cA603581"
+        "0x95ff25A59Dc9c5A41cF0709dc916041E5dC7fd95"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract USDTBridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract wstETHBridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      upgradeability.implementation:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2022_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0xEf3525a1081a4cf6f76E0B202a575195cEE083a2"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract rETHBridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract sfrxETHBridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract FRAXBridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract LUSDBridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract USDCBridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

```diff
    contract UNIBridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      upgradeability.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      implementations.0:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0xF689688640E88160c07C6FC5cc63039F29EDe86b"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2023_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fa346c1e77C17d7976Bf1EFE2b121E845f15FEB"
+        "0x179FA59e4D19ac7C7b4e3daa0Cd6557a553656A0"
      values.isActive:
-        true
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
    }
```

## Source code changes

```diff
.../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../ETHBridge/implementation/meta.txt              |   2 +-
 .../ETHBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity}/StarknetEthBridge.sol            |  45 +-
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../FRAXBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../FXSBridge/implementation/meta.txt              |   2 +-
 .../FXSBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../LUSDBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol}             |  23 +-
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth}/CairoConstants.sol        |   4 +-
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces}/BlockDirectCall.sol       |   6 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../solidity/interfaces}/ProxySupport.sol          |  19 +-
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../starkware/solidity/libraries}/NamedStorage.sol |  56 +-
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries}/Transfers.sol    |  32 +-
 .../starkware/solidity/tokens/ERC20}/IERC20.sol    |   4 +-
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../UNIBridge/implementation/meta.txt              |   2 +-
 .../UNIBridge/implementation/src/solidity/Fees.sol |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../USDCBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../USDTBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../WBTCBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../rETHBridge/implementation/meta.txt             |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  58 --
 .../BlockDirectCall.sol => /dev/null               |  36 --
 .../implementation/CairoConstants.sol => /dev/null |  22 -
 .../ContractInitializer.sol => /dev/null           |  53 --
 .../GenericGovernance.sol => /dev/null             |  57 --
 .../implementation/Governance.sol => /dev/null     | 123 ----
 .../implementation/IERC20.sol => /dev/null         |  43 --
 .../IStarknetMessaging.sol => /dev/null            |  76 ---
 .../IStarknetMessagingEvents.sol => /dev/null      |  66 ---
 .../implementation/Identity.sol => /dev/null       |  24 -
 .../implementation/MGovernance.sol => /dev/null    |  29 -
 .../implementation/NamedStorage.sol => /dev/null   | 120 ----
 .../implementation/ProxySupport.sol => /dev/null   |  93 ----
 .../StarknetBridgeConstants.sol => /dev/null       |  27 -
 .../StarknetERC20Bridge.sol => /dev/null           |  43 --
 .../StarknetTokenBridge.sol => /dev/null           | 255 ---------
 .../StarknetTokenStorage.sol => /dev/null          |  85 ---
 .../implementation/Transfers.sol => /dev/null      |  77 ---
 .../sfrxETHBridge/implementation/meta.txt          |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 .../implementation/Addresses.sol => /dev/null      |  42 --
 .../BlockDirectCall.sol => /dev/null               |  21 -
 .../implementation/CairoConstants.sol => /dev/null |   7 -
 .../ContractInitializer.sol => /dev/null           |  38 --
 .../GenericGovernance.sol => /dev/null             |  42 --
 .../implementation/Governance.sol => /dev/null     | 108 ----
 .../implementation/IERC20.sol => /dev/null         |  28 -
 .../IStarknetMessaging.sol => /dev/null            |  54 --
 .../IStarknetMessagingEvents.sol => /dev/null      |  51 --
 .../implementation/Identity.sol => /dev/null       |   9 -
 .../implementation/MGovernance.sol => /dev/null    |  14 -
 .../implementation/NamedStorage.sol => /dev/null   | 105 ----
 .../implementation/ProxySupport.sol => /dev/null   |  78 ---
 .../StarknetBridgeConstants.sol => /dev/null       |  12 -
 .../StarknetERC20Bridge.sol => /dev/null           |  28 -
 .../StarknetTokenBridge.sol => /dev/null           | 240 --------
 .../StarknetTokenStorage.sol => /dev/null          |  70 ---
 .../implementation/Transfers.sol => /dev/null      |  62 ---
 .../wstETHBridge/implementation/meta.txt           |   2 +-
 .../implementation/src/solidity/Fees.sol           |  44 ++
 .../src/solidity/IStarkgateBridge.sol              |  30 +
 .../src/solidity/IStarkgateManager.sol             |  46 ++
 .../src/solidity/IStarkgateRegistry.sol            |  47 ++
 .../src/solidity/IStarkgateService.sol             |  25 +
 .../implementation/src/solidity/LegacyBridge.sol   | 197 +++++++
 .../src/solidity/StarkgateConstants.sol            |  34 ++
 .../src/solidity/StarkgateManager.sol              | 154 +++++
 .../src/solidity/StarknetERC20Bridge.sol           |  25 +
 .../src/solidity/StarknetTokenBridge.sol           | 620 +++++++++++++++++++++
 .../src/solidity/StarknetTokenStorage.sol          |  84 +++
 .../src/solidity/WithdrawalLimit.sol               | 103 ++++
 .../implementation/src/solidity/utils/Felt252.sol  |  98 ++++
 .../starkware/cairo/eth/CairoConstants.sol         |  22 +
 .../components/OverrideLegacyProxyGovernance.sol   |  73 +++
 .../starkware/solidity/components/Roles.sol        | 172 ++++++
 .../solidity/interfaces/BlockDirectCall.sol        |  36 ++
 .../solidity/interfaces/ContractInitializer.sol    |  53 ++
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/interfaces/ProxySupport.sol |  92 +++
 .../starkware/solidity/libraries/AccessControl.sol | 308 ++++++++++
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../starkware/solidity/libraries/NamedStorage.sol  | 164 ++++++
 .../starkware/solidity/libraries/RolesLib.sol      | 129 +++++
 .../starkware/solidity/libraries/Transfers.sol     |  77 +++
 .../starkware/solidity/tokens/ERC20/IERC20.sol     |  43 ++
 .../solidity/tokens/ERC20/IERC20Metadata.sol       |  39 ++
 .../starknet/solidity/IStarknetMessaging.sol       |  82 +++
 .../starknet/solidity/IStarknetMessagingEvents.sol |  66 +++
 .../third_party/open_zeppelin/utils/Strings.sol    |  90 +++
 488 files changed, 30848 insertions(+), 11207 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19183671 (main branch discovery), not current.

```diff
    contract LORDS Bridge (0x023A2aAc5d0fa69E3243994672822BA43E34E5C9) {
      name:
-        "LORDS Bridge"
+        "LORDSBridge"
    }
```

```diff
    contract DAI Bridge (0x0437465dfb5B79726e35F08559B0cBea55bb585C) {
      name:
-        "DAI Bridge"
+        "DAIBridge"
    }
```

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      name:
-        "WBTC Bridge"
+        "WBTCBridge"
      values.governors:
-        ["0xfdF3E24BD26368512C5F65959BBB668d3338f994","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract FXS Bridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      name:
-        "FXS Bridge"
+        "FXSBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Proxy Multisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
      name:
-        "Proxy Multisig"
+        "ProxyMultisig"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      name:
-        "Implementation Multisig"
+        "ImplementationMultisig"
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      name:
-        "ETH Bridge"
+        "ETHBridge"
      values.governors:
-        ["0x6A03F3F0943eb686a4EF94e7B6f6CA3332580b5C","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      name:
-        "USDT Bridge"
+        "USDTBridge"
      values.governors:
-        ["0x3ADfc0aBd0eBD4e61281d991F87134eE3231dB13","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract wstETH Bridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      name:
-        "wstETH Bridge"
+        "wstETHBridge"
      values.governors:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract rETH Bridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      name:
-        "rETH Bridge"
+        "rETHBridge"
      values.governors:
-        ["0x5751a83170BeA11fE7CdA5D599B04153C021f21A"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract sfrxETH Bridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      name:
-        "sfrxETH Bridge"
+        "sfrxETHBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract FRAX Bridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      name:
-        "FRAX Bridge"
+        "FRAXBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract LUSD Bridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      name:
-        "LUSD Bridge"
+        "LUSDBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      name:
-        "USDC Bridge"
+        "USDCBridge"
      values.governors:
-        ["0xe8e9E69511BaaFC826953fC93cdf1ED6d3B63c53","0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract UNI Bridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      name:
-        "UNI Bridge"
+        "UNIBridge"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"GOVERNANCE_ADMIN":{"adminRole":"GOVERNANCE_ADMIN","members":["0xF689688640E88160c07C6FC5cc63039F29EDe86b"]},"APP_GOVERNOR":{"adminRole":"APP_ROLE_ADMIN","members":[]},"APP_ROLE_ADMIN":{"adminRole":"GOVERNANCE_ADMIN","members":[]},"OPERATOR":{"adminRole":"APP_ROLE_ADMIN","members":[]},"TOKEN_ADMIN":{"adminRole":"APP_ROLE_ADMIN","members":[]},"UPGRADE_GOVERNOR":{"adminRole":"GOVERNANCE_ADMIN","members":["0xF689688640E88160c07C6FC5cc63039F29EDe86b"]}}
      values.manager:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x2e28a72d29a4cc1e4344de73fd939abf00e284ab

# Diff at Thu, 08 Feb 2024 13:13:55 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ecce2dd03460fdede9f1111a19bff138d54ce28 block: 19025063
- current block number: 19183671

## Description

The upgrade delays for multiple bridge contracts (WBTC, ETH, USDT, USDC) are changed to 0.

## Watched changes

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.upgradeDelay:
-        604800
+        0
      values.getUpgradeActivationDelay:
-        604800
+        0
    }
```

Generated with discovered.json: 0x08a0364947864d1363efada15e024f5fb8769f76

# Diff at Wed, 17 Jan 2024 07:18:24 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e7e7682db5966865697553171159822c2ec0248f block: 19012236
- current block number: 19025063

## Description

Change in the USDC Bridge proxy governors - a new address is added.

## Watched changes

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.proxyGovernance[1]:
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
+        "0xf5EF70bb0975cAF85461523e0cB3910c35cb30b4"
    }
```

# Diff at Mon, 15 Jan 2024 12:19:39 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@7146ff49765d6596dfb78aa68e5c4cee6f5f4642 block: 18940875
- current block number: 19012236

## Description

The program hash and config hash are updated (with transactions 0xd15e25aaac8f634fcbe599fe0f47959d087dac5674091e12fc5a5a9808899f46 and 0x28a355fcc9228ed719110e075a3071d20446cfaff5ece324839429680fc87cf4). One of the USDC Bridge proxy governors has been removed.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
      values.configHash:
-        "671483050609816861429812414688707376174032882875357307847551691140236175837"
+        "2590421891839256512113614983194993186457498815986333310670788206383913888162"
      values.programHash:
-        "54878256403880350656938046611252303365750679698042371543935159963667935317"
+        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      upgradeability.proxyGovernance[1]:
-        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
      upgradeability.proxyGovernance.0:
-        "0xf5EF70bb0975cAF85461523e0cB3910c35cb30b4"
+        "0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec"
    }
```

# Diff at Tue, 19 Dec 2023 15:34:07 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@66449a15ea740d012130a024e5e0daa7f431f04b

## Description

Updated Starknet program hash.
The hash can be found by looking at the transactions of one of the Starknet Implementation Governors - 0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd. The tx hash is 0x4131a969982ec958490e399653f84bb356e4c282376320b1d6d2e6cc195597ef.

## Watched changes

```diff
    contract Starknet (0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) {
      values.programHash:
-        "1865367024509426979036104162713508294334262484507712987283009063059134893433"
+        "54878256403880350656938046611252303365750679698042371543935159963667935317"
    }
```

# Diff at Mon, 18 Dec 2023 14:44:24 GMT:

- author: maciekzygmunt (<maciekzygmunt@interia.pl>)
- comparing to: main@4b160bc70449af36363ff58bf34ad3610acc00ff

## Description

Few new escrows have been added, to track the balances of the new tokens.

The TVL limits on all StarGate Bridge contracts have been lifted (set to very high number).

New owner (EOA) has been added to Implementation Multisig, now it's 2/5.

## Watched changes

```diff
    contract WBTC Bridge (0x283751A21eafBFcD52297820D27C1f1963D9b5b4) {
      values.maxTotalBalance:
-        20000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract FXS Bridge (0x66ba83ba3D3AD296424a2258145d9910E9E40B7C) {
      values.maxTotalBalance:
-        "2000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      values.getOwners[4]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.3:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.2:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.1:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
      values.getOwners.0:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
    }
```

```diff
    contract ETH Bridge (0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419) {
      values.maxTotalBalance:
-        "150000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract USDT Bridge (0xbb3400F107804DFB482565FF1Ec8D8aE66747605) {
      values.maxTotalBalance:
-        20000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract wstETH Bridge (0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B) {
      values.maxTotalBalance:
-        "5000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract rETH Bridge (0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2) {
      values.maxTotalBalance:
-        "10000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract sfrxETH Bridge (0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8) {
      values.maxTotalBalance:
-        "5000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract FRAX Bridge (0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb) {
      values.maxTotalBalance:
-        "10000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract LUSD Bridge (0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5) {
      values.maxTotalBalance:
-        "3000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract USDC Bridge (0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816) {
      values.maxTotalBalance:
-        40000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract UNI Bridge (0xf76e6bF9e2df09D0f854F045A3B724074dA1236B) {
      values.maxTotalBalance:
-        "10000000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

# Diff at Wed, 22 Nov 2023 11:30:11 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a260f672297f7e3c229fd7a1940da6abc97c3816

## Description

A new owner is added to the BridgeMultisig and the threshold is changed to 2, which makes it a 2/4 Multisig. A new owner is also added to Proxy Multisig (now a 2/4 Multisig) and to Implementation Multisig (now a 2/4 Multisig).

## Watched changes

```diff
    contract BridgeMultisig (0x015277f49d5dD035A5F3Ce34aD5eBfDBaCA0C6Ec) {
      values.getOwners[3]:
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.2:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.1:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
      values.getThreshold:
-        1
+        2
    }
```

```diff
    contract Proxy Multisig (0x83C0A700114101D1283D1405E2c8f21D3F03e988) {
      values.getOwners[3]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.2:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.1:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.0:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
    }
```

```diff
    contract Implementation Multisig (0x86fD9cA64014b465d17f1bFBBBCFBEC7ebD8b1Bd) {
      values.getOwners[3]:
+        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.getOwners.2:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.getOwners.1:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.getOwners.0:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
    }
```
