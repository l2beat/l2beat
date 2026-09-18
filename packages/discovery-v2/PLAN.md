# Discovery V2 — implementation plan, phase 1

Status: proposal for review. Nothing in this document has been implemented yet.
Author: Claude, from research of `packages/discovery`, `spike/queryable-facts-v2`, `queryable-facts/`,
`packages/l2b`, `packages/protocolbeat`, `packages/config` and the `expr-bakeoff/` experiment.

## 0. What phase 1 delivers

A new package `@l2beat/discovery-v2` with a CLI that, given an existing project `config.jsonc`:

1. walks the contract graph from `initialAddresses` (BFS with depth/count limits),
2. reuses V1's providers, cache, proxy detection, source fetching and flattening,
3. compiles each verified contract with its exact solc, emits AST facts, runs Soufflé, and builds a
   compact per-contract **dossier** (state variables, slots, writers, emitted events, readers),
4. asks an AI (Codex CLI) to author an **acquisition plan** (JSON: what to fetch, how to shape it with jq),
   validates the plan statically, by dry run and by consistency assertions against current getters, repairs
   it up to twice, and persists it keyed by the contract's source hash so it is reused on every later run
   (with an applicability check on each reuse),
5. executes the plan deterministically against the chain at a fixed timestamp/block,
6. writes a `discovered.json` and `.flat/` folder compatible with V1 (values, proxies, sources; no permissions
   or colorization beyond what the config already provides),
7. benchmarks the result against V1's committed `discovered.json` for the same project at the same block:
   address recall, correspondence of acquisition tasks (which V1 fields have a V2 step fetching the same
   thing) and value agreement on corresponded fields, with misses grouped by the V1 handler that produced
   them; value‑overlap figures are reported descriptively only.

Out of scope for phase 1 (listed so nobody expects them): permissions modelling (Clingo), the declarative
`fold` block, fetch kinds `transaction`/`trace`/`source`/`explorerTxs`/blobs, cross‑project `entrypoints`
and `Reference` entries, `.code` raw sources, diffHistory, update‑monitor integration, Disco UI changes,
replacing V1 in production.

## 1. Decision: a new package, importing from `@l2beat/discovery`

**Decision: `packages/discovery-v2` (`@l2beat/discovery-v2`), depending on `@l2beat/discovery` through its
public `index.ts` only.** Not a mode inside V1, not files next to V1's engine.

Why, after reading the code:

- **Everything worth reusing is already exported.** `AllProviders`, `SQLiteCache`, `ProxyDetector`,
  `SourceCodeService`, `ConfigReader`, `getDiscoveryPaths`, `getChainConfigs`, `codeIsEOA`,
  `flattenStartingFrom`, `contractFlatteningHash`, `getHashToBeMatched`, `asStructured`, `toAddressArray`,
  `get$Implementations`, `toDiscoveryOutput`/`toRawDiscoveryOutput`, `saveDiscoveredJson`,
  `flattenDiscoveredSources`, `generateStructureHash`, `diffDiscovery`, `TemplateService`, the `Analysis`
  and `DiscoveryOutput` types. The engine we replace (`DiscoveryEngine`, `AddressAnalyzer`,
  `HandlerExecutor`, handlers, Blip, templates matching) is exactly the part that is entangled with
  templates and handlers; a mode flag would have to thread through `AddressAnalyzer.analyze`,
  `AddressesWithTemplates`, `shouldSkip`, `removeAlreadyAnalyzed` and `printTemplatization`. A fresh
  ~200‑line loop is cheaper and cleaner.
- **Different dependencies.** V2 adds `jq-wasm`, `@ethereum-sourcify/compilers` (+ `-types`), `semver`, and
  a `souffle` system binary. None of that belongs in V1.
- **Zero risk to production.** V1 runs hourly in the backend and in `l2b`. V2 changes to V1 are limited to
  *adding named exports* (see §1.2). No behaviour change.
- **The boundary is the point.** When V2 needs a V1 function that is not exported, the rule is: export it
  if it is a pure, stable helper; otherwise copy it into V2 with a comment naming the origin. Never patch V1
  logic for V2's sake. That surfaces exactly the "when is it time to reimplement" signal the user asked for.
- **Cost of a package is small.** `package.json`, `tsconfig.json` (+ `.build`), `.mocharc.json`, `biome.json`
  copied from `packages/uif`; `turbo` and `pnpm` pick up `packages/*` automatically; CI runs `pnpm test`,
  `typecheck`, `lint` over all packages.

Why not inside `packages/discovery`: the only benefit is access to unexported helpers, and the list of those
we actually need is short (§1.2). The costs are real: the AI/facts stages would pull solc, Soufflé and Codex
concerns into the production package, and every "temporary" hook into `AddressAnalyzer` would become
permanent. Later, when V2 replaces V1, the reused modules move to V2 (or a shared `discovery-core`), and
V1's engine is deleted; that migration is easier from a separate package than from an interleaved one.

### 1.1 Reused from `@l2beat/discovery` (as‑is)

| Concern | Symbol(s) | Notes |
| --- | --- | --- |
| Paths, config | `getDiscoveryPaths`, `ConfigReader`, `ConfigRegistry` (via `readConfig`), `getChainConfigs` | `.discovery.json` at repo root already points at `packages/config/src/projects` and the SQLite cache |
| RPC/explorer stack | `AllProviders`, `IProvider`, `SQLiteCache`, `InMemoryCache`, `NoCache`, `ProviderMeasurement`/stats | `AllProviders.get(chain, timestamp)` resolves the block; batching (multicall) and caching are inside `BatchingAndCachingProvider`, so V2 gets them by using the provider concurrently |
| EOA/proxy | `codeIsEOA`, `ProxyDetector.detectProxy(provider, address, manualProxyType?)` | 12 auto + 16 manual detectors; returns `type`, `values` (`$implementation`, `$admin`, `$members`…), `addresses` (proxy+impls), `deployment` |
| Sources | `SourceCodeService.getSources(provider, addresses, manualSourcePaths)` | returns `name`, `isVerified`, merged `abi`, per‑address `abis`, `sources[]` with per‑source flattening hash |
| Flattening/hashing | `flattenStartingFrom`, `contractFlatteningHash`, `getHashToBeMatched`, `sha2_256bit` | flattened text feeds solc and `.flat/` |
| Value formatting | `asStructured`, `toAddressArray`, `get$Implementations`, `get$Admins` | see §3.8 for parity rules |
| Output | `Analysis` type, `toDiscoveryOutput`, `saveDiscoveredJson`, `flattenDiscoveredSources`, `generateStructureHash`, `TemplateService` (only as a parameter to `toDiscoveryOutput`) | V2 produces V1's `Analysis[]` and reuses V1's writer, which is the strongest compatibility lever available |
| Benchmark | `diffDiscovery`, `EntryParameters`, `DiscoveryOutput` | used by the comparison tool |

### 1.2 Exports to add to `packages/discovery/src/index.ts` (additive only)

`toContractValue` (`handlers/utils/toContractValue.ts`), `prefixAddresses` (`utils/prefixAddresses.ts`),
`recalculateSourceHashes` and `getHashForMatchingFromSources` (`flatten/utils.ts`), `getImplementationNames`
(`source/getDerivedName.ts`), `orderLogs`‑style log ordering if we want byte‑identical event ordering
(otherwise reimplemented: sort by `blockNumber`, then `logIndex`). All are pure functions with tests.

### 1.3 Facts stage: built new and small, ideas taken from three places

No code is copied from `spike/queryable-facts-v2`. Its generic AST‑as‑facts encoding (1M base rows for
Zora) and 1,000‑line rule library were built for a different question (who can change what, across
contracts, without reading source) and turned out not to help the AI. The shape we want is the one the
teaching prototype in `queryable-facts/` settled on: a handful of relations, a handful of rules, artifacts
saved per run for replay, and the source itself available to the model. What we take from where:

- From `queryable-facts/` (teaching prototype): the pipeline shape (`src/pipeline.mjs`: compile → emit
  facts → Soufflé → read derived TSV → present), the discipline of emitting only observations the rules
  need, and the propagation rules in `rules/03-entry-writers.dl` (`potentialWrite` fixpoint through
  internal calls, `entryPoint`).
- From `packages/l2b/src/commands/FlattenerValidator.ts` (production code in this repo): compiler
  selection. It compiles the *flattened* source with the explorer's exact compiler version
  (`ContractSource.solidityVersion`, e.g. `v0.8.16+commit.07a7930e`) through `useSolidityCompiler` from
  `@ethereum-sourcify/compilers`, which downloads and caches native binaries under `cache/solc/` (and
  soljson under `cache/soljson/`), and caches the output in the discovery cache. V2 mirrors those ~40 lines
  with a different `outputSelection` (`ast` + `storageLayout`). No pragma parsing on the main path.
- From `workspaces/analyze/analyzers/shared/solc.py` and the spike's `compile.ts`: the fallback only.
  When the explorer gives no version (Blockscout sometimes returns an empty string) or the exact version
  fails, resolve the `pragma solidity` constraints to the newest release that satisfies all of them,
  preferring an already‑cached binary. ~60 lines with `semver`.

The relations and rules themselves are written for this task (§3.5): how each storage variable can be
read, which externally callable functions can write it, and which events those writers emit. The spike
and the prototype both spend their later layers on cross‑contract snapshot references, which V2 does not
need.

## 2. Architecture

```
config.jsonc ──► ConfigReader ──► initialAddresses, maxAddresses, maxDepth, overrides[].proxyType/ignoreDiscovery
                                          │
                       ┌──────────────────▼───────────────────┐
                       │  Engine (BFS queue, per-level Promise.all with a concurrency limit)
                       └──────────────────┬───────────────────┘
        per address                       ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ 1 AddressPreparer (reuse V1)                                                  │
   │   getBytecode → codeIsEOA │ ProxyDetector.detectProxy │ SourceCodeService     │
   │   flattenStartingFrom per code address │ shape hash = getHashToBeMatched      │
   ├───────────────────────────────────────────────────────────────────────────────┤
   │ 2 PlanResolver                                                                │
   │   PlanStore.get(shapeHash) ──hit──► plan                                      │
   │   miss ► FactsStage (solc → facts → Soufflé → dossier)                        │
   │        ► PlanAuthor (Codex): workspace + prompt + schema → plan               │
   │        ► PlanValidator: schema → static → dry run → repair (≤2 rounds)        │
   │        ► PlanStore.put(shapeHash, plan, meta)                                 │
   ├───────────────────────────────────────────────────────────────────────────────┤
   │ 3 PlanExecutor                                                                │
   │   topo-sort steps │ fetch kinds over IProvider │ jq (wasm, worker, prelude,   │
   │   fragments) │ value formatting = V1 rules │ relatives = address-shaped values│
   ├───────────────────────────────────────────────────────────────────────────────┤
   │ 4 → V1 `Analysis` object (values = proxy.values ∪ plan values, errors, abis,  │
   │     sourceBundles, implementationNames, deployment)                           │
   └───────────────────────────────────────────────────────────────────────────────┘
                                          ▼
        toDiscoveryOutput (reuse) ──► discovered.json (+ V2 extras) ; flattenDiscoveredSources ──► .flat/
                                          ▼
        Benchmark: V1 discovered.json vs V2 output at the same timestamp/blocks
```

Module map (`packages/discovery-v2/src/`):

```
cli.ts                      cmd-ts entry: discover | plan | execute | facts | benchmark | doctor
config/                     CLI options → RunConfig; output paths; tool discovery (souffle, codex)
engine/Engine.ts            BFS loop, limits, concurrency, progress logging
engine/AddressPreparer.ts   EOA/proxy/sources/flatten/hash (thin wrapper over V1 pieces)
engine/toAnalysis.ts        assembles V1 `Analysis`
plan/schema.ts              plan types + `@l2beat/validate` schema; JSON schema generation for Codex
plan/validate.ts            static checks (refs, ABI membership, cycles, literals, jq compile)
plan/PlanStore.ts           `_plans/<hash>/plan.json` + `meta.json`
executor/Executor.ts        DAG scheduling, step runners, limits, error collection
executor/fetch/{call,storage,logs,constructorArgs,hardcoded}.ts
executor/format.ts          toContractValue → prefixAddresses → asStructured parity
executor/relatives.ts       address extraction, exclusions
executor/assert.ts          evidence steps: run assertions, collect checks per field
jq/JqRuntime.ts             jq-wasm in a worker_thread with timeout; prelude + fragments; one-output rule
jq/prelude.jq               helpers (formatSeconds, undecimal, lookupOrKey, chainPrefix, gt, bytes32ToString, bytesToString)
jq/fragments/*.jq           openzeppelin/accessControl, …  (each with a header comment: input/output contract)
facts/compile.ts            explorer version → useSolidityCompiler (as l2b FlattenerValidator); pragma fallback
facts/emit.ts               compact AST → task-specific relations (TSV), one construct per fixture
facts/souffle.ts            spawn souffle -F facts -D derived rules.dl; read TSV
facts/rules/acquisition.dl  aliases, writes through calls/params/modifiers, entry writers, candidate events, references, unsupported flags
facts/Dossier.ts            derived relations + ABI + storage layout + getter preview → dossier JSON
ai/PlanAuthor.ts            interface + CodexPlanAuthor (spawn codex exec), workspace layout, recording
ai/prompt.ts                prompt assembly; PLAN_FORMAT.md is a checked-in file
ai/repair.ts                validation ladder + repair loop
ai/isolation.ts             no-shell vs bwrap modes, temp workspace, command audit from the --json event stream
output/write.ts             toDiscoveryOutput + V2 extras + .flat + run.json
benchmark/{correspond,compare,report}.ts   V1 field → acquisition source, correspondence with V2 steps, agreement classes, reports
```

## 3. Stage details

### 3.1 CLI, configuration, paths

Commands (cmd‑ts, same style as V1):

- `discover <project> [--timestamp T | --dev | --block N] [--max-addresses N] [--max-depth N]
  [--concurrency N] [--out DIR] [--in-place] [--no-ai] [--reauthor] [--only <chain:address>...]
  [--model M] [--effort E] [--stats]`
  - `--dev` = V1 semantics: use the timestamp saved in the project's committed `discovered.json`. This is
    the benchmark mode; the engine asserts that `usedBlockNumbers` equal V1's and aborts otherwise.
  - Default output: `<dirname(paths.cache)>/discovery-v2/<project>/` (gitignored: `packages/config/cache/`).
    `--in-place` writes into the project folder (only for the eventual switch‑over; refuses unless `--force`).
  - `--no-ai`: fail an address whose plan is missing instead of authoring (deterministic reruns).
- `plan <chain:address> [--timestamp T]` authors and validates a plan for one address, prints it.
- `execute <plan.json> <chain:address> [--timestamp T]` runs a plan file, prints values/errors.
- `facts <chain:address> | <file.sol>` prints the dossier (and writes the run folder).
- `benchmark <project> [--v2 DIR]` compares V1 vs V2 (§6).
- `doctor` checks node ≥ 22, `souffle` (runs a 3‑row program), solc download/cache, `codex --version` and
  login status, `jq-wasm` loads. Same idea as `queryable-facts/src/doctor.mjs`.

Environment: RPC/explorer variables as V1 (`<CHAIN>_RPC_URL[_FOR_DISCOVERY]`, `ETHERSCAN_API_KEY`, …) read
through `getChainConfigs()`; `SOUFFLE_BIN`, `CODEX`, `DISCOVERY_V2_MODEL` (default `gpt-5.6-sol`),
`DISCOVERY_V2_EFFORT` (default `high`), `SOLC_CACHE_DIR` (default `packages/config/cache/solc/`).

Logging: `Logger` from `@l2beat/backend-tools`, one line per address like V1 (`↓depth n/total address Name`,
then `P proxyType`, `A plan <hash8> (cached|authored:attempts)`, `R relative`, `E field – error`).

### 3.2 Engine loop

- Queue of `ChainSpecificAddress` seeded from `initialAddresses`; `seen` set; levels processed with
  `Promise.all` under a semaphore (`--concurrency`, default 4; 1 for readable debugging). Stops when the
  queue is empty, or `maxAddresses` (config, default from config, CLI override) or `maxDepth` is reached;
  skipped addresses are counted and reported like V1's banner.
- Per‑chain providers via `allProviders.get(chain, timestamp)`; multi‑chain projects (Scroll has `eth:` and
  `scr:` initial addresses) work because relatives carry their chain prefix.
- Honoured config knobs in phase 1: `initialAddresses`, `maxAddresses`, `maxDepth`,
  `overrides[addr].ignoreDiscovery`, `overrides[addr].proxyType` (manual proxy hint), `names`/descriptions
  through the reused `toDiscoveryOutput` colorization. Everything else in `config.jsonc` is ignored
  (documented in `run.json`).
- No re‑analysis/reachability pruning (V1 needs it because templates suggested by referrers can change
  results). V2 is single‑pass.
- Per‑address failure policy: an exception in preparation (RPC/explorer) fails the run (as V1); a failure
  in facts/AI/plan yields an entry with proxy values only and `errors['@plan'] = reason`; a failing step
  yields `errors[field]`. BFS continues with whatever relatives exist.

### 3.3 Address preparation (reuse)

Exactly V1's `AddressAnalyzer` prefix, without templates/handlers:

1. `getBytecode` → `codeIsEOA` → EOA entry (`type: 'EOA'`, no values).
2. `ProxyDetector.detectProxy(provider, address, overrides.proxyType)` → `proxy.type`, `proxy.values`,
   `proxy.addresses` (self + implementations), `proxy.deployment`.
3. `SourceCodeService.getSources(provider, proxy.addresses, {})` → `name`, `isVerified`, `abi`, `abis`,
   `sources[]` (with `hash` per source).
4. Flattened text per code address via `flattenStartingFrom(name, rootFile, files, remappings)` (V1's
   `.flat` writer does the same; we need the text earlier for solc).
5. Shape hash = `getHashToBeMatched(recalculateSourceHashes(sources))`: the implementation's hash for
   proxy+impl, the combined hash for diamonds, the single hash otherwise. Same key V1 uses for `shapes.json`,
   so plan reuse mirrors template reuse. Unverified → no hash → no plan (`unverified: true`, proxy values only).

### 3.4 Plan store

`packages/config/src/projects/_plans/<shapeHash>/plan.json` and `meta.json`, committed to git (like
`_templates/`). `meta.json`: contract name, first address/chain seen, model, effort, attempts, validation
summary, fragment versions, created/updated timestamps, `sourceHashes` array, dossier status. AI transcripts
are **not** committed; they go to `packages/config/cache/discovery-v2/ai/<shapeHash>/attempt-N/`.

Lookup by shape hash; miss → author. `--reauthor` forces re‑authoring for `--only` addresses. A source change
produces a new hash, so the old plan is simply unused (a later cleanup command can list orphans, like
`l2b find-unused-shapes`).

The shape hash is a **candidate key**, not a complete identity. Inherited from V1, it omits the proxy's own
source when implementations exist, strips a leading `pragma` line, and ignores compiler settings. That is
acceptable for what a plan touches (the implementation's ABI and storage layout; proxy state comes from
`ProxyDetector`), and it is what makes plans reusable across proxy variants, exactly as templates are. Two
safeguards make reuse safe anyway:

- **Applicability check on every reuse.** Before a cached plan is executed at an address, the validator's
  static checks run again against *this* entry: every `method`/`event` must exist in this entry's merged ABI;
  storage steps carry an `expects` record (variable name and type at that slot/offset, taken from the
  `storageLayout` at authoring time) that must match this entry's layout; fragments must be present at the
  recorded version. A failed check marks the entry `planStatus: 'inapplicable'` with the reason and the entry
  keeps proxy values only. A candidate is never applied silently.
- **Provenance.** The output records `planHash` = sha256 of `plan.json` plus the exact text of the prelude
  and every fragment the plan uses. Editing a plan under the same shape hash changes `planHash`, so two runs
  can be told apart, as `usedTemplates` hashes do for V1.

Deviation from the request ("persisted next to the project's config"): a global, hash‑keyed store gives
cross‑project reuse (GnosisSafe, OZ Timelock, OP stack contracts appear in dozens of projects), which
templates already exploit; a per‑project store would re‑author the same code per project. If per‑project
overrides turn out to be needed, add `<project>/plans/<hash>.json` with precedence over the global store.

### 3.5 Facts stage

Input: one flattened `.sol` per code address (proxy and implementations compiled separately; the dossier is
built for the implementation(s), the proxy contributes only its ABI). Steps:

1. **Compile** (`facts/compile.ts`): `useSolidityCompiler(cache/solc, cache/soljson, source.solidityVersion,
   input)` with the flattened text as the single source, the explorer's `compilerSettings`/`remappings`/
   `libraries` mapped exactly as `FlattenerValidator.createCompilerInput` does, and `outputSelection`
   `{ '*': { '': ['ast'], '*': ['storageLayout'] } }`. Output cached in the discovery cache under a key
   derived from input + version (same scheme as l2b). Fallbacks, in order: pragma‑resolved newest
   satisfying version (§1.3); original multi‑file sources instead of the flattened text; give up with
   `factsStatus: 'compile-failed'` and the compiler message. Vyper (`solidityVersion` starts with `vyper`)
   and pre‑0.4.10 sources have no facts. `storageLayout` exists from solc 0.5.13; older contracts get
   `slot: null` and the AI is told storage reads are unavailable for them.
2. **Emit** (`facts/emit.ts`, one pass over the compact AST). Only observations the rules use, each construct
   added with its own fixture (§5) rather than against a size target;
   no generic `child`/`attr` dump. Every id is a solc AST node id; the emitter also records the enclosing
   function of each interesting node so no containment relation is needed:

   | Relation | Meaning |
   | --- | --- |
   | `contract(id, name, kind, abstract)` | ContractDefinition |
   | `linearizedBase(id, baseId, order)` | `linearizedBaseContracts` |
   | `fn(id, contractId, name, kind, visibility, mutability, selector)` | functions, constructors, fallback/receive and modifiers (`kind = modifier`); `selector` from the AST's `functionSelector` when present |
   | `override(fnId, baseFnId)` | from `baseFunctions` (virtual dispatch over‑approximation) |
   | `modifierInvocation(fnId, modifierId)` | modifiers can write (`nonReentrant` writes `_status`) |
   | `stateVariable(id, contractId, name, type, visibility, mutability)` | `mutability`: constant / immutable / mutable |
   | `storageSlot(contractName, varId, slot, offset, type)` | solc `storageLayout`, verbatim |
   | `storageParam(fnId, index, paramId)` | parameters with `storageLocation = storage` (library/internal helpers) |
   | `storageAlias(localId, fnId, baseDeclId)` | `T storage x = <expr rooted at a state var / alias / storage param>` and later re‑assignments of such locals |
   | `write(nodeId, fnId, targetDeclId, kind)` | LHS root of `=`, compound assignment, `++/--`, `delete`, and `.push/.pop` on storage arrays, resolved through IndexAccess/MemberAccess chains to the root declaration (state var, alias or storage param) |
   | `call(nodeId, fnId, calleeFnId)` | FunctionCall whose callee resolves to a FunctionDefinition (plain, `Lib.f`, `super.f`, using‑for receivers) |
   | `callArg(callNodeId, index, argRootDeclId)` | arguments whose root is a storage declaration; using‑for receivers become argument 0 and explicit arguments shift by one |
   | `emit(nodeId, fnId, eventId)` and `event(id, contractId, name)` | EmitStatement → EventDefinition |
   | `read(nodeId, fnId, declId)` | Identifier references to storage declarations that are not write targets |
   | `initializer(varId)` | state variable with an inline initializer (written at deployment without any function) |
   | `unsupported(fnId, kind)` | constructs the analysis does not follow, per function: `asm-sstore`, `asm-delegatecall`, `delegatecall`, `external-call` (call on an address/contract-typed expression), `function-pointer` (callee not resolvable), `try-catch` |

3. **Soufflé** (`facts/rules/acquisition.dl`, `-j1`, 60 s timeout). Rules, in prose:
   `base(X, V)` resolves aliases to state variables transitively; `writesDirect(F, V)` from `write` via `base`;
   `writesParam(G, I)` when a function writes (or forwards) its storage parameter; `writesDirect(F, V)` also when
   `F` calls `G` passing `V` at a written parameter index (this is how OpenZeppelin `EnumerableSet`,
   `Checkpoints` and role bookkeeping actually write); `calls(F, G)` from `call`, `override` and
   `modifierInvocation`; `potentialWrite(F, V)` as the fixpoint through `calls`; `entry(F)` for public/external
   functions, fallback and receive; `entryWrite(E, V)`; `emits(F, Ev)` with the same fixpoint;
   `varEvent(V, Ev)` = events emitted by entry writers of `V` (candidates for observing changes of `V`, to be
   confirmed in source); `references(F, V)` for view/pure entries whose body references `V`;
   `entryUnsupported(E, kind)` = an entry reaches a function with an unsupported construct, and
   `varUnsupported(V)` = some writer of `V`, or some function reachable from an entry, is unsupported.
   Precise claims only: the writer list is *complete for the supported constructs*; where `varUnsupported`
   holds, the dossier says "may have unlisted writers"; a referencing function is not claimed to *return*
   `V`; a candidate event is not claimed to fire on every change; constructor and initializer writes are
   listed separately because they decide whether events can reconstruct state at all.
   The prototype measured 80 ms of Soufflé start‑up plus negligible evaluation at this fact volume; the
   rules could be a TS fixpoint, but Soufflé keeps them declarative and inspectable, and the derived TSVs are
   saved next to the facts for replay (`souffle -F facts -D derived acquisition.dl`).
4. **Dossier** (`facts/Dossier.ts`) joins derived relations with the ABI (signatures, parameter names,
   event definitions; joined by selector) and the getter preview, and writes `dossier.json`:

```jsonc
{
  "contract": { "name": "L1Timelock", "solc": "0.8.16", "inherits": ["TimelockController", "AccessControl", …] },
  "analysis": {
    "status": "ok",                                       // ok | compile-failed | no-storage-layout
    "claims": "writers are complete for the supported constructs only; see unsupported[] per variable; candidateEvents are emitted somewhere in a writer, not proven to fire on every change; referencedBy lists view functions that mention the variable, not functions proven to return it"
  },
  "stateVariables": [
    {
      "name": "_minDelay", "type": "uint256", "slot": 2, "offset": 0, "visibility": "private",
      "mutability": "mutable", "kind": "scalar",           // scalar | mapping | array | struct
      "publicGetter": null,
      "referencedBy": ["getMinDelay()"],
      "writers": [ { "entry": "updateDelay(uint256)", "how": "direct", "line": 412 } ],
      "initialization": [ { "where": "constructor", "line": 96 } ],
      "candidateEvents": ["MinDelayChange(uint256 oldDuration, uint256 newDuration)"],
      "unsupported": []
    },
    {
      "name": "_roles", "type": "mapping(bytes32 => RoleData)", "slot": 0, "visibility": "private",
      "mutability": "mutable", "kind": "mapping", "publicGetter": null,
      "referencedBy": ["hasRole(bytes32,address)", "getRoleAdmin(bytes32)"],
      "writers": [ { "entry": "grantRole(bytes32,address)", "how": "through storage reference", "line": 210 }, … ],
      "initialization": [ { "where": "constructor", "line": 101 } ],
      "candidateEvents": ["RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)", "RoleRevoked(…)", "RoleAdminChanged(…)"],
      "unsupported": [ { "entry": "execute(…)", "kind": "external-call", "line": 300 } ]   // a writer path contains a construct the analysis does not follow
    }
  ],
  "events": [ { "signature": "RoleGranted(bytes32,address,address)", "params": [ … indexed flags … ] } ],
  "functions": { "viewNoArgs": ["getMinDelay()", …], "viewWithArgs": ["hasRole(bytes32,address)", …], "mutating": ["schedule(…)", …] },
  "constants": [ { "name": "PROPOSER_ROLE", "value": "keccak256(\"PROPOSER_ROLE\")", "getter": "PROPOSER_ROLE()" } ],
  "deployment": { "proxyType": "immutable", "pastImplementations": 0 },   // from ProxyDetector; >0 means event history may predate this code
  "preview": { "block": 25789575, "getMinDelay()": "0", "PROPOSER_ROLE()": "0xb09a…", "admin()": { "reverted": true } }
}
```

Two different cache lifetimes are involved and are kept apart:

- **Static facts** (compile output, base facts, derived relations, and the dossier *without* `deployment` and
  `preview`) depend only on the source, so they are cached under `cache/discovery-v2/facts/<sourceHash>/`
  and never recomputed for the same hash.
- **State** (`preview`, `deployment`) depends on chain, address and block. The harness produces it at
  authoring time for the address being analyzed: all 0‑arg view/pure functions with outputs in the ABI are
  called once at the target block (V1's `SimpleMethodHandler` makes the same calls, so in benchmark mode they
  are cache hits), and `ProxyDetector`'s result is summarized. Two deployments of the same code get different
  previews. The preview is prompt input only; what gets fetched is decided by the plan (§3.7).

Dossier size is capped (≈60 KB; long lists truncated with counts); full source is available in the AI
workspace.

### 3.6 AI authoring

`PlanAuthor` interface: `author(input: AuthorInput, attempt: number, feedback?: ValidationReport):
Promise<{ plan: unknown; raw: string; usage?: … }>`. First implementation `CodexPlanAuthor`; a
`ClaudePlanAuthor` (`claude -p --output-format json`) is a later drop‑in since the bake‑off harness already
drove both. Tests use a `ScriptedPlanAuthor`.

Workspace per attempt (`cache/discovery-v2/ai/<hash>/attempt-N/workspace/`): `sources/<Name>.sol` (flattened,
one per code address), `abi.json`, `dossier.json`, `PLAN_FORMAT.md` (the checked‑in spec, §3.7),
`fragments/*.jq`, `prelude.jq`, `examples/` (two or three checked‑in exemplary plans). The prompt (stdin)
contains the task, the dossier inline, the ABI inline, the format spec inline, and instructions to read the
sources from the workspace when needed. Sources are not pasted into the prompt: a flattened OP‑stack file is
100–300 KB and the bake‑off showed prompt hygiene matters more than volume.

Codex invocation (from `queryable-facts/src/ask.mjs` and the spike's `agent.ts`): `codex exec
--ignore-user-config --ephemeral --skip-git-repo-check --sandbox read-only --color never --model M
-c model_reasoning_effort=E -c project_doc_max_bytes=0 -c web_search="disabled" -c features.multi_agent=false
--output-schema schema.json --output-last-message response.json -` with `cwd = workspace`, stdin = prompt,
timeout 15 min, SIGKILL on timeout, stdio to files. Whether the shell tool is enabled depends on the
isolation mode described below.
Every attempt records `prompt.md`, `schema.json`, `response.json`, `cli.log`, `validation.json`.

What the AI must **not** see in benchmark mode: the project's V1 `discovered.json`, `config.jsonc` field
definitions, templates. The workspace is built only from chain data and V2's own files. (The jq fragments
encode OZ AccessControl knowledge that templates also encode; that is disclosed in the benchmark report.)

Setting `cwd` and `--sandbox read-only` does **not** enforce this. Tested on this machine with Codex
0.155: under the read‑only sandbox a command in a temp directory reads any file on disk (network is blocked).
Enforcement therefore comes from V2, in two modes:

- **No‑shell mode (default).** `-c features.shell_tool=false`, as the teaching prototype does. The model has
  no tool at all, so nothing can be read; the flattened source(s) are inlined in the prompt. Used whenever
  the inlined material fits a size budget (default 400 KB of source; the dossier tells which contracts of a
  flattened file matter, so interfaces and unrelated libraries can be dropped first).
- **Isolated‑shell mode** for larger sources: the shell stays on but Codex runs under `bwrap` (available
  here) with only the workspace, the Codex binary and its auth directory mounted, no network namespace.
  Every command the model runs is taken from the `--json` event stream and recorded; a command referencing
  a path outside the workspace fails the attempt in benchmark mode. The workspace itself lives in a temp
  directory outside the repository in both modes.

`--dangerously-bypass-approvals-and-sandbox` is never used.

Instructions to the model (summary of `PLAN_FORMAT.md` §"Authoring rules"): fetch every piece of state a
researcher would want to watch; prefer getters, then storage slots, then events for state without accessors;
name fields after the getter or variable; never embed addresses (plans are per source hash, executed at many
addresses); use `use:` fragments for known patterns; mark large/unbounded collections with `forEach` limits;
state impossibility explicitly in a `notes` array (e.g., "mapping `balances` has no enumeration and no
events; not fetchable").

Validation ladder (`ai/repair.ts`), each stage's errors are fed back verbatim as the repair round input:

1. JSON parses and matches the schema (`@l2beat/validate` schema; the same schema is exported as JSON Schema
   for `--output-schema`).
2. Static: unique step ids; every `$ref` resolves; no cycles; `method`/`events` parse with ethers
   `Fragment.from` and exist in the merged ABI (inline ABI fragments allowed when the ABI is incomplete, e.g.
   proxies with partial explorer ABIs); `forEach` bounds within limits; no `0x` 40‑hex literals except the zero
   address; jq programs compile (jq‑wasm exit code 3 = compile error, distinguished from runtime errors).
   **Getter coverage**: every 0‑argument `view`/`pure` ABI function with outputs must be either the `method` of
   a `call` step or listed in the plan's `skip` map with a reason; every single‑`uint256`‑argument view
   function (V1 treats these as arrays) must be consumed by some step or skipped with a reason. Uncovered
   getters are reported back verbatim (`uncovered: ["version()", "DOMAIN_SEPARATOR()"]`), so completeness of
   the trivial part is enforced deterministically while the plan stays the only source of truth.
   **Naming**: a `call` step whose method is a 0‑arg getter should be named after the function (`getMinDelay`,
   `owner`; a leading `$` becomes `_$` as in V1's `rewriteSolidityIdentifier`); deviations are warnings, not
   errors, because they cost benchmark points, not correctness.
3. Dry run: execute against the chain at the target block with the executor's limits; collect step errors,
   reverts not marked `onRevert`, null results not marked `optional`, jq runtime errors, over‑budget.
   **A passing dry run establishes executability, not correctness.** A plan can read the wrong slot, fold the
   wrong events or return a constant and still execute cleanly. The ladder therefore separates *execution
   status* from *validation evidence*.
4. Evidence: each non‑internal step records how its value is obtained (`evidence: getter | storage | events |
   derived | constructorArgs | hardcoded`). For `events`‑ and `storage`‑derived fields the plan must carry
   `assumes` (plain statements such as "every change to `_roles` emitted RoleGranted/RoleRevoked") and either
   an `assert` step that cross‑checks the value against current getters (e.g. `hasRole(role, member)` for
   every reconstructed member, `getRoleAdmin(role)` for admin roles, `owner()` against an ownership fold) or
   `unverifiable: true` with a reason. Assertions execute with the plan; a failing assertion is recorded per
   field (`checks: { passed, failed }`) and surfaces as an error, so a plausible‑but‑wrong reconstruction is
   visible instead of silent. When `ProxyDetector` reports past implementations, event‑derived fields get an
   automatic `history` caveat: earlier code may have changed the state without these events, and the
   dossier's `initialization` list tells whether constructor writes are covered by events at all.
   Reverting getters are not skipped: `skip` is reserved for structural exclusions (proxy‑only functions,
   EIP‑712 constants); a getter that reverts at the dry run must be included with `onRevert: "null"` or
   `"error"` (V1 parity), because it may start succeeding after initialization or another state change. The
   validator rejects a `skip` whose reason is "reverts".
5. Held‑out application: when `meta.json` knows another address with the same shape, the plan is executed
   there too, and its assertions must pass there as well; static literal checks catch address constants,
   this catches value constants. Up to 2 repair rounds (bake‑off: one round lifted Codex jq from 40 to 42/42
   and Claude jq from 40 to 42). Then persist: `status: ok | partial` with the remaining errors, which surface
   in `discovered.json` `errors`.

Budgets (defaults, all CLI‑tunable): 15 min per attempt, 3 attempts, `maxTokens` unspecified (Codex
controls), per‑run cap on AI invocations (`--max-ai N`, default unlimited but logged).

### 3.7 Acquisition plan format v1

Checked in as `packages/discovery-v2/PLAN_FORMAT.md` + `src/plan/schema.ts`. Phase‑1 subset of the design
discussed earlier (no `fold`, no `native`, five fetch kinds).

```jsonc
{
  "version": 1,
  "contract": "L1Timelock",               // informational
  "notes": ["…"],                         // AI's statements about what is not fetchable and why
  "skip": { "DOMAIN_SEPARATOR()": "EIP-712 constant, not state", "admin()": "proxy-only, reverts for non-admin callers" },
                                          // getters deliberately not fetched; the validator requires every ABI getter to be fetched or skipped
  "steps": {
    "<id>": Step                          // id = output field name unless "internal": true
  }
}
```

Fetch steps:

```jsonc
{ "fetch": "call", "method": "rollupIDToRollupData(uint32)", "args": ["$item"],
  "forEach": { "range": { "start": 1, "count": "$rollupCount" } },      // or {"start":0,"untilRevert":true,"max":100} or {"over":"$ids"}
  "at": "$someAddressStep",                                              // optional; default = the analyzed address
  "onRevert": "error" | "null" | "stop",                                 // default error; "stop" only valid with untilRevert
  "internal": true, "relatives": false, "optional": true, "description": "…" }

{ "fetch": "storage",
  "slot": 5 | "0x…" | "$ref"                                  // a plain slot, or:
        | { "mapping": { "slot": 0, "keys": ["$ref", "0x…"], "keyTypes": ["address", "bytes32"] } }   // nested mappings, keys applied left to right
        | { "array": { "slot": 7, "index": "$item" } },        // dynamic array element; only 32-byte elements in phase 1, others rejected
  "offset": 16,                                                // BYTE offset inside the 32-byte word for packed variables (default 0)
  "as": "address" | "bool" | "uint128" | "int64" | "bytes4" | "bytes32" | "raw",   // sized types; width must fit 32 - offset
  "expects": { "variable": "_lastFinalized", "type": "uint128" } }                // from the storage layout at authoring time; checked on reuse
// Host-side, deterministic: mapping slot = keccak256(pad32(key) ++ pad32(slot)) for value-type keys and
// keccak256(bytes(key) ++ pad32(slot)) for string/bytes keys; array element = keccak256(pad32(slot)) + index.
// keyTypes are restricted to address | bool | uintN | intN | bytesN | bytes32 | string | bytes; anything else is rejected
// by the validator. Packed decoding takes bytes [32 - offset - width, 32 - offset) of the word, as Solidity lays them out.
// The AI never does EVM decoding in jq; the dossier gives slot, offset and type per variable.

{ "fetch": "logs", "events": ["RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)", …],
  "filter": { "role": "0x…" }?, "at": "$ref"? }
// result: [{ event, blockNumber, logIndex, txHash, args }] sorted by (blockNumber, logIndex), args decoded, addresses chain-prefixed

{ "fetch": "constructorArgs" }        // decoded constructor arguments of the implementation, named when the ABI names them
{ "fetch": "hardcoded", "value": … }  // constants the AI wants to expose (rare; V1 uses 144 of these)
```

Derive steps:

```jsonc
{ "from": "$logs", "expr": "reduce .[] as $e ([]; …)" }                         // jq; input = the referenced result
{ "from": ["$rollups", "$rollupCount"], "expr": "…" }                          // input = {rollups: …, rollupCount: …}
{ "from": "$acLogs", "use": "openzeppelin/accessControl", "args": { "names": { "0x…": "PROPOSER_ROLE" } } }  // fragment; args → $args
```

Evidence steps (never output as values; results go to `checks`):

```jsonc
{ "assert": { "from": ["$proposerChecks"], "expr": "all(.proposerChecks[]; . == true)",
              "message": "every event-derived PROPOSER_ROLE member must pass hasRole" } }
```

Any fetch or derive step may carry `assumes: ["…"]` (statements the value depends on) and `unverifiable:
true` with a `reason` when no on‑chain cross‑check exists. The validator requires one of `assert` or
`unverifiable` for every `events`‑ or `storage`‑derived output field (§3.6).

Expressions: jq 1.8 via `jq-wasm`; `$T` is not needed (tables are `args`); `$env` = `{ chain, blockNumber,
timestamp, address }`; prelude helpers as jq `def`s; exactly one output value; `input`, `inputs`, `now`,
`env`, `$ENV`, `debug`, `stderr`, `input_filename`, `halt` are rejected statically (they are meaningless or
side channels here). Runtime limit 5 s and 8 MB output.

Reference syntax: `"$id"` anywhere a value is expected refers to the whole result of step `id`; `"$item"`
inside `forEach`. Dependencies are inferred from references; the executor topologically sorts and runs
independent steps concurrently (which is what makes multicall batching kick in).

Output naming: non‑internal step ids become `values[id]`. There is no shorthand for "all getters": every
getter the plan wants is an explicit `call` step (see §9 for the reasoning), named after the function so
that this class of values comes out with V1's field names.

Worked example, Scroll `L1Timelock` (compare `_templates/scroll/L1Timelock/template.jsonc`; V1 fetches the
eight getters automatically, here they are written out):

```jsonc
{
  "version": 1,
  "contract": "L1Timelock",
  "skip": {},
  "steps": {
    "getMinDelay":         { "fetch": "call", "method": "getMinDelay()", "description": "current minimum delay in seconds" },
    "DEFAULT_ADMIN_ROLE":  { "fetch": "call", "method": "DEFAULT_ADMIN_ROLE()" },
    "TIMELOCK_ADMIN_ROLE": { "fetch": "call", "method": "TIMELOCK_ADMIN_ROLE()" },
    "PROPOSER_ROLE":       { "fetch": "call", "method": "PROPOSER_ROLE()" },
    "EXECUTOR_ROLE":       { "fetch": "call", "method": "EXECUTOR_ROLE()" },
    "CANCELLER_ROLE":      { "fetch": "call", "method": "CANCELLER_ROLE()" },
    "acLogs": { "fetch": "logs", "internal": true,
      "events": ["RoleGranted(bytes32 indexed role,address indexed account,address indexed sender)",
                 "RoleRevoked(bytes32 indexed role,address indexed account,address indexed sender)",
                 "RoleAdminChanged(bytes32 indexed role,bytes32 indexed previousAdminRole,bytes32 indexed newAdminRole)"] },
    "accessControl": { "from": "$acLogs", "use": "openzeppelin/accessControl",
      "assumes": ["every change to _roles since deployment emitted RoleGranted/RoleRevoked/RoleAdminChanged (OpenZeppelin AccessControl; immutable contract, no proxy history)"],
      "args": { "names": { "0x0000…0000": "DEFAULT_ADMIN_ROLE", "0x5f58…6ca5": "TIMELOCK_ADMIN_ROLE", "0xb09a…9cc1": "PROPOSER_ROLE", "0xd8aa…9e63": "EXECUTOR_ROLE", "0xfd64…f783": "CANCELLER_ROLE" } } },
    "getMinDelayFormatted": { "from": "$getMinDelay", "expr": "formatSeconds" },
    "Proposer":  { "from": "$accessControl", "expr": ".PROPOSER_ROLE.members" },
    "Canceller": { "from": "$accessControl", "expr": ".CANCELLER_ROLE.members" },
    "Executor":  { "from": "$accessControl", "expr": ".EXECUTOR_ROLE.members" },
    "timelockAdminAC": { "from": "$accessControl", "expr": ".TIMELOCK_ADMIN_ROLE.members" },

    "accessControlRaw": { "from": "$acLogs", "use": "openzeppelin/accessControl", "internal": true },   // same fold, keys are raw role hashes
    "memberPairs": { "from": "$accessControlRaw", "internal": true,
      "expr": "[to_entries[] | .key as $r | .value.members[] | {role: $r, member: .}]" },
    "memberChecks": { "fetch": "call", "method": "hasRole(bytes32,address)", "internal": true,
      "forEach": { "over": "$memberPairs" },
      "args": [{ "from": "$item", "expr": ".role" }, { "from": "$item", "expr": ".member" }] },
    "membersHaveRole": { "assert": { "from": ["$memberChecks"], "expr": "all(.memberChecks[]; . == true)",
      "message": "every event-derived role member must currently pass hasRole" } }
  }
}
```

Role hash→name tables are the one place where the AI must derive constants: it reads
`keccak256("PROPOSER_ROLE")` in the source and the getter preview gives the value. (A `keccak` jq helper is
an easy addition if that proves brittle.)

### 3.8 Executor

- **Scheduling**: build the DAG from `$refs`; run ready steps concurrently; a step's failure marks its
  dependents as `errors[field] = "dependency <id> failed"` (V1 reports missing references similarly).
- **call**: encode with ethers `Interface` from the merged ABI (or inline fragment); `provider.call`;
  decode → `toContractValue` → `prefixAddresses(longChain)` → `asStructured(value, fragment.outputs)`. This is
  the exact V1 pipeline in `decodeHandlerResults`, so numbers (safe → number, else decimal string), addresses
  (`eth:0x…`) and named structs come out identical. `forEach` expansion runs the calls concurrently (range up
  to 1000 by default; `untilRevert` sequential in chunks of 16 to keep it simple and cache‑friendly).
- **storage**: `provider.getStorage(address, slot)`; `mappingSlot` computed as `keccak256(pad(key) ++ pad(slot))`;
  decode per `as`.
- **logs**: `provider.getLogs(address, [topic0s])` from block 0 to the target block (V1's `EventHandler`
  does exactly this; chunking and caching live in the provider); decode with the event fragments; sort;
  `args` become an object with `prefixAddresses` applied, big numbers as decimal strings (jq has doubles only;
  helpers `gt`/`undecimal` operate on strings as in the bake‑off prelude).
- **constructorArgs**: `ContractSource.constructorArguments` decoded with the ABI constructor (V1
  `ConstructorArgsHandler` logic, ~40 lines, reimplemented).
- **jq**: `JqRuntime` runs `prelude + fragments + program` with `--argjson args … --argjson env …` and
  enforces exactly one output. Evaluation happens in a small pool of **child processes** (not
  `worker_threads`): a runaway program (`def f: f; f`) is killed by timeout, and memory is capped at the OS
  level with `prlimit --as` (Linux; available here), because Node's worker `resourceLimits` do not cover
  WASM linear memory or other external buffers. Input size to a program is capped (default 32 MB
  serialized); a step whose input exceeds it fails before evaluation.
- **Values**: `values = { ...proxy.values, ...planValues }` (V1 order: plan values override proxy values, as
  handler values override proxy values in `AddressAnalyzer`).
- **Relatives**: for every non‑internal step with `relatives !== false`, `toAddressArray(value)` minus
  implementations, beacons and past‑upgrade implementations (V1's `ignoredAddresses`), plus addresses in
  proxy values (V1 includes `proxyResults`). The zero address is excluded explicitly (V1 outputs never
  contain it; `toAddressArray` itself does not filter it, so the filter lives in V2's `relatives.ts`).
- **Limits** (defaults): 200 steps per plan, 1000 iterations per `forEach`, 5000 RPC calls per address,
  100k logs per step, 5 s and 512 MB per jq program, 32 MB jq input. How each is enforced: step and
  iteration counts are checked before issuing requests; the RPC budget is a counter in the executor's
  provider wrapper that rejects the next request once exhausted (requests already in flight complete);
  jq limits are OS‑level on the child process. The logs limit is **not** a hard bound: V1's provider
  fetches the complete log array (chunked internally) and returns it, so the check runs after the fetch and
  bounds what enters jq and the output, not the memory the provider used. That is inherited from V1 and is
  acceptable for phase 1; the mitigation is topic filters (the plan's `filter`) and the per‑step cap, and a
  streaming/limited `getLogs` variant is listed under phase 2. Exceeding a limit is a step error. The
  guarantee is "bounded in the common cases with the residual risks named", not "never a crash".
- **Errors**: message strings in `errors[field]`, neutered by `toDiscoveryOutput` (`neuterErrors`) like V1.

### 3.9 Output and compatibility

V2 assembles V1's `Analysis` objects (`AnalyzedContract`/`AnalyzedEOA`: `address`, `name`, `isVerified`,
`proxyType`, `implementations`, `implementationNames`, `deployerAddress`, `deploymentTimestamp`,
`deploymentBlockNumber`, `values`, `errors`, `abis`, `sourceBundles`, `relatives`, `extendedTemplate:
undefined`) and calls the reused writer: `toDiscoveryOutput(templateService, config, timestamp,
usedBlockNumbers, analyses)` → `saveDiscoveredJson`; `flattenDiscoveredSources(analyses, logger)` → `.flat/`.
Consequences: identical top‑level shape (`name`, `timestamp`, `configHash` = `generateStructureHash(config.
structure)` of the *same* config.jsonc, `entries` sorted by address, `abis`, `usedTemplates: {}`,
`usedBlockNumbers`), identical entry key order (`sortEntry`), identical `.flat` naming (`<Name>.sol`,
`<Name>/<Impl>.p.sol`, `-<address>` suffix on name clashes), config `names`/`description`/`category`
colorization applied.

V2‑specific additions, all optional and namespaced so nothing downstream misreads them: top‑level
`"discoveryV2": { "version": 1, "usedPlans": { "<address>": "<shapeHash>" }, "model": "...", "run": "<id>" }`
and per entry `"plan": "<shapeHash>"` plus `"planStatus": "ok" | "partial" | "missing"`. `fieldMeta.description`
is populated from step `description`s when present (Disco UI ignores `fieldMeta`, the update monitor reads
`severity` only; harmless).

What downstream consumers need (from the code, file references in the research notes):

| Consumer | Reads | V2 phase 1 | Consequence |
| --- | --- | --- | --- |
| Disco UI API (`packages/l2b/src/implementations/discovery-ui/`) | `name`, `entries[]` (`address`, `type`, `values`, `name`, `template`, `errors`, `description`, `implementationNames`, `receivedPermissions`, `proxyType`, `unverified`, `targetProject`), `abis`, `usedBlockNumbers`, `permissions`, `.flat` by entry name | all present except `template`, `receivedPermissions`, `permissions`, `targetProject` | contracts render as "Untemplatized"; no permission chips; nodes reachable only through permissions may drop from the graph (V2 has none) |
| `packages/config` `ProjectDiscovery` | `values` (`$admins`, `$implementations`, `$pastUpgrades`, `$members`, `$threshold`, …), `receivedPermissions`, `category`, `description`, `sinceTimestamp`, `unverified`, `proxyType`, `targetProject` | proxy‑derived `$` values identical (same `ProxyDetector`); no permissions | project TS files that call permission helpers would assert; V2 output is not meant to feed `packages/config` in phase 1 |
| Update monitor (`packages/backend`) | `timestamp`, `configHash` (DB row), `unverified`, `errors`, `ignoreInWatchMode`, `fieldMeta.severity`; structural diff of everything else | not fed by V2 in phase 1 | any new field is a diff; that is why V2 writes to its own folder |
| `TemplateService.discoveryNeedsRefresh` (sync status, `l2b refresh-discovery`, config CI test) | `sourceHashes`, `template`, `configHash`, `usedTemplates` | `sourceHashes`/`configHash` identical; `template` absent; `usedTemplates` empty | would report "new template match" for templated shapes; only matters at switch‑over |

Switch‑over questions (Disco UI pointing at V2 output, permissions, update monitor) are phase 2.

## 4. Performance: what is free, what is deferred

Free by reuse: multicall batching (`BatchingAndCachingProvider` batches `call`s issued in the same tick; the
executor issues independent steps and `forEach` iterations concurrently), SQLite RPC cache keyed by
`chain.invocation.params` (benchmark runs at V1's block hit V1's cached responses; `l2b fetch-discovery-cache`
can pull the production Redis cache), explorer rate limiting, reorg‑safe caching.

Designed for but not tuned in phase 1: per‑level address concurrency (semaphore, default 4), AI authoring
concurrency (default 2, it is the slow stage: minutes per new shape), a jq worker pool. Nothing in the
architecture is per‑address‑sequential except the BFS level boundary, same as V1.

Deferred: prefetching relatives while the AI authors, persistent facts across machines, plan store as a
service.

## 5. Testing

Conventions: mocha + earl (`mockObject<IProvider>` as in `AddressAnalyzer.test.ts`), `*.test.ts` next to
sources, `pnpm test` in the package; biome lint/format; `tsc --noEmit` typecheck.

Unit tests (no network, no external tools):

- `plan/schema` + `plan/validate`: accept/reject fixtures (bad refs, cycles, unknown method, address literal,
  jq compile error, forEach over limit).
- `executor`: DAG ordering, dependent failure propagation, `forEach` range/over/untilRevert, `onRevert`
  modes, call/storage/logs/constructorArgs/hardcoded against `mockObject<IProvider>`; value parity tests that
  run V2 formatting and V1's `decodeHandlerResults` path on the same ethers `Result` fixtures and assert
  deep equality (addresses, big numbers, structs, nested arrays).
- `jq/JqRuntime`: the 42 bake‑off cases ported as fixtures (Blip‑oracle expected values already in
  `expr-bakeoff/cases.json`), prelude helper parity with V1 type casters (`FormatSeconds`, `Undecimal`,
  `Mapping`, `ChainPrefix`, `GreaterThan`, `Bytes32ToString`, `BytesToString`) on their existing test
  vectors, one‑output enforcement, timeout kill, forbidden builtins.
- `jq/fragments`: `openzeppelin/accessControl` on the recorded Scroll timelock logs (already a fixture in
  `expr-bakeoff/fixtures-rolelogs.json`) equals V1's `AccessControlHandler` output.
- `engine`: BFS with a scripted preparer/executor: limits, dedupe, multi‑chain, ignoreDiscovery, failure policy.
- `plan/PlanStore`: layout, meta, hash lookup, reauthor.
- `ai/repair`: ladder with a `ScriptedPlanAuthor` (first attempt invalid, second valid; exhausted attempts →
  `partial`); getter coverage feedback (uncovered getters listed, `skip` honoured, uint256 array getters
  flagged); prompt snapshot tests.
- `facts/emit`: checked‑in solc AST JSON fixtures (small contracts covering direct writes, index/member
  writes, `push`/`delete`, storage aliases, library storage params with using‑for, modifiers that write,
  overrides, emits, assembly) → expected TSV rows. Fixtures are generated once with the real compiler and
  committed, so the tests need neither solc nor Soufflé.
- `facts/rules`: the same fixtures through Soufflé → expected `entryWrite`/`varEvent`/`references`/`varUnsupported` rows
  (env‑gated, see below), plus a TS re‑implementation of the fixpoints used only in tests to cross‑check the
  Datalog on the fixtures.
- `facts/Dossier`: from checked‑in derived TSV fixtures + ABI → expected dossier JSON.
- `benchmark/compare`: synthetic V1/V2 pairs with known recall/precision.

Integration tests with recorded chain data (deterministic, no RPC):

- `FixtureCache implements DiscoveryCache` backed by a JSON file; record mode copies the keys a run touched
  from the SQLite cache. Golden tests execute hand‑written plans (L1Timelock, PolygonRollupManager arrays,
  a GnosisSafe, an EIP‑1967 proxy) end to end through `AllProviders` with the fixture cache and a stubbed
  block‑number lookup, asserting `values` equal the committed V1 `discovered.json` entries for those addresses.

Environment‑gated tests (`DISCOVERY_V2_TOOLS=1`; skipped in CI, which has no Soufflé):

- facts pipeline on small fixture contracts (compile with two solc versions, emit, Soufflé, dossier);
- `doctor`.

Live smoke (manual, `DISCOVERY_V2_LIVE=1`): `plan eth:0x826714adD4dDA2b8750794A467C892c0Cd49216b` (Scroll
TimelockEmergency) authors a plan whose executed values match V1's entry.

Held‑out generalization stays a permanent check in the validator: a plan authored for shape H is dry‑run at
the *second* address with that shape when one is known (from `meta.json`), catching address‑specific constants
the static literal check missed.

## 6. Benchmark

Protocol:

1. Pick project P with a committed `discovered.json` (timestamp T, `usedBlockNumbers` B).
2. `discovery-v2 discover P --dev` (T from the file). Abort unless V2's resolved blocks equal B.
3. `discovery-v2 benchmark P` reads both files and writes `benchmark.json` + `benchmark.md` into the V2 output
   folder.

Canonicalization `c(v)`: addresses lower‑cased with chain prefix kept; numbers → decimal strings; booleans;
strings as is; arrays keep order; objects key‑sorted. Proxy‑derived `$…` keys are excluded from value metrics
(identical by construction) and reported separately as a sanity check.

Metrics, in two tiers. The headline measures are based on **field correspondence**, not on value
coincidence; the overlap figures are descriptive only.

Headline (per project, per contract, and grouped by V1 handler type and template):

- **Address recall** `|A_V1 ∩ A_V2| / |A_V1|`, extra addresses `|A_V2 \ A_V1|`, by entry type.
- **Acquisition‑task correspondence.** Every V1 field is resolved to its acquisition source by loading the
  project's V1 config and template through `ConfigReader`/`TemplateService`: system getter → method name;
  `call`/`array` → method (+ length source); `storage` → slot/offset; `event`/`eventCount` → event set;
  `accessControl` → the OZ role pattern; `constructorArgs`; `hardcoded`; bespoke handlers by name. Every V2
  output field has the same information in its step (`method`, `slot`, `events`, `use`, `fetch`). A V1 field
  and a V2 field **correspond** when their sources match (getter name, same method with a `forEach`, same
  slot/offset, same event set or fragment), independent of field names and values. **Task recall** = share
  of V1 fields with a corresponding V2 field. Uncorresponded V1 fields are the actionable miss list, grouped
  by handler type and template.
- **Value agreement** on corresponded pairs: `equal` (canonical deep‑equal), `formatting‑only` (equal after
  undoing `FormatSeconds`/`Undecimal`/casing, or equal as unordered sets), `different`. Every `different`
  pair on a non‑trivial field (arrays, events, storage, derived) is listed for manual inspection; those are
  where plausible‑but‑wrong plans show up.
- **V2‑only fields**: fields with no V1 counterpart, listed, not scored. Some are noise, some are things
  researchers never encoded; the benchmark report samples them for a human verdict rather than calling them
  precision.

Descriptive (reported, not used as a success measure):

- **Name‑agnostic value overlap** with one‑to‑one matching: canonical values grouped, matched count per group
  = `min(count_V1, count_V2)`, so ten V1 zeros are not "recovered" by one V2 zero. **Named overlap**: same
  name and equal value. **Leaf overlap**: one‑to‑one over primitive leaves. Low‑information values (`0`,
  `false`, `""`, the zero address, `[]`, `{}`) are excluded from these figures and counted separately.
- Errors per contract, assertion failures, AI attempts and wall time per new shape, plan reuse rate, RPC
  calls (provider stats), total run time, compile‑failure rate of the facts stage.

Projects: start with **scroll** (OZ timelocks, Safes, custom rollup, two chains) and **zora** (OP stack,
heavily templated, the spike's reference corpus); then **polygon-cdk** (arrays/mappings), **taiko**, **linea**.
List in `benchmarks/projects.json`. Aggregate table across projects in `benchmarks/README.md`.

Fairness rules: no V1 outputs reachable by the AI, enforced by the no‑shell or `bwrap` isolation modes and
the command audit (§3.6), with the mode used recorded in `benchmark.json`; plans committed so results are
reproducible with `--no-ai`; the same block; note that fragments encode known patterns.

## 7. Milestones and acceptance criteria

Effort figures are rough working estimates, not commitments.

The order proves the product's central loop first (source → AI‑authored plan → execution → deterministic
replay) on a few contracts, then widens to whole projects, then adds the facts stage as an authoring aid
whose value can be measured as an ablation.

- **M0 — skeleton (½ day).** Package files, `cli.ts` with `doctor`, imports from `@l2beat/discovery` compile,
  `pnpm build/typecheck/lint/test` green, added V1 exports.
- **M1 — plan format + executor + jq (3–4 days).** Schema, validator (static checks, coverage, evidence
  rules), executor with the five fetch kinds, `forEach`, packed storage decoding, `assert` steps,
  `JqRuntime` in child processes, prelude, `openzeppelin/accessControl`; `execute` command. Three
  hand‑written plans as the fixed test bed: a scalar‑getter contract (Scroll `L1Timelock` getters), a
  dynamic array with a length getter (`PolygonRollupManager`), and event‑derived membership with a
  `hasRole` assertion (the same timelock). Golden tests replay them through the fixture cache; values equal
  the committed V1 entries (formatting classes noted).
- **M2 — AI authoring vertical slice (3–4 days).** `CodexPlanAuthor` with both isolation modes, workspace,
  prompt, ladder, repair, `PlanStore` with applicability check and `planHash`; `plan` command. Input to the
  model is ABI + flattened source + the state part of the dossier only (getter preview, deployment); no
  Soufflé yet. Acceptance on the same three contracts: the authored plans pass validation, execute at the
  V1 block with values equal to V1's for corresponded fields, replay deterministically with `--no-ai`,
  apply at a **second deployment of the same shape** (another Scroll timelock) with assertions passing, and
  execute at a **later block** with the expected changes. This is the go/no‑go for the approach.
- **M3 — project traversal + output (1–2 days).** Engine BFS, limits, multi‑chain, `Analysis` assembly,
  `toDiscoveryOutput`, `.flat/`, `run.json`. `discover scroll --dev --no-ai` first with plans missing
  (proxy values only; `usedBlockNumbers` equal V1's; every V2 address exists in V1's file), then with
  authoring enabled: a full Scroll run end to end.
- **M4 — benchmark tooling (2–3 days).** Field correspondence, value agreement, overlap figures, reports;
  scroll and zora with ABI‑and‑source‑only authoring. These are the baseline numbers.
- **M5 — facts stage, incrementally (3–4 days, then ongoing).** `compile.ts` mirroring l2b, `emit.ts` one
  construct at a time with fixtures (direct writes → index/member writes → aliases → library storage params
  → modifiers/overrides → emits → unsupported flags), `acquisition.dl`, `Dossier.ts`, `facts` command;
  compile‑failure report over Scroll. Acceptance is the ablation: re‑author the benchmark projects with the
  full dossier and compare task recall and value agreement against M4. If the dossier does not move the
  numbers, it stays small.
- **M6 — widen (ongoing).** Three more projects, prompt/fragment tuning driven by the uncorresponded‑field
  list and the `different` list, write‑up.

Phase 2 candidates, in the order the benchmark is likely to demand them: declarative `fold`, `transaction`/
`trace` fetch kinds (Arbitrum/Polygon scheduled transactions handlers), `keccak` helper, packed array
elements and struct members in `storage`, a bounded/streaming `getLogs` so the logs limit holds before the
fetch, multi‑address plans, permissions, Disco UI switch, update‑monitor integration.

## 8. Risks and mitigations

- **Soufflé is a system dependency** (2.5 tested). Mitigation: `doctor`, clear failure, facts optional (AI
  gets ABI + source + preview without a dossier; `factsStatus` recorded), env‑gated tests, CI does not need it.
- **solc coverage**: the explorer's exact version is used, so failures are rare (l2b's flattener validator
  already compiles flattened sources this way); native binaries exist from 0.4.10; older or Vyper contracts
  have no facts; `storageLayout` only from 0.5.13. Mitigation: fallbacks in §3.5, and the compile‑failure
  rate per project is a benchmark line.
- **Facts are incomplete by construction**: writes through function pointers, `delegatecall`, unresolvable
  external calls and assembly are not followed, so a writer list can miss writers; virtual dispatch is
  widened through `override`. Mitigation: unsupported constructs are recorded per function and propagated
  to entries and variables (`varUnsupported`), the dossier states exactly what each list does and does not
  claim, and the AI reads the source. The facts are authoring hints. Correctness evidence comes from
  assertions and getter cross‑checks at execution time, and a dry run alone is only evidence of
  executability.
- **Event‑derived state can be wrong while executing cleanly**: an earlier implementation or a constructor
  may have changed state without the events the plan folds, and logs from block zero do not prove
  completeness. Mitigation: mandatory `assumes` plus `assert` or `unverifiable` on such fields, `hasRole`‑style
  cross‑checks where getters exist, an automatic `history` caveat when `ProxyDetector` reports past
  implementations, and the `initialization` list in the dossier. Unsupported history stays explicitly
  uncertain in the output rather than silently trusted.
- **Benchmark leakage**: Codex's read‑only sandbox reads anywhere on disk. Mitigation: no‑shell mode with
  inlined sources by default, `bwrap` isolation with a command audit otherwise, temp workspaces outside the
  repository, and the mode recorded per run (§3.6).
- **AI nondeterminism and cost**: plans are persisted and committed; re‑authoring only on hash change or
  `--reauthor`; budgets and attempt caps; `--no-ai` reruns.
- **Plans that overfit an address** (seen in the bake‑off with CEL): static literal check + held‑out dry run
  at a second address of the same shape.
- **Runaway plans** (huge `forEach`, unbounded logs, pathological jq): executor limits and worker timeouts.
- **jq big‑number semantics** (doubles): big values travel as decimal strings; comparisons via `gt`; documented
  in the format spec; validator warns on arithmetic over string fields when detectable.
- **Output drift from V1**: mitigated by reusing V1's `Analysis` → `toDiscoveryOutput` path and by parity
  tests on formatting; V2 writes to its own folder so no downstream consumer is affected accidentally.
- **Explorer/RPC quotas** during benchmarks: V1's cache is reused; `l2b fetch-discovery-cache` seeds it.
- **Trivial getters dominate the numbers**: 0‑arg getters are 60–70 % of V1's fields (Scroll 358 across 110
  ABIs, Zora 226 across 37, Linea 244 across 38; at most 51 per contract). The benchmark reports the getter
  class separately so the AI's marginal contribution (arrays, events, storage, derived fields) is visible.

## 9. Decisions taken here that you may want to overrule

1. New package `packages/discovery-v2` importing `@l2beat/discovery` (§1). Alternative: files inside V1.
2. Global, hash‑keyed plan store `_plans/<hash>/` committed to git (§3.4), instead of per‑project files.
3. Default V2 output under `packages/config/cache/discovery-v2/<project>/`, `--in-place` opt‑in (§3.1).
4. **No getter shorthand.** Every fetched getter is an explicit `call` step; the validator enforces coverage
   of all 0‑arg view/pure ABI functions (fetch or `skip` with a reason) and warns on non‑V1 field names
   (§3.6, §3.7). Reasoning: the executor stays a pure interpreter of the plan (no ABI heuristics beyond
   encoding), the plan is a complete reviewable spec, and the cost is small: across six projects the median
   contract has 1–4 such getters, the 90th percentile 8–21, the maximum 51 (Linea, Zora); one line and about
   20 output tokens each, versus reading a 100–300 KB source. Omission, the real risk of explicit listing,
   is caught deterministically by the coverage check, and a reverting or meaningless getter becomes a
   visible `skip` instead of an `errors` entry as in V1. V1's `LimitedArrayHandler` (first five elements
   of any single‑`uint256` getter, error above five) is not replicated; the coverage check makes the AI
   decide the length source explicitly. The getter **preview** in the dossier is kept as prompt input only.
5. Facts stage written new for this task: a small, fixture‑driven set of relations and rules with precise
   claims about what they cover, compiler selection copied in spirit
   from `packages/l2b` (explorer's exact version) with pragma resolution as fallback; no code from
   `spike/queryable-facts-v2` (§1.3, §3.5).
6. Codex as the first `PlanAuthor` with shell reading a read‑only workspace; sources not inlined (§3.6).
7. Repair rounds: 2; attempt timeout 15 min; concurrency 4 addresses / 2 AI authorings.
8. Phase 1 ignores everything in `config.jsonc` except `initialAddresses`, limits, `ignoreDiscovery`,
   manual `proxyType`, and colorization names (§3.2).
9. Plan reuse keeps V1's shape hash as the candidate key (so plans are shared across proxy variants like
   templates are) and adds an applicability check on every reuse plus a `planHash` for provenance, rather
   than widening the key to include proxy source and compiler settings (§3.4). Widening the key would
   re‑author the same implementation once per proxy variant for little gain.
10. Correctness evidence is carried by the plan (`assumes`, `assert`, `unverifiable`) and enforced by the
    validator for event‑ and storage‑derived fields, instead of building a separate verifier (§3.6).
11. Benchmark headline = acquisition‑task correspondence and value agreement; value‑coincidence overlap is
    reported but not used as the success measure (§6).
12. Benchmark isolation = no‑shell mode with inlined sources by default, `bwrap` plus command audit for
    large sources; Codex's own sandbox flags are not relied on for read isolation (§3.6).
13. Milestones prove the authoring → execution → replay loop on three contracts and two deployments before
    project traversal and before the facts stage, whose value is then measured as an ablation (§7).

## 10. Appendix

Tool versions found on this machine: jq 1.8.1 (`/usr/bin/jq`, not needed at runtime: `jq-wasm
3.0.0-jq-1.8.2` is pure npm), Soufflé 2.5 (`~/.local/bin/souffle`), Codex CLI 0.155.0, Claude CLI present,
`solc` binary absent (downloaded on demand by the facts stage). Node ≥ 22 per repo `engines`.

New dependencies for `@l2beat/discovery-v2`: `@l2beat/discovery`, `@l2beat/backend-tools`, `@l2beat/shared`,
`@l2beat/shared-pure`, `@l2beat/validate` (workspace); `ethers@5`, `cmd-ts`, `chalk`, `lodash` (already in the
lockfile); `jq-wasm`, `@ethereum-sourcify/compilers` + `-types` (already used by `packages/l2b`), `semver`.

Reference material used: `packages/discovery/src/discovery/{engine/DiscoveryEngine.ts,
analysis/AddressAnalyzer.ts, provider/AllProviders.ts, provider/BatchingAndCachingProvider.ts,
source/SourceCodeService.ts, output/{types,toDiscoveryOutput,structureOutput,saveDiscoveryResult}.ts,
handlers/{decodeHandlerResults,getSystemHandlers}.ts}`, `packages/discovery/src/flatten/utils.ts`,
`packages/discovery/src/index.ts`, `packages/l2b/src/commands/FlattenerValidator.ts` (compiler use),
`/home/l2beat/workspaces/analyze/analyzers/shared/solc.py` (pragma resolution, solc-select),
`spike/queryable-facts-v2/{README.md,PLAN.md,PLAN2.md,src/*,rules/*}` (ideas only),
`spike/queryable-facts/FINDINGS.md`, `queryable-facts/{README,GUIDE}.md` and `src/*.mjs` (pipeline shape),
`packages/l2b/src/implementations/discovery-ui/*`, `packages/config/src/discovery/ProjectDiscovery.ts`,
`packages/backend` UpdateMonitor/DiscoveryRunner, `expr-bakeoff/` results.
