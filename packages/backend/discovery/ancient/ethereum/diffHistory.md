Generated with discovered.json: 0xf1aa0fb26d15c7ad6120766a2b7e5303545e6e34

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
