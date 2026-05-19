# Ethereum-Style Inclusion Delay Chart Spec

## Purpose
Generate a live-chain censorship chart for an Ethereum-style single-proposer model.

The chart answers:

> If a static validator set has a given censoring stake fraction, how long does a censored transaction wait until it reaches T99 inclusion through an honest proposer?

This chart models selective/live-chain censorship only. It excludes finality, inactivity leaks, validator-set growth, forced-inclusion gadgets, and dead-chain/blanket-censorship fallbacks.

Note: Ethereum proposer rights are stake-weighted in production; this chart uses a uniform-stake baseline, so validator-count fraction equals stake fraction.

## Minimum Inputs
- `N`: total static validator/sequencer set size
- `slotSeconds`: seconds per slot
- `target`: target inclusion probability, usually `0.99`
- `maxCensorFraction`: chart cap, currently `0.5`
- `canonicalInclusionRule`: whether an honest proposer can canonically include under the current honest/censor split

Required input bounds:

```text
N > 0
slotSeconds > 0
0 < target < 1
0 <= maxCensorFraction <= 1
```

For the current simplified honest-majority rule:

```text
honestCount > censorCount
```

If censoring stake is at least half of total stake, the point has no finite live-chain inclusion delay under this model.

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

If the honest-majority rule is not satisfied:

```text
if H <= K:
  delayDays = null
```

Otherwise, each slot has honest proposer probability:

```text
pSlot = H / N
```

Survival after `s` slots:

```text
S(s) = (1 - pSlot)^s
```

Find the first slot `t` where survival is below the target survival:

```text
targetSurvival = 1 - target
(1 - pSlot)^t <= targetSurvival
```

Equivalent closed form:

```text
targetSlots = ceil(log(targetSurvival) / log(1 - pSlot))
```

Use this closed form only when `0 < pSlot < 1`.

Convert the target slot to time:

```text
delayDays = targetSlots * slotSeconds / 86400
```

## Chart Output
- x-axis: actual censoring stake fraction `qActual = K / N`, from `0` to `0.5`
- y-axis: `delayDays`, formatted as seconds/minutes/hours/days
- series: Ethereum-style static baseline
- optional marker: current project censoring stake fraction, rounded to `K = round(N * qConfigured)` and plotted at `K / N`, only if the point has finite delay

## Edge Cases
- `qActual = 0`: `K = 0`, `pSlot = 1`, so T99 is reached at the first slot.
- `pSlot = 1`: set `targetSlots = 1`; do not use the logarithmic closed form.
- `pSlot = 0`: no finite live-chain inclusion delay under this model.
- `target >= 1`: reject for this chart. T100 is not generally finite in a probabilistic model. If supporting it explicitly, only `pSlot = 1` is finite.

## Interpretation
This is a simplified canonical-inclusion model for live-chain censorship. It assumes one proposer per slot and treats honest proposers as able to include censored transactions only while honest stake is strictly greater than censoring stake.
