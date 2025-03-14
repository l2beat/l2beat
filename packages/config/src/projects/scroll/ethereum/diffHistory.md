Generated with discovered.json: 0xabbeed0a41fe30355582a3964e106741f8c8269a

# Diff at Wed, 12 Mar 2025 08:50:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f5d64c565c3cc90f1414096f72fffbafe42bc364 block: 21679349
- current block number: 22029702

## Description

MS signer change.

## Watched changes

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.3:
-        "0x568993632c34604098e35a184C52aD390c70f754"
+        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
-   Status: DELETED
    contract undefined (0x568993632c34604098e35a184C52aD390c70f754)
    +++ description: None
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.3:
-        "0x568993632c34604098e35a184C52aD390c70f754"
+        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
+   Status: CREATED
    contract undefined (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5)
    +++ description: None
```

Generated with discovered.json: 0xefc1fea72b9603481851d16bfa38635f6782781e

# Diff at Tue, 04 Mar 2025 10:39:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21679349
- current block number: 21679349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      sinceBlock:
+        20173741
    }
```

```diff
    contract TimelockSC (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44) {
    +++ description: None
      sinceBlock:
+        21078719
    }
```

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: None
      sinceBlock:
+        18306947
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      sinceBlock:
+        21225420
    }
```

```diff
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      sinceBlock:
+        21270585
    }
```

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      sinceBlock:
+        18296951
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      sinceBlock:
+        19638084
    }
```

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      sinceBlock:
+        20460054
    }
```

```diff
    contract TimelockSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd) {
    +++ description: None
      sinceBlock:
+        21036143
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      sinceBlock:
+        19638087
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      sinceBlock:
+        18306805
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sinceBlock:
+        20460107
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      sinceBlock:
+        19909154
    }
```

```diff
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      sinceBlock:
+        20173752
    }
```

```diff
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      sinceBlock:
+        18318364
    }
```

```diff
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      sinceBlock:
+        18318330
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      sinceBlock:
+        21232661
    }
```

```diff
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      sinceBlock:
+        18306947
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b) {
    +++ description: None
      sinceBlock:
+        21078719
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      sinceBlock:
+        20460053
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      sinceBlock:
+        20631259
    }
```

```diff
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      sinceBlock:
+        20937315
    }
```

```diff
    contract ScrollFeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      sinceBlock:
+        18296974
    }
```

```diff
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      sinceBlock:
+        21078008
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      sinceBlock:
+        19660037
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      sinceBlock:
+        18296928
    }
```

```diff
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      sinceBlock:
+        21131603
    }
```

```diff
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      sinceBlock:
+        20631260
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

```diff
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: None
      sinceBlock:
+        18318929
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      sinceBlock:
+        18306933
    }
```

```diff
    contract ScrollOpsMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      sinceBlock:
+        18296825
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      sinceBlock:
+        18318268
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      sinceBlock:
+        18306934
    }
```

Generated with discovered.json: 0xb7a977e772960aa9a1cfe2ed719fc9ab82319da0

# Diff at Wed, 26 Feb 2025 09:16:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@19452803941a301154c7aa617f3c2cc295e20731 block: 21679349
- current block number: 21679349

## Description

Config related: Add SC reference.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      references:
+        [{"text":"Security Council members - Scroll Docs","href":"https://scroll.io/gov-docs/content/security-council"}]
    }
```

Generated with discovered.json: 0xea359131fd8dab35747ad6a95de93324df3503b5

# Diff at Mon, 27 Jan 2025 08:45:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 21679349
- current block number: 21679349

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21679349 (main branch discovery), not current.

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.58:
-        {"batchIndex":346815}
+        346815
      values.revertedBatches.57:
-        {"batchIndex":346816}
+        346816
      values.revertedBatches.56:
-        {"batchIndex":346817}
+        346817
      values.revertedBatches.55:
-        {"batchIndex":346818}
+        346818
      values.revertedBatches.54:
-        {"batchIndex":275173}
+        275173
      values.revertedBatches.53:
-        {"batchIndex":275172}
+        275172
      values.revertedBatches.52:
-        {"batchIndex":275171}
+        275171
      values.revertedBatches.51:
-        {"batchIndex":275170}
+        275170
      values.revertedBatches.50:
-        {"batchIndex":275169}
+        275169
      values.revertedBatches.49:
-        {"batchIndex":275168}
+        275168
      values.revertedBatches.48:
-        {"batchIndex":275167}
+        275167
      values.revertedBatches.47:
-        {"batchIndex":275166}
+        275166
      values.revertedBatches.46:
-        {"batchIndex":275165}
+        275165
      values.revertedBatches.45:
-        {"batchIndex":275164}
+        275164
      values.revertedBatches.44:
-        {"batchIndex":275163}
+        275163
      values.revertedBatches.43:
-        {"batchIndex":275162}
+        275162
      values.revertedBatches.42:
-        {"batchIndex":275161}
+        275161
      values.revertedBatches.41:
-        {"batchIndex":275160}
+        275160
      values.revertedBatches.40:
-        {"batchIndex":275159}
+        275159
      values.revertedBatches.39:
-        {"batchIndex":275158}
+        275158
      values.revertedBatches.38:
-        {"batchIndex":275157}
+        275157
      values.revertedBatches.37:
-        {"batchIndex":275156}
+        275156
      values.revertedBatches.36:
-        {"batchIndex":275155}
+        275155
      values.revertedBatches.35:
-        {"batchIndex":275154}
+        275154
      values.revertedBatches.34:
-        {"batchIndex":275153}
+        275153
      values.revertedBatches.33:
-        {"batchIndex":275152}
+        275152
      values.revertedBatches.32:
-        {"batchIndex":275151}
+        275151
      values.revertedBatches.31:
-        {"batchIndex":275150}
+        275150
      values.revertedBatches.30:
-        {"batchIndex":275149}
+        275149
      values.revertedBatches.29:
-        {"batchIndex":275148}
+        275148
      values.revertedBatches.28:
-        {"batchIndex":275147}
+        275147
      values.revertedBatches.27:
-        {"batchIndex":275146}
+        275146
      values.revertedBatches.26:
-        {"batchIndex":275145}
+        275145
      values.revertedBatches.25:
-        {"batchIndex":275144}
+        275144
      values.revertedBatches.24:
-        {"batchIndex":275143}
+        275143
      values.revertedBatches.23:
-        {"batchIndex":275142}
+        275142
      values.revertedBatches.22:
-        {"batchIndex":275141}
+        275141
      values.revertedBatches.21:
-        {"batchIndex":275140}
+        275140
      values.revertedBatches.20:
-        {"batchIndex":275139}
+        275139
      values.revertedBatches.19:
-        {"batchIndex":275138}
+        275138
      values.revertedBatches.18:
-        {"batchIndex":275137}
+        275137
      values.revertedBatches.17:
-        {"batchIndex":275136}
+        275136
      values.revertedBatches.16:
-        {"batchIndex":275135}
+        275135
      values.revertedBatches.15:
-        {"batchIndex":275134}
+        275134
      values.revertedBatches.14:
-        {"batchIndex":275133}
+        275133
      values.revertedBatches.13:
-        {"batchIndex":275132}
+        275132
      values.revertedBatches.12:
-        {"batchIndex":275131}
+        275131
      values.revertedBatches.11:
-        {"batchIndex":275130}
+        275130
      values.revertedBatches.10:
-        {"batchIndex":275129}
+        275129
      values.revertedBatches.9:
-        {"batchIndex":275128}
+        275128
      values.revertedBatches.8:
-        {"batchIndex":275127}
+        275127
      values.revertedBatches.7:
-        {"batchIndex":275126}
+        275126
      values.revertedBatches.6:
-        {"batchIndex":275125}
+        275125
      values.revertedBatches.5:
-        {"batchIndex":275124}
+        275124
      values.revertedBatches.4:
-        {"batchIndex":275123}
+        275123
      values.revertedBatches.3:
-        {"batchIndex":275122}
+        275122
      values.revertedBatches.2:
-        {"batchIndex":275121}
+        275121
      values.revertedBatches.1:
-        {"batchIndex":275120}
+        275120
      values.revertedBatches.0:
-        {"batchIndex":275119}
+        275119
    }
```

Generated with discovered.json: 0x31eadc495ede66dd3cd8d8a251ac8367c850b8d9

# Diff at Wed, 22 Jan 2025 11:44:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21579385
- current block number: 21679349

## Description

Gov update: Security Council added.

The ScrollOwner can be accessed by 4 Timelocks (see `l2b ui` and new contracts section):
- SC path (upgrade, ProxyAdmin owner): no delay, SecurityCouncil
- Slow path (ScrollOwner Admin -> manage all roles): 3d delay, SecurityCouncil
- Fast path (ops, configs): 1d delay, ScrollOpsMultisig + ScrollExecutorMultisig (!CURRENTLY ALSO ADDITIONAL SCROLLOWNER ADMIN!)
- Emergency Path (pause, revert batches, remove sequencers): no delay, ScrollEmergencyMultisig + ScrollExecutorMultisig

In summary: Current upgrades are either instant (SC) or 1d delay (ScrollOpsMultisig + ScrollExecutorMultisig). Pausing is instant (ScrollEmergencyMultisig + ScrollExecutorMultisig), ops are 1d delay (ScrollOpsMultisig + ScrollExecutorMultisig).

## Watched changes

```diff
-   Status: DELETED
    contract TimelockController (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C)
    +++ description: None
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.1:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
+        "0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C"
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.roles.SECURITY_COUNCIL_NO_DELAY_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44"
      values.accessControl.roles.SCROLL_MULTISIG_NO_DELAY_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.roles.EMERGENCY_MULTISIG_NO_DELAY_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.roles.TIMELOCK_1DAY_DELAY_TOLE.members.0:
-        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.roles.TIMELOCK_7DAY_DELAY_ROLE.members.0:
-        "0xDC1d1189Da69Ae2016E4976A43De20972D349B1b"
      values.accessControl.roles.emergency-nodelay:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x826714adD4dDA2b8750794A467C892c0Cd49216b"]}
      values.accessControl.roles.ops-fast:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x0e58939204eEDa84F796FBc86840A50af10eC4F4"]}
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.0x10d44583:
-        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeSequencer(address).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeSequencer(address).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeProver(address).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.removeProver(address).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.setPause(bool).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.addSequencer(address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.addProver(address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.updateMaxNumTxInChunk(uint256).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "ops-fast"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B.updateGasOracle(address):
-        ["TIMELOCK_1DAY_DELAY_TOLE"]
      values.accessControl.targets.0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B.updateMaxGasLimit(uint256).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).1:
-        "EMERGENCY_MULTISIG_NO_DELAY_ROLE"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.setPause(bool).0:
-        "SCROLL_MULTISIG_NO_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateMaxReplayTimes(uint256).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367.updateFeeVault(address):
+        ["ops-fast"]
      values.accessControl.targets.0x987e300fDfb06093859358522a79098848C33852:
-        {"setIntrinsicParams(uint64,uint64,uint64,uint64)":["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37.updateWhitelistStatus(address[],bool).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0:
-        {"updateVerifier(uint64,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE","TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6.setERC20Gateway(address[],address[]).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xb2b10a289A229415a124EFDeF310C10cb004B6ff.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6.updateTokenMapping(address,address).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.updateCircleCaller(address).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "ops-fast"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.pauseDeposit(bool).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B.pauseWithdraw(bool).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "emergency-nodelay"
      values.accessControl.targets.0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d:
-        {"setPause(bool)":["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x1Ea29d57dAC237152d878758bAe4BeB2668998f6:
-        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE","SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B:
-        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24)).0:
-        "TIMELOCK_1DAY_DELAY_TOLE"
+        "ops-fast"
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.grantRole(bytes32,address):
+        ["ops-fast"]
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4.revokeRole(bytes32,address):
+        ["ops-fast"]
      values.accessControl.targets.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F.updateVerifier(uint256,uint64,address).0:
-        "TIMELOCK_7DAY_DELAY_ROLE"
+        "SECURITY_COUNCIL_NO_DELAY_ROLE"
    }
```

```diff
-   Status: DELETED
    contract TimelockController (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSC (0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSlow (0x3f9041350B661c74C6CbE440c8Bd6BC4C168a9fd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0x826714adD4dDA2b8750794A467C892c0Cd49216b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafeL2/GnosisSafeL2.sol   | 1032 +++++++++++++++++
 .../.flat/GnosisSafeL2/GnosisSafeProxy.p.sol       |   35 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 +++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../scroll/ethereum/.flat/SecurityCouncil/Safe.sol | 1088 +++++++++++++++++
 .../ethereum/.flat/SecurityCouncil/SafeProxy.p.sol |   37 +
 .../TimelockEmergency.sol}                         |    2 +-
 .../TimelockSC.sol}                                |    2 +-
 .../scroll/ethereum/.flat/TimelockSlow.sol         | 1223 ++++++++++++++++++++
 15 files changed, 7917 insertions(+), 2 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract TimelockController (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    +++ description: None
      name:
-        "TimelockSlow"
+        "TimelockController"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C","0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]}}
    }
```

```diff
    contract ScrollExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "ScrollExecutorMultisig"
    }
```

```diff
    contract ScrollFeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      name:
-        "FeeVaultMultisig"
+        "ScrollFeeVaultMultisig"
    }
```

```diff
    contract ScrollEmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      name:
-        "EmergencyMultisig"
+        "ScrollEmergencyMultisig"
    }
```

```diff
    contract TimelockController (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    +++ description: None
      name:
-        "TimelockMid"
+        "TimelockController"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xDC1d1189Da69Ae2016E4976A43De20972D349B1b","0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]}}
    }
```

```diff
    contract ScrollOpsMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      name:
-        "ScrollMultisig"
+        "ScrollOpsMultisig"
    }
```

Generated with discovered.json: 0xa59dbabba9ddd32f5a344a5e98932b5d437a2dfd

# Diff at Mon, 20 Jan 2025 11:10:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21579385
- current block number: 21579385

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      receivedPermissions.14.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      receivedPermissions.14.from:
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      receivedPermissions.13.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.13.from:
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.12.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.12.from:
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.11.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.11.from:
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.10.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.10.from:
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.9.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.9.from:
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.8.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.8.from:
+        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.7.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.7.from:
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.6.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.6.from:
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.5.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.5.from:
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.4.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.4.from:
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.3.target:
-        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      receivedPermissions.3.from:
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      receivedPermissions.2.target:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      receivedPermissions.2.from:
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      receivedPermissions.1.target:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      receivedPermissions.1.from:
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      receivedPermissions.0.target:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      receivedPermissions.0.from:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      directlyReceivedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
      directlyReceivedPermissions.0.from:
+        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      directlyReceivedPermissions.14.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      directlyReceivedPermissions.14.from:
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      directlyReceivedPermissions.13.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      directlyReceivedPermissions.13.from:
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      directlyReceivedPermissions.12.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      directlyReceivedPermissions.12.from:
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      directlyReceivedPermissions.11.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      directlyReceivedPermissions.11.from:
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      directlyReceivedPermissions.10.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.10.from:
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      directlyReceivedPermissions.9.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      directlyReceivedPermissions.9.from:
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      directlyReceivedPermissions.8.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
      directlyReceivedPermissions.8.from:
+        "0x987e300fDfb06093859358522a79098848C33852"
      directlyReceivedPermissions.7.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.7.from:
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      directlyReceivedPermissions.6.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      directlyReceivedPermissions.6.from:
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      directlyReceivedPermissions.5.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      directlyReceivedPermissions.5.from:
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      directlyReceivedPermissions.4.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      directlyReceivedPermissions.4.from:
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      directlyReceivedPermissions.3.target:
-        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      directlyReceivedPermissions.3.from:
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
      directlyReceivedPermissions.2.target:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      directlyReceivedPermissions.2.from:
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      directlyReceivedPermissions.1.target:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      directlyReceivedPermissions.1.from:
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      directlyReceivedPermissions.0.target:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
      directlyReceivedPermissions.0.from:
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

Generated with discovered.json: 0xc70e05862c6abe7b50a804ac14b44107cf695db0

# Diff at Fri, 10 Jan 2025 15:23:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13c134b0211f75779d58c36868cbda90565479ce block: 21579385
- current block number: 21579385

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579385 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xc98f03651ddf430db5e0fa5d49b57551e01975529019ff3fbc1897109cd6dc9e"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.11.4/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xcd6a67da07fdd0ff4f75a99bf03d70659a6a00d98f1219b1aff2756b7ce971bd"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.10.3/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV0 (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x29ee0fd7e29697f9960266e0f8fc2b84b927300952d489ee40ea3cff695bd819"]
      references:
+        [{"text":"Source Code","href":"https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.9.5/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0x438a888895bdfdd405a223087c58ce76dcd866a0c5e208b94c63e83922724cb3"]
      references:
+        [{"text":"Source Code","href":"https://github.com/scroll-tech/scroll-prover/blob/main/release-v0.12.0/evm_verifier.yul"}]
    }
```

```diff
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xdd6da115b0a4c879746bcca2a71fa1daa79f7e3a074369d9246f614b327e9322"]
      references:
+        [{"text":"Source Code","href":"https://github.com/scroll-tech/scroll-prover/blob/main/release-v0.13.0/evm_verifier.yul"}]
    }
```

Generated with discovered.json: 0x16c05b9aad122da9bb70b5a2bef9a422726b1ce1

# Diff at Wed, 08 Jan 2025 11:14:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 21543805
- current block number: 21579385

## Description

One address removed from the whitelist (for actors that can set the l2 base fee on L1).

## Watched changes

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      values.whitelisted.1:
-        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
      values.whitelisted.0:
-        "0x21b8a9F5a4640c3FC13E19C48e776173e1210995"
+        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
    }
```

Generated with discovered.json: 0x92c5aa762d09f5cd371ec95e75a5e9d0e39f8600

# Diff at Fri, 03 Jan 2025 11:58:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21465455
- current block number: 21543805

## Description

Scroll operator addresses removed / changed.

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.provers.3:
-        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.2:
-        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.provers.1:
-        "0x69d79Fc4Ae89E4DA80D719e26a435621F75B7f06"
+        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.0:
-        "0x356483dC32B004f32Ea0Ce58F7F88879886e9074"
+        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.sequencers.3:
-        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.2:
-        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
      values.sequencers.1:
-        "0x2ce8B4A516ebBc8B425764a867B742F76C2244c7"
+        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.0:
-        "0xcF2898225ED05Be911D3709d9417e86E0b4Cfc8f"
+        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
    }
```

Generated with discovered.json: 0x384419632caf39432c39bdffcdd60bf8377b7b8d

# Diff at Mon, 23 Dec 2024 13:24:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21264288
- current block number: 21465455

## Description

2 provers, 2 sequencers added and one whitelisted address added (can relay l2 basefee on l1).

## Watched changes

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      values.whitelisted.1:
+        "0x3a2855ea96b2eb965568eA5d738B8DE185C717f4"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.provers.3:
+        "0x74b286304576625557629C47E9E8702383D9eF92"
      values.provers.2:
+        "0x6F9D816c4ec365Fe8Fc6898c785Be0E2D51bEC2c"
      values.sequencers.3:
+        "0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858"
      values.sequencers.2:
+        "0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B"
    }
```

Generated with discovered.json: 0x8805237f1312263093e4828c630a57292dd03616

# Diff at Mon, 25 Nov 2024 10:51:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21184190
- current block number: 21264288

## Description

Same one signer removed from ExecutorMultisig and EmergencyMultisig.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.4:
-        "0x568993632c34604098e35a184C52aD390c70f754"
      values.$members.3:
-        "0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632"
+        "0x568993632c34604098e35a184C52aD390c70f754"
      values.multisigThreshold:
-        "1 of 5 (20%)"
+        "1 of 4 (25%)"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.4:
-        "0x568993632c34604098e35a184C52aD390c70f754"
      values.$members.3:
-        "0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632"
+        "0x568993632c34604098e35a184C52aD390c70f754"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x8523c24bfac779038af8583a650b1aca37ec8f83

# Diff at Thu, 14 Nov 2024 06:38:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 20891049
- current block number: 21184190

## Description

Batches reverted due to accidental 'old-version batches'. The reverted batches used the old version 2 and not the new v4 `commitBatchWithBlobProof()`. The post-mortem should appear [here](https://status.scroll.io/incidents/pw1cf3bmxy8s).

In Scroll, batches can be reverted by the EmergencyMultisig anytime before they are proven (which currently happens around 2h after they are commited).

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.58:
+        {"batchIndex":346815}
      values.revertedBatches.57:
+        {"batchIndex":346816}
      values.revertedBatches.56:
+        {"batchIndex":346817}
      values.revertedBatches.55:
+        {"batchIndex":346818}
    }
```

Generated with discovered.json: 0x37b9192ba10b35d754cdfbbd94be1ecc543bce1d

# Diff at Mon, 21 Oct 2024 12:48:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      descriptions:
-        ["Used to update the verifier and keep track of current and old versions."]
      description:
+        "Used to update the verifier and keep track of current and old versions."
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      descriptions:
-        ["Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."]
      description:
+        "Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."
    }
```

Generated with discovered.json: 0x9a42cb161d5a63ef5379e507db48f193259f9917

# Diff at Mon, 21 Oct 2024 11:09:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]
      values.$pastUpgrades.2.1:
-        ["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]
+        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
      values.$pastUpgrades.1.2:
+        ["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]
      values.$pastUpgrades.1.1:
-        ["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]
      values.$pastUpgrades.0.1:
-        ["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]
+        "0xdd4c82f4c38c76c6bb222f2b319e870ed48d8d4dc2a73e0baa5d560a286924b2"
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]
      values.$pastUpgrades.1.1:
-        ["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]
+        "0x3ee1ca7b7a92d6181b5a38859b4ae747c6fb4b42e4407c3a854f55b82564aba1"
      values.$pastUpgrades.0.2:
+        ["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]
      values.$pastUpgrades.0.1:
-        ["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]
+        "0x56e31c0072f983bfee035b6bf464b53b9d998afab20e0046cdc3fc209b4a191e"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]
      values.$pastUpgrades.1.1:
-        ["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]
      values.$pastUpgrades.0.1:
-        ["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]
+        "0x5cb06c63fb2583db9eba85a73ca794a9d36eace7f91925962b8cc97fd06b9b7d"
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]
      values.$pastUpgrades.1.1:
-        ["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]
+        "0xd755174ba6bacec85b68b77c9ec2a8b966955746be59a6efa932f47c37dda482"
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0xec5c25ea4b3e6d1dc9fa4cb7b7dd37a7a245a171cd3d16fb312628b5ecc9e841"
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0x9776779beb429ea826a81a8c1c5f782933bfc8ce568afa1c6f2c2b866be2a3a5"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]
      values.$pastUpgrades.1.1:
-        ["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]
      values.$pastUpgrades.0.1:
-        ["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]
+        "0xcad9f31340db6aca3a5da0d704ee33a9b6c43a5b1be4406cc0ed33edbdd7c92e"
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x642af405bF64660665B37977449C9C536B806318"]
      values.$pastUpgrades.0.1:
-        ["0x642af405bF64660665B37977449C9C536B806318"]
+        "0xd2e3c3d2839a35492419c5a1ae863e7a23d963cb4853c59e8e20832e0ee4ed3e"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]
      values.$pastUpgrades.1.1:
-        ["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]
      values.$pastUpgrades.0.1:
-        ["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]
+        "0x0f1df3c211e6b201b0bb0cc41c87c2fbb36683f2a24080d935ffdc587723c033"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x546E0bF31FB6e7babD493452e4e6999191367B42"]
      values.$pastUpgrades.1.1:
-        ["0x546E0bF31FB6e7babD493452e4e6999191367B42"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]
      values.$pastUpgrades.0.1:
-        ["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]
+        "0xbd63d1902c6343a9cdb81aa8944621690e4dd62a82640fded7f7c3d969e3647a"
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]
      values.$pastUpgrades.0.1:
-        ["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]
+        "0xf25a4fbbd1569b188ce8855ff12760904d976be976c35afeb4abd9566db5ca38"
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
      values.$pastUpgrades.2.1:
-        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
+        "0xb367f770c26a72ea837a51c2c1fc84a3396914db1d58c020177b207e0f876a79"
      values.$pastUpgrades.1.2:
+        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
      values.$pastUpgrades.1.1:
-        ["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]
+        "0xe03abd155a10591ed1fa4a1e2ad0d6042549bfd67769dbf6bd66d25743950905"
      values.$pastUpgrades.0.2:
+        ["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]
      values.$pastUpgrades.0.1:
-        ["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]
+        "0xa2ff9275d6280e3cc298653463c5d8423c44cfbc66a52a9a138becbb106dc0f8"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]
      values.$pastUpgrades.4.1:
-        ["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]
+        "0x3928e0223337a112ea68c84db95441185a3e1da809638be13c0135761aa19ee7"
      values.$pastUpgrades.3.2:
+        ["0x4F250B05262240C787a1eE222687C6eC395C628A"]
      values.$pastUpgrades.3.1:
-        ["0x4F250B05262240C787a1eE222687C6eC395C628A"]
+        "0x87f533704b3cdac75c20bbdcd202a97ee62075c188ccea27ab7ff494cdeea247"
      values.$pastUpgrades.2.2:
+        ["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]
      values.$pastUpgrades.2.1:
-        ["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]
+        "0x6eb161ed649cf22771e586a8546eec157717e2dec4c871e7ad4e4d2c5c59a905"
      values.$pastUpgrades.1.2:
+        ["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]
      values.$pastUpgrades.1.1:
-        ["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]
      values.$pastUpgrades.0.1:
-        ["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]
+        "0xecc94033ca66ea9068acde109b0c9e3c539191645916a35952bb6d9fd2be3a02"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]
      values.$pastUpgrades.1.1:
-        ["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
      values.$pastUpgrades.0.1:
-        ["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]
+        "0x12f874f5ca5a8dbdc5162db5179a4e4b753f4fcff8dab3f416bd1ce707ecb9ff"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]
      values.$pastUpgrades.1.1:
-        ["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]
      values.$pastUpgrades.0.1:
-        ["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]
+        "0xe6cabeddb49c286b33e0e6d4a43af76e1a2108ac9fc91afb508a5ea86a8fc646"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]
      values.$pastUpgrades.1.1:
-        ["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x9218732389D80f9b8723C3f32a38865B7a63564A"]
      values.$pastUpgrades.0.1:
-        ["0x9218732389D80f9b8723C3f32a38865B7a63564A"]
+        "0x85d366c40632340d9e835fdd0a1646909a56d60c680373f15f9d36878ff13029"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]
      values.$pastUpgrades.1.1:
-        ["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]
+        "0xe378370b6bbc3d7f7278df88aa0e233b8f0fea3d77bef04593919b29d0094826"
      values.$pastUpgrades.0.2:
+        ["0x6667123b5017AAB9945F73345848B82D7A953AA8"]
      values.$pastUpgrades.0.1:
-        ["0x6667123b5017AAB9945F73345848B82D7A953AA8"]
+        "0x394b36151c614a7dfd048ddc1085046d2a50e5fd54af4c335d4a08aa79dd773d"
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]
      values.$pastUpgrades.0.1:
-        ["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]
+        "0x8f6851c707737c446ee55f39be1442ce8cfa50ef8522b34bac247c0bb39a14ec"
    }
```

Generated with discovered.json: 0xafd1c1ddac67caddf5e22e82e7cc0db2def73728

# Diff at Mon, 14 Oct 2024 10:55:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20891049
- current block number: 20891049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20891049 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3e38728c8eff2d4e99a76036010214e6ece1aebfa85496f776910c3e674d90e0"]
    }
```

```diff
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract TimelockSlow (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    +++ description: None
      sourceHashes:
+        ["0x118a84c5ed8e5625f8df5325e4bd028d66a65a2d08b9b7d3b72b6c9f7a955e95"]
    }
```

```diff
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB) {
    +++ description: None
      sourceHashes:
+        ["0xa3e375ce1143ce7410edcfff2fbfa0ee90c06ef0710c4f11af9533ca40cdbb61"]
    }
```

```diff
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      sourceHashes:
+        ["0x6e45af76d6f6e2d8cc55ec530468293a0af33a8ab5e385883527a3330ff21ed6"]
    }
```

```diff
    contract ZkEvmVerifierV0 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xcba3cc3603700feae97964e6eff747508e82a958b820d7d48c7f7399faf4d771"]
    }
```

```diff
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x2a543ae77e08fc2293b99836986b16db46b713eb958556cd1c95fcabce559b4b"]
    }
```

```diff
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2) {
    +++ description: None
      sourceHashes:
+        ["0xac7d02f7eaff4b15c79e0507b392db7e05fbf7f5f5a594a7b091a936d951bb3a"]
    }
```

```diff
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x255712204c1736d1d147513fc6d0ded282eb2cd0cff359e7710a06463935c260"]
    }
```

```diff
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x5d09a2c78d20d4e9f61774a32aa4da8e74be21a247188625d5eeffdac11e5eb4"]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe550fda323606a4b4fd2a05cf45dda231290e1d57a077828632c098fa0579161"]
    }
```

```diff
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xcb83aeace6c4751da7d9340ffa2eff5c9c9fdf2e9c1f25d6bc2f31ffabfcb477"]
    }
```

```diff
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      sourceHashes:
+        ["0x92fd37cca83c3ecf2b4b1343a3287484d39591016bdd853e572e12c286c0d952"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","via":[{"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072"}]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xb90cab5924c6894e3047536242125cdface40857b9c70a6551210bc6de166b42"]
    }
```

```diff
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xa874514fbf17dc321480a8270dcdc3a5a0d9b8e37ff5de1187df641cd4a2f6e4"]
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x5987f713ef726c459b82ad7473f780457f91510e0d04802551136d8133e531d1"]
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe564c04903b37a6ee36ca18aeb567c15ce70fe0a8022621e7c93c833bc2fbbf3"]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x2069ff6eafc8fa79ae2c7e13a2618c44102f1f1b273cc5584e0b7cd3961948e1"]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0xe564c04903b37a6ee36ca18aeb567c15ce70fe0a8022621e7c93c833bc2fbbf3"]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x35e9a9e7a691f357e642a73662c88a202224b73a44fc022f833ccc8aff9a4a64"]
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3) {
    +++ description: None
      sourceHashes:
+        ["0xa3e375ce1143ce7410edcfff2fbfa0ee90c06ef0710c4f11af9533ca40cdbb61"]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x93fe70d828e5646f5acb7768083ab2e5b9cfb5b6691a5dff48ff3c188ffd05a7"]
    }
```

```diff
    contract TimelockMid (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    +++ description: None
      sourceHashes:
+        ["0x9dd794c91c0c92b8b8129a7c4d61c361b75602f161dc7b58f5908edafb920049"]
    }
```

```diff
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: None
      sourceHashes:
+        ["0xbd93ab76adebffc57b218e617f8072475f3ebc90b734fbad60c100d603b3121b"]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515"},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852"},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556"},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff"},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"},{"permission":"upgrade","target":"0x67260A8B73C5B77B55c1805218A42A7A6F98F515"},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852"},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556"},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff"},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}]
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x390ebeb0e223ceead94e94a21c34b8bc5bde0351a7c29ca6b8abb4776ce58524"]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEB803eb3F501998126bf37bB823646Ed3D59d072"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      issuedPermissions.0.via.0:
+        {"address":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","delay":0}
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3257fd4336e925899e6352562238124ef46e51d144d4a4d12526837be49a062f"]
    }
```

Generated with discovered.json: 0x733494d407e555a98739d03978d0302e5362a2a4

# Diff at Fri, 04 Oct 2024 08:46:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@000446ee962492b0a3a917c3f907d3277663f719 block: 20847193
- current block number: 20891049

## Description

Hide external escrow governance.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20847193 (main branch discovery), not current.

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xCC2C53556Bc75217cf698721b29071d6f12628A9","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6)
    +++ description: None
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x9eBf2f33526CD571f8b2ad312492cb650870CFd6","via":[]}]
    }
```

```diff
-   Status: DELETED
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9)
    +++ description: None
```

Generated with discovered.json: 0x5d92e37e7058817c7609154f19f728454dc8c25e

# Diff at Tue, 01 Oct 2024 10:54:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20847193
- current block number: 20847193

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20847193 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:11.000Z",["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]],["2024-02-22T08:20:23.000Z",["0xeBaed7A81c298B24EE6d59c22698A951dc448E01"]],["2024-08-20T23:36:35.000Z",["0x137CC585F607EDeBBc3CA6360AffCFeab507B374"]]]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-20T05:48:59.000Z",["0xFAf8f72e54d1089fa1882b6f597BfDFF59a8AFca"]],["2024-05-20T06:38:59.000Z",["0x7999cdD5E2893475D89211A2E3FdA67a841E3233"]]]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"]],["2024-02-22T08:20:23.000Z",["0xd1841c5756428812233eEA78afC17cb2D3e392bb"]]]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:48:23.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]],["2024-03-05T07:48:59.000Z",["0xF4f2066EE72D62e3caF9678459149BA7FCf2262F"]]]
    }
```

```diff
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:41:35.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]]]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]],["2024-02-22T08:20:23.000Z",["0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"]]]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x642af405bF64660665B37977449C9C536B806318"]]]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xd3c42158682D55E082EaBe08a29F7515A97cA307"]],["2024-02-22T08:20:23.000Z",["0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"]]]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]],["2024-02-22T08:20:23.000Z",["0x546E0bF31FB6e7babD493452e4e6999191367B42"]]]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:11.000Z",["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]]]
    }
```

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-15T09:31:47.000Z",["0xc4d46E8402F476F269c379677C99F18E22Ea030e"]],["2024-04-15T09:31:47.000Z",["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]],["2024-04-15T09:31:47.000Z",["0x08D77Ea90DB9BF6c0d3f66E6b8394DA2E81B9a03"]]]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]],["2024-02-22T08:20:23.000Z",["0xFA148514d03420b7b1a13eC74da06D2Ca875539C"]],["2024-04-28T22:06:35.000Z",["0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"]],["2024-07-02T10:10:47.000Z",["0x4F250B05262240C787a1eE222687C6eC395C628A"]],["2024-08-20T23:36:35.000Z",["0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"]]]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"]],["2024-02-22T08:20:23.000Z",["0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"]]]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xCb4638620E4C6DeCef26374e71b0dd4871863593"]],["2024-02-22T08:20:23.000Z",["0x244BF7aEf29F03916569470a51fA0794B62F8cd7"]]]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0x9218732389D80f9b8723C3f32a38865B7a63564A"]],["2024-02-22T08:20:23.000Z",["0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"]]]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-10T06:29:11.000Z",["0x6667123b5017AAB9945F73345848B82D7A953AA8"]],["2024-02-22T08:20:23.000Z",["0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"]]]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-08T16:25:23.000Z",["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]]]
    }
```

Generated with discovered.json: 0x1138ed1c264dc3d7d38d5979f5b35487ff768d7b

# Diff at Sat, 28 Sep 2024 05:59:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f2cc4f81d34dcc94ba050327e26d02cce77f37f4 block: 20842760
- current block number: 20847193

## Description

Rename pufETHEscrow (external), fix references, single signer change in Executor- and EmergencyMultisig.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$members.4:
-        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
+        "0x568993632c34604098e35a184C52aD390c70f754"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$members.4:
-        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
+        "0x568993632c34604098e35a184C52aD390c70f754"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842760 (main branch discovery), not current.

```diff
    contract pufETHEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      name:
-        "pufEthEscrow"
+        "pufETHEscrow"
    }
```

Generated with discovered.json: 0xe6b73b280820baf18ebcfc54742ab25d435f0f0d

# Diff at Fri, 27 Sep 2024 15:09:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20725971
- current block number: 20842760

## Description

Add DAI escrow, upgradeable by ScrollMultisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20725971 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"}
      receivedPermissions.13.target:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      receivedPermissions.12.target:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      receivedPermissions.11.target:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      receivedPermissions.10.target:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      receivedPermissions.9.target:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      receivedPermissions.8.target:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "0x987e300fDfb06093859358522a79098848C33852"
      receivedPermissions.7.target:
-        "0x987e300fDfb06093859358522a79098848C33852"
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      receivedPermissions.6.target:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      receivedPermissions.5.target:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      receivedPermissions.4.target:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      receivedPermissions.3.target:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "0x67260A8B73C5B77B55c1805218A42A7A6F98F515"
    }
```

```diff
+   Status: CREATED
    contract DaiEscrow (0x67260A8B73C5B77B55c1805218A42A7A6F98F515)
    +++ description: None
```

Generated with discovered.json: 0x6b5bd6fa0124dd6da49839e5d834a8f046e373fe

# Diff at Wed, 11 Sep 2024 07:47:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20670849
- current block number: 20725971

## Description

The revertBatch() target is added to the ScrollOwner accesscontrol after our message to the team. Additionally, the 1d timelock is added as an Admin to the ScrollOwner.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.1:
+        "0x0e58939204eEDa84F796FBc86840A50af10eC4F4"
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,bytes):
+        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
    }
```

Generated with discovered.json: 0xf927951961dafb58ba0045cdf101156aeff92873

# Diff at Tue, 03 Sep 2024 15:09:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@8b201382220336bea7cda6fb789ab7a680e53200 block: 20590985
- current block number: 20670849

## Description

[DarwinV2 upgrade](https://github.com/scroll-tech/go-ethereum/releases/tag/scroll-v5.7.0): This security patch adds a fallback for the case where blocks cannot be compressed under the new compression scheme (Darwin Upgrade). These are now posted as uncompressed blobs.

The verifier is therefore changed to a new ZkEvmVerifierV2 (code-identical) and a new PlonkVerifier.

MultipleVersionRollupVerifier owner is changed from ScrollMultisig to ScrollOwner.

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.latestVerifier.4:
+        {"startBatchIndex":0,"verifier":"0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3"}
      values.legacyVerifiersLength.4:
+        0
      values.owner:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
      values.verifierVersions.4:
+        4
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2-1 (0x8c1b52757b5c571ADcB5572E992679d4D48e30f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2-1 (0xCAECeE2E815e7f758c2477f900AFA14bDDce54B3)
    +++ description: None
```

## Source code changes

```diff
.../scroll/ethereum/.flat/ZkEvmVerifierV2-1.sol    | 108 +++++++++++++++++++++
 1 file changed, 108 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590985 (main branch discovery), not current.

```diff
    contract PlonkVerifierV1-1 (0x03a72B00D036C479105fF98A1953b15d9c510110) {
    +++ description: None
      name:
-        "PlonkVerifierV2"
+        "PlonkVerifierV1-1"
    }
```

```diff
    contract PlonkVerifierV2 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9) {
    +++ description: None
      name:
-        "PlonkVerifierV3"
+        "PlonkVerifierV2"
    }
```

Generated with discovered.json: 0x146a15784cddb895f4356aab30b34d927f77049f

# Diff at Fri, 30 Aug 2024 07:57:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20590985
- current block number: 20590985

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20590985 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      receivedPermissions.13.via:
-        []
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
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

Generated with discovered.json: 0x04b22e7cd5dcc1270057a5de114bb00e998fb6d1

# Diff at Fri, 23 Aug 2024 11:25:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1505b6595f98344175251e27ce434d0a44eeefa4 block: 20369470
- current block number: 20590985

## Description

Scroll can now prove bundles (i.e. multiple DA submissions) in a single proof. Full changelog: <https://scroll.io/blog/proof-recursion-scrolls-darwin-upgrade>. It also seems to have forgotten to update a permission for the new `revertBatch` function sig, they have been notified.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$implementation:
-        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
+        "0x137CC585F607EDeBBc3CA6360AffCFeab507B374"
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.revertBatch(bytes,uint256):
-        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0xa13BAF47339d63B743e7Da8741db5456DAc1E556.0x10d44583:
+        ["SCROLL_MULTISIG_NO_DELAY_ROLE","EMERGENCY_MULTISIG_NO_DELAY_ROLE"]
      values.accessControl.targets.0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$implementation:
-        "0x4F250B05262240C787a1eE222687C6eC395C628A"
+        "0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f"
      values.$upgradeCount:
-        4
+        5
      values.verifier:
-        "0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B"
+        "0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV2 (0x2d6e16d8e8a0C3Bc7750E774B108Ec39Ab0C18fB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
+   Status: CREATED
    contract PlonkVerifierV3 (0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9)
    +++ description: None
```

## Source code changes

```diff
.../L1MessageQueueWithGasPriceOracle.sol           |  91 +-
 .../MultipleVersionRollupVerifier.sol              |  28 +-
 .../ScrollChain/ScrollChain.sol                    | 982 +++++++++++++--------
 .../scroll/ethereum/.flat/ZkEvmVerifierV2.sol      | 108 +++
 4 files changed, 812 insertions(+), 397 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B) {
    +++ description: None
      descriptions:
-        ["Used to update the verifier and keep track of current and old versions."]
      errors:
+        {"latestVerifier":"Too many values. Update configuration to explore fully","legacyVerifiersLength":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x95207ea1348314a8bec2c992ec6b27e54c1107cc

# Diff at Fri, 23 Aug 2024 09:55:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7abca15987bdd3cc1c67142350cc77260caaa885

# Diff at Wed, 21 Aug 2024 10:05:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCC2C53556Bc75217cf698721b29071d6f12628A9","via":[]}]
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract OLD_L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA033Ff09f2da45f0e9ae495f525363722Df42b2a","via":[]}]
    }
```

```diff
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9eBf2f33526CD571f8b2ad312492cb650870CFd6","via":[]}]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x6625C6332c9F91F2D27c304E729B86db87A3f504","via":[]}]
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0x987e300fDfb06093859358522a79098848C33852","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0xa13BAF47339d63B743e7Da8741db5456DAc1E556","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","via":[]},{"permission":"upgrade","target":"0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","via":[]},{"permission":"upgrade","target":"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","via":[]},{"permission":"upgrade","target":"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","via":[]},{"permission":"upgrade","target":"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","via":[]},{"permission":"upgrade","target":"0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","via":[]},{"permission":"upgrade","target":"0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","via":[]},{"permission":"upgrade","target":"0x987e300fDfb06093859358522a79098848C33852","via":[]},{"permission":"upgrade","target":"0xa13BAF47339d63B743e7Da8741db5456DAc1E556","via":[]},{"permission":"upgrade","target":"0xb2b10a289A229415a124EFDeF310C10cb004B6ff","via":[]},{"permission":"upgrade","target":"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","via":[]},{"permission":"upgrade","target":"0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","via":[]},{"permission":"upgrade","target":"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","via":[]},{"permission":"upgrade","target":"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","via":[]}]
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEB803eb3F501998126bf37bB823646Ed3D59d072","via":[]}]
    }
```

Generated with discovered.json: 0xa83743d41b34443d94cba6a4599a764422ba0ec9

# Diff at Fri, 09 Aug 2024 12:02:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions.upgrade.13:
-        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
+        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
      assignedPermissions.upgrade.12:
-        "0x987e300fDfb06093859358522a79098848C33852"
+        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
      assignedPermissions.upgrade.11:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
      assignedPermissions.upgrade.10:
-        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
+        "0xa13BAF47339d63B743e7Da8741db5456DAc1E556"
      assignedPermissions.upgrade.9:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      assignedPermissions.upgrade.8:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      assignedPermissions.upgrade.7:
-        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
+        "0x987e300fDfb06093859358522a79098848C33852"
      assignedPermissions.upgrade.6:
-        "0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6"
+        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      assignedPermissions.upgrade.5:
-        "0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"
+        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
      assignedPermissions.upgrade.4:
-        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      assignedPermissions.upgrade.3:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      assignedPermissions.upgrade.2:
-        "0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE"
+        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
      assignedPermissions.upgrade.1:
-        "0xb2b10a289A229415a124EFDeF310C10cb004B6ff"
+        "0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4"
      assignedPermissions.upgrade.0:
-        "0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B"
+        "0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B"
    }
```

Generated with discovered.json: 0xea477ad26addbd659b6e6624ccb8b9a297c9b89c

# Diff at Fri, 09 Aug 2024 10:12:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 5 (20%)"
      values.getOwners:
-        ["0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0","0xfc31892C5500AbE00974280b28907BaA9190E384"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0","0xfc31892C5500AbE00974280b28907BaA9190E384"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]
      assignedPermissions.upgrade:
+        ["0xA033Ff09f2da45f0e9ae495f525363722Df42b2a"]
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0c5cc5155b346453154059aD9d2Ff695dB92f774","0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","0xd7bC70ecf344C279eB78C8899Ba5538e2e3A0632","0xdA66Df3920091eF4B54782B9463587c314DAdD41"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 8 (38%)"
      values.getOwners:
-        ["0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a","0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA","0xf09c25681090C5F9408c6D3CD24baa8721870dc5","0xD6475ce37d964d4816715FdafFEeAAf2958948bE","0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94","0x8F97Bf67182122D2f1745216a81724143db97E43","0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D","0x206846dE1F372A9a603e672ba97A5238cC89aeAA"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a","0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA","0xf09c25681090C5F9408c6D3CD24baa8721870dc5","0xD6475ce37d964d4816715FdafFEeAAf2958948bE","0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94","0x8F97Bf67182122D2f1745216a81724143db97E43","0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D","0x206846dE1F372A9a603e672ba97A5238cC89aeAA"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 8 (38%)"
    }
```

```diff
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]
      assignedPermissions.upgrade:
+        ["0x6625C6332c9F91F2D27c304E729B86db87A3f504"]
    }
```

```diff
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0x987e300fDfb06093859358522a79098848C33852","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0xa13BAF47339d63B743e7Da8741db5456DAc1E556","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B"]
      assignedPermissions.upgrade:
+        ["0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B","0xb2b10a289A229415a124EFDeF310C10cb004B6ff","0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE","0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6","0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4","0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B","0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6","0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d","0x7F2b8C31F88B6006c382775eea88297Ec1e3E905","0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9","0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B","0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367","0x987e300fDfb06093859358522a79098848C33852","0xa13BAF47339d63B743e7Da8741db5456DAc1E556"]
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 5 (80%)"
      values.getOwners:
-        ["0xFCf6364F5157901f533DD3615A5d8c375F13c072","0xE2e6345baAD18f779167443Dc4886495507b3249","0xEbbeeAA424AE904508465a41c927Be594C43Dc68","0xfc31892C5500AbE00974280b28907BaA9190E384","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xFCf6364F5157901f533DD3615A5d8c375F13c072","0xE2e6345baAD18f779167443Dc4886495507b3249","0xEbbeeAA424AE904508465a41c927Be594C43Dc68","0xfc31892C5500AbE00974280b28907BaA9190E384","0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0xd370682bb33d7515ec78c08804cd8c7527f97ac7

# Diff at Tue, 30 Jul 2024 11:14:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20369470
- current block number: 20369470

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20369470 (main branch discovery), not current.

```diff
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    +++ description: None
      fieldMeta:
+        {"paused":{"severity":"HIGH","description":"Whether the sendTransaction function is paused or not. Affects the sequencer failure risk."}}
    }
```

Generated with discovered.json: 0x74483202a2abf595fbdc6afc5fe3b6ad0a90017a

# Diff at Tue, 23 Jul 2024 13:16:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f8d5c0ccc8d74a077f85a8dca4038e175812c389 block: 20311071
- current block number: 20369470

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 7 (43%)"
+        "3 of 8 (38%)"
      values.getOwners.7:
+        "0x206846dE1F372A9a603e672ba97A5238cC89aeAA"
      values.getOwners.6:
-        "0x206846dE1F372A9a603e672ba97A5238cC89aeAA"
+        "0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D"
      values.getOwners.5:
-        "0xf061f1FceFa32b3bbD5d18c5A623DB64bfBc107D"
+        "0x8F97Bf67182122D2f1745216a81724143db97E43"
      values.getOwners.4:
-        "0x8F97Bf67182122D2f1745216a81724143db97E43"
+        "0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94"
      values.getOwners.3:
-        "0xD70aa9d7280E6FEe89B86f53c0B2A363478D5e94"
+        "0xD6475ce37d964d4816715FdafFEeAAf2958948bE"
      values.getOwners.2:
-        "0xD6475ce37d964d4816715FdafFEeAAf2958948bE"
+        "0xf09c25681090C5F9408c6D3CD24baa8721870dc5"
      values.getOwners.1:
-        "0xf09c25681090C5F9408c6D3CD24baa8721870dc5"
+        "0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA"
      values.getOwners.0:
-        "0xE408AE2E70a567c83C0BD36dC4a00b0a56F0A8DA"
+        "0x11B0BE5e19E38F6f6E07e11f103C4F4e8A5d0f6a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20311071 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9eBf2f33526CD571f8b2ad312492cb650870CFd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract pufEthEscrow (0xA033Ff09f2da45f0e9ae495f525363722Df42b2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PufferFinanceOpsMultisig (0xC0896ab1A8cae8c2C1d27d011eb955Cca955580d)
    +++ description: None
```

Generated with discovered.json: 0xddd7a815a741e8c748b9f47145b520ee367f47b5

# Diff at Mon, 15 Jul 2024 09:39:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 20259894
- current block number: 20311071

## Description

New targets are added to the ScrollOwner accessControl: `updateVerifier` on the MultipleVersionRollupVerifier can now be called via TimelockMid(7d) and `setBatchConfig` on the L1BatchBridgeGateway via TimelockFast(1d).

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      values.accessControl.targets.0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE"]}
      values.accessControl.targets.0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4:
+        {"setBatchConfig(address,(uint96,uint96,uint16,uint24,uint24))":["TIMELOCK_1DAY_DELAY_TOLE"]}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20259894 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1BatchBridgeGateway (0x5Bcfd99c34cf7E06fc756f6f5aE7400504852bc4)
    +++ description: None
```

Generated with discovered.json: 0xc91c535b44afb48eb36ccafc1f98ec0e73dd837f

# Diff at Mon, 08 Jul 2024 06:07:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 20231628
- current block number: 20259894

## Description

Batches are reverted [in this transaction](https://app.blocksec.com/explorer/tx/eth/0xf58cd0223418a4dd390be63d67c31ccd3b05a82d59461106227664e8fc417ac5). Unclear what justified this action.

Relevant incident page: https://status.scroll.io/incidents/44k6s4qg6kcs

## Watched changes

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      values.revertedBatches.54:
+        {"batchIndex":275173}
      values.revertedBatches.53:
+        {"batchIndex":275172}
      values.revertedBatches.52:
+        {"batchIndex":275171}
      values.revertedBatches.51:
+        {"batchIndex":275170}
      values.revertedBatches.50:
+        {"batchIndex":275169}
      values.revertedBatches.49:
+        {"batchIndex":275168}
      values.revertedBatches.48:
+        {"batchIndex":275167}
      values.revertedBatches.47:
+        {"batchIndex":275166}
      values.revertedBatches.46:
+        {"batchIndex":275165}
      values.revertedBatches.45:
+        {"batchIndex":275164}
      values.revertedBatches.44:
+        {"batchIndex":275163}
      values.revertedBatches.43:
+        {"batchIndex":275162}
      values.revertedBatches.42:
+        {"batchIndex":275161}
      values.revertedBatches.41:
+        {"batchIndex":275160}
      values.revertedBatches.40:
+        {"batchIndex":275159}
      values.revertedBatches.39:
+        {"batchIndex":275158}
      values.revertedBatches.38:
+        {"batchIndex":275157}
      values.revertedBatches.37:
+        {"batchIndex":275156}
      values.revertedBatches.36:
+        {"batchIndex":275155}
      values.revertedBatches.35:
+        {"batchIndex":275154}
      values.revertedBatches.34:
+        {"batchIndex":275153}
      values.revertedBatches.33:
+        {"batchIndex":275152}
      values.revertedBatches.32:
+        {"batchIndex":275151}
      values.revertedBatches.31:
+        {"batchIndex":275150}
      values.revertedBatches.30:
+        {"batchIndex":275149}
      values.revertedBatches.29:
+        {"batchIndex":275148}
      values.revertedBatches.28:
+        {"batchIndex":275147}
      values.revertedBatches.27:
+        {"batchIndex":275146}
      values.revertedBatches.26:
+        {"batchIndex":275145}
      values.revertedBatches.25:
+        {"batchIndex":275144}
      values.revertedBatches.24:
+        {"batchIndex":275143}
      values.revertedBatches.23:
+        {"batchIndex":275142}
      values.revertedBatches.22:
+        {"batchIndex":275141}
      values.revertedBatches.21:
+        {"batchIndex":275140}
      values.revertedBatches.20:
+        {"batchIndex":275139}
      values.revertedBatches.19:
+        {"batchIndex":275138}
      values.revertedBatches.18:
+        {"batchIndex":275137}
      values.revertedBatches.17:
+        {"batchIndex":275136}
      values.revertedBatches.16:
+        {"batchIndex":275135}
      values.revertedBatches.15:
+        {"batchIndex":275134}
      values.revertedBatches.14:
+        {"batchIndex":275133}
      values.revertedBatches.13:
+        {"batchIndex":275132}
      values.revertedBatches.12:
+        {"batchIndex":275131}
      values.revertedBatches.11:
+        {"batchIndex":275130}
      values.revertedBatches.10:
+        {"batchIndex":275129}
      values.revertedBatches.9:
+        {"batchIndex":275128}
      values.revertedBatches.8:
+        {"batchIndex":275127}
      values.revertedBatches.7:
+        {"batchIndex":275126}
      values.revertedBatches.6:
+        {"batchIndex":275125}
      values.revertedBatches.5:
+        {"batchIndex":275124}
      values.revertedBatches.4:
+        {"batchIndex":275123}
      values.revertedBatches.3:
+        {"batchIndex":275122}
      values.revertedBatches.2:
+        {"batchIndex":275121}
      values.revertedBatches.1:
+        {"batchIndex":275120}
      values.revertedBatches.0:
+        {"batchIndex":275119}
    }
```

Generated with discovered.json: 0xe79e01ccb7168b40e4ef5149d2f69fe16ddd49ca

# Diff at Thu, 04 Jul 2024 07:23:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a971675b742a033604993266a953472c91a5d327 block: 20138546
- current block number: 20231628

## Description

This upgrade is called [the Curie Upgrade](https://scroll.io/blog/compressing-the-gas-scrolls-curie-upgrade) by Scroll.
It brings a new batch version that has new compression and an accompanying new verifier and verifier-manager.
The L2 changes are listed in the blog post.

### ScrollChain

Batch version > 1 is now suported. This allows for the new batch version 2 to be posted.

### MultipleVersionRollupVerifier (manages verifiers)

In the `updateVerifier()` function, a check wether the new verifier's `_startBatchIndex` is already finalized (-->revert), is removed. 

### ZkEvmVerifierV1

This is the contract in the third slot of `latestVerifier`, added in this upgrade. It is code-identical with the previous one, but points to the new Plonk Verifier.

### New Plonk Verfier

The source code (yul+) can be found at https://circuit-release.s3.us-west-2.amazonaws.com/release-v0.11.4/evm_verifier.yul.

## Watched changes

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      upgradeability.implementation:
-        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
+        "0x4F250B05262240C787a1eE222687C6eC395C628A"
      implementations.0:
-        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
+        "0x4F250B05262240C787a1eE222687C6eC395C628A"
      values.verifier:
-        "0x1Ea29d57dAC237152d878758bAe4BeB2668998f6"
+        "0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B"
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierV2 (0x03a72B00D036C479105fF98A1953b15d9c510110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1-1 (0x63FB51C55d9605a75F8872C80De260a00fACfaA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xf94AfBD9370E25Dd6Ca557d5D67634aeFDA2416B)
    +++ description: Used to update the verifier and keep track of current and old versions.
```

## Source code changes

```diff
.../MultipleVersionRollupVerifier.sol              | 26 ++-------
 .../ScrollChain/ScrollChain.sol                    | 24 ++++----
 .../scroll/ethereum/.flat/ZkEvmVerifierV1-1.sol    | 66 ++++++++++++++++++++++
 3 files changed, 82 insertions(+), 34 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20138546 (main branch discovery), not current.

```diff
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      errors:
+        {"latestVerifier":"Too many values. Update configuration to explore fully","legacyVerifiersLength":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x355fd622fa9cc92e25f4e7c966a40b13dc467a75

# Diff at Wed, 29 May 2024 07:42:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4844a9bf46315ea8d6de75161e4361325faaa106 block: 19911646
- current block number: 19974091

## Description

The owner of MultipleVersionRollupVerifier (manages verifiers for the Scroll rollup) is changed from the Scroll Multisig to the ScrollOwner contrac. (as described on the frontend)

## Watched changes

```diff
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6) {
    +++ description: Used to update the verifier and keep track of current and old versions.
      values.owner:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "0x798576400F7D662961BA15C6b3F3d813447a26a6"
    }
```

Generated with discovered.json: 0x68a28fba5e0d68fd23b6e1a7df4f76e418d42ff5

# Diff at Mon, 20 May 2024 14:11:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@468df776367f9a83cbc1e0ea8de4f8ff7cb613dd block: 19760239
- current block number: 19911646

## Description

Added the Lido wstETH escrow together with its admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19760239 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract wstETHescrowLido (0x6625C6332c9F91F2D27c304E729B86db87A3f504)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETHescrowLidoProxyAdmin (0xCC2C53556Bc75217cf698721b29071d6f12628A9)
    +++ description: None
```

Generated with discovered.json: 0xba389f739fa3b1f9c960dd3e199d54a43f2cbc6e

# Diff at Mon, 29 Apr 2024 10:01:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@37e0de831cd2543b1a40aefc42a1ba0947644d82 block: 19532167
- current block number: 19760239

## Description

Added blob support.

### ScrollChain

Use of errors instead of requires. `commitBatch` now supports version `1`, which is blobs. Added `finalizeBatchWithProof4844` function.

### MultipleVersionRollupVerifier

It has been updated to support multiple versions. Before, it just contained a single `latestVerifier`, now it's a mapping from versions to latest verifiers.

## Watched changes

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    +++ description: None
      values.accessControl.targets.0x1Ea29d57dAC237152d878758bAe4BeB2668998f6:
+        {"updateVerifier(uint256,uint64,address)":["TIMELOCK_7DAY_DELAY_ROLE","SECURITY_COUNCIL_NO_DELAY_ROLE"]}
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    +++ description: None
      upgradeability.implementation:
-        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
+        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
      implementations.0:
-        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
+        "0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8"
      values.verifier:
-        "0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0"
+        "0x1Ea29d57dAC237152d878758bAe4BeB2668998f6"
    }
```

```diff
-   Status: DELETED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0x1Ea29d57dAC237152d878758bAe4BeB2668998f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifierV1 (0x2293cd12e8564e8219d314b075867c2f66ac6941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247)
    +++ description: None
```

## Source code changes

```diff
.../MultipleVersionRollupVerifier/meta.txt         |   2 +-
 .../src/L1/rollup/IScrollChain.sol                 |  51 +-
 .../L1/rollup/MultipleVersionRollupVerifier.sol    | 116 +++-
 .../src/libraries/verifier/IRollupVerifier.sol     |  16 +-
 .../src/libraries/verifier/IZkEvmVerifier.sol      |   2 +-
 .../scroll/ethereum/.code/PlonkVerifierV1/meta.txt |   2 +
 .../ScrollChain/implementation/meta.txt            |   2 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |   2 +-
 .../implementation/src/L1/rollup/IScrollChain.sol  |  54 +-
 .../implementation/src/L1/rollup/ScrollChain.sol   | 716 ++++++++++++++++-----
 .../src/libraries/codec/BatchHeaderV0Codec.sol     |  54 +-
 .../src/libraries/codec/BatchHeaderV1Codec.sol     | 230 +++++++
 .../src/libraries/codec/ChunkCodecV0.sol}          |  27 +-
 .../src/libraries/codec/ChunkCodecV1.sol           |  86 +++
 .../src/libraries/verifier/IRollupVerifier.sol     |  16 +-
 .../scroll/ethereum/.code/ZkEvmVerifierV1/meta.txt |   2 +
 .../src/libraries/verifier/IZkEvmVerifier.sol      |  10 +
 .../src/libraries/verifier/ZkEvmVerifierV1.sol     |  65 ++
 18 files changed, 1202 insertions(+), 251 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532167 (main branch discovery), not current.

```diff
    contract PlonkVerifier (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    +++ description: None
      name:
-        "PlonkVerifier"
+        "PlonkVerifierV0"
    }
```

```diff
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    +++ description: None
      name:
-        "ZkEvmVerifierV1"
+        "ZkEvmVerifierV0"
    }
```

```diff
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    +++ description: None
      values.getVerifier:
+        ["0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D","0x585DfaD7bF4099E011D185E266907A8ab60DAD2D"]
      errors:
+        {"getVerifier":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xab2564ccd95153417c52dae00a8e78fb02f47de6

# Diff at Thu, 28 Mar 2024 11:00:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19375229
- current block number: 19532167

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19375229 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0xeedf768927c66f9e3e9594005bea7982654706a9

# Diff at Wed, 06 Mar 2024 09:27:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d60150e480982ada7064a8773c7df37943e92432 block: 19290165
- current block number: 19375229

## Description

The L2GasPriceOracle is now not used anymore and it has been incorporated into the L1MessageQueue contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19290165 (main branch discovery), not current.

```diff
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      name:
-        "L2GasPriceOracle"
+        "OLD_L2GasPriceOracle"
    }
```

Generated with discovered.json: 0x51e6f3f4e484657baa2d2b4469fd0867d1cd86ca

# Diff at Fri, 23 Feb 2024 12:04:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@13bd721852038eaabd63b0fc897e802c663577ec block: 18832875
- current block number: 19290165

## Description

### L1CustomERC20Gateway

Use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC1155Gateway

Again, use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC721Gateway

Same changes.

### L1ETHGateway

Same changes.

### L1MessageQueue

The enforced tx gateway is now immutable and set. An L2 gas price oracle is implemented and a permissioned actor can relay the L2 base fee.

### L1ScrollMessenger

Same changes as first ones.

### L1StandardERC20Gateway

Same changes.

### L1USDCGateway

Same changes.

### L1WETHGateway

Same changes.

### ScrollChain

Same changes. In addition, the verifier is now immutable.

### EnforcedTxGateway

Currently paused, so no risk has changed.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
      upgradeability.implementation:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      implementations.0:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      values.enforcedTxGateway:
-        "0x0000000000000000000000000000000000000000"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.l2BaseFee:
+        483000000
      values.whitelistChecker:
+        "0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37"
      derivedName:
-        "L1MessageQueue"
+        "L1MessageQueueWithGasPriceOracle"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
      upgradeability.implementation:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
      implementations.0:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
      upgradeability.implementation:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
      implementations.0:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
      upgradeability.implementation:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
      implementations.0:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
      upgradeability.implementation:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
      implementations.0:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
      upgradeability.implementation:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
      implementations.0:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
      upgradeability.implementation:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
      implementations.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
      upgradeability.implementation:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
      implementations.0:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
      upgradeability.implementation:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
      implementations.0:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
      upgradeability.implementation:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
      implementations.0:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
    }
```

## Source code changes

```diff
.../L1CustomERC20Gateway/implementation/meta.txt   |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1CustomERC20Gateway.sol       |  21 +++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC1155Gateway/implementation/meta.txt       |   2 +-
 .../src/L1/gateways/L1ERC1155Gateway.sol           |   8 +-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC721Gateway/implementation/meta.txt        |   2 +-
 .../src/L1/gateways/L1ERC721Gateway.sol            |  11 ++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ETHGateway/implementation/meta.txt           |   2 +-
 .../src/L1/gateways/L1ETHGateway.sol               |  22 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1MessageQueue/implementation/meta.txt         |   4 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../rollup/IL1MessageQueueWithGasPriceOracle.sol   |  38 +++++++
 .../src/L1/rollup/IL2GasPriceOracle.sol            |   6 ++
 .../src/L1/rollup/L1MessageQueue.sol               |  95 ++++++++++--------
 .../L1/rollup/L1MessageQueueWithGasPriceOracle.sol | 110 +++++++++++++++++++++
 .../src/libraries/common/IWhitelist.sol            |   9 ++
 .../L1ScrollMessenger/implementation/meta.txt      |   2 +-
 .../implementation/src/L1/L1ScrollMessenger.sol    |  64 +++++++-----
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/ScrollMessengerBase.sol          |  22 ++++-
 .../L1StandardERC20Gateway/implementation/meta.txt |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1StandardERC20Gateway.sol     |  59 +++++++----
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1USDCGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/usdc/L1USDCGateway.sol         |  31 ++++--
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1WETHGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1WETHGateway.sol              |  27 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../ScrollChain/implementation/meta.txt            |   2 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../implementation/src/L1/rollup/ScrollChain.sol   |  64 +++++++-----
 56 files changed, 1078 insertions(+), 317 deletions(-)
```

Generated with discovered.json: 0xc09ec1a3a28544d8f5f11512b0fbd211ceecb833

# Diff at Thu, 21 Dec 2023 07:52:36 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@10c7379d5f3774c9ebd335617097ca68ed267379

## Description

One owner is removed from ExecutorMultisig and another is added.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Mon, 18 Dec 2023 11:58:46 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@636723aa928b9ac461db31dd0b5005a916961be5

## Description

One owner is removed from EmergencyMultisig and another is added.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Wed, 08 Nov 2023 15:41:27 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a406ca5120d2111446400f9fd391e501cbd31e52

## Description

One ExecutorMultisig owner has changed.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Tue, 07 Nov 2023 07:33:37 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@6187ae3e2b0d528e37e7073fbd31c8970daac97d

## Description

New owner added to FeeVaultMultisig.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners[3]:
+        "0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.getOwners.2:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.1:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.0:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Fri, 03 Nov 2023 07:55:41 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@ea6f863a22bc8316d333ca3f270fcd47113758cb

## Description

Two ScrollMultisig owners are changed.

## Watched changes

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.4:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
    }
```

# Diff at Tue, 31 Oct 2023 07:30:26 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@553c8048735381be48fc993e73c034e7ed45f44c

## Description

FeeVaultMultisig owner change.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners.1:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
    }
```

# Diff at Mon, 30 Oct 2023 09:59:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@571047cc8f858ed595e25bc9512b54414c949c8e

## Description

Change of owners of Emergency MultiSig and Scroll MultiSig.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xE2e6345baAD18f779167443Dc4886495507b3249"
    }
```

# Diff at Thu, 19 Oct 2023 08:22:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0beeab609744b4e4247dca817daaa8caed24ab12

## Description

Added Scroll. Their AccessControl extension needed a custom handler since it also specifies which function a role can call. Fallback contracts are not being displayed on the website because they're just used to recover funds in case of a mistake.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    }
```

```diff
+   Status: CREATED
    contract TimelockSlow (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    }
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifier (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    }
```

```diff
+   Status: CREATED
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    }
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    }
```

```diff
+   Status: CREATED
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    }
```

```diff
+   Status: CREATED
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract TimelockMid (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    }
```

```diff
+   Status: CREATED
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    }
```

```diff
+   Status: CREATED
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```

# Diff at Thu, 12 Oct 2023 12:22:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```
