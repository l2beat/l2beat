Generated with discovered.json: 0x3e8e87f48a4a8d11bc5e4e8510c4d2eaf91d4657

# Diff at Wed, 08 Jan 2025 09:01:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21486361
- current block number: 21486361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21486361 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xc48944feccc2d5061ce68955d5b231aeca0e7ecf

# Diff at Thu, 26 Dec 2024 11:32:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e29d1319d91d7959f43ee6476f8bc351dd60d254 block: 21465381
- current block number: 21486361

## Description

Contracts verified (PermissionedDisputeGame, AnchorStateRegistry).

Both contracts are unintented beta versions (see ink telegram chat) but contain mostly cosmetic changes and the diff is audited, according to ink. A brief review of the diff shows no logic changes and thus the standard templates are used here.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465381 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xA8B389A82e088b164cD03230e900980CcED34d29","via":[{"address":"0xd56045E68956FCe2576E680c95a4750cf8241f79"}]}
      receivedPermissions.8.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.8.via.0.address:
-        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.7.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      receivedPermissions.7.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xd56045E68956FCe2576E680c95a4750cf8241f79"
      receivedPermissions.7.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.6.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      receivedPermissions.6.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.5.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      receivedPermissions.4.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      receivedPermissions.3.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
    }
```

```diff
    contract OptimismPortal2 (0x5d66C1782664115999C47c9fA5cd031f495D3e4F) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
      name:
-        "OptimismPortal"
+        "OptimismPortal2"
      displayName:
+        "OptimismPortal"
    }
```

```diff
    contract PermissionedDisputeGame (0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      unverified:
-        true
      values.absolutePrestate:
+        "0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c"
      values.anchorStateRegistry:
+        "0xde744491BcF6b2DD2F32146364Ea1487D75E2509"
      values.challenger:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.claimData:
+        []
      values.claimDataLen:
+        0
      values.createdAt:
+        0
      values.extraData:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.gameCreator:
+        "0x0000000000000000000000000000000000000000"
      values.gameData:
+        {"gameType_":1,"rootClaim_":"0x0000000000000000000000000000000000000000000000000000000000000000","extraData_":"0x0000000000000000000000000000000000000000000000000000000000000000"}
      values.gameType:
+        1
      values.getChallengerDuration:
+        []
      values.l1Head:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.l2BlockNumber:
+        0
      values.l2BlockNumberChallenged:
+        false
      values.l2BlockNumberChallenger:
+        "0x0000000000000000000000000000000000000000"
      values.l2ChainId:
+        57073
      values.proposer:
+        "0x65436ddCbc026F34118954F229f7F132b696b3B4"
      values.resolvedAt:
+        0
      values.rootClaim:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.startingBlockNumber:
+        0
      values.startingOutputRoot:
+        {"root":"0x0000000000000000000000000000000000000000000000000000000000000000","l2BlockNumber":0}
      values.startingRootHash:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.status:
+        0
      values.version:
+        "1.3.1-beta.3"
      values.weth:
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
      sourceHashes:
+        ["0xf2f258eb38ded9ad4f2ad678585505ab05851f008aad859af6ad97de75a276b9"]
    }
```

```diff
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","target":"0xde744491BcF6b2DD2F32146364Ea1487D75E2509"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","target":"0xA8B389A82e088b164cD03230e900980CcED34d29"}
      directlyReceivedPermissions.6.target:
-        "0xA8B389A82e088b164cD03230e900980CcED34d29"
+        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
      directlyReceivedPermissions.6.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.5.target:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      directlyReceivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.4.target:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
      directlyReceivedPermissions.3.target:
-        "0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364"
+        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
      directlyReceivedPermissions.2.target:
-        "0x5d66C1782664115999C47c9fA5cd031f495D3e4F"
+        "0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38"
    }
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x14773a8040Ff22e3DcBb0C83eC8e33Be7D920D38)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xde744491BcF6b2DD2F32146364Ea1487D75E2509)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

Generated with discovered.json: 0x98aefd80ba2af981075e98a9847cebf4b6491d31

# Diff at Sat, 21 Dec 2024 17:04:52 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21452260

## Description

Initial discovery. Chain controlled by Superchain upgradability but with permissioned games.

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x10d7B35078d3baabB96Dd45a9143B94be65b12CD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
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
    contract OptimismPortal (0x5d66C1782664115999C47c9fA5cd031f495D3e4F)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x62C0a111929fA32ceC2F76aDba54C16aFb6E8364)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x661235a238B11191211fa95D4Dd9E423d521E0Be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x88FF1e5b602916615391F55854588EFcBB7663f0)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9b7C9BbD6d540A8A4dEDd935819fC4408Ba71153)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
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
    contract OptimismMintableERC20Factory (0xA8B389A82e088b164cD03230e900980CcED34d29)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd56045E68956FCe2576E680c95a4750cf8241f79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```
