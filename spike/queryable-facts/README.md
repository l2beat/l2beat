# Spike: queryable contract facts, end to end on one contract

Throwaway code for [L2B-14851](https://linear.app/l2beat/issue/L2B-14851/1-prove-the-pipeline-end-to-end-on-one-contract):
walk the whole pipeline once, by hand, on a contract we understand.

```
flattened .sol ─► pragma → exact solc ─► standard JSON (AST + storageLayout)
               ─► emitter (src/emit.ts, no Solidity knowledge) ─► layer 0: the AST as facts (TSV)
               ─► Soufflé + rules/*.dl
                    layer 1  concepts.dl   syntax → function, stmt, callSite, writeSite, …
                    layers 2–5  lib.dl     structure → call graph → writes → guards → claims
                    report.dl              what the report renders
               ─► derived relations ─► report.md
```

The one design rule: **a base fact is something solc said, verbatim**. Everything that *means*
something ("this assignment writes that variable") is a rule, so Soufflé can explain it back down to
the raw rows. The findings are written up in `FINDINGS.md` (also a comment on the Linear issue).
This README is only enough to run and read the thing.

## The explorer (start here if you are not going to read code)

```sh
cd spike/queryable-facts
pnpm dev            # then open http://localhost:5178
```

A local web page that walks the pipeline as a seven-step wizard on a contract you pick or paste:

1. **Contract** – the prepared fixtures (including `ClaimSemanticsPlayground.sol`) and the zora flattened
   files from `packages/config`, or your own text.
2. **Compile** – which `solc` was chosen and why, the exact standard-JSON request, the AST as a tree linked
   both ways to the source (click a word → its node, click a node → its text), and the storage layout.
3. **Tree as facts** – layer 0. Click any word: its AST node's JSON on the left, the rows the emitter wrote
   for it on the right (`node`, `loc`, `child`, `attr`, `num`, …). Nothing here interprets Solidity.
4. **Concepts** – layer 1. The 31 relations the analysis speaks in (function, stmt, callSite, writeSite, …),
   each row derived by a rule from the raw rows. Pin a row and Soufflé shows *why*: the rule that fired and
   the `node`/`child`/`attr` rows it fired on, with source lines. The rules themselves are on the same page.
5. **Rules** – `lib.dl` as commented cards per relation, and a short explanation of what Soufflé is (and how
   its one least model relates to clingo's stable models).
6. **Derive** – every analysis relation, and a **why?** button per tuple for the proof tree down through the
   concepts to the base facts. Naming helpers in a proof fold by default ("plumbing · 12 steps").
7. **Report & ask** – placeholder for the next iteration.

Every run is written to `out/runs/<contract>-<timestamp>/` (source, solc input/output, `facts/`,
`program.dl`, `derived/`, `report.md`, `README.txt`), which is what a later "ask an AI" step will be
pointed at. The server is Vite's dev server with a tiny API (`web/server`); nothing is published anywhere.

## Running it

Prerequisites:

- the monorepo's `pnpm install` (this folder is a workspace package, `spike/*`);
- `souffle` on `PATH`, or `SOUFFLE=/path/to/souffle`. On a Debian/Ubuntu-like box without
  root: download the official `.deb` from the Soufflé GitHub release, check it against the
  release's `sha512sum.txt`, `dpkg-deb -x` it into `~/.local/opt/souffle-2.5` and symlink
  `~/.local/bin/souffle`. Interpreter mode needs none of the `-dev` packages the `.deb` lists;
- for the analyzer comparison only: `l2analyze` from l2beat/analyze.

```sh
cd spike/queryable-facts
pnpm exec tsx src/main.ts pipeline contracts/ClaimSemanticsPlayground.sol   # everything
pnpm exec tsx src/main.ts facts    contracts/StorageWriters.sol             # compile + emit base facts only
pnpm exec tsx src/main.ts pipeline some.sol --backend solcjs                # offline: bundled solc-js 0.8.34
pnpm parity                                                                 # concepts.dl vs the frozen legacy facts (golden/)
pnpm exec tsx src/compare.ts analyzer.md out/<unit>/report.md              # diff vs storage-writers
./corpus.sh <flat-root> /tmp/corpus <entrypoint.sol>...                     # analyzer vs pipeline over many files
```

The first native run downloads the solc binary the pragma resolves to (same mechanism as
`packages/l2b`, from binaries.soliditylang.org) into `.cache/solc/` and verifies its sha256
against the published `list.json`. Resolution prefers an already-cached compiler that satisfies
the pragma, like the analyze repo's `resolve_solc`.

## Layout

```
contracts/   ClaimSemanticsPlayground.sol   the guard-semantics playground the spike was asked about
             StorageWriters.sol             l2beat/analyze's storage-writers fixture (copied verbatim)
golden/      <fixture>/*.facts   the legacy extractor's 31 relations, frozen: the parity oracle for concepts.dl
src/         compile.ts   pragma → version → solc standard JSON
             emit.ts      solc JSON → layer 0 facts, one rule per JSON shape (the only stage that sees the AST)
             pipeline.ts  the whole loop as one function (used by the CLI, the explorer and the parity check)
             parity.ts    derived concept relations vs golden facts, row for row
             report.ts    Soufflé outputs → Markdown in the storage-writers analyzer's shape
             compare.ts   mechanical diff of two storage-writers tables
             main.ts      CLI
web/         vite.config.ts  dev server + API in one process (`pnpm dev`)
             server/         run the pipeline, parse the .dl program, ask Soufflé to explain a tuple
             client/         the React wizard (steps/, components/, lib/)
             smoke.ts        renders every step server-side against a run (no browser needed)
rules/       schema.dl    layer 0: .decl + .input for the ten base relations, with the encoding explained
             concepts.dl  layer 1: names, statements, calls, writes, storage references, inline assembly
             lib.dl       layers 2–5: structure → call graph → writes → guards → claims
             report.dl    .output relations
out/<unit>/  facts/*.facts  derived/*.csv  program.dl  report.md   (CLI output; `out/` is gitignored repo-wide,
                                                                       so run the CLI once to regenerate)
out/runs/    one folder per explorer run
```

## The three layers

**Layer 0 – the AST as facts** (`src/emit.ts`, `rules/schema.dl`). Ten relations, produced by a walk that
knows nothing about Solidity:

```
{ nodeType, id, src, … }      → node(Id, Type)   loc(Id, Src, Start, Len, Line, EndLine)   text(Id, Text)
field holding another node    → child(Parent, Field, Index, Child)
string / boolean field        → attr(Id, Key, Value)          e.g. attr(18, "operator", "=")
number field                  → num(Id, Key, Value)           e.g. num(31, "referencedDeclaration", 5)
arrays                        → attrList / numList with the element's Index
solc's storageLayout          → storageLayout(Contract, AstId, Label, Slot, Offset, Type)
```

Yul nodes carry no id in solc's JSON and get synthetic ids above the largest one.

**Layer 1 – concepts** (`rules/concepts.dl`). The 31 relations the old extractor emitted directly are now
derived. Ids are built in Datalog with `cat` and are the same readable strings as before:

```
StorageWriters.sol:Owned                                      contract
StorageWriters.sol:StorageWriters.addTotal(uint256)           function (modifiers/constructors alike)
StorageWriters.sol:Owned.opCount                              state variable
StorageWriters.sol:SetLib.bump(SetLib.Data)/d@260             parameter or local: <function>/<name>@<offset>
StorageWriters.sol:StorageWriters.addTotal(uint256)@1676:12   site (statement, call, write, sstore): <function>@<offset>:<length>
```

Every id has a `sourceLoc` row and a `located` row naming the node it came from. What used to be the
extractor's judgment calls — which node is the root of an lvalue, what a call resolves to, which
identifier a condition mentions — are rules in sections 1e–1i, with the helpers (tree reading, type
strings, names, statement tree) in 1a–1d.

**Layers 2–5 – the analysis** (`rules/lib.dl`, `rules/report.dl`), unchanged by the rewrite. The hello
world from the issue, verbatim:

```
writes(F, V) :- writesDirect(F, V).
writes(F, V) :- calls(F, G, _), writes(G, V).
```

plus storage-reference aliasing, `using for`, modifiers, the constructor chain, virtual dispatch via the
linearization, inline-assembly slot resolution, opaque writes (delegatecall, unresolved `sstore`) and a
syntactic, explicitly *heuristic* `guardedBy`.

## Results in one line each

- The derived concept relations reproduce the legacy extractor's output **byte for byte on all 43
  corpus files** (2 fixtures + 41 zora flattened files, solc 0.5.14 – 0.8.25): 1,007,554 base rows in,
  80,108 concept rows out, zero differences (`src/parity.ts`).
- `storageWriters` from Soufflé is identical to the Python `storage-writers` output on both
  fixture contracts and on 11 of 23 zora entry points; on the other 12 every difference is a
  write or `delegatecall` the Python analyzer misses (or, once, over-attributes). See FINDINGS.md.
- Cost of the pure encoding: about 15× more base rows (30 MiB of TSV for the 2 MB corpus, 12 MiB
  before) and Soufflé at 400–680 ms per file instead of ~100 ms, interpreter mode. Emitting takes
  ~110 ms for the largest file.
- A "why?" on a concept row answers in well under a second; on a top-level claim, whose proof runs
  through the whole program, in 4–6 s.
- Zero `unhandled` constructs on the corpus, except solc 0.5.x inline assembly, which has no Yul
  AST and is reported as opaque.
