Generated with discovered.json: 0xfc59e3d4fa7cefae35aae283c188f05832d028ce

# Diff at Wed, 22 May 2024 16:03:17 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19767570
- current block number: 19926484

## Description

Total supply reduction of the PNT token after a PNT burn in [this transaction](https://dashboard.tenderly.co/tx/mainnet/0x3bba4fb6de00dd38df3ad68e51c19fe575a95a296e0632028f101c5199b6f714), which looks like a hack:

- flashloan from balancer
- used private tx relay
- unverified deployed contract used for attack
- attacker funded by and mixed to railgun
- very complicated tx, only 2 eth stolen it seems

## Watched changes

```diff
    contract PNT (0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD) {
    +++ description: None
      values.totalSupply:
-        "87975228709640845629432729"
+        "87973007722997040030171772"
    }
```

Generated with discovered.json: 0x7e4c2d53c6a581dfde5f9db818b3de1fe4e1cd1e

# Diff at Thu, 28 Mar 2024 10:34:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19375664
- current block number: 19532042

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19375664 (main branch discovery), not current.

```diff
    contract pNetwork Multisig (0xb5977b683c64fce80A1f5b587964b6f77Ee6CfDB) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x291bd7fd91be18fd4ed6c946a065b180ce88e00c

# Diff at Wed, 21 Feb 2024 08:21:41 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f247182ed17ab198e708715bad7d245c5212992d block: 19118450
- current block number: 19274813

## Description

Changes related to the inflation mechanism for the ethPNT token (introduced with previous changes below). The values below get updated for each new month/year.

## Watched changes

```diff
    contract EthPntv2 (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
      values.currentMonthNumber:
-        0
+        1
      values.currentMonthWithdrawnAmount:
-        "1100000000000000000000000"
+        "360000000000000000000000"
      values.currentYearWithdrawnAmount:
-        "1100000000000000000000000"
+        "1460000000000000000000000"
      values.maxWithdrawableAmounts.1:
-        "18255045741928169125886545"
+        "17895045741928169125886545"
      values.maxWithdrawableAmounts.0:
-        "835504574192816912588654"
+        "1575504574192816912588654"
      values.totalSupply:
-        "9900000000000000000000000"
+        "10260000000000000000000000"
    }
```

Generated with discovered.json: 0x8209f29438745b169ea4fcac0c17ac2784cf83c8

# Diff at Tue, 30 Jan 2024 09:32:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8166c01da21cd9a7fadf2664669d7d2675512e02 block: 19076850
- current block number: 19118450

## Description

In the pNetwork's DAO voting contract each new vote is counted.
That is what happened here, somebody voted and their vote was counted.
Nothing more, nothing less.
Ignored this field in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19076850 (main branch discovery), not current.

```diff
    contract DandelionVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
      name:
-        "DandelionVoting"
+        "pNetworkDAOVoting"
      derivedName:
+        "DandelionVoting"
    }
```

Generated with discovered.json: 0x29eb7fc6046fc25e5f151bc71f6086820421492f

# Diff at Fri, 19 Jan 2024 11:48:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a25b693cc3754074753705b502d4656fdd29ecbb block: 17288492
- current block number: 19040706

## Description

Update from pNetwork: https://pnetwork-association.org/periodic-updates#33cfe18be3904f8b834a461e06074b04

pNetworkToken has received an update in which controlled inflation is added.
From the blog post above I assume that the inflation is there to help finance the pNetwork V3.
The inflation has an owner and a whitelist of actors who are able to receive it.
Two caps are placed, monthly (2%) and yearly (20%), the cap can be only lowered, it can't be increased.
Max withdraw amount is calculated as `max = initialSupply * rate` for monthly and yearly caps.
In each month/year only this much can be minted and withdrawn, this gets reset for each new month/year.
To collect the owner has to call `withdrawInflation()` and specify who and how much inflation should receive.
Minting happens in that call, so if the owner does not withdraw in given month it results in zero inflation in that month.
The only whitelisted collector of inflation at the moment is the pNetwork's DAO Treasury and the owner is the DAO's voting contract.

## Watched changes

```diff
    contract EthPnt (0xf4eA6B892853413bD9d9f1a5D3a620A0ba39c5b2) {
      name:
-        "EthPnt"
+        "EthPntv2"
      upgradeability.implementation:
-        "0x8474a898677C3bc97f35A86c387aE34Bf272C860"
+        "0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"
      implementations.0:
-        "0x8474a898677C3bc97f35A86c387aE34Bf272C860"
+        "0xd88a13c72443D069Fc0d44A4989AC8dd132Ac38b"
      values.totalSupply:
-        "8800000000000000000000000"
+        "9900000000000000000000000"
      values.currentMonthNumber:
+        0
      values.currentMonthWithdrawnAmount:
+        "1100000000000000000000000"
      values.currentYearNumber:
+        0
      values.currentYearWithdrawnAmount:
+        "1100000000000000000000000"
      values.inflationOwner:
+        "0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4"
      values.isWhitelistingEnabled:
+        true
      values.maxWithdrawableAmounts:
+        ["835504574192816912588654","18255045741928169125886545"]
      values.monthlyRateCap:
+        200
      values.monthlyWithdrawableLimit:
+        "1935504574192816912588654"
      values.PNT_INIT_TOTAL_SUPPLY:
+        "96775228709640845629432729"
      values.RATE_DIVISOR:
+        10000
      values.yearlyRateCap:
+        2000
      values.yearlyWithdrawableLimit:
+        "19355045741928169125886545"
    }
```

```diff
+   Status: CREATED
    contract DandelionVoting (0x2211bFD97b1c02aE8Ac305d206e9780ba7D8BfF4) {
    }
```

```diff
+   Status: CREATED
    contract Kernel (0x2732fD9fD5F0E84B1b774cf5E6f5c812EAfd455b) {
    }
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x47d12498Ed2E9EFA9ECA2EcD05ba857253824478) {
    }
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (0xA29EF584c389c67178aE9152aC9C543f9156E2B3) {
    }
```

```diff
+   Status: CREATED
    contract TokenManager (0xD7E8E79d318eCE001B39D83Ea891ebD5fC22d254) {
    }
```

```diff
+   Status: CREATED
    contract MiniMeToken (0xe824F81cD136BB7a28480baF8d7E5f0E8E4B693E) {
    }
```

```diff
+   Status: CREATED
    contract ACL (0xFDcae423E5e92B76FE7D1e2bcabd36fca8a6a8Fe) {
    }
```

## Source code changes

```diff
.../ethereum/.code/ACL/implementation/acl/ACL.sol  |  468 +++++
 .../ACL/implementation/acl/ACLSyntaxSugar.sol      |  103 +
 .../ethereum/.code/ACL/implementation/acl/IACL.sol |   15 +
 .../.code/ACL/implementation/acl/IACLOracle.sol    |   11 +
 .../.code/ACL/implementation/apps/AppStorage.sol   |   36 +
 .../.code/ACL/implementation/apps/AragonApp.sol    |   70 +
 .../ACL/implementation/common/Autopetrified.sol    |   16 +
 .../implementation/common/EtherTokenConstant.sol   |   13 +
 .../implementation/common/IVaultRecoverable.sol    |   14 +
 .../ACL/implementation/common/Initializable.sol    |   59 +
 .../.code/ACL/implementation/common/IsContract.sol |   26 +
 .../ACL/implementation/common/Petrifiable.sol      |   25 +
 .../ACL/implementation/common/TimeHelpers.sol      |   48 +
 .../ACL/implementation/common/Uint256Helpers.sol   |   11 +
 .../implementation/common/UnstructuredStorage.sol  |   41 +
 .../ACL/implementation/common/VaultRecoverable.sol |   46 +
 .../implementation/evmscript/EVMScriptRunner.sol   |   75 +
 .../evmscript/IEVMScriptExecutor.sol               |   12 +
 .../evmscript/IEVMScriptRegistry.sol               |   25 +
 .../.code/ACL/implementation/flattened.sol         | 1203 +++++++++++
 .../.code/ACL/implementation/kernel/IKernel.sol    |   20 +
 .../ACL/implementation/kernel/KernelConstants.sol  |   30 +
 .../.code/ACL/implementation/lib/token/ERC20.sol   |   38 +
 .../ethereum/.code/ACL/implementation/meta.txt     |    2 +
 .../pNetwork/ethereum/.code/ACL/proxy/acl/IACL.sol |   16 +
 .../ethereum/.code/ACL/proxy/apps/AppProxyBase.sol |   39 +
 .../.code/ACL/proxy/apps/AppProxyUpgradeable.sol   |   33 +
 .../ethereum/.code/ACL/proxy/apps/AppStorage.sol   |   37 +
 .../.code/ACL/proxy/common/DelegateProxy.sol       |   32 +
 .../ACL/proxy/common/DepositableDelegateProxy.sol  |   45 +
 .../.code/ACL/proxy/common/DepositableStorage.sol  |   20 +
 .../.code/ACL/proxy/common/IVaultRecoverable.sol   |   17 +
 .../ethereum/.code/ACL/proxy/common/IsContract.sol |   27 +
 .../.code/ACL/proxy/common/UnstructuredStorage.sol |   42 +
 .../ethereum/.code/ACL/proxy/flattened.sol         |  392 ++++
 .../ethereum/.code/ACL/proxy/kernel/IKernel.sol    |   24 +
 .../.code/ACL/proxy/kernel/KernelConstants.sol     |   31 +
 .../ethereum/.code/ACL/proxy/lib/misc/ERCProxy.sol |   16 +
 .../pNetwork/ethereum/.code/ACL/proxy/meta.txt     |    2 +
 .../contracts/TokenManagerHook.sol                 |   83 +
 .../contracts/TimeHelpersMock.sol                  |   75 +
 .../@aragon/minime/contracts/ITokenController.sol  |   27 +
 .../@aragon/minime/contracts/MiniMeToken.sol       |  579 ++++++
 .../@aragon/os/contracts/acl/ACL.sol               |  467 +++++
 .../@aragon/os/contracts/acl/ACLSyntaxSugar.sol    |  104 +
 .../@aragon/os/contracts/acl/IACL.sol              |   14 +
 .../@aragon/os/contracts/acl/IACLOracle.sol        |   10 +
 .../@aragon/os/contracts/apps/AppProxyBase.sol     |   38 +
 .../@aragon/os/contracts/apps/AppProxyPinned.sol   |   49 +
 .../os/contracts/apps/AppProxyUpgradeable.sol      |   33 +
 .../@aragon/os/contracts/apps/AppStorage.sol       |   36 +
 .../@aragon/os/contracts/apps/AragonApp.sol        |   68 +
 .../@aragon/os/contracts/common/Autopetrified.sol  |   16 +
 .../os/contracts/common/ConversionHelpers.sol      |   30 +
 .../@aragon/os/contracts/common/DelegateProxy.sol  |   31 +
 .../contracts/common/DepositableDelegateProxy.sol  |   44 +
 .../os/contracts/common/DepositableStorage.sol     |   19 +
 .../os/contracts/common/EtherTokenConstant.sol     |   12 +
 .../@aragon/os/contracts/common/IForwarder.sol     |   18 +
 .../os/contracts/common/IVaultRecoverable.sol      |   15 +
 .../@aragon/os/contracts/common/Initializable.sol  |   59 +
 .../@aragon/os/contracts/common/IsContract.sol     |   25 +
 .../@aragon/os/contracts/common/Petrifiable.sol    |   25 +
 .../os/contracts/common/ReentrancyGuard.sol        |   33 +
 .../@aragon/os/contracts/common/SafeERC20.sol      |  169 ++
 .../@aragon/os/contracts/common/TimeHelpers.sol    |   48 +
 .../@aragon/os/contracts/common/Uint256Helpers.sol |   13 +
 .../os/contracts/common/UnstructuredStorage.sol    |   40 +
 .../os/contracts/common/VaultRecoverable.sol       |   55 +
 .../os/contracts/evmscript/EVMScriptRegistry.sol   |  110 +
 .../os/contracts/evmscript/EVMScriptRunner.sol     |  109 +
 .../os/contracts/evmscript/IEVMScriptExecutor.sol  |   11 +
 .../os/contracts/evmscript/IEVMScriptRegistry.sol  |   25 +
 .../os/contracts/evmscript/ScriptHelpers.sol       |   48 +
 .../evmscript/executors/BaseEVMScriptExecutor.sol  |   13 +
 .../contracts/evmscript/executors/CallsScript.sol  |  101 +
 .../os/contracts/factory/AppProxyFactory.sol       |   54 +
 .../@aragon/os/contracts/factory/DAOFactory.sol    |   77 +
 .../contracts/factory/EVMScriptRegistryFactory.sol |   45 +
 .../@aragon/os/contracts/kernel/IKernel.sol        |   23 +
 .../@aragon/os/contracts/kernel/Kernel.sol         |  238 +++
 .../os/contracts/kernel/KernelConstants.sol        |   29 +
 .../@aragon/os/contracts/kernel/KernelProxy.sol    |   40 +
 .../@aragon/os/contracts/kernel/KernelStorage.sol  |    8 +
 .../@aragon/os/contracts/lib/math/SafeMath.sol     |   73 +
 .../@aragon/os/contracts/lib/math/SafeMath64.sol   |   67 +
 .../@aragon/os/contracts/lib/misc/ERCProxy.sol     |   14 +
 .../@aragon/os/contracts/lib/token/ERC20.sol       |   37 +
 .../implementation/contracts/DandelionVoting.sol   |  552 +++++
 .../implementation/contracts/SigUtils.sol          |   59 +
 .../implementation/contracts/test/TestImports.sol  |   26 +
 .../contracts/test/mocks/ExecutionTarget.sol       |   17 +
 .../contracts/test/mocks/VotingMock.sol            |   29 +
 .../.code/DandelionVoting/implementation/meta.txt  |    2 +
 .../.code/DandelionVoting/proxy/acl/IACL.sol       |   16 +
 .../DandelionVoting/proxy/apps/AppProxyBase.sol    |   39 +
 .../proxy/apps/AppProxyUpgradeable.sol             |   33 +
 .../DandelionVoting/proxy/apps/AppStorage.sol      |   37 +
 .../DandelionVoting/proxy/common/DelegateProxy.sol |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../DandelionVoting/proxy/common/IsContract.sol    |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/DandelionVoting/proxy/flattened.sol      |  392 ++++
 .../.code/DandelionVoting/proxy/kernel/IKernel.sol |   24 +
 .../proxy/kernel/KernelConstants.sol               |   31 +
 .../DandelionVoting/proxy/lib/misc/ERCProxy.sol    |   16 +
 .../ethereum/.code/DandelionVoting/proxy/meta.txt  |    2 +
 .../implementation/acl/ACLSyntaxSugar.sol          |  106 +
 .../EVMScriptRegistry/implementation/acl/IACL.sol  |   16 +
 .../implementation/apps/AppStorage.sol             |   37 +
 .../implementation/apps/AragonApp.sol              |   69 +
 .../implementation/common/Autopetrified.sol        |   17 +
 .../implementation/common/ConversionHelpers.sol    |   32 +
 .../implementation/common/EtherTokenConstant.sol   |   14 +
 .../implementation/common/IVaultRecoverable.sol    |   17 +
 .../implementation/common/Initializable.sol        |   60 +
 .../implementation/common/IsContract.sol           |   27 +
 .../implementation/common/Petrifiable.sol          |   26 +
 .../implementation/common/ReentrancyGuard.sol      |   34 +
 .../implementation/common/SafeERC20.sol            |  170 ++
 .../implementation/common/TimeHelpers.sol          |   49 +
 .../implementation/common/Uint256Helpers.sol       |   15 +
 .../implementation/common/UnstructuredStorage.sol  |   42 +
 .../implementation/common/VaultRecoverable.sol     |   56 +
 .../implementation/evmscript/EVMScriptRegistry.sol |  110 +
 .../implementation/evmscript/EVMScriptRunner.sol   |  109 +
 .../evmscript/IEVMScriptExecutor.sol               |   13 +
 .../evmscript/IEVMScriptRegistry.sol               |   26 +
 .../implementation/evmscript/ScriptHelpers.sol     |   50 +
 .../EVMScriptRegistry/implementation/flattened.sol | 1214 +++++++++++
 .../implementation/kernel/IKernel.sol              |   24 +
 .../implementation/kernel/KernelConstants.sol      |   31 +
 .../implementation/lib/token/ERC20.sol             |   39 +
 .../EVMScriptRegistry/implementation/meta.txt      |    2 +
 .../.code/EVMScriptRegistry/proxy/acl/IACL.sol     |   16 +
 .../EVMScriptRegistry/proxy/apps/AppProxyBase.sol  |   39 +
 .../proxy/apps/AppProxyPinned.sol                  |   49 +
 .../EVMScriptRegistry/proxy/apps/AppStorage.sol    |   37 +
 .../proxy/common/DelegateProxy.sol                 |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../EVMScriptRegistry/proxy/common/IsContract.sol  |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/EVMScriptRegistry/proxy/flattened.sol    |  408 ++++
 .../EVMScriptRegistry/proxy/kernel/IKernel.sol     |   24 +
 .../proxy/kernel/KernelConstants.sol               |   31 +
 .../EVMScriptRegistry/proxy/lib/misc/ERCProxy.sol  |   16 +
 .../.code/EVMScriptRegistry/proxy/meta.txt         |    2 +
 .../contracts/EthPnt.sol => /dev/null              |   12 -
 .../EthPnt/implementation/meta.txt => /dev/null    |    2 -
 .../proxy/utils/Initializable.sol                  |    0
 .../token/ERC20/ERC20Upgradeable.sol               |    0
 .../token/ERC20/IERC20Upgradeable.sol              |    0
 .../ERC20/extensions/ERC20BurnableUpgradeable.sol  |    0
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |    0
 .../extensions/draft-ERC20PermitUpgradeable.sol    |    0
 .../extensions/draft-IERC20PermitUpgradeable.sol   |    0
 .../presets/ERC20PresetFixedSupplyUpgradeable.sol  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../utils/CountersUpgradeable.sol                  |    0
 .../utils/StringsUpgradeable.sol                   |    0
 .../utils/cryptography/ECDSAUpgradeable.sol        |    0
 .../utils/cryptography/draft-EIP712Upgradeable.sol |    0
 .../EthPntv2/implementation/contracts/EthPntv2.sol |  203 ++
 .../.code/EthPntv2/implementation/meta.txt         |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |    0
 .../contracts/proxy/ERC1967/ERC1967Proxy.sol       |    0
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     |    0
 .../proxy/@openzeppelin/contracts/proxy/Proxy.sol  |    0
 .../contracts/proxy/beacon/IBeacon.sol             |    0
 .../contracts/proxy/transparent/ProxyAdmin.sol     |    0
 .../transparent/TransparentUpgradeableProxy.sol    |    0
 .../contracts/proxy/utils/UUPSUpgradeable.sol      |    0
 .../@openzeppelin/contracts/utils/Address.sol      |    0
 .../@openzeppelin/contracts/utils/Context.sol      |    0
 .../@openzeppelin/contracts/utils/StorageSlot.sol  |    0
 .../EthPntv2}/proxy/contracts/import.sol           |    0
 .../EthPntv2}/proxy/contracts/test/Proxiable.sol   |    0
 .../EthPnt => .code/EthPntv2}/proxy/meta.txt       |    0
 .../Kernel/implementation/acl/ACLSyntaxSugar.sol   |  106 +
 .../.code/Kernel/implementation/acl/IACL.sol       |   16 +
 .../Kernel/implementation/apps/AppProxyBase.sol    |   39 +
 .../Kernel/implementation/apps/AppProxyPinned.sol  |   50 +
 .../implementation/apps/AppProxyUpgradeable.sol    |   34 +
 .../Kernel/implementation/apps/AppStorage.sol      |   37 +
 .../implementation/common/ConversionHelpers.sol    |   32 +
 .../Kernel/implementation/common/DelegateProxy.sol |   32 +
 .../common/DepositableDelegateProxy.sol            |   45 +
 .../implementation/common/DepositableStorage.sol   |   20 +
 .../implementation/common/EtherTokenConstant.sol   |   14 +
 .../implementation/common/IVaultRecoverable.sol    |   17 +
 .../Kernel/implementation/common/Initializable.sol |   60 +
 .../Kernel/implementation/common/IsContract.sol    |   27 +
 .../Kernel/implementation/common/Petrifiable.sol   |   26 +
 .../Kernel/implementation/common/SafeERC20.sol     |  170 ++
 .../Kernel/implementation/common/TimeHelpers.sol   |   49 +
 .../implementation/common/Uint256Helpers.sol       |   15 +
 .../implementation/common/UnstructuredStorage.sol  |   42 +
 .../implementation/common/VaultRecoverable.sol     |   56 +
 .../implementation/factory/AppProxyFactory.sol     |   55 +
 .../.code/Kernel/implementation/flattened.sol      | 1327 ++++++++++++
 .../.code/Kernel/implementation/kernel/IKernel.sol |   24 +
 .../.code/Kernel/implementation/kernel/Kernel.sol  |  238 +++
 .../implementation/kernel/KernelConstants.sol      |   31 +
 .../Kernel/implementation/kernel/KernelStorage.sol |   10 +
 .../Kernel/implementation/lib/misc/ERCProxy.sol    |   16 +
 .../Kernel/implementation/lib/token/ERC20.sol      |   39 +
 .../ethereum/.code/Kernel/implementation/meta.txt  |    2 +
 .../ethereum/.code/Kernel/proxy/acl/IACL.sol       |   16 +
 .../.code/Kernel/proxy/common/DelegateProxy.sol    |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../Kernel/proxy/common/DepositableStorage.sol     |   20 +
 .../Kernel/proxy/common/IVaultRecoverable.sol      |   17 +
 .../.code/Kernel/proxy/common/IsContract.sol       |   27 +
 .../Kernel/proxy/common/UnstructuredStorage.sol    |   42 +
 .../ethereum/.code/Kernel/proxy/flattened.sol      |  332 +++
 .../ethereum/.code/Kernel/proxy/kernel/IKernel.sol |   24 +
 .../.code/Kernel/proxy/kernel/KernelConstants.sol  |   31 +
 .../.code/Kernel/proxy/kernel/KernelProxy.sol      |   40 +
 .../.code/Kernel/proxy/kernel/KernelStorage.sol    |   10 +
 .../.code/Kernel/proxy/lib/misc/ERCProxy.sol       |   16 +
 .../pNetwork/ethereum/.code/Kernel/proxy/meta.txt  |    2 +
 .../.code/MiniMeToken/ITokenController.sol         |   30 +
 .../ethereum/.code/MiniMeToken/MiniMeToken.sol     |  577 ++++++
 .../ethereum/.code/MiniMeToken/flattened.sol       |  604 ++++++
 .../pNetwork/ethereum/.code/MiniMeToken/meta.txt   |    2 +
 .../MiniMeTokenFactory/MiniMeTokenFactory.sol      |  600 ++++++
 .../ethereum/.code/MiniMeTokenFactory/meta.txt     |    2 +
 .../contracts/ITokenController.sol                 |   29 +
 .../apps-shared-minime/contracts/MiniMeToken.sol   |  576 ++++++
 .../@aragon/os/contracts/acl/ACLSyntaxSugar.sol    |  106 +
 .../@aragon/os/contracts/acl/IACL.sol              |   16 +
 .../@aragon/os/contracts/apps/AppStorage.sol       |   37 +
 .../@aragon/os/contracts/apps/AragonApp.sol        |   69 +
 .../@aragon/os/contracts/common/Autopetrified.sol  |   17 +
 .../os/contracts/common/ConversionHelpers.sol      |   32 +
 .../os/contracts/common/EtherTokenConstant.sol     |   14 +
 .../@aragon/os/contracts/common/IForwarder.sol     |   20 +
 .../os/contracts/common/IVaultRecoverable.sol      |   17 +
 .../@aragon/os/contracts/common/Initializable.sol  |   60 +
 .../@aragon/os/contracts/common/IsContract.sol     |   27 +
 .../@aragon/os/contracts/common/Petrifiable.sol    |   26 +
 .../os/contracts/common/ReentrancyGuard.sol        |   34 +
 .../@aragon/os/contracts/common/SafeERC20.sol      |  157 ++
 .../@aragon/os/contracts/common/TimeHelpers.sol    |   49 +
 .../@aragon/os/contracts/common/Uint256Helpers.sol |   15 +
 .../os/contracts/common/UnstructuredStorage.sol    |   42 +
 .../os/contracts/common/VaultRecoverable.sol       |   56 +
 .../os/contracts/evmscript/EVMScriptRunner.sol     |  109 +
 .../os/contracts/evmscript/IEVMScriptExecutor.sol  |   13 +
 .../os/contracts/evmscript/IEVMScriptRegistry.sol  |   26 +
 .../@aragon/os/contracts/kernel/IKernel.sol        |   24 +
 .../os/contracts/kernel/KernelConstants.sol        |   31 +
 .../@aragon/os/contracts/lib/math/SafeMath.sol     |   75 +
 .../@aragon/os/contracts/lib/token/ERC20.sol       |   39 +
 .../implementation/contracts/TokenManager.sol      |  414 ++++
 .../TokenManager/implementation/flattened.sol      | 2158 ++++++++++++++++++++
 .../.code/TokenManager/implementation/meta.txt     |    2 +
 .../ethereum/.code/TokenManager/proxy/acl/IACL.sol |   16 +
 .../.code/TokenManager/proxy/apps/AppProxyBase.sol |   39 +
 .../proxy/apps/AppProxyUpgradeable.sol             |   33 +
 .../.code/TokenManager/proxy/apps/AppStorage.sol   |   37 +
 .../TokenManager/proxy/common/DelegateProxy.sol    |   32 +
 .../proxy/common/DepositableDelegateProxy.sol      |   45 +
 .../proxy/common/DepositableStorage.sol            |   20 +
 .../proxy/common/IVaultRecoverable.sol             |   17 +
 .../.code/TokenManager/proxy/common/IsContract.sol |   27 +
 .../proxy/common/UnstructuredStorage.sol           |   42 +
 .../.code/TokenManager/proxy/flattened.sol         |  392 ++++
 .../.code/TokenManager/proxy/kernel/IKernel.sol    |   24 +
 .../TokenManager/proxy/kernel/KernelConstants.sol  |   31 +
 .../.code/TokenManager/proxy/lib/misc/ERCProxy.sol |   16 +
 .../ethereum/.code/TokenManager/proxy/meta.txt     |    2 +
 277 files changed, 21571 insertions(+), 14 deletions(-)
```
