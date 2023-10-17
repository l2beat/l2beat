# Diff at Tue, 17 Oct 2023 12:53:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@51e09b406b3616ef251dd9e0b82a634022f2f662

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract L1MessageQueue (0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B) {
      implementations:
+        ["0xBC9D741501A20F962756C95BF906b4abffadcf8F"]
    }
```

```diff
    contract Fallback (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
      name:
-        "Fallback"
+        "L2TokenFactoryFallback"
      derivedName:
+        "Fallback"
    }
```

```diff
    contract L1ScrollMessenger (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367) {
      implementations:
+        ["0xAf2F898a8680cb52766ABE0588ebe6b9bFe37845"]
    }
```

```diff
    contract Fallback (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
      name:
-        "Fallback"
+        "L2ETHGatewayFallback"
      derivedName:
+        "Fallback"
    }
```

```diff
    contract Fallback (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
      name:
-        "Fallback"
+        "L2ScrollMessengerFallback"
      derivedName:
+        "Fallback"
    }
```

```diff
    contract ScrollOwner (0x798576400F7D662961BA15C6b3F3d813447a26a6) {
      values.accessControl:
+        {"roles":{"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x1A658B88fD0a3c82fa1a0609fCDbD32e7dd4aB9C"]},"UPGRADER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"]},"0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"]},"0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x0e58939204eEDa84F796FBc86840A50af10eC4F4"]},"0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xDC1d1189Da69Ae2016E4976A43De20972D349B1b"]}},"targets":{"0xEB803eb3F501998126bf37bB823646Ed3D59d072":{"upgrade(address,address)":["UPGRADER_ROLE"],"upgradeAndCall(address,address,bytes)":["UPGRADER_ROLE"]},"0xa13BAF47339d63B743e7Da8741db5456DAc1E556":{"revertBatch(bytes,uint256)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"],"removeSequencer(address)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"],"removeProver(address)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"],"setPause(bool)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"],"addSequencer(address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"],"addProver(address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"],"updateMaxNumTxInChunk(uint256)":["0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35"]},"0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B":{"updateGasOracle(address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"],"updateMaxGasLimit(uint256)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367":{"setPause(bool)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"],"updateMaxReplayTimes(uint256)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0x987e300fDfb06093859358522a79098848C33852":{"setIntrinsicParams(uint64,uint64,uint64,uint64)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"]},"0x259204DDd2bA29bD9b1B9A5c9B093f73d7EAcf37":{"updateWhitelistStatus(address[],bool)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0xA2Ab526e5C5491F10FC05A55F064BF9F7CEf32a0":{"updateVerifier(uint64,address)":["UPGRADER_ROLE","0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35"]},"0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6":{"setERC20Gateway(address[],address[])":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0xb2b10a289A229415a124EFDeF310C10cb004B6ff":{"updateTokenMapping(address,address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B":{"updateTokenMapping(address,address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6":{"updateTokenMapping(address,address)":["0x7073af4b167920283f68deceb22f52cc6f5d834eeb5d5ba612c774b2bcfa0d79"]},"0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B":{"updateCircleCaller(address)":["0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35"],"pauseDeposit(bool)":["0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35"],"pauseWithdraw(bool)":["0x7101c64e1cfe9c2a867a931776e9ff5db14162149d7281b6372f94dcc3fcef35"]},"0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d":{"setPause(bool)":["0x357f58d6582a9aad552073fb90e586033d651a1117d026182f09ca03868d3e85","0x640b21f88436d06e77efa2750ca42147d57f927008d06e80d75923e2e22cf761"]}}}
      derivedName:
+        "ScrollOwner"
    }
```

```diff
    contract L1ETHGateway (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905) {
      implementations:
+        ["0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d"]
    }
```

```diff
    contract GnosisSafe (0x8FA3b4570B4C96f8036C13b64971BA65867eEB48) {
      name:
-        "GnosisSafe"
+        "FeeVaultMultisig"
      implementations:
+        ["0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"]
      derivedName:
+        "GnosisSafe"
    }
```

```diff
    contract L2GasPriceOracle (0x987e300fDfb06093859358522a79098848C33852) {
      implementations:
+        ["0xfDF1eE0098168eaa61BF87Db68C39c85151a4E9E"]
    }
```

```diff
    contract ScrollChain (0xa13BAF47339d63B743e7Da8741db5456DAc1E556) {
      values.provers:
+        ["0x356483dC32B004f32Ea0Ce58F7F88879886e9074","0x69d79Fc4Ae89E4DA80D719e26a435621F75B7f06"]
      values.sequencers:
+        ["0xcF2898225ED05Be911D3709d9417e86E0b4Cfc8f","0x2ce8B4A516ebBc8B425764a867B742F76C2244c7"]
      implementations:
+        ["0x2E07f0FBA71709bb5e1f045b02152E45B451D75f"]
    }
```

```diff
    contract Fallback (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
      name:
-        "Fallback"
+        "L2TokenImplementationFallback"
      derivedName:
+        "Fallback"
    }
```

```diff
    contract L1StandardERC20Gateway (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9) {
      implementations:
+        ["0x9218732389D80f9b8723C3f32a38865B7a63564A"]
    }
```

```diff
    contract L1GatewayRouter (0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6) {
      implementations:
+        ["0xb93Ac04010Bd61F45BF492022A5b49a902F798F3"]
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
    contract InstantMultisig (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    }
```

```diff
+   Status: CREATED
    contract TimelockController (0xDC1d1189Da69Ae2016E4976A43De20972D349B1b) {
    }
```

```diff
+   Status: CREATED
    contract ProposerMultisig (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    }
```

# Diff at Thu, 12 Oct 2023 12:22:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@

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
