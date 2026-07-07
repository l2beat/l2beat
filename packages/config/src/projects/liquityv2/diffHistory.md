Generated with discovered.json: 0xed508097b720515f43f424d14ae685474843061d

# Diff at Tue, 07 Jul 2026 13:15:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1781962796

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract SortedTroves_rETH (eth:0x14d8d8011dF2b396Ed2bbC4959bb73250324F386) [liquityv2/SortedTroves]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT_WETH (eth:0x1A0FC0b843aFD9140267D25d4E575Cb37a838013) [liquityv2/TroveNFT]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressesRegistry_WETH (eth:0x20F7C9ad66983F6523a0881d0f82406541417526) [liquityv2/AddressesRegistry]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetadataNFT_rETH (eth:0x3400874305E1547020fb8e80eAF1308B757171Af) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RETHPriceFeed (eth:0x34F1E9c7dcc279ec70d3c4488EB2D80FBa8B7b2B) [liquityv2/RETHPriceFeed]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetadataNFT_wstETH (eth:0x362f822dF79790C8077e61110484Fffa48F682A1) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollSurplusPool_wstETH (eth:0x36e6CBdf68f64CF00fC3a6c634A25be32Dd0A235) [liquityv2/CollSurplusPool]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations_WETH (eth:0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 110%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 150%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 110%), and it also shuts down automatically if the price feed reports a failure of one of its oracles. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract GasPool_rETH (eth:0x45c81dcE308389e1Bee63ae30A04Fb1e148dad41) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool_wstETH (eth:0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool); there is no permissionless or admin path to move it. It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remaining 25% to the InterestRouter. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract Chainlink_rETH_ETH (eth:0x536218f9E9Eb48863970252233c8F271f554C2d0) [N/A]
    +++ description: Chainlink rETH/ETH price feed.
```

```diff
+   Status: CREATED
    contract StabilityPool_WETH (eth:0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied. The contract has no owner or admin: its wired addresses are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract DefaultPool_rETH (eth:0x5cc5ceFD034Fdc4728D487a72Ca58A410CDdCD6b) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it; there is no permissionless or admin path. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract FixedAssetData_WETH (eth:0x5CcA549ca706C39D68156e5E0a72CcBC95f563d0) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Chainlink_ETH_USD (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) [N/A]
    +++ description: Chainlink ETH/USD price feed.
```

```diff
+   Status: CREATED
    contract AddressesRegistry_rETH (eth:0x6106046F031a22713697e04C08B330dDaf3e8789) [liquityv2/AddressesRegistry]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BOLD Stablecoin Token (eth:0x6440f144b7e50D6a8439336510312d2F54beB01D) [liquityv2/BoldToken]
    +++ description: None
```

```diff
+   Status: CREATED
    contract UserProxy (eth:0x65f9A98009Aecaa3fc8A3A83FEF44e2b6931A7b2) [liquityv2/UserProxy]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT_rETH (eth:0x7ae430E25b67f19B431e1D1Dc048a5BCF24C0873) [liquityv2/TroveNFT]
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPool_WETH (eth:0x7b9ab3DE4036caE51F1fa4ec0a2C2fd606bCF921) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager_WETH (eth:0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a liquidation penalty) is either absorbed by the StabilityPool or redistributed across the remaining troves, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract Governance (eth:0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1) [liquityv2/Governance]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetReader_WETH (eth:0x84087689B0D6a8A8f11C297e9e7f8De99f398258) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves_wstETH (eth:0x84eb85a8C25049255614F0536Bea8F31682e86F1) [liquityv2/SortedTroves]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT_wstETH (eth:0x857aECeBF75f1012DC18E15020C97096aeA31b04) [liquityv2/TroveNFT]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetData_rETH (eth:0x884Acfa4593a6FdbA0a9373007E48Ea9AF881C42) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPool_wstETH (eth:0x8C44FBa379D8A8608C0e29B2729DeB75a981Db1f) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressesRegistry_wstETH (eth:0x8d733F7ea7c23Cbea7C613B6eBd845d46d3aAc54) [liquityv2/AddressesRegistry]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool_rETH (eth:0x9074D72cc82DaD1e13E454755Aa8f144c479532F) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool); there is no permissionless or admin path to move it. It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remaining 25% to the InterestRouter. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract StabilityPool_wstETH (eth:0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied. The contract has no owner or admin: its wired addresses are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract MetadataNFT_WETH (eth:0x9B36C3B16299D68c79F174df7e728E35b6AF4A12) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves_WETH (eth:0xA25269E41BD072513849F2E64Ad221e84f3063F4) [liquityv2/SortedTroves]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager_wstETH (eth:0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a liquidation penalty) is either absorbed by the StabilityPool or redistributed across the remaining troves, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract FixedAssetReader_wstETH (eth:0xa5224865040034A9f8E5C60e0a616c9c8A63f237) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations_wstETH (eth:0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 120%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 160%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 120%), and it also shuts down automatically if the price feed reports a failure of one of its oracles. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract TroveManager_rETH (eth:0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a liquidation penalty) is either absorbed by the StabilityPool or redistributed across the remaining troves, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract CollSurplusPool_rETH (eth:0xba4A2bD8b76DF84CaC98eBa3f4b967D8423192bF) [liquityv2/CollSurplusPool]
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETHPriceFeed (eth:0xCC5F8102eb670c89a4a3c567C13851260303c24F) [liquityv2/WETHPriceFeed]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetReader_rETH (eth:0xcC77baf5706BDf7CFA7FefD5337833e2e1fd0d8e) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Chainlink_stETH_USD (eth:0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8) [N/A]
    +++ description: Chainlink stETH/USD price feed.
```

```diff
+   Status: CREATED
    contract StabilityPool_rETH (eth:0xd442E41019B7F5C4dD78F50dc03726C446148695) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied. The contract has no owner or admin: its wired addresses are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract DefaultPool_WETH (eth:0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it; there is no permissionless or admin path. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract DefaultPool_wstETH (eth:0xD796e1648526400386CC4d12FA05E5F11e6a22A1) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it; there is no permissionless or admin path. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract WSTETHPriceFeed (eth:0xe7Aa2Ba9E086A379d3beb224098bC634a46e314E) [liquityv2/WSTETHPriceFeed]
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations_rETH (eth:0xe8119fC02953B27a1b48D2573855738485A17329) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 120%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 160%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 120%), and it also shuts down automatically if the price feed reports a failure of one of its oracles. The contract has no owner or admin, and its wired addresses and risk parameters are set at construction from the AddressesRegistry and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract ActivePool_WETH (eth:0xeB5A8C825582965f1d84606E078620a84ab16AfE) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool); there is no permissionless or admin path to move it. It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remaining 25% to the InterestRouter. The contract has no owner or admin, and its wired addresses are read from the AddressesRegistry at construction and cannot be changed afterward.
```

```diff
+   Status: CREATED
    contract CollSurplusPool_WETH (eth:0xedbE2509E502c0320D2e7f8b6746a49b4B50E2bF) [liquityv2/CollSurplusPool]
    +++ description: None
```

```diff
+   Status: CREATED
    contract HintHelpers (eth:0xF0caE19C96E572234398d6665cC1147A16cBe657) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetData_wstETH (eth:0xf4a3fE99227F6060e4C1c62b557EEE050B6483E4) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralRegistry (eth:0xf949982B91C8c61e952B3bA942cbbfaef5386684) [liquityv2/CollateralRegistry]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiTroveGetter (eth:0xFA61dB085510C64B83056Db3A7Acf3b6f631D235) [N/A]
    +++ description: None
```
