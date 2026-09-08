# Spike: queryable contract facts, end to end on one contract

Throwaway code for [L2B-14851](https://linear.app/l2beat/issue/L2B-14851/1-prove-the-pipeline-end-to-end-on-one-contract):
walk the whole pipeline once, by hand, on a contract we understand.

```
flattened .sol ─► pragma → exact solc ─► standard JSON (AST + storageLayout)
               ─► emitter (src/emit.ts, no Solidity knowledge) ─► layer 0: the AST as facts (TSV)
               ─► Soufflé + rules/*.dl
                    layer 1  concepts.dl   syntax → function, stmt, callSite, writeSite, …
                    layers 2–6  lib.dl     structure → call graph → writes → sender checks → findings (tiered)
                    report.dl              what the report, the qf commands and the explorer read
               ─► derived relations ─► report.md, ./qf commands in the run folder
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
7. **Report & ask** – `report.md` rendered (every id in it is a link into the source), and a box to ask an
   AI about the contract. The agent is the `codex` CLI (`codex exec --json`), started *in the run folder*
   with a sandbox that can write only there. It is not briefed on the schema: it gets the `./qf` commands
   (below) and is told to answer through them, to cite evidence as the atoms they print plus source
   lines, and to write Datalog only when no relation states what it needs. Citations become links: a
   relation name opens that row in step 6 (or 4, or 3), an id lights up in the source, `L25` jumps
   there; a cited tuple the run does not contain is marked. Follow-ups resume the same codex thread.
   Model and reasoning effort are selectable (default `gpt-5.6-sol` at `high`; `CODEX_MODEL` /
   `CODEX_EFFORT` change the default, `CODEX` the binary). Each question leaves a transcript in `<run>/ask/`.

Every run is written to `out/runs/<contract>-<timestamp>/` (source, solc input/output, `facts/`,
`program.dl`, `derived/`, `report.md`, `README.txt`, `qf`, `ask/`), which is exactly what the agent of
step 7 sees. The server is Vite's dev server with a tiny API (`web/server`); nothing is published anywhere.

### The `qf` commands

Every run folder (CLI or explorer) gets a `qf` script: the questions the rule library already knows how to
answer, in the vocabulary of the questions rather than of the schema. It only filters and formats derived
relations; every row it prints is computed by `rules/*.dl`, and is printed as a Datalog atom so an answer
can quote it and the explorer can link it.

```
./qf help                        the commands, the answer relations with their docs, the tier legend
./qf writers [<variable>]        who may write a storage variable, how (direct, storage reference,
                                 assembly), via which function, at which line
./qf function <name>             signature, modifiers, callers, callees, writes, findings of one function
./qf guards <entry point>        the findings about sender checks on the way to each variable it may
                                 write, the checks behind them, the unknown effects on the way
./qf gaps [<entry point>]        effects the analysis could not follow, and extractor coverage
./qf rows <relation> [<text>]    rows of any derived relation containing <text>, as atoms with a header
./qf source <function>|<a>-<b>   numbered source lines
./qf explain '<atom>'            why a tuple holds: Soufflé's proof, stopping at concept relations
./qf query <file.dl>             extra rules (.decl + .output) run against this run's facts
```

Names are matched loosely (`conditionalGuard`, `Contract.f`, `Contract.f(uint256)` or the full id), and an
ambiguous name lists the candidates instead of guessing.

## Running it

Prerequisites:

- the monorepo's `pnpm install` (this folder is a workspace package, `spike/*`);
- `souffle` on `PATH`, or `SOUFFLE=/path/to/souffle`. On a Debian/Ubuntu-like box without
  root: download the official `.deb` from the Soufflé GitHub release, check it against the
  release's `sha512sum.txt`, `dpkg-deb -x` it into `~/.local/opt/souffle-2.5` and symlink
  `~/.local/bin/souffle`. Interpreter mode needs none of the `-dev` packages the `.deb` lists;
- for the analyzer comparison only: `l2analyze` from l2beat/analyze;
- for step 7 only: the `codex` CLI on `PATH` and logged in (`codex login`). Nothing else talks to a network.

```sh
cd spike/queryable-facts
pnpm exec tsx src/main.ts pipeline contracts/ClaimSemanticsPlayground.sol   # everything
pnpm exec tsx src/main.ts facts    contracts/StorageWriters.sol             # compile + emit base facts only
pnpm exec tsx src/main.ts pipeline some.sol --backend solcjs                # offline: bundled solc-js 0.8.34
pnpm parity                                                                 # concepts.dl vs the frozen legacy facts (golden/)
pnpm semantic                                                               # findings/writers vs reviewed rows (expected/)
out/ClaimSemanticsPlayground/qf guards conditionalGuard                     # the qf commands work on CLI runs too
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
             ReviewCases.sol                one function per case the guard rules got wrong at review time
                                            (early return before a revert, `!=`, function pointers, OpenZeppelin
                                            Ownable/AccessControl, virtual dispatch), plus controls
golden/      <fixture>/*.facts   the legacy extractor's 31 relations, frozen: the parity oracle for concepts.dl
expected/    <fixture>/*.tsv     reviewed rows of storageWriters / findings / opaqueWrites / unhandled: the
                                 semantic oracle (`pnpm semantic`; `--update` rewrites them, then read the diff)
src/         compile.ts   pragma → version → solc standard JSON
             emit.ts      solc JSON → layer 0 facts, one rule per JSON shape (the only stage that sees the AST)
             pipeline.ts  the whole loop as one function (used by the CLI, the explorer and the parity check)
             parity.ts    derived concept relations vs golden facts, row for row
             semantic.ts  answer relations vs expected/ rows, per fixture
             report.ts    Soufflé outputs → report.md (may-writers, unknown effects, findings with tiers)
             qf.mjs       the `qf` commands, copied into every run folder next to a `qf` wrapper
             compare.ts   mechanical diff of two storage-writers tables
             main.ts      CLI
web/         vite.config.ts  dev server + API in one process (`pnpm dev`)
             server/         run the pipeline, parse the .dl program, ask Soufflé to explain a tuple,
                             drive codex on a run folder and stream what it does (ask.ts)
             client/         the React wizard (steps/, components/, lib/); Markdown.tsx renders report.md and
                             answers, Cite.tsx turns cited atoms / ids / lines into links, lib/ask.ts keeps
                             the conversations
             smoke.ts        renders every step server-side against a run (no browser needed)
rules/       schema.dl    layer 0: .decl + .input for the ten base relations, with the encoding explained
             concepts.dl  layer 1: names, statements, calls, writes, storage references, inline assembly
             lib.dl       layers 2–6: structure → call graph → writes → sender checks → findings
             report.dl    .output relations, storageWriters, writerDetail, findings
out/<unit>/  facts/*.facts  derived/*.csv  program.dl  report.md   (CLI output; `out/` is gitignored repo-wide,
                                                                       so run the CLI once to regenerate)
out/runs/    one folder per explorer run; <run>/ask/ holds the transcripts of step 7, <run>/scratch/ what the
             agent wrote while answering (extra rules, Soufflé outputs)
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

**Layers 2–6 – the analysis** (`rules/lib.dl`, `rules/report.dl`). The hello world from the issue, verbatim:

```
writes(F, V) :- writesDirect(F, V).
writes(F, V) :- calls(F, G, _), writes(G, V).
```

plus storage-reference aliasing, `using for`, modifiers, the constructor chain, virtual dispatch via the
linearization, internal function pointers (resolved to the functions ever assigned, or reported as an
unknown effect), inline-assembly slot resolution, unknown effects (delegatecall, unresolved `sstore`,
unresolved calls: never dropped, always reported), and layers 5–6: where the sender is checked on the way
to each write, stated as *findings*.

A finding is one row per (deployable contract, entry point, variable): what was found, in the words of the
code, with a **tier** that says what kind of statement it is:

| Tier | Means | Examples |
| --- | --- | --- |
| structural | read off the syntax tree | a check with this condition sits inside `if (enforce)` with no else; a write precedes the early return |
| may | over-approximation: paths that can never run are included | every writer in `storageWriters` |
| guaranteed | holds on every completing execution, under the model (structured control flow, internal calls resolved through dispatch, no unknown effect on the path) | a straight-line `require` on the sender with no `return` before it; a function that always reverts |
| heuristic | pattern-based | "runs only on some paths" (coverage from straight-line position); "no sender check found" (relative to what the rules recognise as a check) |
| unknown | an effect the analysis cannot follow; nothing universal holds past it | delegatecall, unresolved `sstore`, a pointer with no visible target |

Findings quote the condition as written, so `msg.sender != owner` is visible for what it is: naming what the
sender is compared with is not a statement that the comparison grants access. Sender checks are recognised
through `msg.sender` itself, through a getter that returns it (`_msgSender()`), and through a parameter that
every caller fills with the sender (`_checkRole(role, _msgSender())` → `hasRole(role, account)`); the
principal through the variable named, or through a getter that returns it (`owner()` → `_owner`).

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
- A "why?" on a concept row answers in well under a second; on a top-level finding, whose proof runs
  through the whole program, in 4–6 s.
- Zero `unhandled` constructs on the corpus, except solc 0.5.x inline assembly, which has no Yul
  AST and is reported as opaque.
- A review of the guard rules found two classes of error, both now fixed and pinned by the semantic
  suite (`contracts/ReviewCases.sol`, `expected/`): "straight-line" was taken for "always reached"
  although an earlier `return` can skip a statement (a "dead write" labelled sound, a check labelled
  always-run), and calls through internal function pointers were followed by nobody and reported by
  nobody. See FINDINGS.md.
- The agent, asked the same question about `conditionalGuard` through the `qf` commands instead of
  the schema briefing: 3 commands, 38 s, 47k input tokens, correct answer citing the finding — against
  12 commands, 113 s and 413k input tokens before.
