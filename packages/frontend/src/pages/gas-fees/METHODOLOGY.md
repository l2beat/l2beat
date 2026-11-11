# Gas fees page: methodology

What the page claims, where each number comes from, and how far each one can be trusted. The page carries no explanation, so this is where a reviewer checks it.

## The idea

A tip is only "too high" against a price someone could really have used. So the page publishes an estimator that anyone can compute from past blocks, grades it against mempool data for both underpaying and overpaying, and shows what real transactions got at its tips, at wallets' tips and at what geth suggests.

Wallets never made our promises, so the page never judges them against those promises. Wallets appear only as live readings, with no pass or fail, and the history on the page is about tip amounts, never about a wallet. Our 95% target appears only in our own track record.

These are targets with a public track record, never guarantees. A tip is set before anyone knows what the next block needs.

## The estimator

It reads past blocks only, with `eth_feeHistory`: each block's 10th and 25th percentile tips, over the last 300 blocks, about 1 hour, for slow and medium, and over the last 1,800, about 6 hours, for fast.

| Tier | Target | Per-block number | Percentile across blocks |
|---|---|---|---|
| Slow | 95% within 1 minute | 10th percentile tip | 45.2th |
| Medium | 95% within 2 blocks | 25th percentile tip | 85th |
| Fast | 95% in the next block | 25th percentile tip, last 1,800 blocks | 99th |

Each tier promises 95% on average and never below 90% in a week. The 90% is a record from the weeks we have, not a guarantee.

Each tier is at least as high as the one below.

**Why these percentiles.** A low tip misses a block because that block didn't take it. If each block takes a tip with chance `a`, then with `k` chances a transaction misses with chance `(1 - a)^k`. One thing no tip fixes: even at the highest tips, 1.7% of transactions miss the next block anyway, so at most 98.3% can make it:

```
(1 - a × 0.983) × (1 - a)^(k - 1) = 0.05
```

That gives `a` = 96.6% for 1 chance, 78.3% for 2, and 45.2% for 5, one minute being 5 blocks.

This is enough for 95% on average if blocks were independent chances. The promise also asks for never below 90% in a week, and the derived 78.3% let the medium tier fall to 89.1% in a week of February 2026. The medium tier therefore beats 85% of blocks: the cheapest share, among those tried on the tuning months, that kept every tuning week at 90% or more. On the same criterion the fast tier reads the 25th percentile tip of the last 1,800 blocks, about 6 hours, and beats 99% of them. Every tier kept both parts of the promise in every week of the tuning months, the test months and the blind years.

The 1.7% is the only number measured from mempool data: the share of transactions at 2 gwei that still missed the next block over the past year. Latency explains part of it: at 2 gwei, 42% of the misses came from transactions first seen in the last 2 seconds before the block's slot, which missed 3 to 7% of the time. Seen 2 to 11 seconds before, 1.2% still missed, for reasons not established. At near-zero and 0.1 gwei tips, many misses came at blocks less than 30% full. The per-block percentiles and the window were chosen on the tuning months.

**It is the same shape as geth's rule:** a low-tip number from each recent block, then a percentile across blocks. Geth uses the 3 lowest tips of 20 blocks and the 60th percentile, for one suggestion with no stated target.

**The mempool is only the grader.** Nothing at runtime needs it, so anyone can check the numbers with a plain node.

## Definitions

**Tip.** Effective gas price minus base fee.

**Next block.** The first block with a timestamp at or after the moment the transaction was first seen.

**Ordinary transaction.** Tip under 2.5 gwei, excluding builder self-payments and transactions to the forwarder `0xfeeeeee44046c3f61a8cc081e0918ef0de0a7ffc`.

**Geth suggestion.** What a geth node answers to `eth_maxPriorityFeePerGas`, which ethers and viem use by default: the 60th percentile of the 3 lowest tips in each of the last 20 blocks. This row is our rebuild of that rule from public mempool transactions, not logged output from a node. Other clients and RPC providers may answer differently.

**Landed.** For an estimator, the share of real transactions tipping 1× to 1.26× what it said at the moment they were sent that landed in the next block, within 2 blocks, or within 1 minute. This band is one histogram bar wide.

**Tip needed.** In hindsight, the lowest tip that reached 95% for that tier. Measured per hour when grading: a daily figure has to survive the day's worst hours, which flatters overpaying (fast median 0.043 gwei by the hour, 0.085 by the day). The page's weekly chart uses the median day.

**Underpaying.** The landed rate falling short of the target, and the share of hours with a tip below the tip needed. The landed rate does not use the tip needed, so it does not depend on this choice.

**Overpaid.** The estimator's tip minus the tip needed, never below zero, on an ERC-20 transfer (46,109 gas). Shown in dollars and as a multiple. Lead with dollars: multiples explode when the tip needed is near zero.

**Score.** The quantile (pinball) score at 95%, on log tip, from each hour's landing curve. A shortfall weighs 0.95 and an overshoot 0.05, so being short costs 19× more per unit, which follows from the target. It is minimised only at the true 95th percentile, so it cannot be gamed by going high or low. Use log tips: in dollars, underpaying looks almost free because the shortfall is tiny even when the transaction waits. Lower is better, and even perfect hindsight scores above zero.

**Price of speed.** How long until 99% of real transactions at a tip had landed, against what the tip costs on an ERC-20 transfer, with dollars on a true scale. There are 71 tip levels from 0.01 to 2 gwei, where the page's comparison ends: 30 per tenfold step below 0.1 gwei, then every 0.05 gwei, each drawn at the average tip actually paid in it. Thin levels hold 50,000 to 200,000 transactions and move 2 to 5 seconds from one to the next, which is noise. So each level is a dot, and the line is the best fit that never rises with the tip, weighted by how many transactions each level holds. The round tips (1, 1.5 and 2 gwei, millions of transactions each) anchor it. The marked tips sit on the line, and our fast tip is drawn at its own average cost and 99% wait.

"Overpaying" depends on what a few seconds of certainty are worth to you, so the page shows the trade and doesn't draw the line.

**99% sure within.** Real seconds from when a transaction was first seen to the timestamp of the block it landed in, within which 99% of transactions at that tip had landed. The typical wait is 6 to 7 seconds at every tip, because arrivals spread evenly across the 12 second slot. An earlier version counted blocks and multiplied by 12, which is a ceiling, not a measurement.

**Who pays the tips.** Ordinary transactions and the dollars they tipped over the past year, split at powers of ten: under 0.1 gwei, 0.1 to 1 gwei, and 1 to 2.5 gwei. Zero tips count as under 0.1. "Exactly 1 or 2 gwei" means a tip of 1.000 or 2.000 gwei to three decimals.

**Why no price per missed block.** Dividing a step's cost by the misses it removed gives a stable number, about $11 to $20 near 2 gwei, but nobody ever pays it, so it reads as a real cost and confuses. The page sticks to what a sender pays and gets.

**Seconds saved mean certainty, not a faster block.** One transaction either makes a block or waits for the next, so it never lands 3 seconds sooner. The seconds are the change in the 99% wait: how long until you can be 99% sure you're in. The page always says 99% next to them for that reason. By how busy the moment was, going from our fast tip to 2 gwei shortened that wait by 8 seconds in the quietest quarter of the year and by 1 second in the busiest.

**Why not a price per second.** An earlier version divided each step's cost by the seconds of average wait it saved. Average wait can't carry that: from 1 to 2 gwei the saving was 0.07 seconds with waits capped at an hour and nothing at all without the cap, because a few very long waits dominate the average. The chance of the next block rises steadily at every level, and going from 1 to 2 gwei raises it in every quarter of quiet and busy moments.

**Tips at the fast tip.** Each ordinary transaction's tip capped at that day's average fast tip.

## Which transactions count

Landing rates use public mempool transactions, filtered so that the tip is what decides the wait. A transaction is dropped when:

- it never landed, or was first seen more than 4 seconds after its own block
- its maxFee was below the base fee when first seen
- its maxFee could not survive three maximum base fee rises (12.5% each) with its tip intact
- the base fee peak of the next 10 blocks would have cut its tip
- an earlier nonce from the same sender landed at or after that block, so it was waiting on the sender, not on the tip
- it was sent to the bot `0xbdb3ba9ffe392549e1f8658dd2630c141fdf47b6`

Dollar totals use every transaction in every block, private ones included.

## Data

| Source | Used for |
|---|---|
| Flashbots mempool dumpster | First-seen time, tip, maxFee, landing block |
| Xatu `canonical_execution_transaction`, `canonical_execution_block` | Every transaction and block of the past year |
| `eth_feeHistory` on an Ethereum node | Base fee and reward percentiles per block |
| Chainlink ETH/USD `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` | Daily price, mean of four reads |

- Coverage is Aug 2023 to 2 Nov 2026. The archive starts in August 2023 and has a few missing days.
- Flashbots and Xatu mempool data are probably not independent: on the days compared they agree on every hash, with a median first-seen gap of 7 to 10 ms.
- **Not done:** the benchmark has not been rerun on Xatu mempool data. Those files are about 3.5 GB per day.

## How it was tested

1. **Tuning, Nov 2025 to Apr 2026:** the per-block percentile and window for each tier were chosen as the lowest score on these months.
2. **Test, May to 2 Nov 2026:** scored after that choice. This test is not fully clean: earlier versions had been looked at against these months.
3. **Blind test, Aug 2023 to 2 Nov 2025:** the formula was frozen, then scored on 813 days never looked at before, with base fees up to 58 gwei.

### Results

| Tier | Period | Landed | Worst month | Hours below tip needed | Overpaid, typical hour | Score |
|---|---|---|---|---|---|---|
| Slow | Test | 96.0% | 94.2% | 30% | $0.0000019 | 0.116 |
| | Blind | 99.5% | 98.6% | 4% | $0.0003 | 0.043 |
| Medium | Test | 98.2% | 96.2% | 14% | $0.00049 | 0.166 |
| | Blind | 99.1% | 96.7% | 3% | $0.012 | 0.114 |
| Fast | Test | 97.6% | 97.0% | 10% | $0.017 | 0.194 |
| | Blind | 97.2% | 94.8% | 2% | $0.14 | 0.148 |

Reference scores on the test months (slow, medium, fast): perfect hindsight 0.086, 0.134, 0.174; a mempool-based estimator (a port of Bitcoin Core's) 0.132, 0.150, 0.189; geth's rule 0.102, 0.247, 0.606; a fixed 2 gwei 0.289, 0.262, 0.222.

### What the tests showed

- **It holds its target across a 1,000× range of base fees,** with no retuning. Only fast's worst blind month dipped below 95%.
- **It overpays, especially in the older years.** In a typical hour of the blind test fast tipped 1.3 gwei, against 1.7 gwei for the earlier rule that read the median tip of 300 blocks. Block tips partly reflect what people already pay, so the formula follows the market more than it measures need.
- **Fixed tips break when conditions change.** A fixed 0.0022 gwei, fine in the calm year, fell to 68.8% in its worst blind month and sat below the tip needed in 63% of hours. Fixed 0.28 gwei fell to 89%. Fixed tips appear here as comparisons only.
- **In the calm year the formula is only about level with fixed tips chosen on the tuning months** (scores 0.122, 0.161, 0.197). Its advantage is that nobody has to pick a number and it moves with conditions.
- **The formula's fast tip was about 2 gwei in 2023 and 2024, then fell about 8× while 2 gwei stayed flat.** 2 gwei went from 2× the tip needed in 2024 Q2 to 420× in 2026 Q4. The data shows that this happened, not why any wallet chose its number.

### Reverse test

To try to cut the overpaying, the per-block percentile and window were chosen on the older period instead, then scored on the past year:

| Tier | Chosen on older years | Landed, past year | Worst month | Score | Our formula: landed, worst month, score |
|---|---|---|---|---|---|
| Slow | p10, 1 hour | 97.1% | 94.2% | 0.113 | The same choice |
| Medium | p5, 1 hour | 87.0% | 76.4% | 0.311 | 97.2%, 89.5%, 0.178 |
| Fast | p25, 1 hour | 93.7% | 85.7% | 0.216 | 96.6%, 93.2%, 0.208 |

The cheaper choices look good on the older years and then underpay badly when conditions change. So the overpaying stays: it is the price of holding the target across conditions when blocks can't show which conditions are coming. Slow picked the same formula in both directions.

### What did not work

- **The node's lowest tips:** private near-zero tips pollute them.
- **Block fullness:** EIP-1559 holds it near 50% (0.501 to 0.511 over 6 hours), so it carries almost no signal.
- **Lookup tables:** they scored well but rose and fell with no logic, memorising past weeks.
- **Fitting:** quantile regression with up to 23 inputs, including base fee, weekday and hour, did not beat the simple formula. Blocks hold little signal about how hard the next hour will be.
- **A conformal tracker:** it climbed above 2 gwei, because some misses happen whatever the tip, so raising it cannot fix them.
- **Refreshing every block:** no different from every 5 minutes.

## Every value and why

| Value | Kind | Justification |
|---|---|---|
| 12.5% base fee rise | Protocol | EIP-1559 |
| 95% in all tiers | Choice | One certainty level. 99% in the next block is out of reach at any tip |
| 1 minute, 2 blocks, next block | Choice | The waits people recognise |
| 45.2th percentile, slow | Derived | From the target, the number of chances and the 1.7% that miss at any tip |
| 99th percentile of the 25th percentile tips over 1,800 blocks, fast | Chosen on tuning months | The cheapest rule that kept the promise; the derived 96.6th of the median tips over 300 blocks also kept it but overpaid about a quarter more |
| 85th percentile, medium | Chosen on tuning months | The derived 78.3th kept 95% on average but fell to 89.1% in one week; 85th is the cheapest share that kept every tuning week at 90% or more |
| 1.7% miss at any tip | Measured | Next-block misses at 2 gwei |
| Block p10, p25, p50 | Chosen on tuning months | Lowest score, one per tier |
| 300 blocks | Chosen on tuning months | Lowest score. Landing barely changes with the window |
| 2.5 gwei ordinary cutoff | Measured | The top of the pile at 2 gwei. Tips of 2 to 2.51 gwei reach a block's first 3 spots 1.3× as often as chance, tips of 2.51 to 3.16 gwei 6.2×. It is the largest step in 10 of 12 months, and the same level for the first 1, 3 or 5 spots at 2× and 3× chance. This is a rank effect, not proof of intent: a strict sort by tip predicts a step in the same place. If the pile moves, the cutoff moves with it, so it should be derived again |
| 46,109 and 123,119 gas | Measured | Median gas of successful ERC-20 transfers and router swaps on 2 Nov 2026 |
| 3 blocks of maxFee headroom | Choice | Tested on nine days: stable above 0.04 gwei, less so on very low days |
| 1× to 1.26× band | Choice | One histogram bar |

## Limits

- **Replayed, not live.** Only the suggested tips at the top of the page are live. Everything else is a replay. Once estimates are published live, the page must mark where real ones begin.
- **Wallets appear only as live readings.** We don't know how MetaMask or Rabby compute their suggestions: their fee services are closed, so we read them once a minute and never attribute past results to them. Rabby's rate limits calls, so a failed read keeps the last good one for up to 5 minutes, then the wallet disappears. Ambire's rule is open source, so we compute it on our own node from `ambire-common`, without having compared it with the wallet itself. That rule changed on 16 Oct 2026, so replaying it further back would not be valid. All three services and rules can change, and we should check that calling those endpoints from production is allowed.
- **Live multiples swing and can fall below 1×.** The live card shows each wallet's tip as a multiple of ours. Our fast tip moved from 0.2 to 0.8 gwei within half an hour on 6 Nov, so the same 2 gwei read as 10× and 2.5×. Ambire is often below 1×, and that stays visible. Slow multiples run into the tens of thousands because our slow tip is about 2,000 wei, close to zero, so read them with the dollars: the gap there is under $0.02.
- **A fixed tip can come close, but only in hindsight.** Over the past year a fixed 0.35 gwei, about our fast tip's average, landed 95.6% in the next block, against 96.3% for our fast tip. Choosing that fixed tip needed the year's results; the estimator reads only past blocks.
- **`gas_price` changes type in Xatu.** It is an integer before block 25,189,000 and a little-endian blob after it, as is the single file at 24,933,000. The year job reads each file's type and checks every EIP-1559 tip against `min(maxPriorityFee, maxFee - baseFee)`: 645 million tips, no mismatches. A first version decoded the integers as blobs, which corrupted tips before 28 May 2026.
- **Rows are transactions tipping that amount, not a wallet's users.** Public mempool data cannot see private routing.
- **Association, not experiment.** Matched on hour and point in the slot, 2 gwei beats 0.25 gwei by 2.7 points of next-block landing and saves 0.49 seconds on average, but this is not matched on sender. Only randomised transactions close that.
- **It partly copies the market.** A block's median tip reflects what wallets set. If wallets lower their defaults, the fast tip falls too.
- **No error bars yet.** Small score gaps are ties until bootstrapped.
- **Higher tips do buy something.** Show that openly: 2 gwei lands in the next block more often than our fast tip.
- **No claim about motive.** The page reports measured tips only. Nothing here shows why a wallet picks a number, or that any payment flows from builders to wallets. In the closest non-crypto study, payment for order flow did not explain the differences in execution.
- **L2 costs on this mock are rough:** 30 sampled blocks per chain. The real page should get them from the production pipeline.

## Before this ships

- Forward test: log published tips and grade them on new Flashbots files.
- Log wallet endpoints from now on, so wallets can have real history.
- Confirm wallet defaults in the real wallets, and add more wallets.
- Rerun on Xatu mempool data.
- Add error bars to the score.
- Find the cause of the week of 2 Feb 2026, when the mempool estimator's fast tier fell to 89.1%.
- Controlled test: identical transactions at randomised tips.

## Precedents

- [Bitcoin Core fee estimator](https://github.com/bitcoin/bitcoin/blob/master/src/policy/fees/block_policy_estimator.h)
- [Block's Augur](https://delvingbitcoin.org/t/augur-block-s-open-source-bitcoin-fee-estimation-library/1848): miss rate and overestimate as the benchmark
- [Gneiting et al. 2007](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jrssb.pdf): sharpness subject to calibration
- [Isotonic dose finding](https://pmc.ncbi.nlm.nih.gov/articles/PMC2821065): the lowest dose that reaches a target
- [The Actual Retail Price of Equity Trades](https://papers.ssrn.com/abstract=4189239): identical orders across brokers
- [Haggag and Paci, Default Tips](https://www.aeaweb.org/articles?id=10.1257/app.6.3.1): defaults drive what people tip
