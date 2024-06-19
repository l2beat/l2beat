Generated with discovered.json: 0x33e14fd8a1aefb17efe3ea2501384663102f12e7

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
