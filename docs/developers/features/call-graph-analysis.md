# Call Graph Analysis

## External Call Detection

Uses Slither to analyze which external contracts each function calls.

- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/callGraph.ts` (Slither runner + parser), `callGraphHeuristics.ts` (resolution heuristic engine)
- **Storage**: `call-graph-data.json` per project
- **Tool**: Slither's `--print slithir` command
- **Configuration**:
  - `SLITHER_VENV_PATH` env var (default: `~/.slither-venv/`)
  - `SLITHER_PATH` env var (default: `$SLITHER_VENV_PATH/bin/slither`)

### How It Works

1. Runs Slither on each non-external contract to get SlithIR output
2. Parses output into structured representation (contracts -> functions -> calls)
3. Starts from ABI functions only (public/external) to avoid library contamination
4. Follows `INTERNAL_CALL` and `LIBRARY_CALL` chains transitively
5. Collects `HIGH_LEVEL_CALL`s reachable from each public function
6. Resolves storage variables to addresses using `discovered.json`
7. Classifies calls as view/write using target ABI or caller inference

### Key Implementation Details

- **ABI-driven parsing**: Only captures calls from the target contract's public interface
- **Function overloading**: Merges calls from overloaded functions with same name
- **View inference**: If caller is view/pure, external call must also be view
- **Contract name matching**: Slithir uses `INFO:Printers:Contract X` or alternatives such as `Contract X` format for main contract
- **Deduplication**: Removes duplicate calls per caller function
- **Nested object resolution**: `resolveStorageVariable` extracts addresses from struct-like objects (e.g., `{ aggregator: "eth:0x...", decimals: 8 }`) and resolves when exactly one address is found
- **REF_ propagation**: Parent type substitutions propagate through synthetic Slither `REF_`/`TMP_` references, so the same internal function called with different arguments (e.g., `_getPrice(ethUsdOracle)` vs `_getPrice(rEthEthOracle)`) produces separate call entries
- **Context-aware deduplication**: Visited-set key includes type substitutions to prevent merging calls with different argument contexts

### Heuristic Resolution Engine

`callGraphHeuristics.ts` resolves storage variables to contract addresses when direct `discovered.json` lookup fails. Runs all heuristics and picks the highest-confidence result:

1. **VariableChainHeuristic** (confidence: 100%) — follows Slither variable assignment chains to find state variables, handles nested struct fields
2. **DiscoveredValuesScanHeuristic** (confidence: 95/70/50%) — scans caller contract's discovered values for `eth:` addresses, matches against contracts that have the called function in their ABI
3. **InterfaceNameHeuristic** (confidence: 90/60/40%) — strips `I` prefix from interface name and matches contract names
4. **FunctionSignatureHeuristic** (confidence: 99/50/30%) — finds all contracts with the called function in their ABI

Internal helper: `contractHasFunction(discovered, entry, functionName)` — checks if a contract (including proxy implementations) has a function in its ABI. Module-private to `callGraphHeuristics.ts` (not exported).

### Data Structure (`call-graph-data.json`)

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

### Shared Traversal Helpers

Exported from `callGraph.ts`, used by `functionAnalysis.ts` and `projectAnalysis.ts`:

- `traverseWithPaths(callGraphData, startContract, startFunction)` — BFS traversal with path tracking, returns reachable contracts + shortest paths
- `findContractGraph(callGraphData, contract)` — case-insensitive contract graph lookup
- `buildExternalAddressSet(tags)` / `buildTagsByAddress(tags)` — build lookup structures from contract tags
- `isExternalAddress(address, externalAddresses)` / `findTag(tagsByAddress, address)` — address matching with `eth:` prefix normalization
- `getCallGraphContractName(callGraphData, address)` — resolve contract name from call graph data
- `extractChainAddresses(value)` — extract all chain-prefixed addresses from a value (handles flat strings and one-level-deep object fields). Legacy alias `extractEthAddresses` is deprecated

## Enhanced Traversal & Function Analysis

**Owner chain traversal and per-function impact/dependency analysis using call graph + permission data**

| Endpoint | Backend | Purpose |
|---|---|---|
| `GET /api/projects/:project/enhanced-traversal` | `enhancedTraversal.ts` | Backward BFS -> governance chain terminals (owners) for each permissioned function |
| `GET /api/projects/:project/function-analysis` | `functionAnalysis.ts` | Forward BFS -> reachable contracts with funds (impact) + external dependencies |

### Enhanced Traversal (`enhancedTraversal.ts`)

- Unified graph from call graph edges (caller->callee) + permission edges (owner->function)
- **Backward BFS** from each permissioned function, collapses chains into `CollapsedChainStep[]` — used for governance chain display in FunctionFolder
- **Forward BFS** through the same graph — used by `capitalAnalysis.ts` for capital computation (see [Scoring & Review: Capital Analysis](scoring-and-review.md#capital-analysis--enhanced-graph-forward-traversal))
- Response: `ApiEnhancedTraversalResponse` — `contracts[address][functionName] -> FunctionTraversalResult`

**Exported utilities** (used by `capitalAnalysis.ts` and `projectAnalysis.ts`):
- `buildEnhancedGraph(callGraphData, functionsData, dataAccess)` — builds unified edge array from call graph + permission resolution
- `buildIndices(edges)` — creates `EnhancedGraph` with `forwardIndex` and `backwardIndex` (both keyed by normalized contract address)
- `EnhancedEdge` — edge with `sourceContract`, `sourceFunction?`, `targetContract`, `targetFunction`, `edgeType: 'permission' | 'callgraph'`, `isViewCall?`
- `EnhancedGraph` — `{ forwardIndex, backwardIndex }` maps

### Function Analysis (`functionAnalysis.ts`)

- **ABI-driven iteration**: Iterates ALL write functions from `discovered.json` ABIs (same set shown in the UI's permissions section), not just entries in `functions.json`. This ensures dependency detection covers every write function visible in the UI.
- **Impact** (permissioned functions or functions with dependencies): Forward BFS via call graph, filters contracts with funds. Includes `callPath: CallPathStep[]` (shortest path)
- **Dependencies** (all functions): Three sources, merged and deduplicated:
  1. **Call-graph** (`dependencyType: 'callgraph'`): Auto-detected external contracts reached via forward BFS through call graph edges. Has `callPath` showing the code-level execution trace.
  2. **Write** (`dependencyType: 'write'`): External contracts that are permission-owners of permissioned functions, detected via `buildWriteDependencyLookup()`. Resolves `ownerDefinitions` from `functions.json` and filters to `isExternal` addresses. Has empty `callPath` (authority relationship, not code execution).
  3. **Manual**: Dependencies explicitly listed in `functions.json`. `isAutoDetected: false`.
  - Deduplication: call-graph deps are preferred over write-deps for the same address (richer path info). Manual deps always preserved.
- **Pre-loaded data**: Accepts optional `FunctionAnalysisPreloadedData` to avoid redundant file I/O when callers (e.g., `projectAnalysis.ts`) have already loaded functions, call graph, funds, or contract tags data
- Response: `ApiFunctionAnalysisResponse` — `contracts[address][functionName] -> FunctionAnalysis`

### Key Types (in both backend and frontend `types.ts`)

- `FunctionTraversalResult`, `TraversalTerminal`, `OwnershipChainStep` — enhanced traversal
- `FunctionImpactEntry`, `FunctionDependencyEntry`, `FunctionAnalysis`, `CallPathStep` — function analysis
- `FunctionDependencyEntry.dependencyType` — `'callgraph' | 'write'`, indicates how the dependency was detected
- `WriteDependencyInfo` — internal type for `buildWriteDependencyLookup()` results (address, name, entity)
