Generated with discovered.json: 0x66083d940dbc9d108c41fa626f37a4db25896f22

# Diff at Mon, 14 Oct 2024 10:49:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20878389
- current block number: 20878389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20878389 (main branch discovery), not current.

```diff
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06) {
    +++ description: None
      sourceHashes:
+        ["0xa56a53a05b7201f86a6987201b5a99cb4f9e7fba1060ecf8290515990b6f6b5e"]
    }
```

```diff
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d) {
    +++ description: None
      sourceHashes:
+        ["0xeb051b88e210e28fd696d01528e3cc9a131a08d69e20bf1983ac8d90dd9b1f4f"]
    }
```

```diff
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166) {
    +++ description: None
      sourceHashes:
+        ["0x503f175ab3807eb7f958512d3dc2501bb2ab62286bcd8cd1f85d7d24b2ce90cc"]
    }
```

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      sourceHashes:
+        ["0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"]
    }
```

```diff
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc) {
    +++ description: None
      sourceHashes:
+        ["0xabb95b2d66749481071b7a258a3305198760dbaf12d7411cfaba5e4c26cc3a65"]
    }
```

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      sourceHashes:
+        ["0xa148b7dcb3095dbb66f26d1428d50a59e1cd1384c80b0efe88efead152e6ebe2"]
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      sourceHashes:
+        ["0xc44a84c18fe7660acbe7750e0a14401b3a0a0ad97d8c81305bd879dca88d873b","0x424268ec553b52a09ec29bc220e95a4dc19def7e459d1cc8a541ee0e2fd578e9"]
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB) {
    +++ description: None
      sourceHashes:
+        ["0x6e3bfeae0d549b79decfd956f551a8aeac66523cdd66da389ef55eb56ef72aac"]
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x3a94a8b28edaa88a724e637b67fd3f1fc11e7976

# Diff at Wed, 02 Oct 2024 14:25:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d101c705b5f4fd0b3af2e251678b85e1005b31d8 block: 20871621
- current block number: 20878389

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20871621 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-05T19:21:47.000Z",["0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"]],["2024-08-26T18:55:23.000Z",["0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"]]]
    }
```

Generated with discovered.json: 0xbaaadc999e15bab5458f9d03f1ac9cea3dd706c0

# Diff at Tue, 01 Oct 2024 15:45:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 20733790
- current block number: 20871621

## Description

New verifier.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2.1:
-        false
+        true
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x1764C29FBd94865198588f10FC75D4f6636d158d"
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x1764C29FBd94865198588f10FC75D4f6636d158d)
    +++ description: None
```

## Source code changes

```diff
...-0x1764C29FBd94865198588f10FC75D4f6636d158d.sol | 1428 ++++++++++++++++++++
 1 file changed, 1428 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733790 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier.0:
-        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21.
      values.oldVerifier2:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.verifier.description:
-        "The verifier contract address for SP1, and whether it is frozen (true if frozen)."
+        "The prover contract address for SP1, and whether it is frozen (true if frozen)."
      fieldMeta.oldVerifier2:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-09-21."}
    }
```

Generated with discovered.json: 0x3eadd19bf219e615506b7a4f6cc2e2b18262c27c

# Diff at Thu, 12 Sep 2024 16:04:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@a548a141184c0638644a7574ba789109e041cf23 block: 20733790
- current block number: 20733790

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20733790 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
    }
```

Generated with discovered.json: 0x284d08252aa2489c2c43f1a7fcee954f098d861a

# Diff at Thu, 12 Sep 2024 09:59:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@21748f79216eb050ed17a98d0e8a74893f478f74 block: 20683436
- current block number: 20733790

## Description

Renames.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20683436 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      template:
-        "blobstream/SP1SuccinctGateway"
+        "succinct/SP1SuccinctGateway"
      values.blobstreamVerifier:
-        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      values.blobstreamVerifierOld:
-        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.oldVerifier:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",true]
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen).
      values.verifier:
+        ["0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc",false]
      fieldMeta.blobstreamVerifierOld:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.blobstreamVerifier:
-        {"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}
      fieldMeta.oldVerifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."}
      fieldMeta.verifier:
+        {"description":"The verifier contract address for SP1, and whether it is frozen (true if frozen)."}
    }
```

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      template:
-        "blobstream/SP1Blobstream"
+        "succinct/SP1Blobstream"
    }
```

Generated with discovered.json: 0x10abadaa17757983f4466ea6755c97721a41100d

# Diff at Thu, 05 Sep 2024 09:18:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6ec5206203571575116cf743c30b8a7c71ceafbb block: 20641123
- current block number: 20683436

## Description

New verifier version. Gateway route to old verifier route is frozen, and new route is added with identifier 0xc865c1b6.

## Watched changes

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0x0000000000000000000000000000000000000000"
+        "0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld.1:
-        false
+        true
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc)
    +++ description: None
```

## Source code changes

```diff
...-0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc.sol | 1427 ++++++++++++++++++++
 ...0xc350F063C13a3Ca21331610fe159E697a5c9c2FB.sol} |    0
 2 files changed, 1427 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20641123 (main branch discovery), not current.

```diff
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen).
      values.blobstreamVerifier.0:
-        "0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"
+        "0x0000000000000000000000000000000000000000"
+++ description: The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04.
      values.blobstreamVerifierOld:
+        ["0xc350F063C13a3Ca21331610fe159E697a5c9c2FB",false]
      template:
+        "blobstream/SP1SuccinctGateway"
      fieldMeta:
+        {"blobstreamVerifierOld":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen). This verifier route was frozen on 2024-09-04."},"blobstreamVerifier":{"description":"The verifier contract address for Blobstream SP1, and whether it is frozen (true if frozen)."}}
    }
```

Generated with discovered.json: 0xe304a4299d879d9d83a90949b26d2781cd131aad

# Diff at Fri, 30 Aug 2024 11:34:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@15092f43b0444977eaee21a17c064e8a6944b864 block: 20218838
- current block number: 20641123

## Description

- The SP1 Verifier Gateway address is set in the Blobstream contract, and replaces the SuccinctGateway for routing to the correct verifier. The Guardian can update the SP1VerifierGateway address.
- RequestHeaderRange and NextHeaderRange functions deprecated, together with their functionIds. FunctionIds were previously used when calling the SuccinctGateway to identify which verifier to use for proof verification. Now the verifier selector is contained in the first 4 bytes of the proof.
- Verifier program verification key is now stored in the Blobstream contract and it is used in the verifier for proof verification. It can be updated by the Guardian.
- CommitHeaderRange has now a permissioned mode, due to onlyApprovedRelayer modifier. Guardian can approve authorised relayers and toggle the permissioned mode through checkRelayer updates (true for permissioned, false for permissionless).

- SP1VerifierGateway:  contract that verifies proofs by routing to the correct verifier based on the verifier selector contained in the first 4 bytes of the proof. It additionally checks that to see that the verifier route is not frozen. The owner of the contract can add and freeze routes.


## Watched changes

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$implementation:
-        "0x41a87C543EBcbD93706CF5260AD057D9eCBA1caE"
+        "0x47fd660D5252Bd6F9D2c71507E46aa1d6e957c23"
      values.$upgradeCount:
-        1
+        2
      values.DATA_COMMITMENT_MAX:
-        10000
+        1000
      values.gateway:
-        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId:
-        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.nextHeaderFunctionId:
-        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
      values.VERSION:
-        "0.1.0"
+        "1.1.0"
      values.blobstreamProgramVkey:
+        "0x0038c5c5568fe5e1ae267efb1298a7792d1cda00bccc2d1d4bfa4c1511e06380"
      values.checkRelayer:
+        true
      values.gateway_deprecated:
+        "0x6c7a05e0AE641c6559fD76ac56641778B6eCd776"
      values.headerRangeFunctionId_deprecated:
+        "0xdb3232748ba9f2906d9d2ce97d2fac3963d4346de23c30521f346e10ddad82f7"
      values.isRelayerApproved:
+        true
      values.nextHeaderFunctionId_depcrecated:
+        "0xf7ab2ac6f5ccf2da79050efcc0dbdb06d5ae05a332f58076aeac7fc8c73811fe"
      values.verifier:
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
      errors:
-        {"isRelayerApproved":"Execution reverted"}
      derivedName:
-        "BlobstreamX"
+        "SP1Blobstream"
    }
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1 (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xc350F063C13a3Ca21331610fe159E697a5c9c2FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

## Source code changes

```diff
.../Blobstream/SP1Blobstream.sol}                  |  431 +++---
 .../blobstream/ethereum/.flat/SP1Verifier.sol      | 1429 ++++++++++++++++++++
 .../ethereum/.flat/SuccinctGatewaySP1.sol          |  230 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  952 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   34 +
 5 files changed, 2888 insertions(+), 188 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract Blobstream (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      name:
-        "BlobstreamX"
+        "Blobstream"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"TIMELOCK_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]},"GUARDIAN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x8bF34D8df1eF0A8A7f27fC587202848E528018E6"]}}
      values.relayers:
+        ["0x44eb418a966ff47f5af6f48aea6afde0bf193a8d"]
      template:
+        "blobstream/SP1Blobstream"
      errors:
+        {"isRelayerApproved":"Execution reverted"}
    }
```

```diff
    contract BlobstreamMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      name:
-        "BlobstreamXMultisig"
+        "BlobstreamMultisig"
    }
```

```diff
    contract SuccinctGatewayMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      name:
-        "SuccinctMultisig"
+        "SuccinctGatewayMultisig"
    }
```

Generated with discovered.json: 0xdff2e689e46248cfd5fbc9cdc194a60b93a1bf8c

# Diff at Fri, 23 Aug 2024 09:51:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x6eebfbd59cd1ce9f75fa84ec38c1fc51dbc81fee

# Diff at Wed, 21 Aug 2024 10:02:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xfab91205fdc6c53d8cd592cc86b3839e173721ea

# Diff at Fri, 09 Aug 2024 10:08:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x0449689f2ce80fE45B32092e0d878ad87F0156a9","0x793979789Ec179183E396e76c1e241bE0c9eE899","0x1358eaCFE3a7F4FEB06c0Ae722072F134bcE7caf","0x45878fdF56B372D944c6Fc1865B7a65462f6D1b0","0xA3fC931613a4E2440a199d47B0076e8b85F33099","0x91D456f83f4a117B07866fdEdC29306f7E974e15"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x72Ff26D9517324eEFA89A48B75c5df41132c4f54","0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126","0xa4ABEE02d42451Ba8c78b66361F53cb0C3dB3B65","0x19abbcEC005D4D83692f7A180125bF0FBd24253D"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xcb79dcf1d50142e427f3184a7dc418e412ac8a5f

# Diff at Tue, 30 Jul 2024 11:11:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20218838
- current block number: 20218838

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20218838 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776) {
    +++ description: None
      fieldMeta:
+        {"headerRangeProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the headerRange function ID of BlobstreamX."},"nextHeaderProvers":{"severity":"LOW","description":"List of prover (relayer) addresses that are allowed to `fulfillCallback()`/`fulfillCall()` in the Succinctgateway for the nextHeader function ID of BlobstreamX."}}
    }
```

Generated with discovered.json: 0x48c882d83a8c23c8b1c61b255f6b2f15dda4addc

# Diff at Thu, 13 Jun 2024 21:20:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20085541

## Description

Initial mainnet BlobstreamX discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FunctionVerifier (0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctFeeVault (0x296666e937b270193B960a7cEC526B351F353166)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctGateway (0x6c7a05e0AE641c6559fD76ac56641778B6eCd776)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamX (0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlobstreamXMultisig (0x8bF34D8df1eF0A8A7f27fC587202848E528018E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuccinctMultisig (0xd1999B562e74d9fbf57b4479b3fe8748BDF4e4A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xF33a22dFf8017813b95E5a05c9a97BaFE693001E)
    +++ description: None
```
