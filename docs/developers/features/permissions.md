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
2. **Transitive mitigations** — collected via forward BFS through the call graph; for every downstream function reachable from the starting function, global mitigations and scoped mitigations whose `scopedTo.address` matches a contract on the call path are included

Example: `XCHF → StablecoinBridge.mint() → Frankencoin.mint()` where `Frankencoin.mint` carries a mitigation scoped to `StablecoinBridge`. When viewing `StablecoinBridge.mint` from XCHF's perspective, the minting limit propagates transitively because StablecoinBridge is on the call path.

`reviewCompiler.ts` consumes the resolved mitigations directly — it does not compute or filter them itself.

### Impact Cap

A mitigation may carry `impactCap` to bound the maximum potentially impacted TVL of a function. Two modes:

- **Field reference** — `{ contractAddress, fieldName, unit }` where `unit` is one of `'raw' | '1e6' | '1e8' | '1e18' | 'bps' | 'percent'`. The raw field value is scaled to USD using the unit denominator
- **Hardcoded USD** — `{ hardcodedUsd: number }` derived from code analysis

`resolveStructuredImpactCap()` emits a resolved `impactCapUsd: number` on the mitigation during `getMitigationsForOwner()`. Capital analysis applies per-contract caps (`effectiveCapUsd` on `ReachableContract`) so fund sums never exceed the cap. In the public frontend, capped mitigations display an emerald "$XM Max Impact" badge.
