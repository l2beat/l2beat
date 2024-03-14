Generated with discovered.json: 0xb0b6ecabe9b24b41963f90909c5038c5e4c06888

# Diff at Wed, 13 Mar 2024 15:08:26 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8ded78dbad1caa69ad22c20ef413872cafeb6a2f block: 19425552
- current block number: 19426942

## Description

One Eigenlayer Operations Multisig signer is removed. This leaves the multisig at the 3/6 threshold, as per Eigenlayer docs.

## Watched changes

```diff
    contract StrategyAdderMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      values.getOwners[6]:
-        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.5:
-        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
    }
```

Generated with discovered.json: 0x387c23ea428e460f5385d4e061c45b5803b0e48c

# Diff at Wed, 13 Mar 2024 10:28:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@5f8229a0d203f1ab563faeb4f951a6cc4a12068c block: 19418224
- current block number: 19425552

## Description

Three new signers are added to the Eigenlayer Operations Multisig.
Only one is actually removed so far, so the multisig is currently 3/7.
Eigenlayer docs reference this multisig as 3/6.

## Watched changes

```diff
    contract StrategyAdderMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      values.getOwners[6]:
+        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
      values.getOwners[5]:
+        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.4:
-        "0xe7fFd467F7526abf9c8796EDeE0AD30110419127"
+        "0xeD7Ef087d1C01ecCA9a9688a44aaeDDEf4ea560E"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.3:
-        "0x7e0b47E52b567fB6717f8ACAeD3F4591759F22fF"
+        "0x422e2F724faFE75F3635458aD7D3Ac803DCD7ff1"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.2:
-        "0xeD7Ef087d1C01ecCA9a9688a44aaeDDEf4ea560E"
+        "0x27ff193A6A1574A611E21c39FDA636fA1d61ba30"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.1:
-        "0x422e2F724faFE75F3635458aD7D3Ac803DCD7ff1"
+        "0xb7Ae34BB33da55f12797e793E01e63a17B11d108"
+++ description: Array of multisig signers
+++ type: PERMISSION
+++ severity: MEDIUM
      values.getOwners.0:
-        "0xe479a0839F13117f42142AD6cE71B49a97c1c928"
+        "0xa2425B00F9A9457AEdd51d4C36d9917eA1Aa7a02"
    }
```

Generated with discovered.json: 0x7e752b312976dbd0b9a0d36ec7ec6aba97d5a5ed

# Diff at Tue, 12 Mar 2024 09:54:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b31b4cc06f0d914e438132f7f1fac02623f5d180 block: 19033739
- current block number: 19418224

## Description

All deposit caps for the 12 supported liquid staking tokens are increased to the maximum value on Feb 5th 2024.

## Watched changes

```diff
    contract swETH-Strategy (0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract ankrETH-Strategy (0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract rETH-Strategy (0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract METH-Strategy (0x298aFB19A105D59E74658C4C334Ff360BadE6dd2) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract cbETH-Strategy (0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract osETH-Strategy (0x57ba429517c3473B6d34CA9aCd56c0e735b94c02) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract wBETH-Strategy (0x7CA911E83dabf90C90dD3De5411a10F1A6112184) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract sfrxETH-Strategy (0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract stETH-Strategy (0x93c4b944D05dfe6df7645A86cd2206016c51564D) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract ETHx-Strategy (0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract OETH-Strategy (0xa4C637e0F704745D182e4D38cAb7E7485321d059) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

```diff
    contract RiverV1-Strategy (0xAe60d8180437b5C34bB956822ac2710972584473) {
    +++ description: None
      values.getTVLLimits.1:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getTVLLimits.0:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxPerDeposit:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.maxTotalDeposits:
-        "200000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

Generated with discovered.json: 0x5ba0aee464a1a3009c8ec05ef3059665fe93da42

# Diff at Thu, 18 Jan 2024 12:26:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d613299eac1f45b1c81fd947b8300beb800ba170 block: 18992027
- current block number: 19033739

## Description

Added three new strategies.
Named three present multisigs and ignored their nonce in watch mode.

## Watched changes

```diff
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
      values.strategies[11]:
+        "0x298aFB19A105D59E74658C4C334Ff360BadE6dd2"
      values.strategies[10]:
+        "0xAe60d8180437b5C34bB956822ac2710972584473"
      values.strategies[9]:
+        "0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6"
    }
```

```diff
+   Status: CREATED
    contract METH-Strategy (0x298aFB19A105D59E74658C4C334Ff360BadE6dd2) {
    }
```

```diff
+   Status: CREATED
    contract sfrxETH-Strategy (0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6) {
    }
```

```diff
+   Status: CREATED
    contract RiverV1-Strategy (0xAe60d8180437b5C34bB956822ac2710972584473) {
    }
```

## Source code changes

```diff
.../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/METH-Strategy/implementation/meta.txt    |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/METH-Strategy/proxy/meta.txt    |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/METH-Strategy/proxy/proxy/Proxy.sol      |  86 +++++++
 .../METH-Strategy/proxy/proxy/beacon/IBeacon.sol   |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/METH-Strategy/proxy/utils/Address.sol    | 222 ++++++++++++++++
 .../METH-Strategy/proxy/utils/StorageSlot.sol      |  88 +++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/RiverV1-Strategy/implementation/meta.txt |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/RiverV1-Strategy/proxy/meta.txt |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/RiverV1-Strategy/proxy/proxy/Proxy.sol   |  86 +++++++
 .../proxy/proxy/beacon/IBeacon.sol                 |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/RiverV1-Strategy/proxy/utils/Address.sol | 222 ++++++++++++++++
 .../RiverV1-Strategy/proxy/utils/StorageSlot.sol   |  88 +++++++
 .../contracts/token/ERC20/IERC20.sol               |  82 ++++++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |  60 +++++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 116 +++++++++
 .../contracts/utils/Address.sol                    | 222 ++++++++++++++++
 .../contracts/proxy/utils/Initializable.sol        | 138 ++++++++++
 .../contracts/utils/AddressUpgradeable.sol         | 195 ++++++++++++++
 .../.code/sfrxETH-Strategy/implementation/meta.txt |   2 +
 .../contracts/interfaces/IDelegationManager.sol    |  81 ++++++
 .../src/contracts/interfaces/IDelegationTerms.sol  |  26 ++
 .../src/contracts/interfaces/IPausable.sol         |  56 ++++
 .../src/contracts/interfaces/IPauserRegistry.sol   |  15 ++
 .../src/contracts/interfaces/ISlasher.sol          | 139 ++++++++++
 .../src/contracts/interfaces/IStrategy.sol         |  89 +++++++
 .../src/contracts/interfaces/IStrategyManager.sol  | 257 +++++++++++++++++++
 .../src/contracts/permissions/Pausable.sol         | 139 ++++++++++
 .../src/contracts/strategies/StrategyBase.sol      | 283 +++++++++++++++++++++
 .../contracts/strategies/StrategyBaseTVLLimits.sol |  84 ++++++
 .../proxy/interfaces/draft-IERC1822.sol            |  20 ++
 .../ethereum/.code/sfrxETH-Strategy/proxy/meta.txt |   2 +
 .../proxy/proxy/ERC1967/ERC1967Proxy.sol           |  32 +++
 .../proxy/proxy/ERC1967/ERC1967Upgrade.sol         | 185 ++++++++++++++
 .../.code/sfrxETH-Strategy/proxy/proxy/Proxy.sol   |  86 +++++++
 .../proxy/proxy/beacon/IBeacon.sol                 |  16 ++
 .../transparent/TransparentUpgradeableProxy.sol    | 124 +++++++++
 .../.code/sfrxETH-Strategy/proxy/utils/Address.sol | 222 ++++++++++++++++
 .../sfrxETH-Strategy/proxy/utils/StorageSlot.sol   |  88 +++++++
 78 files changed, 8277 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18992027 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
      name:
-        "GnosisSafe"
+        "EigenlayerProxiedMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
      name:
-        "GnosisSafe"
+        "StrategyAdderMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

```diff
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598) {
      name:
-        "GnosisSafe"
+        "EigenlayerMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Fri, 12 Jan 2024 16:33:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bd17b9c403f8c2dc9783e9604ccb1874d7f77cb5 block: 18940531
- current block number: 18992027

## Description

The number of EigenPods (contracts, to which validators’ withdrawal credentials point, and where consensus layer rewards accrue) have increased. Changes in the DepositContract deposits.
All these values are now ignored in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18940531 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
      derivedName:
+        "DepositContract"
    }
```

```diff
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338) {
      derivedName:
+        "EigenPodManager"
    }
```

# Diff at Fri, 05 Jan 2024 10:39:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@

## Description

Initial discovery.

## Watched changes

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    }
```

```diff
+   Status: CREATED
    contract PauserRegistry (0x0c431C66F4dE941d089625E5B423D00707977060) {
    }
```

```diff
+   Status: CREATED
    contract swETH-Strategy (0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6) {
    }
```

```diff
+   Status: CREATED
    contract ankrETH-Strategy (0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff) {
    }
```

```diff
+   Status: CREATED
    contract rETH-Strategy (0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
    }
```

```diff
+   Status: CREATED
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) {
    }
```

```diff
+   Status: CREATED
    contract cbETH-Strategy (0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc) {
    }
```

```diff
+   Status: CREATED
    contract osETH-Strategy (0x57ba429517c3473B6d34CA9aCd56c0e735b94c02) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073) {
    }
```

```diff
+   Status: CREATED
    contract EigenPod (0x5c86e9609fbBc1B754D0FD5a4963Fdf0F5b99dA7) {
    }
```

```diff
+   Status: CREATED
    contract wBETH-Strategy (0x7CA911E83dabf90C90dD3De5411a10F1A6112184) {
    }
```

```diff
+   Status: CREATED
    contract DelayedWithdrawalRouter (0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8) {
    }
```

```diff
+   Status: CREATED
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444) {
    }
```

```diff
+   Status: CREATED
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338) {
    }
```

```diff
+   Status: CREATED
    contract stETH-Strategy (0x93c4b944D05dfe6df7645A86cd2206016c51564D) {
    }
```

```diff
+   Status: CREATED
    contract ETHx-Strategy (0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d) {
    }
```

```diff
+   Status: CREATED
    contract OETH-Strategy (0xa4C637e0F704745D182e4D38cAb7E7485321d059) {
    }
```

```diff
+   Status: CREATED
    contract Timelock (0xA6Db1A8C5a981d1536266D2a393c5F8dDb210EAF) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    }
```

```diff
+   Status: CREATED
    contract Slasher (0xD92145c07f8Ed1D392c1B88017934E301CC1c3Cd) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEA47018D632A77bA579846c840d5706705Dc598) {
    }
```
