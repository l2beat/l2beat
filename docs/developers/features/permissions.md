# Permissions System

## AI-Based Permission Detection

**Manual Detection System**: AI-powered permission analysis with UI button

- **File**: `/defidisco/aiPermissionDetection.ts` - OpenAI (GPT-4) and Claude (Sonnet 3.5) support
- **UI**: "AI Permissions" button in `ValuesPanel.tsx` (once per contract, disabled if permissions exist)
- **Config**: `.env` file with `AI_PROVIDER` (openai/claude) and `AI_API_KEY`
- **Endpoint**: `POST /api/projects/:project/ai-detect-permissions/:address`
- **Features**:
  - Analyzes contract source code to identify permissioned functions
  - Maps functions to correct addresses (proxy vs implementation via .p.sol naming)
  - Validates against ABI to filter hallucinated functions
  - Saves to `permission-overrides.json` with `aiClassification` field (not currently used in UI)
- **Prompt Engineering**: Instructs AI to identify owners with `sourceField` (e.g., "owner", "accessControl") and `dataPath` (e.g., "$self", "DEFAULT_ADMIN_ROLE")

## Interactive Permission Management

**UI System**: Complete permission management in `/defidisco/ValuesPanelExtensions.tsx`

- **Data Structure**: Contract-grouped permissions for O(1) lookups (`contracts[address].functions[]`)
- **Data Separation**: Discovered permissions vs user overrides (persistent)
- **Four Attributes**: Checked, Permission, Risk Score, Delay
- **Features**: Expandable functions, code navigation, owner tracking, delay field specification
- **Performance**: File caching, optimistic updates, debounced inputs, efficient contract-specific queries

**Delay Field Feature**: Associate delays with permissioned functions

- **UI**: Select contract + numeric field to specify delay reference
- **Backend**: Resolves delay value from discovered.json in real-time
- **Display**: Clock icon (`IconClock.tsx`) always visible in collapsed view, color-coded: green (>= 7d), yellow (>= 1d), red (< 1d), gray (no delay). Uses `formatDelay()` from `scoringShared.tsx` for human-readable units (e.g., `7d`, `2h`, `45s`)
- **Storage**: Delay reference stored in `permission-overrides.json` as `{ contractAddress, fieldName }`

## Permissions Report Generation

**Terminal Integration**: Button in `/defidisco/TerminalExtensions.tsx`

- Generates markdown table from contract-grouped `permission-overrides.json`
- Maps addresses to contract names, resolves owner definitions
- Server-Sent Events API for real-time output
- Efficiently processes contract-grouped data structure

## AccessControl Role Support

**OpenZeppelin AccessControl Integration**: Full support for role-based access control

- **Handler**: Use `accessControl` handler in templates or config overrides
  ```jsonc
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
  ```
- **Discovery**: Automatically detects roles from `RoleGranted`/`RoleRevoked` events
- **Data Structure**: Roles stored in `values.accessControl` with `adminRole` and `members[]`
- **Owner Tracking with Path Expressions**:
  - `$self.accessControl.ROLE_NAME.members` - Only the members array
  - `$self.accessControl.ROLE_NAME` - All addresses in the role (members + any address in adminRole field if it's an address)
  - `@fieldName.accessControl.ROLE_NAME.members` - Members in another contract
  - Example: `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }`
- **Cross-Contract**: Can reference AccessControl roles in external contracts via address fields
- **Resolution**: Works like any other path - navigates the data structure and recursively extracts all addresses
- **Display**: Shows all resolved addresses with click-to-select functionality

## Continuous Permission Monitoring

**Automated Change Detection**: Monitors permission changes alongside discovery updates

- **Location**: `packages/backend/src/modules/permission-monitor/defidisco/`
- **Trigger**: Automatically runs when discovery detects changes (`diff.length > 0`)
- **Components**:
  - **PermissionResolver**: Resolves owner paths and detects changes
  - **PermissionResolutionRepository**: Stores append-only resolution history
  - **UpdateNotifier.notifyPermissionChanges()**: Formats Discord alerts
- **Database Schema**:
  - `PermissionResolution` table: Stores resolution blobs with timestamp
  - `UpdateDiff.details` field: Stores permission change metadata (JSONB)
  - Migration: `20251202000000_add_permission_monitoring`
- **Change Detection**:
  - ✅ Detects added/removed owner addresses (resolved from paths)
  - ❌ Ignores config changes (manually marked as permissioned)
  - ❌ Ignores manual updates (scores, descriptions, checked status)
- **Discord Notifications**:
  - Sent to INTERNAL channel only
  - Shows added/removed owners with contract names
  - Groups resolution errors at end of message
  - Format: 🔒 **Permission Changes Detected: project-name**
- **Error Handling**: Resolution errors logged but don't stop processing
- **Performance**: Only re-resolves when discovery changes detected
- **Documentation**: See `packages/backend/src/modules/permission-monitor/defidisco/README.md`

## Permission Overrides Data Structure

**Contract-Grouped Format**: Optimized for O(1) contract lookups and efficient data access

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
          "ownerDefinitions": [
            {
              "path": "$self.$admin"
            }
          ],
          "delay": {
            "contractAddress": "eth:0x456...",
            "fieldName": "delay"
          },
          "aiClassification": "permissioned",
          "timestamp": "2025-09-30T15:21:54.826Z"
        }
      ]
    }
  }
}
```

### Owner Definitions

- **Unified Path Expression**: Single path string that navigates any data structure
- **Path Format**: `<contractRef>.<valuePath>`
  - `<contractRef>`: `$self` (current contract), `@fieldName` (follow address field), or `eth:0xAddress` (absolute)
  - `<valuePath>`: JSONPath-like navigation in contract.values
- **Path Syntax**:
  - Object keys: `field.subfield`
  - Array indices: `field[0]`
  - Dynamic keys: `field[eth:0x123]` or `field[ROLE_HASH]`
- **Examples**:
  - `{ "path": "$self.owner" }` - owner field in current contract
  - `{ "path": "$self.getOwner" }` - call getOwner() in current contract
  - `{ "path": "@governor.signers[0]" }` - follow governor field, get first signer
  - `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }` - AccessControl role members only
  - `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE" }` - Entire role object structure preserved (shows admin + members)
  - `{ "path": "@kernel.accessControl.PAUSER_ROLE.members" }` - Role in external contract
  - `{ "path": "eth:0x123...acl.permissions[eth:0x456][ROLE].entities" }` - Complex ACL structure
  - `{ "path": "$self" }` - current contract itself is the owner
- **Structured Value Preservation**: When a path resolves to an object with properties (not just a simple address or array), the entire JSON object structure is preserved and displayed in the UI. This maintains important contextual information like distinguishing between role admins and members. Arrays are not considered structured values to avoid redundancy.
- Multiple owner definitions supported via array
- Use `ownerDefinitions !== undefined` pattern (not `??`) to handle explicit clearing
- **Resolution**: Both frontend (`FunctionFolder.tsx`) and backend (`generatePermissionsReport.ts`) use same logic
  - Parses contract reference and value path separately
  - Navigates any structure with recursive descent
  - **Preserves JSON object structure**: If path resolves to an object (like a role with `{ adminRole, members }`), the entire object structure is preserved
  - **Extracts addresses for listing**: While preserving the structure, also extracts all addresses recursively for address-based operations
  - **Display**: UI shows the full JSON structure when present, plus clickable links to all contained addresses
  - Works with any handler's data format (ACL, AccessControl, custom handlers)
  - Shows contract names with click-to-select functionality

### Delay Field

- Stores reference to numeric field (not the value itself)
- Backend resolves value at runtime from discovered.json
- Use `delay !== undefined` pattern (not `??`) to handle explicit clearing

### Access Patterns

- **Direct Contract Access**: `permissionOverrides.contracts[contractAddress]` - O(1) lookup
- **Function Lookup**: `contracts[address].functions.find(f => f.functionName === name)` - O(n) only within contract
- **Global Operations**: `Object.values(contracts).flatMap(c => c.functions)` when needed
- **UI Components**: Use `getOverridesForContract(address)` helper for contract-specific data

### Important Notes

- **Permission Owner System**: Uses generalized path expressions that work with **any** handler's data structure (ACL, AccessControl, custom handlers, future handlers). No special cases or hardcoded logic needed.
- **Migration**: All existing permission-overrides.json files have been migrated to the new unified path format (one-off migration, October 2025).
- **Score / Impact (3-state)**:
  - In `functions.json`, the field is called `score` with values: `'unscored' | 'critical' | 'no-impact'`
  - `'unscored'` = not yet reviewed (default), `'critical'` = confirmed impact, `'no-impact'` = researcher confirmed no fund impact
  - **TypeScript types** use `Impact = 'critical'` (single-value type for scored functions)
  - When `'no-impact'`: direct funds and reachable contract funds are zeroed in `functionAnalysis.ts` and `capitalAnalysis.ts`; function is excluded from capital-at-risk totals in `v2Scoring.ts`
  - UI: toggled via 3-state cycle (gray/unscored -> red/critical -> green+slashed/no-impact) in the Values panel
- **Mitigations**: Each function can have `mitigations[]` in `functions.json`. Each mitigation has:
  - `type`: `'valueRange'` (MIN/MAX), `'relativeValue'` (% change), or `'other'`
  - `description`: Human-readable explanation of the constraint
  - `valueRange.min/max` and `relativeValue.maxChangePercent`: Use `MitigationValue` type — either `{ mode: 'hardcoded', value: string }` or `{ mode: 'fieldRef', fieldPath: string }` (same path syntax as owner definitions)
  - `mitigatedField`: Optional `{ contractAddress, fieldName }` — links the mitigation to a specific contract field. When set, `configSeverity.ts` auto-writes `severity: "HIGH"` to `config.jsonc` so the monitoring service sends priority Discord alerts on field changes
  - `scopedTo`: Optional `{ address: string, type: 'admin' | 'dependency' }` — scopes the mitigation to a specific admin or dependency. When absent, the mitigation is global (applies to all callers). When present, the mitigation only appears under the matching admin/dependency in scoring breakdowns and compiled reviews. The `delay` field on `FunctionEntry` is always global.
  - **Mitigation resolution** (`projectAnalysis.ts` — single source of truth): `getMitigationsForOwner()` computes mitigations in two stages:
    1. **Direct mitigations**: from `functions.json`, filtered per owner via `filterMitigationsForOwner()` (global mitigations pass through, scoped ones must match the owner address)
    2. **Transitive mitigations**: collected via forward BFS through call graph edges (`collectDownstreamScopedMitigations()`). For each downstream function reachable from the starting function, global mitigations and scoped mitigations whose `scopedTo.address` matches a contract on the call path are collected. Transitive mitigations are NOT re-filtered by the ultimate caller — their scope was already validated during BFS collection.
  - **Example**: `XCHF → StablecoinBridge.mint() → Frankencoin.mint()` where `Frankencoin.mint` has a mitigation scoped to StablecoinBridge. When viewing `StablecoinBridge.mint` from XCHF's perspective, the minting limit propagates transitively because StablecoinBridge is on the call path.
  - **Compiler passthrough**: `reviewCompiler.ts` uses `f.mitigations` directly from `projectAnalysis.getAdmins()`/`getDependencies()` — it does not compute or filter mitigations itself.
  - **Legacy**: `v2Scoring.ts` has its own `buildMergedMitigations()` + `filterMitigationsForOwner()` for the `/v2-score` endpoint but does not include transitive propagation.
  - **UI**: Scope dropdown in `FunctionFolder.tsx` mitigation form — populated from resolved owners (Admins optgroup) and manual dependencies (Dependencies optgroup). Scoped mitigations display a purple badge showing the admin/dependency name.
  - **Backend**: `configSeverity.ts` — `ensureFieldSeverity()` validates field exists in `discovered.json` before writing; `removeFieldSeverityIfAutoOnly()` cleans up when mitigated field is unlinked (only removes severity if no other field config properties exist)
  - **Frontend**: `resolveFieldValue()` in `ownerResolution.ts` resolves field-referenced values at display time
  - **Backward compat**: `normalizeMitigationValue()` converts old plain-string values to `MitigationValue` objects. Mitigations without `scopedTo` are treated as global (backward compatible).
