Generated with discovered.json: 0xbe455b561c779a6f7bace5d8b844602e85eb51da

# Diff at Wed, 02 Oct 2024 14:18:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871594
- current block number: 20878362

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871594 (main branch discovery), not current.

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:18:47.000Z",["0x5ac4182A1dd41AeEf465E40B82fd326BF66AB82C"]],["2024-02-13T11:00:59.000Z",["0x0FeB850B183C57534b56b7d56520133C8f9BDB65"]]]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:19:23.000Z",["0xe262Ea2782e2e8dbFe354048c3B5d6DE9603EfEF"]],["2023-09-20T08:30:35.000Z",["0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F"]],["2023-11-09T09:22:59.000Z",["0xb1585916487AcEdD99952086f2950763D253b923"]],["2024-02-13T11:00:59.000Z",["0x3b82Da772c825283d85d5d6717A77C6Ff582053b"]]]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-24T10:19:11.000Z",["0xbc1ea504fC54D078514eFCCA1F6860B5219B6BC3"]],["2024-02-13T11:00:59.000Z",["0x2E38cD55163137483E30580Cb468C2dFf1d85077"]]]
    }
```

Generated with discovered.json: 0xa05eff9760fe0c1b81a11c3826d3a0970b9e9ebf

# Diff at Tue, 01 Oct 2024 15:39:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20792084
- current block number: 20871594

## Description

New RollupType with FflonkVerifier_11 and a PolygonZkEvm code-identical consensus implementation is added. PolygonZkEvm is upgraded to the new type. See last update for context.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.3:
-        3
+        5
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.2:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        "0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"
      values.rollupTypeCount:
-        4
+        5
+++ description: struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock
      values.rollupTypes.4:
+        ["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0xc521580cd8586Cc688A7430F9DcE0f6A803F2883"]
    }
```

Generated with discovered.json: 0x6761afe95cc65b2d57facf739411497e0c79d266

# Diff at Fri, 20 Sep 2024 13:25:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 20756803
- current block number: 20792084

## Description

Queue tx for adding a new rollupType. This is one of two steps to upgrade existing rollups, the second being to call `updateRollup(rollupTypeId,...)` on the RollupManager. The new consensusImplementation is identical to the one used by Polygon zkEVM, the new verifier has a two-constants diff. This rollupType is theoretically compatible with both current type 3 and current type 4 rollups. 
See [this changelog](https://github.com/0xPolygonHermez/zkevm-contracts/releases/tag/v7.0.0-fork.10-fork.11) for an overview of changes.


## Watched changes

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.14:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0xc521580cd8586Cc688A7430F9DcE0f6A803F2883","forkID":11,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: eggfruit N=25 , genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0xba373ac533983b9f92ed90035a92df2f631da3df

# Diff at Sun, 15 Sep 2024 15:07:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20726217
- current block number: 20756803

## Description

haust.network is verifying batches. (No launch announcement from them yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.10.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x3c4c51c3c32febb0ab92e52ac6d22d7110040697

# Diff at Wed, 11 Sep 2024 08:36:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20661845
- current block number: 20726217

## Description

New Validium deployed: https://haust.network/

Not posting batches yet.

Current rollupIDs:
    1: pol zkEVM 1101 (type3) 🚀 ✔️
	2: astar 3776 (type4) 🚀 ✔️
	3: OkX X Layer 196 (type4) 🚀 ✔️
	4: OEV network chainid 4913 (type4) X (pivoted to orbit)
	5: gptprotocol.org 1511670449 (type4) 🚀 ✔️
	6: witnesschain 1702448187 (type4) 🚀 ✔️
	7: prism (by prism bridge?) 994873017 (type4) 🚀
	8: pay network (wirex) 31415 (type4) 🚀 ✔️
	9: silicon-zk 511252203 (type4) 🚀
   10: silicon-zk 2355 (type4) 🚀
   11: haust.network 999 (type4)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.10:
+        [false]
      values.rollupCount:
-        10
+        11
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.10:
+        ["0xB234F18738d9531CAD6ae6d9A587d09fe200272C",999,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0x152fbc09283611d598b5ed010ea0fabefbef82d7

# Diff at Mon, 02 Sep 2024 08:59:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fcb30f6c613b5454aa9ecdec05a118442e9dc7b block: 20585049
- current block number: 20661845

## Description

Scheduled tx is executed giving a yet unknown Multisig the CREATE_ROLLUP role. This role can add new rollups that must use an existing rollup type. So far the role was held only by the RollupManagerAdminMultisig. As this permission does not affect existing chains it is not added to the shared template.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.CREATE_ROLLUP.members.1:
+        "0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"
    }
```

```diff
+   Status: CREATED
    contract CreateRollupMultisig (0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB)
    +++ description: None
```

## Source code changes

```diff
.../.flat/CreateRollupMultisig/GnosisSafe.sol      | 952 +++++++++++++++++++++
 .../CreateRollupMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xd2495f646a0033a5e87873cdc7867242321923e3

# Diff at Fri, 30 Aug 2024 07:59:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20585049
- current block number: 20585049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585049 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x203942c049270f82399f06fe7b509040c8ff746d

# Diff at Fri, 23 Aug 2024 09:55:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20585049
- current block number: 20585049

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585049 (main branch discovery), not current.

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x57b2cd522b7dcd76f03ba60f609d7427e0fda2c5

# Diff at Thu, 22 Aug 2024 15:30:17 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20577574
- current block number: 20585049

## Description

Config changes related to trust permissions. A project (Silicon zkEVM, https://x.com/0xSilicon) started verifying batches, no announcement yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.9.0:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577574 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0x71fee6329a04ca0a77fd7c6f70ad59ad5e7df866

# Diff at Wed, 21 Aug 2024 14:24:32 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20532454
- current block number: 20577574

## Description

New rollup was added (Silicon zkEVM). Not verifying batches yet.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.9:
+        [false]
      values.rollupCount:
-        9
+        10
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.9:
+        ["0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB",2355,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532454 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0x64b8ffdf55ed2228b4d89471df908c120c09de3a

# Diff at Wed, 21 Aug 2024 10:05:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532454
- current block number: 20532454

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532454 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","via":[]},{"permission":"upgrade","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","via":[]},{"permission":"upgrade","target":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","via":[]}]
    }
```

```diff
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","via":[]}]
    }
```

Generated with discovered.json: 0xcb4ecd76bd24c85fce589f137c6b5371214bffa7

# Diff at Thu, 15 Aug 2024 07:11:51 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20512764
- current block number: 20532454

## Description

The batches for an unknown project are now being verified.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.8.0:
-        false
+        true
    }
```

Generated with discovered.json: 0xe954f2fce6af87cb2a645e83eb913f58270872ee

# Diff at Mon, 12 Aug 2024 13:15:54 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20324826
- current block number: 20512764

## Description

New rollup is added, but not active yet (not verifying batches).

Also a new scheduled transaction that will give the role of CREATE_ROLLUP to a new address.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.8:
+        [false]
      values.rollupCount:
-        8
+        9
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.8:
+        ["0xA87df42CD53E998b3A610B8bCe3719871b0bb940",511252203,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactionsDecoded.13:
+        {"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"grantRole","inputs":{"role":"0xa0fab074aba36a6fa69f1a83ee86e5abfb8433966eb57efb13dc2fc2f24ddd08","account":"0xC74eFc7fdb3BeC9c6930E91FFDF761b160dF79dB"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"}
    }
```

Generated with discovered.json: 0x09a28c6289220b6632a4be28b4f979f629f7ee52

# Diff at Fri, 09 Aug 2024 12:02:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
      assignedPermissions.upgrade.1:
-        "0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"
+        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
      assignedPermissions.upgrade.0:
-        "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"
+        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
    }
```

Generated with discovered.json: 0xd113d4bcf351ac5e28a0810501f10748689bd5ff

# Diff at Fri, 09 Aug 2024 10:12:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb"]
      assignedPermissions.upgrade:
+        ["0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"]
    }
```

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x4c1665d6651ecEfa59B9B3041951608468b18891","0xA0B02B28920812324f1cC3255bd8840867d3f227","0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x4c1665d6651ecEfa59B9B3041951608468b18891","0xA0B02B28920812324f1cC3255bd8840867d3f227","0xEad77b01ea770839F7f576Cd1516Ff6A298d9dB2"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 8 (75%)"
      values.getOwners:
-        ["0xFe45baf0F18c207152A807c1b05926583CFE2e4b","0xaF46a0ddf80DFFB49C87656625E65A37499B261D","0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf","0x4c1665d6651ecEfa59B9B3041951608468b18891","0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622","0x49c15936864690bCd6af0ecaca8E874adFF30E86","0x9F7dfAb2222A473284205cdDF08a677726d786A0","0x21887c89368bf918346c62460e0c339113801C28"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xFe45baf0F18c207152A807c1b05926583CFE2e4b","0xaF46a0ddf80DFFB49C87656625E65A37499B261D","0xBDc235cC9d6Baa641c5ae306bc83962475A5FEFf","0x4c1665d6651ecEfa59B9B3041951608468b18891","0x3ab9f4b964eE665F7CDf1d65f1cEEc6196B0D622","0x49c15936864690bCd6af0ecaca8E874adFF30E86","0x9F7dfAb2222A473284205cdDF08a677726d786A0","0x21887c89368bf918346c62460e0c339113801C28"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 8 (75%)"
    }
```

Generated with discovered.json: 0x25b3c5723fd7af1867dd9877734aee9f8b274646

# Diff at Tue, 30 Jul 2024 11:14:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20324826
- current block number: 20324826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      fieldMeta:
+        {"rollupsData":{"severity":"MEDIUM","description":"Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]"},"rollupTypes":{"description":"struct consensusImplementation, verifier, forkID, rollupCompatibilityID, bool obsolete, genesisBlock"},"isVerifyingBatches":{"description":"Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1."}}
    }
```

Generated with discovered.json: 0x45e85d1936f082cff5ce1c0e9eecb83a443e9505

# Diff at Tue, 23 Jul 2024 14:45:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e5367f5480f561f930143fbbdedbb92263f4a41f block: 20324826
- current block number: 20324826

## Description

Decode scheduled transactions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20324826 (main branch discovery), not current.

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      values.scheduledTransactions:
-        [{"id":"0xb50bcda49f13b2aa0ddc72fa32eec2b6ea4cd8af5a9823762150c7d94a210476","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000301442aa888701c8b86727d42f3c55fb0dd9ef7f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001176322e302e302d5243312d666f726b2e3500000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x99979392a952eef62666ac91808b1c6b3b35a34092712ab965dbb85ac0b0a702","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2000000000000000000000000b1585916487acedd99952086f2950763d253b923000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000647240f9af0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001076332e302e302d696e636162657272790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec4000000000000000000000000580bda1e7a0cfae92fa7f6c20a3794f169ce3cfb0000000000000000000000002e38cd55163137483e30580cb468c2dff1d85077","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x99a88ec40000000000000000000000002a3dd3eb832af982ec71669e178424b10dca2ede0000000000000000000000000feb850b183c57534b56b7d56520133c8f9bdb65","delay":864000},{"id":"0xff337aa79b453bd0ae64d7668a9ac83cdf4666bde0977afdf04462c4e14978c8","target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":0,"data":"0x9623609d0000000000000000000000005132a183e9f3cb7c848b0aac5ae0c4f0491b7ab20000000000000000000000003b82da772c825283d85d5d6717a77c6ff582053b000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001440645af090000000000000000000000006329fe417621925c81c16f9f9a18c203c21af7ab00000000000000000000000000000000000000000000000000000000000697800000000000000000000000000000000000000000000000000000000000069780000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21000000000000000000000000ef1462451c30ea7ad8555386226059fe837ca4ef00000000000000000000000037c58dfa7bf0a165c5aaeddf3e2edb475ac6dcb6000000000000000000000000519e42c24163192dca44cd3fbdcebf6be91309870000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd80000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000044d00000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0x84be1445c72b5d8056fe3f1a482e08a6ef1a74fdc78f85dbb16f1d5980f4f16a","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000","delay":864000},{"id":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005e547970653a207a6b45564d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000","delay":864000},{"id":"0xb492d5648af7003fa67cd99f58c95eaec5a32e0768bb99268bee18b19e8cf869","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c2000000000000000000000000519e42c24163192dca44cd3fbdcebf6be9130987000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd43e98454a4d7bef73956a5239de00d4858589ccf39f1d26a8c5bd9d1e5f671b","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000004aabba26ea9e7a7fbd052d17a167e6ae3f8ec7be00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000061547970653a2056616c696469756d2c2056657273696f6e3a20696e636162657272792c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d41595500000000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xd67d30e173069baf06cd69ce4df5951d855ab47e107cbaf1ac07f0fa42fb6af9","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xc4c928c20000000000000000000000001e163594e13030244dcaf4cdfc2cd0ba3206da800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000041c8b937000000000000000000000000000000000000000000000000000000000","delay":864000},{"id":"0xdf877691807571a83db47daab96ce9c103ea6459d7a56b57f040f8039186cd31","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb0000000000000000000000002650a9a4fc64f63f573ef0f405064ef54bc46f710000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060547970653a207a6b45564d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955","delay":0},{"id":"0xdd9feb4dbad03c98d76f1bc8d746e99e1ee05ecac1b4233e1388d6c6532e02f6","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0x2f2ff15d66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac000000000000000000000000242dae44f5d8fb54b198d03a94da45b5a4413e21","delay":0},{"id":"0xdecad137d29f44776cbe1de5721dd879cbc65f189fa8f4f93451c6621fa31363","target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":0,"data":"0xf34eb8eb00000000000000000000000010d296e8add0535be71639e5d1d1c30ae1c6bd4c0000000000000000000000000775e11309d75aa6b0967917fb0213c5673edf8100000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000063547970653a2056616c696469756d2c2056657273696f6e3a20656c64656c6265727279322c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d4159550000000000000000000000000000000000000000000000000000000000","delay":0}]
      values.scheduledTransactionsDecoded:
+        [{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x301442aA888701c8B86727d42F3C55Fb0dd9eF7F","data":{"_versionString":"v2.0.0-RC1-fork.5"}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0xb1585916487AcEdD99952086f2950763D253b923","data":{"_versionString":"v3.0.0-incaberry"}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb","implementation":"0x2E38cD55163137483E30580Cb468C2dFf1d85077"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgrade","inputs":{"proxy":"0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe","implementation":"0x0FeB850B183C57534b56b7d56520133C8f9BDB65"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A","value":"0","function":"upgradeAndCall","inputs":{"proxy":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","implementation":"0x3b82Da772c825283d85d5d6717A77C6Ff582053b","data":{"trustedAggregator":"0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","_pendingStateTimeout":432000,"_trustedAggregatorTimeout":432000,"admin":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21","timelock":"0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","emergencyCouncil":"0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6","polygonZkEVM":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","zkEVMVerifier":"0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8","zkEVMForkID":7,"zkEVMChainID":1101}},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"0xf34eb8eb","inputs":{"calldata":"0000000000000000000000009cf80f7eb1c76ec5ae7a88b417e373449b73ac300000000000000000000000001c3a3da552b8662cd69538356b1e7c2e9cc1ebd800000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000e3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f27200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000005d547970653a2056616c696469756d2c2056657273696f6e3a206574726f672c2067656e657369733a202f697066732f516d55586e526f5062556d5a75455a43477969486a45736f4e6346567533684c74537668706e664253326d415955000000"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"updateRollup","inputs":{"rollupContract":"0x519E42c24163192Dca44CD3fBDCEBF6be9130987","newRollupTypeID":2,"upgradeData":"0x"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","verifier":"0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be","forkID":8,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: incaberry, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x8bae5e2a8aaf4501e263b917591e7fcf9b1d28c85962a8847a845aff916b50ad","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"updateRollup","inputs":{"rollupContract":"0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","newRollupTypeID":3,"upgradeData":"0x1c8b9370"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"864000"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: zkEVM, Version: eldelberry2, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"grantRole","inputs":{"role":"0x66156603fe29d13f97c6f3e3dff4ef71919f9aa61c555be0182d954e94221aac","account":"0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"},{"target":"0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2","value":"0","function":"addNewRollupType","inputs":{"consensusImplementation":"0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","verifier":"0x0775e11309d75aA6b0967917fB0213C5673eDf81","forkID":9,"rollupCompatibilityID":0,"genesis":"0xe3a7d8bae497945ba8ddc51c69564f60ad4c1a990b9c7bdbd27f7929bfa8f272","description":"Type: Validium, Version: eldelberry2, genesis: /ipfs/QmUXnRoPbUmZuEZCGyiHjEsoNcFVu3hLtSvhpnfBS2mAYU"},"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","delay":"0"}]
    }
```

Generated with discovered.json: 0x1eb369afff0ddd1308836d5a882cdace0d276e29

# Diff at Fri, 12 Jul 2024 10:13:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20259919
- current block number: 20289749

## Description

Pay network (Wirex) is verifying batches. The review is in the pipeline ;)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.7.0:
-        false
+        true
    }
```

Generated with discovered.json: 0xf22e5a01a8c218f2ca43be201d375ff6c484b857

# Diff at Mon, 08 Jul 2024 06:11:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 20239328
- current block number: 20259919

## Description

The rollup contract associated with a project called `prism` (networkName string) is producing and verifying batches. Info on this project is hard to find.

## Watched changes 

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.6.0:
-        false
+        true
    }
```

Generated with discovered.json: 0x6c7284e62751150f3d598db66cc024b11d5b68b7

# Diff at Fri, 05 Jul 2024 09:12:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@38ab6c6f42360c40ef4d13f9e02761a9d45810a2 block: 20189645
- current block number: 20239328

## Description

`createNewRollup()` is called by the RollupManagerAdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [Pay Chain by Wirex](https://wirexapp.com/blog/post/introducing-wirex-pay-wirexs-zk-powered-app-chain-on-polygon-0783). (not launched / not producing blocks yet)

### Current state of projects on Polygon CDK

rolluptype: 3 = rollup, 4 = validium

🚀 = live

rollupIDs:
-   1: pol zkEVM 1101 (type3) 🚀
-	2: astar 3776 (type4) 🚀
-	3: OkX X Chain 196 (type4) 🚀
-	4: OEV network chainid 4913 (type4)
-	5: gptprotocol.org 1511670449 (type4) 🚀
-	6: witnesschain 1702448187 (type4) 🚀
-	7: prism (by prism bridge?) 994873017 (type4)
-	8: pay network (wirex) 31415 (type4)


## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches.7:
+        [false]
      values.rollupCount:
-        7
+        8
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.7:
+        ["0x78253E2E6120164bd826668A4C96Db20f78A94c9",31415,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20189645 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Checks if lastVerifiedBatch for a rollupID is greater than one. Works like a trigger for projects becoming active after deployment. Mind that index here is rollupID-1.
      values.isVerifyingBatches:
+        [[true],[true],[true],[false],[true],[true],[false]]
      usedTypes:
+        [{"typeCaster":"GreaterThan","arg":{"value":1}}]
    }
```

Generated with discovered.json: 0xe187c281eb0dc50a8c9d425f0f0d54dfd05cd099

# Diff at Fri, 28 Jun 2024 10:40:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20110313
- current block number: 20189645

## Description

New zk rollup is launching, same verifier as polygon zk and astar zk. Not public yet, waiting on more info.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        6
+        7
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.6:
+        ["0x92726F7dE49300DBdb60930066bc1d0803c0740B",994873017,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0x9a73a2c326dacbeb2ddcf0eab4fa287e6a66cc55

# Diff at Mon, 17 Jun 2024 08:28:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 19967357
- current block number: 20110313

## Description

`createNewRollup()` is called by the RollupManagerAdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [Witnesschain](https://www.witnesschain.com/). (not launched / not producing blocks yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        5
+        6
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.5:
+        ["0x42Ac57F24EC4C3AAC843f6DBAcd9282DAaeE9238",1702448187,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

Generated with discovered.json: 0xb2a7c134dab045edcf9290ea3379e7233ab83f46

# Diff at Tue, 28 May 2024 09:05:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@26fb47d2fe07f8328027e4981771b4477e23fd15 block: 19882094
- current block number: 19967357

## Description

`createNewRollup()` is called by the AdminMultisig, adding a new rollup with a new chainID and the same rollupTypeID 4 as currently all other registered zkEVM rollups in the manager except PolygonZkEVM (3). This one is related to [gptprotocol](gptprotocol.org). (not launched / not producing blocks yet)

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        4
+        5
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.4:
+        ["0xC4E903D3Af4c3d2e437492d602adcC9d9b536858",1511670449,"0x0775e11309d75aA6b0967917fB0213C5673eDf81",4]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19882094 (main branch discovery), not current.

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.3.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        4913
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.2.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        196
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.3:
+        4
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.1.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        3776
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.3:
+        3
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.2:
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+++ description: Maps rollup contracts and their verifier. Any change should be picked up also by the specific rollup config, unless it's a new rollup. [rollupContract, chainID, verifier, rollupTypeID]
+++ severity: MEDIUM
      values.rollupsData.0.1:
-        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
+        1101
    }
```

Generated with discovered.json: 0x6124ec4be2edb290f32c6def8e55cfc071ddc45e

# Diff at Thu, 16 May 2024 10:59:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19718134
- current block number: 19882094

## Description

Changes related to improving the shared-polygon-cdk module.
Verifier is no longer part of this shared module - each rollup discoveres it for themselfs.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718134 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

Generated with discovered.json: 0x675abae30b8f0674b5c4e121e5e94f1373994217

# Diff at Tue, 23 Apr 2024 12:36:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@490974f5b59ffaa2fc80e604d18674505076a157 block: 19631886
- current block number: 19718134

## Description

A new unverified contract is added. Will take care of it once verified.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        3
+        4
+++ description: Maps rollup contracts and their verifier. Any change either should be picked up also by the specific rollup config, unless it's a new rollup.
+++ severity: MEDIUM
      values.rollupsData.3:
+        ["0x88AaB361f108C3c959F2928Da3cD8e47298016B5","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19631886 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "SharedProxyAdmin"
    }
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0xca1dcfc893f3259ddea0aa19ddc937f9e0d76fa1

# Diff at Wed, 10 Apr 2024 09:31:38 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6bb1fb9faf46a5960ef8903031fd713f6bd1234a block: 19610745
- current block number: 19624352

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
-   Status: DELETED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData.1.1:
-        "0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"
+        "0x0775e11309d75aA6b0967917fB0213C5673eDf81"
    }
```

## Source code changes

```diff
.../contracts/verifiers/FflonkVerifier.sol         |    0
 .../FflonkVerifier}/meta.txt                       |    0
 .../verifiers/FflonkVerifier.sol => /dev/null      | 1244 --------------------
 .../meta.txt => /dev/null                          |    2 -
 4 files changed, 1246 deletions(-)
```

Generated with discovered.json: 0x84208cfb3134802fcfbb77b6a1e6a6a4aa4c8419

# Diff at Mon, 08 Apr 2024 11:47:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@786d5557d38c508087b24a36535c329c2bdbb5ab block: 19525405
- current block number: 19610745

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupCount:
-        2
+        3
      values.rollupsData.2:
+        ["0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
      values.rollupTypeCount:
-        3
+        4
      values.rollupTypes.3:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]
    }
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonValidiumStorageMigration (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

## Source code changes

```diff
.../.code/OKBImplementation/implementation/OKb.sol |  408 +++++
 .../OKBImplementation/implementation/SafeMath.sol  |   28 +
 .../OKBImplementation/implementation/meta.txt      |    2 +
 .../.code/OKBImplementation/proxy/Address.sol      |   23 +
 .../proxy/OwnedUpgradeabilityProxy.sol             |   86 +
 .../.code/OKBImplementation/proxy/Proxy.sol        |   34 +
 .../proxy/UpgradeabilityProxy.sol                  |   59 +
 .../.code/OKBImplementation/proxy/meta.txt         |    2 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   70 +
 .../contracts/utils/cryptography/ECDSA.sol         |  213 +++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  345 ++++
 .../access/OwnableUpgradeable.sol                  |   95 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../v2/consensus/validium/PolygonDataCommittee.sol |  197 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../v2/interfaces/IPolygonDataCommitteeErrors.sol  |   40 +
 .../PolygonDataCommittee/implementation/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../.code/PolygonDataCommittee/proxy/meta.txt      |    2 +
 .../access/IAccessControlUpgradeable.sol           |   88 +
 .../proxy/utils/Initializable.sol                  |  165 ++
 .../token/ERC20/IERC20Upgradeable.sol              |   82 +
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |   28 +
 .../extensions/draft-IERC20PermitUpgradeable.sol   |   60 +
 .../token/ERC20/utils/SafeERC20Upgradeable.sol     |  116 ++
 .../utils/AddressUpgradeable.sol                   |  219 +++
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../utils/StringsUpgradeable.sol                   |   70 +
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  345 ++++
 .../@openzeppelin/contracts5/access/Ownable.sol    |  100 +
 .../contracts5/interfaces/IERC1967.sol             |   24 +
 .../contracts5/proxy/ERC1967/ERC1967Proxy.sol      |   40 +
 .../contracts5/proxy/ERC1967/ERC1967Utils.sol      |  193 ++
 .../@openzeppelin/contracts5/proxy/Proxy.sol       |   69 +
 .../contracts5/proxy/beacon/IBeacon.sol            |   16 +
 .../contracts5/proxy/transparent/ProxyAdmin.sol    |   45 +
 .../transparent/TransparentUpgradeableProxy.sol    |  116 ++
 .../@openzeppelin/contracts5/utils/Address.sol     |  159 ++
 .../@openzeppelin/contracts5/utils/Context.sol     |   24 +
 .../@openzeppelin/contracts5/utils/StorageSlot.sol |  135 ++
 .../interfaces/IBasePolygonZkEVMGlobalExitRoot.sol |   16 +
 .../contracts/interfaces/IPolygonZkEVMBridge.sol   |  118 ++
 .../contracts/interfaces/IPolygonZkEVMErrors.sol   |  211 +++
 .../contracts/interfaces/IVerifierRollup.sol       |   13 +
 .../contracts/lib/EmergencyManager.sol             |   73 +
 .../contracts/v2/PolygonRollupManager.sol          | 1911 ++++++++++++++++++++
 .../migration/PolygonRollupBaseEtrogNoGap.sol      |  945 ++++++++++
 .../migration/PolygonValidiumStorageMigration.sol  |  347 ++++
 .../consensus/zkEVM/PolygonZkEVMExistentEtrog.sol  |  134 ++
 .../v2/interfaces/IDataAvailabilityProtocol.sol    |   12 +
 .../contracts/v2/interfaces/IPolygonRollupBase.sol |   20 +
 .../v2/interfaces/IPolygonRollupManager.sol        |  170 ++
 .../contracts/v2/interfaces/IPolygonValidium.sol   |   15 +
 .../v2/interfaces/IPolygonZkEVMBridgeV2.sol        |  166 ++
 .../interfaces/IPolygonZkEVMGlobalExitRootV2.sol   |   10 +
 .../v2/interfaces/IPolygonZkEVMVEtrogErrors.sol    |   56 +
 .../contracts/v2/lib/LegacyZKEVMStateVariables.sol |  153 ++
 .../v2/lib/PolygonAccessControlUpgradeable.sol     |  245 +++
 .../contracts/v2/lib/PolygonConstantsBase.sol      |   14 +
 .../contracts/v2/lib/PolygonRollupBaseEtrog.sol    |  951 ++++++++++
 .../contracts/v2/lib/PolygonTransparentProxy.sol   |   79 +
 .../implementation/meta.txt                        |    2 +
 .../PolygonValidiumStorageMigration/proxy/meta.txt |    2 +
 .../ProxyAdmin.sol                                 |    0
 .../meta.txt                                       |    0
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 +
 .../contracts/interfaces/IERC1967.sol              |   26 +
 .../contracts/interfaces/draft-IERC1822.sol        |   20 +
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |   32 +
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |  171 ++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |   86 +
 .../contracts/proxy/beacon/BeaconProxy.sol         |   61 +
 .../contracts/proxy/beacon/IBeacon.sol             |   16 +
 .../contracts/proxy/beacon/UpgradeableBeacon.sol   |   65 +
 .../contracts/proxy/transparent/ProxyAdmin.sol     |   81 +
 .../transparent/TransparentUpgradeableProxy.sol    |  193 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  244 +++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |   88 +
 .../meta.txt                                       |    2 +
 97 files changed, 12282 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19525405 (main branch discovery), not current.

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

Generated with discovered.json: 0xba10c72cf7e833b13b991039623f6503c48425c3

# Diff at Wed, 27 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 19525405

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```
