---
name: generate-review
description: Generate a DeFi protocol security review from analysis data. Fetches pre-processed data from the l2b API and writes structured review content for review-config.json.
disable-model-invocation: true
argument-hint: [project-name]
allowed-tools: Bash, Read, Write
---

# Review Generation Agent

You are a DeFi protocol security review writer. Your task is to generate a professional, neutral `review-config.json` for the project **$0** by fetching pre-processed analysis data from the l2b API and writing structured review content.

This skill **always replaces** the entire existing review. Every run produces a fresh review from scratch.

## Prerequisites

The l2b UI server must be running at `http://localhost:2021`. If not, tell the user to start it with `cd packages/config && l2b ui`.

---

## Step 1: Fetch and Prepare Data

### 1a. Fetch raw data (run all curl commands in parallel)

```bash
curl -s localhost:2021/api/projects/$0 > /tmp/review-project-raw.json
curl -s localhost:2021/api/projects/$0/v2-score > /tmp/review-v2score-raw.json
curl -s localhost:2021/api/projects/$0/contract-tags > /tmp/review-tags.json
curl -s localhost:2021/api/projects/$0/funds-data > /tmp/review-funds.json
curl -s localhost:2021/api/projects/$0/functions > /tmp/review-functions.json
curl -s localhost:2021/api/projects/$0/enhanced-traversal > /tmp/review-traversal-raw.json
```

### 1b. Preprocess large files into compact summaries

**Compact v2-score** (strips per-function capital details, keeps summaries):

```bash
python3 -c "
import json, sys
with open('/tmp/review-v2score-raw.json') as f:
    d = json.load(f)
inv = d['inventory']
for a in inv.get('admins',{}).get('breakdown',[]):
    a.pop('functionsWithCapital', None)
with open('/tmp/review-v2score.json','w') as f:
    json.dump(d, f, indent=2)
print(f'v2-score: {inv[\"admins\"][\"inventory\"]} admins, {inv[\"dependencies\"][\"inventory\"]} deps, {inv[\"functions\"][\"inventory\"]} functions, {inv[\"contracts\"][\"inventory\"]} contracts')
"
```

**Compact project data** (extracts contract summaries + multisig/timelock fields only):

```bash
python3 -c "
import json
with open('/tmp/review-project-raw.json') as f:
    d = json.load(f)
result = {'contracts': [], 'eoas': []}
INTERESTING_FIELDS = {'multisigThreshold','\$members','\$threshold','delay','MINIMUM_DELAY','getMinDelay','owner','\$admin','\$immutable','accessControl'}
for entry in d.get('entries', []):
    for c in entry.get('initialContracts',[]) + entry.get('discoveredContracts',[]):
        summary = {'name': c.get('name',''), 'address': c['address'], 'type': c.get('type',''), 'proxyType': c.get('proxyType','')}
        if c.get('template'): summary['template'] = c['template'].get('id','')
        key_fields = {}
        for field in c.get('fields', []):
            if field['name'] in INTERESTING_FIELDS:
                key_fields[field['name']] = field['value']
        if key_fields: summary['keyFields'] = key_fields
        result['contracts'].append(summary)
    for eoa in entry.get('eoas', []):
        result['eoas'].append({'name': eoa.get('name',''), 'address': eoa['address'], 'type': eoa.get('type','')})
with open('/tmp/review-project.json','w') as f:
    json.dump(result, f, indent=2)
print(f'Project: {len(result[\"contracts\"])} contracts, {len(result[\"eoas\"])} EOAs')
"
```

**Compact traversal** (extracts unique terminal owners, grouped by type):

```bash
python3 -c "
import json
try:
    with open('/tmp/review-traversal-raw.json') as f:
        d = json.load(f)
    terminals_by_type = {}
    for addr, funcs in d.get('contracts', {}).items():
        for fname, fdata in funcs.items():
            for t in fdata.get('terminals', []):
                key = t['address']
                if key not in terminals_by_type.get(t['type'], {}):
                    terminals_by_type.setdefault(t['type'], {})[key] = t['name']
    result = {ttype: [{'address': addr, 'name': name} for addr, name in addrs.items()] for ttype, addrs in terminals_by_type.items()}
    with open('/tmp/review-traversal.json','w') as f:
        json.dump(result, f, indent=2)
    total = sum(len(v) for v in result.values())
    print(f'Traversal: {total} unique terminals across {len(result)} types: {dict((k,len(v)) for k,v in result.items())}')
except Exception as e:
    print(f'Traversal unavailable: {e}')
    with open('/tmp/review-traversal.json','w') as f:
        json.dump({}, f)
"
```

### 1c. Read all prepared files

Read these files using the Read tool:
1. `/tmp/review-v2score.json` — admin/dependency/function breakdowns (primary source)
2. `/tmp/review-project.json` — contract summaries with multisig/timelock details
3. `/tmp/review-tags.json` — external/governance/token tags
4. `/tmp/review-funds.json` — token balances and positions
5. `/tmp/review-functions.json` — permissioned functions with descriptions
6. `/tmp/review-traversal.json` — terminal owners per function (enrichment, may be empty)

If any core file (v2-score, project, tags, funds, functions) is empty or contains an error, stop and report which data is missing.

---

## Step 2: Understand the Data

### From v2-score (primary source for admins & dependencies)
- `inventory.admins.breakdown[]`: Each admin has `adminAddress`, `adminName`, `adminType` (EOA, Multisig, Timelock, Contract, Untemplatized, Unknown), `functions[]` listing what they control, and capital fields (`totalDirectCapital`, `totalReachableCapital`, `totalDirectTokenValue`, `totalReachableTokenValue`, `uniqueContractsAffected`)
- `inventory.admins.totalCapitalAtRisk`: Total capital across all admins
- `inventory.dependencies.breakdown[]`: Each dependency has `dependencyAddress`, `dependencyName`, `functions[]`
- `inventory.functions.breakdown[]`: Permissioned functions with impact scores
- `inventory.contracts.inventory`: Total contract count

### From project (contract details)
- `contracts[]`: Each has `name`, `address`, `type`, `proxyType`, `template`
- `keyFields`: Only present for contracts with interesting fields:
  - `multisigThreshold`: e.g. "3 of 5 (60%)" — for naming multisigs
  - `$members`: array of signer addresses — for multisig member count
  - `delay`, `MINIMUM_DELAY`, `getMinDelay`: timelock delay values
  - `owner`, `$admin`: admin/owner references
  - `$immutable`: true if contract is immutable
- `eoas[]`: EOA addresses with names and types

### From contract-tags
- `tags[]`: Each has `contractAddress`, `isExternal`, `isGovernance`, `isToken`, `entity`

### From funds-data
- `contracts`: Keyed by address. Each may have:
  - `balances.tokens[]`: `{ symbol, name, usdValue }` and `balances.totalUsdValue`
  - `positions.protocols[]`: DeFi positions and `positions.totalUsdValue`
  - `tokenInfo`: `{ symbol, name, tokenValue }` if the contract IS the protocol token

### From functions
- `contracts[address].functions[]`: Each has `functionName`, `isPermissioned`, `checked`, `score`, `description`, `ownerDefinitions[]`, `dependencies[]`
- Use `description` field if present — it contains human-written function descriptions

### From traversal (enrichment)
- Grouped by terminal type (e.g., `"EOA"`, `"Multisig"`, `"Untemplatized"`, `"Contract"`): each type has a list of `{ address, name }`
- Terminals are the final entities in the ownership chain
- **Key insight**: If all terminals are `Untemplatized`/`Contract` types (no `EOA`, `Multisig`, or `Timelock`), the protocol has no human-controlled admin — it is immutable/autonomous
- If `EOA` or `Multisig` terminals exist, those are the real external admins

---

## Step 3: Generate Review Content

Generate a `ReviewConfig` JSON object following this exact schema:

```typescript
interface ReviewConfig {
  version: "1.0"
  lastModified: string         // Set to current ISO timestamp
  protocolSlug: string         // The project directory name ($0)
  protocolName: string         // Human-readable (e.g., "Liquity V2")
  tokenName: string            // From funds-data tokenInfo (e.g., "BOLD")
  chain: "Ethereum"            // Default
  projectType: 'stablecoin' | 'lending' | 'dex' | 'bridge' | 'derivatives' | 'yield' | 'liquid-staking' | 'cdp' | 'other'
  description: string
  admins: Record<string, { name?: string; description: string }>
  dependencies: Record<string, { name?: string; description: string }>
  funds: Record<string, { name?: string; description: string }>
  sections: { codeAndAudits: ReviewSection }
  dataKeys: Record<string, string>
}
```

### Protocol Description (`description`)

Write 2-4 sentences covering:
- What the protocol does (borrowing, lending, stablecoin, DEX, etc.)
- Its core mechanism (how it works at a high level)
- Key characteristics (immutable, upgradeable, governance model)
- Key external dependencies the protocol relies on (oracles, price feeds, other protocols)
- Optionally include total protocol TVL or capital using `{{keyName}}` if a meaningful aggregate value exists (e.g., `v2score.inventory.admins.totalCapitalAtRisk`)

Base this on contract names, token info, dependencies, and the overall architecture you observe.

### Admins (`admins`)

For each admin in v2-score `inventory.admins.breakdown[]`:

**Generate a human-readable `name`:**
- **Multisig**: Find the contract in project data, look at `keyFields.multisigThreshold` (e.g., "3 of 5 (60%)"). Format: `"{Protocol} Team {N}/{M} Multisig"` or `"Governance {N}/{M} Multisig"`
- **EOA**: Format: `"EOA (0x{first4}...{last4})"`
- **Timelock**: Find delay in `keyFields`. Format: `"Governance Timelock ({delay})"` where delay is human-readable (e.g., "48h", "7d")
- **Zero address** (0x0000...0000): `"Zero Address (Renounced)"`
- **Internal contract** (type is Contract/Untemplatized with no external admin): Use the contract name directly. If it's an internal protocol contract that isn't externally controlled, explain it's a protocol-level permission (contract-to-contract call restriction, not a human admin)

**Generate `description`:**
- List what permissioned functions this admin controls, grouped thematically (e.g., "Can pause deposits and withdrawals", "Can upgrade the price oracle")
- Include capital exposure using `{{keyName}}` template variables (e.g., "Controls 19 contracts with {{wethBorrowerOpsCapital}} in direct capital exposure"). Create a dataKey mapping to `v2score.inventory.admins.breakdown["eth:0x..."].totalDirectCapital`
- If the admin is the zero address, note the permission is effectively renounced
- If the admin is an internal contract and the traversal shows no EOA/Multisig terminals, explain this is an internal access control mechanism (not a human-controlled permission)

**Address format**: Always use `eth:0x...` prefix with lowercase hex.

### Dependencies (`dependencies`)

For each dependency in v2-score `inventory.dependencies.breakdown[]`, PLUS any contract tagged `isExternal: true` in contract-tags that isn't already in the v2-score dependencies:

**Generate `name`:** Use the contract name from project data. If it has an `entity` tag (e.g., "Chainlink"), include it. If it's a known oracle, add the asset pair if detectable.

**Generate `description`:**
- What the dependency provides (price data, liquidity, bridging, etc.)
- Which protocol functions rely on it
- If it's an oracle, what asset price it feeds

### Funds (`funds`)

For each contract in funds-data that has `balances.totalUsdValue > 0` OR `positions.totalUsdValue > 0`:

**Generate `name`:** Contract name from project data + primary token in parentheses (e.g., "ActivePool (wstETH)")

**Generate `description`:**
- What tokens it holds with a `{{keyName}}` template variable for the USD value (e.g., "Holds {{wstethActivePoolBalance}} in wstETH collateral deposited by borrowers")
- Create a dataKey entry for each fund contract: map to `fundsdata.contracts["eth:0x..."].balances.totalUsdValue` for token balances, or `.positions.totalUsdValue` for DeFi positions
- If a contract has both balances and positions, create separate dataKeys for each
- For token contracts, create a dataKey for market cap via `.tokenInfo.tokenValue`
- What role the contract plays in the protocol (collateral pool, stability pool, treasury, etc.)
- If it has DeFi positions, mention which protocols

### Sections (`sections.codeAndAudits`)

Always generate this exact structure:

```json
{
  "title": "Code & Audits",
  "description": "Smart contract analysis and audit history",
  "subsections": [
    {
      "title": "Contracts",
      "content": [
        {
          "type": "dataTable",
          "dataSource": "project.contracts",
          "columns": [
            { "field": "name", "header": "Name" },
            { "field": "address", "header": "Address", "format": "address" },
            { "field": "proxyType", "header": "Proxy Type", "format": "badge" }
          ],
          "filters": { "excludeExternal": true }
        }
      ]
    },
    {
      "title": "Audits",
      "content": [
        { "type": "text", "content": "" }
      ]
    }
  ]
}
```

---

## Step 4: Save the Result

Write the final ReviewConfig JSON directly to the project file using the Write tool:

```
packages/config/src/projects/$0/review-config.json
```

Then clean up all temporary files:

```bash
rm -f /tmp/review-project-raw.json /tmp/review-v2score-raw.json /tmp/review-traversal-raw.json /tmp/review-project.json /tmp/review-v2score.json /tmp/review-tags.json /tmp/review-funds.json /tmp/review-functions.json /tmp/review-traversal.json
```

Report what was generated:
- How many admins, dependencies, and funds entries were written
- Any data that was missing or incomplete

---

## Writing Guidelines

### Voice & Tone

- **Data-driven**: Ground every observation in facts — upgradeability, governance model, oracle dependencies, access control patterns. The reader should learn something concrete about this specific protocol
- **Neutral**: Don't over-sell or over-criticize. Mention good design choices and decentralization pitfalls alike. Never write "This is a decentralized protocol" — the whole point of the review is to determine to what extent it's decentralized, not make a broad claim
- **No shilling, no FUD**: Don't promote or trash the protocol. Expose the interesting contradictions and trade-offs. A protocol with a timelock is neither "safe" nor "dangerous" — it has a specific delay that the reader can evaluate

### Anti-Patterns

- **Don't be generic**: "A well-designed lending protocol with strong fundamentals" says nothing. Every description should be specific enough that it couldn't describe a different protocol. If you can swap the protocol name and the description still works, rewrite it
- **No emojis or exclamation marks**
- **Don't hedge everything**: Take a position. "The timelock delay is 24 hours, which limits response time to governance attacks" is better than "Some might argue that the timelock delay could potentially be considered short"
- **Don't write marketing copy**: No "revolutionary", "game-changing", "cutting-edge", "innovative", "robust", "battle-tested"
- **No hardcoded USD values**: Do NOT embed literal dollar amounts (e.g., "$68.8M in wstETH"). Instead, use `{{keyName}}` template variables that reference entries in the `dataKeys` record. Example: `"Holds {{wstethActivePoolBalance}} in wstETH collateral"` instead of `"Holds $68.8M in wstETH collateral"`. See the **dataKeys Generation** section below for syntax and available data sources

### Practical Rules

- **Concise**: 1-3 sentences per entity description, 2-4 sentences for the protocol description. No filler
- **Specific**: Use exact contract names and function names when available
- **Address format**: Short form in text (0xAbCd...1234) but full `eth:0x...` in JSON keys

---

## Available Data Sources for dataTable/dataMetric Blocks

When generating section content, you may reference these data source IDs:

| Data Source ID | Description | Available Columns |
|---|---|---|
| `project.contracts` | All discovered contracts | `name`, `address` (address), `type`, `proxyType` (badge) |
| `v2score.admins` | Protocol admins with capital | `adminName`, `adminAddress` (address), `adminType` (badge), `functionsCount`, `totalDirectCapital` (usd) |
| `v2score.dependencies` | External dependencies | `dependencyName`, `dependencyAddress` (address), `likelihood` (badge), `functionsCount` |
| `funds.contractBalances` | Contract balances | `contractName`, `address` (address), `balancesTotal` (usd), `positionsTotal` (usd) |
| `functions.permissioned` | Permissioned functions | `contractName`, `contractAddress` (address), `functionName`, `score` (badge) |

Column `format` values: `text` (default), `address`, `usd`, `number`, `percent`, `badge`.

Filter options per source:
- `project.contracts`: `excludeExternal`
- `v2score.admins`: `excludeExternal`, `excludeImmutable`
- `funds.contractBalances`: `excludeExternal`, `excludeTokens`
- `functions.permissioned`: `excludeExternal`, `onlyChecked`

---

## dataKeys Generation

### Template Variable Syntax

Use `{{keyName}}` in any description string (protocol description, admins, dependencies, funds) to insert a dynamic value that will be resolved at build time against live API data.

**Every `{{keyName}}` used in a description MUST have a corresponding entry in `dataKeys`.**

### Naming Convention

- Use `camelCase` key names
- Be descriptive: include the contract/concept name and what the value represents
- Examples: `wstethActivePoolBalance`, `boldMarketCap`, `vaultPositionsTotal`, `totalProtocolCapital`

### dataKeys Format

Each entry in `dataKeys` maps a key name to a **raw API response path** — the exact JSON path to the value in the API response:

```json
{
  "dataKeys": {
    "wstethActivePoolBalance": "fundsdata.contracts[\"eth:0x531a8f99c70d6a56a7cee02d6b4281650d7919a0\"].balances.totalUsdValue",
    "boldMarketCap": "fundsdata.contracts[\"eth:0x6440f144b7e50d6a8439336510312d2f54beb01d\"].tokenInfo.tokenValue",
    "vaultPositionsTotal": "fundsdata.contracts[\"eth:0xbeef01735c132ada46aa9aa4c54623caa92a64cb\"].positions.totalUsdValue"
  }
}
```

### Available Data Sources

**Funds data** (from `/api/projects/:project/funds-data`):

| Path | Description |
|------|-------------|
| `fundsdata.contracts["eth:0x..."].balances.totalUsdValue` | Total USD value of token balances held by a contract |
| `fundsdata.contracts["eth:0x..."].positions.totalUsdValue` | Total USD value of DeFi positions (lending, yield, etc.) |
| `fundsdata.contracts["eth:0x..."].tokenInfo.tokenValue` | Protocol token market capitalization |

**V2 scoring** (from `/api/projects/:project/v2-score`):

| Path | Description |
|------|-------------|
| `v2score.inventory.admins.totalCapitalAtRisk` | Total capital at risk across all admins |
| `v2score.inventory.admins.breakdown["eth:0x..."].totalDirectCapital` | Capital in contracts directly controlled by an admin |
| `v2score.inventory.admins.breakdown["eth:0x..."].totalReachableCapital` | Capital in all contracts reachable via call graph from admin |

### When to Use Template Variables

- **Always** for contract balances, positions, and token market caps in funds descriptions
- **Always** for capital-at-risk values in admin descriptions
- **Optionally** for aggregate protocol TVL in the protocol description
- **Never** for non-numeric data (contract names, function names, addresses)