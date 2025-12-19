Generated with discovered.json: 0x5dc6f5ddd5db14523db93c6bea3711bbf1e60cab

# Diff at Fri, 19 Dec 2025 15:52:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@15e2d615226a5b2e95a3734fe5d1e1917a844bfa block: 1764760164
- current timestamp: 1766159489

## Description

Initial discovery. Untemplatized contracts diff with most similar templatized:
- SystemConfig:                                                                                                                                                                                                       
  https://disco.l2beat.com/diff/eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647/eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639  (higher gas limit)
- OptimismPortal2:                                                                                                                                                                                              
  https://disco.l2beat.com/diff/eth:0xB250566074B3c0f1B109A531A83f3d9B1a579273/eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9  (no constructor params, system address)
- SuperchainConfig:                                                                                                                                                                                                   
  https://disco.l2beat.com/diff/eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7/eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89  (guardian transfer functions)

## Watched changes

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","description":"can pull funds from the contract in case of emergency.","role":".owner"}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      controlsMajorityOfUpgradePermissions:
-        true
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: None
      values.blobbasefeeScalar:
-        801949
+        0
      values.owner:
-        "eth:0x5785Df5b4234Fc63F9D6ecFe30C40b6b44619fd2"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
      values.scalar:
-        "452312848583266388373324160190187140051835877600158453279134631875638723928"
+        "452312848583266388373324160190187140051835877600158453279131187530910664024"
    }
```

```diff
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285) {
    +++ description: None
      template:
-        "opstack/SuperchainConfigFake"
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0xcfa8bfbe522f3a85a5385ccb76753907d2f839d7bc257f742c9781269d7cce4d"
      description:
-        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"
      values.$pastUpgrades.1:
+        ["2025-12-18T02:00:35.000Z","0xcf4419b7fd683f75f9619984db245eca086853395d6f033099ad7e00b0eb4518",["eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.PENDING_GUARDIAN_SLOT:
+        "0xd27e97cacf895026d8121da1df07f0476456b12320e92b2a622d646c7a54955c"
      values.pendingGuardian:
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89:
+        "SuperchainConfig"
      category:
-        {"name":"Governance","priority":3}
    }
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) {
    +++ description: None
      sourceHashes.1:
-        "0x8f2cec012bf54c7d3bf484bd41d932fbb47b7977bce894ea2138262e61905a92"
+        "0x2cb05d8405b381db83cf08312454b15a474ae2344ca5b34a2c69b3e2f3c1c87e"
      values.$implementation:
-        "eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99"
+        "eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"
      values.$pastUpgrades.1:
+        ["2025-12-18T01:52:23.000Z","0x79b2cfcd6e5c08d9912d7450c4f77db522be234ea86b4c7db6c10fc0b711b353",["eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.params.prevBoughtGas:
-        333101
+        100000
      values.params.prevBlockNum:
-        23932203
+        24047651
      values.version:
-        "3.14.0"
+        "3.15.2"
      implementationNames.eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99:
-        "OptimismPortal2"
      implementationNames.eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9:
+        "OptimismPortal2"
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F)
    +++ description: None
```

## Source code changes

```diff
.../OptimismPortal2/OptimismPortal2.sol            |   15 +-
 .../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../SuperchainConfig/SuperchainConfig.sol          |   49 +-
 8 files changed, 2307 insertions(+), 7 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764760164 (main branch discovery), not current.

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"},{"permission":"interact","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","description":"can pull funds from the contract in case of emergency.","role":".owner"},{"permission":"interact","from":"eth:0x910b159F79288DD706789ec7768E979d4D88C057","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner"},{"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]},{"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}]
      controlsMajorityOfUpgradePermissions:
+        true
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9)
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057)
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623)
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

Generated with discovered.json: 0x2b5b1b5f11f0a81947406627fc2b7a6122c03ac5

# Diff at Wed, 03 Dec 2025 11:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb61f5ec5bdfe1b0d99f8a8bbf88c803aa243605 block: 1764165346
- current timestamp: 1764760164

## Description

refund contract deployed, refunds completed.

## Watched changes

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      description:
-        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719."
+        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071."
      values.treasury:
-        "eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719"
+        "eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071"
    }
```

```diff
+   Status: CREATED
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071)
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98)
    +++ description: None
```

## Source code changes

```diff
.../megaeth/.flat/MegaPreDepositVaultRefund.sol    | 1029 ++++++++++++++++++
 .../src/projects/megaeth/.flat/Safe/Safe.sol       | 1088 ++++++++++++++++++++
 .../projects/megaeth/.flat/Safe/SafeProxy.p.sol    |   37 +
 3 files changed, 2154 insertions(+)
```

Generated with discovered.json: 0xf9cd8338d39ae28745c59c2f01082a705999a80a

# Diff at Wed, 26 Nov 2025 10:21:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1764152153

## Description

Add Megaeth predeposit contract and TVS.

## Initial discovery

```diff
+   Status: CREATED
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6)
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719.
```

```diff
+   Status: CREATED
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719)
    +++ description: None
```
