# Queryable facts · Astra

An incremental teaching prototype for narrowing smart-contract analysis. Stage 01
asks: **which functions contain bare-identifier assignments to state variables?**
It runs the Solidity compiler and Soufflé, displaying actual inputs and outputs.
Lesson 02 adds an optional AI explanation based on those observations and source
reading. Lesson 03 adds optional internal-call propagation and an entry-point view. Lesson 04 adds external dependencies and an optional synthetic discovery snapshot. There is no live discovery integration or solver.

## Run it

Prerequisites: Node 22+ and `souffle` on PATH (tested with Soufflé 2.5).
The compiler is pinned to solc-js 0.8.34, matching the examples' exact pragma.
It rejects incompatible pragmas; automatic version selection is a later concern.

From the repository root:

```sh
cd spike/queryable-facts-astra
npm ci --workspaces=false --ignore-scripts
pnpm dev
```

Open **http://localhost:5181**. Select an example and click **Run this stage**.
Use **Edit source** to make changes, then **Done editing** to return to the highlighted view. Rerun or reset the example. Editing or switching examples
clears old findings. Compiler failures show errors instead of results.

```sh
# Same pipeline, without the website:
npm run pipeline
npm run pipeline -- examples/02-unreachable.sol

# Integration checks with the real compiler and Soufflé:
npm test

# Optional overrides:
PORT=5182 pnpm dev
SOUFFLE_BIN=/absolute/path/to/souffle npm run pipeline
```

The server binds to localhost. This folder owns its dependencies, npm lockfile,
examples, rules, website, and ignored `out/` directory. It imports no code or cache
from other prototypes. Use the commands inside this folder; no root workspace
install or configuration change is required. The compiler and Soufflé stage works offline. Asking AI requires a signed-in
Codex CLI and network access; it sends the displayed briefing to the model.

## Present it in about five minutes

1. Choose **A setter and a reader**. Read the source together. Ask: “Where is
   `score` assigned?” Run the stage.
2. Explore **The AST, as a tree**. The file root starts expanded, showing the pragma
   and contract. Expand the contract, then setScore → Block → ExpressionStatement
   → Assignment. Every visible branch corresponds exactly to a `child` fact.
   Nodes use the same readable IDs as the facts. **Collapse branches** resets the
   view. Raw compiler JSON and storage layout remain available underneath.
3. Read `functionDefinition`, `stateVariable`, and `assignment` facts. Expand
   `reference` to follow the declaration ID and `child` for AST nesting. These are
   compiler observations, not AI interpretations. Facts appear as Datalog atoms with readable ID suffixes.
4. Read the three clauses. The first two recursively derive “inside this
   function” from child edges. The last joins an assignment to a state declaration.
   This is AST containment, not a call graph.
5. Read the result beside the rules: `setScore → score`, **potential writer**.
   Expand **Input facts behind this tuple** to inspect its supporting facts.
   `readScore` has no assignment matching the rule. For this small example,
   reading the whole source confirms that it only reads.
6. Switch to **The same write, after a revert**, and run again. The rule still
   reports the assignment. This is correct: the assignment exists in the syntax,
   even though execution cannot reach it. The rule did not claim otherwise.
7. Optionally rename `score` or `setScore` and rerun. The same rule works because
   it follows declaration IDs, not example names.
8. Stop at the next question on the page: “What source should a researcher or AI
   read to explain who can execute this assignment?” Enable lesson 02 to continue.

Even a trivial setter should not be described as “always changing score”: it may
assign the value already stored. This stage makes no claim about callers,
reachability, final state, or transaction success.

## Read the code in pipeline order

```text
examples/*.sol
    ↓ solc standard JSON
src/pipeline.mjs       compiler AST + storage layout
    ↓
src/facts.mjs          compiler observation relations
    ↓
rules/01-direct-writes.dl
    ↓ Soufflé
directWrite(functionId, variableId, assignmentId)
    ↓ resolve labels and source locations for display
web/                  source, inputs, rules, findings, boundaries
```

| Relation | Compiler observation |
| --- | --- |
| `functionDefinition(id, name)` | A FunctionDefinition node |
| `stateVariable(id, name)` | A VariableDeclaration with stateVariable=true |
| `child(parent, node)` | A direct AST child relationship |
| `assignment(node, left)` | An Assignment and its left-hand node |
| `reference(node, declaration)` | An Identifier's referencedDeclaration |
| `functionVisibility(function, visibility)` | Function visibility |
| `functionKind(function, kind)` | Regular function, constructor, fallback or receive |
| `internalCall(call, callee)` | Plain Identifier call referencing an implemented, non-virtual FunctionDefinition with compiler type `t_function_internal_*` |

The browser labels IDs consistently in base facts, derived tuples, and supporting
facts: for example, `reference(12_use_score, 3_state_score)` connects a variable
use to its state declaration. These suffixes are display annotations, not runnable
Soufflé syntax. **Show raw numeric IDs** restores the exact numeric tuples.
Compiler JSON, rule execution, and downloaded run data are unchanged. Labels are
computed from the AST in `web/id-labels.js`; names never determine identity.

References include locals and parameters too. Joining with `stateVariable`
prevents a local with the same name being mistaken for a state variable. IDs are
local to one compiler run, not stable across edits. Displayed function names are
labels; tuple IDs still distinguish overloaded or identically named functions.

There is no general AST framework or plugin loader. CLI and server call the same
pipeline. The browser is plain HTML, CSS, and JavaScript. The expandable AST uses native
`details` elements built from the existing `child` facts, not another parser.
Solidity, fact, rule, and JSON views use a small shared token highlighter. Lesson 02
adds source reading, so it intentionally uses the same rules. The lesson 03 toggle changes the program executed, not just which results are visible.

## Exact boundary

The rule matches an assignment whose left side is an Identifier referencing a
state declaration, including compound assignments such as `+=`. It records
syntactic containment under guards, branches, and unreachable code too.

It does **not** find all possible storage writes. `++`, `--`, `delete`, array/member
writes, storage aliases, initializers, assembly, modifier bodies, and writes through
called functions need additional extraction/rules (lesson 03 adds a limited internal-call analysis). An empty result is not a
general exclusion proof. Source editing supports exploring the lesson, not
arbitrary-contract coverage. Scope is included in every run JSON and on the page.

Source remains visible. We do not infer permission from missing guard facts.
The rule alone cannot answer “who can change score?” An external call such as
`gate.authorize(msg.sender)` must still be understood before making that claim.

## Reproduce a run

Each successful run saves a unique directory under `out/runs/`:

- `sources/`, `sources.json`, `compiler-input.json`, and `compiler-output.json`;
- `facts/*.facts`: Soufflé's native tab-separated input;
- `facts.dl`: the same tuples in readable Datalog notation;
- `rules.dl`: the exact program executed;
- `derived/directWrite.csv`: Soufflé output (tab-separated despite `.csv`);
- `result.json`: complete presentation data, compiler version, and scope.

The website offers a JSON download too. Tab-separated files are serialization,
not another logical transformation; they need not appear in the presentation.
Replay the inference using the printed run directory in place of `STAGE_RUN`:

```sh
souffle -F out/runs/STAGE_RUN/facts -D out/runs/STAGE_RUN/derived out/runs/STAGE_RUN/rules.dl
```

Tests cover setter/reader, unreachable code, renaming, shadowing, internal callers,
guards, external authorization, unsupported writes, UTF-8 offsets, and compiler
failure. They validate this lesson, not general Solidity execution semantics.


## Lesson 02 · a question drives the investigation

Restart your existing `pnpm dev` process after updating, then refresh the page.
Enable **lesson 02 · Read with AI** at the top. It adds no new Soufflé rules.

Ask a free-form question. There is no state-variable selector. Try:

- “Who can change score?”
- “How is access controlled in this contract?”
- “Can the authorization dependency be replaced?”

The model starts with a symbol index (names, IDs, kinds, line ranges), the question,
and the exact scope of the current rules. **Source is not pasted into the initial
prompt.** The model chooses a request:

| Request | Input | Returned material |
| --- | --- | --- |
| `writers` | State-variable declaration ID | Matching existing directWrite tuples and function IDs |
| `entrypoints` (lesson 03 enabled) | State-variable declaration ID | Entry-point writers, all relevant internal-call edges, and function IDs to read |
| `source` | Symbol ID | A declaration, function, modifier, or contract excerpt |
| `lines` | Source line range | A bounded excerpt for additional context |

Requests are executed against the saved compiler/Soufflé run. This is retrieval,
not another analysis engine. A writers request does not run new rules or infer
permissions. It can return internal functions and constructors too. With lesson 03 enabled,
`entrypoints` provides a separate view of externally callable potential writers.

Each request includes a short public purpose, such as “Inspect the caller check”.
The website streams the actual request and result into the **Investigation** log.
It shows the returned facts and code, not a simulated sequence. The purpose is an
explanation of the requested inspection, not a transcript of private reasoning.

```text
question + symbol index + rule scope
    ↓ AI chooses a request
writers / source / lines
    ↓ actual facts or source returned and displayed
AI chooses another request, or answers
    ↓
claim → why this evidence supports it → named code excerpt
```

The expandable investigation log is shown above the final answer. Each claim has
an explanation of why its evidence matters, with the named function/declaration
shown in context and the cited lines highlighted. Soufflé observations have a
separate visual style. Internal evidence IDs remain in the saved JSON and model
protocol; the presentation does not display F/L identifiers or “reference exists”.

The adapter checks that cited material was actually retrieved and that selected
lines belong to the excerpt. Missing evidence is shown explicitly. These checks
**do not validate the AI's explanation or prove its conclusion**. The AI cannot
turn an existing tuple into a permission proof by citing it. All conclusions
about execution or authorization remain source-based AI reasoning.

### Present the same rule with different behavior

1. Use **A setter and a reader**, enable lesson 02, and ask who can change score.
   Watch the model request potential writers and then source.
2. Use **The same write, after a revert**. The same rule finds an assignment, but
   the answer should explain why the preceding unconditional revert prevents it.
   The evidence should show the complete setter, not isolated line citations.
3. Use **A write guarded by an owner check**. Ask “How is access controlled?”
   The model can inspect the setter, owner declaration, owner writers, constructor,
   and reader as relevant. The user did not have to select a variable first.
4. Use **A write delegated to an unknown gate**. Watch the model follow the gate
   dependency. Its implementation and deployed address are not provided, so the
   exact authorization policy must remain unknown.
5. Expand **Investigation** above the answer to revisit actual requests. Use
   **Download investigation** to retain the question, initial briefing, requests,
   returned material, and final answer.

The order and number of inspections are model choices, not scripted lesson steps.
A model may request an entire small contract explicitly when checking whether
other code could matter. Source is available on request, not prohibited. The
current rules have incomplete write/dependency coverage, so we do not claim the
retrieved excerpts form an exhaustive program slice. A conclusion about “nobody
else” requires broader source inspection and remains AI reasoning at this stage.

### Implementation and limits

Read these files in order:

1. `src/briefing.mjs`: build the symbol index and initial briefing; serve the
   retrieval operations; resolve final evidence against material actually returned.
2. `src/ask.mjs`: the small loop that asks the model for a request or an answer,
   executes requests, saves every turn, and emits progress events.
3. `web/reader.js`: show the stream of inspections and the explained answer.

The loop uses the installed Codex CLI and existing authentication. Each model call
receives the initial briefing plus the actual inspection history so far. Only
requested source and facts enter that history. There is no custom Solidity
interpreter, solver, shell tool, or second query language. Source retrieval is
limited to 120 lines per request; truncated symbols explicitly report the remaining
range so the model can request more.

An investigation allows at most 12 inspections, five minutes overall, and 120,000
characters per prompt. These are operational limits, not semantic bounds. If the
model cannot finish within them, the UI retains the partial trail and reports that
there is no final answer. Clicking **Stop**, changing the question/source, or
leaving the lesson aborts the active request. Changing ID notation preserves the
answer. Each question starts a fresh investigation.

The default model is `gpt-5.6-sol`. To override the model or executable:

```sh
ASTRA_MODEL=gpt-5.6-sol pnpm dev
CODEX=/absolute/path/to/codex pnpm dev
```

The adapter uses non-interactive `codex exec`, a read-only sandbox and structured
output. It disables shell tools and web search and skips user configuration and
project instructions. Auth remains with the normal CLI installation. See the
[non-interactive CLI documentation](https://developers.openai.com/codex/noninteractive)
and [configuration reference](https://developers.openai.com/codex/config-reference).
No new package dependency is needed.

Each investigation saves `briefing.txt`, `trail.json`, and `answer.json` under the
run's `asks/ask-*` directory. Each `turn-*` subdirectory saves the exact `prompt.txt`,
`schema.json`, `invocation.json`, raw `response.json`, and `cli.log`. Failed asks
save `error.txt`. The original run JSON still represents only the deterministic
compiler/Soufflé stage. Copying the initial briefing alone into a chat no longer
reproduces the interaction: the retrieval loop must service the model's requests.

`npm test` runs the compiler/Soufflé tests plus retrieval, evidence membership,
source context, request corrections, bounded execution, and cancellation checks.
Browser checks exercise free-form questions, streamed JSON, source highlights,
HTML escaping, partial failures, stale-answer prevention, and mobile layout.
Live Codex checks exercise both variable-specific and broader questions. These
checks validate the interaction; they do not certify future model answers. No
server is started for the checks.


## Lesson 03 · entry points and intermediate guards

Restart `pnpm dev` for the backend changes. No new dependencies are required.

1. Select **An entry point with a guard in a helper**. Leave lesson 03 disabled
   and run. The direct-write rule finds `setScore → score` (and the constructor's
   assignment to `owner`). It does not connect the external caller to the setter.
2. Enable **lesson 03 · Follow internal calls**, then run again. This appends
   `rules/03-entry-writers.dl` to the actual Soufflé program.
3. Below the direct-write lesson, the entry-point view shows:

   ```text
   updateScore (external)
       → checkAndSetScore (internal)
           → setScore (internal)
               → assigns score
   ```

4. Expand **Read checkAndSetScore**. The owner check is in an intermediate
   function. Reading only the entry point and assignment would miss it.
5. Expand the additional rules. `calls` joins AST containment with resolved call
   observations. `potentialWrite` starts at direct assignments and propagates
   backward through callers to a fixed point. `entryWrite` filters these results
   to public/external functions, fallback and receive. Constructors remain in the
   direct-write facts as initialization; they are not entry points.
6. `writePathEdge` retains all relevant edges for each entry/variable pair. The
   displayed graph includes intermediate helpers and handles shared helpers/cycles
   without enumerating infinitely many paths. All derived tuples are inspectable.
7. Enable **Read with AI** and ask “Who can change score, and where is access
   checked?” Its `entrypoints` request returns the graph and IDs of all functions
   to inspect. Source still arrives only when requested. The model is instructed
   to read intermediate helpers as well as the entry point and assignment.

The facts do not label the guard or prove it must execute. Interpreting the owner
check remains source-based AI/human reasoning. In this example the deployed owner
address is not supplied. The initial prompt contains neither source nor an answer.

The new relation only follows plain Identifier calls to implemented, non-virtual
functions using the compiler's resolved declaration ID and internal-function type.
This handles ordinary public/internal/private calls, overloads, and recursive
cycles, without matching names. It does not follow member calls (`this`, `super`,
libraries), function pointers, virtual dispatch, modifier bodies, assembly,
external calls or callbacks. Inherited/deployed dispatch is not modeled. The
entry view shows declarations, not a reconstructed deployed ABI. Assignment
coverage is unchanged. Missing edges/tuples are therefore never exclusion proofs.

Run the same lesson without the UI:

```sh
npm run pipeline -- examples/05-internal-chain.sol --follow-calls
```

Saved runs include `followCalls`, the exact combined `rules.dl`, and separate
`calls.csv`, `potentialWrite.csv`, `entryWrite.csv`, `writePathEdge.csv` outputs.
Turning the toggle off removes those rules from execution, preserves the direct
lesson, and invalidates the previous AI investigation until you rerun.

`test/calls.test.mjs` checks the guarded chain, toggling, source retrieval for all
helpers, multiple entry points, recursive cycles, disconnected helpers,
constructors, overload resolution, unreachable calls, unsupported external/
virtual/pointer calls, and fallback/receive entries using real solc and Soufflé.


## Lesson 04: connect source files using discovery

Choose **An external gate with a discovery snapshot**. The example now has the
same simple directory shape used by discovery:

```text
examples/playground/
  .flat/
    Playground.sol     # Playground and its IGate interface
    OwnerGate.sol      # the concrete gate implementation
  discovered.json
```

The page shows both source files one below the other, each with its own editor.
Compiler trees, source excerpts and AI citations retain their file names. Both
files are compiled together in one solc invocation, so AST node IDs are globally
unique within the run. This is still the pinned compiler, not production discovery's
multi-version compiler setup.

`discovered.json` uses `name` and `entries`. Each contract entry has `name`,
`address`, `type: "Contract"`, and `values`; EOA entries use `type: "EOA"`.
Addresses use the same chain-prefixed form as Zora's discovery, such as `eth:0x…`.
For this lesson an entry named `ABC` maps to contract `ABC` in `.flat/ABC.sol`.
That association is supplied input, not a bytecode check. Proxies, nested source
folders, implementation-name overrides and inherited implementation dispatch
are outside this lesson; it does not guess when the simple mapping fails.

### Present the lesson

1. Enable **lesson 04**, leave **Attach snapshot values** unchecked, and run.
   The panel says **Playground.setScore calls gate.authorize**, with its source
   file and call site. The dependency is known, but its target is unresolved.
   Having OwnerGate source available does not establish that it is deployed as
   this particular gate.
2. Inspect `discovered.json`. Playground is deployed at `eth:0x1111…1111`;
   its current `score` is **42** and `gate` is `eth:0x2222…2222`. The second
   contract entry identifies that address as OwnerGate, whose `owner` is
   `eth:0x3333…3333`.
3. Attach the snapshot and rerun. The connection panel explains each step:
   **calling contract → reference value → matching target function**. Every
   address has a role and contract name. Expand **How the rule connects these
   pieces** to explain the join. Per-contract tables show all supplied values.
4. Enable **lesson 02** and ask **“What is the current value of score, and who
   can change it?”** AI retrieves values and source as needed. Its investigation
   and final source excerpts identify `.flat/Playground.sol` and
   `.flat/OwnerGate.sol` separately.
5. Explain the identity distinction: Playground passes its `msg.sender` as the
   `caller` argument. Inside OwnerGate, `msg.sender` would be Playground, but the
   check uses `caller`. This is interpreted from source, not symbolically executed
   by the connection rule.

Lesson 03 remains independently selectable. Its rules propagate potential writes
through supported internal calls; lesson 04 resolves external source dependencies.
Neither proves permissions. The example's gate and owner are immutable so that
changing authorization policy remains a later lesson.

### Facts and values

The adapter emits a single typed relation:

```text
snapshotValue(deployment, variableId, solidityType, value)
```

For example, score produces a `uint256` value of `"42"`, while gate produces a
`contract IGate` value containing the target address. Numeric values are stored
as decimal text to preserve the full Solidity integer range, not squeezed into
Soufflé's numeric type. Booleans, strings and compound JSON values also use this
relation. Compound contents are preserved as supplied JSON, not interpreted as
individual storage slots. Unsafe JavaScript numbers are rejected; use decimal
strings for large integers. Missing values remain unknown rather than zero.

`addressVariable(variableId)` is a compiler observation about the declaration's
type. The `resolvedCall` rule joins only those variables, so recording ordinary
state such as score does not turn it into an address or an external dependency.

- `src/snapshot.mjs` extracts contract membership, implemented ABI selectors and
  external calls through state variables; it translates discovery entries to facts.
- `rules/04-snapshot.dl` derives `externalDependency` and `resolvedCall`. The
  latter retains both deployment addresses, keeping different instances distinct.
- AI's `dependencies(functionId)` request returns call sites and target function
  IDs with source file names. `values(variableId)` returns typed current values.
- `source(symbolId)` reads the indexed file. `lines` accepts a target such as
  `.flat/OwnerGate.sol:9-11`; an unqualified range is rejected for multi-file runs.

This is a small supported subset of discovery's format. Ordinary provided values
must match locally declared state variables. Production discovery's computed
fields, `$` metadata inside values, formatted durations and proxy layouts need
separate handling and are not silently interpreted as Solidity state here.
Unknown contract/source mappings or malformed inputs fail explicitly. Missing
external target entries or matching ABI functions remain unresolved. Address
prefixes are preserved, so equal hex addresses on different chains do not join.
Unprefixed reference values inherit their containing deployment's chain prefix.

Without the website:

```sh
npm run pipeline -- examples/playground --connect-contracts
npm run pipeline -- examples/playground --connect-contracts --snapshot examples/playground/discovered.json
```

Runs save the exact `discovered.json` when attached, source files under `sources/`
with their relative paths, `sources.json`, compiler outputs, input facts, rules
and derived tuples. Editing either source, discovery JSON or lesson toggles
invalidates the previous result. Restart `pnpm dev` after updating server code;
this change needs no dependency installation.
