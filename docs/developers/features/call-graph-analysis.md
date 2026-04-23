# Call Graph Analysis

## External Call Detection

Uses Slither to analyze which external contracts each function calls. The output is stored per project in `call-graph-data.json` and consumed by permission traversal, capital analysis, and dependency detection.

- **Backend**: `callGraph.ts` (Slither runner + parser), `callGraphHeuristics.ts` (resolution heuristic engine)
- **Tool**: Slither's `--print slithir`
- **Env config**:
  - `SLITHER_VENV_PATH` — default `~/.slither-venv/`
  - `SLITHER_PATH` — default `$SLITHER_VENV_PATH/bin/slither`
  - `ETHERSCAN_API_KEY_FOR_DISCOVERY` / `L2B_ETHERSCAN_API_KEY` — **only required for Ethereum mainnet**. For L2s routed through Blockscout-style explorers (Base, Arbitrum, Optimism, Polygon, Gnosis, Scroll, Linea, Blast, zkSync, Avalanche, Celo) Slither accepts a placeholder key; the parser runs Slither with `<chain>:0x...` addresses via the `CHAIN_TO_SLITHER_NETWORK` map in `callGraph.ts` and lets the explorer resolve source without an API key. Add new chains to that map as needed.

### How it works

1. Runs Slither on each non-external contract to get SlithIR output
2. Parses the output into `contracts → functions → calls`
3. Starts from ABI functions only (public/external) to avoid pulling in library noise
4. Follows `INTERNAL_CALL` and `LIBRARY_CALL` chains transitively
5. Collects `HIGH_LEVEL_CALL`s reachable from each public function
6. Resolves storage variables to addresses using `discovered.json`
7. Classifies each call as view or write using the target ABI (or caller inference)

### Implementation details

- **ABI-driven parsing**: only captures calls from the target contract's public interface
- **Function overloading**: merges calls from overloaded functions with the same name
- **View inference**: if the caller is view/pure, an external call must also be view
- **Contract name matching**: Slither's output uses `INFO:Printers:Contract X` or `Contract X` formats for the main contract — the parser handles both
- **Nested object resolution**: `resolveStorageVariable` extracts addresses from struct-like objects (e.g. `{ aggregator: "eth:0x…", decimals: 8 }`) and resolves when exactly one address is found
- **REF_ propagation**: parent type substitutions propagate through synthetic Slither `REF_`/`TMP_` references, so the same internal function called with different arguments produces separate call entries
- **Context-aware deduplication**: the visited-set key includes type substitutions to prevent merging calls with different argument contexts
- **SafeERC20 wrapper synthesis** — OpenZeppelin's `safeTransfer`/`safeTransferFrom`/`safeApprove`/`forceApprove`/`safeIncreaseAllowance`/`safeDecreaseAllowance` route the underlying token call through `_callOptionalReturn` → `Address.functionCall` (low-level `call`), so Slither emits **no HIGH_LEVEL_CALL** for the real transfer/approve. Without a workaround, any function whose only external call goes through SafeERC20 is dropped entirely (the ABI-driven walker only keeps functions with ≥1 reachable HLC), and `safeApprove` mis-resolves to the `allowance()` pre-check inside the wrapper. `synthesizeSafeERC20Call()` in `callGraph.ts` emits a synthetic HLC per SafeERC20 `LIBRARY_CALL` by mapping `safeTransfer → transfer`, `safeTransferFrom → transferFrom`, `safeApprove/forceApprove → approve`, etc. The first LIBRARY_CALL argument is the token; a `CONVERT TMP_X = CONVERT srcVar to IERC20` alias tracker unwraps the Slither temp back to the caller's state variable name. If the wrapper sits inside another library that forwards its IERC20 param, the caller's `typeSubstitutions.get('IERC20')` is used as a fallback so the synthesized call still carries the real token name.
- **LIBRARY_CALL argument propagation** — previously library bodies inherited the parent's `typeSubstitutions` unchanged. `collectHighLevelCalls` now builds a fresh `TypeSubstitutionMap` per library call via `buildTypeSubstitutionMap`, which fixes mis-labeled HLCs for any library taking interface-typed parameters (SafeERC20 is the common case; generic protocol libraries benefit too)

### Timeout handling

Each contract gets a fixed window to complete Slither analysis. If it exceeds the limit, the process is SIGKILL-ed (not SIGTERM — Slither can ignore SIGTERM during compile) and the contract is recorded as skipped.

- **Env var**: `SLITHER_TIMEOUT_MS` — override the per-contract timeout (default: `2 * 60 * 1000` ms = 2 minutes)
- **Effect on output**: skipped contracts are written to `call-graph-data.json` with `skipped: true` instead of an `externalCalls` array

Skipped entry shape:
```json
{
  "contracts": {
    "eth:0x...": {
      "skipped": true,
      "skipReason": "Slither timeout after 120s"
    }
  }
}
```

**Terminal output** — skipped contracts emit a red warning during the analysis run, and a summary block lists all timed-out contracts at the end. If a contract is missing from the call graph, check `call-graph-data.json` for a `skipped: true` entry on that address.

### Heuristic Resolution Engine

When a direct `discovered.json` lookup fails, `callGraphHeuristics.ts` runs a set of heuristics in order and picks the highest-confidence result:

1. **VariableChainHeuristic** (100%) — follows Slither variable assignment chains to find state variables, handles nested struct fields
2. **DependencyFieldHeuristic** (90 / 65 / 45%) — catches getters that forward to a dependency (e.g. `Voter.rewardToken()` returns `minter.rewardToken()` at runtime) and internal/immutable fields that aren't stored as discovery values. Only fires when `storageVariable` is NOT a key in the caller's own `values`. Walks each dependency address held in the caller's `values` and looks for a field with the same name; if found and its value points at a contract whose ABI contains the called function, returns that as the match. Solves multi-branch disambiguation (Liquity-v2's per-branch `SortedTroves`, per-branch `PriceFeed`) that the interface-name heuristic was resolving by first-match-wins
3. **DiscoveredValuesScanHeuristic** (95 / 70 / 50%) — scans the caller contract's discovered values for `eth:` addresses, matches against contracts whose ABI contains the called function
4. **InterfaceNameHeuristic** (90 / 60 / 40%) — strips an `I` prefix from the interface name and matches against contract names
5. **FunctionSignatureHeuristic** (99 / 50 / 30%) — finds every contract whose ABI contains the called function

**Escape hatch for untracked internal/immutable state variables**: when a field can't be read via any getter (declared `internal` / `immutable` with no public accessor — e.g. Aerodrome's `Voter.rewardToken` = `IVotingEscrow(_ve).token()` captured in the constructor), discovery can't populate it. Add a `fields.<name>.handler` entry in `config.jsonc` (typically `"type": "hardcoded"` with the known address) so the field enters `discovered.json.values` and `VariableChainHeuristic` resolves it at 100%. This is the preferred fix over heuristics when the field-name on the caller doesn't match any name on its dependency chain.

### `call-graph-data.json` shape

```json
{
  "contracts": {
    "eth:0x...": {
      "externalCalls": [
        {
          "callerFunction": "deposit",
          "storageVariable": "token",
          "interfaceType": "IERC20",
          "calledFunction": "transferFrom",
          "resolvedAddress": "eth:0x...",
          "resolvedContractName": "USDC",
          "isViewCall": false,
          "callerIsView": false
        }
      ]
    }
  }
}
```

### Shared traversal helpers

Exported from `callGraph.ts` and used by `functionAnalysis.ts` and `projectAnalysis.ts`:

- `traverseWithPaths(callGraphData, startContract, startFunction)` — BFS traversal with path tracking, returns reachable contracts and their shortest paths. **Upgrade-aware**: when `startFunction` is an upgrade function (detected via `isUpgradeFunction()` in `types.ts`), seeds the BFS queue with every caller function on the contract, since a new implementation can execute any code path
- `findContractGraph(callGraphData, contract)` — case-insensitive contract graph lookup
- `buildExternalAddressSet(tags)` / `buildTagsByAddress(tags)` — build lookup structures from contract tags
- `isExternalAddress(address, externalAddresses)` / `findTag(tagsByAddress, address)` — address matching with `eth:` normalization
- `getCallGraphContractName(callGraphData, address)` — resolve contract name from call graph data
- `extractChainAddresses(value)` — extract all chain-prefixed addresses from a value (handles flat strings and one-level-deep object fields)

## Enhanced Traversal & Function Analysis

Owner-chain traversal and per-function impact/dependency analysis, built on the call graph + permission data.

| Endpoint | Backend | Purpose |
|---|---|---|
| `GET /api/projects/:project/enhanced-traversal` | `enhancedTraversal.ts` | Backward BFS → governance chain terminals (owners) per permissioned function |
| `GET /api/projects/:project/function-analysis` | `functionAnalysis.ts` | Forward BFS → reachable contracts with funds + external dependencies |

### Enhanced Traversal

`enhancedTraversal.ts` builds a unified graph from call-graph edges (caller → callee) plus permission edges (owner → function). This is the same graph used forward for capital analysis in `capitalAnalysis.ts` — see [Scoring & Review: Capital Analysis](scoring-and-review.md#capital-analysis--enhanced-graph-forward-traversal).

- **Backward BFS** from each permissioned function collapses chains into `CollapsedChainStep[]` — used for governance chain display in `FunctionFolder`
- **Response**: `ApiEnhancedTraversalResponse` — `contracts[address][functionName] → FunctionTraversalResult`

**Exported utilities:**

- `buildEnhancedGraph(callGraphData, functionsData, dataAccess)` — builds the unified edge array
- `buildIndices(edges)` — produces an `EnhancedGraph` with `forwardIndex` and `backwardIndex` (both keyed by normalized contract address)
- `EnhancedEdge` — `{ sourceContract, sourceFunction?, targetContract, targetFunction, edgeType: 'permission' | 'callgraph', isViewCall? }`

### Function Analysis

`functionAnalysis.ts` iterates all write functions from `discovered.json` ABIs (the same set shown in the UI's permissions section), ensuring dependency detection covers every write function visible to reviewers.

- **Impact** (permissioned functions or functions with dependencies): forward BFS via the call graph, filtered to contracts that have funds. Returns `callPath: CallPathStep[]` (shortest path)
- **Dependencies** (all write functions): three sources merged and deduplicated:
  1. **Call-graph** (`dependencyType: 'callgraph'`) — auto-detected external contracts reached via forward BFS. Has a `callPath` showing the code-level execution trace
  2. **Write** (`dependencyType: 'write'`) — external contracts that own a permissioned function, detected via `buildWriteDependencyLookup()`. Resolves `ownerDefinitions` and filters to addresses marked `isExternal`. Empty `callPath` (authority relationship, not execution)
  3. **Manual** — dependencies explicitly listed in `functions.json`. `isAutoDetected: false`
- **Deduplication**: call-graph deps win over write-deps for the same address (richer path info). Manual deps are always preserved
- **Pre-loaded data**: accepts optional `FunctionAnalysisPreloadedData` to avoid redundant file I/O when callers (e.g. `projectAnalysis.ts`) have already loaded functions, call graph, funds, or contract tags data
- **Response**: `ApiFunctionAnalysisResponse` — `contracts[address][functionName] → FunctionAnalysis`

### Key types

Defined in both backend and frontend `types.ts`:

- `FunctionTraversalResult`, `TraversalTerminal`, `OwnershipChainStep` — enhanced traversal
- `FunctionImpactEntry`, `FunctionDependencyEntry`, `FunctionAnalysis`, `CallPathStep` — function analysis
- `FunctionDependencyEntry.dependencyType` — `'callgraph' | 'write'`
