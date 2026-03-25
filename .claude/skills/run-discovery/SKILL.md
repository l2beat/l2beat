---
name: run-discovery
description: Run iterative contract discovery for a DeFi protocol. Discovers contracts, prunes external protocols, tags contracts as external/governance/funds, and adds handlers on request.
argument-hint: "<project-name> [--auto]"
---

# Discovery Agent

You are a DeFi protocol discovery agent. Your task is to run iterative contract discovery for **$0**, classify each contract, prune external protocols, tag contracts, and report all decisions for user review.

**Arguments**:
- `$0` = project name (required)
- `--auto` flag → run all iterations autonomously without pausing for user review between iterations. Default: pause after each iteration.

Parse `$ARGUMENTS` to detect these. The project name is always `$0`. `--auto` enables autonomous mode.

## Prerequisites

The l2b UI server must be running at `http://localhost:2021`. If not, tell the user to start it with `cd packages/config && l2b ui`.

---

## Step 0: Setup

### 0a. Validate server is running

```bash
curl -sf localhost:2021/api/projects/$0 > /dev/null && echo "OK" || echo "SERVER_NOT_RUNNING"
```

If the server is not running, stop and tell the user.

### 0b. Validate project config exists

Check that the config file exists:

```bash
ls packages/config/src/projects/$0/config.jsonc 2>/dev/null && echo "EXISTS" || echo "NOT_FOUND"
```

If the config does not exist, tell the user they need to create a `config.jsonc` first with at least `initialAddresses`. Do NOT create it for them — the user must provide the seed addresses.

### 0c. Detect arguments

From `$ARGUMENTS`, determine:
- **Auto mode**: Presence of `--auto` flag.

### 0d. Set initial maxDepth

To prevent discovering entire external protocols on the first run, add `"maxDepth": 3` to the config.jsonc if it's not already set. This limits discovery to only the immediate neighbors of the initial addresses.

Read the current config:
```bash
cat packages/config/src/projects/$0/config.jsonc
```

If `maxDepth` is not present, add it (at the top level, alongside `initialAddresses`). If it's already set, leave it as-is.

The strategy is progressive deepening — start shallow, prune external contracts, then go deeper:
- **Start at `maxDepth: 3`** — discover the first few levels of the graph
- **Only increase depth after the current level is clean** — all external contracts from this iteration must be properly ignored before going deeper
- **Increase by 2-3 each time** (e.g., 3 → 5 → 7 → 10 → ...)
- **Keep increasing beyond 7** if new contracts are still appearing at deeper levels (some protocols have deep governance chains or nested proxy structures)
- **Stop increasing** when a deeper run produces no new contracts

This prevents discovering hundreds of contracts from external protocols before having a chance to prune them.

### 0e. Initialize tracking

Write an initial tracking file:

```bash
echo '{"ignoredContracts":[],"ignoredRelatives":[],"externalTags":[],"governanceTags":[],"fundsTags":[],"handlersAdded":[],"uncertainContracts":[],"iteration":0,"currentMaxDepth":3}' > /tmp/discovery-$0-tracking.json
```

---

## Step 1: Run Discovery

Run the discovery command. **Read the output carefully** — it contains critical relationship information:

```bash
cd packages/config && l2b discover $0 2>&1 | tee /tmp/discovery-$0-output.txt
```

If discovery fails, report the error and stop.

### 1a. Analyze discovery output

The discovery output shows the parent→child relationship graph. For each discovered contract, the output shows:
- The contract address and name (e.g., `eth:0x1234... ContractName`)
- `R eth:0x...` lines = **relatives** — addresses found in this contract's fields that will be discovered next
- `T template_name` = matched template
- `P proxy_type` = detected proxy pattern
- `E field - error` = errors reading specific fields
- `SKIP` lines = contracts that were skipped (ignoreDiscovery, maxDepth exceeded, etc.)

**Read `/tmp/discovery-$0-output.txt`** to understand which contracts discovered which other contracts. This relationship data is essential for classification in Step 2 — knowing that a contract was discovered via a `priceFeed` field tells you it's likely a Chainlink oracle.

### 1b. Fetch structured data from API

After discovery completes, fetch the project data from the API for structured access:

```bash
curl -s localhost:2021/api/projects/$0 > /tmp/discovery-$0-project.json
```

Extract the contract list (addresses, names, templates):

```bash
jq '[.entries[] | [.initialContracts[], .discoveredContracts[]] | .[] | {address, name, template: (.template // null), type}]' /tmp/discovery-$0-project.json > /tmp/discovery-$0-contracts.json
```

Read `/tmp/discovery-$0-contracts.json` to get the full list of discovered contracts.

Also load existing contract tags (may be empty on first run):

```bash
curl -s localhost:2021/api/projects/$0/contract-tags > /tmp/discovery-$0-tags.json
```

Note which addresses are in `initialAddresses` (from config read in Step 0d) — these are always core protocol contracts.

---

## Step 1c: Fix Array Overflow Errors

After each discovery run, check for "Too many values" array overflow errors. These are common in contracts with large arrays (NFT token IDs, pool lists, etc.) and clutter the output.

Run the analysis script:

```bash
python3 .claude/skills/run-discovery/scripts/analyze-array-errors.py \
  packages/config/src/projects/$0/discovered.json \
  packages/config/src/projects/$0/config.jsonc
```

**Display the full script output inside a markdown code block** so the table renders correctly.

- If the script reports **no errors**, continue to Step 2.
- If errors are found:
  - In **`--auto` mode**: Ignore all array overflow errors automatically (add all to `ignoreMethods`).
  - In **normal mode**: Show the table and ask the user which items to ignore. They respond with numbers like `ignore 1,4,6` or `ignore all` or `ignore all except 3,7`.

For each selected item, add the field name to `ignoreMethods` on the corresponding contract in `config.jsonc`:
- If the contract already has an `ignoreMethods` array, append to it
- If the contract already has an override but no `ignoreMethods`, add the property
- If the contract has no override, create one
- Group methods by contract address — don't create duplicate override entries
- **Use the exact address from the grouped output** (full address, not shortened)

After applying, re-run discovery once before proceeding to classification:

```bash
cd packages/config && l2b discover $0 2>&1 | tee /tmp/discovery-$0-output.txt
```

Re-fetch project data as in Step 1b.

---

## Step 2: Classify Contracts

For each discovered contract, classify it into one of these categories. Use your DeFi knowledge and the heuristics below.

### Category A — Core Protocol

Keep these. They are the protocol's own contracts:
- Contracts listed in `initialAddresses`
- Contracts whose name clearly belongs to the protocol (e.g., for Aave: `LendingPool`, `AToken`)
- ProxyAdmin contracts that manage protocol proxies
- Protocol-specific governance contracts (Governor, Timelock) that are part of this protocol

### Category B — External

Mark for pruning. Contracts from other DeFi protocols or well-known infrastructure:

**Token contracts** (discovered via fields like `token`, `asset`, `baseToken`, `collateral`, `underlying`, `rewardToken`):
- WETH (`WETH9`, `CanonicalWETH`)
- USDC (`FiatTokenProxy`, `FiatTokenV2_1`, `MasterMinter`, `SignatureChecker`) — entity: "Circle USDC"
- USDT (`TetherToken`) — entity: "Tether USDT"
- DAI (`Dai`, `DaiToken`) — entity: "MakerDAO"
- WBTC, stETH, wstETH, rETH, cbETH, LINK, UNI, COMP, AAVE, MKR, etc.

**Oracle contracts** (discovered via fields like `oracle`, `priceFeed`, `aggregator`, `feed`, `priceSource`):
- Chainlink: `AggregatorProxy`, `EACAggregatorProxy`, `AccessControlledOffchainAggregator`, `FeedRegistry` — entity: "Chainlink"

**External protocol contracts** (discovered transitively through tokens or oracles):
- Uniswap: `UniswapV2Factory`, `UniswapV2Router02`, `UniswapV3Factory`, `UniswapV3Pool`, `NonfungiblePositionManager` — entity: "Uniswap"
- Compound: `Comptroller`, `CToken` (when not the protocol being analyzed) — entity: "Compound"
- Aave: `PoolAddressesProvider`, `AToken` (when not the protocol being analyzed) — entity: "Aave"
- MakerDAO: `Vat`, `Pot`, `Jug`, `DSPause`, `DSProxy` — entity: "MakerDAO"

**When in doubt, keep the contract** and put it in category E (uncertain). A slightly larger discovery graph is better than accidentally excluding a critical protocol contract.

### Category C — Governance

Protocol's own governance contracts. Tag as `isGovernance: true`:
- Timelock contracts used by this protocol
- Governor/GovernorBravo contracts
- GnosisSafe multisigs that serve as protocol admin/owner (check if they appear in `owner`, `admin`, `guardian` fields of core contracts)

### Category D — Funds-Holding

Protocol contracts that hold or manage user funds. Tag for funds tracking:
- **`fetchBalances: true`**: Vaults, pools, treasuries, reserve contracts, stability pools, active pools — contracts that receive user deposits or hold protocol reserves
- **`fetchPositions: true`**: Contracts that themselves hold DeFi positions in other protocols (e.g., a yield vault depositing into Aave)
- **`isToken: true`**: The protocol's own native/governance token contract
- **`fetchAggregate: true`**: Only if an existing aggregate handler matches. Current handlers: `uniswap-v2-factory`, `frankencoin-mintinghub`. If a contract seems to need a custom aggregate (e.g., a factory with many pools), note it as a recommendation but do NOT set the tag.

A contract can be both external AND need funds tracking. For example, WETH is external but a vault holding WETH needs `fetchBalances: true` on the vault (not on WETH itself).

### Category E — Uncertain

Can't determine classification. Keep in graph, flag for user review. Include a note explaining what's unclear.

---

## Step 3: Present Classification and Pause

### If NOT `--auto` mode (default): Show classification and wait

Present the classification as a clear table to the user:

```
## Iteration N — Contract Classification for $0

### Core Protocol Contracts (N)
| Name | Address | Notes |
|------|---------|-------|
| ... | eth:0x... | Initial address / Protocol vault / etc. |

### External — Will Prune (N)
| Name | Address | Entity | Pruning Method |
|------|---------|--------|----------------|
| WETH9 | eth:0xC02... | WETH | ignoreDiscovery |
| LendingPool | eth:0x... | — | ignoreRelatives: ["priceFeed"] on ParentContract |

### Governance (N)
| Name | Address |
|------|---------|
| GovernorTimelock | eth:0x... |

### Funds-Holding (N)
| Name | Address | Suggested Tags |
|------|---------|----------------|
| MainVault | eth:0x... | fetchBalances |
| ProtocolToken | eth:0x... | isToken |

### Uncertain — Needs Your Input (N)
| Name | Address | Notes |
|------|---------|-------|
| UnknownProxy | eth:0x... | Could be protocol-internal or external |
```

Then tell the user:
1. Review the classification above
2. Tell me if any contracts are misclassified
3. Tell me if you want any handlers added (e.g., "add accessControl handler to ContractX")
4. Once confirmed, I'll apply the changes and re-run discovery

**Wait for the user's response before proceeding.**

### If `--auto` mode: Apply directly

Skip the pause. Apply the classification and move to Step 4.

---

## Step 4: Apply Changes

### 4a. Update config.jsonc

Read the current config.jsonc:

```bash
cat packages/config/src/projects/$0/config.jsonc
```

Add overrides for external contracts. Use the Write tool to write the updated config.

**Pruning external contracts:**

When a contract is classified as external, the goal is to keep it visible in the graph (so it can be tagged and analyzed) but prevent discovery from walking into the external protocol's internals.

`ignoreRelatives` takes an **array of field names** — it tells discovery "don't follow addresses found in these specific fields as relatives."

**Standard approach for external contracts:**
1. Add `ignoreRelatives` listing **all address-containing fields** of the external contract — this keeps the contract in `discovered.json` with all its data, but nothing deeper gets discovered
2. Tag the contract as external via the API

```jsonc
"eth:0xExternalContract": {
  "ignoreRelatives": ["owner", "implementation", "token0", "token1", "factory"]
}
```

To know which fields to list: check the discovery output for the `R eth:0x...` (relative) lines under that contract — each relative is an address found in one of the contract's fields. Cross-reference each relative address against the contract's field values (from `/tmp/discovery-$0-contracts.json` or the API) to determine which field name produced it. List all those field names in `ignoreRelatives`.

**`ignoreDiscovery: true`** is a different tool — it makes the contract **completely disappear** from `discovered.json`. Only use this in rare cases where a contract truly has no place in the graph (it can't be tagged or analyzed afterward).

**`ignoreRelatives` on a core contract**: Use when a core contract has a specific field pointing to something you don't want discovered at all (e.g., a reference to a deprecated contract). This prevents the target from even appearing in the graph.

**Merging rules:**
- If the contract already has an override entry, merge your additions with the existing fields. Do NOT overwrite existing `ignoreMethods`, `ignoreInWatchMode`, `fields`, etc.
- If adding `ignoreRelatives` to a contract that already has `ignoreRelatives`, merge the arrays (add new field names, keep existing ones).
- Config files use JSONC format (comments allowed). Preserve any existing comments.

Track every addition in `/tmp/discovery-$0-tracking.json`.

### 4b. Apply API tags

For contracts that will remain in the discovery graph (not pruned by ignoreDiscovery), apply tags via the API:

**External contracts** (only those still present in `discovered.json` — contracts with `ignoreDiscovery: true` cannot be tagged):
```bash
curl -s -X PUT localhost:2021/api/projects/$0/contract-tags \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"eth:0x...","isExternal":true,"entity":"EntityName"}'
```

**Governance contracts:**
```bash
curl -s -X PUT localhost:2021/api/projects/$0/contract-tags \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"eth:0x...","isGovernance":true}'
```

**Funds tracking:**
```bash
curl -s -X PUT localhost:2021/api/projects/$0/contract-tags \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"eth:0x...","fetchBalances":true}'
```

```bash
curl -s -X PUT localhost:2021/api/projects/$0/contract-tags \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"eth:0x...","isToken":true}'
```

Apply tags one at a time. Report any API errors.

### 4c. Add handlers (if user requested)

If the user requested handler additions during the pause, **read [HANDLER_REFERENCE.md](HANDLER_REFERENCE.md) now** (first time only) for the correct handler syntax.

Then add the requested handlers to config.jsonc in the `overrides` section under the appropriate contract address. Example:

```jsonc
"eth:0xContractAddress": {
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
}
```

Merge with any existing overrides for that contract.

---

## Step 5: Increase maxDepth, Re-run Discovery, and Loop

### 5a. Decide whether to increase maxDepth

Increase `maxDepth` **only if** this iteration is clean — meaning all external contracts have been properly pruned (ignoreDiscovery/ignoreRelatives added) and the user has confirmed the classification (or `--auto` mode accepted it).

- If there are still unresolved external contracts at the current depth, do NOT increase — re-run at the same depth after adding the ignore rules.
- If the current depth is clean, increase by 2-3 (e.g., 3 → 5 → 7 → 10 → 12).
- Keep increasing beyond 7 if new contracts are still appearing — some protocols have deep governance chains or nested proxy structures that need higher depth.

Update config.jsonc with the new maxDepth value.

### 5b. Re-run discovery

```bash
cd packages/config && l2b discover $0 2>&1 | tee /tmp/discovery-$0-output.txt
```

Re-fetch project data:

```bash
curl -s localhost:2021/api/projects/$0 > /tmp/discovery-$0-project.json
jq '[.entries[] | [.initialContracts[], .discoveredContracts[]] | .[] | {address, name, template: (.template // null), type}]' /tmp/discovery-$0-project.json > /tmp/discovery-$0-contracts.json
```

### 5c. Compare and loop

Compare the new contract list against the previous iteration:
- **New contracts** (not seen before): Classify them (go back to Step 2)
- **Removed contracts**: Note they were pruned by the ignore rules
- **Same contracts**: No changes needed

**Loop back to Step 2** if there are new contracts to classify.

**Stop when:**
- No new contracts appeared compared to the previous iteration AND maxDepth has reached 7 → the graph is stable
- Maximum 5 iterations reached → warn the user that manual review may be needed for the remaining contracts

Update the iteration counter in tracking.

---

## Step 6: Final Report

After the loop stabilizes, present a comprehensive report:

```
## Discovery Report for $0

### Summary
- Discovery iterations: N
- Final contract count: N (core: X, external pruned: Y, governance: Z, funds-tagged: W)
- Config changes: N overrides added to config.jsonc

### Ignored Contracts (ignoreDiscovery: true)
| Contract | Address | Reason |
|----------|---------|--------|
| WETH9 | eth:0xC02... | Standard WETH, external infrastructure |
| AggregatorProxy | eth:0x... | Chainlink oracle, external |

### Ignored Relatives (ignoreRelatives)
| Contract | Field(s) Ignored | Reason |
|----------|-----------------|--------|
| LendingPool | priceFeed | Points to Chainlink oracle |

### Tags Applied
| Contract | External | Governance | Entity | Funds Tags |
|----------|----------|------------|--------|------------|
| WETH9 | yes | — | WETH | — |
| GovernorTimelock | — | yes | — | — |
| MainVault | — | — | — | fetchBalances |

### Handlers Added
| Contract | Handler Type | Field Name |
|----------|-------------|------------|
(or "None — no handlers were requested")

### Aggregate Recommendations
(If any contracts seem to need a custom aggregate handler that doesn't exist yet)
- <ContractName> (eth:0x...) may need a custom aggregate handler for <reason>.
  Existing handlers: uniswap-v2-factory, frankencoin-mintinghub.

### Uncertain / Needs Further Review
| Contract | Address | Notes |
|----------|---------|-------|
| UnknownProxy | eth:0x... | Could not determine if internal or external |

### All Config Changes Made
(Summary of what was added to config.jsonc — ignoreDiscovery, ignoreRelatives, handlers)
```

This report lets the user verify that no important contracts were accidentally excluded.

---

## Step 7: Clean Up

```bash
rm -f /tmp/discovery-$0-project.json /tmp/discovery-$0-contracts.json /tmp/discovery-$0-tags.json /tmp/discovery-$0-tracking.json
```

---

## Guidelines

- **When in doubt, keep it**: A slightly larger graph is better than excluding a critical contract. Put uncertain contracts in category E and let the user decide.
- **Preserve existing config**: When editing config.jsonc, merge with existing overrides. Never delete existing `ignoreMethods`, `ignoreInWatchMode`, `fields`, or other settings.
- **Track everything**: Record every `ignoreDiscovery`, `ignoreRelatives`, tag, and handler addition. The final report must be comprehensive.
- **Use chain-prefixed addresses**: All addresses in config.jsonc and API calls use `eth:0x...` format (or `arb1:0x...`, `base:0x...`, etc.).
- **One tag API call per contract**: Don't batch. Apply tags one at a time and check for errors.
- **No handler auto-detection**: Only add handlers when the user explicitly requests them. The HANDLER_REFERENCE.md contains all patterns.
- **Respect the iteration limit**: Maximum 5 discovery iterations. If the graph isn't stable by then, report and let the user continue manually.
- **JSONC format**: config.jsonc supports comments. Preserve them when editing.
- **Report ignored contracts prominently**: The user must be able to verify every exclusion decision. This is the most important part of the report.
