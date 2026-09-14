# Queryable contract facts, second prototype

Solidity files and a discovery snapshot become facts. One library of Datalog rules says what the facts
mean: the structure of the code, and which conditions guard every storage write. A solver (Z3) decides
those conditions with discovery's values substituted: which senders can make each write persist, which
cannot, and what is unknown. An AI answers questions by writing rules of its own and citing the tuples
they derive. Four stages, three screens, one folder per run.

This is the second prototype of L2B-14851. The first one (`../queryable-facts`) is kept as it is; this
one reuses its compiler wrapper and its fact encoding. Its permission rules (pattern-recognised sender
checks with "anyone" as the default) turned out unsound and were replaced by the guard layer, the solve
stage and the verdict layer described in PLAN2.md.

## Run it

```sh
pnpm dev                        # http://localhost:5179
pnpm run run playground         # the synthetic project in projects/ (see projects/README.md)
pnpm run run zora               # a project in packages/config, a folder with discovered.json + .flat/, or a .sol file
pnpm run cli runs               # runs on disk (out/runs/<id>)
pnpm run cli catalog            # the relations an agent can use, one line each
pnpm semantic                   # the fixtures in contracts/ against expected/, the projects in projects/pg-* against their expected.json
```

Needs `souffle` on the PATH (2.5), `z3` (`~/.local/bin/z3` or `$Z3_BIN`; release 5.x), `codex` for the
ask screen, network once per solc version (the binary is fetched from binaries.soliditylang.org and its
sha256 checked; the cache is `.cache`, a link to the first prototype's).

## The four stages

**1. Inputs → facts** (`src/compile.ts`, `src/emit.ts`, `src/discovery.ts`). Every `.sol` file is
compiled with the solc version its pragma asks for; the compact JSON syntax tree and the storage
layout are written down as tab-separated `.facts` files, Soufflé's native input, one row per node
and per field (`node`, `child`, `attr`, `num`, `loc`, `text`, `storageLayout`, …). `discovered.json`
is written down the same way (`dEntry`, `dImpl`, `dUnit`, `dValue`). Discovery's own permission
model (the `permissions` block) is not read: it is the output of another rule engine. Nothing here
interprets Solidity or discovery.

**2. Rules → derived** (`rules/`, `src/rules.ts`, `src/pipeline.ts`). One library, one list of
layers:

| file | layers | evaluated |
| --- | --- | --- |
| `0-solidity.dl` | 0: solc's facts | read by every unit program |
| `1-syntax.dl` | 1: syntax → concepts (names, statements, calls, writes, assembly) | once per file |
| `2-analysis.dl` | 2–6: structure, call graph, state writes, completion, answer tables | once per file |
| `2-guards.dl` | 2g: guard structure per write (what must hold, which calls must complete) | once per file |
| `2-proposed-unit.dl` | rules promoted from questions that read the tree | once per file |
| `0-discovery.dl` | 0: discovery's facts | read by the project program |
| `3-project.dl` | 7–8: deployment, values, calls between contracts, actors | once per run |
| `4-proposed.dl` | rules promoted from questions that compose reviewed relations | once per run |
| `0-solved.dl` | 0: the solver's facts | read by the verdict program |
| `5-verdict.dl` | 9: canChange / cannotChange / unknownFor, the closure | once per run |

Soufflé runs the unit program once per file, then the project program once over the union of the
files' *exported* relations plus discovery. A unit relation is exported when every column is a
symbol or a numeric column that is not a node id (`Index`, `Slot`, `Line`, …): node ids restart at
0 in every file, names carry the `<unit>:` prefix, so only name-keyed relations can be put together.
`src/rules.ts` decides this from the declarations. Every relation is written to disk, so a query or
the explorer never recomputes anything.

The guard layer (`2-guards.dl`) recognises no check by its shape. For every write it states which
conditions must hold on every completing execution that performs it (`guard`: require/assert, if-abort,
if-return, branch, loop, try), which external calls must complete (`callGuard`), what a callee needs
for its own completion (`fnGuard`), where the executions fork (`pathSplit`, `loopAround`), and what the
structure cannot follow (`opaque`). It never says who passes.

**3. Solve** (`src/symbolic.ts`, `src/smt.ts`, `src/solve.ts`). For every entry function of every
deployed address, a bounded symbolic walk over the solc AST enumerates the completing executions:
branches fork, loops unroll (3), internal calls and modifiers inline, calls to other deployed contracts
inline that contract's function with the calling address as `msg.sender` and its own recorded storage,
and whatever cannot be followed becomes a free symbol of kind *unknown* (a value discovery did not
record, a hash, an unresolved call target, opaque assembly). Each write met on a path becomes a
question for Z3: for every discovered address, and for "outsider" (every other address), can that
sender make the write persist? Satisfiable with recorded state is a witness; satisfiable only through
unknown symbols is checked again as "are there inputs such that it holds for every value of the
unknowns" (robust) and otherwise reported as *depends-on*; unsatisfiable is an exclusion, which holds
with the unknowns free. "Anyone" is proven the same way for every outsider at once. Running out of a
budget (64 paths, 3 iterations, 6 nested calls, 2 s per check) is a residual, never a verdict. The
paths, the SMT-LIB scripts and the results are kept under `<run>/solve/`; the answers become the
`solved*` facts.

**4. Verdict** (`5-verdict.dl`). Three relations per (sender, deployed contract, variable), never a
default: `canChange` (a witness or a robust proof; "anyone" only from a proven open write; signers of
an admitted Safe by discovery's snapshot), `cannotChange` (excluded on every write through every entry,
fully explored), `unknownFor` (a residual in the way, named in `unknownChange`). `indirectlyCanChange`
is the closure: who can change the storage the guards read. A contract as a sender needs no extra
rule: the solver walked its entry functions into their callees, so the rows with `Via` = that contract
say who can make it call.

**Ask** (`src/agent.ts`, `src/query.ts`, `src/proof.ts`, `src/q.ts`). The agent is the `codex`
CLI, sandboxed to the run folder, with a briefing that contains the catalogue of relations (name,
signature, one line each) and one way to make a claim: write Datalog rules, run them, cite the
tuples. Its tools are the shell and `./q`:

```
./q catalog [--all]           the relations, one line each
./q show <relation>           declaration, meaning, rules, count, sample rows
./q rows <relation> [text…]   rows containing every text, as atoms (to find exact names)
./q run <file.dl> [--name n]  run rules against the run; print the tuples they derive
./q why '<atom>'              the proof tree of a tuple; leaves derived elsewhere say how to continue
./q solve <addr> <entry>      the solver's paths, witnesses, exclusions and residuals for one entry's writes
./q source <id> | <unit> a-b  source lines
./q units                     the source files of the run
```

A query program declares and reads only the library relations it mentions (`.input` with explicit
file names from the run's derived files) and adds the new rules, so it costs Soufflé's start-up plus
the new joins: tens of milliseconds at the project level. A query that mentions a layer-0 fact or a
unit-internal relation runs per unit with the results united (about a second for 41 units). The
first kind *composes* reviewed relations; the second *interprets* the syntax tree anew and is marked
experimental.

Every ask is recorded under `<run>/asks/<n>/`: the briefing, every command and its output
(`events.jsonl`), every query with its program, results and Soufflé output, the answer, and
`meta.json` with the check of every atom the answer cites against the run's tuples (verified /
missing / unknown relation). A query's rules can be promoted into the library from the ask screen:
they are appended to the proposed-rules file of their stage with a description, and the rows they
derived are kept under `expected/proposed/` so `pnpm semantic --run <dir>` notices drift.

## Proofs

Soufflé's provenance mode explains one program at a time. A run has several programs (each query, the
verdict stage, the project stage, one per unit), so `src/proof.ts` finds the program a tuple belongs
to, asks there, and marks the leaves that another stage derived. In the explorer such a leaf has a
"why?" button that fetches its own proof and grows the tree in place; in `./q why` it says which
command continues. A `solved*` leaf is the solver's answer: in the explorer it opens the paths, the
witnesses with their inputs, the exclusions, the residuals and the SMT-LIB scripts; `./q solve`
prints the same. A
project-stage explanation takes a fraction of a second; a unit-stage one a few seconds on the
largest files, because Soufflé re-evaluates that unit's program with provenance.

Soufflé's explain shell reports functor constraints (`contains(...)`) like atoms; they are shown as
constraints, not facts.

## Layout

```
rules/                 the library (see the table above)
projects/              hand-written projects in discovery's shape, for small experiments
contracts/             sample contracts, checked against expected/ by pnpm semantic
src/compile.ts         pragma → exact solc → standard JSON (AST + storage layout)      [from v1]
src/emit.ts            the AST as facts                                                  [from v1]
src/discovery.ts       discovered.json + .flat as a project; discovery as facts          [from v1]
src/program.ts         parses .dl text into sections, declarations, clauses
src/rules.ts           the library: files, exported relations, unit and project programs, catalogue
src/souffle.ts         running Soufflé (stdio bound to files, so a sandbox allows it), provenance
src/pipeline.ts        one run: units → facts → derived, project stage, solve stage, verdict stage, run.json, the q shim
src/symbolic.ts        the bounded symbolic walk over the solc AST (paths, effects, residuals)
src/smt.ts             SMT-LIB terms with constant folding, scripts, Z3 as a subprocess
src/solve.ts           the solve stage: per write, who can drive it (witness / robust / excluded / open / residual)
src/query.ts           query programs over a run, two levels, classification
src/proof.ts           locating a tuple's program, stitched explanations
src/q.ts               the ./q commands
src/agent.ts           briefing, codex driver, ask records, citation check
src/promote.ts         a query's rules into rules/*-proposed*.dl + expected tuples
src/cli.ts             run · runs · catalog · q · ask
src/semantic.ts        fixtures against expected/, projects/pg-* against their expected.json, promoted rules against a run
web/server/            the API inside Vite's dev server (api.ts, runs.ts)
web/client/            three screens (screens/), the proof drawer (App.tsx), atoms, rows, rule cards
out/runs/<id>/         one folder per run (see src/pipeline.ts for the layout)
```

## What a run folder holds

```
run.json                  what was run, per unit, with counts and timings
rules/*.dl                the library as it was when the run happened
units/<slug>/             source.sol, solc-input/output.json, facts/*.facts, program.dl, derived/*.csv, unit.json
discovered.json           the discovery snapshot (project runs)
facts/*.facts             the project stage's input: discovery as facts + every exported unit relation
program.dl, derived/      the project program and what it derived; program-verdict.dl adds layer 9 to derived/
solve/<via>/<entry>/      the paths of one entry function (walk.json) and, per write, the Z3 scripts and result.json
facts/solved/*.facts      the solver's answers as facts (rules/0-solved.dl)
q                         ./q help
asks/<n>/                 one folder per question (briefing.md, events.jsonl, queries/, answer.md, meta.json)
```

## Numbers (Zora, 41 files, 25 deployed contracts, 62 discovered addresses)

| | |
| --- | --- |
| base facts | 1,003,174 |
| unit tuples (layers 1–6 and the guard layer) | 2,014,074 |
| project tuples (layers 7–8) | 43,987 |
| entry functions walked / writes decided | 164 / 386 (paths per write: mean 4.3, max 64) |
| Z3 checks | 13,161 |
| verdict tuples (layer 9) | 38,914: 970 can, 3,256 cannot, 5,665 unknown over 157 (contract, variable) pairs |
| `canChange` rows by How | 876 robust, 475 witness, 1,492 "signer of" a Safe, 21 anyone |
| residuals | depends-on 7,466 (values discovery did not record), solver-timeout 153, too-many-paths 92, opaque 83, loop-bound 22 |
| unit stage (compile + facts + Soufflé, cached solc) | 42 s |
| project stage Soufflé | 0.2 s |
| solve stage (walk + Z3, one process per script) | 185 s |
| verdict stage Soufflé | 0.2 s |
| a project-level query | 20–100 ms |
| a unit-level query over all units | about 1 s |

The 21 writes open to anyone are the ones that should be: WETH balances and allowances, the token
factory's deployments, dispute-game moves. The unknowns are mostly honest: SystemConfig's and the
portal's initializers depend on values discovery does not record, and a handful of writes sit behind
loops or assembly. The consistency check between the guard layer and the walker (`mismatches` in
`solve/summary.json`) is empty.

During the port a differential check found the derived rows equal to the first prototype's for every
exported and project relation (5,927 relations, 0 differing rows); that check was removed with the
permission layer it compared (see PLAN2.md). The fixtures in `contracts/` derive the reviewed rows in
`expected/`, and the synthetic projects in `projects/pg-*` must produce the verdicts in their
`expected.json` (`pnpm semantic`).

## Known limits

- Values are discovery's snapshot at one block; Safe signer semantics (`acts`, the "signer of" rows)
  rest on discovery's fields, not on the Safe's code.
- A proof is evidence relative to the rules: it shows which facts and which rules produced a tuple,
  not that the rule means what its name says. Interpretations written by the agent are marked as
  such until reviewed. The solver's rows rest on the walk's model of Solidity: integers wrap (a
  checked-arithmetic revert is not modelled), reentrancy is not modelled, calldata-encoded calls
  (`abi.encode*` through a low-level call) are not followed, hashes and signatures are uninterpreted
  (a verdict resting on one is reported as unknown).
- `cannotChange` and `unknownFor` are the honest bounds: every unexplored execution (a budget, opaque
  assembly, an unresolved call target) turns exclusions into unknowns; `unknownChange` says which.
- Actors are the discovered addresses plus "outsider"; a sender that is a contract can act only if
  some entry of it makes the call, which the rows with that contract as `Via` answer.
- The agent runs inside codex's sandbox, which forbids sockets: `./q` therefore avoids tsx's CLI and
  binds Soufflé's stdio to files. Anything that needs a socket (a dev server, an IPC pipe) will fail
  there.
