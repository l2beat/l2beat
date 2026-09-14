# Plan 2: a sound permission layer

Self-contained hand-off. A fresh session should be able to implement this from the file alone.
Keep the "Where work stopped" section at the end current after every working block.

## Why

On the synthetic project `projects/playground` the question "who can change `score` in Playground?"
was answered "anyone", with seven verified citations. The right answer is exactly one account,
`eth:0xcccc…cccc`, the owner of OwnerGate. `setScore` calls `gate.authorize(msg.sender)` before
writing; discovery binds `gate` to OwnerGate; `OwnerGate.authorize(caller)` requires
`caller == owner`; a revert there reverts `setScore`. With `gate` pointed at ClosedGate the answer
is nobody. The library said "anyone" in both cases.

The cause is a design principle, not a missing rule. Layers 2 and 3 recognise *shapes* of checks
(require on `msg.sender`, if-revert on `msg.sender`, ecrecover, EIP-1967 admin) and default to
`allowed("anyone", …, "open")` when nothing is recognised (`rules/3-project.dl`, section 9a,
`!hasAnyCheck, !hasSignerCheck`). An unrecognised restriction becomes a permission. Every pattern
catalogue has a next counterexample. The agent then composed these verdict relations and cited
their tuples: true tuples of unsound relations. The citation check verifies derivations, not truth.

Literature: Securify (compliance / violation / warning patterns), HoRStify (showed Securify's
pattern-based dependency analysis unsound; rebuilt as Horn clauses with conservative external
calls), Formulog (Datalog + SMT), Solidity's SMTChecker (CHC engine), Certora (deployment
binding must be supplied explicitly; discovery is that binding for us).

## What stays, what goes

Stays unchanged: facts (`src/compile.ts`, `src/emit.ts`, `src/discovery.ts`), staged evaluation
(`src/pipeline.ts`, `src/rules.ts`, `src/souffle.ts`), proofs (`src/proof.ts`), query programs
(`src/query.ts`), the `./q` shim (`src/q.ts`), the agent driver and citation check (`src/agent.ts`),
promotion, the web app shell and screens 1–2, run/ask records. Layers 0 (solidity facts), 1
(syntax) and the structural half of 2 (call sites, writes, reachability, argument binding) stay.

Goes: every verdict relation. In `rules/2-analysis.dl`: `senderCheck`, `senderGate`,
`checkPrincipal`, `weakCheck`, `alwaysChecks`, `sometimesChecks`, `hasAnyCheck`, `signerCheck*`,
`gateCovers`, `finding`, `findings`, `checkText`, and the "no-check" heuristics. In
`rules/3-project.dl`: section 9a `allowed`, 9d `passes`/`passesAnyone`/`canCall` as they stand,
9e `whoCanWrite`/`ultimately`/`hop` as they stand. They are replaced by the layer below. Keep
`crossCall`, `crossCallGap`, `entryAt`, `sameSelector`, `codeOf`, `baseOf`, `fieldOf`, `valueOf`,
`refersTo`, `acts` (Safe threshold / module machinery in 9b), proxies, `storageWriters`,
`opaqueWrites`, `unknownAt`, `unmatchedValue`. `src/compare.ts` (differential check against v1)
becomes obsolete; delete it and its README line. `expected/*/findings.tsv` go with `findings`.

Work in `spike/queryable-facts-v2` in place (v2 is committed as "Prototype 2 with synthetix
example"; git has the old library). No new prototype.

## Principles

1. **Guards by dominance, not by shape.** A write happens only if every condition dominating it
   holds: `require`/`assert`, `if (c) revert|return` (c false), the branch of an enclosing `if`,
   a loop condition for statements in the body, modifier statements before `_`, **and the normal
   completion of every dominating external call**. Shape and nesting are irrelevant; the
   control structure decides.
2. **Identity provenance across calls.** Track which expressions carry the transaction sender:
   `msg.sender` in the entry function, parameters bound to it at call sites (facts `argSender`,
   `senderParam` exist), `tx.origin`, an ecrecover signer. In a callee, `msg.sender` is the
   calling contract's *address* (the proxy address for proxied code). The original identity
   travels only through arguments. A chain of contracts is repeated substitution.
3. **Constraints decided by a solver, state supplied by discovery.** Guards are expressions over
   the sender, storage, parameters, block data and callee results. Soufflé computes the
   structure; Z3 decides the formulas with storage values from `dValue` substituted.
4. **Explicit unknown with a conservative default.** Anything unresolved is a named residual:
   unresolved call target, storage value discovery did not record, loop beyond the unrolling
   bound, assembly, delegatecall to unknown code, solver timeout, too many paths. "Anyone" is a
   claim that needs proof: every dominating statement shown non-reverting or sender-independent
   and no residual. It is never a default.
5. **Three verdicts, and a witness.** Per (actor, effect): can (with a satisfying model), cannot
   (excluded on every path), unknown (residual named). "Only X" needs both a witness for X and
   an exclusion of everyone else; without the witness "only X" is vacuous when nobody can.
   Exclusions are robust to unknown state (unsat with the unknowns free); existence claims need
   concrete state (or are reported "can, if U = …").
6. **Closure over what guards depend on.** "Who can change V" also reports who can change the
   storage the guards read (`gate`, `owner`), as a separate set, not merged.
7. **Bounded everything.** Solver timeout per query (2 s), loop unrolling k = 3, call depth 6,
   paths per effect ≤ 64. Running out of budget produces a residual, never a verdict. More budget
   means fewer unknowns; the given answers are right at any budget.

Most real systems use a dozen shapes (Ownable, roles, Safe thresholds, timelocks, pausable, proxy
admins) whose guards are address equalities against recorded values. Those decide in
milliseconds. Budget is spent only on unusual code, which is where a reviewer wants a flag.

## Architecture: four stages per run

```
units (Soufflé, per file)     layers 0–2: facts, syntax, structure, guard structure
project (Soufflé, once)       layers 7–8: discovery binding, codeOf, valueOf, crossCall, actors
solve (TypeScript + Z3)       per (address, effect, path): SMT-LIB → verdict facts
verdict (Soufflé, once)       layer 9: canChange / cannotChange / unknownChange, closure
```

The solve stage reads `derived/` of the project stage plus the units' AST JSON, writes
`solve/<addr>/<effect>/<path>.smt2` and `.result.json`, and `facts/solved/*.facts`. The verdict
stage is a second project program (`rules/5-verdict.dl`) whose `.input` relations are the project
stage's outputs plus the solved facts. `run.json` gains `counts.solved`, `timings.solve`,
`timings.verdict`. Queries at "project" level see both project programs' outputs.

## Unit level: guard structure (new `rules/2-guards.dl`, replaces the checks in 2-analysis)

Over the statement tree (`stmt`, `within`, order, `condition`, `callSite`, `writeSite`, `aborts`,
`returnsWithin`, modifiers). Relations, all exported (symbol columns; numeric via `NUMERIC_NAMES`):

- `before(S, T)` S is a preceding sibling of T or of an ancestor of T within the same function
  body (structured "may execute before").
- `enclosing(T, If, Branch)` T sits in the then/else branch of If; `loopBody(T, Loop)`.
- `abortBranch(If, Branch)` that branch always aborts or returns (`abortsWithin`/`returnsWithin`
  and `alwaysExecuted`).
- `guard(E, Cond, Pol, Why)` condition `Cond` (expression node) must be `Pol` ∈ {true,false} for
  effect `E` to execute, on **all** paths: require/assert before E (true); `if (c) abort` before E
  with no else (false); enclosing branch (true/false); loop condition for body statements (true);
  modifier statements before `_`. `Why` names the shape for the proof drawer.
- `callBefore(E, K)` external call site K dominates E (K before E, or K in a modifier before `_`);
  the completion of K is a guard. `tryCall(K)` when K is inside `try` (its failure is caught:
  not a guard); `lowLevelIgnored(K)` when a low-level call's success flag is unused (not a
  guard); both are residual-free by construction but must be modelled.
- `branchPoint(E, If)` an `if` before E where neither branch aborts: a path split. Paths are
  enumerated in the solve stage from these (≤ 64, else residual `too-many-paths`).
- `loopUnroll(E, Loop)` E is inside or after a loop whose body contains guards or calls:
  unrolled k = 3 in the solve stage; `loopBoundFrom(Loop, ArrayVar)` when the bound is a
  storage array's length (exact when discovery recorded the array).
- `identity(X, Kind)` expression X carries an identity: `sender`, `origin`, `signer(K)`,
  `param(P)` when P is bound to an identity at *every* call site of the function (else the
  identity is `param-free`: a free address, i.e. anyone controls it).
- `effect(E, F, V)` write sites of state variables (from `writeSite`) and other effects worth
  asking about later (selfdestruct, delegatecall); `writeThenRevert(E)` when an abort dominates
  the exit after E (the write never persists).
- `opaque(F, Why)` the function contains something the structure cannot follow (assembly,
  unknown low-level target, `delegatecall`): a residual for every effect in F.

Everything here is structural, decidable, and cheap. Test each on the fixture family by
inspecting tuples before writing the solve stage.

## Solve stage (`src/solve.ts`, `src/smt.ts`)

For each `(Addr, E)` with `codeOf(Addr, Role, C)`, `effect(E, F, V)` and F reachable from an entry
point of C (`reachesFrom`), and for each path through `branchPoint`s:

1. **Environment.** `sender: (_ BitVec 160)` free. Parameters of the entry function free.
   Storage of `Addr` from `valueOf(Addr, V, Kind, Val)`: constants; not recorded → free symbol +
   residual candidate. Mappings: `(Array (_ BitVec 160) T)` with recorded entries as `store`
   over a base whose other keys are free (residual only if the verdict depends on them). `block.*`,
   `tx.gasprice`, etc.: free symbols. `keccak256`, `ecrecover`: uninterpreted functions.
2. **Formula.** Conjunction of `guard` conditions on the path with polarity, plus for each
   `callBefore(E, K)`: if `crossCall(Addr, F', T, H, K, "resolved")` gives the target address T
   and entry H, the callee's own guard formula for *reaching normal completion* of H, with
   `msg.sender := Addr`, parameters := the call's argument expressions (from `argBinding`), storage
   := `valueOf(T, …)`; recursion up to depth 6, per-path cross product bounded; a callee with
   `alwaysReverts` is `false`. Unresolved target (`crossCallGap`) → residual `call-target`.
   Internal calls are inlined the same way (summaries of internal functions are the same
   construction).
3. **Encoding.** Solidity expressions from the AST JSON: `address` → BitVec 160, integers →
   BitVec 256 (QF_BV, wrap semantics; `unchecked` irrelevant for guards), `bool`, `bytes32` →
   BitVec 256, comparisons, boolean operators, `==`/`!=`, arithmetic, casts, `mapping[key]` →
   `select`, `array.length` → constant when recorded, struct members → per-member symbols,
   strings → uninterpreted sort (comparison of two known constants is decided by equality of
   constants). Unsupported node → residual `unsupported-expr` (formula stays sound: the
   subexpression becomes a free boolean/value).
4. **Decision.** Let `Known` = all `dEntry` addresses. Checks in order, each `check-sat` with
   `-T:2`:
   - `guard ∧ sender ∉ Known` sat with all storage resolved → verdict `open` (anyone), witness.
     Sat but with free storage on the path → `unknown(depends-on U)`.
   - Else for each `a ∈ Known`: `guard ∧ sender = a` sat → `admits(a)` with witness; unsat → excluded.
     `guard ∧ sender ∉ Known` unsat with unknowns free is an exclusion valid for all `U`.
   - `guard` unsat → `nobody`.
   - Any `unknown` from Z3 (timeout) → residual `solver-timeout`.
   The result per path: `{verdict: open|nobody|only|unknown, admits: [...], witness, residuals: [...]}`.
5. **Outputs as facts** (`facts/solved/`):
   `solvedPath(Addr, E, Path, Verdict)`, `solvedAdmits(Addr, E, Path, Sender)`,
   `solvedResidual(Addr, E, Path, Kind, Where)`, `solvedReads(Addr, E, Path, Addr2, V2)` (storage
   the formula depends on, for the closure), `solvedWitness(Addr, E, Path, Sender, Text)`.
   The `.smt2` and result files are the proof artefacts; `src/proof.ts` learns a `solve` stage
   that renders them (formula, model, residuals) instead of a Datalog tree.

Z3: `~/.local/bin/z3` (release 5.1.0, x64 glibc, unpacked in `~/.local/opt`), invoked with
`-in -T:2` and SMT-LIB2 on stdin; spawn through `spawnToFiles` so `./q solve` (later) works in
the codex sandbox. Configurable via `Z3_BIN`. No npm dependency.

## Verdict level (new `rules/5-verdict.dl`)

```
writer(Addr, V, E)            :- codeOf(Addr, _, C), effect(E, F, V'), V' of C's storage, reachable, !writeThenRevert(E).
canChange(A, Addr, V, E, P)   :- writer(Addr, V, E), solvedAdmits(Addr, E, P, A).
canChange("anyone", Addr, V, E, P) :- writer(Addr, V, E), solvedPath(Addr, E, P, "open"), !hasResidual(Addr, E, P).
unknownChange(Addr, V, E, P, Kind, Where) :- writer(Addr, V, E), solvedResidual(Addr, E, P, Kind, Where).
cannotChange(A, Addr, V)      :- actor(A), writer(Addr, V, _), !canChangeAny(A, Addr, V), !canChange("anyone", Addr, V, _, _), !unknownChangeAny(Addr, V).
indirectlyCanChange(A, Addr, V, Addr2, V2) :- writer(Addr, V, E), solvedReads(Addr, E, _, Addr2, V2), canChangeAny(A, Addr2, V2).
```

Contracts as senders: `canChange(S, …)` with S a contract is lifted to whoever can make S call
(`acts`, Safe thresholds, and `canChange`-style reasoning over S's entry that performs the
call) — reuse 9b/9d structure with the new admits instead of `allowed`. Keep depth bounded.

## Fixture family (`projects/pg-*`), expected answers, `pnpm semantic`

Each case is a synthetic project (discovered.json + `.flat/`), plus `expected.json`:
`{ "target": {"address": "...", "variable": "score"}, "can": [...], "cannot": [...] | "all-others",
"unknown": [...] | "all-others", "residuals": ["kind", ...] }`. `src/semantic.ts` runs each project
through all four stages and compares. Start with these, add adversarial ones as they come:

| Case | Expectation |
| --- | --- |
| pg-01 owner gate (today's playground) | can = {cccc}, cannot = all others, no residual |
| pg-02 closed gate | can = ∅, cannot = all, no residual |
| pg-03 gate call under `if (flag)` with flag recorded true | as pg-01, plus closure: who can set flag |
| pg-04 same, flag not recorded | can = {cccc} (path flag), unknown = all others (`depends-on flag`) |
| pg-05 `if (msg.sender == a) {} else { gate.authorize(msg.sender) }` | can = {a, cccc} |
| pg-06 loop over `gates[]` all recorded (owner gate + open gate) | conjunction: can = {cccc} |
| pg-07 chain of three contracts, identity passed along | can = {final owner} |
| pg-08 gate call inside `try {} catch {}` | can = anyone (caught failure is not a guard) |
| pg-09 low-level call, success ignored | can = anyone |
| pg-10 write followed by unconditional revert | writer excluded: can = ∅ (write never persists) |
| pg-11 proxy in front of Playground (`implementationNames`) | as pg-01, msg.sender at the callee is the proxy |
| pg-12 check in a modifier, and one in a helper internal function | as pg-01 |
| pg-13 renamed everything, nested ifs that always revert on failure | as pg-01 |
| pg-14 opaque condition (assembly) on a second path | can = {cccc}, unknown = all others (`opaque`) |
| pg-15 Ownable + AccessControl role recorded by discovery | can = role members |

Keep `contracts/` fixtures for `storageWriters` / `opaqueWrites` (still valid). Delete
`expected/*/findings.tsv`.

## Agent and UI

- Catalogue: only sound relations. Descriptions of `canChange`/`cannotChange`/`unknownChange`
  state what each verdict means and that "anyone" is a proven claim.
- Briefing: answer format with three sets, residuals, assumptions, closure; the agent cites
  `canChange`/`cannotChange`/`unknownChange` and, for "why", the guard atoms and the solver
  artefact; it may not conclude "anyone" from anything but `canChange("anyone", …)`.
- Citation check: unchanged, plus ignore backticked `name(args)` where `name` is not a known
  relation and the args are not quoted atoms (the `setScore(uint256)` false positive).
- `./q solve <addr> <effect> [--assume V=val]` (later): re-run one guard with an assumption; the
  agent's way to spend budget. Records the assumption in the answer.
- UI: proof drawer renders a `solve` stage (guard atoms with Datalog proofs, the SMT-LIB, model,
  residuals); Ask screen renders the three-set answer; Rules screen shows the new layers.

## Phases

P0 Z3 installed (done, see below), smoke test; fixture family pg-01…pg-06 with `expected.json`;
   `pnpm semantic` extended (fails for now). Delete `src/compare.ts`.
P1 `rules/2-guards.dl`: structural relations; inspect tuples on pg-01…pg-06; unit tests by
   expected tuples for `guard`, `callBefore`, `branchPoint`, `identity`.
P2 `src/smt.ts` (expression → SMT-LIB), `src/solve.ts` (paths, callee substitution, decision),
   pipeline stage, run layout, `proof.ts` solve stage. pg-01…pg-06 green.
P3 `rules/5-verdict.dl`; remove verdict relations from 2-analysis/3-project; catalogue; briefing;
   README; pg-07…pg-15 authored and green (or their residuals as expected).
P4 UI: solve proofs, three-set answer, layers; citation-check fix.
P5 Zora run: verdict/residual volume per variable, timing; tune bounds; write findings in README.

After each block: `pnpm typecheck && pnpm lint && pnpm semantic`; `pnpm format:fix` before lint.
Never start the dev server (the user starts it). The user commits. One sub-agent at a time, only
for mechanical, fully specified tasks, and verify its output. Installing further tools as this
user is approved for legitimate projects; still say what and why.

## Where work stopped

- 2026-09-11: plan written. Z3 5.1.0 installed at `~/.local/opt/z3-5.1.0-x64-glibc-2.39`,
  linked as `~/.local/bin/z3`; smoke test of the gate guard (sat for cccc, unsat for others)
  passed. Nothing else of Plan 2 implemented. `out/smt/Harness.sol` is a scratch file for solc's
  own SMTChecker (needs `libz3.so.4.12`, not present; optional calibration, not required).
- 2026-09-11, P0 done: `projects/pg-01`…`pg-06` written (sources, discovered.json, expected.json;
  `expected.json` also has an optional `case` text and `indirect` list, and `unknown` is derived as
  every discovered address that is neither admitted nor excluded). `src/semantic.ts` runs them
  through `runAll` and compares `canChange` (cols A, Addr, V), `cannotChange` (A, Addr, V),
  `unknownChange` (Addr, V, …, Kind at col 4), `indirectlyCanChange` (A, Addr, V, Addr2, V2); an
  argument filters fixtures by name (`pnpm semantic pg-04`). All six fail with "no verdict stage",
  as intended. `src/compare.ts` deleted; READMEs updated. `findings` still in the unit RELATIONS
  list until P3 removes the relation. Next: P1, `rules/2-guards.dl`.
- 2026-09-11, P1 done: `rules/2-guards.dl` (unit stage, after 2-analysis; optional for old runs).
  Relations differ a little from the sketch above, on purpose: guards are keyed by function as
  well as by effect. `effect(C, E, F, V)`; `at(X, S)`; structure `plainBlock`, `straightIn(S, B)`,
  `region(S, B)`, `before`, `exitBetween` (return/break/continue), `covers(X, S)` (X straight in a
  block enclosing S; before S, or after S with no exit between), `inBranch`, `inLoop`, `inTry`,
  `tryCall(K, Try)`, `exits(B, Kind)` abort|return|break, `exitBranch(If, Pol, Kind)`;
  `modifierOf(C, F, M)`, `alwaysCalls(C, F, G)` (modifiers + calls in always-executed statements,
  transitive), **`fnGuard(C, G, X, Pol, Why)`** = X must be Pol for G to complete (what a caller
  needs about a callee), `fnCallGuard(C, G, K)`; `requiresFn(C, E, G)`; `anchor(C, E, S, F)` (E's
  statement and each required modifier's `_`); **`guard(C, E, X, Pol, Why)`** with Why ∈ require |
  if-abort | if-return | branch | loop | try; **`callGuard(C, E, K)`**; `lowLevelIgnored(K)`;
  `pathSplit(C, E, X)` (ifs and trys where E's executions fork), `loopAround(C, E, L)`,
  `loopBoundFrom(L, V)`; `opaque(F, K, Why)` (assembly only when it stores/calls/ends execution),
  `opaqueFor(C, E, K, Why)`; `writeThenRevert(C, E)`; `testsIdentity(X, Kind)`, `argIdentity(K,
  Index, Kind)`. Fixture `contracts/Guards.sol` (13 shapes) with reviewed tuples in
  `expected/Guards/*.tsv`; `pnpm semantic` now compares whichever `.tsv` files an expected folder
  holds. Tuples on pg-01…06 inspected (callGuard on pg-01/02, pathSplit on pg-03/05, loopAround +
  loopBoundFrom on pg-06, alwaysReverts on ClosedGate). Next: P2.
- 2026-09-11, P2 done (pg-01…06 green with `pnpm semantic`): `src/smt.ts` (terms with constant
  folding, sorts Bool/BV160/BV256/Str/Array, `Declarations` with symbol kinds chosen|unknown,
  `Script` with push/pop checks, `runZ3` via `spawnToFiles` with `-in -t:2000`, `Z3_BIN`);
  `src/symbolic.ts` (bounded symbolic walk over the solc AST: statements, forks, loops unrolled
  k=3, try/catch, modifiers with `_`, internal calls inlined with dispatch, external calls inlined
  at the recorded target with `msg.sender` = caller address and the callee's storage, low-level
  calls as unknown booleans, storage from discovery's value tree with array/mapping `store`
  chains, writes as effects with `writeSite` ids, `guardsTaken`/`callsMade` for the consistency
  check); `src/solve.ts` (per (Addr, H) walk, per effect: script A = Φ ∧ sender = a for every
  discovered address + outsider, script B = robustness ¬Φ with the witness's inputs fixed;
  outputs `solve/<addr>/<entry>/walk.json`, `<effect>/{a,b}.smt2, result.json`, `facts/solved/*`;
  `summary.json` with `mismatches` against `guard`/`callGuard`). The pipeline runs solve then
  the verdict program (`program-verdict.dl`, imports by absolute path, `-F facts/solved`, outputs
  into `derived/`); `RunMeta` gained `counts.solved`, `counts.verdictDerivedRows`,
  `timings.solveMs/verdictMs`, `solve`. `rules/0-solved.dl` declares the solver's facts,
  `rules/5-verdict.dl` derives `writer`, `canChange` (incl. "anyone" from `solvedOpen`),
  `cannotChange` (excluded on every write, fully explored), `unknownFor`, `unknownChange`,
  `indirectlyCanChange`, `verdict`. Actors are every discovered address plus "outsider". Stage
  `verdict` in rules.ts (`VERDICT_FILES`, `stagePath`, `verdictProgram`), query.ts, proof.ts
  (homes `verdict` and `solve`), web/server/runs.ts. Not yet: a rendering of the solve artefact
  in `./q why` and the UI (P4), `./q solve --assume` (later). Next: P3.
- 2026-09-13, P3 done (`pnpm semantic`: 4 unit fixtures + pg-01…pg-15 green; lint, typecheck clean).
  Solver facts carry **Via** (`solvedEffect(Addr, Via, H, E, …)` etc.): the solver walks every entry
  H of every address Via and records every write it meets, on Via's storage or on another contract's
  reached through a call (msg.sender = the caller's address); so "who can make contract S call" is
  answered by rows with Via = S, no `acts`-style lifting except Safe signers (`canChange(…, "signer
  of <S>")` from `acts`). Robustness is a quantified query: ∃ inputs ∀ unknowns Φ (and ∀ outsider
  sender), sat ⇒ robust with the model's inputs; a formula resting on a hash of chosen data is
  never robust. Storage model: paths normalised to members + curried SMT arrays over the symbolic
  indices; recorded arrays and containers marked `complete` use a constant zero array as base
  (exclusions become real), others an unknown base; `select` over `store` folds for closed keys
  (literals, hashes of constants), with recorded hash keys asserted distinct. `keccak256` of
  constants is a closed uninterpreted term shared by the walk and discovery's bridge
  (`bridgeAccessControl` in solve.ts maps `accessControl.<ROLE>.members` to `_roles[@keccak256:ROLE]
  .hasRole/.members.<member> = true`, `adminRole` likewise, all complete; `fieldAlias("accessControl",
  "_roles")`). Opaque assembly on a path adds an unknown "goes on" boolean and an `opaque` residual.
  Removed: layers 5–6 checks and findings from 2-analysis.dl, 9a/9d/9e from 3-project.dl
  (`crossCall` caller-chosen no longer needs `allowed`; `relayed`/`relayedAny` use `safeModule`),
  `expected/*/findings.tsv`. Agent briefing and READMEs describe the four stages and the
  three-set answer. Fixtures pg-07…pg-15 as in the table (pg-14 uses a caller-chosen `fast` flag so
  cccc is robust). Known gap for later: signatures (`ecrecover`) are unknown, not a `signer(K)`
  identity. Next: P4 (`./q solve`, `./q why` on solved facts, UI: proof drawer solve stage, Ask
  screen three sets, Rules screen layers; citation-check false positive), then P5 (Zora).
- 2026-09-13, P4 done (typecheck, lint clean; the dev server was not started — the user runs it):
  `./q solve <addr> <entry> [<write>]` prints paths, witnesses (with inputs), exclusions, residuals,
  reads and the evidence folder; `./q why` marks solved* leaves with "the solver's answer — see
  ./q solve …". Web: `GET /api/run/solve?id&via&entry&effect[&addr]` → `SolveInfo` (result.json +
  a/b.smt2); `SolveCard` in the proof drawer under a solved* leaf ("the solver ▸"); `STAGE_LABEL`
  for solve/verdict; Rules screen lists the verdict program's sections (◆), explains the four
  stages, shows solver/verdict counts and timings; `tag.verdict`; Inputs progress texts for the
  solve/verdict stages. Citation check ignores backticked `name(args)` that quotes no atom and
  names no relation (the `setScore(uint256)` false positive). Briefing: tools list gains `./q
  solve`. Next: P5, the Zora run (`out/zora-run.log`), then tune bounds and write the numbers.
- 2026-09-13, P5 in progress. First Zora run stalled: one write (OptimismPortal `receive` →
  `_metered`) produced a 3.8 MB script (Φ re-asserted per actor under push/pop, 62 actors) and every
  check hit the 2 s soft timeout. Changes: SMT terms share definitions (any application over 160
  chars is registered once, `expand` prints them as nested `let`s inside the quantifier that binds
  their symbols; `rename` is gone, the outsider check shadows `sender` in the `forall`); scripts
  assert Φ once and check each actor with `check-sat-assuming` on an indicator literal; the
  decision first asks Φ alone (a0.smt2: unsat → nobody, unknown → `solver-timeout`, nothing more),
  skips per-actor checks when Φ does not mention `sender`; Z3 runs with `-t:1000 -T:60
  -memory:2048`. `RunProgress` gained `{type:'solve', done, total, what}`; the CLI prints it and the
  final line reports writes solved / Z3 checks / verdict tuples. Second Zora run logging to
  `out/zora-run.log` (timestamped). Next: read its solve/summary.json (residual kinds, timing,
  mismatches), tune bounds, record the numbers in README.
- 2026-09-13, P5, second Zora run (out/runs/zora-20260913-195243, 465 s: units 43 s, solve 421 s):
  374 writes, 22,777 Z3 checks; verdict rows 905 can / 3,069 cannot / 5,917 unknown over 157
  (address, variable) pairs; `canChange` hows: witness 471, robust 442, "signer of <Safe>" 1,131,
  anyone 14. Residuals: depends-on 7,399, solver-timeout 900 (756 of them one entry,
  SystemConfig.initialize; DelayedWETH.transferFrom 63), too-many-paths 92, opaque 54, loop-bound
  22, no-code 4 (unit names with a colon: `AddressManager-eth:0x….sol`), solver-error 3
  (`.length` of an array behind a symbolic index). Guard mismatches 37: (a) loops re-test a
  condition after the write, so the last polarity is not the one at the write; (b) an unsupported
  call (`GameType.unwrap(<external call>)`) skipped its arguments, so the external call inside was
  never evaluated — a soundness gap, fixed. Fixes: arguments of unsupported calls are evaluated;
  UDVT `wrap`/`unwrap` are identities; `.length` through a symbolic index; any error inside an
  expression becomes an `unsupported-expr` residual; per-write guard snapshots (`effectGuards`) for
  the consistency check; `shortName`/`inheritsFrom` strip the unit prefix up to `.sol:`; the walk
  is wrapped so a failure is a `solver-error` residual, not a crash; container base symbols are
  named by their access shape (the "used with two sorts" crash). Speed: the sender is now *scoped
  per check* — `define-fun sender () … #xaddr` inside push/pop, so Z3 folds each actor's question
  (a.smt2), the outsider and "any" checks declare it free. Third run in progress.
- 2026-09-13, P5 done. Final Zora run (out/runs/zora-20260913-202710): 228 s total, solve 185 s,
  386 writes, 13,161 checks, 0 guard mismatches; verdicts 970 can / 3,256 cannot / 5,665 unknown;
  hows: robust 876, witness 475, "signer of" 1,492, anyone 21 (WETH balances/allowances, the token
  factory's `deployments`, dispute-game moves — all genuinely open). Residuals: depends-on 7,466,
  solver-timeout 153 (DelayedWETH.transferFrom and FaultDisputeGame.resolveClaim dominate),
  too-many-paths 92, opaque 83, loop-bound 22. Hand checks: SystemConfig.batcherHash → the owner
  Safe (witness) and its signers, everyone else unknown (initialize depends on unrecorded values);
  SuperchainConfig.pauseTimestamps → Guardian Safe via unpause (witness) and Security Council
  signers via pause. Tuning that stayed: writes performed by the same paths share one decision
  (`same-as.txt` in the write's folder), per-check soft timeout 500 ms, hard 60 s, 2 GB; quantified
  robustness checks run over mappings too (skipping them halved the time but lost all 876 robust
  admits). README numbers updated. Open items for later: signatures (`ecrecover`) as an identity;
  `./q solve --assume`; calldata-encoded low-level calls; checked-arithmetic reverts; reentrancy.
  Everything is uncommitted (the user commits); `out/` is gitignored.
