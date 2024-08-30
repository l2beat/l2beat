Generated with discovered.json: 0x37a184859ae9acb69dd9df08530d7987a6ef0cb2

# Diff at Fri, 30 Aug 2024 07:51:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
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

Generated with discovered.json: 0x80cb2e9800ed42e3be9948aee89921179784643f

# Diff at Fri, 23 Aug 2024 09:51:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x8d36cce96460a07728a8b7303a806d9ea4996f5a

# Diff at Wed, 21 Aug 2024 10:01:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0xd5e3eDf5b68135D559D572E26bF863FBC1950033"],"configure":["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x15A52Fed1c448028A240b603dD93f2697E12Dc82","via":[]},{"permission":"upgrade","target":"0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","via":[]},{"permission":"upgrade","target":"0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","via":[]},{"permission":"upgrade","target":"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","via":[]},{"permission":"upgrade","target":"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","via":[]},{"permission":"upgrade","target":"0xd5e3eDf5b68135D559D572E26bF863FBC1950033","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x75a223Fb459461B9Fa61dd25109EA05522b4b492","via":[]}]
    }
```

Generated with discovered.json: 0xa51c5d012bba6ff29847e956447b87255769d0ef

# Diff at Fri, 09 Aug 2024 11:58:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
+        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
      assignedPermissions.upgrade.2:
-        "0xd5e3eDf5b68135D559D572E26bF863FBC1950033"
+        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
      assignedPermissions.upgrade.0:
-        "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"
+        "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
    }
```

Generated with discovered.json: 0x335e8ee095e5a61d2c73e2c2dba3ee4287a347f6

# Diff at Fri, 09 Aug 2024 10:08:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C","0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c","0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x05F0c4e31e2ab24f5CF20b1B9d2FCe2c3d48BB9C","0xcdD7FE91F5e2dCf8a0B30C4127c8D54e3F2a469c","0xE3a87D0eE19c66d0d22F2AEf50c78d4C4FEeA5FB"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]
      assignedPermissions.configure:
+        ["0x75a223Fb459461B9Fa61dd25109EA05522b4b492"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0xd5e3eDf5b68135D559D572E26bF863FBC1950033"]
      assignedPermissions.owner:
-        ["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]
      assignedPermissions.upgrade:
+        ["0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68","0x12d4E64E1B46d27A00fe392653A894C1dd36fb80","0xd5e3eDf5b68135D559D572E26bF863FBC1950033","0xB09DC08428C8b4EFB4ff9C0827386CDF34277996","0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"]
      assignedPermissions.configure:
+        ["0x15A52Fed1c448028A240b603dD93f2697E12Dc82"]
    }
```

Generated with discovered.json: 0xd5e828b274e743cfd2c6c37c67ffe84261597d28

# Diff at Thu, 18 Jul 2024 10:29:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927693
- current block number: 19927693

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927693 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x75a223Fb459461B9Fa61dd25109EA05522b4b492, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x8c34e30ec59ca39871f637a25774caf5e293d8dc

# Diff at Wed, 22 May 2024 20:06:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918740
- current block number: 19927693

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x0014cacc2439b6116f5eab2dfd9297c6443ff925

# Diff at Tue, 21 May 2024 14:00:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531414
- current block number: 19918740

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531414 (main branch discovery), not current.

```diff
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "Ancient8Multisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x773dec9f626d22f93d9330da1369977fd53d9b27

# Diff at Thu, 28 Mar 2024 08:27:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19412062
- current block number: 19531414

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412062 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x425613a7645f93f490c32e837884a2039f9afa63

# Diff at Mon, 11 Mar 2024 13:10:22 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19369992
- current block number: 19412062

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19369992 (main branch discovery), not current.

```diff
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x573721713ae6ff81bafd1346c53f2ddd8f194913

# Diff at Mon, 26 Feb 2024 09:48:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- current block number: 19310944

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x012c341506ee1939e56084F43Ae5dbCe224Ce2af) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12d4E64E1B46d27A00fe392653A894C1dd36fb80) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x15A52Fed1c448028A240b603dD93f2697E12Dc82) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x1B1ecDdbd5F9601b34262Aa3Ca346209E61aA68f) {
    }
```

```diff
+   Status: CREATED
    contract Ancient8Multisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75a223Fb459461B9Fa61dd25109EA05522b4b492) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB09DC08428C8b4EFB4ff9C0827386CDF34277996) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xd5e3eDf5b68135D559D572E26bF863FBC1950033) {
    }
```
