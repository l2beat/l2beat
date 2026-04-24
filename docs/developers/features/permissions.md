# Permissions

## AI-Based Permission Detection

Permissioned function detection is AI-assisted. The **AI Permissions** button in the Values panel sends the contract's source code to either OpenAI or Anthropic (whichever `.env` key is set) with a prompt asking for permissioned functions and their owner paths. Results are validated against the contract's ABI to filter hallucinations and stored in `permission-overrides.json`.

- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/aiPermissionDetection.ts`
- **UI**: "AI Permissions" button in `ValuesPanel.tsx` (disabled once permissions already exist for the contract)
- **Endpoint**: `POST /api/projects/:project/ai-detect-permissions/:address`
- **Config**: Providers and keys come from `.env` (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)

## Interactive Permission Management

The Values panel extensions let researchers review, correct, and score each detected function:

- **Attributes per function**: `checked`, `userClassification`, `score` (`'unscored' | 'critical' | 'no-impact'`), `description`, `ownerDefinitions`, `delay`
- **Expandable function list** with code navigation and owner tracking
- **Delay field**: references a numeric field on any discovered contract (not a literal value). The backend resolves the value at runtime from `discovered.json` and the UI renders it as a color-coded clock icon: green ≥ 7d, yellow ≥ 1d, red < 1d, gray when unset
- **Optimistic updates** and debounced inputs

## Permission Report Generation

A button in the terminal panel generates a Markdown table of all permissioned functions by streaming the output over Server-Sent Events. Addresses are resolved to contract names and owner definitions are expanded.

## AccessControl Support

OpenZeppelin's `AccessControl` is supported through the `accessControl` handler:

```jsonc
"fields": {
  "accessControl": {
    "handler": { "type": "accessControl" }
  }
}
```

The handler automatically detects roles from `RoleGranted` / `RoleRevoked` events. Roles are stored under `values.accessControl` with `adminRole` and `members[]` fields, and can be referenced in owner paths:

- `$self.accessControl.DEFAULT_ADMIN_ROLE.members` — members only
- `$self.accessControl.DEFAULT_ADMIN_ROLE` — entire role object (admin + members)
- `@kernel.accessControl.PAUSER_ROLE.members` — role in another contract

## Continuous Permission Monitoring

Permission changes are detected automatically during monitor cycles. When the discovery diff is non-empty, the `PermissionResolver` re-resolves every owner path and compares the previous and current address sets. Added and removed owners are reported to the internal Discord channel.

- **Location**: `packages/backend/src/modules/permission-monitor/defidisco/`
- **Trigger**: `diff.length > 0` in the monitor cycle
- **Persistence**: Append-only history in the `PermissionResolution` table; change metadata is stored in `UpdateDiff.details`
- **Scope**: Only resolved owner addresses are watched — manual edits (scores, descriptions, checked status) are not monitored
- **Errors**: Resolution errors are logged and reported at the end of the Discord message; they never abort the cycle

## Unresolved Permissions Diagnostic

The DeFiScan panel surfaces an **Unresolved Permissions** section listing every permissioned function with no owner definitions (or where all owner paths fail to resolve). Clicking a row selects the contract and auto-expands the function in the Values panel.

## Permission Overrides Data Structure

`permission-overrides.json` uses a contract-grouped format optimized for O(1) contract lookups:

```json
{
  "version": "1.0",
  "lastModified": "2025-09-30T15:21:54.826Z",
  "contracts": {
    "eth:0x123...": {
      "functions": [
        {
          "functionName": "pause",
          "userClassification": "permissioned",
          "checked": true,
          "score": "critical",
          "description": "Emergency pause function",
          "ownerDefinitions": [{ "path": "$self.$admin" }],
          "delay": { "contractAddress": "eth:0x456...", "fieldName": "delay" },
          "aiClassification": "permissioned",
          "timestamp": "2025-09-30T15:21:54.826Z"
        }
      ]
    }
  }
}
```

### Owner Definitions

Owner definitions use a unified path expression that navigates any data structure:

**Format:** `<contractRef>.<valuePath>`

- `contractRef`: `$self` (current contract), `@fieldName` (follow an address field to another contract), or `eth:0xAddress` (absolute)
- `valuePath`: JSONPath-like navigation — object keys (`field.subfield`), array indices (`field[0]`), and dynamic keys (`field[eth:0x123]` or `field[ROLE_HASH]`)

**Examples:**

- `{ "path": "$self.owner" }` — owner field on the current contract
- `{ "path": "$self.getOwner" }` — result of calling `getOwner()` on the current contract
- `{ "path": "@governor.signers[0]" }` — follow `governor` field, take first signer
- `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }` — AccessControl role members
- `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE" }` — full role object (admin + members)
- `{ "path": "@kernel.accessControl.PAUSER_ROLE.members" }` — role on another contract
- `{ "path": "eth:0x123...acl.permissions[eth:0x456][ROLE].entities" }` — complex ACL navigation
- `{ "path": "$self" }` — the contract itself is the owner

When a path resolves to an object with properties, the entire object is preserved and rendered in the UI — this lets the UI distinguish role admins from members. Arrays are flattened to avoid redundancy. Multiple owner definitions are supported; functions use `ownerDefinitions !== undefined` (not `??`) so explicit clearing works.

### Shared-implementation fan-out

When a single implementation is used by multiple proxies (factory-deployed token patterns — Aave ATokens are the canonical example, with one impl shared by 18 proxies), function metadata stored at the impl address is treated as a **template**. At analysis time (`getAdmins`, `getDependencies`, permission-edge construction in `buildEnhancedGraph`, mitigation/impactCap lookups) the pipeline emits one virtual row per proxy using the impl — each row binds `$self` to its specific proxy and resolves paths against that proxy's data in `discovered.json`.

Concrete consequences:

- **Write once, applied to all proxies**: store admin entries (e.g. `burn`, `mint`) on the impl with `ownerDefinitions: [{path: "$self.POOL"}]`. The Pool admin relationship is emitted for every proxy automatically.
- **`$self.X` paths rebind per proxy**: paths like `$self.accessControl.MINTER_ROLE.members` or `$self.$admin` resolve to each proxy's own values — different proxies can have different role holders, and the fan-out surfaces this correctly.
- **`@fieldName` paths also rebind per proxy**: `@getFundsAdmin.owner` reads `getFundsAdmin` from the current proxy, which may differ per instance.
- **Funds are per-proxy**: `directFundsUsd` on each fanned-out row reads the specific proxy's own balance (not the impl's, which is often unrelated stranded tokens).

For **per-proxy differentiated metadata** (e.g. each AToken depends on a different oracle), store entries at the proxy address directly — each proxy has its own entry. Path-form dependencies work here too: `dependencies: [{path: "eth:0xOracle.assetSources[$self.UNDERLYING_ASSET_ADDRESS]"}]` stored on each AToken proxy resolves to the correct per-asset oracle without touching storage when oracle configuration changes on-chain.

### Manual dependency transitive reachability

A `dependencies` entry is not a terminal leaf — it seeds BFS through the dep target so transitive reachables surface automatically.

Two layers work together:

1. **User-facing layer** (`computeDependencies` in [functionAnalysis.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/functionAnalysis.ts)): after the primary call-graph traversal, `augmentTraversalWithManualDepSeeds` runs an additional BFS from every resolved dep target, seeded at each `callerFunction` that target exposes. Reachable externals from that sub-traversal merge into the primary traversal and surface in `/dependencies` as auto-detected entries with the expected view/non-view classification.

2. **Capital-analysis layer** (`buildEnhancedGraph` in [enhancedTraversal.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/enhancedTraversal.ts)): each manual dep emits `edgeType: 'dependency'` edges `(target, func) → (depAddr, callerFn)` per caller function on the dep target. `CapitalAnalysisCalculator.traverseForward` filters dep edges by `sourceFunction` (like callgraph) and propagates view-only status. Dep edges are excluded from backward ownership-chain traversal — a dep is "function depends on X," not "X owns function."

Result: adding a manual dep on an oracle wrapper like `EZETHExchangeRateOracle` transparently surfaces Chronicle_Aggor_ETH_USD / RestakeManager / Renzo Restaked ETH Token as transitive reachables on every AToken that depends on that wrapper, without the researcher enumerating them. Per-function capital analysis walks the same dep edge to count funds held by anything downstream of the dep target.

Leaf dep targets that Slither couldn't analyse (e.g. raw Chainlink aggregators with no external-call graph) contribute nothing to transitive reachables. They still appear as manual-dep leaves in the `/dependencies` response.

Implementation in [addressUtils.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/addressUtils.ts) (`buildImplToProxiesMap`, `buildProxyToImplsMap`), fan-out in [projectAnalysis.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/projectAnalysis.ts) (`getAdmins`, `buildMitigationsLookup`, `buildResolvedImpactCaps`), [enhancedTraversal.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/enhancedTraversal.ts) (`buildEnhancedGraph` permission edges), [capitalAnalysis.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/capitalAnalysis.ts) (`findFunctionMeta` shared-impl fallback), [functionAnalysis.ts](../../../packages/l2b/src/implementations/discovery-ui/defidisco/functionAnalysis.ts) (`buildFunctionsMetadataLookup`). Full design + verification in [docs/developers/designs/shared-impl-fan-out.md](../designs/shared-impl-fan-out.md).

### Score (3-state)

- `unscored` — not yet reviewed (default)
- `critical` — researcher-confirmed fund impact
- `no-impact` — researcher-confirmed the function cannot affect funds. Direct funds and reachable-contract funds are zeroed in capital analysis; the function is excluded from capital-at-risk totals

The UI toggles through the three states in the Values panel.

### Delay

Stores a reference to a numeric field (not the value itself): `{ contractAddress, fieldName }`. The backend resolves the value at runtime from `discovered.json` so delays stay in sync with on-chain reality. Use `delay !== undefined` to distinguish "cleared" from "missing".

### Mitigations

Each function can carry a `mitigations[]` array describing on-chain constraints that reduce its impact:

- `type`: `'delay'`, `'valueRange'` (MIN/MAX bounds), `'relativeValue'` (% change cap), or `'other'`
- `description`: human-readable explanation
- `label`: optional short label (1–2 words) for `'other'` mitigations — shown in badges instead of the truncated description
- `valueRange.min/max` and `relativeValue.maxChangePercent` are `MitigationValue` unions: `{ mode: 'hardcoded', value }` or `{ mode: 'fieldRef', fieldPath }`, using the same path syntax as owner definitions
- `mitigatedField`: optional `{ contractAddress, fieldName }` — links the mitigation to a specific field so the monitoring service can auto-escalate its severity in `config.jsonc`
- `scopedTo`: optional `{ address, type: 'admin' | 'dependency' }` — limits the mitigation to a specific caller. Absent = global

**Resolution (`projectAnalysis.ts`, `getMitigationsForOwner`)** runs in two stages:

1. **Direct mitigations** — taken from `functions.json` and filtered per owner (globals pass through, scoped ones must match the owner address)
2. **Transitive mitigations** — collected via forward BFS through the enhanced graph; for every downstream function reachable from the starting function, global mitigations and scoped mitigations whose `scopedTo.address` matches a contract on the call path are included

Example: `XCHF → StablecoinBridge.mint() → Frankencoin.mint()` where `Frankencoin.mint` carries a mitigation scoped to `StablecoinBridge`. When viewing `StablecoinBridge.mint` from XCHF's perspective, the minting limit propagates transitively because StablecoinBridge is on the call path.

**BFS seeding — what it walks through.** `collectDownstreamScopedMitigations` follows **both** `'callgraph'` and `'dependency'` edges (mirroring `capitalAnalysis.traverseForward`). Dep-edge traversal is required so a global cap on a manual-dep target (e.g. an oracle reachable via a `dependencies` path expression) propagates back to the permissioned function that names it. Permission edges are NOT followed — a dep is not ownership.

**Upgrade-function seeding.** Upgrade functions (`upgradeTo`, `upgradeToAndCall`, `upgradeBeacon`, ...) are delegatecall stubs with no outgoing edges of their own, so without explicit seeding their transitive-mit BFS would never run. Two complementary mechanisms handle this:

1. `buildTransitiveMitigationsLookup` explicitly iterates `functions.json.contracts` for `isUpgradeFunction(name)` entries and adds them to the seed set, regardless of whether the forward index contains them as edge sources.
2. When `collectDownstreamScopedMitigations` is called with an upgrade start function, BFS is seeded with **every** non-permission `sourceFunction` that appears in the contract's forward edges — same pattern as `traverseWithPaths` and `capitalAnalysis.traverseForward`. This correctly models "upgrade grants arbitrary code execution on the contract": any function's downstream reach becomes accessible to the upgrader.

Without (2), upgrade admins on ATokens never accumulate transitive mits from oracle wrappers, and researchers have to manually copy a scoped mitigation onto every upgrade function — defeating the point of transitive propagation.

**Performance note.** Both `buildTransitiveMitigationsLookup` and `collectDownstreamScopedMitigations` fast-path out when `mitigationsLookup.size === 0`: projects with no direct mitigations skip the BFS work entirely. For projects with mits (spark, Frankencoin), the BFS still runs per `(contract, function)` seed. The transitive lookup is memoized per `ProjectAnalysis` instance — but each HTTP request constructs a fresh instance, so cross-request caching is a future improvement.

`reviewCompiler.ts` consumes the resolved mitigations directly — it does not compute or filter them itself.

### Impact Cap

A mitigation may carry `impactCap` to bound the maximum potentially impacted TVL of a function. **One unified shape:**

```ts
impactCap: {
  value:
    | { mode: 'hardcoded'; amount: number }
    | { mode: 'fieldRef'; contractAddress: string; fieldName: string }
  unit:
    | { kind: 'usd' }
    | { kind: 'scaler'; factor: '1e6'|'1e8'|'1e18'|'bps'|'percent' }
    | { kind: 'token'; tokenAddress: string }  // decimals+price from funds-data.json
  multiplier?: number  // applied to final USD; default 1
}
```

**Formula**: `raw = value.amount (hardcoded) | on-chain field (fieldRef)`; then `usd = { usd: raw, scaler: raw/factor, token: tokenAmount × price }`; finally `final = usd × (multiplier ?? 1)`. In `unit.kind === 'token'`, hardcoded amounts are interpreted as whole tokens (researcher-friendly) while fieldRef amounts are raw on-chain units (divided by `10^decimals`).

**Examples:**

- Hardcoded $5M cap: `{ value: { mode: 'hardcoded', amount: 5_000_000 }, unit: { kind: 'usd' } }`
- 1M ZCHF hardcoded cap (dynamically priced): `{ value: { mode: 'hardcoded', amount: 1_000_000 }, unit: { kind: 'token', tokenAddress: 'eth:0xB58E...21cB' } }` — resolves to `1e6 × zchf_price`.
- 2% of UNI totalSupply: `{ value: { mode: 'fieldRef', contractAddress: 'eth:0x1f98…F984', fieldName: 'totalSupply' }, unit: { kind: 'token', tokenAddress: 'eth:0x1f98…F984' }, multiplier: 0.02 }` — resolves to `(totalSupply / 1e18) × uni_price × 0.02`.
- USD-native field-ref (price oracle returning 1e8-scaled USD): `{ value: { mode: 'fieldRef', contractAddress, fieldName }, unit: { kind: 'scaler', factor: '1e8' } }`.

**Legacy shapes** (pre-unification: `hardcodedUsd`, `tokenAddress+fieldName+multiplier+fieldContractAddress?`, `contractAddress+fieldName+unit`) are still accepted at read time via `normalizeImpactCap()` in [types.ts](packages/l2b/src/implementations/discovery-ui/defidisco/types.ts). All persisted files (`functions.json`) were migrated to the unified shape.

`resolveImpactCap()` in [projectAnalysis.ts](packages/l2b/src/implementations/discovery-ui/defidisco/projectAnalysis.ts) emits a resolved `impactCapUsd: number` on the mitigation during `getMitigationsForOwner()`. Capital analysis applies per-contract caps (`effectiveCapUsd` on `ReachableContract`) so fund sums never exceed the cap. In the public frontend, capped mitigations display an emerald "$XM Max Impact" badge.
