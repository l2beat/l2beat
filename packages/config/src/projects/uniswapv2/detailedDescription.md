Uniswap v2 is a constant-product automated market maker: a set of immutable pair contracts on Ethereum where anyone can swap one ERC-20 token for another against liquidity other users have deposited. There is no operator in the trading path and user funds sit only in the pairs, which have no admin, no pause switch, and no upgrade path. The router most users interact with is a convenience that holds no user funds: any contract can trade with a pair and provide liquidity without it.

UNI tokenholder governance exists alongside the pairs rather than above them. Acting through a {{timelockDelayDays}}-day timelock, it can choose the recipient of a protocol fee whose size is fixed in the pair code; it cannot upgrade or pause a pair, move liquidity providers' funds, or censor swaps or pair creation.

### Pairs

Each pair holds two tokens and prices them so that the product of the two reserves never decreases. Every swap pays a 0.3% fee on the input, which stays in the pair and accrues to liquidity providers. Liquidity is spread across all prices, so a position earns fees whatever the price, and is represented by an ERC-20 LP token for its share of the pair. The first deposit into a pair permanently locks a minimum of 1,000 LP token units, which makes manipulating the share price of a new pair expensive.

Pair creation is permissionless: anyone can have the factory deploy a pair for any two tokens, one pair per token pair. Pairs are deployed with CREATE2, so a pair's address is computable in advance from the factory address and the two tokens. Once deployed, a pair never changes: its tokens and its fee are fixed.

A swap can send tokens out before they are paid for, as long as the pair is paid back, plus the fee, within the same transaction. These flash swaps let a contract borrow either token, or both, for the length of a transaction. Anyone can also bring a pair's recorded reserves in line with its actual balances, or take any tokens sent to it beyond those reserves.

### Router

Swaps and liquidity changes normally go through UniswapV2Router02, which finds the pairs from the factory, moves tokens in and out, and checks the user's limits. Every entry point takes a deadline and a minimum output or maximum input, so a transaction that waits too long or would trade at a worse price reverts. Which pairs a trade crosses is computed offchain by the interface or a routing API, and the chain never verifies that the chosen route was the best one, so the slippage tolerance, not the quote, is the real protection. The router also has variants for tokens that charge a fee on transfer, and it wraps and unwraps ETH.

### The built-in oracle

Every pair doubles as a price oracle: on the first interaction in each block it adds the current prices to two running sums weighted by time. Anyone can read these sums at two moments and divide by the time between them to get a time-weighted average price, without any offchain reporter. Unlike Uniswap v3, a pair keeps no history of past values, so the reader has to record the first value itself.

### Governance and the fee switch

Protocol control sits with UNI holders. An address with more than {{proposalThreshold}} UNI of delegated votes can submit a proposal to GovernorBravo; voting starts {{votingDelayBlocks}} blocks later and runs for {{votingPeriodBlocks}} blocks. Passing takes more for- than against-votes and at least {{quorumVotes}} UNI voting for. A passed proposal is queued in the Timelock and executable {{timelockDelayDays}} days later. The same Timelock is the UNI token's minter, with new issuance capped at {{uniMintCap}}% per mint and a minimum interval of {{uniMintInterval}}.

Over the pairs, governance holds one control knob, exercised through the factory's fee setter role: choosing the recipient of the protocol fee, where no recipient means the fee is off. The pair code fixes the fee at 1/6 of LP fees, paid by minting LP tokens to the recipient when liquidity is added or removed, so the fee can never be raised and can never touch principal.

The protocol fee is {{protocolFeeStatus}}. Since the UNIfication proposal the fee setter role sits with the Timelock and the recipient is the TokenJar, which collects the LP tokens. Under the current configuration, the Firepit releases TokenJar balances to anyone who first burns the configured threshold of UNI. This disposal path is governed rather than immutable: after the timelock, governance can choose another recipient, replace the TokenJar releaser, or change the Firepit threshold.

Governance cannot upgrade, pause, or drain a pair, change a pair's swap fee, block a swap, or stop anyone from creating a pair.
