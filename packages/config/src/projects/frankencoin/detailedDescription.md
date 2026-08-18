Frankencoin issues ZCHF, an overcollateralized stablecoin tracking the Swiss franc. All contracts are immutable. Every privileged action is either permissionless or requires 2% of the time-weighted votes of FPS pool share holders, followed by a public delay.

This review covers the Ethereum deployment only. Frankencoin also runs bridged ZCHF, savings, and governance contracts on several other chains via Chainlink CCIP; anything that goes wrong there can reach Ethereum through the rate-limited CCIP token pool.

### Minters

The ZCHF token has one central permission: registered *minter* modules can mint and burn without restriction. Anyone can apply to add a minter by paying a fee of at least {{minterFee}} ZCHF; the application passes unless a qualified FPS holder vetoes it within the application period (at least {{minApplicationPeriod}}). An unvetoed minter is **irrevocable**, so the system's key trust assumption is that qualified FPS holders review every application in time. All current minters are immutable contracts whose minting is bounded by their code: the minting hubs (collateral plus auctions), the savings modules (accrued interest only), the stablecoin bridges (1:1 against escrowed CHF stablecoins, capped and expiring), the CCIP token pool (interop, rate-limited), and two helpers that cannot mint freely.

Not all registered minters are still in active use. Actively minting are MintingHubV2 (with the PositionRoller), the Savings module, the CHFAU stablecoin bridge, and the CCIP token pool with its BridgeAccounting. The XCHF and VCHF bridges have passed their minting horizon and can only redeem, MintingHubV1 is deprecated with no open positions remaining, and the original SavingsV2 module has been superseded for savers but still sets the leadrate positions pay.

The same optimistic proposal pattern — apply onchain, pay a fee, go live unless vetoed by FPS holders — repeats throughout the system, with stakes scaled to the risk: minters (arbitrary code, at least {{minApplicationPeriod}} and {{minterFee}} ZCHF), individual minting positions (only parameters of already-approved code like different collaterals, at least 3 days and {{openingFee}} ZCHF), and position clones (same collateral and limit, instant and free).

### Opening a minting position

Anyone can open a position on the MintingHub by depositing an arbitrary ERC20 collateral, declaring their own liquidation price (there is no oracle), and paying the {{openingFee}} ZCHF fee. Nothing is minted yet: the position first sits through a public review period of at least 3 days in which qualified FPS holders can veto it. Only afterwards can the owner mint ZCHF up to the collateral value at the declared price, receiving it minus a reserve contribution chosen per position (at least the {{challengerReward}}% challenger reward, in practice 10-40%; reclaimable on repayment) and minus interest, which is prepaid to the position's expiration at the leadrate (currently {{leadrate}}%) plus a fixed risk premium — so rate changes only affect future minting. Live positions can be cloned by anyone, instantly and for free: clones inherit all parameters, draw from the original's approved minting limit, and expire no later than it.

### Liquidations (challenges)

There are no oracle-triggered liquidations: a liquidation is a successful challenge. Anyone who considers a position's **declared price** too high can post the same collateral to start an auction, freezing the position's minting. If a buyer pays the **declared price** for the challenger's collateral, the challenge is averted (the challenger has sold at or below market, which makes frivolous challenges costly). If nobody does, the position's collateral is sold at the true market price (discovered via dutch auction), the challenger earns {{challengerReward}}%, and any shortfall is covered by the owner's reserve contribution and then the equity reserve. Expired positions are wound down by a permissionless forced sale.

### Peg

The CHF peg is held by arbitrage: the stablecoin 'bridges' (or rather stability modules) give a hard 1:1 anchor within their caps, and position owners expand or repay ZCHF debt as the market price deviates. Losses are absorbed first by the equity reserve owned by FPS holders, keeping ZCHF whole as long as equity lasts.

### The equity reserve

The equity reserve is funded by everything the protocol earns: FPS investments, the prepaid interest and opening fees from minting positions, minter application fees (kept even when the minter is vetoed), reserve contributions forfeited by liquidated positions, and profits settled back from bridged deployments. Its outflows are savings interest, FPS redemptions, and covering losses. FPS holders thus collect all protocol income in exchange for standing first in line for every loss.

### Governance

FPS is minted and redeemed permissionlessly against ZCHF at a formula price ({{valuationFactor}}x underlying equity per share, {{minHoldingDuration}} minimum holding). Voting power is balance multiplied by holding time, favoring long-term holders. Qualified holders (2% of votes) can only: veto minter applications and new minting positions, propose interest rates (7-day delay), govern the cross-chain pool configuration (7 to 21-day timelocks), and restructure the cap table if equity falls below 1,000 ZCHF. They cannot touch user funds, pause the system, or change any deployed code.

### Delays and mint exposure

Every way of expanding the ZCHF supply is listed below with its minimum delay — the window in which any qualified FPS holder can veto — and the worst case if it goes through unchecked. Rows marked with * additionally require 2% of FPS votes to initiate.

| Action / attack path | Delay | Max unbacked ZCHF if exploited |
| --- | --- | --- |
| Register new minter | {{minApplicationPeriod}} | Unlimited, irrevocable |
| CCIP admin transfer* | 21 days | Unlimited |
| CCIP config* | 7 days | Unlimited (new rate limits) |
| Interest rate* | 7 days | Continuous drain of the equity reserve |
| New minting position | 3 days | The position's own minting cap policed by challenge auctions |
| Clone minting position | none | The active parent position's remaining minting cap |
| CCIP offramp compromise | none | Bounded by per-chain rate limits |
| Compromised 1:1 CHF stablecoin | none | The remaining minting cap of that bridge |

Losses are absorbed by the equity reserve and then the minter reserve before ZCHF holders are diluted by unbacked supply.

### Savings and the savings vault

Two savings modules pay interest on deposited ZCHF, minted against the equity reserve (a loss to FPS holders, offset by the interest positions pay). The original module also serves as the *leadrate* ({{leadrate}}%) that all positions pay on top of their risk premium; the current Savings module pays a separately set rate ({{savingsRate}}%). Rates change only via a qualified proposal and a 7-day delay. The SavingsVault (svZCHF) is an ERC4626 wrapper over the Savings module with renounced ownership: interest auto-compounds into the share price. Savers' main risks are a governance rate cut to zero and, ultimately, the solvency of the ZCHF system itself.

### Multichain

ZCHF bridges to other chains via Chainlink CCIP: a token pool (a registered minter) burns on Ethereum and mints on the destination and vice versa, with governance-set per-chain rate limits. Pool configuration is controlled by qualified FPS holders through timelocked proposals that anyone can execute and any qualified holder can veto. A CCIP compromise could mint unbacked ZCHF on Ethereum, bounded by those rate limits.
