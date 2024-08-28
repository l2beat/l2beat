Generated with discovered.json: 0x638cfcfd30fa8783c39c94c174591fcd22631030

# Diff at Fri, 23 Aug 2024 09:52:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xde2dee83752049b2ca5abfccfeec0a61fb7fb6c9

# Diff at Wed, 21 Aug 2024 10:03:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0x952851CecB07705A5bb483C1CE080F97e1E7491E","0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"],"configure":["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9","via":[]},{"permission":"upgrade","target":"0x0a23342520Aa8Ca963c4201801F4D3E95e731637","via":[]},{"permission":"upgrade","target":"0x622333688CC1878C7ff4205c89bDe051798788A7","via":[]},{"permission":"upgrade","target":"0x952851CecB07705A5bb483C1CE080F97e1E7491E","via":[]},{"permission":"upgrade","target":"0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","via":[]},{"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","via":[]},{"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","via":[]}]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

Generated with discovered.json: 0xa9a9ea8793479a143a3f05029945ee38b86c5122

# Diff at Fri, 09 Aug 2024 11:59:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      assignedPermissions.upgrade.3:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      assignedPermissions.upgrade.2:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      assignedPermissions.upgrade.1:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      assignedPermissions.upgrade.0:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
    }
```

Generated with discovered.json: 0x4ed5b3030d4e40b45b13146b9beff60c7d8d91d9

# Diff at Fri, 09 Aug 2024 10:09:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0x952851CecB07705A5bb483C1CE080F97e1E7491E","0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"]
      assignedPermissions.owner:
-        ["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]
      assignedPermissions.upgrade:
+        ["0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0x952851CecB07705A5bb483C1CE080F97e1E7491E"]
      assignedPermissions.configure:
+        ["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]
      assignedPermissions.configure:
+        ["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xAb86E21e9BFA559B93ca6f783362BFf5504f2cac","0x7E973c8f8aCDb71E4e00A19631739FFBF9748Cd0","0xBcB3EaB21eCe8864aFcC07f7613bD6D8bB5C28d3","0x988378eD49F538104fDBaC1A0ac2Edf9890EA4f2","0x282DB123D1cbf5437c295EA0df0137E5FaDbD117"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xAb86E21e9BFA559B93ca6f783362BFf5504f2cac","0x7E973c8f8aCDb71E4e00A19631739FFBF9748Cd0","0xBcB3EaB21eCe8864aFcC07f7613bD6D8bB5C28d3","0x988378eD49F538104fDBaC1A0ac2Edf9890EA4f2","0x282DB123D1cbf5437c295EA0df0137E5FaDbD117"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x272136412ca595ca8694411b7aad8edf1acac660

# Diff at Thu, 18 Jul 2024 10:31:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x425903034a509368cac295deabcbca75860f4d05

# Diff at Thu, 28 Mar 2024 09:10:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411993
- current block number: 19531626

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411993 (main branch discovery), not current.

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0a1f7e21850a167f52f38ab6277deb45137398e8

# Diff at Mon, 11 Mar 2024 12:57:34 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19324951
- current block number: 19411993

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19324951 (main branch discovery), not current.

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x4994070662bbd95d21b8c9c1ab21761f41503e62

# Diff at Wed, 28 Feb 2024 08:50:37 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19324951

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    }
```

```diff
+   Status: CREATED
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    }
```
