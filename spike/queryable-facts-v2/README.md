# Queryable contract facts, second prototype

Solidity files and a discovery snapshot become facts. One library of Datalog rules says what the facts
mean. An AI answers questions by writing rules of its own and citing the tuples they derive. Three
steps, three screens, one folder per run.

This is the second prototype of L2B-14851. The first one (`../queryable-facts`) is kept as it is; this
one reuses its compiler wrapper, its fact encoding and its whole rule library, and drops the rest
(the step-by-step explorer, the report generator, the command vocabulary the agent depended on).

## Run it

```sh
pnpm dev                        # http://localhost:5179
pnpm run run playground         # the synthetic project in projects/ (see projects/README.md)
pnpm run run zora               # a project in packages/config, a folder with discovered.json + .flat/, or a .sol file
pnpm run cli runs               # runs on disk (out/runs/<id>)
pnpm run cli catalog            # the relations an agent can use, one line each
pnpm semantic                   # the fixtures in contracts/ against expected/
```

Needs `souffle` on the PATH (2.5), `codex` for the ask screen, network once per solc version (the
binary is fetched from binaries.soliditylang.org and its sha256 checked; the cache is `.cache`, a
link to the first prototype's).

## The three steps

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
| `2-analysis.dl` | 2–6: structure, call graph, state writes, sender checks, findings, answer tables | once per file |
| `2-proposed-unit.dl` | rules promoted from questions that read the tree | once per file |
| `0-discovery.dl` | 0: discovery's facts | read by the project program |
| `3-project.dl` | 7–9: deployment, values, authority across contracts | once per run |
| `4-proposed.dl` | rules promoted from questions that compose reviewed relations | once per run |

Soufflé runs the unit program once per file, then the project program once over the union of the
files' *exported* relations plus discovery. A unit relation is exported when every column is a
symbol or a numeric column that is not a node id (`Index`, `Slot`, `Line`, …): node ids restart at
0 in every file, names carry the `<unit>:` prefix, so only name-keyed relations can be put together.
`src/rules.ts` decides this from the declarations; 143 of the 273 unit relations qualify. Every
relation is written to disk, so a query or the explorer never recomputes anything.

**3. Ask** (`src/agent.ts`, `src/query.ts`, `src/proof.ts`, `src/q.ts`). The agent is the `codex`
CLI, sandboxed to the run folder, with a briefing that contains the catalogue of relations (name,
signature, one line each) and one way to make a claim: write Datalog rules, run them, cite the
tuples. Its tools are the shell and `./q`:

```
./q catalog [--all]           the relations, one line each
./q show <relation>           declaration, meaning, rules, count, sample rows
./q rows <relation> [text…]   rows containing every text, as atoms (to find exact names)
./q run <file.dl> [--name n]  run rules against the run; print the tuples they derive
./q why '<atom>'              the proof tree of a tuple; leaves derived elsewhere say how to continue
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
project stage, one per unit), so `src/proof.ts` finds the program a tuple belongs to, asks there, and
marks the leaves that another stage derived. In the explorer such a leaf has a "why?" button that
fetches its own proof and grows the tree in place; in `./q why` it says which command continues. A
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
src/pipeline.ts        one run: units → facts → derived, project stage, run.json, the q shim
src/query.ts           query programs over a run, two levels, classification
src/proof.ts           locating a tuple's program, stitched explanations
src/q.ts               the ./q commands
src/agent.ts           briefing, codex driver, ask records, citation check
src/promote.ts         a query's rules into rules/*-proposed*.dl + expected tuples
src/cli.ts             run · runs · catalog · q · ask
src/semantic.ts        fixtures against expected/, promoted rules against a run
src/compare.ts         differential check of a run against a first-prototype run
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
program.dl, derived/      the project program and what it derived
q                         ./q help
asks/<n>/                 one folder per question (briefing.md, events.jsonl, queries/, answer.md, meta.json)
```

## Numbers (Zora, 41 files, 25 deployed contracts)

| | |
| --- | --- |
| base facts | 1,003,174 |
| unit tuples (layers 1–6) | 1,806,757 |
| project tuples (layers 7–9) | 64,540 |
| unit stage (compile + facts + Soufflé, cached solc) | 42 s |
| project stage Soufflé | 0.23 s |
| a project-level query | 20–100 ms |
| a unit-level query over all units | about 1 s |

The derived rows equal the first prototype's for every exported and project relation
(`src/compare.ts`: 5,927 relations compared, 0 differing rows), and the fixtures in `contracts/`
derive the reviewed rows in `expected/`.

## Known limits

- Values are discovery's snapshot at one block; Safe signer semantics rest on discovery's fields.
- A proof is evidence relative to the rules: it shows which facts and which rules produced a tuple,
  not that the rule means what its name says. Interpretations written by the agent are marked as
  such until reviewed.
- Negative claims ("nobody else can") hold only relative to the rules' coverage; the gap relations
  (`unresolvedCheck`, `crossCallGap`, `unknownAt`, `unmatchedValue`) are the bound, and the briefing
  asks for them next to every such claim.
- The agent runs inside codex's sandbox, which forbids sockets: `./q` therefore avoids tsx's CLI and
  binds Soufflé's stdio to files. Anything that needs a socket (a dev server, an IPC pipe) will fail
  there.
