Generated with discovered.json: 0xb7bff9b9df99a1cea4ddf6f05abb8ce485fded45

# Diff at Mon, 17 Jun 2024 08:23:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 20082412
- current block number: 20110288

## Description

Gas limit raised. Now ~10% higher than base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        100000000
    }
```

Generated with discovered.json: 0xfbd9c919a36d8ba7131d60ce803c892cd260a714

# Diff at Thu, 13 Jun 2024 10:50:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd33b23d6b32d4d38eea92d309fd854193b90203 block: 19927716
- current block number: 20082412

## Description

Gas limit raised.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        40000000
+        60000000
    }
```

Generated with discovered.json: 0x8ea4f813fa7d4b58eb69ad964fafb89cd12576b2

# Diff at Wed, 22 May 2024 20:10:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918763
- current block number: 19927716

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

Generated with discovered.json: 0x540ca88f8981b161a151986f136629dc3e13d7c5

# Diff at Tue, 21 May 2024 14:05:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19859812
- current block number: 19918763

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19859812 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OrderlyMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x5edacefb20bc8a6791e626d8341b2641515ce115

# Diff at Mon, 13 May 2024 08:10:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19830984
- current block number: 19859812

## Description

After doubling the gasLimit, it is now decreased to 40M, still a 1/3 increase from the original 30M.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        40000000
    }
```

Generated with discovered.json: 0x5d1123ab6324ea7e55ea01032dfc89c12ca212e2

# Diff at Thu, 09 May 2024 07:27:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19776802
- current block number: 19830984

## Description

The gasLimit for L2 is doubled. Current block time is 2s, elasticity is 10x. This config is now identical to Base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x3edeab069898df087a548f652052250c2f97a55a

# Diff at Thu, 28 Mar 2024 10:33:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412725
- current block number: 19532040

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412725 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x27306da2737a02c26f8c4f41629c815ee18b5695

# Diff at Mon, 11 Mar 2024 15:24:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d2d5fba14a44528004eaad2e4389550987c4f3cd block: 19370130
- current block number: 19412725

## Description

Update OP stack DA handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19370130 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x3cbbe86d1549ff16f956680e8ecb073e926f6be1

# Diff at Tue, 05 Mar 2024 16:23:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@529206d4dcd4dd7502f78a4a18a97240a3a0211b block: 19182535
- current block number: 19370130

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.scalar:
-        68400
+        13680
    }
```

Generated with discovered.json: 0xbe756234887059a7f1f0faab5602440c3db37a6d

# Diff at Thu, 08 Feb 2024 09:25:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19182535

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    }
```
