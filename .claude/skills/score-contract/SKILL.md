---
name: score-contract
description: Score all permissioned functions on a contract — assess fund impact (drain risk, token devaluation, yield reduction), set scores (critical/no-impact), and add on-chain mitigations. Combines impact analysis and mitigation detection into a single batch workflow.
---

# Score Contract

Batch-analyze all permissioned functions on a contract: assess each function's potential impact on funds, score them, and find on-chain mitigations for impactful ones.

## Arguments

```
/score-contract <project> <contractAddress>
```

- **project** — project folder name (e.g. `aerodrome`, `aave-v3`)
- **contractAddress** — chain-prefixed contract address (e.g. `base:0xB630...`) or contract name (e.g. `CLGaugeFactory`). Add chain prefix if omitted.

## Instructions

### Phase 1: Gather permissioned functions

Read `packages/config/src/projects/<project>/functions.json` and collect all functions for the given contract address that have `"isPermissioned": true`.

If the user provided a contract name instead of an address, resolve it by searching `functions.json` or `discovered.json` for the matching contract.

**Output — Function List:**

```
CONTRACT: CLGaugeFactory (base:0xB630...)
PERMISSIONED FUNCTIONS (6):
  1. setEmissionCap         — score: unscored
  2. setDefaultCap          — score: unscored
  3. setRedistributor       — score: unscored
  4. setEmissionAdmin       — score: critical, has mitigations
  5. setNotifyAdmin         — score: unscored
  6. setSecondsPerLiquidity — score: no-impact, has mitigations
```

Skip functions that already have BOTH a non-`unscored` score AND a `mitigations` array — they are fully reviewed. Mention how many were skipped and why.

Functions with a score but no mitigations, or with mitigations but `unscored`, should still be analyzed for the missing part.

### Phase 2: Locate source code

Find the flattened source in `packages/config/src/projects/<project>/.flat/`. Match by address in the filename. If not found, check `packages/config/crytic-export/etherscan-contracts/` by address.

Read the full source file to have context for all functions.

### Phase 3: Analyze impact for each function

For each remaining permissioned function:

1. **Identify storage mutations** — what does the function write?
2. **Trace read sites** — search ALL `.flat/` files for where the written field is read
3. **Follow call chains** — trace from read site to the entry point where funds are affected
4. **Assess fund impact** — determine whether the function can cause any of the following:

#### Impact categories

Evaluate each function against these risk dimensions:

- **Fund drain** — Can the caller direct protocol-held funds to an arbitrary address? (e.g. setting a fee recipient, changing a withdrawal address, upgrading to a malicious implementation)
- **Token devaluation** — Can the caller debase or inflate a protocol token? (e.g. minting tokens, changing exchange rates, manipulating oracles)
- **Accumulated yield reduction** — Can the caller reduce rewards/fees already earned by depositors? (e.g. changing how `earned()` computes accrued rewards, modifying reward rates retroactively)
- **Future yield/fee impact** — Can the caller change fees, emission rates, or reward parameters for future periods? (e.g. fee changes that apply on next swap, emission caps for next epoch)
- **Freeze/DoS** — Can the caller pause, freeze, or block user withdrawals/claims? (e.g. pausing contracts, blacklisting addresses, setting zero addresses)
- **Configuration change** — Does the function only set addresses, toggle features, or update non-financial governance params with no direct fund impact?

#### Scoring rules

Based on the impact assessment, determine the appropriate score:

- **`critical`** — The function can cause fund drain, token devaluation, accumulated yield reduction, or freeze/DoS on existing depositors. Even if mitigated, the risk category warrants `critical`.
- **`no-impact`** — The function only affects future parameters (future yield/fees that apply to new interactions), or is purely a configuration change with no path to fund impact. Future fee changes on swaps/trades are `no-impact` — they don't affect past swaps or accumulated LP fees.

**Key distinctions:**
- A fee that applies to future swaps → `no-impact` (past swaps unaffected, accumulated fees unchanged)
- A parameter read during `distribute()` once per epoch → `no-impact` (only affects future epoch allocations)
- A parameter that changes how `earned()` computes accrued rewards → `critical` (retroactive)
- Setting a fee recipient to an arbitrary address → `critical` (fund drain vector)
- Pausing withdrawals → `critical` (freeze/DoS)
- Changing an admin address → `critical` (escalation path)

#### Temporal context

For each function, also note the temporal path for context:

- **Checkpoint/distribute** — value read during epoch transitions or reward distribution
- **Swap/trade** — value read on every swap (fee calculation, price computation)
- **Claim/withdraw** — value read when users claim or withdraw
- **Governance/config** — sets addresses, toggles, thresholds

Present a summary table:

```
IMPACT ANALYSIS RESULTS:

  #  Function              Score       Impact                              Path
  ── ───────────────────── ─────────── ─────────────────────────────────── ──────────────────────
  1. setDefaultCap         no-impact   Future emission cap only            checkpoint/distribute
  2. setRedistributor      critical    Changes recipient of excess funds   fund drain vector
  3. setNotifyAdmin        critical    Controls who triggers distribution  governance escalation
  4. bulkUpdateFees        no-impact   Fee applies to future swaps only    swap/trade (future)
```

Ask the user to confirm the scores and impact assessments before proceeding. They may want to adjust.

### Phase 4: Find mitigations

For each function (regardless of score), analyze the function body for on-chain constraints:

1. **Value range** (`type: "valueRange"`) — `require(value <= MAX)`, `require(value >= MIN)`, `require(value != 0)`
2. **Delay** (`type: "delay"`) — timelocks, cooldown periods
3. **Relative value** (`type: "relativeValue"`) — max change per call
4. **Other** (`type: "other"`) — rate limiting, once-per-epoch, formula-driven

For each constraint found, determine:
- The **bound values** (constants, storage variables, or computed)
- Whether the bound is **hardcoded**, **discovered**, or a **fieldRef**

Do NOT include access control as a mitigation — already captured by `isPermissioned` and `ownerDefinitions`.

Present all findings grouped by function:

```
MITIGATIONS FOUND:

setDefaultCap (no-impact):
  1. [valueRange] Must be >= 1 and <= MAX_BPS (10000 bps)
     Source: require(_defaultCap != 0, "ZDC"); require(_defaultCap <= MAX_BPS, "MC")

setRedistributor (critical):
  1. [other] Cannot be set to current VE team address
     Source: require(redistributor != IVotingEscrow(IVoter(voter).ve()).team(), "ET")

bulkUpdateFees (no-impact):
  1. [valueRange] Fee <= MAX_BASE_FEE (30000 = 3%) or ZERO_FEE_INDICATOR (420)
     Source: require(fee <= MAX_BASE_FEE || fee == ZERO_FEE_INDICATOR, "MBF")

setNotifyAdmin (critical):
  (no mitigations beyond access control)
```

Ask the user to confirm which mitigations to apply. They may want to skip some or adjust descriptions.

### Phase 5: Apply scores and mitigations to functions.json

For each function, update `functions.json`:

#### Updating scores

- Set the `score` field to the confirmed value (`"critical"` or `"no-impact"`)
- Do NOT change scores that the user has explicitly overridden

#### Adding mitigations

Follow the mitigation format:

```json
{
  "type": "valueRange",
  "description": "Human-readable description of the constraint",
  "valueRange": {
    "min": { "mode": "...", ... },
    "max": { "mode": "...", ... },
    "unit": "bps"
  },
  "mitigatedField": {
    "contractAddress": "base:0x...",
    "fieldName": "FIELD_NAME"
  }
}
```

#### Value modes

- **`"hardcoded"`** — literal value in code. Use `"value": "123"`.
- **`"discovered"`** — field tracked in `discovered.json`. Use when the bound is a contract storage variable (constant or mutable) that discovery fetches.
- **`"fieldRef"`** — path expression like `$self.FIELD`, `@ref.FIELD`.

**Choosing between modes:**
- Solidity `constant`/`immutable` in `discovered.json` → `"discovered"`
- Storage variable on same contract → `"fieldRef"` with `$self.FIELD`
- Literal number not stored anywhere → `"hardcoded"`
- When in doubt, prefer `"discovered"` over `"hardcoded"`

#### Mitigation types

- **`valueRange`** — require statements bounding a parameter
- **`delay`** — timelock or cooldown constraints (`delaySeconds`, optional `delayRef`)
- **`relativeValue`** — max-change-per-call constraints (`maxChangePercent`)
- **`other`** — anything else (rate limiting, once-per-epoch, etc.)

#### Rules

- Find function entry by `contractAddress` and `functionName`
- Append to existing `mitigations` array (don't duplicate)
- Create `mitigations` array if none exists
- Do NOT modify other fields besides `score` and `mitigations` (keep ownerDefinitions, timestamps, etc.)
- Do NOT add access control as a mitigation

### Phase 6: Final report

```
═══════════════════════════════════════════════════
CONTRACT SCORING: CLGaugeFactory (base:0xB630...)
═══════════════════════════════════════════════════

Permissioned functions: 6
  Skipped (fully reviewed): 1
  Analyzed: 5

RESULTS:
  Function              Score       Mitigations Added
  ─────────────────────────────────────────────────────
  setDefaultCap         no-impact   1 (valueRange: 1 to MAX_BPS)
  setRedistributor      critical    1 (other: cannot be VE team)
  setEmissionAdmin      —           skipped (already reviewed)
  setNotifyAdmin        critical    0
  bulkUpdateFees        no-impact   1 (valueRange: <= 3%)

Scores set: 4 (2 critical, 2 no-impact)
Total mitigations added: 3
═══════════════════════════════════════════════════
```
