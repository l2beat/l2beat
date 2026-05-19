# Polygon Span Inclusion Delay Chart Spec

## Purpose
Generate a live-chain censorship chart for a Polygon-style span model.

The chart answers:

> If a static validator set has a given censoring stake fraction, how long does a censored transaction wait until it reaches T99 inclusion through a non-censoring span proposer whose block can be attested?

This chart models selective/live-chain censorship only. It excludes validator-set growth, bridge/exit mechanisms, governance intervention, and dead-chain/blanket-censorship fallbacks.

Note: Polygon voting power and span proposer selection are stake-weighted in production; this chart uses a uniform-stake baseline, so validator-count fraction equals stake fraction.

## Minimum Inputs
- `N`: total static validator/sequencer set size
- `spanBlocks`: number of blocks for which one span proposer remains active, currently `6400`
- `blockSeconds`: seconds per block, currently `2`
- `target`: target inclusion probability, usually `0.99`
- `maxCensorFraction`: chart cap, currently `0.5`

Required input bounds:

```text
N > 0
spanBlocks > 0
blockSeconds > 0
0 < target < 1
0 <= maxCensorFraction <= 1
```

Polygon has one active proposer for the full span. Blocks are attested by the full validator set, and the attestation threshold is strictly greater than `2/3` of total voting power/stake.

This means Polygon has no finite live-chain inclusion delay once censoring stake is at least `1/3` of total stake. This differs from the simplified Ethereum-style model, where the live-chain boundary is `1/2` censoring stake.

Under the uniform-stake baseline, a block containing the censored transaction can be attested only when:

```text
honestCount > (2 / 3) * N
```

Equivalently, the chain cannot attest such a block when:

```text
K >= N / 3
```

where `K` is the number of censoring validators.

## Per-Point Calculation
Generate points by integer censor count:

```text
maxK = floor(N * maxCensorFraction)
K in [0, maxK]
qActual = K / N
H = N - K
```

where:

```text
K = censoring validators
qActual = actual x-axis censoring stake fraction
H = honest validators
```

If the attestation threshold is not satisfied:

```text
if H <= (2 / 3) * N:
  delayDays = null
```

Otherwise, the span proposer is honest with probability:

```text
pSpan = H / N
```

If the active span proposer is honest, the transaction is included in the first block of that span. If the active span proposer is censoring, the transaction is censored for the full span.

Define survival for elapsed block count `t`.

For `t = 0`:

```text
survival(0) = 1
```

For `t > 0`:

```text
fullSpans = floor(t / spanBlocks)
residualBlocks = t mod spanBlocks
spansObserved = fullSpans + (residualBlocks > 0 ? 1 : 0)
survival(t) = (1 - pSpan) ^ spansObserved
```

Find the first block `t >= 1` where total survival is below the target survival:

```text
targetSurvival = 1 - target
survival(t) <= targetSurvival
```

Equivalently, when `0 < pSpan < 1`:

```text
targetSpans = ceil(log(targetSurvival) / log(1 - pSpan))
targetBlocks = ((targetSpans - 1) * spanBlocks) + 1
```

Convert the target block to time:

```text
delayDays = targetBlocks * blockSeconds / 86400
```

## Chart Output
- x-axis: actual censoring stake fraction `qActual = K / N`, from `0` to `0.5`
- y-axis: `delayDays`, formatted as seconds/minutes/hours/days
- series: Polygon span static baseline
- optional marker: current project censoring stake fraction, rounded to `K = round(N * qConfigured)` and plotted at `K / N`, only if the point has finite delay

## Edge Cases
- `qActual = 0`: `K = 0`, `pSpan = 1`, so T99 is reached at the first block.
- `pSpan = 1`: set `targetBlocks = 1`; do not use the logarithmic closed form.
- `pSpan = 0`: no finite live-chain inclusion delay under this model.
- `target >= 1`: reject for this chart. T100 is not generally finite in a probabilistic model. If supporting it explicitly, only `pSpan = 1` is finite.
- `K >= N / 3`: no finite live-chain inclusion delay because the full validator set cannot attest a block containing the censored transaction.

## Interpretation
This is a probabilistic live-chain inclusion delay. It treats spans as single-proposer periods and treats the full validator set as the attestation set. It does not describe what happens once the chain is no longer live.
