Liquity V2 is an immutable borrowing protocol that issues BOLD, an onchain overcollateralized stablecoin soft-pegged to the US dollar. A user locks collateral and draws BOLD against it at an interest rate they set, from 0.5% to 250%. Each of three collaterals is a fully isolated branch with its own market, Stability Pool, and price feed: ETH (as WETH), Lido wstETH, and Rocket Pool rETH. A position is a trove, held as a transferable NFT.

The core contracts that govern borrowing, liquidations, and redemptions are immutable: no admin key, no pause, no upgrade path over user funds. Its only revenue, the interest borrowers pay, is split on each branch three quarters to Stability Pool depositors as yield and one quarter, via the single governed component, to community initiatives chosen by LQTY stakers; that component touches neither user funds nor parameters. This adminlessness is only of the protocol's own logic: each branch's price comes from an external [Chainlink](/defi/projects/chainlink) feed, fixed at deployment but run by Chainlink, whose operators and multisig can let it fail or move the value it reports.

BOLD's dollar peg holds without active governance. A hard floor comes from redemptions: under a dollar, redeeming BOLD for a dollar of collateral is profitable, so arbitrage burns supply until the peg recovers. The ceiling is softer and market-driven: above a dollar, low redemption risk lets borrowers lower their rates, which makes minting fresh BOLD more attractive while cutting Stability Pool yields, so supply rises and the price eases back toward a dollar; below a dollar the same forces run in reverse, lifting yields and demand for BOLD.

### Opening a trove

To open a trove, a borrower deposits collateral and draws at least 2,000 BOLD at their chosen rate. The position must stay above the branch's Minimum Collateral Ratio (MCR): {{wethMcr}}% on the ETH branch, {{lstMcr}}% on the wstETH and rETH branches. A trove in an interest-rate batch (see below) is instead held to the MCR plus a {{bcr}}% Batch Collateral Ratio buffer (BCR).

Opening costs two things: a 0.0375 WETH gas-compensation deposit, set aside and paid to the trove's liquidator or refunded on close, and an upfront borrowing fee of about seven days of interest at the branch's average rate, added to the debt.

Beyond transferring the NFT, the owner can delegate specific actions: an add manager may add collateral or repay debt, a remove manager may withdraw collateral or draw BOLD to a set receiver, and an interest-rate delegate may change only the rate, within an agreed band.

### Voluntary actions on a trove

While a trove stays healthy, its owner or a delegate can freely adjust it, adding or withdrawing collateral and drawing or repaying BOLD, as long as it stays above the MCR with debt at or above 2,000 BOLD. Closing repays the debt, returns the collateral, and refunds the gas deposit. Accrued interest can be folded into the debt at any time.

A trove's rate can change at any time, but a change within seven days of the previous one carries the upfront fee again, deterring redemption-gaming; later changes are free.

A borrower can instead delegate the rate to an interest-rate batch. Anyone can register as a batch manager, declaring a fixed rate band and a management fee capped at 10% per year; they set one rate for the whole batch, changeable no more often than a declared period of at least an hour. Joining or leaving always charges the upfront fee.

### Liquidations

A trove becomes liquidatable once its collateral ratio falls below the MCR (or MCR plus BCR for a batched trove). Liquidation is permissionless: anyone can liquidate a list of underwater troves in one call.

The Stability Pool absorbs liquidations first, burning BOLD equal to the debt and taking the trove's collateral in return; it seizes the debt plus a {{spPenalty}}% penalty, so depositors gain. If the pool cannot cover the whole debt, the rest is redistributed across the branch's other troves in proportion to size, at a higher penalty: {{wethRedistribution}}% on ETH, {{lstRedistribution}}% on wstETH and rETH.

The liquidator is paid the gas deposit plus 0.5% of the trove's collateral (capped at 2 units) as gas compensation. Whatever collateral remains after debt, penalty, and this compensation is the former owner's, claimable later.

### Redemptions

Redemptions are the mechanism behind the price floor: any holder can swap BOLD for an equal dollar value of collateral at the oracle price, burning the BOLD.

A redemption is spread across branches in proportion to how unbacked each is (its debt minus the BOLD in its Stability Pool); branches that are shut down or below their Shutdown Collateral Ratio are skipped. Within a branch, troves are redeemed in ascending order of interest rate: a borrower's chosen rate is their redemption risk, so the lowest-rate troves go first and paying a higher rate moves a trove down the queue. A redeemed trove loses collateral and an equal dollar of debt, so aside from the fee the borrower has no net loss, just less collateral exposure.

A redemption fee, taken from the collateral paid out, protects borrowers from cheap redemption. It starts at 0.5% and rises with the fraction of BOLD supply redeemed, then decays with a roughly six-hour half-life, so a wave of redemptions grows costlier before relaxing. A redemption that leaves a trove below the 2,000 BOLD minimum turns it into a "zombie", pulled from the ordinary queue and redeemed first next time.

### Emergency scenarios

Before shutdown, a softer protection applies: no borrowing operation may push a branch's total collateral ratio below its Critical Collateral Ratio (CCR), {{wethCcr}}% on ETH and {{lstCcr}}% on wstETH and rETH. As a branch nears it, weakening actions like drawing more BOLD or withdrawing collateral are blocked until it recovers.

A branch shuts down in one of two ways: anyone can trigger it once the branch's total collateral ratio falls below its Shutdown Collateral Ratio (SCR), {{wethScr}}% on ETH and {{lstScr}}% on wstETH and rETH, or it happens automatically when the Chainlink feed fails, meaning it reverts, returns a non-positive price, or goes stale past its window ({{ethStaleness}} for the ETH/USD and stETH/USD feeds, {{rethEthStaleness}} for the rETH/ETH feed).

After shutdown, all borrowing-side activity stops (no new troves, no drawing or repaying BOLD, no collateral moves, no rate changes) and interest stops accruing. Borrowers can still close troves and claim surplus, and Stability Pool depositors can still withdraw. Shutdown also opens urgent redemption: any holder can redeem against troves of their choosing, in any order, paying no fee and receiving a 2% collateral bonus instead.
