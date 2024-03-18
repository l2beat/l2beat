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

Provide description of changes. This section will be preserved.

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
