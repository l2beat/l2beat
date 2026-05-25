Generated with discovered.json: 0xab6a0a1e21f7e956341a339a6da88ac70abf3785

# Diff at Fri, 08 May 2026 07:51:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1772444704
- current timestamp: 1772444704

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772444704 (main branch discovery), not current.

```diff
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xffdc4806ed0369d49b542adf6eb3b3572e0f76d44bda8f0a093467ebcbe225df"
+        "0x95c8f32b71b3ba2e4e4c48e52b11aa494dbb8156eb0e215e8798e7553d908443"
    }
```

```diff
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xe65732e356e64373f949ce1e543c2af7a89f91a8e3e8337cf9b83a3cd6ae9082"
+        "0x59e958a0783ea169acb1f9451299a6eeecdfa1db1257cafe5c948a919117c2fc"
      sourceHashes.1:
-        "0x5247a49385cad8b341a34b9f96cde901c1b9567eeb27372b65747f673832df87"
+        "0xc1a528b419310a96bdf3cdd6e8c3ae0ca76414a6c47559e9b39381cae14fbe12"
    }
```

```diff
    contract AxelarGasServiceOperators (eth:0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xa898c8df7706ef8117978fb0d8653aea9d509fa5e96475894390689c93b28187"
+        "0xb7a1d1b798ea06589c7172be7ba35a47d4e64bf669512f8c830aeddc93c27eae"
    }
```

```diff
    contract TokenDeployer (eth:0xb28478319B64f8D47e19A120209A211D902F8b8f) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xb697944037f1be572b23ca3eabbb455b59abdb05b45851313635da227ccc52c3"
+        "0xd01c3b8c2f10c224a3cad35f91603dd3154438007a3eb3a4f8f5184227f1dfce"
    }
```

```diff
    contract Multisig (eth:0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xfca353778b820ad49261c7887cf13ab259a89edab86eef4aeb90e1b2b2a948f5"
+        "0x80123352625b46aa543422c429276ccf317b2fbbf7ea655e4acefb180f0e082b"
    }
```

```diff
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xc6735e0060a5046f6ed1ea96805049e3e5167271060aa505f72fbade315a82cb"
+        "0xee03b56a88920196c80cc32ba30231a916077f614bd963ad27da949e04c5a253"
    }
```

```diff
    contract InterchainGovernance (eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x36106df3599f7c698c4c70652810248df4da03bd579b99553e2852b368632ff6"
+        "0xcca8350613357397a59035f61d95ca848eed0c5b1d1d4e863e307af34107bc24"
    }
```

Generated with discovered.json: 0xa0c31b38947e35eeae924081ad7c7b1b3c67f6c5

# Diff at Tue, 05 May 2026 10:21:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1772444704
- current timestamp: 1772444704

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772444704 (main branch discovery), not current.

```diff
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

```diff
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    +++ description: None
      deployerAddress:
+        "eth:0xA57ADCE1d2fE72949E4308867D894CD7E7DE0ef2"
    }
```

```diff
    contract AxelarGasServiceOperators (eth:0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

```diff
    contract TokenDeployer (eth:0xb28478319B64f8D47e19A120209A211D902F8b8f) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

```diff
    contract Multisig (eth:0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

```diff
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

```diff
    contract InterchainGovernance (eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) {
    +++ description: None
      deployerAddress:
+        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

Generated with discovered.json: 0xf5d06d94cfa8c3f6da273e9c8aa7e55c4241d7d4

# Diff at Mon, 02 Mar 2026 09:46:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772444704

## Description

move to baseproj.

## Initial discovery

```diff
+   Status: CREATED
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarGasServiceOperators (eth:0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenDeployer (eth:0xb28478319B64f8D47e19A120209A211D902F8b8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (eth:0xCC940AE49C78F20E3F13F3cF37e996b98Ac3EC68)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InterchainGovernance (eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66)
    +++ description: None
```
