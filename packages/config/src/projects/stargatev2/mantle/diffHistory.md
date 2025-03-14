Generated with discovered.json: 0xaea3f3ded63317489c4000519e7124850d93c761

# Diff at Tue, 04 Mar 2025 10:42:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 75699152
- current block number: 75699152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 75699152 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x41B491285A4f888F9f636cEc8a363AB9770a0AEF) {
    +++ description: None
      sinceBlock:
+        64353373
    }
```

```diff
    contract StargatePool (0x4c1d3Fc3fC3c177c3b633427c2F769276c547463) {
    +++ description: None
      sinceBlock:
+        64353351
    }
```

```diff
    contract StargatePoolUSDC (0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC) {
    +++ description: None
      sinceBlock:
+        64353362
    }
```

```diff
    contract StargatePoolMigratable (0xB715B85682B731dB9D5063187C450095c91C57FC) {
    +++ description: None
      sinceBlock:
+        64353367
    }
```

```diff
    contract StargatePool (0xF7628d84a2BbD9bb9c8E686AC95BB5d55169F3F1) {
    +++ description: None
      sinceBlock:
+        64353357
    }
```

Generated with discovered.json: 0xb358489ea388bf96ba8a75c377c7c8329c306b1e

# Diff at Mon, 14 Oct 2024 11:00:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 65329557
- current block number: 65329557

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 65329557 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x41B491285A4f888F9f636cEc8a363AB9770a0AEF) {
    +++ description: None
      sourceHashes:
+        ["0xd0e407d7588e82d593435d256d12b9da5c2c70686a62e24948a96fcbc1a463b4"]
    }
```

```diff
    contract StargatePool (0x4c1d3Fc3fC3c177c3b633427c2F769276c547463) {
    +++ description: None
      sourceHashes:
+        ["0xf0d2f0cd5f3481632b35bc976e24b16d77ccdeefeb7307139a3f3d2adf485094"]
    }
```

```diff
    contract StargatePoolUSDC (0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC) {
    +++ description: None
      sourceHashes:
+        ["0x0ef9b0bca6f74cd24daa9d50e734dfec2ecbc71cef5b209fa0c0f93561ad2640"]
    }
```

```diff
    contract StargatePoolMigratable (0xB715B85682B731dB9D5063187C450095c91C57FC) {
    +++ description: None
      sourceHashes:
+        ["0xad746913c310c0ee643e98f0a0f4bc6095877e7c82e0779cb5d5e852e0e12c8d"]
    }
```

```diff
    contract StargatePool (0xF7628d84a2BbD9bb9c8E686AC95BB5d55169F3F1) {
    +++ description: None
      sourceHashes:
+        ["0xf0d2f0cd5f3481632b35bc976e24b16d77ccdeefeb7307139a3f3d2adf485094"]
    }
```

Generated with discovered.json: 0x1501382c366ad175798685b6412499a56a1c6134

# Diff at Tue, 30 Jul 2024 11:18:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 65329557
- current block number: 65329557

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 65329557 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x41B491285A4f888F9f636cEc8a363AB9770a0AEF) {
    +++ description: None
      fieldMeta:
+        {"maxAssetId":{"description":"The highest currently registered assetID"}}
    }
```

Generated with discovered.json: 0x9996ac79e049ae42ef861d620b7595d2f125ac83

# Diff at Wed, 19 Jun 2024 09:30:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8fa0a456becead1002fbe41b5a2a1fee09a9dcd2 block: 64646015
- current block number: 65329557

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 64646015 (main branch discovery), not current.

```diff
    contract TokenMessaging (0x41B491285A4f888F9f636cEc8a363AB9770a0AEF) {
    +++ description: None
      values.oAppVersion:
-        [1,2]
+        {"senderVersion":1,"receiverVersion":2}
    }
```

```diff
    contract StargatePool (0x4c1d3Fc3fC3c177c3b633427c2F769276c547463) {
    +++ description: None
      values.getAddressConfig:
-        ["0x2BC3141AaeA1d84bcd557EeB543253fd9685c0C4","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","0x4141Eb977a8646EC60C4c2891AEA645118183221","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x2BC3141AaeA1d84bcd557EeB543253fd9685c0C4","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","tokenMessaging":"0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","creditMessaging":"0x4141Eb977a8646EC60C4c2891AEA645118183221","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolUSDC (0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC) {
    +++ description: None
      values.getAddressConfig:
-        ["0x288968ffF40543F168eAf29A54D5C0affD3C8df7","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","0x4141Eb977a8646EC60C4c2891AEA645118183221","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x288968ffF40543F168eAf29A54D5C0affD3C8df7","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","tokenMessaging":"0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","creditMessaging":"0x4141Eb977a8646EC60C4c2891AEA645118183221","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePoolMigratable (0xB715B85682B731dB9D5063187C450095c91C57FC) {
    +++ description: None
      values.getAddressConfig:
-        ["0xa81274AFac523D639DbcA2C32c1470f1600cCEBe","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","0x4141Eb977a8646EC60C4c2891AEA645118183221","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0xa81274AFac523D639DbcA2C32c1470f1600cCEBe","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","tokenMessaging":"0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","creditMessaging":"0x4141Eb977a8646EC60C4c2891AEA645118183221","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

```diff
    contract StargatePool (0xF7628d84a2BbD9bb9c8E686AC95BB5d55169F3F1) {
    +++ description: None
      values.getAddressConfig:
-        ["0x6eC3EfD27d8b1070Fe96910EF416D54e845045c9","0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","0x4141Eb977a8646EC60C4c2891AEA645118183221","0x0000000000000000000000000000000000000000"]
+        {"feeLib":"0x6eC3EfD27d8b1070Fe96910EF416D54e845045c9","planner":"0xe37f7c80ceD04c4F243C0Fd04A5510D663CB88b5","treasurer":"0x4e8c9BaC25CEF251352aCe831270D564615b9Ce1","tokenMessaging":"0x41B491285A4f888F9f636cEc8a363AB9770a0AEF","creditMessaging":"0x4141Eb977a8646EC60C4c2891AEA645118183221","lzToken":"0x0000000000000000000000000000000000000000"}
      values.oftVersion:
-        ["0x02e49c2c",0]
+        {"interfaceId":"0x02e49c2c","version":0}
    }
```

Generated with discovered.json: 0x97b6549384fa3b1b33c125c5d02a500528217c74

# Diff at Mon, 03 Jun 2024 13:45:28 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 64646015

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenMessaging (0x41B491285A4f888F9f636cEc8a363AB9770a0AEF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0x4c1d3Fc3fC3c177c3b633427c2F769276c547463)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolUSDC (0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePoolMigratable (0xB715B85682B731dB9D5063187C450095c91C57FC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StargatePool (0xF7628d84a2BbD9bb9c8E686AC95BB5d55169F3F1)
    +++ description: None
```
