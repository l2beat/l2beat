# AI templatizer: implementation plan (temporary working file)

NOT part of the repo. Never `git add` it; delete it when the work is done.
Written 2026-10-02 for the post-compaction continuation of this thread.

- Spec of record (written with this plan, keep it true as you go, adjust it if
  the implementation has to deviate): `docs/mdbook/specs/l2b_specs/ai_templatizer.md`
  (linked from `docs/mdbook/specs/SUMMARY.md` and `packages/discovery/README.md`,
  both done).
- Design history + decision log: `packages/discovery/docs/ai-templatizer.md`
  (section 12.2 is the log; add entries there, dated 2026-10-02).
- Code: `packages/discovery/src/discovery/templatizer/` (11.2k lines src,
  7.3k tests at the start of this plan).

## 0. Binding rules (Adrian's; do not drift)

- No commits, no pushes, never bypass git hooks. Adrian decides what/when to commit.
- `packages/backend/.env` and `packages/config/.env` hold RPC keys. Never print env
  values, only variable names. Read discovery logs only through `/tmp/redact.sh`
  (recreate if missing: a `sed` that replaces `https://[^ "']*` with `<url>`).
- Shared git stash: never bare `git stash`/`git stash pop`. Don't stash at all.
- Never `pkill -f`/`pgrep -f` with a pattern that appears literally in the same
  shell command (it matches the shell itself).
- The research worktree `/home/l2beat/.t3/worktrees/l2beat/t3code-aeb04122` is read-only.
- Tests: mocha + earl, `describe(Thing.name, …)`; repository mocks typed as
  `Database['repo']` (AGENTS.md). Comments say *why*. Match surrounding code style.
- From `packages/discovery`: `pnpm test`, `pnpm typecheck`, `pnpm lint`
  (`pnpm lint:fix`), `pnpm format` (`pnpm format:fix`). 1257 tests passed at the
  start; the count will drop a lot in step 2 (deletions) — that is expected.
- Model for any real run: `opencode-go/deepseek-v4.1-flash` (Adrian has opencode
  Go; Zen is logged out). Effort default `high`. Codex has no credits.
- Working tree at the start carries Adrian's `--ai-revisit` results produced by the
  OLD (destructive) code: modified `_templates/{GnosisSafe, opstack/DisputeGameFactory_v2,
  opstack/OptimismMintableERC20Factory, opstack/OptimismPortal2,
  opstack/PermissionedDisputeGame, opstack/PreimageOracle, opstack/SystemConfig}/template.jsonc`
  and `packages/config/src/projects/zora/{discovered.json,diffHistory.md}`.
  AGREED: `git checkout -- packages/config/src/projects/_templates/opstack/PermissionedDisputeGame/template.jsonc`.
  The other six + zora outputs: ASK Adrian before touching; recommend restoring all
  of them before the verification rerun so the diff shows only the new behaviour.
- Scratch dirs from earlier work (reuse the patterns): `/tmp/abort-e2e` (fake
  `bin/opencode` that fails every turn + a projects copy + `.discovery.json`),
  `/tmp/revisit-smoke`, `/tmp/replay-empty-folds/replay.ts` (how to run a TS script
  against the package; check how it was invoked before writing a new one).

## 1. Decisions taken (settled with Adrian; do not relitigate)

- Keep the code, no rewrite. The divergence that hurt us was in the validator and in
  three small spots, not in the plug-into-the-analyzer architecture.
- Rule A, additive only: the new file = old text + inserted blocks; writer asserts
  `removeInsertions(new) === old` before writing (runtime assertion, not only a test).
  Failing existing fields are kept with a `// review: fails at block N: <error>` note.
  `ignoreMethods` of an existing template is never changed; the model's skips on an
  existing template go to the trail only. Comments, key order, everything human-written
  survives because the text is never rebuilt.
- Rule B, never predict V1 ("the templatizer never predicts what V1 would do; it
  either calls V1 or reports what V1 did"): dry run through the analyzer's own
  per-address config + `pushValues` + `HandlerExecutor.execute`; baseline = the
  untemplatized run's values/errors as handed over by the analyzer (override fields
  included, no filtering); probed-getter detection via V1's `getSystemHandlers`;
  benchmark builds its analyzer through the same factory as the live run; delete the
  dry run's decode copy (failure pinning).
- Rule C strong: delete the predicted-V1 validator. What blocks: JSON parse; V1's own
  schema per handler type (+ V1's `validateBlip` for any `edit`/`where`); coverage
  (every worklist token exactly one verdict, nothing unknown); covers integrity (a
  field may claim only events its handler names; `call`/`array` only the function it
  calls, by bare name/signature, no resolution); name collision (`$` prefix,
  identifier pattern, collides with a baseline value name or an existing template
  field name); construction with V1's `getUserHandler`; dry-run field error. Nothing
  else blocks. No advisory round, no warnings: observed facts become `// review:`
  notes in the template for the human. The prompt keeps the *guidance* (skip reasons,
  enumeration idioms, event-only state, privileged events as a hint, roles,
  references, literals, ignoreRelative) but no longer says "each rule is checked".
- Blip whitelist: removed. Any blip V1 parses is allowed (V1's `validateBlip`).
- `ignoreMethods` on a NEW template: derived from skipped *probed* getters (single
  uint256 index), as now, keeping the rule "leave the name alone if a 0-argument
  getter shares it". 0-argument getters are not on the worklist, so nothing else can
  be derived; Adrian: "we don't need to add more".
- Code changed + `--ai` (previous template exists, new shape): add the shape; write
  `fails at block` notes for failing fields; NO model call. `--ai-revisit` asks.
  (Predictable; additive; the spec table says so.)
- `--ai-revisit`: freeze (all fields kept) → remaining worklist (minus what existing
  fields read, minus ignoreMethods) → if empty: nothing to ask (write notes only if
  new) → else model → append new fields + provenance comment + notes. No write when
  nothing is added and no new note. Still once per template per run; skips
  templates this run authored.
- Tools: none, now and in this plan. Deferred: read-only tools behind our own MCP
  server over a staged directory, only if the benchmark shows headroom. Symlinks do
  not sandbox (rejected).
- Context instead of tools: README sections for handler types (and edit operators)
  used by existing fields, read at run time (step 4).
- Benchmark: quick suite (10–15 contracts, dense generic handlers, one per template,
  ethereum where possible, reachable fields marked); metrics = recall on reachable
  handler fields (target 100%) and regressions (committed values lost; target 0), plus
  rounds/tokens/time; quick is the default, `full` = research suite. Three quick runs:
  after step 1 (baseline), after step 2, after step 4. Synthetic contracts and a
  revisit-mode benchmark: deferred, noted in the spec.
- Model failure stops discovery (done 2026-10-01, keep).
- Prompt guidance keeps the "privileged events" paragraph; the regex parser goes.

## 2. Order of work

1 (Rule A + B, restore template) → 3 (quick suite + metrics, baseline run) → 2 (Rule C
strong, run) → 4 (README sections, run) → 5 (verification, docs, report).
Reason for 3 before 2: the "before" number for the validator deletion needs the suite
to exist first.

## Step 1: Rule A + Rule B

### 1.1 Config pass-through (Rule B)

- `AddressAnalyzer.templatizeRequest()` adds `config: StructureContractConfig` to the
  `TemplatizeRequest` (the per-address config the engine built with
  `makeEntryStructureConfig(config, address)`, BEFORE any `pushValues`; both the
  authoring and the revisit branch call `templatizeRequest` before pushing, good).
- New helper in `src/discovery/config/structureUtils.ts`:
  `withTemplate(config: StructureContractConfig, template: StructureContract): StructureContractConfig`
  = `{ ...config }` then `copy.pushValues(template)`; return copy. `mergeWithPolicy`
  builds a fresh `result = {}` (verified), policies return `override ?? base`
  (shared references, never mutated) → the analyzer's instance stays untouched.
  Unit test: pushValues on the copy leaves the original's `fields`/`types` unchanged.
- `draft/dryRun.ts`: replace `configFor(facts, template)` (which does
  `makeEntryStructureConfig({}, address)`) with `withTemplate(request.config, template)`.
  Thread `config` into `dryRunDraft`/`runTemplateFields` (through `Facts`/`ContractFacts`
  or an explicit param — pick explicit: `DryRunOptions.config`/a required arg).
- The dry run's template = `StructureContract.parse({ ignoreMethods, fields: {...existingFields, ...draftFields} })`
  where for an existing template `ignoreMethods` = the template's own (untouched) and
  for a new one the derived list; existing fields = ALL fields of the previous
  template (they are kept, so they run).
- Delete `pinFailure`, `decodeAsExecutor`, `failingEdits`, `unresolvedReferences`,
  `unresolvedMessage`, `withoutEdits`, `withoutFields`, `withoutKeys` in `dryRun.ts`.
  `runPinned` → plain `handlerExecutor.execute`; a whole-run throw → `{ failure }` →
  `sameErrorForAll` (already exists). Message to the model: "the template failed as a
  whole: <error>; this usually means a `{{ reference }}` that cannot resolve or an
  `edit` that throws". Update `dryRun.test.ts` (drop pinning tests).
- Baseline (`baseline.ts`): stop repeating `getSystemHandlers`' selection. Signature →
  `buildBaseline(values, errors, systemHandlers: Handler[])` with
  `systemHandlers = getSystemHandlers(abi, request.config)` (V1,
  `src/discovery/handlers/getSystemHandlers.ts`, takes `(abiEntries, config)`).
  `kind`: `probe` when the handler for that field is the LimitedArrayHandler
  (VERIFY class name/field via the handlers list), `getter` otherwise; a value whose
  name is not a system handler field is an override field → `kind: 'override'`
  (render it in the prompt as "from the project config"). Include errors.
- Worklist (`worklist.ts`): `isProbed(fragment)` → `probedNames: Set<string>` derived
  from the same `systemHandlers`; `buildWorklist(abi, probedNames)`. `needsVerdict`
  (view/pure, ≥1 input, ≥1 output) stays — it is our definition, not a V1 prediction.
  Update callers (Templatizer.buildFacts/templatize/revisitOrStop, tests,
  `draft/test/drafts.ts`, benchmark if any).
- `write/ignoreMethods.ts`: unchanged logic (uses `item.probed`); keep the 0-arg
  sibling rule. Only applied to NEW templates.

### 1.2 Freeze becomes "notes, not deletions" (Rule A)

- `freeze.ts`: `FreezeAnalysis { templateId, template, fields: string[] /* all, file order */, failing: { name, error }[] }`.
  `analyzeFreeze(request.config, …)` runs `runTemplateFields` with the real config.
  Delete `nothingBroke`, `lockedFields`; add `hasFailures`. `remainingWorklist` subtracts
  items read by ALL existing fields (not only passing ones) and `ignoreMethods`.
  "What a field reads" = structural (`fieldReads.ts` reduced, see step 2; until then
  keep `naturalCovers` but feed all fields).
- `Templatizer.ts`:
  - `extendPrevious` (code changed): `freeze` → `addShape` → if `failing.length > 0`
    append notes (idempotent) via the new writer and `replaceTemplateText`; log
    "added the shape of X to T; N field(s) fail at block B: names". No `runLoop`.
  - `revisitTemplate`: `freeze` → `remaining` → if `isEmptyWorklist(remaining)`: write
    only new notes (if any), log "already decides every item"; else `runLoop(…, existing)`
    → if draft has no fields and no new notes: log "found nothing to add", no write;
    else `appendToTemplate(oldText, { provenance, fieldNotes, fields })` →
    `replaceTemplateText`. Skips → trail only. `ignoreMethods` untouched.
  - Delete `extendedTemplateText`, `keptAndRemoved`, `addedIgnoreMethods`, `addsNothing`
    (replace by `addsNothing = fields.length === 0 && newNotes.length === 0`),
    `lockedTexts` → `existingTexts` (entries of all fields, verbatim, for the prompt).
  - Header/provenance text: `Added by ${describeModel(model, effort)} via l2b discover --ai-revisit on ${date}, ${n} round(s). Review before committing.`
    placed as a comment line directly above the first appended field (inside `fields`),
    not at the top of the file. Notes for failing fields: `// review: fails at block N: <error>`
    directly above that field's entry.
  - `authorNew`/`writeWithoutModel`: as now (new file via `renderTemplateFile`).
- Prompt: `renderLocked` → "Existing fields (n)": "Already in the template and kept as
  they are. Do not redefine them or reuse their names, and do not rule on what they
  read, because those items are not on the worklist. Reference them as `{{ name }}` if
  useful." `LOCKED_RULE` reworded the same way. `buildPrompt` input `locked` → `existing`.

### 1.3 The additive writer

- New `write/appendToTemplate.ts`:
  `appendToTemplate(oldText: string, additions: { provenance?: string; fieldNotes: Record<string, string[]>; fields: TemplateFileField[] }): { text: string; insertions: { start: number; end: number }[] }`.
  - Uses `write/jsoncEntries.ts` (`readTopLevelEntries`, `readFieldEntries`,
    `withTrailingComma`). VERIFY whether `JsoncEntry` carries text offsets; if not, add
    `start`/`end` offsets to it (the scanner knows them).
  - Field notes: insert `<indent>// review: …\n` lines directly above the field's entry
    (above its attached comments), skipping any line already present verbatim directly
    above the entry (idempotence).
  - New fields: find the `fields` object; insert after its last entry: a trailing comma
    if missing (part of the insertion), newline, the provenance comment, then each
    field rendered by the existing field renderer (extract `renderFieldEntry(field, indent)`
    from `write/templateFile.ts` so new files and appended fields look the same and stay
    biome-stable; biome formats `_templates` in CI). Cases: `"fields": {}` (empty),
    `fields` on one line, no `fields` key at all (insert `,\n  "fields": {\n…\n  }` before
    the document's closing brace; adjust the previous entry's comma), file without a
    trailing newline.
  - Returns `insertions`; asserts `removeInsertions(text, insertions) === oldText` and
    that `readJsonc(text)` parses and `StructureContract.parse` accepts it, else throws
    (→ `TemplatizationFailedError('internal', …)`). `removeInsertions` exported for tests.
  - Tests: byte-identical round trip on real committed templates (take 3–4 from
    `_templates`, e.g. `opstack/PermissionedDisputeGame`, `GnosisSafe`,
    `opstack/DisputeGameFactory_v2`, one with no `fields`), idempotent notes, empty
    `fields`, trailing-comma variants, comments inside `fields` not attached to a field
    (the "proposer and challenger" comment) survive.
- `write/templateFile.ts`: `TemplateFileInput` drops `preserved` and `lockedFields`;
  keep `header`, `notes`, `displayName`, `ignoreMethods`, `fields`. Update tests.
- `write/writeTemplate.ts`: `rewriteTemplate` may become unused → delete if so;
  `replaceTemplateText` and `addShape` stay.

### 1.4 Benchmark wiring (Rule B)

- Extract `createAddressAnalyzer({ templateService, handlerExecutor?, proxyDetector?, templatizerSettings?, logger })`
  in `src/discovery/getDiscoveryEngine.ts`; `getDiscoveryEngine` uses it; the benchmark's
  `buildAnalyzer` (`benchmark/analyzeWithHiddenTemplate.ts`) calls it with its
  `RecordingProxyDetector` and its template-copy `TemplateService`. One wiring.
- `previousTemplates: {}` and `onFailure: 'leave-untemplatized'` stay in the benchmark.

### 1.5 Small things in step 1

- `git checkout -- packages/config/src/projects/_templates/opstack/PermissionedDisputeGame/template.jsonc`.
- `packages/discovery/docs/ai-templatizer.md`: add a banner under the title: "Superseded
  as the description of record by `docs/mdbook/specs/l2b_specs/ai_templatizer.md`
  (2026-10-02). This file is the design history; 12.2 remains the decision log."
  Add 12.2 entries (dated 2026-10-02): "Additive only", "Never predict V1", and later
  "Checks reduced to structure and failure", "Quick benchmark suite", "README sections
  in the prompt". Mark sections 6 and 7 as superseded (one line each, pointing at the spec).
- Tests to touch: `AddressAnalyzer.test.ts` (request carries `config`), `Templatizer.test.ts`
  (freeze: all kept; failing field → note, not removal; revisit appends; ignoreMethods
  untouched; no-write when nothing added), `freeze.test.ts`, `dryRun.test.ts`,
  `baseline.test.ts`, `worklist.test.ts`, `templateFile.test.ts`, `writeTemplate.test.ts`,
  `buildPrompt.test.ts` (existing fields wording), benchmark tests if wiring changed.
- Rule B check script (not a unit test; needs RPC): `/tmp/rule-b-check/check.ts` that
  loads zora via `ConfigReader`, builds the per-address config for
  `eth:0xe1dFFCBE4e22B813F26d2106D943C102e7cAb87e` with `makeEntryStructureConfig`,
  runs `analyzeFreeze` for `opstack/PermissionedDisputeGame` at the committed block and
  expects `failing: []` (the `OpStackAbsolutePrestate` type must now be found). Model
  the invocation on `/tmp/replay-empty-folds/replay.ts`. Read any log through
  `/tmp/redact.sh`.

## Step 3 (before step 2): quick benchmark suite + metrics

### 3.1 Suite format

- `benchmark/suite.json` gains `"quick": [ { project, chain, address, template, unreachable?: { [field]: reason } } ]`
  and keeps `"projects"` as the full suite. CLI `--suite quick|full` (default `quick`);
  existing `--project/--addresses/--limit` keep working on the full suite.
- Reachability: automatic by handler type (generic seven → reachable; `hardcoded`,
  `eventCount`, any project-specific type → unreachable), with `unreachable` overrides
  per contract for e.g. a `storage` field whose slot cannot be derived. VERIFY how
  `benchmark/types.ts` attributes a V1 field (`V1Attribution`) to know which fields are
  "template handler fields" and which handler type they use.

### 3.2 Metrics

- Per contract and total: `reachable found / reachable total` (verdict `equal`,
  `equal-renamed`, `equal-by-value` count as found); `regressions` = committed fields
  that are NOT hidden-template handler fields with verdict `v1-only` or `different`
  (getters, proxy values, override fields). Keep the existing counts for comparability.
  Render both in `benchmark.md`, regressions listed by name.

### 3.3 Selecting the quick suite (do this with a script, then eyeball)

- Census script (adapt the one used on 2026-10-02): for every `_templates/**/template.jsonc`
  count `"type": "<t>"` occurrences split generic/specific; join with every
  `<project>/discovered.json` entry whose `template` is that id; prefer `chain: ethereum`
  (`eth:` addresses), one contract per template, ≥3 generic handler fields, few specific
  ones, varied handler types (call, array, event, accessControl, constructorArgs, storage).
  Cap at 12–15. Candidates seen in the census (generic/specific counts):
  `opstack/DisputeGameFactory_v2` 29/0, `lighter/ZkLighterWithSpot` 12/0,
  `opstack/DisputeGameFactory` 11/0, `liquityv2/TroveManager` 10/0,
  `liquityv2/BorrowerOperations` 9/0, `lighter/ZkLighterWithSpotQuoteAsset` 9/0,
  `rocketpool/RocketStorage` 77/4, `taiko/_preShastaTemplates/TaikoL1Contract` 40/3,
  `metis/Lib_AddressManager` 25/5, `linea/L2MessageService_v1_0` 16/1,
  `rocketpool/RocketDAOSecurityProposals` 16/1, `shared-zk-stack/old/BridgeHub` 11/1,
  `uniswapv3/GovernorBravoDelegate` 10/2, `polygon-cdk/PolygonRollupManager` 12/5,
  `kinto/AccessManager` 13/7. Check each for `hardcoded`/`eventCount`/`storage` fields and
  mark them unreachable. Note: the `"type"` regex over-counts a little (edits etc.);
  it is a ranking aid only.
- Each chosen contract must have a committed entry with that template and a block in
  `usedBlockNumbers` of its project. No flattened sources are needed for selection; the
  benchmark fetches sources through the explorer cache. (Adrian offered to download all
  `.flat` sources; not needed for this. Ask only if a benchmark run fails on sources.)

### 3.4 Runs

- `cd packages/config && l2b templatizer-benchmark --out /tmp/templatizer-bench-1 --ai-model opencode-go/deepseek-v4.1-flash`
  (VERIFY how `l2b` is built/invoked in this worktree: `packages/l2b` `pnpm l2bup` /
  `pnpm build:dependencies`; or the package script. Rebuild after code changes.)
- Run 1 after step 1 (baseline), run 2 after step 2, run 3 after step 4. Same model,
  effort, rounds. Record in `docs/ai-templatizer.md` 12.4 (dated) and in the final report.
  Expected cost per run: ~15 contracts × 1–2 rounds × ~80k input tokens (mostly cached),
  15–25 min wall time. Watch for the "Provider not found: opencode-go" transient at
  startup (seen once; just rerun).

## Step 2: Rule C strong (delete the predicted-V1 validator)

### 2.1 Delete (source + their tests)

`draft/checkHandlers.ts`, `draft/checkEventHandler.ts`, `draft/resolveMethod.ts`,
`draft/resolveEvent.ts`, `abi/literals.ts`, `draft/checkReferences.ts`,
`draft/references.ts`, `draft/checkBlips.ts`, `draft/whereLiterals.ts`,
`draft/privilegedEvents.ts`, `draft/checkPrivilegedSkips.ts`, `test/fixtures/*.json`
(VERIFY no other test uses them: `grep -rn "fixtures" src/discovery/templatizer`),
`draft/ruleContext.ts` if nothing else needs it. Expect ~2,500 src + ~1,700 test lines gone.

### 2.2 Keep, reduced

- `draft/Draft.ts`: seven handler types stay (scope, not validation). `edit` → any
  `BlipSexp` accepted by V1's `validateBlip`; event `where` → V1's own type (any blip).
  Remove the whitelist text from the doc comment.
- `draft/checkSchema.ts` + `draft/schemaProblems.ts`: keep (structural, no false
  positives; the multi-problem walker only improves messages).
- `draft/checkCoverage.ts`: keep.
- `draft/checkCovers.ts`: events claimed ⊆ event names the handler's actions name;
  `call`/`array`: claimed function tokens must share the method's bare name (or equal its
  sighash when `method` is a full fragment); `accessControl` ⊆ its five tokens; other
  handlers: any getter by claim. No resolution, no ABI lookup beyond names.
- `draft/checkNames.ts`: identifier pattern, `$` prefix, collision with a baseline value
  name (all names in `facts.baseline.fields`, override fields included) and with an
  existing template field name; the "shares no word" warning goes.
- `draft/fieldReads.ts`: structural reads only (method bare name / fragment, event
  names, accessControl tokens) — used by `checkCovers` and by `freeze.remainingWorklist`.
- `draft/validateDraft.ts`: R1 parse → R2 schema → R3 coverage → R4' names → R8' covers
  → construct every field with V1's `getUserHandler` (keep; it is V1). Update header
  comment. Keep `Findings`/`Finding` but severity becomes just `error`.
- `draft/Finding.ts`: `Severity` removed or `'error'` only; delete `advisory()`,
  `advisoriesOf`, warning handling; `hasErrors`/`countErrors` simplify to length.
- `draft/dryRun.ts`: field error → finding; notes (observed): empty fold
  (`emptyFoldNote`, exists), `reads <fragment>` when a bare `method` resolved to a
  function whose name differs from the method text (the run record already has
  `fragment`, line ~269), `holds N addresses discovery will follow` when a field's
  value contains more than `MAX_FOLLOWED_ADDRESSES` (=20, exists as an advisory → make
  it a note), `another declaration of <event> has logs` (exists as an advisory; VERIFY
  it is log-based, i.e. observed, then keep as a note). `DryRunRecord.fields[].notes: string[]`.
- `loop.ts`: remove the advisory round (`worthAsking`, `askedAbout`, `advisoryMessage`,
  `Candidate`), `repairMessage` lists errors only ("The draft has N error(s). Fix every
  error."), keep `acceptedRound` (its dry run carries the notes), keep the
  unusable-answer retry and the not-answering stop. Update `loop.test.ts`.
- `Templatizer.ts`: `draftFields(result)` notes = `acceptedRound.dryRun.fields[name].notes`;
  delete `templateNotes` (no non-field advisories remain) or keep for template-level
  dry-run notes if any.
- `prompt/buildPrompt.ts`: reword `renderRules` intro: "Guidance. Your draft is parsed
  with discovery's own schema, every worklist item must get exactly one verdict, a field
  may cover only what its handler reads, and your handlers are run at the block in
  section 4; errors come back to you to repair." Shape rule: drop the whitelist sentence;
  say `edit` and `where` are blip programs, the two forms in section 3 are the common
  ones. Keep Name, Place, Selection, Covers, Enumeration source, Event-only state,
  Privileged events (as guidance), Roles, References, Literals, Reason, User activity
  (reword "the dry run questions a field…" → "add ignoreRelative…"), Only the draft,
  Output. `prompt/handlerDocs.ts`: keep; mention other blip operators exist and are
  documented in the README (step 4 adds the sections when existing fields use them).
- `docs/ai-templatizer.md`: 12.2 entry + sections 6/7 superseded line (if not done in 1.5).
- Tests to update: `validateDraft.test.ts`, `checkCovers.test.ts`, `checkNames.test.ts`,
  `dryRun.test.ts`, `loop.test.ts`, `Templatizer.test.ts` (advisory review note test →
  notes test), `templateFile.test.ts`, `buildPrompt.test.ts`, `draft/test/drafts.ts`.

## Step 4: README sections in the prompt

- New `prompt/readmeSections.ts`: locate `packages/discovery/README.md` as
  `path.resolve(__dirname, '../../../../README.md')` (same depth from `src/…` and
  `build/…`; VERIFY both resolve; if missing, return nothing and log once).
  Parse `### <Name> handler` sections (body until the next `##`/`###`) and the
  `## Edit` subsections (`### pipe`, `#### map`, …). Map a handler `type` to a heading by
  normalisation (lowercase, strip spaces and the word "handler": `scrollAccessControl` →
  "Scroll access control handler") plus an alias map for the rest (`eventCount` →
  "Events count handler", `opStackDA` → "Optimism DA handler", `opStackSequencerInbox` →
  "Optimism Sequencer inbox handler", `eventTrace` → "Event trace handler",
  `dynamicArray` → "Dynamic array handler", `starkWareGovernance` → "StarkWare Governance
  handler", `starkWareNamedStorage` → "StarkWare named storage handler",
  `arbitrumDACKeyset` → "Arbitrum DAC keyset handler", `arbitrumSequencerVersion`,
  `arbitrumActors`, `lineaRolesModule` → "Linea access control handler"?? VERIFY each).
  Handler types with no README section (aragonPermissions, YieldFiMinters,
  kintoAccessControl, layerZeroMultisig, manyChainMultiSig, orbitPostsBlobs,
  zksyncera*, polygoncdk*, crossChainAccessControl, eip2535Facets, …) get one line:
  "`<type>`: no documentation; its definition keys are: <keys of the V1 schema>".
- `buildPrompt`: when existing fields use handler types outside the seven, or edit
  operators outside `format`/`get`, add "### Reference for handlers and edits used by
  existing fields" after the condensed handler docs in section 3, with the matched
  sections verbatim. Only when needed (keeps prompts stable otherwise).
- Tests: parsing on the real README (sections found for `event`, `scrollAccessControl`,
  `eventCount`; a known-missing type gives the one-liner); prompt includes/excludes the
  reference section; a test that every heading `### … handler` in the README maps to a
  handler type name (catches a renamed heading).

## Step 5: verification, docs, report

- `pnpm test && pnpm typecheck && pnpm lint && pnpm format` in `packages/discovery`.
- Rule A invariant: unit tests on real templates (1.3) + the runtime assertion.
- Rule B: `/tmp/rule-b-check` → `failing: []` for PermissionedDisputeGame.
- Fail-fast still works: rerun the `/tmp/abort-e2e` scenario once (fake opencode) → exit
  1, no `discovered.json` write, one turn.
- Real run (ask Adrian first about restoring the six templates + zora outputs, then):
  `cd packages/config && l2b discover ethereum zora --ai-revisit --ai-model opencode-go/deepseek-v4.1-flash`
  (rebuild `l2b` first). Expect: `PermissionedDisputeGame` keeps `absolutePrestateDecoded`,
  `fieldMeta`/`usedTypes` back in zora's `discovered.json`, no values lost, templates
  changed only by appended blocks (check with `git diff` that every `-` line is absent).
- Three benchmark runs recorded (3.4). If run 2 regresses recall vs run 1, look at the
  trail before concluding; report numbers either way.
- Update the spec if anything deviated; update 12.2/12.4 in `docs/ai-templatizer.md`.
- Final report to Adrian: what changed per rule, lines deleted, test counts, the three
  benchmark numbers, the zora diff summary, open questions. Delete this plan file last
  (or leave it and say so, Adrian's call).
