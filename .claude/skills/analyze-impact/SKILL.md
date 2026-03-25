---
name: analyze-impact
description: Analyze whether a permissioned function can affect already-committed funds or only future allocations. Traces storage writes through read sites across contracts to determine temporal impact. Use when scoring a function's risk to existing depositors.
---

# Analyze Impact

Determine whether a permissioned function can retroactively affect funds already deposited/committed, or only future allocations.

## Arguments

```
/analyze-impact <project> <contractAddress> <functionName>
```

- **project** — project folder name (e.g. `aerodrome`, `aave-v3`)
- **contractAddress** — chain-prefixed address (e.g. `base:0xB630...`). Add prefix if omitted.
- **functionName** — the function to analyze (e.g. `setEmissionCap`)

## Instructions

Execute all phases sequentially. Each phase produces auditable output that the researcher can verify.

### Phase 1: Identify the storage mutation

Read the function's source code from the flattened `.flat/` directory.

**Output — Storage Mutation Report:**

```
FUNCTION: setEmissionCap(address _gauge, uint256 _emissionCap)
CONTRACT: CLGaugeFactory (base:0xB630...)
SOURCE FILE: CLGaugeFactory-base:0xB630....sol
LINE: 265-270

STORAGE WRITTEN:
  _emissionCaps[_gauge] = _emissionCap    (line 269)

ACCESS CONTROL:
  require(msg.sender == emissionAdmin)     (line 266)

CONSTRAINTS:
  require(_emissionCap <= MAX_BPS)         (line 268)
```

Include the exact source lines so the researcher can verify.

### Phase 2: Trace all read sites

Search ALL source files in the project's `.flat/` directory for every location where the modified storage field is read. Include both direct reads and reads through getter functions.

For each read site, extract:
- Which function reads it
- Which contract it's in
- The surrounding code context (5-10 lines)
- Whether the read is in a `view`/`pure` function or a state-changing function

**Output — Read Site Report:**

```
READ SITES for `_emissionCaps` / `emissionCaps()`:

1. CLGaugeFactory.emissionCaps() — view getter (line 295-298)
   │  function emissionCaps(address _gauge) public view override returns (uint256) {
   │      uint256 emissionCap = _emissionCaps[_gauge];
   │      return emissionCap == 0 ? defaultCap : emissionCap;
   │  }
   │
   ├─► Called by: CLGaugeFactory.calculateMaxEmissions() (line 331)

2. CLGaugeFactory.calculateMaxEmissions() — state-changing (line 329-352)
   │  uint256 maxRate = emissionCaps({_gauge: _gauge});
   │  ...
   │  return (weeklyEmissions * maxRate) / MAX_BPS;
   │
   ├─► Called by: CLGauge.notifyRewardAmount() (line 953)

3. CLGauge.notifyRewardAmount() — state-changing (line 946-...)
   │  uint256 maxAmount = gaugeFactory.calculateMaxEmissions({_gauge: address(this)});
   │  if (_amount > maxAmount) { ... excess to Redistributor ... }
   │
   ├─► Called by: Voter.distribute() (external entry point)
```

**IMPORTANT:** Show the full call chain as a tree so the researcher can follow the path from storage write to the point where funds are affected. Include line numbers and source snippets for every step.

### Phase 3: Classify temporal impact

For each terminal read site (where the value actually influences fund flows), classify it:

**Categories:**

- **CHECKPOINT/DISTRIBUTE path** — The value is only read when new funds are being allocated for a future period. Changes take effect at the next checkpoint. Already-deposited funds are unaffected.
  - Indicators: called during `distribute`, `notifyRewardAmount`, `updatePeriod`, epoch transitions
  - Indicators: sets a `rewardRate` for a future period, computes new allocations

- **CLAIM/WITHDRAW path** — The value is read when users claim or withdraw existing funds. Changes can retroactively affect already-earned/deposited amounts.
  - Indicators: called during `claim`, `withdraw`, `getReward`, `transfer`, `redeem`
  - Indicators: directly computes payout amounts, affects accrued balances

- **SWAP/TRADE path** — The value is read during trades, affecting fee splits or pricing for all current positions.
  - Indicators: called during `swap`, fee calculation, price computation
  - Indicators: affects all existing LPs immediately

- **GOVERNANCE/CONFIG path** — The value changes protocol parameters that take effect on next interaction.
  - Indicators: changes a threshold, toggles a feature, sets an address

**Output — Impact Classification:**

```
IMPACT CLASSIFICATION:

Chain: setEmissionCap → _emissionCaps → emissionCaps() → calculateMaxEmissions() → notifyRewardAmount() → distribute()

Category: CHECKPOINT/DISTRIBUTE path
Reasoning:
  - notifyRewardAmount() is called once per epoch during distribute()
  - It sets rewardRate for the upcoming week
  - After rewardRate is set, the cap is not re-read until next epoch
  - Already-accruing rewards (rewardRate * time) are unaffected

VERDICT: ⚡ FUTURE ONLY — change affects next epoch's emission allocation, not current depositors' accrued rewards.
```

Or if it does affect existing funds:

```
Category: SWAP/TRADE path
Reasoning:
  - unstakedFee() is called on every swap in the pool
  - applyUnstakedFees() splits fees between staked/unstaked LPs using the current value
  - Changing defaultUnstakedFee immediately changes fee splits for all existing positions

VERDICT: ⚠️ RETROACTIVE — change immediately affects fee distribution for all existing unstaked LPs.
```

### Phase 4: Present summary

Combine all phases into a final summary with clear evidence chain:

```
═══════════════════════════════════════════════════
IMPACT ANALYSIS: setEmissionCap on CLGaugeFactory
═══════════════════════════════════════════════════

WRITES: _emissionCaps[_gauge]
READ BY: emissionCaps() → calculateMaxEmissions() → notifyRewardAmount()
ENTRY POINT: Voter.distribute() (once per epoch)

VERDICT: ⚡ FUTURE ONLY
  The emission cap is read only during distribute(), which runs
  once per epoch. After notifyRewardAmount sets the rewardRate,
  the cap is not consulted again. Existing stakers continue
  earning at the previously-set rate until the next epoch.

EVIDENCE:
  1. setEmissionCap writes _emissionCaps (CLGaugeFactory:269)
  2. calculateMaxEmissions reads emissionCaps() (CLGaugeFactory:331)
  3. notifyRewardAmount reads calculateMaxEmissions (CLGauge:953)
  4. rewardRate is set and not re-read from cap (CLGauge:960-970)

RISK TO EXISTING DEPOSITORS: None
RISK TO FUTURE DEPOSITORS: Reduced emissions for affected gauge
═══════════════════════════════════════════════════
```

Do NOT add anything to functions.json — this skill is purely analytical. The researcher uses the output to inform their scoring and mitigation decisions.
