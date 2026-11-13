Generated with discovered.json: 0xe228afcec719de4f294ef0e3ef1d5cab72c527fd

# Diff at Fri, 13 Nov 2026 13:03:53 GMT:

- id: 0a877c1c
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ced572b97485e6dc1fc02f958ee2a731593430e block: 1781603706
- current timestamp: 1794569221

## Description

AxelarServiceGovernance upgraded the Gateway: https://disco.l2beat.com/diff/eth:0x99B5FA03a5ea4315725c43346e55a6A6fbd94098/eth:0x16C22cbDD77350b1AC88AdDA344F691c12f41960
- New pauser role, held by the EOA eth:0x72164D4448fe6cfA472946feDC71e83b4628B1aF. It or governance can pause the Gateway without the governance timelock, and the pauser can transfer its role. A pause stops callContract, callContractWithToken and the use of approved contract calls, except by governance. Signed commands, mints included, still execute.
- sendToken is removed.
- The Gateway uses a new AxelarAuthWeighted: https://disco.l2beat.com/diff/eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0/eth:0x3d3C73E91B1b0C243f1437F2d8363b1D5B093BD0. It hashes an operator set from its canonical ABI encoding instead of the raw command bytes. Its deployer seeded the old module's last 15 operator sets (epochs 1093-1107) and then handed ownership to the Gateway. Later sets arrive through signed commands as before.

Config: the AxelarAuthWeighted name and overrides follow the new address.

## Watched changes

```diff
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5) [N/A] {
    +++ description: None
      sourceHashes.1:
-        "0xc1a528b419310a96bdf3cdd6e8c3ae0ca76414a6c47559e9b39381cae14fbe12"
+        "0xce0f50f9511a7175bf9206e9246ddb0df93d584c77cabcae67b1542245f7ae7c"
      values.$implementation:
-        "eth:0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"
+        "eth:0x16C22cbDD77350b1AC88AdDA344F691c12f41960"
      values.$pastUpgrades.9:
+        ["2026-11-12T00:07:35.000Z","0x412a5698beb96a03e4927b8cbedf35e3399699e0312a9d3b2bbaeab4dc1fd169",["eth:0x16C22cbDD77350b1AC88AdDA344F691c12f41960"]]
      values.$upgradeCount:
-        9
+        10
      values.authModule:
-        "eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0"
+        "eth:0x3d3C73E91B1b0C243f1437F2d8363b1D5B093BD0"
      values.implementation:
-        "eth:0x99B5FA03a5ea4315725c43346e55a6A6fbd94098"
+        "eth:0x16C22cbDD77350b1AC88AdDA344F691c12f41960"
      values.paused:
+        false
      values.pauser:
+        "eth:0x72164D4448fe6cfA472946feDC71e83b4628B1aF"
      implementationNames.eth:0x99B5FA03a5ea4315725c43346e55a6A6fbd94098:
-        "AxelarGateway"
      implementationNames.eth:0x16C22cbDD77350b1AC88AdDA344F691c12f41960:
+        "AxelarGateway"
    }
```

```diff
-   Status: DELETED
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarAuthWeighted (eth:0x3d3C73E91B1b0C243f1437F2d8363b1D5B093BD0) [N/A]
    +++ description: None
```

## Source code changes

```diff
.../AxelarAuthWeighted.sol                         |   2 +-
 .../Gateway/AxelarGateway.sol                      | 196 +++++++++++++++++----
 2 files changed, 160 insertions(+), 38 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781603706 (main branch discovery), not current.

```diff
    contract AxelarAuthWeighted (eth:0xE3B83f79Fbf01B25659f8A814945aB82186A8AD0) [N/A] {
    +++ description: None
      values.hashForEpoch:
+        ["0x0000000000000000000000000000000000000000000000000000000000000000","0xa9545af4fbf5c516c85ab4324400ce477accdf4e7c03348c12fc0d03421a5867","0x90384adfd86ef09c40c7d46cb5de32c3e4524d9d2114f676c7877096879a173d","0x80f74ea511b9c5a14e44303ef7885797d65b814b533eefe63061daca575bed7c","0x84b48206effa66e6f9735627a12a8a8a7ca275e06eed0800d088893c589e2096"]
      errors:
+        {"hashForEpoch":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x92dc5406e17bef5c6639a6b81251c5ee0ae176f8

# Diff at Tue, 03 Nov 2026 11:23:05 GMT:

- id: 233f9b99
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fc159c853c5f8d531c99eea56f0d0e8595b6625f block: 1781603706
- current timestamp: 1781603706

## Description

Flattener now keeps contracts whose bytecode is read with type(C).creationCode instead of turning them into interfaces. Only source hashes and flat files change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1781603706 (main branch discovery), not current.

```diff
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0x59e958a0783ea169acb1f9451299a6eeecdfa1db1257cafe5c948a919117c2fc"
+        "0x822a5c606e9714df1be7958cc596ec9a0032cdf3678cb174f99339501ec7889e"
    }
```

```diff
    contract TokenDeployer (eth:0xb28478319B64f8D47e19A120209A211D902F8b8f) [N/A] {
    +++ description: None
      sourceHashes.0:
-        "0xd01c3b8c2f10c224a3cad35f91603dd3154438007a3eb3a4f8f5184227f1dfce"
+        "0x62ca7adc02098a140101259b86b5fe3f1d85fa107cf0898cdcb86168bb300c81"
    }
```

Generated with discovered.json: 0xb0109e6b20bf088d305ae4e3d59058c27a046fb4

# Diff at Tue, 16 Jun 2026 09:56:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b8fe7ad12211d67626f7d23839b5be1f7ba15bb5 block: 1780914426
- current timestamp: 1781603706

## Description

Add new Governance contract that can verify governance decisions from the Axelar blockchain.

## Watched changes

```diff
    contract Gateway (eth:0x4F4495243837681061C4743b74B3eEdf548D56A5) [N/A] {
    +++ description: None
      values.governance:
-        "eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66"
+        "eth:0x7Acbae6CBa67d78AAf69e47000884aE00F9B2525"
    }
```

```diff
-   Status: DELETED
    contract InterchainGovernance (eth:0xfDF36A30070ea0241d69052ea85ff44Ad0476a66) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AxelarServiceGovernance (eth:0x7Acbae6CBa67d78AAf69e47000884aE00F9B2525) [N/A]
    +++ description: None
```

## Source code changes

```diff
.../AxelarServiceGovernance.sol}                   | 587 +++++++++++----------
 1 file changed, 322 insertions(+), 265 deletions(-)
```

Generated with discovered.json: 0x084d760a9e6c050ab69a64da8eb334f2500fffd7

# Diff at Fri, 12 Jun 2026 10:25:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1780914426
- current timestamp: 1780914426

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1780914426 (main branch discovery), not current.

```diff
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712) [N/A] {
    +++ description: None
      category:
+        {"name":"Non-Critical","priority":0}
    }
```

```diff
    EOA  (eth:0x72164D4448fe6cfA472946feDC71e83b4628B1aF) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

Generated with discovered.json: 0x39747d01646499d2eb3a0d8b96b4402bf322efed

# Diff at Mon, 08 Jun 2026 10:28:11 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@986b95b3ae833105f37e6f39ab1fd37448dc183a block: 1772444704
- current timestamp: 1780914426

## Description

Axelar gas service owner changed (the owner address of this contract is the microservice that pays for gas for cross-chain communication on Axelar).

Also rotated owner of the operators contract of Axelar gas service.

## Watched changes

```diff
    contract AxelarGasService (eth:0x2d5d7d31F671F86C782533cc367F14109a082712) [N/A] {
    +++ description: None
      values.$admin:
-        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
+        "eth:0x72164D4448fe6cfA472946feDC71e83b4628B1aF"
      values.owner:
-        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
+        "eth:0x72164D4448fe6cfA472946feDC71e83b4628B1aF"
    }
```

```diff
    contract AxelarGasServiceOperators (eth:0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) [N/A] {
    +++ description: None
      values.owner:
-        "eth:0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
+        "eth:0x2053E8e8c7456DE57141D1357579520dEaa8Bf9C"
    }
```

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
