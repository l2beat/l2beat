# Aztec Committee Inclusion Delay Chart Spec

## Purpose
Generate a live-chain censorship chart for an Aztec-style committee model.

The chart answers:

> If a static validator set has a given censoring stake fraction, how long does a censored transaction wait until it reaches T99 inclusion through a non-blocking committee path?

This chart models selective/live-chain censorship only. It excludes escape hatch, validator-set growth, validator-set lag, and dead-chain/blanket-censorship fallbacks.

Aztec is modeled as an equal-weight validator/sequencer set for this chart, so censorship fraction by count equals censorship fraction by stake.

## Minimum Inputs
- `N`: total static validator/sequencer set size
- `n`: committee size
- `epochSlots`: number of slots/checkpoints for which one committee remains active
- `slotSeconds`: seconds per slot/checkpoint
- `target`: target inclusion probability, usually `0.99`
- `maxCensorFraction`: chart cap, currently `0.5`
- `blockingThreshold`: maximum censoring committee members that still allows inclusion

Required input bounds:

```text
N > 0
0 < n <= N
epochSlots > 0
slotSeconds > 0
0 < target < 1
0 <= maxCensorFraction <= 1
```

For an Aztec-style `2/3` honest committee rule:

```text
blockingThreshold = floor((n - 1) / 3)
```

A committee blocks the epoch when:

```text
x > blockingThreshold
```

where `x` is the number of censoring committee members.

## Per-Point Calculation
Generate points by integer censor count:

```text
maxK = floor(N * maxCensorFraction)
K in [0, maxK]
qActual = K / N
```

where `K` is the number of censoring validators and `qActual` is the x-axis value to plot.

Committee composition follows a hypergeometric distribution because the committee is sampled without replacement:

```text
P(X = x) = C(K, x) * C(N - K, n - x) / C(N, n)
```

For each possible committee censor count `x`:

```text
if x > blockingThreshold:
  survival_x(s) = 1
else:
  survival_x(s) = (x / n)^s
```

`survival_x(s)` is the probability that the transaction is still censored after `s` slots in the current epoch.

This formula assumes that, inside a non-blocking committee, each slot's proposer or inclusion opportunity is sampled independently from the committee with replacement. Equivalently, each slot has censoring miss probability `x / n`. If the production protocol uses a known proposer schedule or sampling without replacement inside the epoch, replace `survival_x(s)` with the schedule-specific survival function.

Average survival after `s` slots in one epoch:

```text
S(s) = sum_x P(X = x) * survival_x(s)
```

End-of-epoch survival:

```text
pEpoch = S(epochSlots)
```

Assume committees are independently resampled each epoch. Define multi-epoch survival for elapsed slot count `t`.

For `t = 0`:

```text
survival(0) = 1
```

For `t > 0`:

```text
fullEpochs = floor(t / epochSlots)
residualSlots = t mod epochSlots

if residualSlots == 0:
  survival(t) = pEpoch ^ fullEpochs
else:
  survival(t) = (pEpoch ^ fullEpochs) * S(residualSlots)
```

Find the first slot `t >= 1` where total survival is below the target survival:

```text
targetSurvival = 1 - target
survival(t) <= targetSurvival
```

Convert the target slot to time:

```text
delayDays = targetSlots * slotSeconds / 86400
```

## Chart Output
- x-axis: actual censoring stake fraction `qActual = K / N`, from `0` to `0.5`
- y-axis: `delayDays`, formatted as seconds/minutes/hours/days
- series: Aztec committee static baseline
- optional marker: current project censoring stake fraction, rounded to `K = round(N * qConfigured)` and plotted at `K / N`

## Edge Cases
- `qActual = 0`: `K = 0`, no committee censors exist, so T99 is reached at the first slot.
- `target >= 1`: reject for this chart. T100 is not generally finite in a probabilistic model.
- `n > N`: reject as invalid input. The hypergeometric committee model is not defined.
- `pEpoch >= 1`: no finite live-chain inclusion delay under this model.
- `pEpoch = 0`: scan the first epoch only; the target is reached within at most `epochSlots`.

## Interpretation
This is a probabilistic live-chain inclusion delay for a static equal-stake validator/sequencer set. It does not claim deterministic inclusion, and it does not describe what happens once the chain is no longer live.
