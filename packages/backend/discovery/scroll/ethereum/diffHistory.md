Generated with discovered.json: 0xeedf768927c66f9e3e9594005bea7982654706a9

# Diff at Wed, 06 Mar 2024 09:27:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d60150e480982ada7064a8773c7df37943e92432 block: 19290165
- current block number: 19375229

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19290165 (main branch discovery), not current.

```diff
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    +++ description: None
      name:
-        "L2GasPriceOracle"
+        "OLD_L2GasPriceOracle"
    }
```

Generated with discovered.json: 0x51e6f3f4e484657baa2d2b4469fd0867d1cd86ca

# Diff at Fri, 23 Feb 2024 12:04:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@13bd721852038eaabd63b0fc897e802c663577ec block: 18832875
- current block number: 19290165

## Description

### L1CustomERC20Gateway

Use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC1155Gateway

Again, use of errors instead of reverts. Some variables are now immutable (counterpart, router, messenger).

### L1ERC721Gateway

Same changes.

### L1ETHGateway

Same changes.

### L1MessageQueue

The enforced tx gateway is now immutable and set. An L2 gas price oracle is implemented and a permissioned actor can relay the L2 base fee.

### L1ScrollMessenger

Same changes as first ones.

### L1StandardERC20Gateway

Same changes.

### L1USDCGateway

Same changes.

### L1WETHGateway

Same changes.

### ScrollChain

Same changes. In addition, the verifier is now immutable.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
      upgradeability.implementation:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      implementations.0:
-        "0xBC9D741501A20F962756C95BF906b4abffadcf8F"
+        "0xeBaed7A81c298B24EE6d59c22698A951dc448E01"
      values.enforcedTxGateway:
-        "0x0000000000000000000000000000000000000000"
+        "0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d"
      values.l2BaseFee:
+        483000000
      values.whitelistChecker:
+        "0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37"
      derivedName:
-        "L1MessageQueue"
+        "L1MessageQueueWithGasPriceOracle"
    }
```

```diff
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
      upgradeability.implementation:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
      implementations.0:
-        "0xDE3be7C2AA151D1E152DDfcBf0962FcDf5323DAe"
+        "0xd1841c5756428812233eEA78afC17cb2D3e392bb"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
      upgradeability.implementation:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
      implementations.0:
-        "0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"
+        "0x72981fD00087fF4F60aBFdE9f353cB1912A37fb6"
    }
```

```diff
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
      upgradeability.implementation:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
      implementations.0:
-        "0xd3c42158682D55E082EaBe08a29F7515A97cA307"
+        "0xa4F400593DFfc0ae02F940ab58f6e3Cc6fb9FB49"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
      upgradeability.implementation:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
      implementations.0:
-        "0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"
+        "0x546E0bF31FB6e7babD493452e4e6999191367B42"
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
      upgradeability.implementation:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
      implementations.0:
-        "0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"
+        "0xFA148514d03420b7b1a13eC74da06D2Ca875539C"
    }
```

```diff
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
      upgradeability.implementation:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
      implementations.0:
-        "0xBAd002fB13adFfcbCba57a4d4a43886f3F4C56cb"
+        "0x7F512E2E9dfC4552941D99A5b2405BBcF5781C2c"
    }
```

```diff
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
      upgradeability.implementation:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
      implementations.0:
-        "0xCb4638620E4C6DeCef26374e71b0dd4871863593"
+        "0x244BF7aEf29F03916569470a51fA0794B62F8cd7"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
      upgradeability.implementation:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
      implementations.0:
-        "0x9218732389D80f9b8723C3f32a38865B7a63564A"
+        "0x4015Fc868C06689ABEba4a9dC8FA43B804F6239c"
    }
```

```diff
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
      upgradeability.implementation:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
      implementations.0:
-        "0x6667123b5017AAB9945F73345848B82D7A953AA8"
+        "0x56ce8A8E8399f6cD5e7e4f549E8BfD673f2AfF5e"
    }
```

## Source code changes

```diff
.../L1CustomERC20Gateway/implementation/meta.txt   |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1CustomERC20Gateway.sol       |  21 +++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC1155Gateway/implementation/meta.txt       |   2 +-
 .../src/L1/gateways/L1ERC1155Gateway.sol           |   8 +-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ERC721Gateway/implementation/meta.txt        |   2 +-
 .../src/L1/gateways/L1ERC721Gateway.sol            |  11 ++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1ETHGateway/implementation/meta.txt           |   2 +-
 .../src/L1/gateways/L1ETHGateway.sol               |  22 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1MessageQueue/implementation/meta.txt         |   4 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../rollup/IL1MessageQueueWithGasPriceOracle.sol   |  38 +++++++
 .../src/L1/rollup/IL2GasPriceOracle.sol            |   6 ++
 .../src/L1/rollup/L1MessageQueue.sol               |  95 ++++++++++--------
 .../L1/rollup/L1MessageQueueWithGasPriceOracle.sol | 110 +++++++++++++++++++++
 .../src/libraries/common/IWhitelist.sol            |   9 ++
 .../L1ScrollMessenger/implementation/meta.txt      |   2 +-
 .../implementation/src/L1/L1ScrollMessenger.sol    |  64 +++++++-----
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/ScrollMessengerBase.sol          |  22 ++++-
 .../L1StandardERC20Gateway/implementation/meta.txt |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1StandardERC20Gateway.sol     |  59 +++++++----
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1USDCGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/usdc/L1USDCGateway.sol         |  31 ++++--
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../L1WETHGateway/implementation/meta.txt          |   2 +-
 .../src/L1/gateways/IL1GatewayRouter.sol           |   2 +-
 .../src/L1/gateways/L1WETHGateway.sol              |  27 ++++-
 .../src/libraries/IScrollMessenger.sol             |   7 ++
 .../src/libraries/gateway/IScrollGateway.sol       |  20 ++++
 .../src/libraries/gateway/ScrollGatewayBase.sol    |  73 +++++++++-----
 .../ScrollChain/implementation/meta.txt            |   2 +-
 .../src/L1/rollup/IL1MessageQueue.sol              |  19 +++-
 .../implementation/src/L1/rollup/IScrollChain.sol  |   7 ++
 .../implementation/src/L1/rollup/ScrollChain.sol   |  64 +++++++-----
 56 files changed, 1078 insertions(+), 317 deletions(-)
```

Generated with discovered.json: 0xc09ec1a3a28544d8f5f11512b0fbd211ceecb833

# Diff at Thu, 21 Dec 2023 07:52:36 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@10c7379d5f3774c9ebd335617097ca68ed267379

## Description

One owner is removed from ExecutorMultisig and another is added.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Mon, 18 Dec 2023 11:58:46 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@636723aa928b9ac461db31dd0b5005a916961be5

## Description

One owner is removed from EmergencyMultisig and another is added.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.4:
-        "0xd3FfEE6e6312e4303A88BD2fFaFdcA8B09310236"
+        "0xdA66Df3920091eF4B54782B9463587c314DAdD41"
    }
```

# Diff at Wed, 08 Nov 2023 15:41:27 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@a406ca5120d2111446400f9fd391e501cbd31e52

## Description

One ExecutorMultisig owner has changed.

## Watched changes

```diff
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Tue, 07 Nov 2023 07:33:37 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@6187ae3e2b0d528e37e7073fbd31c8970daac97d

## Description

New owner added to FeeVaultMultisig.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners[3]:
+        "0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.getOwners.2:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.1:
-        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.0:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

# Diff at Fri, 03 Nov 2023 07:55:41 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@ea6f863a22bc8316d333ca3f270fcd47113758cb

## Description

Two ScrollMultisig owners are changed.

## Watched changes

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.4:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
    }
```

# Diff at Tue, 31 Oct 2023 07:30:26 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@553c8048735381be48fc993e73c034e7ed45f44c

## Description

FeeVaultMultisig owner change.

## Watched changes

```diff
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      values.getOwners.1:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0x9337B41709c1C2B938Cb460ea3fA9DB586B172E0"
    }
```

# Diff at Mon, 30 Oct 2023 09:59:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@571047cc8f858ed595e25bc9512b54414c949c8e

## Description

Change of owners of Emergency MultiSig and Scroll MultiSig.

## Watched changes

```diff
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
      values.getOwners.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.getOwners.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
      values.getOwners.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "0xE2e6345baAD18f779167443Dc4886495507b3249"
    }
```

# Diff at Thu, 19 Oct 2023 08:22:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@0beeab609744b4e4247dca817daaa8caed24ab12

## Description

Added Scroll. Their AccessControl extension needed a custom handler since it also specifies which function a role can call. Fallback contracts are not being displayed on the website because they're just used to recover funds in case of a mistake.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract TimelockFast (0x0e58939204eEDa84F796FBc86840A50af10eC4F4) {
    }
```

```diff
+   Status: CREATED
    contract TimelockSlow (0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C) {
    }
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifier (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC1155GatewayFallback (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Gateway (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B) {
    }
```

```diff
+   Status: CREATED
    contract L2CustomERC20GatewayFallback (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenFactoryFallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract L2ETHGatewayFallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract L2WETHGatewayFallback (0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9) {
    }
```

```diff
+   Status: CREATED
    contract EnforcedTxGateway (0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d) {
    }
```

```diff
+   Status: CREATED
    contract L2ScrollMessengerFallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1WETHGateway (0x7AC440cAe8EB6328de4fA621163a792c1EA9D4fE) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC721GatewayFallback (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract FeeVaultMultisig (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract L1CustomERC20Gateway (0xb2b10a289A229415a124EFDeF310C10cb004B6ff) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC1155Gateway (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6) {
    }
```

```diff
+   Status: CREATED
    contract EmergencyMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    }
```

```diff
+   Status: CREATED
    contract L2TokenImplementationFallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract TimelockMid (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    }
```

```diff
+   Status: CREATED
    contract L2StandardERC20GatewayFallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract ScrollMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    }
```

```diff
+   Status: CREATED
    contract L1USDCGateway (0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```

# Diff at Thu, 12 Oct 2023 12:22:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
    }
```

```diff
+   Status: CREATED
    contract Whitelist (0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37) {
    }
```

```diff
+   Status: CREATED
    contract  (0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1) {
    }
```

```diff
+   Status: CREATED
    contract ZkEvmVerifierV1 (0x585DfaD7bF4099E011D185E266907A8ab60DAD2D) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    }
```

```diff
+   Status: CREATED
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    }
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
    }
```

```diff
+   Status: CREATED
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
    }
```

```diff
+   Status: CREATED
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
    }
```

```diff
+   Status: CREATED
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
    }
```

```diff
+   Status: CREATED
    contract MultipleVersionRollupVerifier (0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
    }
```

```diff
+   Status: CREATED
    contract Fallback (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xEB803eb3F501998126bf37bB823646Ed3D59d072) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
    }
```
