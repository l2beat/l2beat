Generated with discovered.json: 0x2258641cd52d584f93bf94d32241f9376ca48067

# Diff at Tue, 05 May 2026 10:22:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777962030
- current timestamp: 1777962030

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777962030 (main branch discovery), not current.

```diff
    contract Verifier (eth:0x9B9671dB83CfcB4508bF361942488C5cA2b1286D) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      deployerAddress:
+        "eth:0x082cCe3072A26a3871D3e5D40afB425fF5038Cf6"
    }
```

```diff
    contract AggchainECDSAMultisig (eth:0xb1714954bBc0162A36FB44934F3216aCE81C40d7) {
    +++ description: System contract defining the Pentagon Games Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      deployerAddress:
+        "eth:0xCE27d8BCee45dB3E457EcF8629264Ca7893AAaAc"
    }
```

Generated with discovered.json: 0x868a4190fe06390e8e297bde85d508b3e735cf79

# Diff at Tue, 05 May 2026 06:37:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@26382144ce3c79862aee73e15f619d0a40458aae block: 1774353270
- current timestamp: 1777962030

## Description

move from validium to Multisig state vali.

## Watched changes

```diff
-   Status: DELETED
    contract ProxyAdmin (eth:0x1a26Fc326860bb2fbBa0ebc4f63F9349b254C00e)
    +++ description: None
```

```diff
    EOA  (eth:0x8499B48896660D549b3A55e6c68a3169B5f9B382) {
    +++ description: None
      receivedPermissions.0.description:
-        "set core system parameters like the trusted sequencer and manage forced transactions/batches."
+        "set the trusted sequencer address."
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE","description":"manage the members of the data availability committee and the threshold for valid commitments.","role":".owner"}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE","role":"admin","via":[{"address":"eth:0x1a26Fc326860bb2fbBa0ebc4f63F9349b254C00e"}]}
      controlsMajorityOfUpgradePermissions:
-        true
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x1a26Fc326860bb2fbBa0ebc4f63F9349b254C00e","role":".owner"}]
    }
```

```diff
    contract AggchainECDSAMultisig (eth:0xb1714954bBc0162A36FB44934F3216aCE81C40d7) {
    +++ description: System contract defining the Pentagon Games Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      name:
-        "PolygonZkEVM"
+        "AggchainECDSAMultisig"
      template:
-        "polygon-cdk/PolygonZkEVM"
+        "polygon-cdk/AggchainECDSAMultisig"
      sourceHashes.1:
-        "0x78d1eb2b96633fb1f594ef672a3791fa85a077fe0cf415ef79d93bc9a2aebd9c"
+        "0xa58b59f574674919f2c3fb755a6e3e369c0d5f734d8fcca6fe2664629ad8b25e"
      description:
-        "The main system contract defining the Pentagon Games Layer 2 logic. Entry point for sequencing batches."
+        "System contract defining the Pentagon Games Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s)."
      values.$implementation:
-        "eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
+        "eth:0x0D49fD0d79723e4D24AaC83f604ED2D3d5fC0f21"
      values.$pastUpgrades.1:
+        ["2026-05-01T13:08:35.000Z","0x5ec0f7293eb1ef1149a55aea2a4845d0b905fd808ffa05cd7f949c7ff2ed86e2",["eth:0x0D49fD0d79723e4D24AaC83f604ED2D3d5fC0f21"]]
      values.$upgradeCount:
-        1
+        2
      values.calculatePolPerForceBatch:
-        0
      values.dataAvailabilityProtocol:
-        "eth:0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE"
      values.GLOBAL_EXIT_ROOT_MANAGER_L2:
-        "eth:0xa40D5f56745a118D0906a34E69aeC8C0Db1cB8fA"
      values.INITIALIZE_TX_BRIDGE_LIST_LEN_LEN:
-        249
      values.INITIALIZE_TX_BRIDGE_PARAMS:
-        "0x80808401c9c38094"
      values.INITIALIZE_TX_BRIDGE_PARAMS_AFTER_BRIDGE_ADDRESS:
-        "0x80b9"
      values.INITIALIZE_TX_BRIDGE_PARAMS_AFTER_BRIDGE_ADDRESS_EMPTY_METADATA:
-        "0x80b8"
      values.INITIALIZE_TX_CONSTANT_BYTES:
-        32
      values.INITIALIZE_TX_CONSTANT_BYTES_EMPTY_METADATA:
-        31
      values.INITIALIZE_TX_DATA_LEN_EMPTY_METADATA:
-        228
      values.INITIALIZE_TX_EFFECTIVE_PERCENTAGE:
-        "0xff"
      values.isSequenceWithDataAvailabilityAllowed:
-        false
      values.SIGNATURE_INITIALIZE_TX_R:
-        "0x00000000000000000000000000000000000000000000000000000005ca1ab1e0"
      values.SIGNATURE_INITIALIZE_TX_S:
-        "0x000000000000000000000000000000000000000000000000000000005ca1ab1e"
      values.SIGNATURE_INITIALIZE_TX_V:
-        27
      values.TIMESTAMP_RANGE:
-        36
      values.trustedSequencer:
-        "eth:0x02c7D29a0eA1dce127F75daa254F7aDab1EE9bb2"
+        "eth:0x34DaDcB5010ffB1E355B92AD53bbEbECe98af471"
      values._legacypendingVKeyManager:
+        "eth:0x0000000000000000000000000000000000000000"
      values._legacyvKeyManager:
+        "eth:0x0000000000000000000000000000000000000000"
      values.AGGCHAIN_ECDSA_MULTISIG_VERSION:
+        "v1.0.0"
+++ description: 0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte
+++ severity: HIGH
      values.AGGCHAIN_TYPE:
+        "0x0000"
      values.aggchainManager:
+        "eth:0x8499B48896660D549b3A55e6c68a3169B5f9B382"
      values.aggchainMetadataManager:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.aggchainMultisigHash:
+        "0x103ad17d092abf2c3f24030ed926984d334b754d7e66999f05691ff928793877"
      values.aggchainSigners:
+        ["eth:0x34DaDcB5010ffB1E355B92AD53bbEbECe98af471"]
      values.aggLayerGateway:
+        "eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3"
+++ description: 0 - ECDSA sig verification, 1 - aggchainVkey verification (read by the pessimistic program)
+++ severity: HIGH
      values.CONSENSUS_TYPE:
+        1
      values.getAggchainMultisigHash:
+        "0x103ad17d092abf2c3f24030ed926984d334b754d7e66999f05691ff928793877"
      values.getAggchainSignerInfos:
+        [{"addr":"eth:0x34DaDcB5010ffB1E355B92AD53bbEbECe98af471","url":"https://rpc.pentagon.games"}]
      values.getAggchainSigners:
+        ["eth:0x34DaDcB5010ffB1E355B92AD53bbEbECe98af471"]
      values.getAggchainSignersCount:
+        1
      values.getThreshold:
+        1
      values.MAX_AGGCHAIN_SIGNERS:
+        255
      values.pendingAggchainManager:
+        "eth:0x0000000000000000000000000000000000000000"
      values.threshold:
+        1
+++ severity: HIGH
      values.useDefaultSigners:
+        false
+++ severity: HIGH
      values.useDefaultVkeys:
+        false
      values.version:
+        "v1.0.0"
      fieldMeta.CONSENSUS_TYPE:
+        {"severity":"HIGH","description":"0 - ECDSA sig verification, 1 - aggchainVkey verification (read by the pessimistic program)"}
      fieldMeta.aggchainMultisigHash:
+        {"severity":"HIGH"}
      fieldMeta.useDefaultSigners:
+        {"severity":"HIGH"}
      fieldMeta.useDefaultVkeys:
+        {"severity":"HIGH"}
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte"}
      implementationNames.eth:0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F:
-        "PolygonValidiumEtrog"
      implementationNames.eth:0x0D49fD0d79723e4D24AaC83f604ED2D3d5fC0f21:
+        "AggchainECDSAMultisig"
    }
```

```diff
-   Status: DELETED
    contract PolygonDataCommittee (eth:0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
```

```diff
+   Status: CREATED
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

## Source code changes

```diff
.../AggchainECDSAMultisig.sol}                     | 7179 +++++++++++---------
 .../PolygonTransparentProxy.p.sol                  |    0
 .../PolygonDataCommittee.sol => /dev/null          | 1344 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  831 ---
 .../.flat@1774353270/ProxyAdmin.sol => /dev/null   |  213 -
 5 files changed, 4155 insertions(+), 5412 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1774353270 (main branch discovery), not current.

```diff
    contract PolygonZkEVM (eth:0xb1714954bBc0162A36FB44934F3216aCE81C40d7) {
    +++ description: The main system contract defining the Pentagon Games Layer 2 logic. Entry point for sequencing batches.
      name:
-        "Validium"
+        "PolygonZkEVM"
    }
```

Generated with discovered.json: 0xb4c44f747f46f13e7cf43819849938fca921c337

# Diff at Tue, 24 Mar 2026 11:55:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eea8d762719901a50aabccb689d291326ce8830c block: 1762264391
- current timestamp: 1774353270

## Description

dac url change.

## Watched changes

```diff
    contract PolygonDataCommittee (eth:0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
      values.members.0.url:
-        "https://dac.pentagon.games"
+        "http://10.30.33.163:8444"
    }
```

Generated with discovered.json: 0x98589f32e78d7357bab32a10ad5017831af795ac

# Diff at Tue, 04 Nov 2025 11:33:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1752752123
- current timestamp: 1752752123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752752123 (main branch discovery), not current.

```diff
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) {
    +++ description: None
      name:
-        "PolygonSharedBridge"
+        "AgglayerBridge"
    }
```

```diff
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      name:
-        "PolygonRollupManager"
+        "AgglayerManager"
    }
```

```diff
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "PolygonGlobalExitRootV2"
+        "AgglayerGER"
    }
```

Generated with discovered.json: 0xed0949ee21117496718995ebf632a8cb6a06eef9

# Diff at Wed, 03 Sep 2025 15:52:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fbfe8da4086c70042fea30347d68132d3f574015 block: 1752752123
- current timestamp: 1752752123

## Description

Rerun to add References to entrypoints of shared modules

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1752752123 (main branch discovery), not current.

```diff
+   Status: CREATED
    reference PolygonSharedBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonRollupManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference PolygonGlobalExitRootV2 (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

Generated with discovered.json: 0x6ab241ef14cd50829acf3b46238d64cb78abc569

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x53522998f99008a06d4b5d15a7cbc2ce912f7a82

# Diff at Thu, 17 Jul 2025 11:35:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22938657

## Description

Initial discovery of a standard agglayer validium with PC gas token.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1a26Fc326860bb2fbBa0ebc4f63F9349b254C00e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x9B9671dB83CfcB4508bF361942488C5cA2b1286D)
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
```

```diff
+   Status: CREATED
    contract Validium (0xb1714954bBc0162A36FB44934F3216aCE81C40d7)
    +++ description: The main system contract defining the Pentagon Games Layer 2 logic. Entry point for sequencing batches.
```

```diff
+   Status: CREATED
    contract PolygonDataCommittee (0xC89AB4F5AEEe5cfbC34F8EEFA7B17414CC9391aE)
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 1/1).
```

