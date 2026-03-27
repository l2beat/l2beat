---
name: prune-watch-fields
description: Classify discovered contract fields and set ignoreInWatchMode in config.jsonc. Identifies frequently-changing non-security-critical fields (supply counters, nonces, prices) and separates them from fields that must always be monitored (owners, admins, fee rates, permissions).
argument-hint: "<project-name>"
---

# Prune Watch Fields

Analyze all discovered fields on every contract in a project and classify them for watch-mode monitoring. Fields that change frequently but are not security-critical get added to `ignoreInWatchMode` in `config.jsonc`, reducing false-positive alerts during continuous monitoring.

## Arguments

```
/prune-watch-fields <project>
```

- **project** — project folder name (e.g. `compound-v3`, `morpho`, `aerodrome`)

Parse `$ARGUMENTS` to extract the project name as `$0`.

## Prerequisites

The l2b UI server must be running at `http://localhost:2021`. If not, tell the user to start it with `cd packages/config && l2b ui`.

The project must have a `discovered.json` (run discovery first if it doesn't exist).

---

## Step 1: Load Data

### 1a. Read discovered.json

```bash
cat packages/config/src/projects/$0/discovered.json | jq '[.entries[] | select(.type == "Contract") | {address, name, values: (.values // {}), fieldMeta: (.fieldMeta // {}), ignoreInWatchMode: (.ignoreInWatchMode // []), receivedPermissions: (.receivedPermissions // []), directlyReceivedPermissions: (.directlyReceivedPermissions // [])}]' > /tmp/prune-watch-$0-entries.json
```

### 1b. Read existing config.jsonc

```bash
cat packages/config/src/projects/$0/config.jsonc
```

Note which contracts already have `ignoreInWatchMode` in the config — these are "already handled" fields.

### 1c. Load contract tags

```bash
curl -s localhost:2021/api/projects/$0/contract-tags > /tmp/prune-watch-$0-tags.json
```

Use tags for context — e.g., external contracts (oracles, tokens) are especially likely to have volatile fields like `latestRoundData` or `totalSupply` that should be ignored.

---

## Step 2: Classify Fields

For each non-external contract, examine every key in its `values` object. Classify each field into one of three tiers.

### Skip These (do not classify)

- Fields already in the contract's `ignoreInWatchMode` array (from template or config) — list as "ALREADY HANDLED"
- Fields listed in `ignoreMethods` (template or config) — these are excluded from discovery entirely
- Contracts with `ignoreDiscovery: true` in config.jsonc — these don't appear in discovered.json at all
- Contracts whose template already sets `ignoreInWatchMode` AND all remaining fields are either in `ignoreMethods` or are security-critical (`$members`, `$threshold`, `owner`, etc.) — these are **fully handled by template**. Example: GnosisSafe template sets `ignoreInWatchMode: ["nonce"]` and `ignoreMethods: ["getThreshold", "getOwners"]`, leaving nothing to classify. Skip these contracts silently.
- `$immutable` — system boolean, never changes

### Tier 1: NEVER IGNORE (security-critical)

These fields MUST be monitored. If any of these are already in `ignoreInWatchMode`, emit a **WARNING**.

**Exact field names — always NEVER IGNORE:**
- Proxy system: `$admin`, `$implementation`, `$pastUpgrades`, `$upgradeCount`
- Multisig: `$members`, `$threshold`
- Ownership: `owner`, `admin`, `pendingOwner`, `pendingAdmin`, `newOwner`, `proposedOwner`
- Governance: `governor`, `guardian`, `timelock`, `proxyAdmin`
- Voting parameters: `votingDelay`, `votingPeriod`, `proposalThreshold`, `quorumNumerator`, `quorumDenominator`
- Access control: `accessControl`
- Security state: `paused`, `isPaused`

**Pattern rules — NEVER IGNORE if:**
- Value is an address AND field name contains any of: `oracle`, `verifier`, `bridge`, `messenger`, `relayer`, `sequencer`, `batcher`, `proposer`, `challenger`, `operator`, `factory`, `registry`, `controller`, `resolver`
- Field name matches a role pattern: ends with `_ROLE`, or contains `Guardian`, `Admin`, `Manager` (as a suffix — not e.g. `totalManager`)
- Field has entries in `receivedPermissions` or `directlyReceivedPermissions` on the contract
- Field has `permissions` metadata in `fieldMeta`
- Field name contains: `whitelist`, `blacklist`, `authorized`, `allowed`, `approved` (access control lists)

**Fee rate settings — NEVER IGNORE:**
Fee parameters that admins can change are security-critical. These are rate/percentage settings, NOT running totals:
- `fee`, `feeRate`, `performanceFee`, `managementFee`, `protocolFee`, `withdrawalFee`, `entryFee`, `exitFee`, `mintFee`, `redeemFee`, `flashLoanFee`
- Any field matching `*Fee` or `*FeeRate` where the value is a small number (typically < 10000, representing basis points or percentage)

### Tier 2: SAFE TO IGNORE (high confidence)

These fields change frequently but have no security implications.

**Counters and nonces (monotonically increasing):**
- `nonce` (Gnosis Safe transaction count)
- Fields ending with `Count`, `Counter` (e.g., `gameCount`, `proposalCount`, `messageCount`)
- Fields starting with `getNext` (e.g., `getNextProposalId`, `getNextSequenceId`)
- Sequence/index fields: ending with `Nonce`, `Seq`, `Sequence`

**Supply and balance aggregates (change with every deposit/withdrawal):**
- `totalSupply`, `totalAssets`, `lastTotalAssets`, `totalSupplyBase`, `totalBorrowBase`
- `circulatingSupply`, `totalShares`, `totalStaked`, `totalLocked`, `totalMinted`
- Fields starting with `total` when the value is a large number (> 10^12) and numeric
- `getEntireSystemColl`, `getEntireSystemDebt` (Liquity-style)

**Batch and block state (L2/rollup progression):**
- `getTotalBatchesCommitted`, `getTotalBatchesExecuted`, `getTotalBatchesVerified`
- `getTotalBlocksCommitted`, `getTotalBlocksExecuted`, `getTotalBlocksVerified`
- `currentBlock`, `latestBlockNumber`, `lastVerifiedBatch`
- `sequencerMessageCount`, `delayedMessageCount`

**Queue and buffer pointers:**
- Fields containing `Queue` (e.g., `intentQueue`, `fillQueue`, `priorityQueueSize`)
- Fields ending with `QueueSize`, `QueueLength`

**Timestamps reflecting state progression:**
- `lastUpdate`, `lastAccrualTime`, `lastStakeBlock`, `lastFeeOperationTime`
- Fields starting with `last` when value is a Unix timestamp (large number > 10^9)

**Data sizes and lengths:**
- Fields ending with `DataSize`, `Length`, `Size` (getter return values)
- EXCEPTION: `$threshold` or anything containing `limit` or `threshold` — these are NOT safe

**Prices and oracle reads (change every block):**
- `latestRoundData`, `latestAnswer`
- Fields containing `Price` when the value is numeric (NOT when it's an address — that's an oracle reference)
- `currentTick`, `sqrtPriceX96` (AMM price state)

**Game and dispute counters (OP Stack):**
- `permissionedGamesTotal`, `gameCount`

**Reward and index accumulators:**
- Fields ending with `SupplyIndex`, `BorrowIndex`, `Index` when value is a large number
- `rewardPerStake`, `rewardPerToken`, fields containing `AccumulatedPerShare`
- `baseSupplyIndex`, `baseBorrowIndex`, `trackingSupplyIndex`, `trackingBorrowIndex`

**Fee accumulators (running totals, NOT rate settings):**
- `totalFees`, `accumulatedFees`, `claimableFees`, `feeBalance`
- Fields starting with `total` AND containing `Fee` (e.g., `totalFeesClaimed`)

**Other common safe fields:**
- `minted`, `minterReserve`, `equity` (when numeric — protocol accounting)
- State accumulation variables: `F_ETH`, `F_LUSD`, `P`, `S` (Liquity-style)

### Tier 3: UNCERTAIN (needs reviewer input)

Everything that doesn't match Tier 1 or Tier 2. Sub-categorize for the reviewer:

- **Numeric non-accumulator**: Small number value, doesn't match a safe pattern — could be a parameter
- **Address field**: Address value but not matching a never-ignore pattern — could be a replaceable dependency
- **Boolean field**: Could be a pause flag or feature toggle — needs context
- **Complex value**: Struct or array — may contain mixed critical/non-critical sub-fields
- **Ambiguous fee**: Contains "fee" but unclear if rate setting or accumulator

### Cross-Checks (safety net)

After initial classification, apply these corrections:

1. **Address cross-check**: If a field was classified as SAFE but its value is an Ethereum address → reclassify as UNCERTAIN with note: "value is an address — verify it's not a critical reference"
2. **Permission cross-check**: If a field was classified as SAFE but it has entries in `fieldMeta` with `permissions` or `type: "PERMISSION"` → reclassify as NEVER IGNORE
3. **Severity cross-check**: If a field was classified as SAFE but it has `severity: "HIGH"` in `fieldMeta` → reclassify as UNCERTAIN with note: "marked HIGH severity in config"

---

## Step 3: Present Classification

Present the results grouped by contract. Process contracts in a reasonable batch size — if there are many contracts, process up to 10 at a time, then ask the user before continuing.

For each contract:

```
## Contract: <ContractName> (<address>)

ALREADY HANDLED (<N> fields):
  <list field names already in ignoreInWatchMode>

SAFE TO IGNORE — recommend adding (<N> fields):
  1. totalSupply (uint256: 1234567890...) — supply aggregate, changes with deposits
  2. nonce (uint256: 2079) — transaction counter
  3. baseSupplyIndex (uint256: ...) — reward accumulator

MUST WATCH — correctly not ignored (<N> fields):
  - owner (address: eth:0x...) — ownership control
  - pauseGuardian (address: eth:0x...) — security role
  - performanceFee (uint256: 1000) — fee rate setting (admin-changeable)

UNCERTAIN — please review (<N> fields):
  4. extensionDelegate (address: eth:0x...) — address field, unclear role
  5. totalsBasic (struct: {...}) — complex struct, may contain mixed fields
```

**After presenting all contracts**, ask the user:

> How would you like to proceed?
> - `ignore all safe` — apply all SAFE TO IGNORE recommendations
> - `ignore 1,3,7` — apply specific numbered items only
> - `ignore all except 4,5` — apply most, keep some for review
> - `skip` — don't add any ignoreInWatchMode now
> - `skip <ContractName>` — skip a specific contract

**Also show warnings** if any existing `ignoreInWatchMode` entries match Tier 1 (NEVER IGNORE) patterns:
```
WARNING: <ContractName> has "$implementation" in ignoreInWatchMode — this is a proxy
implementation address and is security-critical. Verify this is intentional.
```

---

## Step 4: Apply Changes

Read the current `config.jsonc`:
```bash
cat packages/config/src/projects/$0/config.jsonc
```

For each field the user approved, add it to `ignoreInWatchMode` on the corresponding contract in `config.jsonc`.

### Merge rules

- **Never remove** existing `ignoreInWatchMode` entries
- If the contract already has `ignoreInWatchMode`, append new entries (no duplicates)
- If the contract has an override block but no `ignoreInWatchMode`, add the property
- If the contract has no override block at all, create one with just `ignoreInWatchMode`
- **Sort entries alphabetically** within each `ignoreInWatchMode` array
- **Preserve JSONC comments** — do not strip existing comments
- **Merge with existing overrides** — do not overwrite `ignoreMethods`, `ignoreRelatives`, `fields`, or any other settings

### Example config.jsonc update

Before:
```jsonc
"eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3": {
  "ignoreMethods": ["getReserves"]
}
```

After:
```jsonc
"eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3": {
  "ignoreMethods": ["getReserves"],
  "ignoreInWatchMode": ["baseSupplyIndex", "baseBorrowIndex", "nonce", "totalBorrowBase", "totalSupplyBase"]
}
```

---

## Step 5: Re-run Discovery

After updating config.jsonc, re-run discovery to sync `discovered.json` with the new `ignoreInWatchMode` settings:

```bash
cd packages/config && l2b discover $0 2>&1 | tail -5
```

Verify the discovery completes without errors.

---

## Step 6: Summary

Present a brief summary:

```
## Watch Mode Pruning Summary for $0

- Contracts analyzed: N
- Fields classified: N total
  - Already handled: N
  - Safe to ignore (added): N
  - Must watch: N
  - Uncertain (skipped): N
- Config changes: ignoreInWatchMode updated on N contracts
- Warnings: N (list any NEVER IGNORE fields found in existing ignoreInWatchMode)
```

---

## Guidelines

- **When in doubt, don't ignore**: A field showing up in monitoring is a minor annoyance. Missing a security-critical change is a disaster. Classify uncertain fields as UNCERTAIN and let the reviewer decide.
- **Fee distinction matters**: Fee rate settings (admin-changeable parameters like `performanceFee: 1000`) are NEVER ignored. Fee accumulators (running totals like `totalFees: 123456789`) are safe. When ambiguous, classify as UNCERTAIN.
- **Address values get extra scrutiny**: Even if a field name looks benign, if its value is an address, it could be a reference to a critical contract. The cross-check in Step 2 catches this.
- **Preserve existing config**: When editing config.jsonc, merge with existing overrides. Never delete existing settings.
- **Use chain-prefixed addresses**: All addresses in config.jsonc use `eth:0x...` format (or `arb1:0x...`, `base:0x...`, etc.).
- **JSONC format**: config.jsonc supports comments. Preserve them when editing.