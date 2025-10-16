Generated with discovered.json: 0x358b296d8ec28852bc85b46f109a03a18e24b13c

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xcb9caef50b8882b5eaf67f4c0143f8cf50d81f2e

# Diff at Mon, 14 Jul 2025 12:45:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22666223
- current block number: 22666223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22666223 (main branch discovery), not current.

```diff
    EOA  (0x0188485989e211eDde9e5ba5794a3c6a3429BDb4) {
    +++ description: None
      address:
-        "0x0188485989e211eDde9e5ba5794a3c6a3429BDb4"
+        "eth:0x0188485989e211eDde9e5ba5794a3c6a3429BDb4"
    }
```

```diff
    EOA  (0x36105564a3e70f3FB525Cd825d42393F9aD64AA3) {
    +++ description: None
      address:
-        "0x36105564a3e70f3FB525Cd825d42393F9aD64AA3"
+        "eth:0x36105564a3e70f3FB525Cd825d42393F9aD64AA3"
    }
```

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      address:
-        "0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
+        "eth:0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
      values.$admin:
-        "0xb463603469Bf31f189E3F6625baf8378880Df14e"
+        "eth:0xb463603469Bf31f189E3F6625baf8378880Df14e"
      values.$implementation:
-        "0xB6cD7eD75c008d0033ED241872639a1D8a35020a"
+        "eth:0xB6cD7eD75c008d0033ED241872639a1D8a35020a"
      values.$pastUpgrades.0.2.0:
-        "0xB6cD7eD75c008d0033ED241872639a1D8a35020a"
+        "eth:0xB6cD7eD75c008d0033ED241872639a1D8a35020a"
      values.feeRecipient:
-        "0x0188485989e211eDde9e5ba5794a3c6a3429BDb4"
+        "eth:0x0188485989e211eDde9e5ba5794a3c6a3429BDb4"
      values.outerVerifier:
-        "0xE990F8e3505391d2b42C80683d403A8371Ee88B9"
+        "eth:0xE990F8e3505391d2b42C80683d403A8371Ee88B9"
      values.owner:
-        "0xb463603469Bf31f189E3F6625baf8378880Df14e"
+        "eth:0xb463603469Bf31f189E3F6625baf8378880Df14e"
      values.worker:
-        "0x7545b173780F07BF9EFA7e1561bb35B52907974D"
+        "eth:0x7545b173780F07BF9EFA7e1561bb35B52907974D"
      implementationNames.0x3B946743DEB7B6C97F05B7a31B23562448047E3E:
-        "ERC1967Proxy"
      implementationNames.0xB6cD7eD75c008d0033ED241872639a1D8a35020a:
-        "UpaVerifier"
      implementationNames.eth:0x3B946743DEB7B6C97F05B7a31B23562448047E3E:
+        "ERC1967Proxy"
      implementationNames.eth:0xB6cD7eD75c008d0033ED241872639a1D8a35020a:
+        "UpaVerifier"
    }
```

```diff
    EOA  (0x4Aa1D1B45F30725DF5Ba9d99DDa4c27f8dac6dd7) {
    +++ description: None
      address:
-        "0x4Aa1D1B45F30725DF5Ba9d99DDa4c27f8dac6dd7"
+        "eth:0x4Aa1D1B45F30725DF5Ba9d99DDa4c27f8dac6dd7"
    }
```

```diff
    EOA  (0x7545b173780F07BF9EFA7e1561bb35B52907974D) {
    +++ description: None
      address:
-        "0x7545b173780F07BF9EFA7e1561bb35B52907974D"
+        "eth:0x7545b173780F07BF9EFA7e1561bb35B52907974D"
    }
```

```diff
    EOA  (0x937094ae4Cc930DBF387CA55d80e03586435E002) {
    +++ description: None
      address:
-        "0x937094ae4Cc930DBF387CA55d80e03586435E002"
+        "eth:0x937094ae4Cc930DBF387CA55d80e03586435E002"
    }
```

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      address:
-        "0xb463603469Bf31f189E3F6625baf8378880Df14e"
+        "eth:0xb463603469Bf31f189E3F6625baf8378880Df14e"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "eth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xE3ac80DAe2a6e100A74bB179aBB65383e1B21B3D"
+        "eth:0xE3ac80DAe2a6e100A74bB179aBB65383e1B21B3D"
      values.$members.1:
-        "0x937094ae4Cc930DBF387CA55d80e03586435E002"
+        "eth:0x937094ae4Cc930DBF387CA55d80e03586435E002"
      values.$members.2:
-        "0xBb9A51256d4ae71dE356e83058C69bc9a33e4324"
+        "eth:0xBb9A51256d4ae71dE356e83058C69bc9a33e4324"
      values.$members.3:
-        "0xbB1de72013286C40c3a7E8468a5eAe2aE36EE10e"
+        "eth:0xbB1de72013286C40c3a7E8468a5eAe2aE36EE10e"
      values.$members.4:
-        "0xCA5C66933149d95fbA1050AAF7046b08A7F28AE5"
+        "eth:0xCA5C66933149d95fbA1050AAF7046b08A7F28AE5"
      values.$members.5:
-        "0x4Aa1D1B45F30725DF5Ba9d99DDa4c27f8dac6dd7"
+        "eth:0x4Aa1D1B45F30725DF5Ba9d99DDa4c27f8dac6dd7"
      values.$members.6:
-        "0x36105564a3e70f3FB525Cd825d42393F9aD64AA3"
+        "eth:0x36105564a3e70f3FB525Cd825d42393F9aD64AA3"
      implementationNames.0xb463603469Bf31f189E3F6625baf8378880Df14e:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.eth:0xb463603469Bf31f189E3F6625baf8378880Df14e:
+        "GnosisSafeProxy"
      implementationNames.eth:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xbB1de72013286C40c3a7E8468a5eAe2aE36EE10e) {
    +++ description: None
      address:
-        "0xbB1de72013286C40c3a7E8468a5eAe2aE36EE10e"
+        "eth:0xbB1de72013286C40c3a7E8468a5eAe2aE36EE10e"
    }
```

```diff
    EOA  (0xBb9A51256d4ae71dE356e83058C69bc9a33e4324) {
    +++ description: None
      address:
-        "0xBb9A51256d4ae71dE356e83058C69bc9a33e4324"
+        "eth:0xBb9A51256d4ae71dE356e83058C69bc9a33e4324"
    }
```

```diff
    EOA  (0xCA5C66933149d95fbA1050AAF7046b08A7F28AE5) {
    +++ description: None
      address:
-        "0xCA5C66933149d95fbA1050AAF7046b08A7F28AE5"
+        "eth:0xCA5C66933149d95fbA1050AAF7046b08A7F28AE5"
    }
```

```diff
    EOA  (0xE3ac80DAe2a6e100A74bB179aBB65383e1B21B3D) {
    +++ description: None
      address:
-        "0xE3ac80DAe2a6e100A74bB179aBB65383e1B21B3D"
+        "eth:0xE3ac80DAe2a6e100A74bB179aBB65383e1B21B3D"
    }
```

```diff
    contract  (0xE990F8e3505391d2b42C80683d403A8371Ee88B9) {
    +++ description: None
      address:
-        "0xE990F8e3505391d2b42C80683d403A8371Ee88B9"
+        "eth:0xE990F8e3505391d2b42C80683d403A8371Ee88B9"
      implementationNames.0xE990F8e3505391d2b42C80683d403A8371Ee88B9:
-        ""
      implementationNames.eth:0xE990F8e3505391d2b42C80683d403A8371Ee88B9:
+        ""
    }
```

```diff
+   Status: CREATED
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xE990F8e3505391d2b42C80683d403A8371Ee88B9)
    +++ description: None
```

Generated with discovered.json: 0x7bc5f160b64914eb447a9937561e6d114996da69

# Diff at Fri, 04 Jul 2025 12:19:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22666223
- current block number: 22666223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22666223 (main branch discovery), not current.

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
+        "eth:0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
    }
```

Generated with discovered.json: 0x96cf1bc0666a46c471e5819eae9818d011fe36eb

# Diff at Fri, 23 May 2025 09:41:00 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 20826378
- current block number: 20826378

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x63acaa0e8e75d697a26caeeb4e5927dfc4665290

# Diff at Tue, 29 Apr 2025 08:19:07 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 20826378
- current block number: 20826378

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xb463603469Bf31f189E3F6625baf8378880Df14e","via":[]}]
    }
```

Generated with discovered.json: 0x836448fbeca19051957056104cce2ac592fc7bec

# Diff at Tue, 04 Mar 2025 10:39:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20826378
- current block number: 20826378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      sinceBlock:
+        20528085
    }
```

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      sinceBlock:
+        20464874
    }
```

```diff
    contract  (0xE990F8e3505391d2b42C80683d403A8371Ee88B9) {
    +++ description: None
      sinceBlock:
+        20528013
    }
```

Generated with discovered.json: 0x59c3168cd672d5eb31ec6181136610bc0b24e27b

# Diff at Mon, 20 Jan 2025 11:09:47 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20826378
- current block number: 20826378

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb463603469Bf31f189E3F6625baf8378880Df14e"
      issuedPermissions.0.to:
+        "0xb463603469Bf31f189E3F6625baf8378880Df14e"
    }
```

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
      receivedPermissions.0.from:
+        "0x3B946743DEB7B6C97F05B7a31B23562448047E3E"
    }
```

Generated with discovered.json: 0x23d7a5b5c74aa489d66149cd5fb7386a71275249

# Diff at Mon, 21 Oct 2024 11:08:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20826378
- current block number: 20826378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xB6cD7eD75c008d0033ED241872639a1D8a35020a"]
      values.$pastUpgrades.0.1:
-        ["0xB6cD7eD75c008d0033ED241872639a1D8a35020a"]
+        "0xd84efac6fc5304747cf72def5bcb7bc2248bd43a6ea4fa7e00f6097269880077"
    }
```

Generated with discovered.json: 0x56832b9df38eb03ce3d07bc0895ff07d2cab9a1c

# Diff at Mon, 14 Oct 2024 10:53:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20826378
- current block number: 20826378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0xe582f3eab54999f776908b50e2e0f6f3bf03ed8d3c1e5c0d4c7f106234259e85"]
    }
```

```diff
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x197b8087d7d616c860207059a5c16396da01fe1c

# Diff at Tue, 01 Oct 2024 10:53:17 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20826378
- current block number: 20826378

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20826378 (main branch discovery), not current.

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-14T16:32:47.000Z",["0xB6cD7eD75c008d0033ED241872639a1D8a35020a"]]]
    }
```

Generated with discovered.json: 0x93694ce8fa8ba9c589bf7831a22fdc813a009529

# Diff at Wed, 25 Sep 2024 08:18:25 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20756756
- current block number: 20826378

## Description

Two new circuitIDs added.

## Watched changes

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.getCircuitIds.4:
+        "0xce48e1cc84d60e97002a3a2cf4922518d29807902411c8fab5717ba51e0a3fa4"
      values.getCircuitIds.3:
+        "0x6dd87ed53c75bcf4b71ea175076439d03ce87fd155ef425a77f53b8e95c60e38"
    }
```

Generated with discovered.json: 0xcd08c465cd0b402f9140081649f6f0509db9da75

# Diff at Fri, 06 Sep 2024 11:07:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08a747098d22564c3a0b869c0a20851bf283bd07 block: 20670228
- current block number: 20691150

## Description

A new (third) circuit is registered and can be used for proving.

## Watched changes

```diff
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E) {
    +++ description: None
      values.getCircuitIds.2:
+        "0x20dca5aeaaa412308a341546b48893f6c4c8f3b5b2774ccbd46e95a9bde9f03b"
    }
```

Generated with discovered.json: 0xa9e947b219ad4875433807857044c6c4adaeb3b7

# Diff at Mon, 02 Sep 2024 11:30:39 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20662597

## Description

Initial Discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract UpaVerifier (0x3B946743DEB7B6C97F05B7a31B23562448047E3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NebraOwner (0xb463603469Bf31f189E3F6625baf8378880Df14e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xE990F8e3505391d2b42C80683d403A8371Ee88B9)
    +++ description: None
```

