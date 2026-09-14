# Queryable facts · Astra

An incremental teaching prototype for narrowing smart-contract analysis. Stage 01
asks: **which functions contain bare-identifier assignments to state variables?**
It runs the Solidity compiler and Soufflé, displaying actual inputs and outputs.
There is no AI, discovery integration, or solver yet.

## Run it

Prerequisites: Node 22+ and `souffle` on PATH (tested with Soufflé 2.5).
The compiler is pinned to solc-js 0.8.34, matching the examples' exact pragma.
It rejects incompatible pragmas; automatic version selection is a later concern.

From the repository root:

```sh
cd spike/queryable-facts-astra
npm ci --workspaces=false --ignore-scripts
npm run dev
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
PORT=5182 npm run dev
SOUFFLE_BIN=/absolute/path/to/souffle npm run pipeline
```

The server binds to localhost. This folder owns its dependencies, npm lockfile,
examples, rules, website, and ignored `out/` directory. It imports no code or cache
from other prototypes. Use the local npm commands above; no root workspace
install or configuration change is required. After installation, it works offline.

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
   read to explain who can execute this assignment?” That is the next increment.

Even a trivial setter should not be described as “always changing score”: it may
assign the value already stored. This stage makes no claim about callers,
reachability, final state, or transaction success.

## Read the code in pipeline order

```text
examples/*.sol
    ↓ solc standard JSON
src/pipeline.mjs       compiler AST + storage layout
    ↓
src/facts.mjs          five small observation relations
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
Solidity, fact, rule, and JSON views use a small shared token highlighter. When we add a second
stage, its selector should change the executed rules, not just hide results.

## Exact boundary

The rule matches an assignment whose left side is an Identifier referencing a
state declaration, including compound assignments such as `+=`. It records
syntactic containment under guards, branches, and unreachable code too.

It does **not** find all possible storage writes. `++`, `--`, `delete`, array/member
writes, storage aliases, initializers, assembly, modifier bodies, and writes through
called functions need additional extraction/rules. An empty result is not a
general exclusion proof. Source editing supports exploring the lesson, not
arbitrary-contract coverage. Scope is included in every run JSON and on the page.

Source remains visible. We do not infer permission from missing guard facts.
The pipeline cannot answer “who can change score?” An external call such as
`gate.authorize(msg.sender)` must still be understood before making that claim.

## Reproduce a run

Each successful run saves a unique directory under `out/runs/`:

- `source.sol`, `compiler-input.json`, and `compiler-output.json`;
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
