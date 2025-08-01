Generated with discovered.json: 0xa1392a0645fd689d210c142f0104d43093412609

# Diff at Mon, 14 Jul 2025 12:44:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21628437
- current block number: 21628437

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract PeggedTokenBridge (0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB) {
    +++ description: None
      address:
-        "0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB"
+        "eth:0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.sigsVerifier:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      implementationNames.0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB:
-        "PeggedTokenBridge"
      implementationNames.eth:0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB:
+        "PeggedTokenBridge"
    }
```

```diff
    EOA SentinelAdmin (0x1b9dFC56e38b0F92448659C114e2347Bd803911c) {
    +++ description: None
      address:
-        "0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
+        "eth:0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
    }
```

```diff
    EOA  (0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2) {
    +++ description: None
      address:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
    }
```

```diff
    EOA  (0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9) {
    +++ description: None
      address:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
    }
```

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      address:
-        "0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
+        "eth:0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
      values.$admin:
-        "0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
+        "eth:0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
      values.$implementation:
-        "0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"
+        "eth:0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"
      values.$pastUpgrades.0.2.0:
-        "0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"
+        "eth:0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"
      values.$pastUpgrades.1.2.0:
-        "0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"
+        "eth:0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"
      values.liquidityBridge:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      values.owner:
-        "0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175"
+        "eth:0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175"
      values.pegBridge:
-        "0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB"
+        "eth:0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB"
      values.pegBridgeV2:
-        "0x52E4f244f380f8fA51816c8a10A63105dd4De084"
+        "eth:0x52E4f244f380f8fA51816c8a10A63105dd4De084"
      values.pegVault:
-        "0xB37D31b2A74029B5951a2778F959282E2D518595"
+        "eth:0xB37D31b2A74029B5951a2778F959282E2D518595"
      values.pegVaultV2:
-        "0x7510792A3B1969F9307F3845CE88e39578f2bAE1"
+        "eth:0x7510792A3B1969F9307F3845CE88e39578f2bAE1"
      values.sigsVerifier:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      implementationNames.0x4066D196A423b2b3B8B054f4F40efB47a74E200C:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8:
-        "MessageBus"
      implementationNames.eth:0x4066D196A423b2b3B8B054f4F40efB47a74E200C:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8:
+        "MessageBus"
    }
```

```diff
    EOA  (0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0) {
    +++ description: None
      address:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "eth:0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      address:
-        "0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
+        "eth:0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x520d812604E7b2ce71819FDBFE9aC40E56327F8f:
-        "ProxyAdmin"
      implementationNames.eth:0x520d812604E7b2ce71819FDBFE9aC40E56327F8f:
+        "ProxyAdmin"
    }
```

```diff
    contract PeggedTokenBridgeV2 (0x52E4f244f380f8fA51816c8a10A63105dd4De084) {
    +++ description: None
      address:
-        "0x52E4f244f380f8fA51816c8a10A63105dd4De084"
+        "eth:0x52E4f244f380f8fA51816c8a10A63105dd4De084"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.sigsVerifier:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      implementationNames.0x52E4f244f380f8fA51816c8a10A63105dd4De084:
-        "PeggedTokenBridgeV2"
      implementationNames.eth:0x52E4f244f380f8fA51816c8a10A63105dd4De084:
+        "PeggedTokenBridgeV2"
    }
```

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
    +++ description: None
      address:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      values.governors.0:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.governors.1:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.governors.2:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "eth:0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.governors.3:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.nativeWrap:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.pausers.0:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
      values.pausers.1:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.pausers.2:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
      values.pausers.3:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.pausers.4:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      implementationNames.0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820:
-        "Bridge"
      implementationNames.eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820:
+        "Bridge"
    }
```

```diff
    contract MessageBusOwner (0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175) {
    +++ description: None
      address:
-        "0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175"
+        "eth:0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175"
      values.getVoters.0.4:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
      values.getVoters.0.3:
-        "0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823"
+        "eth:0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823"
      values.getVoters.0.2:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
      values.getVoters.0.1:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.getVoters.0.0:
-        "0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
+        "eth:0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
      implementationNames.0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175:
-        "MessageBusOwner"
      implementationNames.eth:0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175:
+        "MessageBusOwner"
    }
```

```diff
    contract OriginalTokenVaultV2 (0x7510792A3B1969F9307F3845CE88e39578f2bAE1) {
    +++ description: None
      address:
-        "0x7510792A3B1969F9307F3845CE88e39578f2bAE1"
+        "eth:0x7510792A3B1969F9307F3845CE88e39578f2bAE1"
      values.nativeWrap:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.sigsVerifier:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      implementationNames.0x7510792A3B1969F9307F3845CE88e39578f2bAE1:
-        "OriginalTokenVaultV2"
      implementationNames.eth:0x7510792A3B1969F9307F3845CE88e39578f2bAE1:
+        "OriginalTokenVaultV2"
    }
```

```diff
    EOA  (0x83039377ddD862821d92d416b2DDB9EFb5BA9000) {
    +++ description: None
      address:
-        "0x83039377ddD862821d92d416b2DDB9EFb5BA9000"
+        "eth:0x83039377ddD862821d92d416b2DDB9EFb5BA9000"
    }
```

```diff
    EOA  (0x8934b5d91A33269Ad7E2202482A0dF5dDbc5D4E1) {
    +++ description: None
      address:
-        "0x8934b5d91A33269Ad7E2202482A0dF5dDbc5D4E1"
+        "eth:0x8934b5d91A33269Ad7E2202482A0dF5dDbc5D4E1"
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      address:
-        "0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
+        "eth:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      implementationNames.0x8E339115b295DeD49880eA62C1F06d1dbec3496b:
-        "ProxyAdmin"
      implementationNames.eth:0x8E339115b295DeD49880eA62C1F06d1dbec3496b:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C) {
    +++ description: None
      address:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
    }
```

```diff
    contract TransferAgent (0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b) {
    +++ description: None
      address:
-        "0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b"
+        "eth:0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      implementationNames.0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b:
-        "TransferAgent"
      implementationNames.eth:0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b:
+        "TransferAgent"
    }
```

```diff
    EOA  (0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823) {
    +++ description: None
      address:
-        "0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823"
+        "eth:0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823"
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
    +++ description: None
      address:
-        "0xB37D31b2A74029B5951a2778F959282E2D518595"
+        "eth:0xB37D31b2A74029B5951a2778F959282E2D518595"
      values.governors.0:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.governors.1:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.governors.2:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "eth:0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.governors.3:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.owner:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.pausers.0:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
      values.pausers.1:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.pausers.2:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
      values.pausers.3:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.pausers.4:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.sigsVerifier:
-        "0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
+        "eth:0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820"
      implementationNames.0xB37D31b2A74029B5951a2778F959282E2D518595:
-        "OriginalTokenVault"
      implementationNames.eth:0xB37D31b2A74029B5951a2778F959282E2D518595:
+        "OriginalTokenVault"
    }
```

```diff
    EOA  (0xDfE4F07D1F36B8d559b25082460a4f6A72531de2) {
    +++ description: None
      address:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
    }
```

```diff
    EOA  (0xE45CB56CEe56Dd1A94F7E5fBDFaa5BaFB3C053d3) {
    +++ description: None
      address:
-        "0xE45CB56CEe56Dd1A94F7E5fBDFaa5BaFB3C053d3"
+        "eth:0xE45CB56CEe56Dd1A94F7E5fBDFaa5BaFB3C053d3"
    }
```

```diff
    EOA  (0xED9fdF5B16F9F254bec5Ad389B80B48225186655) {
    +++ description: None
      address:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "eth:0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      address:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.$admin:
-        "0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
+        "eth:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
      values.$implementation:
-        "0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"
+        "eth:0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"
      values.$pastUpgrades.0.2.0:
-        "0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"
+        "eth:0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"
      values.governors.0:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "eth:0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
      values.governors.1:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.governors.2:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.governors.3:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "eth:0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.guards.0:
-        "0x83039377ddD862821d92d416b2DDB9EFb5BA9000"
+        "eth:0x83039377ddD862821d92d416b2DDB9EFb5BA9000"
      values.guards.1:
-        "0x8934b5d91A33269Ad7E2202482A0dF5dDbc5D4E1"
+        "eth:0x8934b5d91A33269Ad7E2202482A0dF5dDbc5D4E1"
      values.owner:
-        "0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
+        "eth:0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
      values.pausersPauseOnly.0:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "eth:0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
      values.pausersPauseOnly.1:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
      values.pausersPauseOnly.2:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.pausersPauseOnly.3:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.pausersPauseOnly.4:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
      values.pausersPauseOnly.5:
-        "0xE45CB56CEe56Dd1A94F7E5fBDFaa5BaFB3C053d3"
+        "eth:0xE45CB56CEe56Dd1A94F7E5fBDFaa5BaFB3C053d3"
      implementationNames.0xF140024969F6c76494a78518D9a99c8776B55f70:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0xaE41e6a597f4c65646e94E330D8BAd218Bec7896:
-        "Sentinel"
      implementationNames.eth:0xF140024969F6c76494a78518D9a99c8776B55f70:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0xaE41e6a597f4c65646e94E330D8BAd218Bec7896:
+        "Sentinel"
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      address:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
+        "eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      values.getVoters.0.5:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "eth:0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.getVoters.0.4:
-        "0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
+        "eth:0x9Ad3A3ca7d6B14E830De247c8ca3FaD9D4c9d88C"
      values.getVoters.0.3:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "eth:0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
      values.getVoters.0.2:
-        "0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
+        "eth:0xDfE4F07D1F36B8d559b25082460a4f6A72531de2"
      values.getVoters.0.1:
-        "0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
+        "eth:0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9"
      values.getVoters.0.0:
-        "0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
+        "eth:0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2"
      implementationNames.0xF380166F8490F24AF32Bf47D1aA217FBA62B6575:
-        "SimpleGovernance"
      implementationNames.eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575:
+        "SimpleGovernance"
    }
```

```diff
+   Status: CREATED
    contract PeggedTokenBridge (0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PeggedTokenBridgeV2 (0x52E4f244f380f8fA51816c8a10A63105dd4De084)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageBusOwner (0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OriginalTokenVaultV2 (0x7510792A3B1969F9307F3845CE88e39578f2bAE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TransferAgent (0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70)
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
```

```diff
+   Status: CREATED
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575)
    +++ description: None
```

Generated with discovered.json: 0xd4b45f8c094600657730f5662dde9b615a9ec81f

# Diff at Fri, 04 Jul 2025 12:18:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21628437
- current block number: 21628437

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
+        "eth:0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
+        "eth:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
      receivedPermissions.0.from:
-        "ethereum:0xF140024969F6c76494a78518D9a99c8776B55f70"
+        "eth:0xF140024969F6c76494a78518D9a99c8776B55f70"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
+        "eth:0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
    }
```

Generated with discovered.json: 0x3ea31486c0f0a7c3f44b4f925f5cbf059721c51a

# Diff at Fri, 23 May 2025 09:40:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21628437
- current block number: 21628437

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x74fb62550dbb680b6d21d7874e39501c5dfbe9a6

# Diff at Mon, 12 May 2025 13:18:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e25d362b71032c18a3417a2307d6923e1b5a519 block: 21628437
- current block number: 21628437

## Description

replace medium severity everywhere.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      fieldMeta.relaxThreshold.severity:
-        "MEDIUM"
+        "LOW"
      fieldMeta.relaxed.severity:
-        "MEDIUM"
+        "HIGH"
    }
```

Generated with discovered.json: 0xbd3004aa8ac5e43070ae7dc9395b8006bb69bae5

# Diff at Tue, 29 Apr 2025 08:19:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21628437
- current block number: 21628437

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x520d812604E7b2ce71819FDBFE9aC40E56327F8f","via":[]}]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xF380166F8490F24AF32Bf47D1aA217FBA62B6575","via":[{"address":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b"}]}]
    }
```

Generated with discovered.json: 0xc6346c9a04190c17a8603e99fc626a371734e66e

# Diff at Thu, 10 Apr 2025 14:42:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21628437
- current block number: 21628437

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xb69e68f68be71a1f75b8d7493b325c3d2d37a51d

# Diff at Tue, 04 Mar 2025 10:39:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21628437
- current block number: 21628437

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract PeggedTokenBridge (0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB) {
    +++ description: None
      sinceBlock:
+        13810512
    }
```

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      sinceBlock:
+        14546010
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      sinceBlock:
+        14545993
    }
```

```diff
    contract PeggedTokenBridgeV2 (0x52E4f244f380f8fA51816c8a10A63105dd4De084) {
    +++ description: None
      sinceBlock:
+        14627208
    }
```

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
    +++ description: None
      sinceBlock:
+        13719989
    }
```

```diff
    contract MessageBusOwner (0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175) {
    +++ description: None
      sinceBlock:
+        16651238
    }
```

```diff
    contract OriginalTokenVaultV2 (0x7510792A3B1969F9307F3845CE88e39578f2bAE1) {
    +++ description: None
      sinceBlock:
+        14710499
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      sinceBlock:
+        17789313
    }
```

```diff
    contract TransferAgent (0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b) {
    +++ description: None
      sinceBlock:
+        15783099
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
    +++ description: None
      sinceBlock:
+        13808358
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      sinceBlock:
+        17860848
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      sinceBlock:
+        15075143
    }
```

Generated with discovered.json: 0x3cf7a512439af864d7771fd0bdeef5e6f30440cc

# Diff at Mon, 20 Jan 2025 11:09:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628437
- current block number: 21628437

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628437 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
      issuedPermissions.0.to:
+        "0x520d812604E7b2ce71819FDBFE9aC40E56327F8f"
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
      receivedPermissions.0.from:
+        "0x4066D196A423b2b3B8B054f4F40efB47a74E200C"
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      directlyReceivedPermissions.0.from:
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      issuedPermissions.0.target:
-        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      receivedPermissions.0.from:
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      directlyReceivedPermissions.0.target:
-        "0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
      directlyReceivedPermissions.0.from:
+        "0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
    }
```

Generated with discovered.json: 0xa2edf6d7b9184986ae89e04786b66208da83f6ba

# Diff at Wed, 15 Jan 2025 07:38:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21242135
- current block number: 21628437

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242135 (main branch discovery), not current.

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x4bb86c487f20b52caf8c229012010810a6afebe1

# Diff at Fri, 22 Nov 2024 08:40:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@292f23170122adf00047246ebc612907f3cba48f block: 20512741
- current block number: 21242135

## Description

Config related (ProxyAdmin template match).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xF140024969F6c76494a78518D9a99c8776B55f70"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xF140024969F6c76494a78518D9a99c8776B55f70"}]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      issuedPermissions.0.target:
-        "0x8E339115b295DeD49880eA62C1F06d1dbec3496b"
+        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
      issuedPermissions.0.via.0:
+        {"address":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b","delay":0}
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF140024969F6c76494a78518D9a99c8776B55f70","via":[{"address":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b"}]
    }
```

Generated with discovered.json: 0x5fcf8823c3487edd725f9763af6a44114f4a6cc1

# Diff at Mon, 21 Oct 2024 12:43:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      descriptions:
-        ["The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state."]
      description:
+        "The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state."
    }
```

Generated with discovered.json: 0x6474e88a80efc1a7467735b1d6bc35ce20856977

# Diff at Mon, 21 Oct 2024 11:05:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]
      values.$pastUpgrades.1.1:
-        ["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]
+        "0xf34b28d5a18930bf121d3c62c5c9bb273d166ae4c692337a6861dc1ab2f7af08"
      values.$pastUpgrades.0.2:
+        ["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]
      values.$pastUpgrades.0.1:
-        ["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]
+        "0x125c8e37bbbbca4ccc6887fb27a1c02e05b56012a3d98ea3adac46531bf045c9"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$pastUpgrades.0.2:
+        ["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]
      values.$pastUpgrades.0.1:
-        ["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]
+        "0xdaa48a4a1a1b06b48e57b92c77cec6be8f872247c070d2bc68e859ba723f2dc9"
    }
```

Generated with discovered.json: 0xda935b498bfe310a4328d21399d910dd6873be91

# Diff at Mon, 14 Oct 2024 10:50:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract PeggedTokenBridge (0x16365b45EB269B5B5dACB34B4a15399Ec79b95eB) {
    +++ description: None
      sourceHashes:
+        ["0x3434f13a03ea3f4494cedceb0a2fe1054473c529ae3c067ba96d7102c3225852"]
    }
```

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      sourceHashes:
+        ["0x2cffb288804b4b9aa5855910610b396abe44ded0ad8ed35981ed74d056ae8ba1","0x985f30f6f1cec4239d77034618e116e07dae859f0ded01ba80f897dadb7101f3"]
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      sourceHashes:
+        ["0xeb95d39e1b35f76b6331da863f87bf2e148dd21abf5666590443b65f6a125630"]
    }
```

```diff
    contract PeggedTokenBridgeV2 (0x52E4f244f380f8fA51816c8a10A63105dd4De084) {
    +++ description: None
      sourceHashes:
+        ["0xa8ad65c174f2e76f58ba6abc073545979d712d31810b818fa4ff50bfa9cffc09"]
    }
```

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
    +++ description: None
      sourceHashes:
+        ["0x28057aec4ce9e7459369838e4a925c15a3b424afd948d070512e8a54c2870ec8"]
    }
```

```diff
    contract MessageBusOwner (0x606d8cFd3f4Ed07314F5A1F1802dd4663308b175) {
    +++ description: None
      sourceHashes:
+        ["0x208be8f798080de1d60fcd5cba233b86c43f382ace673f95ad32b633d98be2dd"]
    }
```

```diff
    contract OriginalTokenVaultV2 (0x7510792A3B1969F9307F3845CE88e39578f2bAE1) {
    +++ description: None
      sourceHashes:
+        ["0x66b162a0fe8e04147d94a9ec40e3cf9a69114ed6e3fca427cc303eeb2d223fb9"]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      sourceHashes:
+        ["0x1c9416031605fbda74b5da95a290e00995eaed2f6f6ba85ff2681131efe940a0"]
    }
```

```diff
    contract TransferAgent (0x9b274BC73940d92d0Af292Bde759cbFCCE661a0b) {
    +++ description: None
      sourceHashes:
+        ["0xa8c0aeb1e8c7671f05a401b4d5b518a38e96dc6378d59e3f2b13ea55ea9f7f9f"]
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
    +++ description: None
      sourceHashes:
+        ["0xf4773d39e3c19f28a41b1b526474a51db5a28bb3fa5ea530f6af164e5263f209"]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      sourceHashes:
+        ["0x4a43bdaa7c21f911802bc9e3457cf5fef469f43b372ea6944d53823caf2f53f2","0x03c52122def17f5a3403dd9a188a1e30bee36b86dc98fb8c07a5157ccc7da286"]
    }
```

```diff
    contract SimpleGovernance (0xF380166F8490F24AF32Bf47D1aA217FBA62B6575) {
    +++ description: None
      sourceHashes:
+        ["0xd51a863b498f5cbb3e78ed94d7e69fa4cd246b862a12894d80ec1dedad934361"]
    }
```

Generated with discovered.json: 0x53a0b030ae06797da89edce8548cf08b0cb903e5

# Diff at Tue, 01 Oct 2024 10:50:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-11-16T07:56:23.000Z",["0xbc7B0223Dd16cbc679c0D04bA3F4530D76DFbA87"]],["2022-11-22T04:01:35.000Z",["0x479ec366ae4EC016cE25B918BdEa8f78d4fa5dd8"]]]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$pastUpgrades:
+        [["2023-08-07T05:02:59.000Z",["0xaE41e6a597f4c65646e94E330D8BAd218Bec7896"]]]
    }
```

Generated with discovered.json: 0xa0391cdc9ca1b6e68870eb0b79bef240ceb6f71f

# Diff at Fri, 30 Aug 2024 07:51:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x8aff8b25a5cb707543d3efd34ba03c2851382a77

# Diff at Fri, 23 Aug 2024 09:51:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xeaa2970aabb1cefc8c82dc859a6fc9ebac12bd8e

# Diff at Wed, 21 Aug 2024 10:02:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20512741
- current block number: 20512741

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20512741 (main branch discovery), not current.

```diff
    contract MessageBus (0x4066D196A423b2b3B8B054f4F40efB47a74E200C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x520d812604E7b2ce71819FDBFE9aC40E56327F8f","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4066D196A423b2b3B8B054f4F40efB47a74E200C","via":[]}]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF140024969F6c76494a78518D9a99c8776B55f70"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF140024969F6c76494a78518D9a99c8776B55f70","via":[]}]
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8E339115b295DeD49880eA62C1F06d1dbec3496b","via":[]}]
    }
```

Generated with discovered.json: 0x494b122c9ae1fdf5d29f87d59e7d30e0e4e2c2fe

# Diff at Mon, 12 Aug 2024 13:10:57 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20331848
- current block number: 20512741

## Description

cBridge bridge contracts were paused for a couple minutes, the guards were set to a 'relaxed' state before the bridge was unpaused again.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        0
+        2
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x05aa959093f9614cbf4724ee062b9db6fe434070

# Diff at Fri, 09 Aug 2024 10:09:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20331848
- current block number: 20331848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331848 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x520d812604E7b2ce71819FDBFE9aC40E56327F8f) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]
      assignedPermissions.upgrade:
+        ["0x4066D196A423b2b3B8B054f4F40efB47a74E200C"]
    }
```

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF140024969F6c76494a78518D9a99c8776B55f70"]
      assignedPermissions.upgrade:
+        ["0xF140024969F6c76494a78518D9a99c8776B55f70"]
    }
```

Generated with discovered.json: 0x01d6f87c761817ffb94b950acac1fbcaff902d90

# Diff at Tue, 30 Jul 2024 11:11:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20331848
- current block number: 20331848

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20331848 (main branch discovery), not current.

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
      fieldMeta:
+        {"numRelaxedGuards":{"description":"Number of relaxed guards in the Sentinel."},"relaxThreshold":{"severity":"MEDIUM","description":"Threshold of relaxed Guards needed to relax the Sentinel"},"relaxed":{"severity":"MEDIUM","description":"An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)"}}
    }
```

Generated with discovered.json: 0xfcb5ef95e521bb6ee3d77e539bb99b752c1789ac

# Diff at Thu, 18 Jul 2024 07:14:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14a8b2e13da16d68d776511f98207e5360accba3 block: 20310613
- current block number: 20331848

## Description

Sentinel is now unrelaxed, allowing only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.).
This is the usual state of the cbridge sentinel.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        2
+        0
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        true
+        false
    }
```

Generated with discovered.json: 0x49532ec367d0d1529fb479a74e2665248649ae36

# Diff at Mon, 15 Jul 2024 08:08:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 19724145
- current block number: 20310613

## Description

The bridge was paused for ~30min and is now unpaused again.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        0
+        2
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x122fee3f73f523b9988a98dc4b8f0c68747b3159

# Diff at Wed, 24 Apr 2024 08:48:18 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@64cf04758a7da5aaed34239f1c6d1672c16260ad block: 19704406
- current block number: 19724145

## Description

The Sentinel is unrelaxed due to Two Sentinel-Guards being in the unrelaxed state. This restricts what the Sentinel-Governors can change in the bridge contracts in the Sentinel's name.
No changes in the Bridge parameters.

## Watched changes

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: The Sentinel is itself a Governor and Pauser in the bridge contracts. It allows additional Sentinel-Governors to make changes in its name that can be restricted by Guards changing the Sentinel's relaxed state.
+++ description: Number of relaxed guards in the Sentinel.
      values.numRelaxedGuards:
-        2
+        0
+++ description: An unrelaxed Sentinel allows only parameter changes in the Bridge that would make it more secure (decrease limits, increase delay period etc.)
+++ severity: MEDIUM
      values.relaxed:
-        true
+        false
    }
```

Generated with discovered.json: 0xd8d108b7b19308cda326d243fc41e4d24ae821a2

# Diff at Sat, 20 Apr 2024 19:31:25 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19432769
- current block number: 19698726

## Description

Cbridge bridge contracts were paused for a few minutes and the guards are set to a 'relaxed' state before the bridges are unpaused again.

The Sentinel ProxyAdmin owner was changes from 'Celer Network: Deployer 2' to the CelerBridge Governance contract 'SimpleGovernance' called 'Bridge Governance (2)' on our website. Since the SimpleGovernance contract has a higher threshold than the deployer EOA, and additional Governance logic, this is an increase in security.

## Watched changes

```diff
    contract SentinelProxyAdmin (0x8E339115b295DeD49880eA62C1F06d1dbec3496b) {
    +++ description: None
      values.owner:
-        "0x1b9dFC56e38b0F92448659C114e2347Bd803911c"
+        "0xF380166F8490F24AF32Bf47D1aA217FBA62B6575"
    }
```

```diff
    contract Sentinel (0xF140024969F6c76494a78518D9a99c8776B55f70) {
    +++ description: None
      values.numRelaxedGuards:
-        0
+        2
      values.relaxed:
-        false
+        true
    }
```

Generated with discovered.json: 0x89e2c6f3a52098ecf1bd3a54070b9d191b7eeb26

# Diff at Mon, 19 Feb 2024 15:53:32 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@308930b4cc7f93870a161e88abb1361d44caae90 block: 18163828
- current block number: 19262793

## Description

One address is removed from the Liquidity Network governors and pausers, and the OriginalTokenVault governors and pausers.

## Watched changes

```diff
    contract Liquidity Network (0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820) {
      values.governors[4]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.3:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.2:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.pausers[5]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.pausers.4:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

```diff
    contract OriginalTokenVault (0xB37D31b2A74029B5951a2778F959282E2D518595) {
      values.governors[4]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.3:
-        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.governors.2:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0x40C11BddeB38Dec685Eed3586BAeBf086fac9dA0"
      values.pausers[5]:
-        "0xF140024969F6c76494a78518D9a99c8776B55f70"
      values.pausers.4:
-        "0xED9fdF5B16F9F254bec5Ad389B80B48225186655"
+        "0xF140024969F6c76494a78518D9a99c8776B55f70"
    }
```

Generated with discovered.json: 0x9c18f02b577e0498b3dc345045e188123051fc58
