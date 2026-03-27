---
name: score-contract
description: Score all permissioned functions on a contract — assess fund impact (drain risk, token devaluation, yield reduction), set scores (critical/no-impact), and add on-chain mitigations. Combines impact analysis and mitigation detection into a single batch workflow.
---

# Score Contract

Batch-analyze all permissioned functions on a contract: assess each function's potential impact on funds, score them, and find on-chain mitigations for impactful ones.

Uses **structured API data** (call graph, fund reachability, capital analysis) as the primary input. Falls back to deep source code tracing only when the call graph has unresolved external calls.

## Arguments

```
/score-contract <project> <contractAddress>
/score-contract <project> --all --interactive
```

- **project** — project folder name (e.g. `aerodrome`, `aave-v3`)
- **contractAddress** — chain-prefixed contract address (e.g. `base:0xB630...`) or contract name (e.g. `CLGaugeFactory`). Add chain prefix if omitted.
- **--all --interactive** — score every contract with permissioned functions, one at a time, waiting for user confirmation after each.

## Instructions

### Phase 1: Fetch structured data

Gather data from the API and disk. All API calls go to `localhost:2021`.

**From API:**

```bash
# Admin-level function analysis with capital data (per-contract)
curl -s "localhost:2021/api/projects/<project>/admins?contract=<address>"

# Full function analysis with reachability and unresolved call counts
curl -s "localhost:2021/api/projects/<project>/function-analysis"
```

The `/admins` response provides per-function:
- `directFundsUsd`, `directTokenValueUsd` — funds on the contract itself
- `totalReachableFundsUsd`, `totalReachableTokenValueUsd` — funds on contracts reachable via call graph
- `reachableContracts[]` — each with `contractName`, `calledFunctions[]`, `fundsUsd`, `viewOnlyPath`
- `unresolvedCallsCount` — number of external calls the call graph couldn't resolve

The `/function-analysis` response provides the same reachability per function, plus `callPath[]` showing the shortest path to each reachable contract.

**From disk:**

- Read `packages/config/src/projects/<project>/functions.json` — permissioned function list with current scores/mitigations
- Read `packages/config/src/projects/<project>/call-graph-data.json` — needed to get **details** of unresolved calls (the API only exposes the count; the on-disk data has `storageVariable`, `interfaceType`, `calledFunction` for calls without `resolvedAddress`)

If the user provided a contract name instead of an address, resolve it by searching `functions.json` or `discovered.json` for the matching contract.

**Output — Function List:**

```
CONTRACT: CLGaugeFactory (base:0xB630...)
PERMISSIONED FUNCTIONS (6):
  #  Function              Score       Funds at Risk    Unresolved
  ── ───────────────────── ─────────── ──────────────── ──────────
  1. setEmissionCap        unscored    $0 direct        0
  2. setDefaultCap         unscored    $0 direct        0
  3. setRedistributor      unscored    $12.4M reach.    0
  4. setEmissionAdmin      critical    (skipped)        -
  5. setNotifyAdmin        unscored    $12.4M reach.    2
  6. setSecondsPerLiq      no-impact   (skipped)        -
```

Skip functions that already have BOTH a non-`unscored` score AND a `mitigations` array — they are fully reviewed. Mention how many were skipped and why.

Functions with a score but no mitigations, or with mitigations but `unscored`, should still be analyzed for the missing part.

### Phase 2: Score functions (API-first, source-as-fallback)

For each remaining permissioned function, determine the score using one of two paths:

#### Path A — Fully resolved (unresolvedCallsCount == 0)

The call graph is complete. Use the structured API data:

1. Check `reachableContracts[]` — which contracts can this function reach, do they hold funds?
2. Check `viewOnlyPath` — is the path view-only (no state changes)?
3. Check `directFundsUsd` / `totalReachableFundsUsd` / `totalTokenValueAtRisk`

If no reachable contracts with funds AND no direct funds AND no token value → likely `no-impact`.

If funds are reachable through a non-view path → **temporal classification needed**. Read only the **terminal function** in the API-provided call path (the function on the fund-holding contract) to determine when/how the value is consumed. Classify as checkpoint/distribute, claim/withdraw, swap/trade, or governance/config (see temporal context below).

#### Path B — Unresolved calls (unresolvedCallsCount > 0)

The call graph has gaps. Print which calls are unresolved from `call-graph-data.json`:

```
⚠ UNRESOLVED CALLS for setNotifyAdmin:
  - storageVariable: externalOracle, interface: IOracle, function: getPrice
  - storageVariable: rewardDistributor, interface: IDistributor, function: distribute
```

Fall back to the deep source trace: follow the `/analyze-impact` methodology — identify storage mutations in the function, grep ALL `.flat/` files for read sites of the written field, trace the full call chain from each read site to the entry point where funds are affected, and classify the temporal impact.

Read the `/analyze-impact` skill for the full methodology (Phase 1-3: storage mutation → read site tracing → temporal classification).

#### Impact categories

Evaluate each function against these risk dimensions:

- **Fund drain** — Can the caller direct protocol-held funds to an arbitrary address? (e.g. setting a fee recipient, changing a withdrawal address, upgrading to a malicious implementation)
- **Token devaluation** — Can the caller debase or inflate a protocol token? (e.g. minting tokens, changing exchange rates, manipulating oracles)
- **Accumulated yield reduction** — Can the caller reduce rewards/fees already earned by depositors? (e.g. changing how `earned()` computes accrued rewards, modifying reward rates retroactively)
- **Future yield/fee impact** — Can the caller change fees, emission rates, or reward parameters for future periods? (e.g. fee changes that apply on next swap, emission caps for next epoch)
- **Freeze/DoS** — Can the caller pause, freeze, or block user withdrawals/claims? (e.g. pausing contracts, blacklisting addresses, setting zero addresses)
- **Configuration change** — Does the function only set addresses, toggle features, or update non-financial governance params with no direct fund impact?

#### Scoring rules

- **`critical`** — The function can cause fund drain, token devaluation, accumulated yield reduction, or freeze/DoS on existing depositors. Even if mitigated, the risk category warrants `critical`.
- **`no-impact`** — The function only affects future parameters (future yield/fees that apply to new interactions), or is purely a configuration change with no path to fund impact.

**Key distinctions:**
- A fee that applies to future swaps → `no-impact` (past swaps unaffected, accumulated fees unchanged)
- A parameter read during `distribute()` once per epoch → `no-impact` (only affects future epoch allocations)
- A parameter that changes how `earned()` computes accrued rewards → `critical` (retroactive)
- Setting a fee recipient to an arbitrary address → `critical` (fund drain vector)
- Pausing withdrawals → `critical` (freeze/DoS)
- Changing an admin address → `critical` (escalation path)

#### Temporal context

For each function, note the temporal path:

- **Checkpoint/distribute** — value read during epoch transitions or reward distribution
- **Swap/trade** — value read on every swap (fee calculation, price computation)
- **Claim/withdraw** — value read when users claim or withdraw
- **Governance/config** — sets addresses, toggles, thresholds

**Output — Summary Table:**

```
IMPACT ANALYSIS RESULTS:

  #  Function              Score       Method  Impact                              Path
  ── ───────────────────── ─────────── ─────── ─────────────────────────────────── ──────────────
  1. setDefaultCap         no-impact   API     Future emission cap only            checkpoint
  2. setRedistributor      critical    API     Changes recipient of excess funds   fund drain
  3. setNotifyAdmin        critical    DEEP    Controls who triggers distribution  escalation
  4. bulkUpdateFees        no-impact   API     Fee applies to future swaps only    swap (future)
```

**Ask the user to confirm the scores before proceeding.** They may want to adjust.

### Phase 3: Find mitigations (guided by fund impact)

Only look for mitigations on functions where `directFundsUsd > 0` OR `totalReachableFundsUsd > 0` OR `totalTokenValueAtRisk > 0`. For `no-impact` scored functions with zero fund exposure, skip mitigations unless the user explicitly asks.

1. **Locate source code** — find the flattened source in `packages/config/src/projects/<project>/.flat/`. Match by address in the filename.
2. **Analyze each function body** for on-chain constraints (value ranges, delays, relative bounds, other). Do NOT include access control as a mitigation.
3. **Quick-pass for shared patterns** — after finding mitigations on one function, scan other functions on the same contract for the same pattern (e.g., all setters bounded by the same MAX constant, all functions using the same timelock).
4. **Non-standard constraints** — if a constraint cannot be expressed using the 4 standard types (valueRange, delay, relativeValue, other), **warn the user**: "Found constraint [describe it] that may need manual entry or a custom `other` description."

Construct mitigations following the format defined in the `/add-mitigation` skill. Quick reference:
- **Types**: `valueRange` (min/max bounds), `delay` (timelock/cooldown), `relativeValue` (max change per call), `other` (anything else)
- **Value modes**: `hardcoded` (literal), `discovered` (tracked in discovered.json), `fieldRef` (path expression like `$self.FIELD`)
- See `/add-mitigation` for full format spec, JSON examples, and mode selection rules

**Output — Mitigations by Function:**

```
MITIGATIONS FOUND:

setDefaultCap (no-impact, $0 funds):
  (skipped — no fund impact)

setRedistributor (critical, $12.4M reachable):
  1. [other] Cannot be set to current VE team address
     Source: require(redistributor != IVotingEscrow(IVoter(voter).ve()).team(), "ET")

setNotifyAdmin (critical, $12.4M reachable):
  (no mitigations beyond access control)

bulkUpdateFees (no-impact, $0 funds):
  (skipped — no fund impact)
```

**Ask the user to confirm which mitigations to apply.** They may want to skip some or adjust descriptions.

### Phase 4: Apply scores and mitigations via API

For each function, save via the functions update API. This ensures correct address normalization, attribution stamping, and config severity integration (auto-writes `severity: "HIGH"` for mitigatedField references).

**Per-function update:**

```bash
curl -s -X PUT "localhost:2021/api/projects/<project>/functions" \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "<address>",
    "functionName": "<name>",
    "score": "critical",
    "mitigations": [...]
  }'
```

The API merges with existing data — only the fields you send are updated. Existing `ownerDefinitions`, `delay`, `checked`, etc. are preserved.

#### Rules

- Set `score` to `"critical"` or `"no-impact"` as confirmed
- Set `mitigations` to the full array (existing + new) — the API replaces the whole array
- To read existing mitigations before appending, fetch the current function data from `GET /api/projects/<project>/functions` first
- Do NOT change scores that the user has explicitly overridden
- Do NOT add access control as a mitigation

### Phase 5: Final report

```
═══════════════════════════════════════════════════
CONTRACT SCORING: CLGaugeFactory (base:0xB630...)
═══════════════════════════════════════════════════

Permissioned functions: 6
  Skipped (fully reviewed): 1
  Analyzed: 5
  Analysis method: 4 via API, 1 via deep source trace

RESULTS:
  Function              Score       Mitigations Added
  ─────────────────────────────────────────────────────
  setDefaultCap         no-impact   0 (no fund impact)
  setRedistributor      critical    1 (other: cannot be VE team)
  setEmissionAdmin      —           skipped (already reviewed)
  setNotifyAdmin        critical    0
  bulkUpdateFees        no-impact   0 (no fund impact)

Scores set: 4 (2 critical, 2 no-impact)
Total mitigations added: 1
═══════════════════════════════════════════════════
```

---

## `--all --interactive` Mode

When invoked as `/score-contract <project> --all --interactive`:

### Phase 0: Build contract queue

Read `functions.json` and extract all contract addresses that have at least one permissioned function where either:
- `score` is `"unscored"` or missing
- `mitigations` is missing (and function has fund impact)

Sort contracts by name for predictable order. Print the queue:

```
SCORING QUEUE: 17 contracts with unscored permissioned functions

  1. CLGaugeFactory (base:0xB630...)          — 5 unscored functions
  2. CLGauge (base:0xA123...)                 — 3 unscored functions
  3. Voter (base:0xD456...)                   — 8 unscored functions
  ...
```

### Loop: Process each contract

For each contract in the queue:

1. Print header: `Processing contract 3/17: CLGaugeFactory (base:0xB630...)`
2. Execute Phases 1-3 for this single contract
3. Present the results (scores + mitigations found)
4. **Wait for user input:**
   - **confirm** — save scores and mitigations via Phase 4, move to next contract
   - **adjust** — user provides corrections (e.g. "change setFoo to no-impact", "skip the valueRange mitigation on setBar"), then save
   - **skip** — do not save anything for this contract, move on
5. Print progress: `Completed 3/17 contracts. 14 remaining.`

### Final aggregate report

After all contracts are processed:

```
═══════════════════════════════════════════════════
PROJECT SCORING COMPLETE: aerodrome
═══════════════════════════════════════════════════

Contracts processed: 17
  Confirmed: 14
  Skipped: 3

Functions scored: 42
  Critical: 18
  No-impact: 24

Mitigations added: 15
  valueRange: 8, delay: 2, relativeValue: 1, other: 4
═══════════════════════════════════════════════════
```