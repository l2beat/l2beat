Generated with discovered.json: 0xc777c102e787a4cebfaf376e2f50179e178c4fec

# Diff at Thu, 03 Sep 2026 10:48:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f7b07492346f74d16743dd75dd367045293d930 block: 1762959021
- current timestamp: 1762959021

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762959021 (main branch discovery), not current.

```diff
    external contract AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8","role":"admin"}]
    }
```

```diff
    external contract (eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","role":"admin"},{"permission":"upgrade","from":"eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin"},{"permission":"upgrade","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","role":"admin"},{"permission":"upgrade","from":"eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","role":"admin"}]
    }
```

```diff
    external contract (eth:0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"Permissioned to post new state roots and global exit roots accompanied by ZK proofs.","role":".trustedAggregatorAC"}]
    }
```

```diff
    external contract (eth:0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"add new routes from proof selector to verifier / pessimisticVkey for pessimistic proofs.","role":".addPpRouteAC","via":[{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"interact","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"add or update default aggchain verification keys (aggchainVkey) for any given selectors.","role":".aggchainDefaultVKeyAC"},{"permission":"interact","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"change the aggchainSigners and threshold (a multisig used for permissioned state transitions).","role":".alMultisigAC"},{"permission":"interact","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"freeze routes from proof selector to verifier / pessimisticVkey for pessimistic proofs.","role":".freezePpRouteAC"},{"permission":"interact","from":"eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","description":"upgrade the implementation of wrapped tokens deployed by the bridge.","role":".proxiedTokensManager","via":[{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"deploy new projects that use predefined rollup types (implementations) and connect them or other Agglayer chains to the PolygonRollupManager.","role":".createRollupAC"},{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types, migrate to pessimistic proofs and rollback batches, connect existing rollups to the PolygonRollupManager.","role":".defaultAdminAC","via":[{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage parameters like fees for all connected projects, set the trusted aggregator, stop the emergency state, update projects and obsolete rollup types.","role":".tweakParametersAC"},{"permission":"interact","from":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)","via":[{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"interact","from":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)"},{"permission":"upgrade","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","role":"admin","via":[{"address":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"upgrade","from":"eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","role":"admin","via":[{"address":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"upgrade","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","role":"admin","via":[{"address":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]},{"permission":"upgrade","from":"eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","role":"admin","via":[{"address":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A"},{"address":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"condition":"(no delay if in emergency state)"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"role":".timelockAdminAC","condition":"(no delay if in emergency state)"}]
    }
```

```diff
    external contract (eth:0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"activate the emergency state in the PolygonRollupManager and in the shared bridge immediately, effectively pausing all projects connected to them and making system contracts instantly upgradable.","role":".emergencyCouncilAdminAC"}]
    }
```

```diff
    external contract (eth:0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"deploy new projects that use predefined rollup types (implementations) and connect them or other Agglayer chains to the PolygonRollupManager.","role":".createRollupAC"}]
    }
```

```diff
    external contract (eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","role":".owner"},{"permission":"act","from":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"role":".timelockAdminAC","condition":"(no delay if in emergency state)"},{"permission":"interact","from":"eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3","description":"add new routes from proof selector to verifier / pessimisticVkey for pessimistic proofs.","role":".addPpRouteAC"},{"permission":"interact","from":"eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","description":"upgrade the implementation of wrapped tokens deployed by the bridge.","role":".proxiedTokensManager"},{"permission":"interact","from":"eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","description":"manage all access control roles, add new rollup types (which are implementation contracts that can then be upgraded to by connected projects), update any connected projects to new rollup types, migrate to pessimistic proofs and rollback batches, connect existing rollups to the PolygonRollupManager.","role":".defaultAdminAC"},{"permission":"interact","from":"eth:0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","delay":259200,"description":"propose, cancel and execute transactions in the timelock, manage all access control roles and change the minimum delay.","role":".timelockAdminAC","condition":"(no delay if in emergency state)"}]
    }
```

Generated with discovered.json: 0x2ed435f9bfc5c6c3a8c25c6798e4066ea2904321

# Diff at Tue, 05 May 2026 10:22:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1762959021
- current timestamp: 1762959021

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762959021 (main branch discovery), not current.

```diff
    contract AggchainECDSAMultisig (eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8) {
    +++ description: System contract defining the Haust Network Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      deployerAddress:
+        "eth:0xD9478f759a13Bfa1d9dAB3cDF5ff0C099d5EfCFC"
    }
```

Generated with discovered.json: 0xee136043c0ad93467ed831b24c9b3f2ce40d2a31

# Diff at Tue, 09 Dec 2025 11:33:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed25b2aa28d6ab9faa5f06bc943948919be9627d block: 1762959021
- current timestamp: 1762959021

## Description

config: add aggchain_type description and severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762959021 (main branch discovery), not current.

```diff
    contract AggchainECDSAMultisig (eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8) {
    +++ description: System contract defining the Haust Network Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte"}
    }
```

Generated with discovered.json: 0x0556b0b9d8cb590f2e6df287705e2952da9e817c

# Diff at Wed, 12 Nov 2025 14:51:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1762959021

## Description

initital disco of a no-proof others agglayer chain.

## Initial discovery

```diff
+   Status: CREATED
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AggchainECDSAMultisig (eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8)
    +++ description: System contract defining the Haust Network Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
```
