---
name: add-mitigation
description: Analyze a function's source code to find on-chain mitigations (value bounds, delays, rate limits) and add them to functions.json. Reads the flattened Solidity source, identifies require/if constraints, and builds structured mitigation entries.
---

# Add Mitigation

Analyze a permissioned function's source code to find on-chain mitigations and add them to `functions.json`.

## Arguments

```
/add-mitigation <project> <contractAddress> <functionName>
```

- **project** — project folder name (e.g. `aerodrome`, `aave-v3`)
- **contractAddress** — chain-prefixed contract address (e.g. `base:0xB630...`). Add prefix if omitted.
- **functionName** — the function to analyze (e.g. `setDefaultCap`)

## Instructions

### Phase 1: Locate source code

Find the flattened source in `packages/config/src/projects/<project>/.flat/`. Match by address in the filename. If not found, check `packages/config/crytic-export/etherscan-contracts/` by address.

### Phase 2: Analyze the function

Read the function body and identify **on-chain constraints** that limit what the caller can do:

1. **Value range** (`type: "valueRange"`) — `require(value <= MAX)`, `require(value >= MIN)`, or `require(value != 0)`
2. **Delay** (`type: "delay"`) — timelocks, cooldown periods, `block.timestamp >= lastAction + DELAY`
3. **Relative value** (`type: "relativeValue"`) — max change per call, e.g. `newRate = oldRate + NUDGE`
4. **Other** (`type: "other"`) — any other constraint (rate limiting, once-per-epoch, formula-driven amounts)

For each constraint found, determine:
- The **bound values** (constants, storage variables, or computed)
- Whether the bound is **hardcoded** (literal in code), **discovered** (a contract field we track in `discovered.json`), or a **fieldRef** (a path expression like `$self.MAX_FEE`)

### Phase 3: Present findings

Show the user what you found:

```
Found mitigations for setDefaultCap on CLGaugeFactory:

1. [valueRange] _defaultCap must be >= 1 (hardcoded) and <= MAX_BPS (discovered: 10000)
   Source: require(_defaultCap != 0, "ZDC"); require(_defaultCap <= MAX_BPS, "MC");

2. [other] Only callable by emissionAdmin
   Source: require(msg.sender == emissionAdmin, "NA");
```

Ask the user to confirm or adjust before applying. The user may want to:
- Skip some mitigations (e.g. access control is already captured by `ownerDefinitions`)
- Adjust descriptions
- Change value modes (e.g. use `discovered` instead of `hardcoded`)

### Phase 4: Apply

Add mitigations to the function entry in `packages/config/src/projects/<project>/functions.json`.

#### Mitigation format

Each mitigation is an object in the `mitigations` array:

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

Use the most specific mode available:

- **`"hardcoded"`** — literal value in code that cannot change. Use `"value": "123"`.
  ```json
  { "mode": "hardcoded", "value": "500000" }
  ```

- **`"discovered"`** — a field tracked in `discovered.json` whose current value we can read. Use when the bound is a contract storage variable (constant or mutable) that discovery fetches. Provides live tracking.
  ```json
  { "mode": "discovered", "contractAddress": "base:0x...", "fieldName": "MAX_BPS" }
  ```

- **`"fieldRef"`** — a path expression referencing the field on the same or another contract, using the owner path syntax (`$self.FIELD`, `@ref.FIELD`).
  ```json
  { "mode": "fieldRef", "fieldPath": "$self.MAXIMUM_TEAM_RATE" }
  ```

**Choosing between modes:**
- If the value is a Solidity `constant` or `immutable` that appears in `discovered.json` → use `"discovered"`
- If the value is a storage variable on the same contract → use `"fieldRef"` with `$self.FIELD`
- If the value is a literal number in the code not stored in any field → use `"hardcoded"`
- When in doubt, prefer `"discovered"` over `"hardcoded"` since it tracks on-chain changes

#### Mitigation types

**`valueRange`** — for require statements bounding a parameter:
```json
{
  "type": "valueRange",
  "description": "Fee cannot exceed MAX_FEE",
  "valueRange": {
    "min": { "mode": "hardcoded", "value": "0" },
    "max": { "mode": "discovered", "contractAddress": "base:0x...", "fieldName": "MAX_FEE" },
    "unit": "bps"
  },
  "mitigatedField": { "contractAddress": "base:0x...", "fieldName": "MAX_FEE" }
}
```

**`delay`** — for timelock or cooldown constraints:
```json
{
  "type": "delay",
  "description": "48-hour timelock before execution",
  "delaySeconds": 172800,
  "delayRef": { "contractAddress": "base:0x...", "fieldName": "delay" }
}
```

**`relativeValue`** — for max-change-per-call constraints:
```json
{
  "type": "relativeValue",
  "description": "Can only change by 1 bps per epoch",
  "relativeValue": {
    "maxChangePercent": { "mode": "discovered", "contractAddress": "base:0x...", "fieldName": "NUDGE" }
  }
}
```

**`other`** — for constraints that don't fit the above:
```json
{
  "type": "other",
  "description": "Rate limited: once per week",
  "mitigatedField": { "contractAddress": "base:0x...", "fieldName": "WEEK" }
}
```

#### `mitigatedField` (optional)

Points to the contract field that enforces the constraint. Used for display and monitoring. Include when the constraint references a specific on-chain value.

#### Applying to functions.json

- Find the function entry by `contractAddress` and `functionName`
- If the function already has a `mitigations` array, append new entries (don't duplicate)
- If no `mitigations` array exists, create one
- Do NOT modify other fields on the function entry (score, ownerDefinitions, etc.)
- Do NOT add access control as a mitigation — that's already captured by `isPermissioned` and `ownerDefinitions`

### Phase 5: Report

```
Added 2 mitigations to setDefaultCap on CLGaugeFactory (base:0xB630...):
  + [valueRange] Default cap bounded 1 to MAX_BPS (10000 bps)
  + [other] Cannot set to zero
```
