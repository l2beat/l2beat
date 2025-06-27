Generated with discovered.json: 0x5d44d99b24dc098733acb03285b80b369e9280f8

# Diff at Fri, 27 Jun 2025 10:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1aa90ee63be143107fba7087a30ac92d463e70f3 block: 22780105
- current block number: 22794595

## Description

found the opstack part of katana and some middleware between yearn, morpho and agglayer.

katana is using an OptiPortal2 that [denies all L1->L2 messages.](https://disco.l2beat.com/diff/eth:0x3Da872782f9fB696fD72Af2ec9313a56bDA6f06d/eth:0x9a6C2Dcc7e523f87716e17Ba36D10CCfFA0A60bb) It also does not have any state updates yet. The rest of the system is 'standard' opstack **with** custom gas token support (ETH is set atm, could only be changed with a major upgrade) and standard PermissionedDisputeGame without any games created. Notably this deployment also does not use the latest 7702 protections that the superchain does use.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22780105 (main branch discovery), not current.

```diff
    contract Yearn Treasury Multisig (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Yearn Treasury Multisig"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x14Be6579A41342ca6B402ec85E7be538e6Ade951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x15a32FCeA89617Ff450F094cDE102CCa46598B7F)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Yearn Strategist Multisig (0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x19DbD16f0a8e706D817B7e3b7bcF72917Ebb8832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2008A6Ba8CAF85AaFAe7880664Dfe681D533ac2E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0x250D30c523104bf0a06825e7eAdE4Dc46EdfE40E)
    +++ description: [PAUSED] The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x263b251D67BB154DD6b8352539466ACE7948ED56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x2C24B57e2CCd1f273045Af6A5f632504C432374F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2d4B822F8B74AdE7fcD5F740967f4dFcD2fef5e4)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract VbETH (0x2DC70fb75b88d2eB4715bc06E1595E6D97c34DFF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x2De242e27386e224E5fbF110EA8406d5B70740ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x2F439B95fa789C5d3a5C99cc70EB3ee83D08a811)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x377a9e5df2882DC1DF8A0bD162cbc640eA634010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x3DD459dE96F9C28e3a343b831cbDC2B93c8C4855)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MigrationManager (0x417d01B64Ea30C4E163873f3a1f77b727c689e02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x420693B32113a0e00Eb9f3315D5D5ec3b32C2d69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x53E82ABbb12638F09d9e624578ccB666217a765e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x5fE03a12C1236F9C22Cb6479778DDAa4bce6299C)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x6d0ff67fb427422AfF35EEa8596949B374b09a52)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenericVaultBridgeToken (0x6d4f9f9f8f0155509ecd6Ac6c544fF27999845CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x74034597d29613CC8C0BDc8780e1d292A553Bd32)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0x79ecD8d8040496014bcD3bA16AdF3914b23f8Fd5)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract Safe (0x827e86072B06674a077f592A531dcE4590aDeCdB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8970650CF3f1E57cA804C65B4DBcFf698789FE30)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x98906C3f90A06B5484DD67bf32938815d2993dBC)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x9c065e11870B891D214Bc2Da7EF1f9DDFA1BE277)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract Polygon Multisig 2 (0x9d851f8b8751c5FbC09b9E74E6e68E9950949052)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xA84C37cD0b9bA1B43276C11976DBE9d1344C7f4E)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract Safe (0xA8C31B2edd84c654d06d626383f4154D1E40C5Ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xb6e1f8B589A14B79DDD3aD7F0589AB548c70C174)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract Safe (0xd0673F989bc3BA9314d0AAF28BfC84e99B7898CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xD1e389c046FB734D2a0c7C390312210c408ba832)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xe06278351d120288eDfCB963F934113Ca3C21AFe)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract AddressManager (0xEaB94275eD336D80d4F46EA8Ea0427e351f11D65)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract Katana Multisig (0xf4F2f5F6bAdBE05433C4604320ecC56BbECBC04E)
    +++ description: None
```

Generated with discovered.json: 0xc999da8bc9ac1cc76b4b9adf54debc12d16c2c58

# Diff at Wed, 25 Jun 2025 07:57:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4bade41aedf0f9269688f2c05f04d2992bb2ca38 block: 22637654
- current block number: 22780105

## Description

deposit limit removed for a deposit module governed by yearn strategist MS.

## Watched changes

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      values.deposit_limit:
-        250000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      values.deposit_limit:
-        300000000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      values.deposit_limit:
-        250000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      values.deposit_limit:
-        "140000000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.deposit_limit_module:
-        "0x0000000000000000000000000000000000000000"
+        "0x793D85F585145c050487c7AfBF0e9B97143fF1CB"
    }
```

```diff
+   Status: CREATED
    contract DepositModule (0x793D85F585145c050487c7AfBF0e9B97143fF1CB)
    +++ description: None
```

## Source code changes

```diff
.../katana/ethereum/.flat/DepositModule.sol        | 76 ++++++++++++++++++++++
 1 file changed, 76 insertions(+)
```

Generated with discovered.json: 0x26d0d44f72ced7546e79f24db5c69d9d2994af46

# Diff at Wed, 11 Jun 2025 10:34:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 22637654
- current block number: 22637654

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22637654 (main branch discovery), not current.

```diff
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

```diff
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF) {
    +++ description: None
      sourceHashes.1:
+        "0x5d40986c3a1dd9125adfec96b4aec8a7336eb319d3c4cdde3e55bb1096c11461"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xd8063123BBA3B480569244AE66BFE72B6c84b00d"
      implementationNames.0xd8063123BBA3B480569244AE66BFE72B6c84b00d:
+        "Yearn V3 Vault"
    }
```

Generated with discovered.json: 0x2f3417effe108cedcb2b9ccc6814066112393c08

# Diff at Thu, 05 Jun 2025 12:10:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22637654

## Description

initial katana predeposit disco.

## Initial discovery

```diff
+   Status: CREATED
    contract Accountant (0x40a87104AEb279C061Af6b7C48F7E08c4A6e388D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDT Token (0x48c03B6FfD0008460F8657Db1037C7e09dEedfcb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit USDC Token (0x7B5A0182E400b241b317e781a4e9dEdFc1429822)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ShareReceiver (0x836304B832687f3811a0dF935934C724B40578eB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WBTC Token (0x92C82f5F771F6A44CfA09357DD0575B81BF5F728)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositRelayer (0xB01dADEC98308528ee57A17b24A473213c1704bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Katana Pre-Deposit WETH Token (0xcc6a16Be713f6a714f68b0E1f4914fD3db15fBeF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Router (0xeeeeee9eC4769A09a76A83C7bC42b185872860eE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
    +++ description: None
```
