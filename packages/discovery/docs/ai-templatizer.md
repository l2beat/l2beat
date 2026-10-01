# AI templatizer for discovery: design and implementation plan

This file is written by Claude for Claude. It is the whole memory of a long
research thread (branch `prototype-sol-query-flow`, package
`packages/discovery-v2`) that ended with the decision below. Read all of it
before touching code, reread the relevant section at every design fork, and
update it when a decision here turns out wrong. It is the rationale of the
feature and lives next to the code on purpose.

Keep this file at `packages/discovery/docs/ai-templatizer.md`.

## 0. Start here (first ten minutes of the new thread)

1. You are on a fresh worktree from `main`. The research branch is checked
   out at `/home/l2beat/.t3/worktrees/l2beat/t3code-aeb04122` (branch
   `prototype-sol-query-flow`). Read code to port from there by absolute
   path. Never `cd` into it and never modify it.
2. Rules that were binding in the research thread and stay binding:
   - Do not commit and do not push. Leave everything in the working tree;
     Adrian decides what and when to commit.
   - Never bypass git hooks (`-c core.hooksPath=…` was denied as audit
     tampering).
   - `packages/backend/.env` holds RPC keys. Never print env values, only
     variable names. Discovery reads `<CHAIN>_RPC_URL`.
   - Do not use `pkill -f` or `pgrep -f` with a pattern that appears
     literally in the same shell command.
   - Code says *why* in comments, tests say *how*. When a comment would
     explain *what* a block does, extract the block into a function whose
     name says it. Small named functions over paragraphs of prose. Adrian
     asked for this explicitly for this implementation.
   - Repo rule (AGENTS.md): in unit tests type `mockObject` as
     `Database['repo']`; never export repository classes for tests.
   - Tests: mocha + earl, `describe(Thing.name, …)`, files `*.test.ts` next
     to the code. Lint: biome. Run `pnpm test`, `pnpm typecheck`,
     `pnpm lint` inside `packages/discovery` before declaring anything done.
3. Work autonomously to the end of the plan in section 9. Adrian is not
   going to answer questions mid-task. Where this file leaves a default,
   take the default.

## 1. The decision, in one paragraph

Discovery V1 stays. The single new capability is an AI step that authors a
V1 `template.jsonc` for a contract when no template matches its code, using
only the eight generic V1 handlers, checked by a validator and a real dry
run before it is written, with repair rounds fed by the check results. The
model writes the same file researchers write. Downstream (color, permissions,
diff, update monitor, frontend) does not change. The model never runs in the
backend; it runs only when a researcher passes a flag locally. The
`discovery-v2` package is research output and is not shipped; its authoring
loop, validator ideas, model clients and benchmark are ported piecemeal.

## 2. Why (so nobody relitigates it)

Evidence from the research branch, all in `packages/discovery-v2/BENCHMARK.md`
and `BENCHMARK.html` there:

- Benchmark: 79 contracts over scroll, base, plumenetwork; 55 V1 fields that
  a researcher wrote a handler for. Best setups reproduce 34 of 55 by value.
  Every setup reproduces every 0-argument getter and proxy value (that is
  93% of all V1 values), so only handler fields separate setups.
- Of the 21 misses, 13 are unreachable by any plan or template: 7 need V1's
  project-specific handlers that analyse transactions, blobs or traces
  (opStackDA, opStackSequencerInbox, arbitrumSequencerVersion,
  orbitPostsBlobs, arbitrumActors, arbitrumDACKeyset) or are hardcoded; 6
  are RiscZero verifier selectors a researcher pasted from release notes,
  with no on-chain event. So a "clean V2" without those handlers cannot
  reach parity. That killed the rewrite.
- 3 misses were event-only histories the model saw and did not fold
  (ScrollChain `revertedBatches` via `RevertBatch`, RollupProxy `challenges`
  via `RollupChallengeStarted`, NitroEnclaveVerifier `zkVerifierRoutes`
  via `ZkRouteAdded`/`ZkRouteWasFrozen`). Fix is a validator rule, not a
  smarter prompt (section 6, rule R9).
- 3 were `eventCount` counters (activity, not state). 1 was a probe of an
  unset key returning a default. 1 was a Scroll-specific access-control
  shape. Left out or deferred.
- DeepSeek V4.1 Flash (via opencode) matched GPT-5.6 (via codex) on handler
  fields at roughly one twentieth of the tokens. Its only weakness: 13 of 79
  first turns emitted tool calls although no tool was offered; the client
  refuses such turns and the loop retries.
- Adding compiler-derived facts (solc AST + Soufflé Datalog: who writes each
  state variable, under which modifier, emitting which events) did not raise
  handler-field recall on this suite and cost 2–3x input tokens plus a
  compiler download per contract. A second "review your plan" turn after
  acceptance did not raise it either. What demonstrably caught bugs was the
  mechanical loop: schema → validator → dry run → findings back to the
  model. Example: a fold over the wrong event accepted `isBatchPoster = []`
  while the getter returned true for five addresses; the "zero logs while
  covering a getter" rule now makes that an error.
- Census of the 1,130 committed templates (`packages/config/src/projects/_templates`):
  handler uses are call 507, event 337, accessControl 311, hardcoded 101,
  array 49, storage 40, constructorArgs 29, eventCount 25; all 25
  project-specific handlers together 59. Edit forms: `get` 356, `format`
  178, everything else under 25 each. Event `where` clauses: 121, all
  "argument equals literal". Cross-contract calls via `"address": "{{ x }}"`: 61.
  So the model needs eight handlers and three blip idioms.

Decisions Adrian and Claude converged on, with the reason each:

| Decision | Reason |
| --- | --- |
| Write V1 templates directly, no intermediate plan format the executor runs | One format; researchers hand-edit the same file; no compiler between two vocabularies to maintain. (The model's reply is still structured JSON, see section 5, but it *is* the template's fields plus verdicts, and the file is derived by adding comments, nothing else.) |
| Eight handlers only: call, array, event, accessControl, storage, constructorArgs, hardcoded, and `edit` with three blip forms. `eventCount` excluded from v1 | eventCount needs raw topic hashes the model cannot compute; 25 uses, all activity counters. Extend it to take an event name plus indexed-argument filter later, when a template needs it. |
| Blip whitelist: `where` = one comparison `["=" or "!=", "#arg", literal]`; `edit` = `["format", "FormatSeconds" or "Undecimal"]` or `["get", key, …]`. Anything else is a validator error naming the three allowed forms | The model never wrote jq in V2 either; it filled arguments of fixed programs. Same discipline here. |
| Trigger inside the analyzer when no template matches; engine waits for the model | Adrian wants the local run to come out fully templatized without a second manual pass. |
| Backend never calls the model; default off; flag on locally | Update monitor runs the engine hourly; discovered.json must stay a function of the repo. |
| Second trigger: source changed (new shape, previously templatized address). Freeze rule: dry-run the old template first; fields that still execute are locked byte-identical; the model may only add fields or delete broken ones; if everything passes, add the shape to the old template with zero model calls | "Never change what works" enforced by code, not asked of the model. |
| Repair rounds continue while the check reports errors, up to a configurable cap (default 3); stop at the first clean pass; no extra review turn by default | Review showed no gain; nearly every accepted plan passed by round two. |
| Every parametrized view function *and every event* gets exactly one verdict from the model; missing verdicts are errors | Mechanical "nothing forgotten". Events included so event-only state is never silently dropped (the 3 misses). |
| No solc in v1 | Facts showed no gain here; ABI covers events and functions; revisit if the bigger benchmark shows misses the ABI worklist cannot explain. |
| Code lives in `packages/discovery`, not a new package | Trigger is inside the analyzer; a second package would be circular. |
| Templates are written into `_templates/<project>/<ContractName>/` like a researcher would, with the model's reason per field as a jsonc comment and a one-line provenance header | Researchers review a git diff, same as today. |

## 3. V1 anatomy you will hook into (verified on `main` as of 2026-09-29)

All paths under `packages/discovery/src/`.

- Engine loop: `discovery/engine/DiscoveryEngine.ts`. BFS over addresses;
  **all addresses of one depth are analysed concurrently in `Promise.all`**.
  Consequence: the templatizer must serialise model calls and dedupe by
  shape hash in memory (two addresses with the same code at the same depth
  must not both author), else two templates for one shape.
- Per-address analysis: `discovery/analysis/AddressAnalyzer.ts`,
  `analyze(provider, address, config, suggestedTemplates)`. Order: bytecode
  → suggested template (byReferrer, from a relative's `fields.X.template`)
  → proxy detection → `sourceCodeService.getSources` (gives `name`,
  `isVerified`, merged `abi`, `abis`, `sources: PerContractSource[]`) →
  if no suggested template, `templateService.findMatchingTemplates(sources, address)`
  → `config.pushValues(templateValues)` → `handlerExecutor.execute(provider, address, sources.abi, config)`
  → relatives → `Analysis`. **The trigger point is the branch where
  `extendedTemplate` is still undefined after `findMatchingTemplates`**, for a
  verified non-EOA contract. Skip EIP-2535 diamonds only. (Corrected during
  implementation: a proxy with several implementations, such as Arbitrum's
  RollupProxy, is matched by V1 on the implementations' combined hash, so it
  is templatized; see 12.2.)
- Templates: `discovery/analysis/TemplateService.ts`. Templates are
  directories `_templates/<id>/` with `template.jsonc`, optional
  `shapes.json` (`{ [fileName]: { hash, address, chain, blockNumber } }`) and
  optional `criteria.json`. Matching is by hash only:
  `getHashForMatchingFromSources(sources.sources)` = for one bundle its hash,
  for two bundles (proxy + implementation) the **second** bundle's hash.
  `addToShape(templateId, chain, addresses, fileName, blockNumber, sources: ContractSource[])`
  computes `contractFlatteningHash` per source and combines when more than
  one; so to reproduce the matching hash for a proxied contract pass **only
  the bundle that `getHashToBeMatched` selects** (`sourceBundles[1]` when two,
  `[0]` when one): `addresses = [bundle.address]`, `sources = [bundle.source]`.
  Caches: `getAllShapes`, `hashIndex`, `loadedTemplates`; call `reload()`
  after writing files, then match again. `ensureTemplateExists(id)` creates
  the directory and a `template.jsonc` with the right relative `$schema`.
  `discoveryNeedsRefresh` reports `TEMPLATE_NO_LONGER_MATCHES` and
  `NEW_TEMPLATE_MATCH`; the previous template of an address is
  `entry.template` in the committed `discovered.json` (read through
  `ConfigReader`/`DiscoveryRegistry`; see `packages/backend/src/modules/update-monitor/DiscoveryRunner.ts`
  for how the registry is read).
- Handlers: `discovery/handlers/getHandlers.ts` builds user handlers from
  `config.fields[*].handler` first, then system handlers, and **keeps the
  first occurrence per field name, so a user field named like a 0-argument
  getter replaces that getter's value**. Forbid that name collision in the
  validator. `discovery/handlers/executeHandlers.ts` orders by
  `{{ field }}` dependencies. `HandlerExecutor.execute` returns
  `{ results, values, errors, usedTypes }`; use it as the dry run with a
  config built from the draft (see `discovery/config/structureUtils.ts`,
  `makeEntryStructureConfig` and `pushValues`, for how a `StructureContract`
  becomes a `StructureContractConfig`).
- System handlers: `discovery/handlers/getSystemHandlers.ts`. Every
  0-argument view/pure is read (`SimpleMethodHandler`); every view with
  exactly one `uint256` argument is probed at indices 0–4
  (`LimitedArrayHandler`); `ignoreMethods` suppresses both. Everything else
  with arguments is invisible without a handler: that is the worklist.
- Handler definitions to expose to the model, each a `v.strictObject`:
  - `user/CallHandler.ts`: `{ type: 'call', method?: string, args: (string|number)[], address?: string, expectRevert?, ignoreRelative? }`.
    `method` is a bare name (looked up in the ABI by name and arity) or a full
    `function …` fragment (required when `address` points at another
    contract, whose ABI is not available). `args` and `address` accept
    `{{ field }}` references.
  - `user/ArrayHandler.ts`: `{ type: 'array', method?, length?: number | '{{ field }}', maxLength?, startIndex?, indices?: number[] | '{{ field }}', ignoreRelative? }`.
    Without `length` it probes until revert up to `maxLength` (default 100).
    `indices` enumerates literal keys of a one-argument getter.
  - `user/EventHandler.ts`: `{ type: 'event', select?: string | string[], groupBy?, set: action | action[] }`
    or `{ …, add: action | action[], remove?: action | action[], flatten?, dedupBy? }`,
    action = `{ event: string, where?: blip }`. Semantics: `add`/`remove`
    replay logs into a set deduplicated by `dedupBy` or, by default, by
    `select` (so an append-only "list" is a set of selected values; that is
    what every committed template relies on). `set` keeps the last matching
    log (latest value), `groupBy` makes it per key. `where` runs with log
    arguments as `#name`; **log values are chain-prefixed before comparison,
    so an address literal in `where` must be written `eth:0x…` (see
    `prefixAddresses` in `discovery/utils/prefixAddresses.ts`)**. Event
    names are resolved by `getEventFragment` (bare name or full fragment).
    Mixed events in one action must have compatible argument names.
  - `user/AccessControlHandler.ts`: `{ type: 'accessControl', roleNames?: Record<bytes32, string>, includeEmptyRoles?, pickRoleMembers?, ignoreRelative? }`.
    Role names from `*_ROLE()` getters are picked up from the ABI
    automatically; the field is conventionally named `accessControl`.
  - `user/StorageHandler.ts`: `{ type: 'storage', slot, offset?, returnType?: 'address'|'bytes'|'number'|'uint8', ignoreRelative? }`.
  - `user/ConstructorArgsHandler.ts`: `{ type: 'constructorArgs', nameArgs?: boolean }`, field conventionally `constructorArgs`.
  - `user/HardcodedHandler.ts`: `{ type: 'hardcoded', value }`.
  - The union `UserHandlerDefinition` in `user/index.ts` has 33 members; a
    schema error against the union is unreadable. Validate the draft against
    the specific definition selected by `type` (section 6, R2).
- Config schemas: `discovery/config/StructureConfig.ts` (`StructureContract`:
  `fields[name] = { handler?, template?, copy?, edit? }`, `ignoreMethods`,
  `ignoreRelatives`, `ignoreInWatchMode`, `types`), `ColorConfig.ts`
  (description, severity, type), `PermissionConfig.ts`. All three parse the
  same `template.jsonc` with non-strict `v.object`, so a file with only
  `fields[*].handler` and `ignoreMethods` is valid for all of them.
- Blip: `blip/type.ts` (grammar), `blip/validateBlip.ts`,
  `blip/BlipRuntime.ts`. `["format", Name]` resolves `Name` through
  `discovery/type-casters/index.ts` (`FormatSeconds`, `Undecimal`, …) or a
  template `types` entry. Edits are applied in
  `discovery/handlers/decodeHandlerResults.ts` after all handlers ran.
- Researcher-facing handler docs with examples: `packages/discovery/README.md`
  sections "Handlers" (from "### Storage handler") and "Edit". Condense the
  eight relevant sections into the model-facing docs (section 5).
- Flattened source: V1 flattens at save time
  (`discovery/output/flattenDiscoveredSource.ts`) with
  `flatten/flatten.ts` `flattenStartingFrom(bundle.name, bundle.source.rootFile, files, bundle.source.remappings, { includeAll: true })`
  and `addSolidityVersionComment`. The research branch's
  `packages/discovery-v2/src/prepare/prepare.ts` (`flatten` function) shows
  the exact call per bundle. Do the same at author time; a bundle that fails
  to flatten becomes an empty string plus a warning.
- CLI: `cli/discoverCommand.ts` exports `DiscoverCommandArgs` (cmd-ts) and
  `discover(config: DiscoveryModuleConfig, chainConfigs, logger)`;
  `discovery/runDiscovery.ts` `discover(...)` builds the engine via
  `discovery/getDiscoveryEngine.ts`. `packages/l2b/src/commands/Discover.ts`
  spreads `DiscoverCommandArgs` so a new flag appears in `l2b discover`
  automatically; `packages/l2b/src/implementations/discovery/discoveryWrapper.ts`
  passes the config through. `config/types.ts` `DiscoveryModuleConfig` is
  where the flag fields go. The backend constructs its engine in
  `packages/backend/src/modules/update-monitor/createDiscoveryRunner.ts`
  and must never receive a templatizer.
- Disco UI server: `packages/l2b/src/implementations/discovery-ui/main.ts`
  (`/api/terminal/discover` runs the CLI; `/api/handlers` lists handler
  schemas; template routes in `templates/router.ts`, shape creation in
  `templates/create-shape.ts`). UI integration is a later phase; the CLI
  flag is enough for the first ship.
- Paths: `discovery/config/getDiscoveryPaths.ts` → `{ root, discovery, cache }`
  (`cache` is the sqlite file path). Existing template creation helpers:
  `packages/l2b/src/implementations/initTemplate.ts` and
  `packages/l2b/src/commands/AddShape.ts`.

## 4. Architecture

Directory: `packages/discovery/src/discovery/templatizer/`. Suggested layout
(rename freely, keep the responsibilities):

```
templatizer/
  Templatizer.ts        orchestrator: trigger entry point, dedupe by shape hash, serialise model calls
  worklist.ts           ABI → items (view/pure with ≥1 input) + events, sorted; port of discovery-v2 types/Worklist.ts
  baseline.ts           the values already fetched for the address (0-arg getters, 5-index probes, proxy $ values)
  freeze.ts             old template dry run → locked fields, broken fields, new-shape decision
  prompt/
    buildPrompt.ts      fixed section order; source last and the only part cut
    handlerDocs.md      model-facing docs for the 8 handlers + 3 blip forms, condensed from README
  draft/
    Draft.ts            the model's reply type + schema (section 5)
    validateDraft.ts    rules R1–R9 (section 6), Findings with paths
    dryRun.ts           R10: HandlerExecutor on the draft, zero-logs rule
  model/
    ModelClient.ts      start/resume interface (port as is)
    CodexClient.ts, codexEvents.ts, OpenCodeClient.ts, opencodeEvents.ts, process.ts, FakeModelClient.ts (port as is)
    parseModelJson.ts   (port as is)
  loop.ts               rounds: prompt → parse → validate → dry run → repair message, cap, artifacts
  write/
    templateFile.ts     draft → template.jsonc text with comments; provenance header
    writeTemplate.ts    directory, shapes.json via TemplateService.addToShape, reload
  artifacts.ts          ArtifactSink (port): trail of prompts, responses, findings per round
```

Data flow for one address, flag on, no template matched:

1. Analyzer has `sources`, `proxy`, `address`, `provider`. It has *not* run
   handlers yet. Run the system handlers first anyway (that is what
   `HandlerExecutor.execute` with the un-extended config does) to get the
   baseline values; they are needed in the prompt and V1 computes them
   regardless.
2. `Templatizer.templateFor(ctx)` where ctx = provider, address, project
   name, `ContractSources`, proxy values, baseline values, previous template
   id if any. Returns a template id or undefined (failed), and the analyzer
   proceeds exactly as if `findMatchingTemplates` had returned that id
   (`pushValues`, `extendedTemplate = { template, reason: 'byShapeMatch', templateHash }`).
3. Inside: dedupe by matching hash (in-flight map hash → promise). Empty
   worklist (no parametrized functions and no events) → write a template
   with no fields and no model call (V2 did this; saved a tenth of tokens).
4. Freeze path when a previous template id exists: dry-run its `fields`
   against the new code. All pass → `addToShape` on the old template, done,
   zero model calls. Some fail → locked = passing fields, prompt carries
   them as read-only, model rules only on the rest. In the write step,
   locked fields are copied byte-for-byte (including their comments,
   description, severity, permissions: copy the original JSON text of those
   entries, do not re-serialise) and the model's additions are appended.
   Also copy `ignoreMethods`, `ignoreRelatives`, `ignoreInWatchMode`,
   `types`, `displayName`, `description`, `category` from the old file
   untouched.
5. Loop (section 7). Accepted draft → write (section 8) → `reload()` →
   return id.
6. Failure after the cap: log the trail location, write nothing, return
   undefined; the analyzer continues untemplatized, as today. Never throw
   out of the analyzer for a model failure.

Concurrency: one model call at a time process-wide (a simple promise
queue). RPC dry runs may overlap. The engine's `Promise.all` at one depth
will therefore serialise on the templatizer; that is acceptable (a contract
takes 30–300 s, and researchers run this deliberately).

Flag plumbing: `DiscoveryModuleConfig` gains `ai?: boolean` and
`aiModel?: string`. `DiscoverCommandArgs` gains `--ai` (flag) and
`--ai-model <name>` (option). `runDiscovery.discover` constructs a
`Templatizer` only when `ai` is true and passes it to `getDiscoveryEngine`
→ `AddressAnalyzer` as an optional dependency. Provider selection by model
string: `opencode/…` → `OpenCodeClient`, anything else → `CodexClient`.
Default model: codex's default (what the research used as `gpt-5.6-sol`);
document `--ai-model opencode/deepseek-v4.1-flash` as the cheap option.
Both clients shell out to a CLI on PATH (`codex` 0.155.x, `opencode`
1.18.x) and need no SDK. Keep their isolation: read-only sandbox, tools
disabled, turns with tool calls refused, NO_TOOLS instruction for opencode.

## 5. What the model writes: the draft

One JSON object, no prose. It is the template's `fields` plus the verdicts
the file cannot hold.

```jsonc
{
  "fields": {
    "sequencers": {
      "handler": { "type": "event", "select": "account",
                   "add": { "event": "UpdateSequencer", "where": ["=", "#status", true] },
                   "remove": { "event": "UpdateSequencer", "where": ["!=", "#status", true] } },
      "covers": ["isSequencer(address)", "UpdateSequencer"],
      "reason": "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer"
    },
    "delay": {
      "handler": { "type": "call", "method": "getDelay", "args": [] },
      "edit": ["format", "FormatSeconds"],
      "covers": [],
      "reason": "…"
    }
  },
  "skips": [
    { "item": "committedBatches(uint256)", "reason": "unbounded" },
    { "item": "BatchCommitted", "reason": "user-activity" }
  ]
}
```

- `fields[name].handler`: one of the eight handler definitions, exactly as
  V1 parses them. `edit`: optional, whitelisted forms only. `covers`: the
  worklist items (function signatures `name(type,…)` and event names) this
  field answers. `reason`: one sentence naming the writer function and its
  modifier; becomes the comment above the field.
- `skips[]`: every worklist item not covered, with a reason from the closed
  set `user-activity | computation | unbounded | covered | not-state`
  (definitions and examples are in the research prompt,
  `packages/discovery-v2/src/author/prompt/buildAuthoringPrompt.ts`
  `renderRules()`; reuse that wording, it was tuned over several runs).
  For events the same reasons apply with `covered` meaning "its state is
  read by a getter or field already".
- Names: the Solidity identifier the value comes from (getter, state
  variable, or event subject in lowerCamelCase), or the fixed names
  `accessControl` and `constructorArgs`. Never a baseline getter's name
  (it would replace the getter, see section 3).

Prompt sections, fixed order, byte-identical for identical inputs:

1. Role and rules (rules 1–10 from `renderRules()`, respelled for handlers;
   drop the recipe and facts rules; add: names must not collide with
   baseline getters; `where` address literals are chain-prefixed).
2. Draft schema (JSON schema generated from the `v` definitions with the
   repo's `toJsonSchema`, restricted to the seven handler types) and one
   worked example: an abbreviated draft of Morph's Rollup
   (`_templates/morph/Rollup`). Not ScrollChain: a suite contract's answer
   in every prompt would inflate what the benchmark measures (12.2).
3. Handler docs: `handlerDocs.md`, condensed from README with the exact
   semantics listed in section 3 and the three blip idioms with examples.
4. Contract facts: identity (name, address, chain, block, proxy type,
   implementation names), merged ABI, baseline (name → value, values
   longer than 200 chars elided, "reference these as `{{ name }}`, never
   fetch again"), locked fields if freezing, worklist items, events.
5. Flattened source, all bundles, cut at 400k characters total with a
   marker; record `promptTruncated` in the trail.

## 6. Validator rules (findings carry `severity`, `path`, `message`; the message says what is wrong and what would be right)

Port the shape of `packages/discovery-v2/src/plan/validatePlan.ts`,
`Finding.ts`, `checkRecipeArgs.ts`, `abi/AbiIndex.ts`, `abi/literals.ts`.
Same ideas, V1 spelling.

- R1 JSON: `parseModelJson` (whole text, then fenced block, then outermost
  braces). Failure → one error "reply with exactly one JSON object".
- R2 Schema: top-level shape; each `fields[*].handler.type` must be one of
  the eight (error names the eight); then validate the handler with **that
  type's** `v.strictObject` definition so the message points at the wrong
  key. `edit` must pass `validateBlip` and R7. `skips[*].reason` closed set.
- R3 Coverage: every worklist item (function signature) and every event
  appears in exactly one `covers` or exactly one `skips[].item`; nothing
  unknown, nothing twice. Error per missing or duplicated item.
- R4 Names: field name pattern of a Solidity identifier; not a baseline
  getter name; not `$`-prefixed; `accessControl` handler must be named
  `accessControl`; `constructorArgs` likewise.
- R5 ABI membership and arity: call/array `method` resolves through the
  same rules as `getFunctionFragment` (bare name + `args.length` arity, or
  full fragment; full fragment required when `address` is set); event
  names in every action resolve through `getEventFragment`; `select`,
  `groupBy`, `dedupBy` and every `#arg` in `where` exist on every event of
  the action (that is what `checkRecipeArgs` did); literal `args` type-check
  against the fragment (`literals.ts`); `roleNames` keys are bytes32;
  `storage.slot` shape.
- R6 References: `{{ x }}` (and `{{ x.path }}`) in `args`, `address`,
  `length`, `indices`, `slot` resolve to a baseline field or a draft field;
  no cycles (`plan/references.ts` has the walker).
- R7 Blip whitelist: `where` ∈ `["=", "#a", lit]`, `["!=", "#a", lit]`;
  `edit` ∈ `["format", "FormatSeconds"]`, `["get", k, …]` (`Undecimal`
  dropped, see 12.2). Anything else: error listing the allowed forms.
- R8 Covers consistency: a `call` field may cover only the signature it
  calls; an `array` field only its method; an `event` field may cover
  getters (by claim) and the events it reads; `accessControl` covers
  `hasRole(bytes32,address)`, `getRoleAdmin(bytes32)` and the three OZ
  events; `hardcoded`/`storage`/`constructorArgs` cover nothing or by claim.
  A `covers` entry that is an event not read by the field → error.
- R9 Privileged events (new; from the three misses): an event skipped as
  `user-activity` or `not-state` whose every `emit` in the flattened source
  sits inside a function that carries an `only*` modifier (regex over the
  source: function header with a modifier matching `/\bonly[A-Z]\w*/`, body
  containing `emit <Event>(`), or inside the constructor only, is an error:
  "emitted only by privileged functions; fold it into a field or skip it as
  `covered` naming the getter". Keep the heuristic in one small function
  with tests on real flattened sources from the suite. If it misfires on a
  contract, downgrade to warning and note it here.
- R10 Dry run (only when R1–R9 have no errors): build a `StructureContract`
  from the draft (`fields` with handler+edit, `ignoreMethods` derived per
  section 8), run `HandlerExecutor.execute` at the analyzer's provider and
  block. Every field with `error` → error finding with the message and
  "fix the handler or skip the item". An `event` field with non-empty
  `covers` whose value is an empty array → error "no logs for events … up to
  block …, yet the field covers …; find the events the setters actually
  emit, enumerate another way, or skip". Empty and covering nothing →
  warning. Record per-field result sizes in the trail.

## 7. The loop

Port `packages/discovery-v2/src/author/author.ts` `converge` and `round`
minus the review pass and the plan store: first turn with the prompt, then
while findings contain errors and `rounds < cap` (default 3, flag
`--ai-rounds`), resume the thread with `repairMessage(findings)` (errors
first, then warnings, numbered, "return the whole corrected draft"). A turn
the client refuses (tool call emitted) counts as a round and is retried
with the same message. First clean pass wins. Artifacts per round:
`round-N.prompt.md`, `round-N.response.txt`, `round-N.findings.json`,
`round-N.dryrun.json`, plus `events.jsonl` and `summary.json`, under
`<dirname(paths.cache)>/templatizer/<project>/<address>/` (check
`.gitignore` covers it; the sqlite cache lives there and is ignored). Log
one line per round: round, errors, warnings, duration, tokens.

## 8. Writing the template

- Template id: `<project>/<ContractName>`; if that directory exists with a
  different shape, `<project>/<ContractName>-<first 8 hex of the hash>`.
  Freeze path reuses the old id.
- `template.jsonc` content, in this order: `$schema` (relative path as
  `ensureTemplateExists` computes it), one header comment
  `// Authored by <model> via l2b discover --ai on <date>, <n> round(s). Review before committing.`,
  `displayName`, `ignoreMethods` (see below), `fields`. Each field preceded
  by `// <reason>` and, when `covers` is non-empty, `// covers: a(b), EventC`.
  Produce the text with a small serializer that emits comments; `formatJson`
  cannot. Two-space indent, keys in the order above, fields in the model's
  order. Verify the result parses with `readJsonc` and with
  `StructureContract.parse` before writing.
- `ignoreMethods`: every skipped worklist item that V1 would otherwise probe
  automatically, i.e. functions with exactly one `uint256` input (the
  5-index probe), by bare name. Other skips have no V1 effect and stay in
  the trail only.
- `shapes.json`: `templateService.addToShape(id, chain, [bundle.address], fileName, blockNumber, [bundle.source])`
  with the bundle chosen as in section 3; `fileName` = `<ContractName>.sol`
  (existing convention, e.g. `ScrollChain.sol`; variants use
  `ScrollChain_Feynman`), and on a key collision in the freeze path
  `<ContractName>_<first 8 hex of the hash>`. Then `reload()`.
- Provenance beyond the header (verdicts, decision hash, token usage) stays
  in the trail, not in the repo.

## 9. Implementation plan, in order, with "done" per step

1. **Worklist + baseline + prompt skeleton** (pure functions, tests from
   ABIs of the suite contracts). Done: byte-identical prompt for identical
   inputs, sections in order, source cut recorded.
2. **Draft type, schema, validator R1–R9** with tests per rule using
   the ScrollChain, DisputeGameFactory, SequencerInbox and
   NitroEnclaveVerifier ABIs/sources (all in the suite; sources are in the
   research branch under `packages/discovery-v2/runs/benchmark/gpt-5.6-facts/<project>/contracts/<addr>/prepared.json`
   if still present, else fetch via the sqlite cache by running discovery
   with `--dev`). Done: every rule has a failing and a passing test.
3. **Model clients + loop** ported with `FakeModelClient` tests: accepted
   on first turn, repaired on second, exhausted, refused-then-retried.
   Done: loop tests green, no network.
4. **Dry run R10** on top of `HandlerExecutor` with a mocked `IProvider`
   (existing handler tests show how). Done: error and zero-logs cases.
5. **Writer**: serializer with comments, `ignoreMethods` derivation,
   shapes via `addToShape`, reload. Done: round-trip test (write → parse
   with `readJsonc` → `StructureContract.parse` equals the draft's
   handlers), and the freeze path copies old entries verbatim.
6. **Analyzer hook + flag plumbing**: optional `Templatizer` in
   `AddressAnalyzer`, `--ai`, `--ai-model`, `--ai-rounds`, backend untouched
   (grep that nothing under `packages/backend` can construct it). Done:
   `l2b discover scroll --ai --dev` on a copy of `_templates` with one
   template removed authors it back and the run ends templatized.
7. **Freeze path** with the previous-template lookup. Done: a test where
   one field breaks and the rest are copied byte-identical; a test where
   nothing breaks and only `shapes.json` changes.
8. **Benchmark harness** (port `benchmark/attribution.ts`, `compare.ts`,
   `types.ts`, `render.ts`; the HTML renderer is optional): for each
   project in the suite (`packages/discovery-v2/benchmarks/suite.json`),
   for each verified contract that has a template, hide that template
   (TemplateService over a temp copy of `_templates` minus it), templatize,
   analyse with the generated template at the committed block
   (`usedBlockNumbers`), compare values with the committed `discovered.json`
   field by field. Report handler fields found, missed, different, plus
   tokens and rounds. Target: ≥ 34 of 55 handler fields on the suite, and
   the three event-only misses (revertedBatches, challenges,
   zkVerifierRoutes) flipped to found by R9. If the number is lower, the
   port regressed something; diff prompts against the research trail.
9. Update this document with what changed, then stop. No commits.

Deferred, deliberately: `eventCount` by event name; Disco UI button;
solc facts; a second review turn; multi-key mapping handler; AI for
severity/description, `ignoreRelatives`, permissions (each is one more
proposer writing into the same file with the same loop).

## 10. Defaults chosen so you do not stop to ask

- Flag names: `--ai`, `--ai-model`, `--ai-rounds`. Config keys `ai`,
  `aiModel`, `aiRounds`.
- Round cap 3. Source cap 400,000 characters. Model call timeout as the
  ported clients have it (codex 15 min, opencode 8 min).
- Unverified contracts, EOAs, references, diamonds: never templatized.
- Empty worklist: template written with no fields, no model call, header
  comment says so.
- Failure: log, keep trail, continue untemplatized, exit code unchanged.
- Model reasons go into comments; nothing else the model says is kept in
  the repo.
- Hash for dedupe and for the shape: `getHashForMatchingFromSources(sources.sources)`.
- One model call at a time, process-wide.

## 11. Pointers into the research branch (absolute path prefix `/home/l2beat/.t3/worktrees/l2beat/t3code-aeb04122/packages/discovery-v2/`)

| Port | From | Notes |
| --- | --- | --- |
| Worklist | `src/types/Worklist.ts`, `src/abi/AbiIndex.ts` | `needsVerdict` = view/pure with ≥1 input; add events as items too |
| Prompt wording | `src/author/prompt/buildAuthoringPrompt.ts` | `renderRules`, `renderFacts` (identity/ABI/baseline/worklist/events), source rendering with cap |
| Validator shape | `src/plan/validatePlan.ts`, `Finding.ts`, `checkRecipeArgs.ts`, `references.ts`, `src/abi/literals.ts` | Findings with paths; ABI cross-checks; literal typing |
| Loop | `src/author/author.ts` | `converge`, `round`, `repairMessage`, artifacts, refused-turn handling; drop review and plan store |
| Model clients | `src/author/codex/*`, `src/author/opencode/*`, `src/author/process.ts`, `src/author/parseModelJson.ts`, `src/author/ArtifactSink.ts` | Port as is with their tests; `opencodeEvents.readUsage` sums cached tokens into input |
| Dry-run rules | `src/author/author.ts` `dryRun`, `zeroLogsFinding` | Respelled over `HandlerExecutor` results |
| Benchmark | `src/benchmark/attribution.ts`, `compare.ts`, `types.ts`, `render.ts`, `renderHtml.ts`, `loadProject.ts`, `benchmarks/suite.json`, `BENCHMARK.md` | Verdicts: equal, equal-renamed, equal-by-value, different, v1-only, v2-only; display-only projections excluded |
| Not ported | `src/facts/*`, `src/library/*`, `src/execute/*`, `src/jq/*`, `src/output/*`, `src/plans/*`, `src/prepare/*` | Facts deferred; recipes/executor replaced by V1 handlers; prepare replaced by the analyzer's own data |

Research trail with prompts, responses and findings per contract, useful
when a prompt respelling loses quality:
`packages/discovery-v2/runs/benchmark/<label>/<project>/contracts/<address>/`
(labels: `gpt-5.6-facts`, `deepseek-flash`, `deepseek-flash-facts`,
`deepseek-flash-review`, `deepseek-flash-review-facts`; the first GPT-5.6
one-shot run has no label and sits directly under `runs/benchmark/scroll`,
`base`, `plumenetwork`). The directory exists as of writing but is
gitignored; the committed numbers are in
`packages/discovery-v2/benchmarks/<label>/<project>.json`.

## 12. Implementation record (2026-09-29, branch `t3code/2adff848`)

Everything in section 9 is implemented, uncommitted, in the working tree.
This section is what a later thread needs on top of sections 1–11: where
things live, what was decided differently and why, and what the runs showed.

### 12.1 Where things live

All under `packages/discovery/src/discovery/templatizer/`:

| Module | Responsibility |
| --- | --- |
| `Templatizer.ts` | Entry point `templateFor(request)`: dedupe by shape hash (`inFlight`), new / empty-worklist / freeze paths, never throws |
| `templatizerSettings.ts` | `--ai` flags → `TemplatizerSettings`; previous templates from the committed discovered.json |
| `facts.ts`, `baseline.ts`, `worklist.ts`, `flattenSources.ts` | What the model is told: facts from the analyzer's data, baseline from the untemplatized handler run, worklist (functions *and* events), V1-identical flattening |
| `prompt/` | `buildPrompt`, `handlerDocs.ts` (a TS string: `dist/` ships no .md), `draftJsonSchema.ts` |
| `draft/` | `Draft.ts` types and schemas, `validateDraft.ts` (R1–R9, one module per rule), `privilegedEvents.ts` (R9 heuristic), `dryRun.ts` (R10) |
| `loop.ts` | Rounds, repair messages, refused turns, trail |
| `model/` | `CodexClient`, `OpenCodeClient`, `FakeModelClient`, `SerialModelClient` (one turn at a time), `createModelClient` |
| `freeze.ts` | Old template dry run → locked / broken fields, remaining worklist |
| `write/` | `templateFile.ts` (serializer with comments; output survives `biome format`), `jsoncEntries.ts` (verbatim entry extraction), `ignoreMethods.ts`, `writeTemplate.ts` (id choice, shapes, reload, match check) |
| `benchmark/` | Harness behind `discovery templatizer-benchmark` (`src/cli/templatizerBenchmarkCommand.ts`) |
| `test/` | Four real suite contracts as fixtures (ABI, baseline, full flattened implementation sources) |

Outside that directory: `AddressAnalyzer` (optional 5th constructor
argument, `authorTemplate`), `getDiscoveryEngine` (optional 7th argument,
settings; the backend passes six), `runDiscovery`, `discoverCommand`
(`--ai`, `--ai-model`, `--ai-rounds`), `config/types.ts`,
`flattenDiscoveredSource.ts` (exports `addSolidityVersionComment`),
`cli.ts` (benchmark command). `Templatizer` is not exported from the
package index, so nothing outside `packages/discovery` can build one.

Run it: `l2b discover <project> --ai [--ai-model opencode/deepseek-v4.1-flash] [--ai-rounds 3]`.
Trail per contract: `packages/config/cache/templatizer/<project>/<address>/`
(`round-N.{prompt.md,response.txt,findings.json,dryrun.json}`,
`events.jsonl`, `summary.json`, `draft.json`), gitignored with the cache.
Benchmark: from `packages/discovery`,
`node --env-file=../backend/.env --import tsx src/cli.ts templatizer-benchmark --out <dir> [--ai-model …] [--project scroll] [--limit n]`.

### 12.2 Decisions taken during implementation

- **Seven handler types plus `edit`.** Section 2's "eight handlers" counts
  `edit`; `HANDLER_TYPES` has the seven real types.
- **`Undecimal` is not whitelisted.** Without a `types` entry carrying
  `decimals` it throws in `decodeHandlerResults`, and a draft has no
  `types`. Only `["format", "FormatSeconds"]` and `["get", …]` remain.
- **Diamonds are EIP-2535 only.** `recalculateSourceHashes` collapses more
  than two bundles into `[proxy, combined(implementations)]`, so V1 matches
  RollupProxy-style proxies; the shape is written from `bundles.slice(1)`
  (`matchedBundles`). Every write is followed by `findMatchingTemplates`
  and fails loudly if V1 would not match what was written.
- **References.** Proxy `$…` values are not handler results and cannot be
  referenced; `{{ $.address }}` is chain-prefixed and cannot be a call
  argument. Literal call arguments must be plain `0x…` (ethers cannot
  encode `eth:0x…`); only `where` literals are chain-prefixed.
- **Probed names.** A draft field may reuse the name of a single-`uint256`
  getter V1 probes at 0–4 only when it is an `array` over that very
  function (the V1 idiom: the full array replaces the probe). 0-argument
  getter names are reserved.
- **Method spelling.** V1 accepts a bare name or a full fragment, never
  `name(types)`, and resolves a bare name with `startsWith`, so `owner`
  with one argument can resolve to `owners(uint256)`. R5 runs V1's own
  `getFunctionFragment` and rejects both traps.
- **R4 naming heuristic only warns.** Membership fields are named after
  their members (`sequencers` for `isSequencer(address)`) and formatted
  copies after the getter (`rollupDelayPeriodFormatted`); such names often
  appear nowhere in the source.
- **R9.** The modifier regex is `/\b[Oo]nly[A-Z]\w*/` (ScrollChain's
  `OnlyTopLevelCall`), and emitters are graded: *authority* (constructor or
  a modifier naming an owner, admin, role or governance body) is an error,
  *guarded* (any other `only*`) a warning, because the suite survey showed
  `onlyCallByCounterpart`, `onlyInDropContext`, `onlyOtherBridge` and
  `onlyAllowed` guarding user withdrawals and deposits. Survey over the 79
  suite contracts: 95 of 508 events flagged (74 errors, 21 warnings).
  Debatable but kept as errors: timelock operation events behind
  `onlyRole` (the model can skip them as `covered`).
  RollupProxy's `RollupChallengeStarted` has no emit site in any bundle, so
  R9 cannot flip `challenges`; at most two of the three event-only misses
  are reachable through R9.
- **R10 zero-logs rule.** Every event field covers the events it reads, so
  "non-empty covers → error" would always fire. An empty event field is an
  error when it covers a *function*, a warning when it covers only events.
- **R10 unread declaration (new).** An empty event field whose event name
  has another declaration in the ABI that *does* have logs is an error. Found
  on the first real run: ScrollChain declares `RevertBatch` twice; the
  current code emits `(startBatchIndex, finishBatchIndex)`, which has no
  logs, while the 59 reverted batches sit under the legacy
  `(batchIndex, batchHash)`. The model followed the new finding in one
  round.
- **R10 relatives cap (new, from the e2e run).** Discovery follows every
  address a field holds. The first e2e run authored a
  `ScrollStandardERC20Factory` field folding `DeployToken` into every bridged
  token; scroll grew from 96 to 163 contracts and hit `maxAddresses`,
  dropping 41 addresses. A field whose value holds more than 20 distinct
  addresses without `ignoreRelative: true` is now an error; the prompt and
  the handler docs say so. The benchmark numbers in 12.4 predate the rule,
  which cannot change values (`ignoreRelative` only stops following).
- **Worked example** is an abbreviated Morph Rollup draft, not ScrollChain
  (benchmark contamination). The rules still mention `RevertBatch` as an
  example of event-only state, as the research prompt did, so numbers stay
  comparable with the research runs.
- **Rounds.** `--ai-rounds` counts model turns including the first
  (default 3). A refused turn counts as a round and is asked again with the
  same message (OpenCode also retries a refused first turn once itself).
- **Freeze path.** Fields without `handler`/`copy`/`edit` never count as
  broken (a reverting getter must not cost a researcher's severity). The
  old `ignoreMethods` is copied verbatim unless the new skips add names,
  then it is re-rendered as the union. Risk left open, see 12.5.
- **Serialisation.** Document, `fields`, each field and each `handler` are
  always expanded; other values go on one line when they fit 80 columns.
  The output is stable under `biome format`. Extraction reproduces every
  top-level and field entry of all 1,267 committed templates byte for byte.
- **Codex CLI** is 0.159.0 on this machine; every isolation flag was checked
  with `codex exec --help` and `codex exec resume --help`.

### 12.3 Tests

`pnpm test`, `pnpm typecheck` and `pnpm lint` in `packages/discovery` are
clean (1,231 tests at the time of writing, about 245 of them the
templatizer's). Every validator rule has passing and failing cases on the
real fixtures, including a full ScrollChain draft that passes with zero
errors. The loop is tested with `FakeModelClient` (accepted first turn,
repaired, dry-run repair, exhausted, refused-then-retried, unparsable). The
orchestrator is tested end to end against a temp `TemplateService`, a real
`HandlerExecutor` and a mocked provider, including both freeze outcomes
(one field broken → locked entries copied byte for byte; nothing broken →
only `shapes.json` changes, no model call).

### 12.4 Benchmark results

Harness: every suite contract that has a committed template (64: scroll 34,
base 24, plumenetwork 6), each with its own template hidden and authored
from scratch, analysed at the committed block and compared with the
committed discovered.json using the research's verdicts unchanged. The
handler-field denominator is 60 here (the research's was 55, because it
also ran contracts without templates); both are reported.

| Run | Handler fields (our 60) | Research's 55 fields | V1 fields found | Failed | Rounds 1/2/3 | Tokens in (cached) / out |
| --- | --- | --- | --- | --- | --- | --- |
| DeepSeek V4.1 Flash, first prompt | 34/60 | 31/55 | 800/832 | 1 (refused ×3) | – | 3.05M / 43k |
| **DeepSeek V4.1 Flash, final prompt** | **37/60** | **34/55** | **806/833** | **0** | 36/25/3 | 3.05M (0.96M) / 43k |
| Codex default model (partial) | 8/13 on 25 scroll contracts | – | – | stopped: workspace out of credits | – | 1.71M / 35k |

Research for reference on the same 55 fields: DeepSeek one shot 32,
GPT-5.6 with compiler facts 34 (the best setup). The final run matches the
best research setup with the cheap model and no compiler facts.

Against the research DeepSeek run, gained: `zkVerifierRoutes` (R9 made the
skip of `ZkRouteAdded`/`ZkRouteWasFrozen` an error), `inboxHistory`,
`outboxHistory` (plumenetwork Bridge). Lost: `activeVerifiers`
(SP1VerifierGateway): the model folds `RouteAdded`/`RouteFrozen` into maps
keyed by selector, the committed field is a list of `{selector, verifier}`,
and the comparison reads only object values, never keys; the information is
there, the verdict is a shape artefact.

The three event-only misses of section 2: `zkVerifierRoutes` flipped;
`revertedBatches` now holds all 59 reverted batches (after the new R10
unread-declaration rule) but selects `batchIndex` and `batchHash` where the
committed template selects `batchIndex`, so it is `different`;
`challenges` cannot flip (no emit site, see 12.2).

What the first run taught, fixed before the final one: the prompt described
`array` `indices` only as literal keys, so the model never used V1's
"collect keys from events, read the getter per key" idiom (the committed
MultipleVersionRollupVerifier template: `verifierVersions` from
`UpdateVerifier`, then `latestVerifier`/`legacyVerifiersLength` with
`"indices": "{{ verifierVersions }}"`). Rule 6 now teaches it; that contract
went from 1/3 to 3/3 with a template equal to the committed one.

Remaining misses on the 55, by cause: project-specific handlers or
hardcoded values (opStackDA, sequencerInbox, batchPosters, dacKeyset,
postsBlobs, sequencerVersion, isPostBoLD), release-note selectors (the six
RiscZero `verifier_*`), `eventCount` (permissionedGamesTotal, keySetUpdates,
setIsBatchPosterCount; deferred by design), a short-number value the
by-value rule cannot credit (initBondGame42), Scroll's own access-control
shape (ScrollOwner.accessControl), and the three above.

### 12.4b End-to-end run (step 6)

`discover scroll --ai --dev --ai-model opencode/deepseek-v4.1-flash`, run
from a scratch root (`/tmp/templatizer-e2e`: a copy of
`packages/config/src/projects` with `_templates/scroll/ScrollChain` emptied,
the worktree's sqlite cache). Scroll then had 38 verified untemplatized
contracts plus ScrollChain.

- ScrollChain was authored back: `sequencers` and `provers` identical to the
  committed template, the same four `ignoreMethods`, `revertedBatches`
  selecting `batchIndex` and `batchHash`, and the shape recorded under the
  committed `ScrollChain_Feynman` hash and implementation address, so V1
  matched it on the same run.
- The run finished (exit 0) with 24 templates written (20 authored, 4 with
  no model call because the worklist was empty) and one give-up: Scroll USDC
  (`FiatTokenV2_1`), whose `blacklisted` fold over `Blacklisted` is empty
  while it claims `isBlacklisted(address)`; the model kept the claim for
  three rounds, so the contract stayed untemplatized, as designed.
- It also exposed the relatives problem of 12.2: an authored
  `ScrollStandardERC20Factory.deployedTokens` made discovery follow every
  bridged token, and the run hit `maxAddresses` (41 skipped). With the cap
  and the prompt rule in place, a rerun re-authored that template in one
  round and the model added `"ignoreRelative": true` on its own. That rerun
  was stopped before it finished (see below), so "the run stays under
  `maxAddresses`" is not yet confirmed end to end.
- Wall time was dominated by the Scroll L2 RPC, not the templatizer:
  full-range `eth_getLogs` time out on Alchemy, V1 retries each range with
  backoff and (with the provider change of 12.5) splits it; one run took
  about 13 hours, almost all of it in those retries. Before the provider
  change, the run died on the first such timeout, with or without `--ai`.
  Rerun with a faster `SCROLL_EVENT_RPC_URL_FOR_DISCOVERY`.

### 12.5 Open issues for the reviewer

- **The freeze path edits a shared template.** A template serves every shape
  in its `shapes.json`; removing a broken field or adding one changes the
  output of contracts with the older shapes too. The spec asked for it
  (same id, locked fields verbatim); the diff shows it, but a safer variant
  would write a sibling template for the new shape instead.
- **V1 provider change outside the templatizer.** `BatchingAndCachingProvider`
  now also halves a log range when Alchemy answers "Query timeout exceeded.
  Consider reducing your block range". Without it `discover scroll` died on
  full-range `Upgraded` log queries on Scroll L2 in this environment, with
  or without `--ai`. It affects the backend too (only for the better).
- **V1 logs RPC URLs.** `rpcWithRetries` logs the raw ethers error, whose
  message contains the RPC URL and with it the API key. Pre-existing; do not
  paste discovery logs anywhere.
- **The committed ScrollChain template reads only the legacy `RevertBatch`.**
  The bare name resolves to the first declaration, `(batchIndex, batchHash)`,
  which only older implementations emitted; reverts under the current
  `(startBatchIndex, finishBatchIndex)` declaration are missed.
- **Benchmark shape artefacts.** Maps keyed by an event argument are not
  credited against lists of objects (`activeVerifiers`, `allVerifiers` in
  the first run). Crediting keys as leaves would be defensible but would
  make numbers incomparable with the research runs; left as ported.
- **Fixtures.** `templatizer/test/fixtures/*.json` hold four full flattened
  implementation sources (about 400 kB), so R9 and the prompt are tested on
  real code.
