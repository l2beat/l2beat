Generated with discovered.json: 0x2015876e3017b862d46539579f3f939f14a7e349

# Diff at Fri, 21 Aug 2026 08:35:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1787300652

## Description

Initial discovery of Frankencoin, an oracle-free stablecoin protocol issuing ZCHF, minted against arbitrary collateral in auction-policed CDPs and 1:1 against whitelisted CHF stablecoins. All 18 contracts are immutable with no admin keys: ZCHF supply is controlled by 11 registered minter modules that anyone can propose and FPS pool share holders (2% of time-weighted votes) can veto during a public application period, after which a minter is irrevocable — the system's central trust assumption. All protocol income accrues to an equity reserve (FPS) that absorbs losses first; savers earn a governance-set rate directly or via the immutable svZCHF ERC4626 vault, and ZCHF expands to other chains through a rate-limited Chainlink CCIP token pool governed by the same FPS quorum.

## Initial discovery

```diff
+   Status: CREATED
    contract PositionFactory (eth:0x0CDE500e6940931ED190ded77bb48640c9486392) [frankencoin/PositionFactory]
    +++ description: Stateless factory that deploys new Position contracts and ERC-1167 minimal proxies targeting the original contract of a supplied Position.
```

```diff
+   Status: CREATED
    contract Equity (eth:0x1bA26788dfDe592fec8bcB0Eaff472a42BE341B2) [frankencoin/Equity]
    +++ description: Reserve of the Frankencoin system and its governance token (FPS): holds all ZCHF reserves and absorbs losses before ZCHF holders do. FPS is minted and redeemed permissionlessly against ZCHF at a formula price (3x underlying equity, 90-day minimum holding before redemption). Votes equal FPS balance times holding time; 2% of total votes qualifies an address (with delegates) for all veto and proposal rights in the system. There is no admin.
```

```diff
+   Status: CREATED
    contract CCIPAdmin (eth:0x2527ec458c863073a303CF0a362Bf78aDD5dFEf8) [frankencoin/CCIPAdmin]
    +++ description: Owner and admin of the ZCHF CCIP token pool and of the ZCHF entry in Chainlink's TokenAdminRegistry. Every action requires 2% of FPS votes: pool configuration changes (adding/removing chains and remote pools) execute after a 7-day timelock, handover of the admin role after 21 days; setting rate limits and vetoing pending proposals is immediate.
```

```diff
+   Status: CREATED
    contract Savings (eth:0x27d9AD987BdE08a0d083ef7e0e4043C857A17B38) [frankencoin/Savings]
    +++ description: Current savings module: deposited ZCHF earns a governance-set interest rate, minted against the equity reserve (3-day interest delay on deposits). Savers can opt into a referral fee of up to 25% of their interest for frontends. Rate changes are proposed by qualified FPS holders and take effect after 7 days unless replaced by a counter-proposal.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeVCHF (eth:0x3B71ba73299F925a837836160c3E1Fec74340403) [frankencoin/StablecoinBridge]
    +++ description: Mints ZCHF against a whitelisted Swiss franc stablecoin held in escrow, at a fixed 1:1 (decimal-adjusted) rate, up to a hard cap and only until its expiration (see isExpired). An expired bridge is permanently mint-disabled, but ZCHF from it can always be burned to redeem the escrowed stablecoin. A depeg or freeze of the escrowed stablecoin impairs ZCHF backing up to the cap.
```

```diff
+   Status: CREATED
    contract SavingsV2 (eth:0x3BF301B0e2003E75A3e86AB82bD1EFF6A9dFB2aE) [frankencoin/SavingsV2]
    +++ description: Original savings module, superseded as a savings product by the current Savings module but still the system's authoritative leadrate source: MintingHubV2 positions pay this contract's rate plus their risk premium (remaining depositors earn it, minted against the equity reserve and capped by it). Rate changes are proposed by qualified FPS holders and take effect after 7 days unless replaced by a counter-proposal.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeCHFAU (eth:0x3e445ff4ddDf0ff8aE7458c9746eD80bD664F6C1) [frankencoin/StablecoinBridge]
    +++ description: Mints ZCHF against a whitelisted Swiss franc stablecoin held in escrow, at a fixed 1:1 (decimal-adjusted) rate, up to a hard cap and only until its expiration (see isExpired). An expired bridge is permanently mint-disabled, but ZCHF from it can always be burned to redeem the escrowed stablecoin. A depeg or freeze of the escrowed stablecoin impairs ZCHF backing up to the cap.
```

```diff
+   Status: CREATED
    contract Position (eth:0x49C431454C40ecbf848096f2753B2ABC3A699a10) [frankencoin/Position]
    +++ description: Collateralized debt position whose owner can mint the configured stablecoin against a fixed ERC20 collateral, subject to a declared liquidation price and fixed minimum collateral, risk premium, challenge period, and expiration. A full Position deployment tracks the minting limit for its clone family and acts as the implementation and immutable-parameter source for ERC-1167 child positions; the configured hub conducts challenges and forced collateral sales.
```

```diff
+   Status: CREATED
    contract LeadrateSender (eth:0x4d433780A16d425c5dB1F725A6d104233a8Ef28D) [frankencoin/LeadrateSender]
    +++ description: Permissionless helper that pushes the Savings module's current interest rate to bridged savings modules on other chains via CCIP; anyone can trigger a push by paying the CCIP fee.
```

```diff
+   Status: CREATED
    contract FPSWrapper (eth:0x5052D3Cc819f53116641e89b96Ff4cD1EE80B182) [frankencoin/FPSWrapper]
    +++ description: Wrapper token (WFPS) for FPS. Wrapped shares cannot vote individually and can be unwrapped or redeemed for ZCHF at any time, subject to the wrapper's collective holding duration.
```

```diff
+   Status: CREATED
    contract PositionFactory (eth:0x728310FeaCa72dc46cD5BF7d739556D5668472BA) [frankencoin/PositionFactory]
    +++ description: Stateless factory that deploys new Position contracts and ERC-1167 minimal proxies targeting the original contract of a supplied Position.
```

```diff
+   Status: CREATED
    contract MintingHubV1 (eth:0x7546762fdb1a6d9146b33960545C3f6394265219) [frankencoin/MintingHubV1]
    +++ description: Deprecated first version of the minting hub with the same oracle-free, auction-policed design (fixed upfront fees instead of the leadrate-linked interest of V2). The official frontend no longer supports it, but it remains a registered minter forever and stays permissionlessly usable.
```

```diff
+   Status: CREATED
    contract StablecoinBridgeXCHF (eth:0x7bbe8F18040aF0032f4C2435E7a76db6F1E346DF) [frankencoin/StablecoinBridge]
    +++ description: Mints ZCHF against a whitelisted Swiss franc stablecoin held in escrow, at a fixed 1:1 (decimal-adjusted) rate, up to a hard cap and only until its expiration (see isExpired). An expired bridge is permanently mint-disabled, but ZCHF from it can always be burned to redeem the escrowed stablecoin. A depeg or freeze of the escrowed stablecoin impairs ZCHF backing up to the cap.
```

```diff
+   Status: CREATED
    contract AmplifiedPosition (eth:0x8746159D385f84CB550ab5aE015c0dDf6909b8f2) [frankencoin/AmplifiedPosition]
    +++ description: Position template for ZCHF USDT uniswap amplified positions.
```

```diff
+   Status: CREATED
    contract BridgeAccounting (eth:0x88fd2ECD0B9250F203e99E80eb78b0C32B8AdB16) [frankencoin/BridgeAccounting]
    +++ description: Books profit/loss settlements from bridged Frankencoin deployments on other chains into the mainnet reserve (it is a registered minter). Accepts CCIP messages only from the ZCHF token contracts registered in the token pool.
```

```diff
+   Status: CREATED
    contract BurnMintTokenPool (eth:0x9359cd75549DaE00Cdd8D22297BC9B13FbBe4B79) [transporter/TokenPool]
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapAmplifier (eth:0xa1304E5Aaf83CDB7c2b367F50B99Bb0647ED8C58) [frankencoin/UniswapAmplifier]
    +++ description: Allows to create uniswap positions with ZCHF borrowed from the protocol on one side and USDT supplied by the user on the other. There are multiple contraints on what kind of positions can be created.
```

```diff
+   Status: CREATED
    contract PositionRoller (eth:0xAD0107D3Da540Fd54b1931735b65110C909ea6B6) [frankencoin/PositionRoller]
    +++ description: Helper that rolls debt and collateral from one minting position into another in a single transaction. It is a registered minter but uses that right only transiently within a roll.
```

```diff
+   Status: CREATED
    contract Frankencoin (eth:0xB58E61C3098d85632Df34EecfB899A1Ed80921cB) [frankencoin/Frankencoin]
    +++ description: The ZCHF stablecoin token. Immutable and ownerless: supply is controlled exclusively by registered 'minter' modules. Anyone can apply to add a minter by paying a fee of at least 1,000 ZCHF; it becomes active unless vetoed by FPS holders with 2% of votes during the application period (at least 14 days). Once active, a minter is irrevocable.
```

```diff
+   Status: CREATED
    contract MintingHubV2 (eth:0xDe12B620A8a714476A97EfD14E6F7180Ca653557) [frankencoin/MintingHubV2]
    +++ description: Permissionless factory for collateralized ZCHF minting positions: anyone can open a position with any ERC20 collateral and a self-declared liquidation price for a 1,000 ZCHF fee, or clone an approved one for free. No price oracle is used; anyone can challenge an overpriced position in a collateral auction (2% challenger reward) and qualified FPS holders (2% of votes) can veto new positions during their initialization period. Positions prepay interest (leadrate plus a fixed risk premium) at minting for the term to expiration and are individually registered as minters (not listed here).
```

```diff
+   Status: CREATED
    contract SavingsVault (eth:0xE5F130253fF137f9917C0107659A4c5262abf6b0) [frankencoin/SavingsVault]
    +++ description: ERC4626 vault (svZCHF) over the Savings module: deposited ZCHF is forwarded there and interest auto-compounds into the share price. Ownership has been renounced, so its only privileged function (activating a referral-fee skim of up to 25% of interest) is permanently disabled and the vault is fully immutable.
```

```diff
+   Status: CREATED
    contract TransferReference (eth:0xf98c221661F51578f5E5236B189a493E2a8a1916) [frankencoin/TransferReference]
    +++ description: Convenience contract for ZCHF transfers with an attached payment reference, on Ethereum and cross-chain via CCIP. It is registered as a minter solely for the resulting unlimited allowance; its code only moves funds of the caller or of accounts that granted the caller an explicit infinite allowance.
```

```diff
+   Status: CREATED
    contract GovernanceSender (eth:0xFD23272DfcB13Dc3Fabd8DB851fCD4827Af876EB) [frankencoin/GovernanceSender]
    +++ description: Permissionless helper that pushes FPS voting-power snapshots to bridged governance contracts on other chains via CCIP; anyone can trigger a sync by paying the CCIP fee.
```
