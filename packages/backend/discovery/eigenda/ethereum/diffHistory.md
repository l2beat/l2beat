Generated with discovered.json: 0xd3389b76e1701747e6d6d47573d1c9b808860970

# Diff at Thu, 08 Aug 2024 07:56:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@188cb79f5563b495dd4046c3ce9c177c6e946b32 block: 20454476
- current block number: 20482509

## Description

Added uint256 type safety to totalEjectable calculation.

## Watched changes

```diff
    contract EjectionManager (0x130d8EA0052B45554e4C99079B84df292149Bd5E) {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator.
      values.$implementation:
-        "0x1A27AC48D40F70213Ae6ec64f66852e0A1a0E6fa"
+        "0x33A517608999DF5CEfFa2b2EbA88B4461c26Af6f"
    }
```

## Source code changes

```diff
.../{.flat@20454476 => .flat}/EjectionManager/EjectionManager.sol       | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x012e5a445d7bc77ae4e992083f1a0ef924afe1ff

# Diff at Sun, 04 Aug 2024 10:05:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20382262
- current block number: 20454476

## Description

This eigenDAServiceManager implementation upgrade prepared for the ability of AVSs to reward stakers and operators. Apart from that, only formatting and abstraction changes:
- New `ServiceManagerBaseStorage` abstract contract (moved out from `ServiceManagerBase`)
- New `createAVSRewardsSubmission` function and `onlyRewardsInitiator` modifier to call it: This allows AVSs to reward stakers and operators (https://www.blog.eigenlayer.xyz/coming-soon-avs-rewards-and-eigen-programmatic-incentives/)
- `IServiceManagerUI` abstracted out of `IServiceManager`

## Watched changes

```diff
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: None
      values.$implementation:
-        "0xCDFFF07d5b8AcdAd13607615118a2e65030f5be1"
+        "0x0D2C5FD4Bb956cDD48A23fC3Ef77a768a5cDbAf7"
      values.rewardsInitiator:
+        "0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GnosisSafe/GnosisSafe.sol       | 952 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  34 +
 .../EigenDAServiceManager.sol                      | 362 ++++++--
 3 files changed, 1257 insertions(+), 91 deletions(-)
```

Generated with discovered.json: 0x63bf2f7363f3c48e38662a16ef1b0850ee65cfe0

# Diff at Tue, 30 Jul 2024 11:11:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20382262
- current block number: 20382262

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20382262 (main branch discovery), not current.

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum
      fieldMeta:
+        {"operatorSetParamsQuorum1":{"description":"0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake"},"operatorSetParamsQuorum2":{"description":"0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake"},"quorumCount":{"severity":"HIGH","description":"if quorum count changes, makes sure the new quorum parameters are tracked in the config"},"registeredOperators":{"description":"List of all registered operators ids"}}
    }
```

```diff
    contract EjectionManager (0x130d8EA0052B45554e4C99079B84df292149Bd5E) {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator.
      fieldMeta:
+        {"ejectionRateLimitWindow":{"description":"Time delta to track ejection over. Cannot eject more than ejectableStakePercent of total stake in this time delta."},"ejectableStakePercent":{"description":"Max stake to be ejectable per time delta."}}
    }
```

```diff
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: None
      fieldMeta:
+        {"BLOCK_STALE_MEASURE":{"severity":"MEDIUM","description":"This is the maximum amount of blocks in the past that the service will consider stake amounts to still be 'valid'. If a batch is signed by a certain amount of stake, it then needs to be submitted within the next BLOCK_STALE_MEASURE blocks, or the confirmBatch function will revert."},"quorumAdversaryThresholdPercentages":{"severity":"MEDIUM","description":"The maximum percentage of the stake which can be held by adversarial nodes before the availability of a blob is affected. First bytes is hex value for the first quorum, second byte is for the second quorum."},"quorumConfirmationThresholdPercentages":{"severity":"MEDIUM","description":"The minimum percentage of stake that must attest in order to consider the blob dispersal successful. First bytes is hex value for the first quorum, second byte is for the second quorum."}}
    }
```

Generated with discovered.json: 0xd2139e7ec6e7f6a8566780c760916d780e211b0d

# Diff at Thu, 25 Jul 2024 08:06:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@22ea980261775f90fcc11819837e728806ddea2b block: 20239375
- current block number: 20382262

## Description

RegistryCoordinator upgrade: two new variables lastEjectionTimestamp, and ejectionCooldown. Once ejected, operators now need to wait for the cooldown period to end before they can reregister (currently 7 days).

## Watched changes

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum
      values.$implementation:
-        "0xd3e09a0c2A9A6FDf5E92aE65D3CC090A4dF8EECF"
+        "0xdcabf0bE991d4609096CCe316df08d091356E03F"
      values.ejectionCooldown:
+        604800
    }
```

## Source code changes

```diff
.../RegistryCoordinator/RegistryCoordinator.sol    | 68 ++++++++++++++++++----
 1 file changed, 58 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x1cb8d13729ba33d6cddd0c638aca07a479a0e8bf

# Diff at Wed, 22 May 2024 14:05:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19840892
- current block number: 19925902

## Description

Registry coordinator:
    - Ejector address was changed from the EigenLayerOperationsMultisig to the EjectionManager

eigenDAServiceManager:
    - New EjectionManager contract
    - quorumNumbersRequired - second quorum (EIGEN token) now active

EjectionManager:
- used to eject validators from quorum
- permissioned, only ejectors and owner can eject operators
- operators to eject are external input provided by ejector
    Ejection spec parameters: 
        - Max 200 operators for each quorum. When the global operator cap (200) is reached for the quorum, the joining operator must have more than 1.1X the quorum weight of the current lowest-weighted operator in order to replace that operator.
        - RateLimitWindow and max EjectableStakePercent. There is a time delta (7 days) to track ejection over. SC checks that system cannot eject more than ejectableStakePercent (33.33%) of total stake in this time delta.


## Watched changes

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum
      values.ejector:
-        "0xBE1685C81aA44FF9FB319dD389addd9374383e90"
+        "0x130d8EA0052B45554e4C99079B84df292149Bd5E"
    }
```

```diff
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: None
      upgradeability.implementation:
-        "0x26089e9738b809d8308B0011B93b4225a112DB8C"
+        "0xCDFFF07d5b8AcdAd13607615118a2e65030f5be1"
      implementations.0:
-        "0x26089e9738b809d8308B0011B93b4225a112DB8C"
+        "0xCDFFF07d5b8AcdAd13607615118a2e65030f5be1"
      values.quorumNumbersRequired:
-        "0x00"
+        "0x0001"
    }
```

```diff
+   Status: CREATED
    contract EjectionManager (0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator.
```

## Source code changes

```diff
.../.flat/EjectionManager/EjectionManager.sol      | 583 +++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              | 630 +++++++++++++++++++++
 .../EigenDAServiceManager.sol                      |   2 +-
 3 files changed, 1214 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19840892 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract PauserRegistry (0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AVSDirectory (0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Slasher (0xD92145c07f8Ed1D392c1B88017934E301CC1c3Cd)
    +++ description: None
```

Generated with discovered.json: 0x4e479e1b2a0b36502a85f604c53bafd929ceeeb2

# Diff at Fri, 10 May 2024 16:41:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@16e4da28258ea850de75580ddfa72ad7e4264813 block: 19819650
- current block number: 19840892

## Description

Only implementation change is the BLOCK_STALE_MEASURE constant variable, from 150 to 300. This is the maximum amount of blocks in the past that the service will consider stake amounts to still be 'valid'. If a batch is signed by a certain amount of stake, it then needs to be submitted within the next 300 blocks, or the confirmBatch function will revert.

quorumAdversaryThresholdPercentages and quorumConfirmationThresholdPercentages are currently unused in the smart contracts. They might be called by off-chain workers.

## Watched changes

```diff
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: None
      upgradeability.implementation:
-        "0xF5fD25A90902c27068CF5eBe53Be8da693Ac899e"
+        "0x26089e9738b809d8308B0011B93b4225a112DB8C"
      implementations.0:
-        "0xF5fD25A90902c27068CF5eBe53Be8da693Ac899e"
+        "0x26089e9738b809d8308B0011B93b4225a112DB8C"
      values.BLOCK_STALE_MEASURE:
-        150
+        300
      values.quorumAdversaryThresholdPercentages:
-        "0x21"
+        "0x2121"
      values.quorumConfirmationThresholdPercentages:
-        "0x37"
+        "0x3737"
    }
```

## Source code changes

```diff
.../eigenDAServiceManager/EigenDAServiceManager.sol      | 16 +++++++++++++---
 1 file changed, 13 insertions(+), 3 deletions(-)
```

Generated with discovered.json: 0xae248316ccb53ed8a1d072efe292a56c46012859

# Diff at Tue, 07 May 2024 17:24:20 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@202b915373bcf792690ef0483d0fd8eab1b8c303 block: 19775064
- current block number: 19819650

## Description

Contracts have been moved to a shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19775064 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EigenLayerBeaconOracle (0x343907185b71aDF0eBa9567538314396aa985442)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EigenLayerExecutorMultisig (0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DelayedWithdrawalRouter (0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EigenPod (0x8bA40dA60f0827d027F029aCEE62609F0527a255)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0xA6Db1A8C5a981d1536266D2a393c5F8dDb210EAF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EigenLayerOperationsMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EigenLayerCommunityMultisig (0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```

Generated with discovered.json: 0x7a1b394dc3b63660e37fba29bfa6432ce4768fed

# Diff at Wed, 01 May 2024 11:45:46 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@acc36455c1f5f929e0ed99a6e280e868e5ad4c09 block: 19760326
- current block number: 19775064

## Description

- getRestakeableStrategies: From EL: Added bEIGEN-Strategy. This is an extended `BaseStrategy` smart contract that will be used for staking bEIGEN. (It also allows EIGEN but will unwrap it for you on deposit)

- Second quorum - Added tracking of new quorum parameters. The second quorum uses EIGEN strategy (0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7) for stake calculation in the stake registry.

## Watched changes

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum
+++ description: 0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake
      values.operatorSetParamsQuorum2.2:
-        0
+        50
+++ description: 0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake
      values.operatorSetParamsQuorum2.1:
-        0
+        11000
+++ description: 0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake
      values.operatorSetParamsQuorum2.0:
-        0
+        200
+++ description: if quorum count changes, makes sure the new quorum parameters are tracked in the config
+++ type: RISK_PARAMETER
+++ severity: HIGH
      values.quorumCount:
-        1
+        2
    }
```

```diff
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: None
      values.getRestakeableStrategies.13:
+        "0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19760326 (main branch discovery), not current.

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum
      values.operatorSetParams:
-        [200,11000,50]
+++ description: 0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake
      values.operatorSetParamsQuorum1:
+        [200,11000,50]
+++ description: 0_maxOperatorCount, 1_kickBIPsOfOperatorStake, 2_kickBIPsOfTotalStake
      values.operatorSetParamsQuorum2:
+        [0,0,0]
    }
```

Generated with discovered.json: 0x6c1f315d53c94420733788742a072d1746dfbbcb

# Diff at Mon, 29 Apr 2024 10:19:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bb2ea25728d2348708c9bfebf5b1c50078db1c65 block: 19632640
- current block number: 19760326

## Description

EigenDA exposes the address of the RegistryCoordinator while for istance EOracle does not (it's immutable constructor param). Check RC is discovered when adding new AVSes.

## Watched changes

```diff
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
    +++ description: None
      values.paused:
-        1
+        0
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19632640 (main branch discovery), not current.

```diff
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: None
      values.operatorSetParams:
+        [200,11000,50]
    }
```

```diff
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "EigenLayerExecutorMultisig"
    }
```

```diff
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "EigenLayerOperationsMultisig"
    }
```

```diff
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "EigenLayerCommunityMultisig"
    }
```

Generated with discovered.json: 0xf05c5798cc9c79512ff31687f00faf8f51d5bd1a

# Diff at Thu, 11 Apr 2024 13:21:37 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19632640

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract StakeRegistry (0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PauserRegistry (0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AVSDirectory (0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerBeaconOracle (0x343907185b71aDF0eBa9567538314396aa985442)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWithdrawalRouter (0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eigenDAProxyAdmin (0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract eigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (0x8bA40dA60f0827d027F029aCEE62609F0527a255)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xA6Db1A8C5a981d1536266D2a393c5F8dDb210EAF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract IndexRegistry (0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Slasher (0xD92145c07f8Ed1D392c1B88017934E301CC1c3Cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```
