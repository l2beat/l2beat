Generated with discovered.json: 0xecfd2cf0baf40fdc870412a7c19be626aa1ac2fa

# Diff at Tue, 01 Oct 2024 11:10:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-26T22:27:23.000Z",["0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"]],["2024-07-04T23:54:35.000Z",["0xDaC2d26317C42ae3CB21357B73404120E1dA4232"]]]
    }
```

Generated with discovered.json: 0x59222ab0bc0caecc64445f1c3b2db6e9f7eeee70

# Diff at Fri, 30 Aug 2024 08:01:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd669dc2bdf7ca6b201f3118d335062a48eaaef94

# Diff at Fri, 23 Aug 2024 09:55:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x0d02e17a196e8c9b7e602c6246a52bd172df2ab5

# Diff at Wed, 21 Aug 2024 10:06:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x173272739Bd7Aa6e4e214714048a9fE699453059"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x173272739Bd7Aa6e4e214714048a9fE699453059","via":[]}]
    }
```

Generated with discovered.json: 0x5470b6267bfdd713c3c8ea31269e1d1e2b181bbd

# Diff at Fri, 09 Aug 2024 10:12:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
      assignedPermissions.upgrade:
+        ["0x173272739Bd7Aa6e4e214714048a9fE699453059"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x810d943354834eb2842ada20a89e7c45888f96d4

# Diff at Tue, 30 Jul 2024 11:14:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20340229
- current block number: 20340229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20340229 (main branch discovery), not current.

```diff
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
      fieldMeta:
+        {"getRegisteredLibraries":{"severity":"HIGH","description":"MessageLibs registered for this Endpoint, enforcing the OApp owner's custom security stack."}}
    }
```

```diff
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

```diff
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      fieldMeta:
+        {"getExecutorConfig":{"description":"The executor config of the Stargate Bridge OApp (TokenMessaging) for all messages coming from Arbitrum. (returns: [maxMessageSize, Executor])"}}
    }
```

```diff
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
      fieldMeta:
+        {"getUlnConfig":{"description":"The verification config of the Stargate Bridge OApp (TokenMessaging) for all messages coming from Arbitrum. (returns: [confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs, optionalDVNs])"}}
    }
```

Generated with discovered.json: 0x458094cf56fc38fb2390760322c8ca83de43a199

# Diff at Fri, 19 Jul 2024 11:18:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@744d4e1fec0be9972ab7fde1dd4cc0ba0c91a28c block: 20240871
- current block number: 20340229

## Description

Ignore relatives of the StargateMultiRewarder. (STG token and such)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20240871 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x17BBC9BD51A52aAf4d2CC6652630DaF4fdB358F7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x5DaAee9EF143faFF495B581e9863570e83F99d31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xfcb42A0e352a08AbD50b8EE68d01f581B6Dfd80A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StargateStaking (0xFF551fEDdbeDC0AeE764139cCD9Cb644Bb04A6BD)
    +++ description: None
```

Generated with discovered.json: 0x28e8b5fbe4a5a8454398768047251d4caccd20af

# Diff at Fri, 05 Jul 2024 14:22:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@111fee0655d72e75c60324b920975e421fd852f7 block: 20082109
- current block number: 20240871

## Description

The LayerZero Executor contract is upgraded to a new implementation. (stays unverified)

## Watched changes

```diff
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: None
      upgradeability.implementation:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
      implementations.0:
-        "0x1E45F27F0e96e9757cff938F2c9d697AA8279C85"
+        "0xDaC2d26317C42ae3CB21357B73404120E1dA4232"
    }
```

Generated with discovered.json: 0xc36ee197ed07f2b90a985666471e09b86a03e59c

# Diff at Thu, 13 Jun 2024 09:49:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20082109

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract Treasurer (0x1041D127b2d4BC700F0F563883bC689502606918)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Executor (0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x17BBC9BD51A52aAf4d2CC6652630DaF4fdB358F7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: Its configuration and MessageLib to use is set for each OApp and destination by the OApp owner.
```

```diff
+   Status: CREATED
    contract  (0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateMultiRewarder (0x5871A7f88b0f3F5143Bf599Fd45F8C0Dc237E881)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x5DaAee9EF143faFF495B581e9863570e83F99d31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CreditMessaging (0x6b8aD17795d89B283e6D0362A87A403f3544bb9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessaging (0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980)
    +++ description: This is a Layer Zero OApp. It also handles the batching logic: bus, taxi, quotes
```

```diff
+   Status: CREATED
    contract StargatePoolNative (0x77b2043768d28E9C9aB44E1aBfC95944bcE57931)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stargate Verifier (0x8FafAE7Dd957044088b3d0F67359C327c6200d18)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0x933597a323Eb81cAe705C5bC29985172fd5A3973)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Nethermind Verifier (0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateToken (0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xc026395860Db2d07ee33e05fE50ed7bD583189C7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: Each MessageLib is an immutable verification library that OApp owners can point their OApp's Endpoint to.
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xfcb42A0e352a08AbD50b8EE68d01f581B6Dfd80A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargateStaking (0xFF551fEDdbeDC0AeE764139cCD9Cb644Bb04A6BD)
    +++ description: None
```
