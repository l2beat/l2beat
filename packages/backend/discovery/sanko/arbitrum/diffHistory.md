Generated with discovered.json: 0x8e2926a79308fc7816dd77e1498aadb82ef7eced

# Diff at Fri, 23 Aug 2024 09:57:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc77904e8ef816c1aa450a3fcf65347323acdae8e

# Diff at Thu, 22 Aug 2024 11:49:26 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 225981699
- current block number: 245517194

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBM8WH8fzFQs+IXcFMBei3c0fIp6lNYHAw/kaFJEygDiksyqeAE8rWf9HA5OoHsDVwOYrnfZkCSfRjlLEtBaTLPJaU4OfE2N0XzEuRdxmwEVPRO8Ju8IlyFtNyIBAKq3DwF4EqTAXqxCxd05xmmFGkPNkmF6206kv7VGp0cXmEinXf5so12V3pnb+pePP3e3pRhRfu19/rZzXtMJNE55U37hH3VFCC+y13NNoeNqQztRRsroRtQQ9czMa042Zwd0BRluNTa40csEMom/D0Y6o/4cMf7At3G6VYIGy7z/0twDSmhRVXe2xpVJqbxEsTkdyxRPFelDCvZeylRxtN9NHo+BXbvoBUToQDeizLpx2f1hdlggZUI4y+QIN/VJ6h0x3A=="]
    }
```

Generated with discovered.json: 0xeec169759f57f04759521544c5b81c1001656759

# Diff at Wed, 21 Aug 2024 10:07:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","via":[]},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[]},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[]},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[]},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[]},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[]},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[]},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[]}]
    }
```

Generated with discovered.json: 0x17ac8a625d8cf7d8442095aae327f6eefb847783

# Diff at Fri, 09 Aug 2024 12:03:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      assignedPermissions.upgrade.7:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      assignedPermissions.upgrade.5:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      assignedPermissions.upgrade.4:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      assignedPermissions.upgrade.3:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      assignedPermissions.upgrade.2:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      assignedPermissions.upgrade.1:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      assignedPermissions.upgrade.0:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
    }
```

Generated with discovered.json: 0x1c5e2ffa8aba3e9f8f984b010b0cd98e616488b0

# Diff at Fri, 09 Aug 2024 10:13:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

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

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
      assignedPermissions.upgrade:
+        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]
      assignedPermissions.upgrade:
+        ["0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0x2f285781B8d58678a3483de52D618198E4d27532","0xb4951c0C41CFceB0D195A95FE66280457A80a990","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"]
    }
```

Generated with discovered.json: 0x4e6ead28c89bb9e104634cba78309db5c44c49bb

# Diff at Tue, 30 Jul 2024 11:17:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x7497b2e8794633fb72d194a2e0f416633fb08a18

# Diff at Tue, 11 Jun 2024 13:11:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216537364
- current block number: 220737963

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216537364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xb8105dfaa96d42cb3168bb8035f98564cbe6a158

# Diff at Thu, 30 May 2024 08:36:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 215641876
- current block number: 216537364

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xe8216687Ef40C65F64D6dcd335b0aaab4A1Bc400"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x4d6ff733355fea27e32d71c819ef65601a504b1b

# Diff at Mon, 27 May 2024 17:59:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 215641876

## Description

Initial discovery: Orbit stack L3 with AnyTrust 1/1 DAC and ArbOS v10.2. Native L3 token is DMT.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```
