Generated with discovered.json: 0xb0e909c4ca225287b65a88ec74f64cf83376606c

# Diff at Mon, 06 Jan 2025 13:39:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@969dad8a7ea2e6cba9a02db28683ddad0178857a block: 20985756
- current block number: 21565774

## Description

Initial discovery of an OP stack chain with known contracts and superchain gov, using a permissioned-dispute-game-ONLY construction similar to ink l2 on launch.

## Watched changes

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SwellChainMultisig (0x06F7fB1C74147e34Fce04a6828c7BF809B038d0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x14387438EE964e826A4EAeB95B2BCe7754174dD1)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (0x16e83cE5Ce29BF90AD9Da06D2fE6a15d5f344ce4)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4C4710a4Ec3F514A492CC6460818C4A6A6269dd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x758E0EE66102816F5C3Ec9ECc1188860fbb87812)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x7aA4960908B13D104bf056B23E2C76B43c5AACc8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x87690676786cDc8cCA75A472e483AF7C8F2f0F57)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x89c98736A806176Fe85283c1cB727ffBdeaf37A9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa0cFbe3402d6E0a74e96D3C360F74D5ea4Fa6893)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AddressManager (0xa54a84f17c2180148c762D79bC57BdfF7FdAFC8A)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc2b228cd433eBaE788DE287EDE2abE55B3F3F603)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xD3d4c6B703978a5d24FecF3a70a51127667Ff1A4)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xe6a99Ef12995DeFC5ff47EC0e13252f0E6903759)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0xecf3376512EDAcA4FBB63d2c67d12a0397d24121)
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xfd7618330E63B493070DC8C491Ad4aD26144Bc1e)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

## Source code changes

```diff
.../swell/ethereum/.flat/AddressManager.sol        |  129 +
 .../AnchorStateRegistry/AnchorStateRegistry.sol    |  432 +++
 .../ethereum/.flat/AnchorStateRegistry/Proxy.p.sol |  200 +
 .../ethereum/.flat/DelayedWETH/DelayedWETH.sol     |  651 ++++
 .../swell/ethereum/.flat/DelayedWETH/Proxy.p.sol   |  200 +
 .../swell/ethereum/.flat/DeputyGuardianModule.sol  |  156 +
 .../DisputeGameFactory/DisputeGameFactory.sol      | 1550 ++++++++
 .../ethereum/.flat/DisputeGameFactory/Proxy.p.sol  |  200 +
 .../swell/ethereum/.flat/GnosisSafe/GnosisSafe.sol |  953 +++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |   35 +
 .../L1CrossDomainMessenger.sol                     | 1514 ++++++++
 .../ResolvedDelegateProxy.p.sol                    |   55 +
 .../L1ERC20TokenBridge/L1ERC20TokenBridge.sol      | 1078 ++++++
 .../.flat/L1ERC20TokenBridge/OssifiableProxy.p.sol |  614 +++
 .../.flat/L1ERC721Bridge/L1ERC721Bridge.sol        |  707 ++++
 .../ethereum/.flat/L1ERC721Bridge/Proxy.p.sol      |  200 +
 .../.flat/L1StandardBridge/L1ChugSplashProxy.p.sol |  269 ++
 .../.flat/L1StandardBridge/L1StandardBridge.sol    | 1538 ++++++++
 .../swell/ethereum/.flat/Lib_AddressManager.sol    |  152 +
 .../swell/ethereum/.flat/LivenessGuard.sol         |  582 +++
 .../swell/ethereum/.flat/LivenessModule.sol        |  258 ++
 .../swell/ethereum/.flat/MIPS.sol                  | 1517 ++++++++
 .../OpFoundationOperationsSafe/GnosisSafe.sol      |  959 +++++
 .../.flat/OpFoundationOperationsSafe/Proxy.p.sol   |   39 +
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 +++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../OptimismMintableERC20Factory.sol               |  427 +++
 .../.flat/OptimismMintableERC20Factory/Proxy.p.sol |  200 +
 .../.flat/OptimismPortal2/OptimismPortal2.sol      | 3018 +++++++++++++++
 .../ethereum/.flat/OptimismPortal2/Proxy.p.sol     |  200 +
 .../ethereum/.flat/PermissionedDisputeGame.sol     | 4026 ++++++++++++++++++++
 .../swell/ethereum/.flat/PreimageOracle.sol        | 1353 +++++++
 .../swell/ethereum/.flat/ProxyAdmin.sol            |  298 ++
 .../.flat/SecurityCouncilMultisig/GnosisSafe.sol   |  953 +++++
 .../SecurityCouncilMultisig/GnosisSafeProxy.p.sol  |   35 +
 .../ethereum/.flat/SuperchainConfig/Proxy.p.sol    |  200 +
 .../.flat/SuperchainConfig/SuperchainConfig.sol    |  477 +++
 .../SuperchainGuardianMultisig/GnosisSafe.sol      |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../swell/ethereum/.flat/SuperchainProxyAdmin.sol  |  298 ++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 +++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../ethereum/.flat/SwellChainMultisig/Safe.sol     | 1088 ++++++
 .../.flat/SwellChainMultisig/SafeProxy.p.sol       |   37 +
 .../swell/ethereum/.flat/SystemConfig/Proxy.p.sol  |  200 +
 .../ethereum/.flat/SystemConfig/SystemConfig.sol   |  826 ++++
 46 files changed, 30588 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985756 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
```

```diff
-   Status: DELETED
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4)
    +++ description: None
```

Generated with discovered.json: 0x3bbfe0fb4fecc0858ec4b3d36797099ba3b01a60

# Diff at Mon, 21 Oct 2024 12:49:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20985756
- current block number: 20985756

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20985756 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      descriptions:
-        ["Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem"]
      description:
+        "Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem"
    }
```

Generated with discovered.json: 0x3548a172928f0df4e9b68a8a9ed5bc2ac911e55e

# Diff at Thu, 17 Oct 2024 14:02:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b22da46ad96e1d0cb3e7d83e3293eb7b76990953 block: 20964349
- current block number: 20985756

## Description

1 signer removed from SwellMultisig.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$members.6:
-        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.5:
-        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
+        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.4:
-        "0x042d200e5375204F022570361f3913b245488091"
+        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x9fd2289066719a81108d257277c08f5a7d8d0f18

# Diff at Mon, 14 Oct 2024 14:18:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f799449f5bf9f715885662e0303a221ca27f97a5 block: 20016207
- current block number: 20964349

## Description

One new signer added to SwellMultisig.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$members.6:
+        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
      values.$members.5:
-        "0x5b27b9279251904AaF2127463eeFf91E0037F725"
+        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
      values.$members.4:
-        "0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59"
+        "0x042d200e5375204F022570361f3913b245488091"
      values.$members.3:
-        "0x042d200e5375204F022570361f3913b245488091"
+        "0x284C633962F2386590E934c4fBD2D3EafA0944A3"
      values.$members.2:
-        "0x284C633962F2386590E934c4fBD2D3EafA0944A3"
+        "0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238"
      values.$members.1:
-        "0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238"
+        "0xd08b294dBD8Bc760c57AbdEC26515Da626511B40"
      values.$members.0:
-        "0xd08b294dBD8Bc760c57AbdEC26515Da626511B40"
+        "0xF14E35C4F1E51BF7Ed930813eCD2e2dA1fc86072"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x77106dd9943e0d347db6198e66f087f3424ed9ba

# Diff at Mon, 14 Oct 2024 10:56:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774) {
    +++ description: None
      sourceHashes:
+        ["0x3905f28c9b0500b746756a8cf7d0bed4cb79c6bee28f80b384514d7fdd969bac"]
    }
```

```diff
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d) {
    +++ description: None
      sourceHashes:
+        ["0x7f2346203319dad1511cb447159e190292bb6ea303b20a40341503c6d2c8b839"]
    }
```

```diff
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4) {
    +++ description: None
      sourceHashes:
+        ["0x43aeca3d5513c5b43391523911d8ee8061fb1a83b088fdc0d3abb16e4a9659b9"]
    }
```

Generated with discovered.json: 0x9e6c7c4b43e6357d45c7118b468f6d727a21335d

# Diff at Fri, 09 Aug 2024 10:12:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x8ee9736a55585664c0c57b21401881a26aacf907

# Diff at Tue, 30 Jul 2024 11:16:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      fieldMeta:
+        {"nonce":{"severity":"MEDIUM","description":"Watch out for txs concerning the prelaunch vault and swell L2 launch"}}
    }
```

Generated with discovered.json: 0xd27154564d17a85a983339e3252fc37fe7df0563

# Diff at Tue, 04 Jun 2024 04:55:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@706706295a49487100a144276621ec14caf86806 block: 19873897
- current block number: 20016207

## Description

A timelock transaction is queued by the SwellMultisig to support the Lyra-associated token weETHC for staking in the swell prelaunch escrow.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        109
+        110
    }
```

Generated with discovered.json: 0x55b7dacb1f6b507abd00e02b14fa8d1fcf0d6aa8

# Diff at Wed, 15 May 2024 07:31:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6f5171cf9179f1cc9ea0379d73057884dd330078 block: 19859664
- current block number: 19873897

## Description

The timelock tx explained in the update below is executed.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin functions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        108
+        109
    }
```

Generated with discovered.json: 0xe81a0b6dc8ed608bd7b05dfef62949a59623169a

# Diff at Mon, 13 May 2024 07:41:01 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19794895
- current block number: 19859664

## Description

A timelock transaction is queued to whitelist (`supportToken(address,(bool,bool))`) the following tokens on Wednesday, 15 May 2024 04:00:00 GMT:

- sDAI (savings dai)
- wstUSDT (stusdt.io)
- liquidUSD (Ether.fi)
- apxETH (Dinero)
- pxETH (Dinero)

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        107
+        108
    }
```

Generated with discovered.json: 0xaa1dd18f19c72836f6b4087c23b82a0cab0f6b45

# Diff at Sat, 04 May 2024 06:16:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19794895

## Description

Initial config for the Pre-launch phase of swell. There are two main contracts:
- Zap: Non-escrowing entry contract that wraps ETH, eETH or stETH and deposits them into the Vault. It is immutable and has no owner functions.
- SwellL2PrelaunchVault: Escrow that can hold predefined ERC-20s and nothing more. It is immutable and owner functions (`rescueERC20()`) are currently proxied with a 2d timelock in front of the SwellMultisig.


## Initial discovery

```diff
+   Status: CREATED
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4)
    +++ description: None
```
