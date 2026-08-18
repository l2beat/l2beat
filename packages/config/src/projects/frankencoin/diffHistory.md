Generated with discovered.json: 0xbda75a31977b90190e76c62be4aa042210f020b1

# Diff at Tue, 18 Aug 2026 07:58:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1787039840

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Equity (eth:0x1bA26788dfDe592fec8bcB0Eaff472a42BE341B2) [N/A]
    +++ description: Reserve pool of the Frankencoin system and ERC20 governance token (Frankencoin Pool Share, FPS). It holds all ZCHF reserves (minter reserves and equity). Anyone can mint FPS by depositing ZCHF at a price of 3x the underlying equity per share and redeem after a minimum holding period of 90 days. Votes are proportional to FPS balance multiplied by holding time; holders (with delegation helpers) reaching 2% of total votes are 'qualified' to exercise governance vetoes and proposals across the system. There is no admin: governance actions are hardcoded quorum checks. If equity falls below 1000 ZCHF (e.g. after covering large losses), qualified holders can restructure the cap table and wipe out passive shareholders.
```

```diff
+   Status: CREATED
    contract CCIPAdmin (eth:0x2527ec458c863073a303CF0a362Bf78aDD5dFEf8) [N/A]
    +++ description: Governance wrapper that owns and administers the ZCHF CCIPTokenPool and the ZCHF entry in Chainlink's TokenAdminRegistry. All actions are driven by qualified FPS holders: configuration changes (adding/removing supported chains and remote pools) are proposed with a 7-day timelock and transferring the admin role itself with a 21-day timelock; after the delay anyone can execute. Qualified holders can also deny pending proposals and set CCIP rate limits immediately.
```

```diff
+   Status: CREATED
    contract Savings (eth:0x27d9AD987BdE08a0d083ef7e0e4043C857A17B38) [N/A]
    +++ description: Current savings module (with referral-fee support). ZCHF savers deposit here to earn the module's governance-set interest rate; interest is minted continuously against the equity reserve (booked as a loss to Equity). Savers can optionally set a referrer (e.g. a frontend) that earns up to 25% of their collected interest. The SavingsVault (svZCHF) deposits into this module, and the LeadrateSender broadcasts this module's rate to Frankencoin deployments on other chains. Rate changes are proposed by qualified FPS holders (2% of votes) and can be applied by anyone after a 7-day delay.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeVCHF (eth:0x3B71ba73299F925a837836160c3E1Fec74340403) [N/A]
    +++ description: Bridge that mints ZCHF 1:1 against the VCHF (VNX Swiss Franc) stablecoin, up to a limit of 2M ZCHF and until its one-year horizon (April 2026). ZCHF can always be burned to redeem the VCHF held here.
```

```diff
+   Status: CREATED
    contract SavingsV2 (eth:0x3BF301B0e2003E75A3e86AB82bD1EFF6A9dFB2aE) [N/A]
    +++ description: Original savings module of the Frankencoin V2 system, still active. Its governance-set interest rate is the system's leadrate: MintingHubV2 positions pay this rate plus their risk premium. ZCHF savers deposit here to earn the leadrate (interest is minted against the equity reserve and capped by it), with a 3-day interest delay/lockup on deposits. Rate changes are proposed by qualified FPS holders (2% of votes) and can be applied by anyone after a 7-day delay.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeCHFAU (eth:0x3e445ff4ddDf0ff8aE7458c9746eD80bD664F6C1) [N/A]
    +++ description: Bridge that mints ZCHF against the CHFAU (Alpen Blue Swiss Franc, 6 decimals) stablecoin at a decimal-adjusted 1:1 rate, up to a limit of 10M ZCHF and until its one-year horizon (April 2027). ZCHF can always be burned to redeem the CHFAU held here.
```

```diff
+   Status: CREATED
    contract LeadrateSender (eth:0x4d433780A16d425c5dB1F725A6d104233a8Ef28D) [N/A]
    +++ description: Permissionless helper that pushes the current interest rate of the Savings module to bridged Frankencoin savings modules on other chains via CCIP. Anyone can trigger a push by paying the CCIP fee.
```

```diff
+   Status: CREATED
    contract FPSWrapper (eth:0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182) [N/A]
    +++ description: Wrapper token (WFPS) for the FPS governance token, e.g. for use on other chains or venues. Wrapped shares cannot vote individually. Anyone can unwrap, or directly redeem the underlying FPS for ZCHF through unwrapAndSell() (subject to the wrapper's collective holding duration).
```

```diff
+   Status: CREATED
    contract MintingHubV1 (eth:0x7546762fdb1a6d9146b33960545C3f6394265219) [N/A]
    +++ description: First, now deprecated version of the hub for collateralized minting positions (fixed upfront fees instead of continuous interest). It remains a registered minter and technically still allows opening positions, but the official frontend has migrated to MintingHubV2.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeXCHF (eth:0x7bbe8F18040aF0032f4C2435E7a76db6F1E346DF) [N/A]
    +++ description: Bootstrap bridge that minted ZCHF 1:1 against the XCHF (CryptoFranc) stablecoin. Its one-year minting horizon expired in October 2024, so it can no longer mint; remaining ZCHF from this bridge can still be burned to redeem the XCHF held here.
```

```diff
+   Status: CREATED
    contract BridgeAccounting (eth:0x88fd2ECD0B9250F203e99E80eb78b0C32B8AdB16) [N/A]
    +++ description: Receives profit/loss settlement messages from bridged Frankencoin deployments on other chains via CCIP and books them into the mainnet system: received ZCHF profits are collected into the Equity reserve, reported losses are covered from it (this contract is a registered minter). Only accepts messages from the registered remote token contracts.
```

```diff
+   Status: CREATED
    contract CCIPTokenPool (eth:0x9359cd75549DaE00Cdd8D22297BC9B13FbBe4B79) [transporter/TokenPool]
    +++ description: Chainlink CCIP BurnMintTokenPool for ZCHF: burns ZCHF on Ethereum when bridging out and mints ZCHF (it is a registered minter) when bridging in from supported chains. Owned and configured by the CCIPAdmin contract; minting is gated by Chainlink's CCIP offramps and the per-chain rate limits.
```

```diff
+   Status: CREATED
    contract PositionRoller (eth:0xAD0107D3Da540Fd54b1931735b65110C909ea6B6) [N/A]
    +++ description: Helper (registered as minter) that lets position owners roll their debt and collateral from one minting position into another (e.g. into a later expiration) in a single transaction, using its minting rights to flash-repay the source position.
```

```diff
+   Status: CREATED
    contract Frankencoin (eth:0xB58E61C3098d85632Df34EecfB899A1Ed80921cB) [N/A]
    +++ description: The Frankencoin (ZCHF) token, an ERC20 stablecoin tracking the Swiss franc. The contract itself is immutable and has no owner: all supply changes go through 'minter' modules that anyone can suggest by paying a 1000 ZCHF application fee and that become active unless vetoed by qualified FPS holders within the application period. Registered minters (and the positions they register) can mint and burn ZCHF freely and book profits and losses against the reserve held in the Equity contract.
```

```diff
+   Status: CREATED
    contract MintingHubV2 (eth:0xDe12B620A8a714476A97EfD14E6F7180Ca653557) [N/A]
    +++ description: Second and current version of the hub for collateralized minting positions. Anyone can permissionlessly open a position with arbitrary ERC20 collateral (min 5000 ZCHF worth) against a 1000 ZCHF opening fee, or clone an existing position. New or cloned positions can be vetoed on the position contract by qualified FPS holders (2% of votes) during the position's initialization period. Once live, positions mint ZCHF against their collateral at an interest rate of leadrate (from the SavingsV2 contract) plus a position-specific risk premium, and are kept honest through permissionless collateral auctions (challenges) that reward the challenger with 2% and penalize undercollateralized owners. Individual position contracts are registered as minters via this hub and are not listed individually here.
```

```diff
+   Status: CREATED
    contract SavingsVault (eth:0xE5F130253fF137f9917C0107659A4c5262abf6b0) [N/A]
    +++ description: ERC4626 tokenized vault (svZCHF) wrapping the Savings module: deposited ZCHF is forwarded to the Savings module and accrued interest is auto-compounded into the share price. Ownership of the vault has been renounced, so the owner-only referral-fee skim (up to 25% of interest to a referrer) can never be activated and the vault is fully immutable. Vault shares are freely transferable and withdrawals are only limited by the Savings module's 3-day interest delay accounting.
```

```diff
+   Status: CREATED
    contract TransferReference (eth:0xf98c221661F51578f5E5236B189a493E2a8a1916) [N/A]
    +++ description: Convenience contract for ZCHF transfers with an attached payment reference (e.g. for invoicing), both on Ethereum and cross-chain via CCIP. It is a registered minter, which grants it unlimited ZCHF transfer allowance from every account; its code only ever moves funds of the calling account, or of accounts that granted the caller an explicit infinite allowance.
```

```diff
+   Status: CREATED
    contract GovernanceSender (eth:0xFD23272DfcB13Dc3Fabd8DB851fCD4827Af876EB) [N/A]
    +++ description: Permissionless helper that pushes FPS voting-power snapshots from the Equity contract to bridged governance contracts on other chains via CCIP, enabling qualified FPS holders to exercise governance there. Anyone can trigger a sync by paying the CCIP fee.
```
