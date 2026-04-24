# Design: Shared-Implementation Fan-Out

**Status**: implemented; verified on 12 DeFiDisco projects
**Scope**: `packages/l2b/src/implementations/discovery-ui/defidisco/{projectAnalysis,capitalAnalysis,functionAnalysis,fundsData,addressUtils}.ts`
**Motivation**: correct admin/dependency/funds analysis for factory-deployed proxy patterns (Aave ATokens, debt tokens, similar Uniswap-style factory outputs)

---

## 1. Problem

A single implementation contract (IMPL) can be shared by N proxy contracts. In Aave v3, one AToken implementation is shared by every reserve's AToken proxy (18 proxies on Spark). Each proxy:

- has its own storage (underlying asset, reserve-level state, role members)
- holds its own user deposits (the proxy is the receiving address for deposits in the underlying)
- delegates execution to the same impl bytecode

The DeFiDisco analysis pipeline currently models each impl→proxy relationship as **one-to-one** in several places. When N > 1 this produces wrong results.

---

## 2. Observed symptoms (Spark, today)

### 2.1 Admin aggregation under-counts and mis-attributes

`/api/projects/spark/admins` for the **Pool** admin returns 6 function rows for AToken operations (`mint`, `burn`, `mintToTreasury`, `transferOnLiquidation`, `transferUnderlyingTo`, `handleRepayment`). Each row:

- `contractAddress`: `eth:0x6175ddEc…6` (the shared AToken IMPL)
- `directFundsUsd`: `$154,366,352`

The `$154M` is **USDT that someone accidentally sent to the impl address directly** — unrelated to user deposits on any of the 18 AToken proxies. The real user deposits across all 18 proxies total roughly **$2.5B** (spwstETH $1.9B, spWETH $84M, spDAI $89M, …).

The admin-level aggregate (`directContractsTotalFunds`, `grandTotalFundsUsd`) returns `$0` — a further cascading issue where the misattribution to IMPL disconnects the admin-level roll-up entirely.

### 2.2 Reachable contracts collapse via `resolveToProxy`

In `capitalAnalysis.ts`, reachable contracts are deduplicated by `resolveToProxy(target)` when the target could be reached via both proxy and impl addresses. With N proxies sharing one impl, the collapse folds all reachable proxies into **one arbitrary proxy** (the last-iterated one) — silently dropping the other N−1.

### 2.3 Path expressions resolve against an arbitrary proxy

Owner definitions stored on an impl-level entry (e.g. AToken's `burn` with `{path: "$self.POOL"}`) resolve by:

1. `resolvePathExpression(dataAccess, IMPL, "$self.POOL")`
2. `$self` → `currentContractAddress` = IMPL
3. `findContract(IMPL)` → returns the **first** proxy matching this impl (from `.find()`)
4. Reads `POOL` from that proxy's values

This **happens to work** when the referenced field is identical across all proxies (e.g. every AToken's `POOL` = the same Pool contract). It **silently fails** when the field differs per proxy — e.g. `$self.UNDERLYING_ASSET_ADDRESS` would return one arbitrary proxy's underlying for all 18, with no warning.

### 2.4 Dependencies iteration vs admins iteration asymmetry

`getAdmins` iterates `functionsData.contracts` directly, so it sees impl-keyed owner definitions. `getDependencies` iterates `writeFunctionsByContract` (keyed by proxy) and calls `lookupFunctionMetadata(meta, proxy, fn)` — which never finds impl-keyed entries. So a manual `dependencies` entry on a shared impl is **invisible** to `/dependencies` today, even though the same entry's `ownerDefinitions` are visible to `/admins`.

---

## 3. Root cause (three compounding issues)

### 3.1 `buildImplementationToProxyMap` is many-to-one

[`packages/l2b/src/implementations/discovery-ui/defidisco/addressUtils.ts:207-248`](../../../packages/l2b/src/implementations/discovery-ui/defidisco/addressUtils.ts)

Returns `Map<impl, proxy>`. For each proxy with `$implementation = IMPL`, the code runs `map.set(IMPL, proxy)` — **each call overwrites the previous value**. For N proxies sharing an impl, only the last-iterated proxy survives.

### 3.2 `enrichFundsWithImplementations` skips impls that have their own funds entry

[`packages/l2b/src/implementations/discovery-ui/defidisco/fundsData.ts:132-175`](../../../packages/l2b/src/implementations/discovery-ui/defidisco/fundsData.ts)

Intended to mirror a proxy's funds onto the impl address so `getContractFunds(IMPL)` returns the proxy's balance. Two issues:

1. Uses the many-to-one map above, so even if mirroring ran it would only mirror ONE of the N proxies
2. Skips mirroring entirely (`if (normalizedFunds.has(implAddr)) continue`) when the impl itself has its own funds entry — which is the case on Spark's AToken impl due to the misrouted USDT

### 3.3 Impl-level metadata is treated as a single-instance entry, not a template

`getAdmins` emits **one row per functions.json entry**. A shared-impl entry thus produces one admin relationship total — instead of N relationships (one per proxy). Capital aggregation keys by impl too, so the N-proxy funds cannot be summed in the first place.

---

## 4. Fix A — fan-out at read time

### 4.1 Core idea

Treat impl-level function metadata as a **template** that expands to N rows at analysis time, one per proxy using the impl. Path expressions re-bind `$self` to each specific proxy. Funds lookups, admin aggregation, and reachable-contracts handling all run per-proxy.

Storage layout stays as-is (impl-keyed entries remain impl-keyed). Researcher edits stay in one place — the analysis pipeline does the fan-out.

### 4.2 Changes by module

| Module | Change |
|---|---|
| `addressUtils.ts` | `buildImplementationToProxyMap` → `buildImplToProxiesMap` returning `Map<impl, Set<proxy>>`. Keep an accessor `resolveToSingleProxy` (current behavior) only where intentionally ambiguous (e.g. name propagation). |
| `fundsData.ts` | Either (a) drop `enrichFundsWithImplementations` entirely (no longer needed because all lookups key by proxy post-fix), or (b) change it to sum across all N proxies and write that onto the impl — lower-risk choice preserves lookup-by-impl for any straggler callers. |
| `projectAnalysis.ts::getAdmins` | Before the iteration, expand `functionsData.contracts` into a virtual stream: for each `(address, function)`, if `address` is an impl with proxies, emit N `(proxy, function)` tuples with `currentContractAddress = proxy`. Otherwise emit `(address, function)` unchanged. Rest of the loop unchanged. |
| `projectAnalysis.ts::getDependencies` | Same expansion applied at the iteration entry. Then `lookupFunctionMetadata(meta, proxy, fn)` also checks impl-keyed entries by resolving proxy→impls. Fixes the asymmetry with `/admins`. |
| `capitalAnalysis.ts::resolveToProxy` | Preserve as-is for defensive dedup but fix callers to NOT collapse N proxies into one. In the reachable-contracts graph, emit N entries (one per proxy) rather than collapsing. In `directContracts` aggregation, add every proxy (not just one). |
| `capitalAnalysis.ts::analyzeAdminCapital` | Iterate the fanned-out admin.functions. Each virtual row already has `func.contractAddress = proxy`, so `analyzeFunctionCapital(proxy, …)` picks up the correct `getContractFunds(proxy)` with no further changes. |
| `functionAnalysis.ts::computeDependencies` | Already receives `startContractAddress = proxy` (writeFunctions is proxy-keyed). Metadata lookup needs to also consult impl-keyed entries. Path resolution uses proxy as currentContractAddress, which is already what we pass. |

### 4.3 Where fan-out does NOT happen

- **Storage and UI writes**: researcher edits on `burn` go to whichever address the entry lives at — impl if the entry is impl-keyed, proxy if it's proxy-keyed. Fan-out is a read-time expansion only.
- **Call graph data**: already per-proxy. No change needed.
- **Name propagation** (3 sites in `projectAnalysis.ts` / `reviewCompiler.ts` / `v2Scoring.ts`): all N proxies share the same contract name, so using any representative is fine. Leave as-is.

### 4.4 Worked example: `burn` on Spark

Today:
- `functions.json.contracts["IMPL_ATOKEN"].functions[burn]` → one entry with `{path: "$self.POOL"}`
- `getAdmins` iterates, emits 1 row: `{admin: Pool, function: {contractAddress: IMPL, funcName: burn, directFundsUsd: $154M (wrong)}}`

Post-fix:
- Same storage
- `getAdmins` expands the entry to 18 virtual rows (one per AToken proxy)
- Each virtual row: `{admin: Pool, function: {contractAddress: <proxy>, funcName: burn, directFundsUsd: <proxy's balance>}}`
- Pool admin's `functions[]` has 18 burn rows (spDAI $89M, spwstETH $1.9B, …)
- `directContractsTotalFunds` sums across 18 → ~$2.5B

---

## 5. Risk analysis — will this break other projects?

Audit methodology: for every DeFiDisco project (12 total), enumerate shared impls (impl address used by >1 proxy), then check whether `functions.json` has any entry stored at a shared-impl address. Only those entries will have observably different behavior after the fix.

### 5.1 Projects with shared-impl + active metadata (behavior changes)

#### Spark — AToken shared impl `0x6175ddEc…`
18 AToken proxies share this impl. Metadata entries: 9 (`mint`, `burn`, `mintToTreasury`, `transferOnLiquidation`, `transferUnderlyingTo`, `handleRepayment`, `rescueTokens`, `setIncentivesController`, `initialize`). Owner paths:
- `$self.POOL` (6 entries) — identical across all 18 proxies (all have the same Pool) → post-fix correctly shows 18 rows owned by Pool
- Absolute ACLManager paths with `accessControl` (2 entries, `rescueTokens`, `setIncentivesController`) — the ACLManager is a fixed address, independent of proxy → identical resolution per proxy
- `$self.proxyAdmin` on `initialize` (1 entry) — resolves to the proxy's hardcoded proxyAdmin field (set by template), same across all 18 proxies (all share the same PoolConfigurator as proxy admin)

**Expected post-fix behavior**: Pool admin gains 17 new rows per function (currently 1 row per function, will become 18). Capital totals grow from $154M (bogus) to roughly $2.5B (correct). No path resolution errors — every path in use is either proxy-invariant or points to a fixed external address.

#### Spark — SPK (Collector) shared impl `0xF1E57711…`
2 Collector proxies share this impl. Metadata entries: 4 (`approve`, `transfer`, `setFundsAdmin`, `initialize`). Owner path: `@getFundsAdmin.owner`.

Verified: both Collector proxies have identical `getFundsAdmin = 0x92eF091C…`, and that contract's `owner` field resolves to the same admin. Post-fix: admin rows double from 4 to 8, pointing to the same admin address. The admin's `directContracts` becomes 2 (correctly reflecting control over both Collectors) instead of 1.

**Expected post-fix behavior**: same admin, 2× the rows, correctly summed Collector balances.

#### EtherFi-Stake — DummyTokenUpgradeable shared impl `0x20E88508…`
4 proxies share this impl. Metadata entries: 3 (`mint`, `grantRole`, `revokeRole`). Owner paths:
- `$self.accessControl.MINTER_ROLE.members`
- `$self.accessControl.DEFAULT_ADMIN_ROLE.members`

Verified across the 4 proxies:
- `DEFAULT_ADMIN_ROLE` is identical for all 4 (single member `0x2aCA71…`)
- `MINTER_ROLE`: 3/4 proxies have the same single member (`0xD789…`); one proxy also has the zero-address as a member (likely a revoked-role artefact)

**Expected post-fix behavior**: admin rows 3× (3 to 12). The extra zero-address member surfaces on one proxy — EOA-like addresses are typically filtered downstream, but this should be verified during testing.

### 5.2 Projects with shared impls but NO metadata on them (no observable change today)

morpho, Steakhouse-USDC, Frankencoin, compound-v3, aerodrome, lido, uniswap-v2, uniswap-v3, liquity-v1, liquity-v2.

All have shared impls (commonly OZ `ProxyAdmin` or `TransparentUpgradeableProxy` patterns), but none of their `functions.json` entries are stored at those shared-impl addresses. Fix A has **zero observable effect** on current data. Future-safe: if metadata is ever added to one of those shared impls, fix A applies correctly.

### 5.3 Unique-impl cases (1 proxy per impl)

Every project has many of these (Pool, PoolConfigurator, RewardsController, etc.). In fan-out, `implToProxies[IMPL] = Set{proxy}` has exactly one element, so fan-out emits one row — identical to current behavior. **Zero behavioral change on unique-impl contracts.**

### 5.4 Summary risk matrix

| Case | # projects | Observable effect |
|---|---|---|
| Shared-impl + metadata + $self paths pointing to shared values | 3 cases across 2 projects | Row counts multiply by N; totals become accurate. No wrong-address resolution. |
| Shared-impl + metadata + $self paths pointing to per-proxy values | 0 (verified) | N/A |
| Shared-impl + no metadata | 8 projects | None |
| Unique-impl | all projects | None |

No case in any current project would be made worse by fix A. The observable changes are either corrections (Spark AToken fund attribution) or more-granular but semantically-equivalent rows (SPK Collector, EtherFi DummyToken).

### 5.5 Non-obvious risks to verify during implementation

1. **Dedup inside reachable contracts**: today `resolveToProxy` collapses proxy+impl into one node. Post-fix, the intent is "emit one node per proxy", but care is needed not to emit two nodes for the same proxy (one from a proxy-addressed edge, one from an impl-addressed edge). Needs explicit merge semantics.

2. **EOA filtering on AccessControl role members**: the EtherFi case surfaces a zero-address in MINTER_ROLE for one proxy. Confirm the downstream EOA filter strips these (otherwise the admin list shows a "0x000…000" row).

3. **Mitigation scoping**: mitigations with `scopedTo: {address, type: admin|dependency}` pin to a specific caller. Post-fix, a mitigation scoped to an admin now applies to N function rows (one per proxy). Confirm the scope semantics still work per-row.

4. **Write endpoint**: the UI's `updateFunctionEntry(contractAddress, functionName, …)` should continue to write to the stored address (impl for impl-keyed entries). Don't accidentally write to an expanded proxy address.

5. **Filter matching** (`matchesContractFilter`): the UI can query `/admins?contract=<impl>` or `/admins?contract=<proxy>`. Filter should match when the fanned-out row belongs to a proxy in the impl's set, OR when the impl itself was queried. Current single-value map works for impl→single-proxy but would need updating for impl→multi-proxy queries.

6. **Self-cap and impact-cap mitigations**: per-function caps from `impactCap` are applied per row. Confirm they still apply correctly when the same impl entry expands to N rows (each row should independently honour the cap).

---

## 6. Test plan

Before merging:

1. **Spark regression**: snapshot current `/admins`, `/dependencies`, `/admins?contract=<each AToken>` responses; run fix; compare. For each of the 18 AToken proxies, confirm the burn/mint/etc. entries resolve to Pool as admin with the correct proxy's balance as `directFundsUsd`.

2. **EtherFi-Stake**: snapshot admin output; confirm 3→12 admin row fan-out; check that the 0x0 MINTER_ROLE member is filtered as EOA (or surfaced explicitly).

3. **Unique-impl no-op test**: run a before/after snapshot on Compound v3 (which has no shared-impl metadata). Expect byte-identical admin/dependency output.

4. **Oracle deps smoke test** (previously built, proxy-level): confirm `/dependencies?contract=<AToken>` still returns the correct per-proxy oracle via the `$self.UNDERLYING_ASSET_ADDRESS` path.

5. **UI editing round-trip**: edit `burn` metadata via the UI (Pool impl-keyed entry) and confirm it writes to the impl address, not a proxy.

6. **Project totals**: `/admins.totals.totalCapitalAtRisk` should stay roughly constant after the fix on all projects (the total was already approximately correct via a different aggregation path; fix A changes per-admin attribution, not project totals).

---

## 7. Non-goals

- **Changing storage conventions**: impl-level and proxy-level metadata remain both valid. The fix is a read-time expansion, not a migration.
- **Fixing the AToken.burn call-graph gap** (missing underlying-token `safeTransfer` edge): orthogonal issue, noted in the correctness audit; doesn't block this fix because funds are held at the proxy address anyway.
- **Repairing `enrichFundsWithImplementations`'s mirror for every consumer**: post-fix, the mirror is redundant for the function-analysis paths. If any other caller still queries funds by impl address, preserve the mirror but make it sum across the N proxies.

---

## 8. Rollout (actual)

1. ✅ Added `buildImplToProxiesMap` (many-valued) and `buildProxyToImplsMap` (inverse) alongside the existing single-valued `buildImplementationToProxyMap`, which is now marked `@deprecated` but kept for the name-propagation call sites where single-valued lookup is safe (all proxies share the contract name).
2. ✅ `getAdmins`, `buildMitigationsLookup`, `buildResolvedImpactCaps`, `getFunctionImpact` in `projectAnalysis.ts` fan out impl-keyed entries to proxy rows.
3. ✅ `buildEnhancedGraph` in `enhancedTraversal.ts` fans out permission edges (target = each proxy), with `$self` rebinding per proxy.
4. ✅ `buildFunctionsMetadataLookup` in `functionAnalysis.ts` indexes impl-keyed entries under each proxy's key so the proxy-first iteration in `computeDependencies` finds them.
5. ✅ `CapitalAnalysisCalculator` gained a `proxyToImpls` ctor arg and `findFunctionMeta` helper that falls back to impl lookup for `functionHasImpact`/`functionIsNoImpact`.
6. ✅ CLAUDE.md (Proxy/Implementation Pattern), [permissions.md](../features/permissions.md#shared-implementation-fan-out), [scoring-and-review.md](../features/scoring-and-review.md#shared-implementation-fan-out), [call-graph-analysis.md](../features/call-graph-analysis.md#enhanced-traversal), [architecture.md](../architecture.md#stage-1--projectanalysis), and [researchers/getting-started.md](../../researchers/getting-started.md#permission-analysis) all updated.

Follow-up fix (transitive mitigations through deps + upgrades):

7. ✅ `projectAnalysis.ts::buildTransitiveMitigationsLookup` and `collectDownstreamScopedMitigations` now follow `'dependency'` edges in addition to `'callgraph'`, and seed BFS from every source function on the contract when the start function is an upgrade. Without this, a global `impactCap` on a manual-dep target (oracle) never propagated back to the permissioned function that declared the dep, and upgrade admins never accumulated transitive mits. This closed a real gap that was previously worked around by duplicating 93 scoped mitigations directly onto AToken upgrade/transfer functions in spark's `functions.json`; those 93 direct entries were removed after the fix (transitive propagation re-derives them via the 3 remaining global mits on LRTOracle/RSETHExchangeRateOracle view functions). Permissions doc updated. CLAUDE.md updated with a "Transitive Mitigations Propagation" section.

Still pending (minor cleanups, not blocking):

- Remove the `@deprecated buildImplementationToProxyMap` once all name-propagation call sites migrate to a dedicated representative-picker helper.
- Unify the `_proxyToImplsMap` (projectData-shape, string[] values) with the `_proxyToImplsSharedMap` (discovered-shape, Set values) in `ProjectAnalysis` — both exist because they come from different data sources; they could share one builder.
- Consider removing `enrichFundsWithImplementations` entirely now that every funds lookup keys by proxy, or rework it to sum proxy balances when a query-by-impl falls through (the only caller that might need it).
- **Cross-request caching of `ProjectAnalysis`.** Every HTTP request to `/admins` / `/dependencies` constructs a fresh `ProjectAnalysis`, rebuilding the enhanced graph, mitigations lookup, and transitive-mitigations lookup from scratch. Adding a per-`(project, file-mtimes)` cache would amortize the cost across requests. Current post-fix timings: spark full `/admins` ~7.6s, filtered ~1.9s; most other projects sub-second. Cheap fast-path now in place: `buildTransitiveMitigationsLookup` and `collectDownstreamScopedMitigations` exit immediately when `mitigationsLookup.size === 0` (covers projects with no direct mits).
- **Pre-existing callgraph noise.** The 3 remaining global (no `scopedTo`) `bounded-by-spark-rsETH-pool` mitigations on LRTOracle/RSETHExchangeRateOracle view functions propagate to unrelated dep queries on spark ATokens via Slither-optimistic `Pool.finalizeTransfer → LRTOracle.getAssetPrice` edges. This is a data-quality issue (those mits should arguably be scoped to the LRTOracle dependency), not a code bug. The transitive-mitigation fix surfaces the noise but does not introduce it — the callgraph path existed before.

---

## 9. Verification results (post-implementation)

Implemented across `addressUtils.ts`, `projectAnalysis.ts`, `capitalAnalysis.ts`, `enhancedTraversal.ts`, `functionAnalysis.ts`, `v2Scoring.ts`. Took before/after snapshots of `/admins` and `/dependencies` for all 12 DeFiDisco projects.

### Byte-identical output (no change)
`aerodrome`, `Frankencoin`, `Steakhouse-USDC`, `liquity-v1`, `liquity-v2`, `uniswap-v2`, `uniswap-v3` — all admins + dependencies byte-identical. These have no metadata on shared impls, so the fix had nothing to change. ✅

### Intended corrections on affected projects

**Spark (AToken impl + SPK impl)** — primary motivation:
- Pool admin's AToken functions: 6 rows → 108 rows (18 proxies × 6 functions = 108)
- Per-function `directFundsUsd` replaced bogus $154M (impl's misrouted USDT) with correct per-proxy balances ($88M spDAI, $1.9B spwstETH, etc.)
- Project-wide `totalCapitalAtRisk` stable at $3.35B (dedup works — no double-counting)
- Admin aggregate `directContractsTotalFunds` on Pool went from $0 to $3.35B
- Sky Governance chain (SubProxy admin) capital attribution went from $154M to $3.35B — correctly reflects that Sky controls all 18 AToken deposits via the PoolConfigurator upgrade path

**EtherFi-Stake (DummyTokenUpgradeable shared impl)**:
- Admin rows: 491 → 500 (+9 from 3 funcs × 3 extra proxies)
- Admin totalCapitalAtRisk: $932M → $6.67B (+$5.74B from weETH now correctly reachable)
- weETH reachable rows: 0 → 169 — before the fix, the main product token was unreachable from any admin in the graph. The fan-out exposes that many admins (Timelock, GnosisSafe, etc.) legitimately control paths that reach weETH via the AToken-like DummyToken permission chain.

**lido, compound-v3, morpho** — unique-impl cosmetic cleanups:
- Admin function rows previously keyed at impl addresses (e.g. `cWETHv3 impl 0xcFC1fA6b…`) now key at proxy addresses (`0x316f9708…`), with no capital-total delta
- Proxy-address is the canonical identity of a contract; this is a correctness improvement for how the UI and compiled review render function rows

### No regressions found
- Oracle path dependencies (previously verified 18/18 AToken proxies resolve correctly) still resolve correctly post-fix
- Project-wide capital totals stable on Spark (dedup preserved)
- No function entries lost, no admin relationships lost
- l2b and protocolbeat TypeScript builds clean
