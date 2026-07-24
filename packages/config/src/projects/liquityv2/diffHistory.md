Generated with discovered.json: 0x46bb80754b1d1fbc24b3d5f2aaff1f2f2d778aad

# Diff at Thu, 09 Jul 2026 12:41:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1781962796

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract SortedTroves_rETH (eth:0x14d8d8011dF2b396Ed2bbC4959bb73250324F386) [liquityv2/SortedTroves]
    +++ description: The branch's troves kept as a doubly-linked list ordered by annual interest rate, so any trove's position relative to the others is known at a glance. It is maintained only by the branch's BorrowerOperations and TroveManager, which insert, remove, and re-position troves as they open, close, or change their rate. It holds no funds and stores nothing but the ordering.
```

```diff
+   Status: CREATED
    contract TroveNFT_WETH (eth:0x1A0FC0b843aFD9140267D25d4E575Cb37a838013) [liquityv2/TroveNFT]
    +++ description: The ERC721 that represents ownership of a trove: opening one mints an NFT and closing it burns one, both by the branch's TroveManager. The holder of a trove's NFT is its owner, with full control over the position, and transferring the NFT hands the entire trove, collateral and debt alike, to the new holder. In every other respect it is a standard ERC721.
```

```diff
+   Status: CREATED
    contract AddressesRegistry_WETH (eth:0x20F7C9ad66983F6523a0881d0f82406541417526) [liquityv2/AddressesRegistry]
    +++ description: The immutable address book and risk-parameter store for a single collateral branch: every other contract in the branch reads its sibling addresses and risk settings from here at construction. The parameters it fixes, none of which can change, are the collateral-ratio thresholds (Minimum 110%, Critical 150%, Shutdown 110%, and a Batch buffer of 10%) and the liquidation penalties (5% when a liquidation is absorbed by the Stability Pool, 10% when it is redistributed across the remaining troves). Its addresses were registered once at deployment and the owner then renounced, so nothing here can be changed afterward.
```

```diff
+   Status: CREATED
    contract MetadataNFT_rETH (eth:0x3400874305E1547020fb8e80eAF1308B757171Af) [liquityv2/MetadataNFT]
    +++ description: A read-only renderer for the trove NFT: it builds the on-chain SVG image and JSON metadata returned for each trove, pulling the embedded fonts through the FixedAssetReader. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract RETHPriceFeed (eth:0x34F1E9c7dcc279ec70d3c4488EB2D80FBa8B7b2B) [liquityv2/RETHPriceFeed]
    +++ description: The price source for the rETH branch. It builds the rETH/USD price from Chainlink's ETH/USD feed and the rETH/ETH rate, using the more conservative of Chainlink's market rETH/ETH feed and the canonical rate reported by the rETH token to blunt upward market manipulation. Fetching the price is permissionless and happens on every branch operation. A Chainlink feed is treated as failed if it reverts, returns a non-positive answer, or grows stale beyond its staleness window, which is 1d for the ETH/USD feed and 2d for the rETH/ETH feed. If the ETH/USD feed or the canonical rate fails the branch is permanently shut down and priced from its last healthy value; if only the rETH/ETH feed fails, the branch shuts down but keeps pricing from the ETH/USD feed and the canonical rate.
```

```diff
+   Status: CREATED
    contract MetadataNFT_wstETH (eth:0x362f822dF79790C8077e61110484Fffa48F682A1) [liquityv2/MetadataNFT]
    +++ description: A read-only renderer for the trove NFT: it builds the on-chain SVG image and JSON metadata returned for each trove, pulling the embedded fonts through the FixedAssetReader. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract CollSurplusPool_wstETH (eth:0x36e6CBdf68f64CF00fC3a6c634A25be32Dd0A235) [liquityv2/CollSurplusPool]
    +++ description: Holds the collateral left over from liquidations. When a liquidated trove is worth more than its debt plus penalty, the excess collateral is set aside here and credited to the former owner by the TroveManager; the owner later reclaims it through the BorrowerOperations. It only ever holds these unclaimed surpluses.
```

```diff
+   Status: CREATED
    contract BorrowerOperations_WETH (eth:0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 110%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 150%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 110%), and it also shuts down automatically if the price feed reports a failure of one of its oracles.
```

```diff
+   Status: CREATED
    contract GasPool_rETH (eth:0x45c81dcE308389e1Bee63ae30A04Fb1e148dad41) [liquityv2/GasPool]
    +++ description: A minimal per-branch vault for WETH gas compensation. Each trove posts a small fixed amount of WETH when it opens, held here and used only to cover liquidation gas: it is returned to the borrower when the trove closes, or paid to the liquidator when the trove is liquidated. The contract has no functions of its own; at deployment it simply grants the branch's BorrowerOperations and TroveManager standing approval to move its WETH for those two purposes.
```

```diff
+   Status: CREATED
    contract ActivePool_wstETH (eth:0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool). It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remainder to the InterestRouter.
```

```diff
+   Status: CREATED
    reference Chainlink_rETH_ETH (eth:0x536218f9E9Eb48863970252233c8F271f554C2d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool_WETH (eth:0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied.
```

```diff
+   Status: CREATED
    contract DefaultPool_rETH (eth:0x5cc5ceFD034Fdc4728D487a72Ca58A410CDdCD6b) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it.
```

```diff
+   Status: CREATED
    contract FixedAssetData_WETH (eth:0x5CcA549ca706C39D68156e5E0a72CcBC95f563d0) [N/A]
    +++ description: A data contract holding the raw asset bytes (an embedded font and the collateral logos) used to render the trove NFT image. The bytes are stored as the contract's own bytecode via the SSTORE2 pattern rather than as executable code, so it has no logic and no Solidity source; the FixedAssetReader slices out the assets it needs.
```

```diff
+   Status: CREATED
    reference Chainlink_ETH_USD (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressesRegistry_rETH (eth:0x6106046F031a22713697e04C08B330dDaf3e8789) [liquityv2/AddressesRegistry]
    +++ description: The immutable address book and risk-parameter store for a single collateral branch: every other contract in the branch reads its sibling addresses and risk settings from here at construction. The parameters it fixes, none of which can change, are the collateral-ratio thresholds (Minimum 120%, Critical 160%, Shutdown 120%, and a Batch buffer of 10%) and the liquidation penalties (5% when a liquidation is absorbed by the Stability Pool, 20% when it is redistributed across the remaining troves). Its addresses were registered once at deployment and the owner then renounced, so nothing here can be changed afterward.
```

```diff
+   Status: CREATED
    contract BOLD Stablecoin Token (eth:0x6440f144b7e50D6a8439336510312d2F54beB01D) [liquityv2/BoldToken]
    +++ description: BOLD, the protocol's stablecoin and the debt side of every trove. It is a standard ERC20 with permit, so anyone can hold, transfer, and approve it, but only the protocol's own branch contracts can create or destroy it. New BOLD is minted when a borrower draws debt (by a branch's BorrowerOperations or ActivePool) and burned when debt is repaid, liquidated, or redeemed (by a branch's BorrowerOperations, TroveManager, or StabilityPool, or by the CollateralRegistry on redemption), so the total supply always tracks the system's outstanding debt. The set of addresses allowed to mint and burn is a fixed whitelist: each branch's contracts were registered once at deployment, after which ownership was renounced, so no minter or burner can ever be added or removed.
```

```diff
+   Status: CREATED
    contract UserProxy (eth:0x65f9A98009Aecaa3fc8A3A83FEF44e2b6931A7b2) [liquityv2/UserProxy]
    +++ description: A per-staker proxy deployed by the Governance to hold and stake one user's LQTY. It forwards the LQTY into Liquity's legacy V1 staking, so the staker keeps earning the V1 fee rewards (LUSD and ETH) while that same LQTY backs their V2 voting power, and it passes those rewards back to the staker. Only the Governance can operate it.
```

```diff
+   Status: CREATED
    contract TroveNFT_rETH (eth:0x7ae430E25b67f19B431e1D1Dc048a5BCF24C0873) [liquityv2/TroveNFT]
    +++ description: The ERC721 that represents ownership of a trove: opening one mints an NFT and closing it burns one, both by the branch's TroveManager. The holder of a trove's NFT is its owner, with full control over the position, and transferring the NFT hands the entire trove, collateral and debt alike, to the new holder. In every other respect it is a standard ERC721.
```

```diff
+   Status: CREATED
    contract GasPool_WETH (eth:0x7b9ab3DE4036caE51F1fa4ec0a2C2fd606bCF921) [liquityv2/GasPool]
    +++ description: A minimal per-branch vault for WETH gas compensation. Each trove posts a small fixed amount of WETH when it opens, held here and used only to cover liquidation gas: it is returned to the borrower when the trove closes, or paid to the liquidator when the trove is liquidated. The contract has no functions of its own; at deployment it simply grants the branch's BorrowerOperations and TroveManager standing approval to move its WETH for those two purposes.
```

```diff
+   Status: CREATED
    contract TroveManager_WETH (eth:0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a penalty) is either absorbed by the StabilityPool at a 5% penalty or redistributed across the remaining troves at a 10% penalty, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. If the branch is ever shut down, redemption instead runs directly through this contract in an urgent mode: BOLD holders can redeem against troves of their own choosing, in any order, and are paid a 2% collateral bonus rather than a fee, so the branch can be wound down and its remaining debt cleared.
```

```diff
+   Status: CREATED
    contract Governance (eth:0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1) [liquityv2/Governance]
    +++ description: The protocol's revenue router and LQTY-staking governance. Every branch sends the share of borrower interest not paid to Stability Pool depositors to this contract, which hands that BOLD out to community initiatives chosen by LQTY holders. Anyone can stake LQTY here (each staker gets a personal proxy that also stakes into Liquity's legacy V1 staking), earning voting power that grows the longer it stays staked. Time is split into fixed 7d epochs; within each epoch stakers allocate their voting power across initiatives as votes and vetoes, and any initiative whose net votes clear the voting threshold becomes eligible for a share of the accrued BOLD, which anyone can then pay out to it. Registering a new initiative (for a 100 BOLD fee), unregistering a stale one, and triggering payouts are all permissionless. The starting set of initiatives was registered once at launch, after which ownership was renounced, so there is no privileged operator.
```

```diff
+   Status: CREATED
    contract FixedAssetReader_WETH (eth:0x84087689B0D6a8A8f11C297e9e7f8De99f398258) [liquityv2/FixedAssetReader]
    +++ description: A read-only accessor for the embedded font data used to draw the trove NFT image. It reads the raw bytes out of the FixedAssetData data contract (stored via the SSTORE2 pattern) and serves them to the MetadataNFT renderer. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract SortedTroves_wstETH (eth:0x84eb85a8C25049255614F0536Bea8F31682e86F1) [liquityv2/SortedTroves]
    +++ description: The branch's troves kept as a doubly-linked list ordered by annual interest rate, so any trove's position relative to the others is known at a glance. It is maintained only by the branch's BorrowerOperations and TroveManager, which insert, remove, and re-position troves as they open, close, or change their rate. It holds no funds and stores nothing but the ordering.
```

```diff
+   Status: CREATED
    contract TroveNFT_wstETH (eth:0x857aECeBF75f1012DC18E15020C97096aeA31b04) [liquityv2/TroveNFT]
    +++ description: The ERC721 that represents ownership of a trove: opening one mints an NFT and closing it burns one, both by the branch's TroveManager. The holder of a trove's NFT is its owner, with full control over the position, and transferring the NFT hands the entire trove, collateral and debt alike, to the new holder. In every other respect it is a standard ERC721.
```

```diff
+   Status: CREATED
    contract FixedAssetData_rETH (eth:0x884Acfa4593a6FdbA0a9373007E48Ea9AF881C42) [N/A]
    +++ description: A data contract holding the raw asset bytes (an embedded font and the collateral logos) used to render the trove NFT image. The bytes are stored as the contract's own bytecode via the SSTORE2 pattern rather than as executable code, so it has no logic and no Solidity source; the FixedAssetReader slices out the assets it needs.
```

```diff
+   Status: CREATED
    contract GasPool_wstETH (eth:0x8C44FBa379D8A8608C0e29B2729DeB75a981Db1f) [liquityv2/GasPool]
    +++ description: A minimal per-branch vault for WETH gas compensation. Each trove posts a small fixed amount of WETH when it opens, held here and used only to cover liquidation gas: it is returned to the borrower when the trove closes, or paid to the liquidator when the trove is liquidated. The contract has no functions of its own; at deployment it simply grants the branch's BorrowerOperations and TroveManager standing approval to move its WETH for those two purposes.
```

```diff
+   Status: CREATED
    contract AddressesRegistry_wstETH (eth:0x8d733F7ea7c23Cbea7C613B6eBd845d46d3aAc54) [liquityv2/AddressesRegistry]
    +++ description: The immutable address book and risk-parameter store for a single collateral branch: every other contract in the branch reads its sibling addresses and risk settings from here at construction. The parameters it fixes, none of which can change, are the collateral-ratio thresholds (Minimum 120%, Critical 160%, Shutdown 120%, and a Batch buffer of 10%) and the liquidation penalties (5% when a liquidation is absorbed by the Stability Pool, 20% when it is redistributed across the remaining troves). Its addresses were registered once at deployment and the owner then renounced, so nothing here can be changed afterward.
```

```diff
+   Status: CREATED
    contract ActivePool_rETH (eth:0x9074D72cc82DaD1e13E454755Aa8f144c479532F) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool). It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remainder to the InterestRouter.
```

```diff
+   Status: CREATED
    contract StabilityPool_wstETH (eth:0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied.
```

```diff
+   Status: CREATED
    contract MetadataNFT_WETH (eth:0x9B36C3B16299D68c79F174df7e728E35b6AF4A12) [liquityv2/MetadataNFT]
    +++ description: A read-only renderer for the trove NFT: it builds the on-chain SVG image and JSON metadata returned for each trove, pulling the embedded fonts through the FixedAssetReader. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract SortedTroves_WETH (eth:0xA25269E41BD072513849F2E64Ad221e84f3063F4) [liquityv2/SortedTroves]
    +++ description: The branch's troves kept as a doubly-linked list ordered by annual interest rate, so any trove's position relative to the others is known at a glance. It is maintained only by the branch's BorrowerOperations and TroveManager, which insert, remove, and re-position troves as they open, close, or change their rate. It holds no funds and stores nothing but the ordering.
```

```diff
+   Status: CREATED
    contract TroveManager_wstETH (eth:0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a penalty) is either absorbed by the StabilityPool at a 5% penalty or redistributed across the remaining troves at a 20% penalty, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. If the branch is ever shut down, redemption instead runs directly through this contract in an urgent mode: BOLD holders can redeem against troves of their own choosing, in any order, and are paid a 2% collateral bonus rather than a fee, so the branch can be wound down and its remaining debt cleared.
```

```diff
+   Status: CREATED
    contract FixedAssetReader_wstETH (eth:0xa5224865040034A9f8E5C60e0a616c9c8A63f237) [liquityv2/FixedAssetReader]
    +++ description: A read-only accessor for the embedded font data used to draw the trove NFT image. It reads the raw bytes out of the FixedAssetData data contract (stored via the SSTORE2 pattern) and serves them to the MetadataNFT renderer. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract BorrowerOperations_wstETH (eth:0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 120%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 160%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 120%), and it also shuts down automatically if the price feed reports a failure of one of its oracles.
```

```diff
+   Status: CREATED
    contract TroveManager_rETH (eth:0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) [liquityv2/TroveManager]
    +++ description: The branch's ledger and enforcement engine. It holds the canonical record of every trove on this collateral branch (debt, collateral, stake, interest rate, and accounting snapshots) and is where BorrowerOperations persists changes when owners open, adjust, or close their troves. It also carries out the two things that happen to a trove without its owner. Liquidation is permissionless: once a trove's collateral ratio falls below the branch minimum, anyone can liquidate it, and its collateral (up to the debt plus a penalty) is either absorbed by the StabilityPool at a 5% penalty or redistributed across the remaining troves at a 20% penalty, with any surplus returned to the owner. Redemption is driven by the CollateralRegistry, which exchanges BOLD for collateral at face value against the lowest-interest-rate troves first, letting BOLD holders defend the peg. If the branch is ever shut down, redemption instead runs directly through this contract in an urgent mode: BOLD holders can redeem against troves of their own choosing, in any order, and are paid a 2% collateral bonus rather than a fee, so the branch can be wound down and its remaining debt cleared.
```

```diff
+   Status: CREATED
    contract CollSurplusPool_rETH (eth:0xba4A2bD8b76DF84CaC98eBa3f4b967D8423192bF) [liquityv2/CollSurplusPool]
    +++ description: Holds the collateral left over from liquidations. When a liquidated trove is worth more than its debt plus penalty, the excess collateral is set aside here and credited to the former owner by the TroveManager; the owner later reclaims it through the BorrowerOperations. It only ever holds these unclaimed surpluses.
```

```diff
+   Status: CREATED
    contract WETHPriceFeed (eth:0xCC5F8102eb670c89a4a3c567C13851260303c24F) [liquityv2/WETHPriceFeed]
    +++ description: The price source for the WETH branch: it reports the collateral's USD value by reading Chainlink's ETH/USD feed. Fetching the price is permissionless and happens on every branch operation. If that feed fails, meaning it reverts, returns a zero or negative answer, or has not updated within its 1d staleness window, the branch is permanently shut down and thereafter priced from the last value recorded while the feed was healthy.
```

```diff
+   Status: CREATED
    contract FixedAssetReader_rETH (eth:0xcC77baf5706BDf7CFA7FefD5337833e2e1fd0d8e) [liquityv2/FixedAssetReader]
    +++ description: A read-only accessor for the embedded font data used to draw the trove NFT image. It reads the raw bytes out of the FixedAssetData data contract (stored via the SSTORE2 pattern) and serves them to the MetadataNFT renderer. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    reference Chainlink_stETH_USD (eth:0xCfE54B5cD566aB89272946F602D76Ea879CAb4a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool_rETH (eth:0xd442E41019B7F5C4dD78F50dc03726C446148695) [liquityv2/StabilityPool]
    +++ description: The branch's liquidation backstop. Anyone can deposit BOLD here, and those deposits are the first resource used to absorb liquidations: when a trove on this branch is liquidated, the pool burns BOLD to cancel an equal amount of that trove's debt and receives the corresponding collateral in return. Because that collateral is worth more than the debt cancelled, depositors generally come out ahead on each liquidation, and they also earn a share of the interest that branch borrowers pay. Deposits can be withdrawn at any time with no lock-up, as long as a small minimum is left so the pool can never be fully emptied.
```

```diff
+   Status: CREATED
    contract DefaultPool_WETH (eth:0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it.
```

```diff
+   Status: CREATED
    contract DefaultPool_wstETH (eth:0xD796e1648526400386CC4d12FA05E5F11e6a22A1) [liquityv2/DefaultPool]
    +++ description: The counterpart to the ActivePool that holds only what is pending redistribution. When a liquidation cannot be fully covered by the StabilityPool, the liquidated trove's collateral and debt are spread across the remaining troves, and until each of those troves actually realizes its share this pool holds it: the redistributed collateral as real tokens, and the redistributed debt as a bookkeeping figure (no BOLD is kept here). When a trove is next touched and its pending share is applied, that collateral and debt move out of here into the ActivePool. Only the branch's TroveManager (which adjusts the recorded debt and moves collateral out to the ActivePool) and the ActivePool (which moves collateral in) can touch it.
```

```diff
+   Status: CREATED
    contract WSTETHPriceFeed (eth:0xe7Aa2Ba9E086A379d3beb224098bC634a46e314E) [liquityv2/WSTETHPriceFeed]
    +++ description: The price source for the wstETH branch. It builds the wstETH/USD price from two inputs: Chainlink's stETH/USD feed and the wstETH-to-stETH exchange rate reported by the wstETH token. Fetching the price is permissionless and happens on every branch operation. A Chainlink feed is treated as failed if it reverts, returns a non-positive answer, or has not updated within its 1d staleness window. If the exchange rate or the ETH/USD reference feed fails the branch is permanently shut down and priced from its last healthy value; if only the stETH/USD feed fails, the branch shuts down but keeps pricing from the ETH/USD feed and the exchange rate.
```

```diff
+   Status: CREATED
    contract BorrowerOperations_rETH (eth:0xe8119fC02953B27a1b48D2573855738485A17329) [liquityv2/BorrowerOperations]
    +++ description: User-facing entry point of a single collateral branch. Borrowers open, adjust, and close troves here (depositing or withdrawing collateral and drawing or repaying BOLD), set their interest rate directly or by joining an interest-rate batch, and delegate trove management. It mints and burns BOLD as debt is drawn and repaid, and enforces the branch's collateral-ratio rules. A trove becomes liquidatable once its individual collateral ratio falls below the Minimum Collateral Ratio (MCR, 120%); troves managed by an interest-rate batch are held to the stronger MCR plus Batch Collateral Ratio buffer (BCR, 10%). While the branch's total collateral ratio is below the Critical Collateral Ratio (CCR, 160%) the branch is in restricted mode and borrowing operations that would lower it further are blocked. Anyone can shut the branch down once its total collateral ratio falls below the Shutdown Collateral Ratio (SCR, 120%), and it also shuts down automatically if the price feed reports a failure of one of its oracles.
```

```diff
+   Status: CREATED
    contract ActivePool_WETH (eth:0xeB5A8C825582965f1d84606E078620a84ab16AfE) [liquityv2/ActivePool]
    +++ description: The branch's collateral vault and interest engine. It custodies the collateral of every active trove on this branch and tracks the branch's aggregate BOLD debt. Collateral only moves in or out on instruction from the branch's own contracts (the BorrowerOperations, TroveManager, StabilityPool, and DefaultPool). It is also where borrower interest is realized: when the branch's aggregate interest is settled, the newly accrued amount is minted as fresh BOLD and split, with 75% going to the StabilityPool as depositor yield and the remainder to the InterestRouter.
```

```diff
+   Status: CREATED
    contract CollSurplusPool_WETH (eth:0xedbE2509E502c0320D2e7f8b6746a49b4B50E2bF) [liquityv2/CollSurplusPool]
    +++ description: Holds the collateral left over from liquidations. When a liquidated trove is worth more than its debt plus penalty, the excess collateral is set aside here and credited to the former owner by the TroveManager; the owner later reclaims it through the BorrowerOperations. It only ever holds these unclaimed surpluses.
```

```diff
+   Status: CREATED
    contract HintHelpers (eth:0xF0caE19C96E572234398d6665cC1147A16cBe657) [liquityv2/HintHelpers]
    +++ description: A read-only helper for locating where a trove sits in a branch's interest-rate ordering. Off-chain callers use it to compute the position hints that keep opening and adjusting troves gas-efficient. It holds no funds and changes no state.
```

```diff
+   Status: CREATED
    contract FixedAssetData_wstETH (eth:0xf4a3fE99227F6060e4C1c62b557EEE050B6483E4) [N/A]
    +++ description: A data contract holding the raw asset bytes (an embedded font and the collateral logos) used to render the trove NFT image. The bytes are stored as the contract's own bytecode via the SSTORE2 pattern rather than as executable code, so it has no logic and no Solidity source; the FixedAssetReader slices out the assets it needs.
```

```diff
+   Status: CREATED
    contract CollateralRegistry (eth:0xf949982B91C8c61e952B3bA942cbbfaef5386684) [liquityv2/CollateralRegistry]
    +++ description: The protocol's redemption hub and the registry of its collateral branches: it stores only the address of each branch's collateral token and TroveManager, 3 branches in all, fixed at construction, and custodies no funds itself. Redemption is what keeps BOLD near its dollar peg. Anyone can hand in BOLD and receive an equal dollar value of collateral drawn from the branches, so whenever BOLD trades below a dollar it becomes profitable to buy it up and redeem it. Each redemption is spread across the branches in proportion to their unbacked debt, meaning the debt a branch has not covered with Stability Pool deposits, so redemptions land hardest on the branches whose Stability Pools back them the least; a branch is skipped if it has been shut down or its total collateral ratio has fallen below the shutdown threshold. The redeemer pays a fee taken from the collateral they receive, set by a base rate that jumps up with the size of the redemption relative to total BOLD supply and decays back down over time, but never below a 0.5% floor.
```

```diff
+   Status: CREATED
    contract MultiTroveGetter (eth:0xFA61dB085510C64B83056Db3A7Acf3b6f631D235) [liquityv2/MultiTroveGetter]
    +++ description: A read-only helper that returns trove data in bulk, so front-ends and indexers can page through a branch's troves in a single call. It holds no funds and changes no state.
```
