Generated with discovered.json: 0x912b6444b0142103fb4a358756e367318cc910e3

# Diff at Fri, 02 May 2025 17:25:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22281661
- current block number: 22397509

## Description

New feeAdapter contract which now acts as an entrypoint instead of the Spoke for  registering intents (on Ethereum).

## Watched changes

```diff
    contract EverclearSpokeV4 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "EverclearSpokeV3"
+        "EverclearSpokeV4"
      values.$implementation:
-        "0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
+        "0xd18C19169e7C87e7d84f27AD412a56C5D743D560"
      values.$pastUpgrades.3:
+        ["2025-04-29T11:43:35.000Z","0x268194204aceb79917b36ea1388c32aea7467aafe8592a320d52fcc09985b6a6",["0xd18C19169e7C87e7d84f27AD412a56C5D743D560"]]
      values.$upgradeCount:
-        3
+        4
      values.feeAdapter:
+        "0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75"
      derivedName:
-        "EverclearSpokeV3"
+        "EverclearSpokeV4"
    }
```

```diff
+   Status: CREATED
    contract FeeAdapter (0x15a7cA97D1ed168fB34a4055CEFa2E2f9Bdb6C75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XERC20Module (0xD1daF260951B8d350a4AeD5C80d74Fd7298C93F4)
    +++ description: None
```

## Source code changes

```diff
.../EverclearSpokeV4/EverclearSpokeV4.sol}         |  167 +-
 .../everclearbridge/ethereum/.flat/FeeAdapter.sol  | 1890 ++++++++++++++++++++
 .../ethereum/.flat/XERC20Module.sol                |  175 ++
 3 files changed, 2166 insertions(+), 66 deletions(-)
```

Generated with discovered.json: 0x0d3d8007f5abdd983a3be58631411488ef44a335

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22281661
- current block number: 22281661

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22281661 (main branch discovery), not current.

```diff
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6","via":[]}]
    }
```

```diff
    contract EverclearSpokeV3 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6","via":[]}]
    }
```

Generated with discovered.json: 0x907ab14d5461be8097a4c36670a5e8aeb92f0419

# Diff at Wed, 16 Apr 2025 12:49:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 22187317
- current block number: 22281661

## Description

Minor upgrade for the Spoke contract.

## Watched changes

```diff
    contract EverclearSpokeV3 (0xa05A3380889115bf313f1Db9d5f335157Be4D816) {
    +++ description: None
      name:
-        "EverclearSpoke"
+        "EverclearSpokeV3"
      values.$implementation:
-        "0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"
+        "0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"
      values.$pastUpgrades.2:
+        ["2024-09-16T05:00:59.000Z","0x0a57cf4df6073bd8c65327851929577a0e711996ed48b5785422168356237b80",["0x255aba6E7f08d40B19872D11313688c2ED65d1C9"]]
      values.$pastUpgrades.1.2:
-        "2024-09-16T05:00:59.000Z"
+        "0xe1b76ceaae265ba0c3762b3143858112401f39d49c84020906c3a0f7544d9d74"
      values.$pastUpgrades.1.1:
-        ["0x255aba6E7f08d40B19872D11313688c2ED65d1C9"]
+        "2024-12-18T10:09:23.000Z"
      values.$pastUpgrades.1.0:
-        "0x0a57cf4df6073bd8c65327851929577a0e711996ed48b5785422168356237b80"
+        ["0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"]
      values.$pastUpgrades.0.2:
-        "0xe1b76ceaae265ba0c3762b3143858112401f39d49c84020906c3a0f7544d9d74"
+        ["0xca6E4c424Fe12F989b6FEA2D9473515bE9b412b2"]
      values.$pastUpgrades.0.1:
-        "2024-12-18T10:09:23.000Z"
+        "0x4fa770e2446e25bbf87e7464bbc9c15afa45a4c4afdda25e34ee74b5eef1b20f"
      values.$pastUpgrades.0.0:
-        ["0x7e3667D4dE0B592c78cAa70faC8FE6d5853DfAAc"]
+        "2025-04-15T09:38:11.000Z"
      values.$upgradeCount:
-        2
+        3
      derivedName:
-        "EverclearSpoke"
+        "EverclearSpokeV3"
    }
```

## Source code changes

```diff
.../EverclearSpokeV3/EverclearSpokeV3.sol}         | 115 +++++++++++++++------
 1 file changed, 82 insertions(+), 33 deletions(-)
```

Generated with discovered.json: 0xa123728ef1295667fe671cc65f8b8a5236407fb8

# Diff at Thu, 03 Apr 2025 08:52:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22065300
- current block number: 22187317

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6) {
    +++ description: None
      values.$members.1:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "0xBc8988C7a4b77c1d6df7546bd876Ea4D42DF0837"
      values.$members.0:
-        "0xeb19B3Bdad53A775EB2d94d57D5a46c5260B0044"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

Generated with discovered.json: 0xe9c50b80396c9ae3d8272e3a8957929f39d373fb

# Diff at Mon, 17 Mar 2025 09:02:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22065300

## Description

Initial discovery, waiting for more contract verifications.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x4e2bbbFb10058E0D248a78fe2F469562f4eDbe66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xa02a88F0bbD47045001Bd460Ad186C30F9a974d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EverclearSpoke (0xa05A3380889115bf313f1Db9d5f335157Be4D816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xeFa6Ac3F931620fD0449eC8c619f2A14A0A78E99)
    +++ description: None
```
