# AI templatizer: handoff for the finalization (temporary working file)

NOT part of the repo. Never `git add` it; delete it together with
`ai-templatizer-plan.md` when the work is done (or leave both and tell Adrian).
Written 2026-10-02 ~13:05 UTC, right before a context compaction. The plan it
continues is `ai-templatizer-plan.md` (same directory); the spec of record is
`docs/mdbook/specs/l2b_specs/ai_templatizer.md`; the decision log is
`packages/discovery/docs/ai-templatizer.md` (12.2, 12.4c).

## Binding rules (unchanged, do not drift)

- No commits, no pushes, never bypass git hooks. Adrian decides what/when to commit.
- `packages/backend/.env` holds RPC keys. Never print env values, only variable
  names. Read any discovery/benchmark log ONLY through `/tmp/redact.sh`
  (exists; recreate if missing: `sed -E 's#https?://[^ "'"'"']*#<url>#g'`).
- Never bare `git stash`/`pop`. Never `pkill -f`/`pgrep -f` with a pattern that
  appears literally in the same command. Research worktree
  `/home/l2beat/.t3/worktrees/l2beat/t3code-aeb04122` is read-only.
- Tests mocha + earl, `describe(Thing.name…)`; comments say *why*.
- From `packages/discovery`: `pnpm test` (1,231 passing as of now), `pnpm typecheck`
  (clean), `pnpm lint` (clean), `pnpm format` (clean). Rerun all four at the end.
- Model: `opencode-go/deepseek-v4.1-flash`, effort high (default). Do not run
  the full suite; quick suite only.
- The shell cwd drifts between Bash calls: always `cd` with absolute paths.
- Don't agree with Adrian reflexively; report numbers as they are.

## State of the work (everything below is DONE and in the working tree)

Steps 1–4 of the plan are implemented, tested, documented:

- **Step 1 (rules A+B)**: `TemplatizeRequest.config`; `withTemplate` in
  `config/structureUtils.ts`; dry run through the analyzer's config, no pinning;
  baseline/worklist from V1's `getHandlers`; `freeze.ts` → `existingTemplate.ts`
  (all fields kept, failing noted); `write/appendToTemplate.ts` with the
  `removeInsertions(new) === old` assertion (held over all 1,267 committed
  templates in a one-off run); `write/jsoncEntries.ts` with offsets;
  `createAddressAnalyzer` in `getDiscoveryEngine.ts` shared with the benchmark;
  V1 error messages name the field (`executeHandlers`, `decodeHandlerResults`).
  Rule B check script `/tmp/rule-b-check/check.ts` → PermissionedDisputeGame
  `failing: []` with 29 types (OpStackAbsolutePrestate present). PASSED.
- **Step 3 (benchmark)**: `suite.json` has `quick` (14 contracts) + `projects`
  (full); `--suite quick|full` (default quick); attribution kinds `override`,
  handler `unreachable` reasons (non-generic type, `hardcoded`, `eventCount`,
  `call` with `address` = "reads another contract", suite overrides); counts
  `reachableFields/reachableFound/regressions`; report sections Regressions and
  Unreachable handler fields.
- **Step 2 (rule C strong)**: deleted checkHandlers, checkEventHandler,
  resolveMethod, resolveEvent, abi/literals, checkReferences, references,
  checkBlips, whereLiterals, privilegedEvents, checkPrivilegedSkips (+tests);
  `Finding` has no severity; `fieldReads`/`checkCovers` are structural (bare
  name + arity, fragment signature); `checkNames` = identifier/`$`/collision
  (array-over-probe exception kept; fixed-name rule dropped); `validateDraft`
  constructs every field with `getUserHandler`; dry run produces `notes`
  (`reads <fragment>`, empty fold, >20 addresses, other declaration has logs);
  loop has no advisory round; prompt reworded to "what is checked … guidance".
- **Step 4**: `prompt/readmeSections.ts` (parses `packages/discovery/README.md`
  at run time; handler sections found by the `"type": "x"` they quote; edit
  operator sections; undocumented type → one line with V1 schema keys) wired
  into `buildPrompt` via `ExistingFieldText.handler/edit` and `PromptOptions.readme`.
- **Extra fixes from run 1**: DeepSeek tool-call markup in text
  (`<｜｜DSML｜｜ …`) is now a tool part → turn refused and resampled
  (`model/opencodeEvents.ts`); `ignoreMethods` no longer derived from `covered`
  skips (`write/ignoreMethods.ts`). Both documented in 12.2 and the spec.
- Docs: spec updated (name exception, cross-contract calls unreachable,
  override fields, DSML sentence, note wording, quick suite = 14 contracts
  ~35 min); `docs/ai-templatizer.md` banner, sections 6/7 superseded, 12.1
  table, 12.2 entries (Additive only; Never predict V1; Checks reduced; Quick
  benchmark suite; README sections; `ignoreMethods` not from covered skips;
  DeepSeek markup), 12.3 test record, 12.4c run table (run 1 filled, run 2
  row empty), 12.5 resolution line.
- Diff: 89 files, +3,639/−5,660 in `packages/discovery/src`; templatizer now
  9,455 src / 6,845 test lines (was 11,214 / 7,332).

## Benchmark run 1 (post-step-1 code, OLD validator) — DONE, recorded in 12.4c

`/tmp/templatizer-bench-1/benchmark.md` (+ `.json`, `trails/`, `<project>/templates/`).
Reachable 42/120 (35.0%), regressions 1 (`aggchainSigners`, cause fixed),
11 authored / 1 matched (metis, replaced in suite) / 2 failed (both DSML, cause
fixed), 36 min wall, 1.40M input tokens (0.89M cached).
NOTE: run 1 was started before steps 2–4 and the two fixes; tsx had loaded the
old modules, so it measures the step-1 code. metis was still in the suite then.

## Zora `--ai-revisit` acceptance run — DONE, exit 1, needs review (see below)

Log `/tmp/zora-revisit.log` (read via redact). Command used
(`/tmp/rule-b-check/zora-revisit.sh`):
`cd packages/discovery && node --env-file=../backend/.env --import tsx src/cli.ts discover zora --dev --ai-revisit --ai-model opencode-go/deepseek-v4.1-flash`

Outcome: 16 templates in zora. Revisited (appended to): GnosisSafe,
opstack/OptimismMintableERC20Factory, opstack/OptimismPortal2,
opstack/SuperchainConfigFake_expiry, opstack/SystemConfig. Nothing to add:
opstack/L1ERC721Bridge, global/ProxyAdmin, opstack/L1StandardBridge,
opstack/L1CrossDomainMessenger, opstack/DelayedWETH. Authored new:
`_templates/zora/CompatibilityFallbackHandler/` (untracked dir; a contract that
had no template). Then STOPPED with `TemplatizationFailedError` on
`opstack/AddressManager`: 3 rounds, last refused "text holding tool-call markup
(DSML)" → no discovered.json written (fail-fast works as designed; the DSML
refusal now shows as a refused turn, as intended, but DeepSeek produced it 3
times in a row for that contract). Templates not reached: AnchorStateRegistry_post20,
DisputeGameFactory_v2, MIPS, PermissionedDisputeGame, PreimageOracle,
opstack/AddressManager.

Working tree after the run: `M` on the 5 templates above (+ `?? _templates/zora/`).
`packages/config/src/projects/zora/discovered.json` was NOT written.

## What is LEFT to do (in order)

1. **Verify rule A on the zora diff** (the whole point of the exercise):
   `git diff -- packages/config/src/projects/_templates/` must contain NO `-`
   lines (only insertions). Check with
   `git diff -U0 -- packages/config/src/projects/_templates | grep '^-' | grep -v '^---'`
   → must be empty. Eyeball each of the 5 appended templates: provenance line
   `// Added by opencode-go/deepseek-v4.1-flash, high effort via l2b discover --ai-revisit on 2026-10-02, N round(s). Review before committing.`
   directly above the first appended field inside `fields`, then
   `// <reason>`, `// covers: …`, optional `// review: …` notes, then the field.
   Also confirm `ignoreMethods` of every existing template is byte-identical,
   and that `opstack/PermissionedDisputeGame/template.jsonc` is untouched
   (it was never reached). Look at `_templates/zora/CompatibilityFallbackHandler/template.jsonc`
   + `shapes.json` (new, authored). Report what the model added (field names,
   handler types) so Adrian can judge; do NOT revert anything, it is his diff to
   review (he reverted the previous ones himself).
2. **Decide about re-running zora.** Options: (a) rerun the same command: the
   5 revisited templates are now "touched"? No: `touched` is per process, so a
   rerun would revisit them AGAIN and the model may append more (the note
   dedupe only covers `review:` notes, not fields). Not recommended without
   Adrian. (b) Leave as is and report. Recommend (b); mention that the run
   stopped on AddressManager because DeepSeek emitted tool-call markup three
   turns in a row, and that raising `--ai-rounds` or rerunning is the way
   forward. Possible improvement to propose (not implement): refused
   (unusable) turns should not count against `--ai-rounds`, or the retry-once
   in `OpenCodeClient.turn` could retry more than once for DSML.
3. **Benchmark run 2 (final code)** — not yet run. Command, from
   `packages/discovery`, in the background (takes ~35–40 min; nothing else
   should use the opencode account meanwhile; the sqlite cache is shared so do
   not run discover at the same time):
   `rm -rf /tmp/templatizer-bench-2 && mkdir -p /tmp/templatizer-bench-2 && node --env-file=../backend/.env --import tsx src/cli.ts templatizer-benchmark --out /tmp/templatizer-bench-2 --ai-model opencode-go/deepseek-v4.1-flash > /tmp/templatizer-bench-2/run.log 2>&1; echo "exit: $?" >> /tmp/templatizer-bench-2/run.log`
   Then fill the run-2 row of the 12.4c table in `packages/discovery/docs/ai-templatizer.md`
   (reachable found, regressions, handler fields found, authored/matched/failed,
   rounds distribution from `## Cost`, tokens, wall = file mtime difference or
   `startedAt`/`finishedAt` in `benchmark.json`) and a short "what changed vs
   run 1" paragraph (expect: no DSML failures, no `aggchainSigners` regression,
   interfold/SlashingManager in place of metis). If run 2 regresses recall vs
   run 1, look at the trails before concluding and report either way. The
   quick suite's wall time in the spec says "about thirty-five minutes"; adjust
   if run 2 says otherwise.
4. **Final checks**: `pnpm test && pnpm typecheck && pnpm lint && pnpm format`
   in `packages/discovery`; `git status` sanity (only intended files; the
   `packages/config/cache/` changes are gitignored).
5. **Spec last pass**: reread `docs/mdbook/specs/l2b_specs/ai_templatizer.md`
   once against the final behaviour; it was kept in step with the code, but
   check the "When it runs" table, step 7 (ignoreMethods wording), the notes
   list, the benchmark section (quick suite 14 contracts, two numbers).
6. **Skipped on purpose, say so in the report**: the `/tmp/abort-e2e` fake-opencode
   rerun (the fail-fast path is covered by unit tests and was just exercised for
   real by the zora run stopping on AddressManager); the "three runs" of the
   plan became two (run 1 = step-1 code, run 2 = final), since each run is ~35 min
   and steps 2 and 4 were finished before run 1 ended.
7. **Final report to Adrian** (short, as the system prompt wants): what changed
   per rule, lines deleted, test count (1,231), the two benchmark numbers per
   run, the zora diff summary (5 templates appended, 1 authored, stopped on
   AddressManager, discovered.json not written), the two fixes found by run 1,
   open questions: (i) DSML frequency with DeepSeek and whether refused turns
   should count against rounds; (ii) empty-worklist contracts never get
   `constructorArgs` (RocketDAOSecurityProposals, both liquity contracts missed
   it); (iii) multi-implementation proxies get template id `<project>/Proxy`
   (lighter) because `sources.name` is the proxy's; (iv) whether to keep
   `ai-templatizer-plan.md` and this file (both untracked) or delete them.

## Where things are

- Benchmark 1: `/tmp/templatizer-bench-1/` (benchmark.md/json, trails, templates).
- Zora run log: `/tmp/zora-revisit.log`; trail dirs under
  `packages/config/cache/templatizer/zora/<address>/` (gitignored).
- Scripts: `/tmp/rule-b-check/check.ts` (rule B), `/tmp/rule-b-check/append-all.ts`
  (rule A over all templates), `/tmp/rule-b-check/zora-revisit.sh`; run them from
  `packages/discovery` with `node --env-file=../backend/.env --import tsx <file>`
  (`/tmp/rule-b-check/node_modules` is a symlink to discovery's node_modules).
- Redaction: `/tmp/redact.sh`.
