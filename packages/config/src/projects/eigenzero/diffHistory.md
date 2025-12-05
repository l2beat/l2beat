Generated with discovered.json: 0x72179b25f2e2ff85afd3ecc722a003888fa053b3

# Diff at Mon, 01 Dec 2025 12:00:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1764579846

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x0ed6703C298d28aE0878d1b28e88cA87F9662fE9)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract PermissionController (eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5)
    +++ description: Contract that enables AVSs and operators to delegate the ability to call certain core contract functions to other addresses.
```

```diff
+   Status: CREATED
    contract EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig2 (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBase (eth:0x465094e3E031941B921bbb3fBF90AE28CD8879a7)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZeroSlasher (eth:0x54Bb392508D458Cbf1e48c59d44ffBC93f912329)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract StrategyFactory (eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647)
    +++ description: Factory contract for permissionless strategy creation via beacon proxies.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0x792FfeA0D8734695670697f8b9f03DE3F666419D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x7b0aC51037f43754275BD87446d35351f58448FE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x7F68e9C17D22005688b8E6968fCe31e32B4B03d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyManager (eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: The StrategyManager contract is responsible for managing the EigenLayer token strategies. Each EigenDA quorum has at least one strategy that defines the operators quorum stake.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPodManager (eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllocationManager (eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39)
    +++ description: Contract used to create Operator Sets, and used by Operators to register to them. The Allocation Manager tracks allocation of stake to a Operator Set, and enables AVSs to slash that stake.
```

```diff
+   Status: CREATED
    contract LayerZeroAVSRegistrar (eth:0x973b28197F3B5e591B4Eb0630AB8eb699784B3B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenStrategy (eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806)
    +++ description: Defines and stores pauser and unpauser roles for EigenLayer contracts.
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract StrategyBase (eth:0xD4d1746142642Db4c1ab17b03B9c58baac913E5B)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xf6fc3Ea6992dCC7E53D11cd65fB8CbB865dE1ccA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xfD636E8EB3839cE82A58936b795043Da7DB0c734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerCommunityMultisig (eth:0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```
