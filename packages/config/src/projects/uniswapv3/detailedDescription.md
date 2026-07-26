Uniswap v3 is a concentrated-liquidity automated market maker: a set of immutable pool contracts on Ethereum where anyone can swap one ERC-20 token for another against liquidity other users have deposited. There is no operator in the trading path and user funds sit only in the pools, which have no admin, no pause switch, and no upgrade path. The periphery contracts most users interact with, the routers and the position manager, are conveniences that hold no user funds and can be bypassed by calling a pool directly.

UNI tokenholder governance exists alongside the pools rather than above them. Acting through a {{timelockDelayDays}}-day timelock, it can enable new fee tiers and set a protocol fee that pool code hard-caps at one quarter of LP fees; it cannot upgrade or pause a pool, move liquidity providers' funds, or censor swaps or pool creation.

### Pools and concentrated liquidity

Each pool trades one pair of tokens at one fee tier. The price axis is divided into ticks, discrete points spaced 0.01% apart, and a liquidity provider concentrates capital into a chosen tick range instead of spreading it from zero to infinity as in earlier AMM designs. While the market price is inside the range, the position earns fees like a leveraged-up constant-product position; outside it, the position sits idle, fully converted into one of the two tokens. Internally the pool tracks the current price as sqrtPriceX96, the square root of the token1/token0 price in Q64.96 fixed-point form.

The factory currently has {{feeTierCount}} fee tiers enabled: {{feeTierList}} of each swap, paid to in-range liquidity. Each tier fixes which ticks are usable via a tick spacing, coarser at higher tiers: the {{usdcWethFee}} USDC/WETH pool can use every {{usdcWethTickSpacing}}th tick, the {{wbtcWethFee}} WBTC/WETH pool every {{wbtcWethTickSpacing}}th.

Pool creation is permissionless: anyone can have the factory deploy a pool for any token pair at any enabled tier, one pool per pair and tier. Pools are deployed with CREATE2, so a pool's address is computable in advance from the factory address, the pair, and the fee. Once deployed, a pool never changes: its tokens, fee, and tick spacing are fixed. The only things anyone can later adjust are its oracle buffer size (permissionlessly, described below) and its protocol-fee share (governance-set, described below).

### Providing liquidity

Most liquidity providers mint through the NonfungiblePositionManager, which wraps each position as a transferable ERC-721 NFT and does the fee accounting per token ID. The manager is a convenience, not a gatekeeper: the core pools' mint, burn, and collect functions are public, so a position can also be opened and managed directly on a pool.

### Swapping

Swaps normally go through a router: SwapRouter, SwapRouter02 (which also reaches Uniswap v2 pools), or the UniversalRouter, which pulls tokens via Permit2 signature-based approvals instead of per-token allowances. Which pools a trade crosses is computed off-chain by the interface or a routing API, and the chain never verifies that the chosen route was the best one. What the contracts do enforce are the two bounds the user signs: a minimum output (or maximum input) and a deadline. A bad route can still execute anywhere down to that signed minimum, so the slippage tolerance, not the quote, is the real protection; anything below it reverts. Anyone can also swap against a pool directly.

### The built-in oracle

Every pool doubles as a price oracle: it records cumulative-tick observations from which anyone can read a time-weighted average price over a chosen window, without any off-chain reporter. A pool starts with a single observation slot, and anyone can pay a one-time gas cost to grow the observation buffer, lengthening the window the pool can serve.

### Governance and the fee switch

Protocol control sits with UNI holders. An address with {{proposalThreshold}} UNI of delegated votes can submit a proposal to GovernorBravo; voting starts {{votingDelayBlocks}} blocks later (about two days) and runs for {{votingPeriodBlocks}} blocks (just under six days). Passing takes more for- than against-votes and at least {{quorumVotes}} UNI voting for. A passed proposal is queued in the Timelock and executable {{timelockDelayDays}} days later. The same Timelock is the UNI token's minter, allowed to inflate supply by at most {{uniMintCap}}% at a time, no more often than once every {{mintIntervalDays}} days.

Over the pools themselves, governance holds exactly two powers, both exercised through the factory owner role. It can enable new fee tiers, each permanently bound to its tick spacing and never removable. And it can switch on the protocol fee: pool code requires each side's share to be zero or between 1/10 and 1/4 of that side's LP fees, so at most a quarter of swap fees, and never principal, can be diverted.

Since the UNIfication proposal, the factory owner is the V3OpenFeeAdapter. Governance sets protocol-fee values on the adapter, globally, per tier, or per pool (currently 1/{{protocolFeeDenominator}} on each side), while anyone can push those values onto pools and sweep the accrued fees, which the adapter forwards only to the TokenJar. The Firepit closes the loop: anyone can claim up to {{firepitMaxAssets}} of the jar's tokens by paying {{firepitThreshold}} UNI, sent to an unspendable address, so accumulated fees are continuously exchanged for UNI taken permanently out of circulation. Governance keeps the exit: through the timelock it can retune the fee values, the Firepit's price, or hand the factory owner role elsewhere.

What governance cannot do is the protocol's core guarantee: it cannot upgrade, pause, or drain a pool, change a live pool's swap fee or tick spacing, block a swap, or stop anyone from creating a pool at an enabled tier.
