Generated with discovered.json: 0x9cedc880007aea1b58987a284bb222f1dd37bf47

# Diff at Thu, 10 Oct 2024 09:45:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 257934615
- current block number: 262310038

## Description

Signer changes in Caldera MS.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.4:
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.3:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$members.2:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.1:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xbf853295743511e8DC5F03809d209C33fC136d24"
      values.$members.0:
-        "0xbf853295743511e8DC5F03809d209C33fC136d24"
+        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x4718f46c9cfba9b9d4904742822dfbaf428cbd7f

# Diff at Tue, 01 Oct 2024 11:12:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 257934615
- current block number: 257934615

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934615 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x74faA20aE77FFAb036369b24066Cc5d4251900D2"]]]
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0x532Ba80626DF9042353fa9509A66a25eE90fc51B"]]]
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x198792E7e60688FEeB0b89f0ABD3b85953Dd05Cd"]]]
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x73D3a5E535cBF98B9b5Ff7fEb8EC26e61FCEC4b7"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0xcc6DcB3FaA2436270E696994f326426B76A9f731"]]]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:28.000Z",["0x0987F33E1d59ECcedbDd6356ED34F06dd7baDcF8"]]]
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x84Cf78b9573daDb2FBa3028e49e0B5F785134360"]]]
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-01-20T02:02:25.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

Generated with discovered.json: 0xa0f4ede5d37c72843c2dfba45e8aefcd49525996

# Diff at Fri, 27 Sep 2024 15:34:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 256798281
- current block number: 257934615

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256798281 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x4dd77bd22bcfe00a9ad4a44139763c4a6ad3a105

# Diff at Tue, 24 Sep 2024 08:15:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 225981507
- current block number: 256798281

## Description

Caldera MS on Arbi: 1 signer changed.

## Watched changes

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$members.3:
-        "0xB2a5970fB30dc34AD65c914db855766ea62f1f41"
+        "0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.2:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$members.1:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      values.$members.0:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "0xbf853295743511e8DC5F03809d209C33fC136d24"
    }
```

Generated with discovered.json: 0x1905705acf81b4890c0e7beeb7e42d6ccfcd0098

# Diff at Sun, 01 Sep 2024 08:47:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17"
+        "ArbOS v10.2 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x7551e6a24298a448dc23970f2cc8540cd1b38e15

# Diff at Fri, 30 Aug 2024 08:06:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
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
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x202c82def1e609e7e87848a4275a11bf58620d43

# Diff at Fri, 23 Aug 2024 09:57:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xf51a4817e9e18c3fb0a82a5a13f1a3bc541e2212

# Diff at Wed, 21 Aug 2024 13:25:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAeDrpnsDZsKv0V5I5tcYA5z/PZaJuRA4qpki9y8x/bBV15fKHfMHv3Nyn2gBbBbtBjzXZKDCk4Q7mLMfFakukCyPyJSWB9vIczaCFaY1PjUMc//pY9x5VcTauBVhAKx5BZmQ398qhs+fqtEfZ3OgUQMYLvkim1uJ9tidMOnEo+wgWMDZAuMkXoO7BFdMzr8dBkpLjQYP9AYjPYphAERMiUoRuK8/mrXygNrokw2/RrthAH7qlt9eugYrRgIoy8hbgezFeIpVxKYTeuICu2TDV7XJk0oci4CIFSCCdD6X4gTiqbUFETjzthryj4va/GL8hc7MOkf4mPFeFHvzLTXCeh+0SSOOaH9onG0zgVvqEU5ZI6ddqiLMnGwjiJwJ52Efg=="]
    }
```

Generated with discovered.json: 0x3731b5562c1ca5fdfd4aabff761c885a360dfe23

# Diff at Wed, 21 Aug 2024 10:07:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x139C5A235632EDdad741ff380112B3161d31a21C","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[]},{"permission":"upgrade","target":"0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","via":[]},{"permission":"upgrade","target":"0x2623C144B4d167f70893f6A8968B98c89a6C5F97","via":[]},{"permission":"upgrade","target":"0x37e60F80d921dc5E7f501a7130F31f6548dBa564","via":[]},{"permission":"upgrade","target":"0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","via":[]},{"permission":"upgrade","target":"0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","via":[]},{"permission":"upgrade","target":"0x8bE956aB42274056ef4471BEb211b33e258b7324","via":[]},{"permission":"upgrade","target":"0x91591BB66075BCfF94AA128B003134165C3Ab83a","via":[]},{"permission":"upgrade","target":"0xA436f1867adD490BF1530c636f2FB090758bB6B3","via":[]},{"permission":"upgrade","target":"0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2e988Ea0873C9d712628F0bf38DAFdE754927C89","via":[]}]
    }
```

```diff
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x139C5A235632EDdad741ff380112B3161d31a21C","via":[]}]
    }
```

```diff
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

```diff
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x003e70B041abb993006C03E56c8515622a02928C","via":[]}]
    }
```

Generated with discovered.json: 0xf4c7de4e63faa0e95375faaf8fabc87536305ac6

# Diff at Fri, 09 Aug 2024 12:03:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
+        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
      assignedPermissions.upgrade.6:
-        "0xA436f1867adD490BF1530c636f2FB090758bB6B3"
+        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
      assignedPermissions.upgrade.5:
-        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
+        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
      assignedPermissions.upgrade.4:
-        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
+        "0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6"
      assignedPermissions.upgrade.3:
-        "0x139C5A235632EDdad741ff380112B3161d31a21C"
+        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
      assignedPermissions.upgrade.2:
-        "0x37e60F80d921dc5E7f501a7130F31f6548dBa564"
+        "0x2623C144B4d167f70893f6A8968B98c89a6C5F97"
      assignedPermissions.upgrade.1:
-        "0x8bE956aB42274056ef4471BEb211b33e258b7324"
+        "0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0"
      assignedPermissions.upgrade.0:
-        "0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6"
+        "0x139C5A235632EDdad741ff380112B3161d31a21C"
    }
```

Generated with discovered.json: 0x4a8453a62c7fc12e782d443529e018fd6be64469

# Diff at Fri, 09 Aug 2024 10:13:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x139C5A235632EDdad741ff380112B3161d31a21C","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
      assignedPermissions.upgrade:
+        ["0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6","0x8bE956aB42274056ef4471BEb211b33e258b7324","0x37e60F80d921dc5E7f501a7130F31f6548dBa564","0x139C5A235632EDdad741ff380112B3161d31a21C","0x2623C144B4d167f70893f6A8968B98c89a6C5F97","0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0","0xA436f1867adD490BF1530c636f2FB090758bB6B3","0x91591BB66075BCfF94AA128B003134165C3Ab83a","0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6","0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF"]
    }
```

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
      assignedPermissions.upgrade:
+        ["0x2e988Ea0873C9d712628F0bf38DAFdE754927C89"]
    }
```

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x20f3c50552659ed011da4be3c62d336825b82a6c

# Diff at Tue, 30 Jul 2024 11:17:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981507
- current block number: 225981507

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981507 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x5465f341f7b7aa6a63ebf9ecba0d04be5c822285

# Diff at Tue, 11 Jun 2024 12:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216538110
- current block number: 220728802

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216538110 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.maxTimeVariation:
-        [5760,48,86400,3600]
+        {"delayBlocks":5760,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xf4333c87d49f3dd17aadb8228ce984c5c5117ffd

# Diff at Thu, 30 May 2024 08:40:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 213233578
- current block number: 216538110

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xBA739a061291E9aec6422BdAD3E9D48d4f7aA552"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0xf6c4a97980541fc70a3ad7b3ee2b52fa9338e04f

# Diff at Mon, 20 May 2024 15:20:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@97bea89f161f8e4e9ebb3b4ef7fb3fcb3f90924f block: 211899420
- current block number: 213233578

## Description

Discovery of Molten L3 by Caldera showed that `0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF` is likely a Caldera Multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 211899420 (main branch discovery), not current.

```diff
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "UpgradeExecutorMemberGnosisSafeL2"
+        "Caldera Multisig"
    }
```

Generated with discovered.json: 0x7245a07dfe953ecc4b697834241e5f6b302ccc1e

# Diff at Thu, 25 Apr 2024 21:21:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2f1b03dc8e8dfe5c4e9bc475f6f9be6019a2af1c block: 198865244
- current block number: 204795680

## Description

A new UpgradeExecutor member was added (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF).
It's a "3 of 4" GnosisSafe.

## Watched changes

```diff
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutorMemberGnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/GnosisSafeL2.sol      |  86 +++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../implementation/meta.txt                        |   2 +
 .../proxy/GnosisSafeProxy.sol                      | 159 ++++++++
 .../proxy/meta.txt                                 |   2 +
 19 files changed, 1323 insertions(+)
```

Generated with discovered.json: 0x58d524aecf6116a452095502141368395422d8e5

# Diff at Fri, 08 Mar 2024 11:14:21 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@f09f798ebd2ae57f4c76e08114d608edf0a51c7b block: 176692309
- current block number: 188309907

## Description

The ArbitrumDACKeysetHandler has been changed in a way to make values more readable. No values were changed inside smart contracts, only the handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 176692309 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    +++ description: None
      values.dacKeyset.threshold:
-        1
      values.dacKeyset.keyCount:
-        1
      values.dacKeyset.requiredSignatures:
+        1
      values.dacKeyset.membersCount:
+        1
    }
```

Generated with discovered.json: 0xa08f831bc81ba1e8dad6f27521784d8cb90e1c41

# Diff at Fri, 02 Feb 2024 11:06:01 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4d9bc19cc4a1e4baaadb947f4ad7e44e6c21ac9 block: 175360077
- current block number: 176692309

## Description

Discover the `dacKeyset`.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 175360077 (main branch discovery), not current.

```diff
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
      unverified:
-        true
      derivedName:
-        ""
+        "RollupProxy"
    }
```

```diff
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
      values.dacKeyset:
+        {"threshold":1,"keyCount":1}
      values.sequencerVersion:
+        "0x88"
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x2623C144B4d167f70893f6A8968B98c89a6C5F97) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x8bE956aB42274056ef4471BEb211b33e258b7324) {
    }
```

Generated with discovered.json: 0x051400056af9aa68473df479ec67cf59fdd332a9

# Diff at Mon, 29 Jan 2024 10:52:51 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 175360077

## Description

Add RARI chain config.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x003e70B041abb993006C03E56c8515622a02928C) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x139C5A235632EDdad741ff380112B3161d31a21C) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x255f80Ef2F09FCE0944faBb292b8510F01316Cf0) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x2e988Ea0873C9d712628F0bf38DAFdE754927C89) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x37e60F80d921dc5E7f501a7130F31f6548dBa564) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x3bC4894370dE0Aa304ed717c2e01866c46F1CEa6) {
    }
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0x91591BB66075BCfF94AA128B003134165C3Ab83a) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    }
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA436f1867adD490BF1530c636f2FB090758bB6B3) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xa9064FebD91E9Ab4c49C8989926Cada18bc9C8FF) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706) {
    }
```
