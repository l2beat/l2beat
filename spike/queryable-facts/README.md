# Spike: queryable contract facts, end to end on one contract

Throwaway code for [L2B-14851](https://linear.app/l2beat/issue/L2B-14851/1-prove-the-pipeline-end-to-end-on-one-contract):
walk the whole pipeline once, by hand, on a contract we understand.

```
flattened .sol ─► pragma → exact solc ─► standard JSON (AST + storageLayout)
               ─► extractor (TypeScript) ─► base facts (TSV, one file per relation)
               ─► Soufflé + rules/*.dl   ─► derived relations ─► report.md
```

The findings are written up as a comment on the Linear issue. This README is only
enough to run and read the thing.

## The explorer (start here if you are not going to read code)

```sh
cd spike/queryable-facts
pnpm dev            # then open http://localhost:5178
```

A local web page that walks the pipeline as a six-step wizard on a contract you pick or paste:

1. **Contract** – the prepared fixtures (including `ClaimSemanticsPlayground.sol`) and the zora flattened
   files from `packages/config`, or your own text.
2. **Compile** – which `solc` was chosen and why, the exact standard-JSON request, the AST as a tree linked
   both ways to the source (click a word → its node, click a node → its text), and the storage layout.
3. **Extract facts** – every relation as a table; hover a row to see the source it came from, click a line
   badge to see every fact that line produced, pin a row to see the AST node that emitted it.
4. **Rules** – `lib.dl` rendered as commented cards per relation, with the number of tuples each derived,
   and a short explanation of what Soufflé is (and how its one least model relates to clingo's stable models).
5. **Derive** – every derived relation, and a **why?** button per tuple that asks Soufflé (`-t explain`)
   for the proof tree down to base facts and their source lines.
6. **Report & ask** – placeholder for the next iteration.

Every run is written to `out/runs/<contract>-<timestamp>/` (source, solc input/output, facts,
`facts-provenance.tsv`, `program.dl`, derived CSVs, `report.md`, `README.txt`), which is what a later
"ask an AI" step will be pointed at. The server is Vite's dev server with a tiny API (`web/server`);
nothing is published anywhere.

## Running it

Prerequisites:

- the monorepo's `pnpm install` (this folder is a workspace package, `spike/*`);
- `souffle` on `PATH`, or `SOUFFLE=/path/to/souffle`. On a Debian/Ubuntu-like box without
  root: download the official `.deb` from the Soufflé GitHub release, check it against the
  release's `sha512sum.txt`, `dpkg-deb -x` it into `~/.local/opt/souffle-2.5` and symlink
  `~/.local/bin/souffle`. Interpreter mode needs none of the `-dev` packages the `.deb` lists;
- for the parity check only: `l2analyze` from l2beat/analyze.

```sh
cd spike/queryable-facts
pnpm exec tsx src/main.ts pipeline contracts/ClaimSemanticsPlayground.sol   # everything
pnpm exec tsx src/main.ts facts    contracts/StorageWriters.sol             # compile + extract only
pnpm exec tsx src/main.ts pipeline some.sol --backend solcjs                # offline: bundled solc-js 0.8.34
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
src/         compile.ts   pragma → version → solc standard JSON
             extract.ts   AST + storageLayout → facts        (the only stage that looks at the AST;
                                                              every row remembers the node it came from)
             pipeline.ts  the whole loop as one function (used by the CLI and the explorer)
             report.ts    Soufflé outputs → Markdown in the storage-writers analyzer's shape
             compare.ts   mechanical diff of two storage-writers tables
             main.ts      CLI
web/         vite.config.ts  dev server + API in one process (`pnpm dev`)
             server/         run the pipeline, parse the .dl program, ask Soufflé to explain a tuple
             client/         the React wizard (steps/, components/, lib/)
             smoke.ts        renders every step server-side against a run (no browser needed)
rules/       schema.dl    .decl + .input for every base relation, with a one-line meaning each
             lib.dl       the rule library: structure → call graph → writes → guards
             report.dl    .output relations
out/<unit>/  facts/*.facts  derived/*.csv  program.dl  report.md   (CLI output; `out/` is gitignored repo-wide,
                                                                       so run the CLI once to regenerate)
out/runs/    one folder per explorer run
```

## What the facts look like

Thirty-one base relations, all single-pass truths from the compiler front end; every id has a
`sourceLoc` row (file, start line, end line, byte offset, length). Ids are stable, readable
symbols scoped by code unit (the flattened file for now):

```
StorageWriters.sol:Owned                                      contract
StorageWriters.sol:StorageWriters.addTotal(uint256)           function (modifiers/constructors alike)
StorageWriters.sol:Owned.opCount                              state variable
StorageWriters.sol:SetLib.bump(SetLib.Data)/d@260             parameter or local: <function>/<name>@<offset>
StorageWriters.sol:StorageWriters.addTotal(uint256)@1676:12   site (statement, call, write, sstore): <function>@<offset>:<length>
```

The hello world from the issue, verbatim, works on them:

```
writes(F, V) :- writesDirect(F, V).
writes(F, V) :- calls(F, G, _), writes(G, V).
```

and the fuller library (`rules/lib.dl`) adds storage-reference aliasing, `using for`, modifiers,
the constructor chain, virtual dispatch via the linearization, inline-assembly slot resolution,
opaque writes (delegatecall, unresolved `sstore`) and a syntactic, explicitly *heuristic*
`guardedBy`.

## Results in one line each

- `storageWriters` from Soufflé is identical to the Python `storage-writers` output on both
  fixture contracts and on 11 of 23 zora flattened files; on the other 12 every difference is a
  write or `delegatecall` the Python analyzer misses (or, once, over-attributes). See FINDINGS.md.
- Whole compile → extract → Soufflé loop: 128 ms on the fixtures, 336 ms median and 959 ms worst
  case on the corpus (a 246 KB flattened file). Soufflé itself is ~100 ms, mostly start-up.
- Fact files: 5–7× the source size; 63k rows / 12 MiB for the whole 2 MB corpus.
- Zero `unhandled` constructs on the corpus, except solc 0.5.x inline assembly, which has no Yul
  AST and is reported as opaque.
- `FINDINGS.md` is the write-up (also posted as a comment on L2B-14851).
