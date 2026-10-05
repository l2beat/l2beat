# AI templatizer for discovery: design and implementation plan

This file is written by Claude for Claude. It is the whole memory of a long
research thread (branch `prototype-sol-query-flow`, package
`packages/discovery-v2`) that ended with the decision below. Read all of it
before touching code, reread the relevant section at every design fork, and
update it when a decision here turns out wrong. It is the rationale of the
feature and lives next to the code on purpose.

Keep this file at `packages/discovery/docs/ai-templatizer.md`.

> **Superseded as the description of record** by
> `docs/mdbook/specs/l2b_specs/ai_templatizer.md` (2026-10-02). That
> document says how the templatizer works now; this file is the design
> history, and 12.2 remains the log of decisions. Where the two disagree,
> the spec is right.

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
    dryRun.ts           R10: HandlerExecutor on the draft; empty folds are noted, not rejected
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

> Superseded 2026-10-02: the checks are reduced to structure and failure
> (rule 3 of the spec); see 12.2 "Checks reduced" for what went and why.

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
  contract, downgrade to warning and note it here. (Since 2026-10-01 an
  advisory, not an error; see 12.2, "Advisories".)
- R10 Dry run (only when R1–R9 have no errors): build a `StructureContract`
  from the draft (`fields` with handler+edit, `ignoreMethods` derived per
  section 8), run `HandlerExecutor.execute` at the analyzer's provider and
  block. Every field with `error` → error finding with the message and
  "fix the handler or skip the item". ~~An `event` field with non-empty
  `covers` whose value is an empty array → error "no logs for events … up to
  block …, yet the field covers …; find the events the setters actually
  emit, enumerate another way, or skip". Empty and covering nothing →
  warning.~~ Superseded (12.2, "R10 empty folds"): an empty event field is
  accepted and its template carries a note for the reviewer. Record
  per-field result sizes in the trail.

## 7. The loop

> Superseded 2026-10-02: no advisory round; see the spec.

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
| `Templatizer.ts` | Entry points `templateFor(request)` (dedupe by shape hash, new / empty-worklist / code-changed paths) and `revisit(request, templateId)` (`--ai-revisit`, once per template); existing templates are only appended to; a failure stops discovery (`TemplatizationFailedError`) |
| `templatizerSettings.ts` | `--ai` flags → `TemplatizerSettings`; previous templates from the committed discovered.json |
| `facts.ts`, `baseline.ts`, `worklist.ts`, `flattenSources.ts` | What the model is told: facts from the analyzer's data, baseline from the untemplatized handler run, worklist (functions *and* events), V1-identical flattening |
| `prompt/` | `buildPrompt`, `handlerDocs.ts` (a TS string: `dist/` ships no .md), `draftJsonSchema.ts`, `readmeSections.ts` (README sections for handlers existing fields use) |
| `draft/` | `Draft.ts` types and schemas, `validateDraft.ts` (schema, coverage, names, covers, V1 construction; one module per check), `fieldReads.ts` (what a handler names), `dryRun.ts` (V1 run through the analyzer's config; notes for the reviewer) |
| `loop.ts` | Rounds, repair messages, refused turns, trail |
| `model/` | `CodexClient`, `OpenCodeClient`, `FakeModelClient`, `SerialModelClient` (one turn at a time), `createModelClient` |
| `existingTemplate.ts` | An existing template run through the analyzer's config: every field kept, failing ones noted, remaining worklist |
| `write/` | `templateFile.ts` (serializer for new templates; output survives `biome format`), `appendToTemplate.ts` (inserts into an existing template's text and asserts the old text is untouched), `jsoncEntries.ts` (entries with offsets), `ignoreMethods.ts`, `writeTemplate.ts` (id choice, shapes, reload, match check) |
| `benchmark/` | Harness behind `discovery templatizer-benchmark` (`src/cli/templatizerBenchmarkCommand.ts`) |
| `test/` | Four real suite contracts as fixtures (ABI, baseline, full flattened implementation sources) |

Outside that directory: `AddressAnalyzer` (optional 5th constructor
argument, `authorTemplate`, `revisitTemplate`, `TemplatizeRequest.config`),
`getDiscoveryEngine` (optional 7th argument, settings; the backend passes
six; `createAddressAnalyzer` is the one wiring discovery and the benchmark
share), `config/structureUtils.ts` (`withTemplate`), `runDiscovery`,
`discoverCommand` (`--ai`, `--ai-model`, `--ai-rounds`, `--ai-revisit`),
`config/types.ts`,
`flattenDiscoveredSource.ts` (exports `addSolidityVersionComment`),
`cli.ts` (benchmark command). `Templatizer` is not exported from the
package index, so nothing outside `packages/discovery` can build one.

Run it: `l2b discover <project> --ai [--ai-model opencode-go/deepseek-v4.1-flash] [--ai-effort high] [--ai-rounds 3]`.
A model goes to opencode when it names one of opencode's gateways,
`opencode/…` (Zen account) or `opencode-go/…` (Go subscription); any other
name goes to Codex. The runs recorded below used `opencode/` (Zen).
Add `--ai-revisit` (implies `--ai`) to also let the model extend every
template that already matches (12.2).
Trail per contract: `packages/config/cache/templatizer/<project>/<address>/`
(`round-N.{prompt.md,response.txt,findings.json,dryrun.json}`,
`events.jsonl`, `summary.json`, `draft.json`), gitignored with the cache.
Benchmark: from `packages/discovery`,
`node --env-file=../backend/.env --import tsx src/cli.ts templatizer-benchmark --out <dir> [--ai-model …] [--suite quick|full] [--project scroll] [--limit n]`
(`quick`, the default, is the 14-contract suite of 12.2; `full` the research suite).

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
- **R10 empty folds (revised 2026-10-01).** First implemented as specified:
  an empty event field was an error when it covered a *function*, a warning
  when it covered only events. Reviewing the AnchorStateRegistry trail
  showed the rule backfiring. Base has blacklisted no game, so the model's
  correct `DisputeGameBlacklisted` fold (identical to the committed
  `blacklistedGames`) came back empty and was rejected. The model then
  dropped it and called the items `unbounded`. Across every trail the rule
  fired 27 times and the field was dropped 17 times: Safe `modules`, gateway
  `tokenMapping` (committed as `{}`), Plume `sequencers`/`allowList`, Scroll
  `droppedMessages`, Scroll USDC `blacklisted`. Two benchmark "misses"
  (`blacklistedGames`, L1CustomERC20Gateway `tokenMapping`) were this rule.
  Logs cannot tell "nothing happened yet" from "written without these
  events", and a dropped field is invisible while an empty one is reviewed,
  so emptiness is now never a finding. The dry run records a note
  (`empty at block N: no logs yet for E`, or `the K logs for E fold to
  nothing`) and the writer puts it under the field's `covers` comment.
  Replaying the 26 rejected drafts verbatim at their blocks (scripted
  model, sqlite cache) accepted all 26. The known cost: Plume's
  `batchPosters` fold over `BatchPosterSet` is now accepted as `[]` although
  9 posters exist, because an older implementation set them without that
  event (V1 reads them with the custom `arbitrumActors` handler). The note
  is what flags it. A getter probe that would catch it (call
  `isBatchPoster` for the senders of recent transactions) was considered
  and left out to keep the validator to rules that are certain.
- **Advisories (2026-10-01).** An error now means certain: V1 would fail
  or silently do something else, or the draft breaks the protocol (an item
  without a verdict). The three rules that were judgments, R9's authority
  tier, R10's unread declaration and R10's relatives cap, raise an
  `advisory` instead. They are kept, because each fixed an observed
  failure, but none blocks. A draft with no error and with advisories is
  shown them once ("judgments, not errors; change the draft where one
  applies"), and the reply is accepted unless it has errors. If the reply
  cannot be repaired in the rounds left, the draft that was asked about is
  accepted, so the extra turn can only help. No turn is spent on
  advisories in the last round. Advisories that still apply are written
  into the template as `// review: …` lines: under the field for field
  paths, under the header for skips. Rule for later rules: an error only
  when certain, otherwise an advisory with a test named after its case.
- **`--ai-revisit` (2026-10-01).** Implies `--ai`. A contract that exactly
  one template matches takes the changed-code path as if its code were
  new: fields that execute are locked verbatim, broken ones are removed,
  and the model rules on what the template leaves undecided. Two
  differences from changed code. The model is asked even when nothing
  broke, because finding what the template misses is the point. The shape
  is not added, because it is already there. Nothing is written when
  nothing broke and the draft adds no field and no `ignoreMethods`. A
  template is revisited once per run, on the first contract that matches
  it; contracts sharing it wait and then use the result. Templates
  authored or extended in the same run are not revisited. Shared
  templates (`opstack/*`, `GnosisSafe`, `global/*`) are rewritten from one
  contract's code, so other shapes of the same template may break; the
  git diff shows it.
- **`--ai-effort` (2026-10-01), default `high`.** Before it, neither
  backend got an effort: opencode ran the model's default, and Codex its
  built-in one (`--ignore-user-config` hides `config.toml`). The level
  goes to opencode as `--variant` and to Codex as `model_reasoning_effort`.
  It is checked once at startup because neither backend complains early:
  `opencode run --variant` silently ignores a level the model lacks (a
  typo would run at the default), and Codex forwards any value to the API,
  which rejects it on every turn. For opencode the levels come from
  `opencode models <provider> --verbose`, and they differ per model
  (DeepSeek v4.1 flash: low, high, max; some models have none, and then the
  default `high` is dropped with no variant passed). For Codex the API's
  own list is used: none, minimal, low, medium, high, xhigh, max. The level
  is in the provenance header (`…, high effort`) and in `summary.json`.
  opencode turns are now killed after 15 minutes, as Codex's are (was 8):
  at the default effort a DeepSeek turn has already thought for six.
  The 12.4 runs used no effort setting.
- **A failed templatization stops discovery (2026-10-01).** Before, every
  failure was swallowed: the contract stayed untemplatized (or, under
  `--ai-revisit`, the template stayed as it was), discovery saved
  discovered.json, and only a WARN line told a failure from a decision. A
  missing template is missing values until someone notices, so now any
  contract `--ai` or `--ai-revisit` was asked to do and could not ends the
  run with a `TemplatizationFailedError` before discovered.json is
  written. The error names the contract, the reason, what to do and the
  trail. Templates written earlier in the run stay and match on the next
  run without a model call, so a rerun only redoes the failed contract.
  Three kinds of failure, each with its own advice:
  - the model did not answer (`model-unavailable`): timeout, API error
    (quota, rate limit, auth), CLI exit code, no session. It is not
    retried, because every retry would hit the same wall. The queue closes
    at once, so no other contract's turn starts.
  - no draft passed in the rounds (`no-acceptable-draft`).
  - a bug in the templatizer (`internal`).

  Only an unusable answer (a tool call, no text) is still asked again
  within the rounds; the smoke test's empty first answer was one. Model
  processes run in their own process group, so `process.ts` kills every
  running one when discovery exits. The benchmark keeps recording a failed
  draft as a miss (`onFailure: 'leave-untemplatized'`, since that is what
  it measures) and stops authoring once the model does not answer. Contracts
  that cannot be templatized at all (unverified, EIP-2535) are not failures
  and stay untemplatized as in V1. Verified with a fake `opencode` whose
  every `run` fails like a rate limit: exit code 1, the message, one model
  turn, discovered.json unchanged, no process left.
- **R10 unread declaration (new).** An empty event field whose event name
  has another declaration in the ABI that *does* have logs is an error
  (an advisory since 2026-10-01). Found
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
  addresses without `ignoreRelative: true` is now an error (an advisory
  since 2026-10-01); the prompt and the handler docs say so. The benchmark numbers in 12.4 predate the rule,
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
- **Additive only (2026-10-02).** The freeze path is gone. An existing
  template is never re-rendered: `appendToTemplate` inserts into its text
  (new fields at the end of `fields`, `// review:` lines directly above a
  field) and asserts that removing the insertions gives the old text back
  byte for byte before anything is written. A field that fails at the block
  is kept with `// review: fails at block N: <error>`; `ignoreMethods` of an
  existing template is never changed; the model's skips on an existing
  template go to the trail only. Why: a `--ai-revisit` run on zora removed
  `absolutePrestateDecoded` from `opstack/PermissionedDisputeGame`, a field
  40 projects share, because the old freeze deleted fields that failed a dry
  run, and that dry run was wrong (next entry). Code changed + `--ai` adds
  the shape and the notes and asks no model; `--ai-revisit` asks.
- **Never predict V1 (2026-10-02).** The dry run built its config with
  `makeEntryStructureConfig({}, address)`, without the global and project
  `types`, so `["format", "OpStackAbsolutePrestate"]` failed with "Type …
  is not supported" although the real run decodes it. Now the analyzer
  hands its own per-address config over (`TemplatizeRequest.config`), the
  dry run pushes the template onto a copy of it (`withTemplate`) and runs
  V1's `HandlerExecutor`; the failure pinning (a copy of V1's decode step
  and dependency ordering) is deleted, and a whole-run failure is reported
  as V1 reports it, with V1's messages improved to name the field
  (`executeHandlers`, `decodeHandlerResults`). The baseline takes every
  value and error of the untemplatized run and asks V1's `getHandlers` which
  name is a getter, a probe or an override field; the worklist's `probed`
  flag reads that off the baseline, so `ignoreMethods` derivation no longer
  re-derives the 0-argument-getter rule. The benchmark builds its analyzer
  through the same `createAddressAnalyzer` as discovery.
- **Checks reduced to structure and failure (2026-10-02).** Deleted: R5
  (`checkHandlers`, `checkEventHandler`, `resolveMethod`, `resolveEvent`,
  `abi/literals`), R6 (`checkReferences`, `references`), R7 (`checkBlips`,
  the blip whitelist, `whereLiterals`), R9 (`privilegedEvents`,
  `checkPrivilegedSkips`), the advisory round of the loop and the
  `advisory`/`warning` severities: about 2,500 lines of source and 1,700 of
  tests that predicted V1's run-time behaviour. In 41 real contracts and 59
  rounds those rules fired once (`proposalTypes(uint8)`), the dry run would
  have caught that case too, and R9 produced 27 advisories, several of
  which made the model drop correct fields. What stays blocks only on what
  is certain: JSON, V1's own schema per handler type and V1's `validateBlip`
  for `edit`/`where`, one verdict per worklist token, covers that match the
  names the handler carries (no resolution: a bare `method` names the
  overloads of its arity, a fragment names its signature), a name that
  collides with a baseline value or an existing field (the one exception
  stays: an `array` over the probe of its own name), construction with V1's
  `getUserHandler`, and a field error in the dry run. What the dry run
  observed (empty fold, which function a bare name read, more than 20
  addresses to follow, logs under another declaration of the event) is a
  `// review:` note above the field, never a finding. `fixedNames`
  (`accessControl`, `constructorArgs`) went too: the prompt still says so,
  `constructorArgs` is enforced by V1's constructor, and a misnamed
  `accessControl` is for the reviewer.
- **Quick benchmark suite (2026-10-02).** `suite.json` gains `quick`
  (default; `--suite full` is the research suite): 14 contracts, one per
  template, chosen for dense use of the generic handlers, all on Ethereum.
  Two numbers lead the report: reachable handler fields found (handler
  fields whose type the model is offered, minus `hardcoded`, `eventCount`,
  project-specific handlers, `call`s on another contract, and fields the
  suite marks `unreachable` with a reason) and regressions (proxy values,
  getters and override fields that went missing or changed). Override
  fields are attributed as `override`, since the effective config merges
  them with the template. The census that chose the suite found 184
  templates with at least three generic handler fields; the first run
  showed `metis/Lib_AddressManager` shares its shape with
  `opstack/AddressManager` (the templatizer never ran), so it was replaced
  by `interfold/SlashingManager`, and that
  `rocketpool/RocketDAOSecurityProposals` has an empty worklist (every
  committed field reads RocketStorage through `address`), so the model is
  never asked there; it stays in the suite as a known limit.
- **README sections in the prompt (2026-10-02).** When an existing
  template's fields use a handler type outside the seven or an `edit`
  operator other than `format`/`get`, the matching `### … handler` section
  (found by the `"type": "…"` it quotes) or `### \`op\`` section of
  `packages/discovery/README.md` is appended to section 3 of the prompt,
  read at run time so the two never drift; an undocumented type gets one
  line with the keys of its V1 schema. The alternative, a read tool, was
  rejected: neither CLI can restrict reads to a directory.
- **`ignoreMethods` not from `covered` skips (2026-10-02).** The first
  quick-suite run lost AgglayerGateway's `aggchainSigners` probe: the model
  skipped `aggchainSigners(uint256)` as `covered` although no field held the
  signers, the derivation ignored the method, and the only copy of the value
  went with it (the run's one regression). A probe is now ignored only when
  its getter is skipped as not worth reading or covered by a field of
  another name; a `covered` skip keeps the probe.
- **DeepSeek tool-call markup (2026-10-02).** DeepSeek V4.1 Flash sometimes
  writes `<｜｜DSML｜｜ calls>` … into its text when no tool is offered; on
  the first quick-suite contract that cost two of three rounds as "not
  JSON" findings. A text part holding that markup is now a tool part, so
  the turn is refused and sampled afresh like a real tool call.
- **No-tools reminder in the repair message (2026-10-02).** On zora,
  DeepSeek answered the repair message of `opstack/AddressManager` with
  shell commands twice in a row (`grep` for the event name across the
  repository): a reported failure is what tempts a model to go and look,
  and a refused repair round is not retried, so both rounds were lost. The
  repair message now repeats that the model has no tools. The system prompt
  said so already; this is a cheap second reminder at the point where it
  was ignored, not a fix. Measured by quick-suite run 3 (12.4c).
- **opencode pinned to its scratch directory (2026-10-02).** Every refused
  turn of run 2 began "I'll explore the repository" and ran `grep`, `ls`
  and `find` against this worktree's absolute path, which no prompt holds.
  Asked which paths it knew, the model quoted its system prompt: "Working
  directory: …/packages/discovery", "Workspace root folder: …/t3code-…",
  "Is directory a git repo: yes", and the first line of the repository's
  `AGENTS.md`. opencode takes its directory from `$PWD`, not from the cwd
  the client spawns it in, and the client passed `process.env` through.
  So the model was told it sat in a coding repository with instructions to
  follow, and behaved like a coding agent. The client now passes `--dir
  <scratch>` and sets `PWD` to the scratch directory; asked again, the
  model reports the scratch directory, no git repository and only
  `NO_TOOLS.md`. This closes an isolation gap as much as a quality one:
  tools were off, so nothing was read, but opencode's instruction
  discovery ran in the repository, and `AGENTS.md` includes
  `AGENTS.local.md`. The directory is one per client for the whole run,
  not one per turn as before: opencode keeps its sessions per directory,
  and the first attempt at run 3 stopped on LineaRollup's repair turn with
  "Unexpected server error" because that turn resumed the session from a
  new directory (reproduced and fixed with a two-turn script, PINEAPPLE
  remembered). `OpenCodeClient.test.ts` pins cwd, `--dir` and `$PWD` to
  one scratch directory holding only the isolation config, shared by a
  first turn and its resume.
- **Output token budget raised to 128,000 (2026-10-03).** "Too large for
  the model" was the wrong diagnosis of LineaRollup's failure in run 3. The
  context window is 1M tokens and the prompt 81k. What ran out was
  opencode's budget of 32,000 output tokens per turn
  (`OUTPUT_TOKEN_MAX` in `provider/transform.ts`, version 1.18.34), which
  DeepSeek's reasoning counts against: every "produced no text" refusal of
  run 3 (LineaRollup, HubPool, AgglayerGateway) ended with finish reason
  `length`, reasoning exactly 32,000 and output 0, and the two replies that
  did not parse as JSON (LineaRollup and HubPool round 2) were cut mid-string
  at reasoning + output = 32,000. Two accepted contracts came close (Rollup
  28,788, TroveManager 27,182). The client now sets
  `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=128000` for every turn, the flag
  opencode reads for this. It is not set to the model's own maximum (384k
  for DeepSeek) because opencode reserves the budget out of the context
  window and compacts the session when the rest cannot hold the prompt, and
  the gateway lists models whose output limit equals their context
  (grok-4.x, kimi-k2.7-code), which an unlimited budget would leave with no
  room at all. Measured by quick-suite run 4 (12.4c).
- **What each harness puts in front of the prompt (2026-10-03).** Read from
  the sources at the installed versions, because the question decides
  whether running models through coding-agent CLIs is tenable at all.
  *opencode 1.18.34* sends, in order: a default prompt of 8.5 KB
  (`session/prompt/default.txt` for any model that is not a GPT, Gemini,
  Claude, Kimi or Trinity: "You are opencode, an interactive CLI tool that
  helps users with software engineering tasks", with sections on tool usage,
  running lint and typecheck, and code conventions); an environment block
  naming the model, working directory, workspace root, whether it is a git
  repository, platform and date; then instruction files: `AGENTS.md`,
  `CLAUDE.md` and `CONTEXT.md` found upward from the directory, the global
  `~/.config/opencode/AGENTS.md`, the user's `~/.claude/CLAUDE.md`, and the
  `instructions` of the config (our `NO_TOOLS.md`). The default prompt is
  what told DeepSeek it was a coding agent with tools. A configured agent's
  `prompt` replaces it (`session/llm/request.ts`:
  `input.agent.prompt ? [input.agent.prompt] : SystemPrompt.provider(model)`);
  the environment block and the instruction files stay whatever the agent.
  `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` stops the `CLAUDE.md` lookups;
  nothing but the directory stops the global `AGENTS.md`, which this machine
  does not have. *Claude Code 2.1.288*: `--system-prompt` replaces the entire
  default prompt (documented: "drops all of the default prompt, including
  tool guidance and safety instructions"), `--bare` skips `CLAUDE.md`
  auto-discovery along with hooks, plugins and auto memory, `--tools ""`
  disables every built-in tool; a managed-policy `CLAUDE.md` cannot be
  excluded. *Codex 0.160.0*: `AGENTS.md` (or `AGENTS.override.md`) is read
  from the project root, found by walking up from the cwd to a `.git`
  marker, down to the cwd, and from nowhere else (`core/src/agents_md.rs`);
  `-c project_doc_max_bytes=0` returns before any lookup;
  `model_instructions_file` replaces the built-in instructions. Our Codex
  client already runs each turn in a fresh temporary directory with
  `--skip-git-repo-check` and `--ignore-user-config`, so no `AGENTS.md` is
  in reach, but the built-in Codex prompt is still sent. So all three
  harnesses can be told to drop their own prompt and their instruction
  files, each by a different switch, and the templatizer's prompt can say
  on its own what the session is. Not acted on yet: the effect is to be
  benchmarked separately from the effort levels (12.4c).
- **A getter keyed by a `uint8` is read with one `call` per literal
  (2026-10-04).** LineaRollup failed in runs 3 and 6, and spent two rounds
  of every other run, on an `array` over `isPaused(uint8)` and
  `pauseTypeExpiryTimestamps(uint8)`. V1's `ArrayHandler` takes `uint16`,
  `uint32`, `uint64` and `uint256` keys only (now the exported
  `ARRAY_INDEX_TYPES`), its message ("Cannot find a matching method for
  isPaused", or "Invalid method abi" for a full fragment) names no cause,
  and the model's next try was the same handler spelled differently. The
  committed form is eleven `call` fields `isPaused_<TYPE>` with literal
  `args`, an idiom of 20 templates (RegistryCoordinator's
  `getOperatorSetParams(uint8)` per quorum, NitroEnclaveVerifier's
  `getZkConfig(uint8)` per coprocessor, UMA's `getMember(uint256)` per
  role, BridgeHub's per-chain-id getters). Three changes, none naming a
  suite contract: the `array` reference says a `uint8` key is not
  accepted and points to `call`; the `call` reference says several fields
  may read one function with different literal `args`, named after the
  function and the key, each listing the function in its `covers`, with
  RegistryCoordinator (outside both suites) as the example, and the
  "Selection" and "Enumeration source" rules say the same in one clause
  each; R3 lets a function token appear in the `covers` of several `call`
  or `array` fields when each of them names it (`naturalCoversOf`), while
  a skip or a field that only claims it next to such a field is still a
  second verdict; and the construction finding for an `array` whose
  getter has a single argument of another type appends "array reads only
  a getter keyed by uint16, uint32, uint64, uint256, and isPaused(uint8)
  is keyed by uint8, an enum in the source: write one call field per key
  value with that value in args, or skip it", using V1's own list. The
  relaxation of R3 is the first; before it, the per-literal form was
  unwritable without leaving ten of the eleven fields' `covers` empty.
  Measured by quick-suite run 9 (12.4c).
- **The harness prompt is the templatizer's (2026-10-04).** Acting on the
  2026-10-03 finding above. One text, `TOOL_SYSTEM_PROMPT`
  (`model/toolSystemPrompt.ts`): the session is a non-interactive tool
  inside a program, one message with a single task, the reply is read as
  data, there are no tools and nobody to ask. It absorbs the no-tools
  instruction that was an instruction file. opencode: the scratch
  `opencode.json` defines an agent `templatizer` with that `prompt` and
  `mode: primary`, every turn passes `--agent templatizer`, and the client
  sets `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1`; `NO_TOOLS.md` and the
  `instructions` entry are gone. Codex: the prompt is written to
  `instructions.md` in the turn's directory and passed as
  `-c model_instructions_file`, with `-c project_doc_max_bytes=0`,
  `-c agents.enabled=false` and `-c include_environment_context=false`
  added to the isolation flags. Verified against the real binaries, not
  only the fakes: asked to repeat its instructions, DeepSeek through
  opencode returned exactly the templatizer's text followed by opencode's
  environment block (model, the scratch directory, "Is directory a git
  repo: no", platform, date) and "tools: none", at 321 input tokens for
  the diagnostic prompt; Codex refused to quote, so its session rollout
  was read instead: `session_meta.base_instructions` is the templatizer's
  text, the `<environment_context>` message is gone, the
  `<multi_agent_role>` and `<multi_agent_mode>` developer messages are
  gone with `agents.enabled=false` (`features.multi_agent=false` was
  accepted and did nothing), and what remains is a `<skills_instructions>`
  developer message cataloguing the skills installed under
  `~/.codex/skills/.system` and `~/.agents/skills` (about 4 KB), for which
  the config reference offers only per-skill `skills.config` entries by
  path; `include_skills_usage_instructions` is a per-model catalogue key
  and is rejected on the command line, `skills.max_context_tokens=1` only
  shortens the catalogue. Left as is: a list of file names the model has
  no tool to open. Codex's diagnostic turn cost 4.8k input tokens against
  7.1k before. Measured by quick-suite run 8 (12.4c).
- **Effort stays high (2026-10-04).** Adrian's call on the run 4/5
  comparison: low was indistinguishable on recall but saved only a quarter
  of the reasoning tokens (205k against 268k) and five minutes of
  twenty-eight, not the "80% cheaper, five times faster" that would make a
  lower setting worth any loss of quality on a harder contract. The
  default of `l2b discover --ai` was never changed; the benchmark goes back
  to `high` from run 7, so that later comparisons are against the setting
  the tool actually runs at, and so that stronger models, when they are
  tried, are tried at their best. Recorded in the spec ("The model").
- **The constructor is a worklist item (2026-10-03).** In runs 1 to 5 the
  model never wrote a `constructorArgs` field, although 13 of the 14 suite
  contracts have a constructor with parameters and four committed templates
  (both rocketpool, both liquity) have the field; researchers use it in 49
  of 1,268 templates. The constructor was nowhere on the worklist, so there
  was nothing to decide on, and `RocketDAOSecurityProposals` (no view with
  arguments, no events) never reached the model at all. Now
  `buildWorklist` lists the ABI's first constructor when it has parameters
  (the first, because that is the one V1's handler decodes with; a merged
  ABI can hold the proxy's and an implementation's, and `AbiIndex` drops
  the later ones as repeats), under the token `constructor(types)` without
  the mutability. The prompt renders it in its own "Constructor needing a
  verdict" subsection with the two ways to rule on it, the coverage check
  demands the verdict, the covers check lets only a `constructorArgs` field
  answer it, and a revisit subtracts it when the existing template has that
  field. A constructor without parameters is not listed: nothing to decode.
  A mechanical default (always write the field) was considered and dropped:
  it is what researchers chose in four percent of templates, so it is a
  verdict, not a rule. Measured by run 6 (12.4c).
- **Changed code: fit check, then add or start a template of its own
  (2026-10-05).** Until now a contract whose code changed had the new
  shape added to its old template unconditionally, with a note on each
  field that failed and no model call; `--ai-revisit` was the only way to
  ask the model. Nothing measured whether the old template still made
  sense: a `storage` or `hardcoded` field runs on any code, and a template
  of only descriptions and permissions fits everything. Now the old
  template fits when the contract kept its name and no field that
  computes a value fails on the new code, apart from fields the committed
  `discovered.json` already lists under `errors` (those say nothing about
  the new code and keep their note). The name is the source name of the
  bundles the shape is taken from, read from `implementationNames` with
  `matchedBundles`' rule; the entry's `name` was rejected because 1,231 of
  4,349 templated entries carry a display name there. A template that fits
  takes the revisit path under plain `--ai`: the model is asked about the
  remaining worklist, its fields are appended, then the shape is added.
  One that does not fit is left as it is, and the contract is authored as
  a new contract under `<project>/<Name>` or `<project>/<Name>-<hash>`,
  with a `review:` line under the header naming the old template and why
  it no longer fits. Contracts with different new code that share an old
  template, and a revisit of it, take turns (`inTurn`), so each fit check
  and prompt sees the previous one's additions. Because the additions change
  the template's hash, a contract the template matches unchanged would
  otherwise be discovered with the old version and show
  `TEMPLATE_CONFIG_CHANGED` on the next run: the analyzer now waits for the
  template's turns before it applies it (`settledFor`), and a contract
  analysed earlier in the run, which cannot be redone, is named in a warning
  that asks for a rerun (found by an independent review pass). Taken over
  from a second model's review (below), with the fit check added; it
  resolves the sibling-template variant 12.5 asked for in the freeze-path
  note.
- **Review by a second model (2026-10-05).** Another model reviewed the
  branch and proposed changes; Adrian decided per item. Taken: several
  fields may cover one worklist item (R3 kept only "skipped once, never
  both covered and skipped"; `checkCovers` still rejects false claims);
  proxy values without a `$` prefix (`GnosisSafe_modules`) are protected
  names; SIGINT and SIGTERM kill running model processes and then end the
  process as the default handler would, because Node emits no `exit` for
  a signal and the model runs in its own process group; the benchmark
  matches only handler and projection fields under another name or shape
  (a copied owner address no longer hides a lost getter), and counts a
  same-named by-value match as a generated field. Taken with a fix: the
  templatizer reads the baseline itself, with the template pushed when it
  extends one, because an address override may reference template fields;
  as proposed it listed every template field a second time in the
  baseline as "from the project config", so `withoutTemplateValues` drops
  the values the template computes: its handler and `copy` fields, and its
  edit-only fields too, because discovery runs their edit on the getter's
  value. Annotation-only fields keep the getter's value. Changed: by-value
  matches stay "found", as designed, but objects with the same keys are
  compared key by key, and lists of such objects row by row in any order,
  so values swapped between `admin` and `guardian` are `different` while a
  reshape (one field per key against one object, rows as tuples) is still
  credited. Rejected, each unbenchmarked and against an earlier
  decision: the whole blip README in every prompt (about 9.4 kB, and in
  conflict with the guidance's two `edit` forms); a prompt instruction to
  look for private storage and constants beyond the worklist; asking the
  model when the worklist is empty (the shortcut stays, for new templates
  and for additions). Recorded as an idea, not done: making `covers` and
  `skips` advisory instead of blocking (12.5).
- **Codex review, round one (2026-10-05).** The repository's Codex
  reviewer left eight comments on the first commit of the PR; Adrian
  asked for real bugs to be fixed and the rest pushed back. Fixed: a
  previous template that already held the contract's shape and still
  did not match (its `criteria.json` excludes the address) went down the
  extension path, where `addToShape` asserts on the duplicate hash after
  the fields were already appended; `extendIfFits` now returns that as a
  misfit and the contract gets a template of its own, with the note
  saying why. The trail directory is emptied before a loop writes into
  it, so a rerun with fewer rounds does not leave an earlier run's
  `round-3.*` beside its own (the benchmark already did this). The
  followed-addresses note counts as discovery collects relatives
  (`toAddressArray`: values, never object keys), where the templatizer's
  own walk counted keys too and could send a reviewer to `ignoreRelative`
  for a map keyed by address. The unread-declaration note is written
  whether or not the fold is empty, since a contract upgraded between two
  declarations of an event has history under both. A bare method name
  that several overloads of one arity answer to covers none of them
  (0.65% of committed contracts have such overloads among their views);
  the model is told to write the full fragment. Also, after a CodeQL
  alert on the same PR, benchmark table cells escape backslashes before
  pipes. Pushed back: `--ai` under `--dry-run` is ignored like every
  other flag of that mode (dry run writes nothing by definition), and
  the undercount of generated fields it named was already fixed in
  `a57f0d26f8`; a probed getter claimed by a non-reading field (an event
  fold) stays in `ignoreMethods`, because the claimed field is the full
  view of the state the probe shows five entries of, the dry run runs it
  and notes an empty fold above the field, and keeping both would
  duplicate every event-enumerated set, where the `covered` skip that
  keeps its probe has no field and no dry run at all.
- **Codex review, round two (2026-10-05).** Two comments on `337c76ff75`,
  both taken. A template a referrer's field suggests was applied without
  `settledFor`, so it could be loaded while another contract of the same
  depth was still adding to it, and its application was not recorded for
  the rerun warning; the `byReferrer` branch now waits and records like the
  shape match. The OpenCode client's resample of a first turn with
  tool-call markup dropped the refused sample: its events never reached the
  trail, which is the evidence that no tool ran, and its tokens and time
  were not counted. The refused sample now stays part of the turn (or of
  the error, when the resample is refused too). The resample itself stays
  inside the round, as designed and as run 3 (12.4c) measured it: it is the
  client asking for a usable answer, not the loop asking for a repair.
- **Codex review, round three (2026-10-05).** Two comments on `e21fd3d699`,
  both taken. A contract whose source is a `manualSourcePaths` link passed
  `canTemplatize`: `SourceCodeService` counts the link as verified and
  hashes the link string in place of the code, so V1 matches templates on
  that hash, but the explorer's `ContractSource` stays unverified with no
  files. The model would have been shown no code, and
  `TemplateService.addToShape`, which hashes the explorer's source, threw
  `Could not find hash` after `template.jsonc` was written, leaving an
  orphan template (eleven project configs have such links). `canTemplatize`
  now also requires every bundle V1 matches on to carry verified explorer
  source, the condition under which V1's own shape tools (the `AddShape`
  command, the discovery UI) can record a shape; such contracts stay
  untemplatized like unverified ones. And `checkNames` let an `array` field
  take a probe's name on the name alone, so an array over `foo(uint32)`
  beside the probed `foo(uint256)` would have replaced the probe (rule 1);
  the check now resolves the function as `ArrayHandler` does (a full
  fragment as written, a bare name by prefix over the ABI) and requires
  `name(uint256)`, naming what the field reads instead when it refuses.

### 12.3 Tests

`pnpm test`, `pnpm typecheck` and `pnpm lint` in `packages/discovery` are
clean (1,275 tests as of 2026-10-05, about 220 of them the templatizer's;
the validator deletion removed about 60). Every remaining check has passing
and failing cases on the real fixtures, including a full ScrollChain draft
that passes with zero findings. The loop is tested with `FakeModelClient`
(accepted first turn, repaired, dry-run repair, exhausted,
refused-then-retried, unparsable). The orchestrator is tested end to end
against a temp `TemplateService`, a real `HandlerExecutor` and a mocked
provider: a new template, a new template without a model call when the
worklist is empty, code changed (a fitting template gets the model's
additions and the shape, or only the shape when it decides every item; a
field that newly fails, or a new name, gives the contract a template of
its own and leaves the old one byte for byte; a field that already failed
keeps the template and its one note; a template that holds the shape but
excludes the contract by criteria is left alone; contracts sharing a
template take turns, a revisit of it waits for them and is skipped when they
kept it, a contract that matches it as it is, or that a referrer suggests it
for, waits for the additions, and one that
applied it earlier is named in a warning), and `--ai-revisit` (fields
appended after the existing ones with a
provenance line, failing fields noted and shown to the model, nothing
written when nothing is added, only notes when the template decides every
item, project `types` honoured in the dry run, an override that references
a template field resolved without the template's fields entering the
baseline). The signal handling is tested with a real child process. The additive
writer is tested on committed templates and its invariant (removing the
insertions gives the old text back) held over all 1,267 committed templates
in a one-off run on 2026-10-02.

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

### 12.4c Quick suite runs (2026-10-02)

`templatizer-benchmark --suite quick --ai-model opencode-go/deepseek-v4.1-flash`
(high effort unless the row says otherwise, 3 rounds), 14 contracts, the
two headline numbers of the spec: reachable handler fields found and
regressions. Run 10 is the same suite on the Codex default model.

| Run | Code | Reachable found | Regressions | Handler fields found (old number) | Authored / matched / failed | Rounds 1/2/3 | Tokens in (cached) / out | Wall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | after step 1 (rules A and B; old validator and advisory round still in) | 42/120 (35.0%) | 1 | 42/123 | 11 / 1 / 2 | 3/1/8 | 1.40M (0.89M) / 31k | 36 min |
| 2 | steps 2–4 (checks reduced, README sections, DSML refusal, `covered` skips keep probes) | 37/82 (45.1%) | 0 | 37/103 | 11 / 0 / 3 | 5/4/4 | 0.66M (0.43M) / 15k | 48 min |
| 3 | final (run 2 + opencode pinned to one scratch directory per run, no-tools reminder in repair messages) | 47/82 (57.3%) | 0 | 47/103 | 13 / 0 / 1 | 10/1/2 | 0.83M (0.38M) / 16k | 41 min |
| 4 | run 3 + output token budget 128k (`OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX`), 2026-10-03 | 48/82 (58.5%) | 0 | 48/103 | 14 / 0 / 0 | 12/1/0 | 0.78M (0.21M) / 15k | 28 min |
| 5 | run 4 at `--ai-effort low`, 2026-10-03 | 47/82 (57.3%) | 0 | 47/103 | 14 / 0 / 0 | 12/0/1 | 0.87M (0.29M) / 16k | 23 min |
| 6 | run 5 + the constructor on the worklist (low effort), 2026-10-03 | 51/82 (62.2%) | 0 | 51/103 | 13 / 0 / 1 | 12/1/1 | 0.99M (0.40M) / 18k | 26 min |
| 7 | run 6's code at high effort (the baseline for runs 8 and 9), 2026-10-04 | 48/82 (58.5%) | 0 | 48/103 | 13 / 0 / 1 | 13/0/1 | 0.89M (0.29M) / 19k | 35 min |
| 8 | run 7 + the templatizer's own system prompt in place of the harness's (high), 2026-10-04 | 54/82 (65.9%) | 0 | 54/103 | 14 / 0 / 0 | 11/2/1 | 0.95M (0.39M) / 21k | 31 min |
| 9 | run 8 + the `uint8` guidance, the R3 plurality and the construction hint (high), 2026-10-04 | 50/82 (61.0%) | 0 | 50/103 | 14 / 0 / 0 | 13/1/0 | 0.80M (0.24M) / 16k | 32 min |
| 10 | run 9's code on the Codex default model (`gpt-6.1-sol`, high), 2026-10-04 | 58/82 (70.7%) | 0 | 58/103 | 14 / 0 / 0 | 13/1/0 | 0.95M (0.11M) / 29k | 15 min |
| 11 | run 9's code on `gpt-5.6-luna` (high), 2026-10-04 | 51/82 (62.2%) | 0 | 51/103 | 13 / 0 / 1 | 9/4/1 | 1.66M (0.49M) / 137k | 30 min |
| 12 | run 9's code on `gpt-5.6-terra` (high), 2026-10-04 | 53/82 (64.6%) | 0 | 53/103 | 14 / 0 / 0 | 12/2/0 | 1.09M (0.24M) / 52k | 13 min |
| 13 | run 9's code on `gpt-6-luna` (high), 2026-10-04 | 49/82 (59.8%) | 0 | 49/103 | 13 / 0 / 1 | 9/2/3 | 2.04M (0.78M) / 81k | 22 min |

Runs 11–13 compare Codex models to choose the default; the spec's "Model
comparison" section has the table and the decision (keep the Codex default,
`gpt-6.1-sol`). Both Lunas failed `fluent/FluentRollup` on a single stray
closing brace in a one-line reply and did not fix it when told the position
(5.6 omitted a `}`, 6 added one and resent the same bytes twice); Terra made
the same slip and fixed it in round 2. After these runs `parseModelJson`
was changed to also try the first object that closes (braces inside strings
ignored), so a stray trailing `}` parses, and to say "there are N more `{`
than `}`" when no object closes, instead of only JSON.parse's character
position; checked on the three real Fluent replies, Terra's and GPT-6
Luna's parse and GPT-5.6 Luna's gets the count. Runs 11–13 predate the
change. The other three Codex models in the list (`gpt-6-terra`,
`gpt-6.1-luna`, `gpt-6.1-terra`) are refused for a ChatGPT account.

The denominator fell from 120 to 82 between runs 1 and 2 for reasons
outside the model: metis (22 reachable fields, matched instead of authored)
left the suite for interfold/SlashingManager (3), and the "reads another
contract" rule, finished after run 1 had started, moved rocketpool's 18
RocketStorage reads and uniswap's `votingTokenSymbol` out of the reachable
set. On the 82-field basis run 1 found about 42 of 79 (interfold was not
in it), run 2 37 of 82.

Run 2, what changed and what the misses were:

- No regression (run 1 had `aggchainSigners`), and no DSML text reached the
  checks: all 13 refused turns were caught as refusals. But refusing did
  not cure it. Seven contracts had at least one refused turn, and three
  (`interfold/SlashingManager`, `liquityv2/TroveManager`, `acrossv3/HubPool`)
  had every round refused and failed, against two DSML failures in run 1.
  `TroveManager` alone cost six reachable fields that run 1 had found. Run
  1's trails show the same tendency (16 responses with markup across 9
  contracts) hidden as "not JSON" findings; the model's behaviour did not
  change, the accounting did.
- The refused turns all read the same way: "I'll explore the repository",
  then `grep`/`ls`/`find` commands against this worktree's absolute path.
  The prompt holds no path. Asked directly, the model quoted its system
  prompt: "Working directory: …/packages/discovery", "Is directory a git
  repo: yes", and the repository's `AGENTS.md`. opencode takes its
  directory from `$PWD`, which the client passed through unchanged, not
  from the spawn cwd. Fixed before run 3 (12.2 "opencode pinned to its
  scratch directory").
- `SlashingManager` round 1 was "no text" after 228 s with a truncated
  prompt; rounds 2 and 3 were markup.
- The other misses are run 1's: Linea's eleven `isPaused_<TYPE>` literal
  calls and `verifiers` (6 of 32), zora's six `initBondGame*`, Lighter's
  four storage slots and two market folds, `constructorArgs` on
  RocketDAOSecurityProposals (empty worklist, never asked) and
  BorrowerOperations, AgglayerGateway's three folds, ScrollChain's
  `revertedBatches` (noted, 0 of 59). New in run 2: mantle's
  `TimelockController` authored (1/1, failed in run 1), Lighter 4/10 (3/10).
- Wall time 48 min against 36: the refused turns are slow (a refused HubPool
  turn took 212 s, a refused `TroveManager` turn 124 s) and there were 13 of
  them.

Run 3, the final code, what changed:

- Refused turns 3 against 13 (`LineaRollup`, `HubPool`, `AgglayerGateway`,
  each once, each in round 1 where the client resamples), ten contracts
  accepted in one round against five, and the three contracts run 2 lost
  to markup were authored: `SlashingManager` 2/3, `TroveManager` 6/7,
  `HubPool` 2/4. Telling the model it sits in an empty directory is what
  the two runs differ in, besides the repair-message reminder.
- The one failure is `LineaRollup`, the largest prompt (317 KB, 81k input
  tokens): round 1 no text after 178 s, round 2 an unterminated JSON
  string, round 3 a draft whose `array` over `pauseTypeExpiryTimestamps(uint8)`
  V1 cannot construct (`array` reads a `uint256`-indexed getter). Run 2
  authored it in three rounds for 3/15; the fifteen Linea misses here are
  that failure, not fifteen new mistakes.
- Still missed as in runs 1 and 2: zora's `initBondGame*` and `game8Args`
  (folded by game type), Lighter's four storage slots and two market folds,
  `constructorArgs` on all four rocketpool and liquity contracts (the model
  never writes it; RocketDAOSecurityProposals is never even asked), one
  AgglayerGateway fold (the other two came back by value this time), one
  SlashingManager fold (`bannedNodes`), HubPool's `pooledTokens` and a
  `poolRebalanceRoutes` grouped by chain id where the committed template
  groups by chain name. `ScrollChain` is 3/3 (`revertedBatches` found under
  the old declaration, the note did its job), mantle 1/1, uniswap 5/5,
  fluent 2/2.
- Tokens 0.83M input against 0.66M because fourteen contracts reached the
  model's full answer instead of eleven, and reasoning tokens 289k against
  155k; wall 41 min.

Run 4, the output token budget raised, nothing else changed:

- No refused turn, no unparsable reply, no failure: every one of the 14
  contracts was authored, 12 in one round. Wall 28 min against 41, because
  the refused turns were the slow ones (a turn that reasons to the cap
  takes about three minutes and produces nothing).
- `LineaRollup` authored in two rounds, 4/15: its round 1 thought for
  29,608 tokens, under the old cap this time, so the gain is the cap not
  cutting the turns that go over, not longer thinking. No turn of the run
  used more than 29,608 reasoning and output tokens; 128k is headroom.
- 48 against 47 reachable is within run-to-run noise, and the noise is now
  visible: same code and effort as run 3 for 13 contracts, yet
  `ScrollChain` went 3/3 to 2/3 (`revertedBatches` lost again) and
  `AgglayerGateway` 3/4 to 1/4 (`routes` and `aggchainVKeys` folded
  differently), while Linea gained four. A difference of two or three
  fields between runs of the quick suite is not a signal.
- Still missed as in run 3: zora's `initBondGame*` and `game8Args`,
  Lighter's slots and market folds, `constructorArgs` everywhere (never
  written; the constructor is not on the worklist, see 12.2), Linea's
  eleven `isPaused_<TYPE>` literal calls, HubPool's `pooledTokens` and
  `poolRebalanceRoutes`, SlashingManager's `bannedNodes`.

Run 5, the same code at `low` effort (the lowest this model offers; its
levels are low, high, max, and opencode records the variant it sent):

- 47/82 against 48/82, the same thirteen contracts at the same counts
  except LineaRollup (3/15 against 4/15, in three rounds against two). No
  regression, no refused turn, no failure. The two runs are
  indistinguishable on recall; the differences are the noise seen between
  runs 3 and 4.
- Reasoning tokens 205k against 268k and wall 23 min against 28. Low effort
  does not mean little thinking for this model: Rollup's one turn used
  31,557 reasoning and output tokens at low, 19,106 at high, and the
  per-contract numbers go both ways; the sum is a quarter lower.
- Conclusion at the time: run the benchmark at `low`, since nothing in the
  misses is a thinking failure (they are judgment calls and a missing
  item) and a cheaper run is a run that gets made; high stays the default
  of `l2b discover --ai`. Reversed on 2026-10-04 (12.2 "Effort stays
  high"): run 6 is the only run at low, and runs 7 onwards are at high.

Run 6, the constructor on the worklist, at low effort:

- 51/82 against 47/82, no regression. The four `constructorArgs` fields
  the committed templates have were all written (`BorrowerOperations`
  9/9, `TroveManager` 7/7, `RocketDAONodeTrustedUpgrade` 5/5,
  `RocketDAOSecurityProposals` 1/1, the last asked for the first time),
  each as `{ "type": "constructorArgs", "nameArgs": true }` covering the
  constructor; the other nine constructors (seven proxies among them) were
  skipped as `covered`. The model's verdicts match the researchers' on
  all thirteen: the item was missing, not the judgment.
- `LineaRollup` failed again (run 5 had authored it, 3/15): rounds 1 and 2
  the `array` over the `uint8`-keyed `isPaused` and
  `pauseTypeExpiryTimestamps`, which V1 cannot construct, as in every
  Linea run; round 3 a new event field whose extraction key `pauseType`
  the event does not have (`unPauseType`), caught by the dry run. The
  committed template answers the same state with eleven literal
  `call`s, `isPaused_<TYPE>`; the model never writes that form. Without
  this failure the run would be at about 55/82. Candidate for the next
  iteration, as prompt guidance: an `array` needs a `uint256` key, and
  a getter keyed by a small enum is read with one `call` per literal.
- The rest moved within the noise seen before: `ScrollChain` 3/3 again,
  `HubPool` 3/4 (2/4), `AgglayerGateway` 2/4 (1/4). Wall 26 min.

Run 7, run 6's code at high effort, the baseline the next two steps are
measured against (12.2 "Effort stays high"):

- 48/82, no regression. The constructor gain holds at high: the same four
  `constructorArgs` fields, the same nine `covered` skips, so the +4 of
  run 6 is the item and not the effort. The three contracts that moved
  between runs 6 and 7 moved by one field each and are the three that
  always move: `HubPool` 2/4 (3/4), `ScrollChain` 2/3 (3/3),
  `AgglayerGateway` 1/4 (2/4). So 48 against 51 is noise, and the two
  runs together put the code at 48–51.
- `LineaRollup` failed a third time, the same way for two rounds: round 1
  `array` over `isPaused` and `pauseTypeExpiryTimestamps` by bare name
  ("Cannot find a matching method"), round 2 the same two by full fragment
  ("Invalid method abi"). Round 3 is new and instructive: unprompted, the
  model wrote the per-literal form itself, thirteen `call` fields
  `pauseTypeExpiryTimestamp<Type>` with `args` 1 to 13, and folded the
  pause events into a `pausedTypes` membership field, which is a draft a
  reviewer would take; it then lost the contract to an unrelated slip
  carried from round 1, an `event` field grouped by `pauseType` over
  events whose parameter is `unPauseType`, caught by the dry run with no
  round left. The uint8 guidance of 12.2 is aimed at rounds 1 and 2; with
  them spent on the right form, the slip would have had a round to be
  repaired in.
- 13 contracts in one round, the most yet. Reasoning tokens 305k against
  run 6's 239k and wall 35 min against 26, Linea's three rounds included.

Run 8, the harness prompt replaced by the templatizer's (12.2 "The harness
prompt is the templatizer's"), nothing else changed:

- 54/82 against 48/82, no regression, every contract authored for the
  first time since run 4. Of the six fields gained, four are
  `LineaRollup` authored (4/15) instead of failed, and one each are
  `HubPool` 3/4 and `AgglayerGateway` 2/4, the two that move between any
  two runs. So the measured effect of the prompt is "Linea did not fail",
  and that deserves a closer look: rounds 1 and 2 were the same
  `array`-over-`uint8` pair as in every other run, and round 3 dropped
  the two fields and folded the pause events into a `pausedTypes`
  membership field (empty at the block, noted) rather than repairing
  them; the `unpauseTypeRoles` fold was grouped by `unPauseType`, the
  event's own parameter, from round 1, where run 7 had written
  `pauseType` and died on it in round 3. One contract that failed in
  three runs of four and passed in this one is not proof of the prompt;
  it is consistent with a model that, told it is a tool, spends its
  repair rounds on the findings and not on the setting.
- What the prompt visibly changed is the shape of the repair rounds:
  Linea's round 2 took 16 s and 444 reasoning tokens (run 7: 100 s,
  13,472) and round 3 32 s and 3,061 (run 7: 90 s, 11,543); across the
  run, reasoning fell to 257k from 305k and wall to 31 min from 35 with
  one more contract authored, and the cache served 0.39M of 0.95M input
  tokens against 0.29M of 0.89M, the system prompt being shorter and the
  same for every turn.
- One unparsable reply, the first since the output budget was raised:
  `BorrowerOperations` round 1 broke a `reason` string with a raw line
  break ("Bad control character in string literal"), and round 2 wrote
  the same draft correctly, 9/9. A model slip, not a budget cut; the
  parser could tolerate a raw newline inside a string, which is left as a
  candidate.
- The rest is unchanged to the field: `Lighter` 4/10, `DisputeGameFactory`
  7/13, `ScrollChain` 2/3, `SlashingManager` 2/3, the four
  `constructorArgs` contracts complete.

Run 9, the `uint8` guidance (12.2 "A getter keyed by a `uint8` is read
with one `call` per literal") on top of run 8:

- 50/82 against 54/82, no regression, 14 authored, 13 of them in one
  round and none in three, the cleanest run so far (0.80M input tokens,
  the fewest since run 2, no unparsable reply). The four fields lost are
  one each on the four contracts that move between runs, and each is a
  judgment that flipped, not a mistake: `HubPool` 2/4 (`pooledTokens`
  folded differently), `AgglayerGateway` 1/4 (`aggchainVKeys` not
  written), `BorrowerOperations` 8/9 (the constructor skipped as
  `covered`, with the eight address fields it feeds all present; run 8
  had written `constructorArgs` with the reason that no getter exposes
  the registry; both are defensible), `LineaRollup` 3/15 (4/15). So on
  recall the change is within the noise, and the three-run picture of
  the current prompt is 50–54.
- What the change did do is visible in Linea's trail. Accepted in one
  round of 175 s, where every earlier run spent rounds 1 and 2 on the
  `array` over the two `uint8` getters and failed or dropped them in
  round 3. `pauseTypeExpiryTimestamps(uint8)` is read as eleven `call`
  fields `pauseTypeExpiryTimestamp<Type>` with `args` 1, 2, 3, 6 to 13
  (the enum's eleven live values; 4 and 5 are deprecated in the source,
  and the committed template leaves them out too), each covering the
  getter, which R3 now allows. `isPaused(uint8)` the model chose to
  answer with a `pausedTypes` fold of the four pause events instead
  (empty at the block and noted, the researchers' eleven `isPaused_<TYPE>`
  calls read true/false directly); the guidance offers both and the
  model took the fold, so the eleven committed `isPaused_*` fields stay
  v1-only and Linea stays at 3 or 4 of 15. The benchmark credits values,
  and the eleven expiry calls have no committed counterpart to be
  credited against; a reviewer would keep them.
- The construction hint never fired: no draft of the run put an `array`
  over a `uint8` getter. The prompt text did the work before the check
  had to.

Run 10, the final code on the Codex default model, high effort, to learn
the ceiling of the prompt with a stronger model (the templatizer's default
configuration, which no quick-suite run had measured before):

- 58/82 against DeepSeek's 50–54 on the same code, no regression, 14
  authored, 13 in one round, in 15 minutes against 31–35: the model
  answers in 10 to 130 s a turn and reported 10k reasoning tokens for the
  whole run against DeepSeek's 257k–305k. Codex serves little from cache
  (0.11M of 0.95M input tokens) and charged nothing visible; the run went
  through the ChatGPT login without a rate limit.
- The gain is concentrated where DeepSeek never got: `Lighter` 8/10
  (4/10 in every DeepSeek run), with all five `storage` fields found at
  the slots the committed template reads (`verifier` 4, `desertVerifier`
  5, `governance` 6, `additionalZkLighter` 7, `stateRootUpgradeVerifier`
  495, read off the source's layout), and `HubPool` 4/4 (`pooledTokens`
  under another name, `poolRebalanceRoutes` credited by value). The two
  Lighter misses are the two market folds, the same as always.
- Where the two models agree, the agreement is informative. Linea 3/15:
  Codex also wrote the thirteen per-literal `pauseTypeExpiryTimestamps`
  calls (all thirteen, deprecated 4 and 5 included, where DeepSeek
  left those two out) and also answered `isPaused(uint8)` with a
  `pausedTypes` fold of the pause events rather than the committed eleven
  `isPaused_<TYPE>` calls; it added a `hardcoded` `SIX_MONTHS_IN_SECONDS`.
  Two models choosing the fold over the calls says the guidance's
  "event-only state, membership fold" idiom outweighs "read the getter
  per literal" for a getter that the events also announce; whether the
  researchers' calls or the fold is the better template is a question
  for the review of the next Linea diff, not for the prompt. Zora's
  `DisputeGameFactory` 7/13, `ScrollChain` 2/3, `SlashingManager` 2/3 and
  `AgglayerGateway` 2/4 are the same with both models, so those misses
  are the prompt's or the committed template's, not the model's.
- One repair round in the run: `Lighter` (the contract is named `Proxy`)
  had one finding in round 1 (fields.updatedMarkets: dry run at block 26076160 failed: Assertion Error: Invalid extraction key [params.marketIndex], not defined; f…)
  and passed in round 2.

Run 1, what the misses were:

- Both authoring failures (acrossv3 `HubPool`, mantle `TimelockController`)
  and two of the three rounds of zora's `DisputeGameFactory` were DeepSeek
  writing tool-call markup into its text, which the old code sent back as a
  "not JSON" finding that the model repeated. Fixed before run 2 (12.2).
- The one regression: `aggchainSigners` of `AgglayerGateway`, a probed
  getter the model skipped as `covered` and the derivation put into
  `ignoreMethods`. Fixed before run 2 (12.2).
- `metis/Lib_AddressManager` matched `opstack/AddressManager` (same shape),
  so the templatizer never ran: replaced in the suite by
  `interfold/SlashingManager`. `rocketpool/RocketDAOSecurityProposals` has
  an empty worklist (every committed field reads RocketStorage through
  `address`, now attributed unreachable), so the model is never asked; its
  `constructorArgs` field is the one reachable miss there.
- The rest are the model's: Linea's eleven `isPaused_<TYPE>` literal-key
  calls (0/11) and `verifiers` (6 of 32 indices), zora's six `initBondGame*`
  calls (the model folded `InitBondUpdated` by game type instead; the game
  implementations it did fold were credited by value), Lighter's four
  storage-slot fields and two market folds, `constructorArgs` on both
  liquity contracts and `securitySettings`/`oracleSet`/`councilVeto` on
  RocketDAONodeTrustedUpgrade (plain calls the model did not write),
  AgglayerGateway's three event folds (folded by selector where the
  committed template lists rows), ScrollChain's `revertedBatches` (0 of 59:
  the model read the new `RevertBatch` declaration, the logs are under the
  old one; a note since step 2).

### 12.4d Zora `--ai-revisit` acceptance run (2026-10-02)

`discover zora --dev --ai-revisit --ai-model opencode-go/deepseek-v4.1-flash`
on the final code, 16 templates. Appended to five: `GnosisSafe`
(`fallbackHandler`, `guard`: `storage` reads of the two fixed Safe slots),
`opstack/OptimismMintableERC20Factory` (`deployments`: `event` fold, the
template had no `fields` before, so a `fields` object was added after
`description`), `opstack/OptimismPortal2` (`ethMigrations`,
`portalMigrations`: `event` folds), `opstack/SuperchainConfigFake_expiry`
(`pausedIdentifiers`: `event` add/remove), `opstack/SystemConfig`
(`isFeatureEnabled`: `event` add/remove with `where`). Nothing to add for
five (`opstack/L1ERC721Bridge`, `global/ProxyAdmin`,
`opstack/L1StandardBridge`, `opstack/L1CrossDomainMessenger`,
`opstack/DelayedWETH`). Authored one new template,
`zora/CompatibilityFallbackHandler`, empty (no probed getters, no fields).
Stopped with `TemplatizationFailedError` on `opstack/AddressManager` after
three rounds, so `discovered.json` was not written: round 1 was a real
draft (`event` fold grouped by `name`) that V1 rejected because
`AddressSet.name` is an `indexed string`, rounds 2 and 3 were DeepSeek
answering the repair message with shell commands (tool-call markup, refused).
Five of the run's turns were refused for that markup in total.

Rule A held: `git diff -U0` on `_templates` shows no removed line other
than the `description` line of `OptimismMintableERC20Factory`, which gained
a trailing comma. Every `ignoreMethods` is byte-identical. The diff is left
in the working tree for review.

Two changes followed at once: the provenance line of a template authored
during a revisit run now says `--ai-revisit` (it said `--ai`), and the
repair message repeats that the model has no tools (12.2 "No-tools reminder
in the repair message"). Run 2 then showed why the model wanted tools at
all (12.2 "opencode pinned to its scratch directory"); run 3 measures all
three.

### 12.5 Open issues for the reviewer

- **Empty folds are accepted; check every `// empty at block …` note.** A
  fold over the wrong events looks exactly like a quiet one (Plume
  `batchPosters`, 12.2). The numbers in 12.4 predate this revision. Rerun
  the benchmark before comparing them with later runs.
- **Only structure and failure block; everything else is a `// review:`
  note.** Since 2026-10-02 (12.2 "Checks reduced") there is no advisory
  round: the unread event declaration, the followed-addresses count and the
  resolved fragment are notes above the field. A fold over a list of
  instances without `ignoreRelative` makes discovery follow every address
  it holds; read every `// review:` line, and expect a `maxAddresses`
  warning if one was kept.
- **`--ai-revisit` appends to shared templates from one contract's code,
  and since 2026-10-05 so does plain `--ai` for a contract whose new code
  still fits its template.** The addition is insertion-only (12.2
  "Additive only"), but a field that is right for this contract is applied
  to every contract the template matches. Run it on one project at a time
  and review the template diffs. A template is revisited once per process,
  so a rerun asks about the same templates again and may append more; only
  `review:` notes are deduplicated, fields are not.
- **The fit check is deliberately coarse.** It reads only what V1 reports:
  the name, and whether fields run. A field that runs but now means
  something else (a `storage` slot whose layout moved) passes it. The diff
  of the next `discovered.json` is where that shows. Its outcome can depend
  on the order of a depth: a field another contract added this run never
  ran on the old code, so if it fails on the new code the contract gets a
  template of its own; and a never-templatized contract with the same new
  code, handled first, decides the template for both.
- **Writes continue briefly after a stop.** A turn queued on a template runs
  after an earlier one failed; one that needs no model call still adds its
  shape. And `addShape` runs after the additions, so a failure inside it
  leaves the fields appended without the shape. Both leave valid,
  insertion-only diffs; neither was worth more machinery.
- **Signal handling defers to other listeners.** The SIGINT/SIGTERM handler
  re-raises the signal only when it is the only listener. A library with
  the same rule (`signal-exit`) would make both wait for the other and the
  process would survive Ctrl-C; nothing on the discover path loads one
  today.
- **Idea from the second review, not done: `covers` and `skips` as
  advisory.** They would become review metadata, with the schema, name
  protection and the dry run as the only blocks. Against it: the coverage
  check is the "nothing was forgotten" check, and missed verdicts were a
  real model mistake (12.2 "Checks reduced"). Worth one benchmark run and
  a revisit case before deciding.

- **Resolved 2026-10-02: an existing template is only ever appended to**
  (see 12.2 "Additive only"); the risk below is the one that materialised
  on zora. Kept for the record.
- **The freeze path edits a shared template.** A template serves every shape
  in its `shapes.json`; removing a broken field or adding one changes the
  output of contracts with the older shapes too. The spec asked for it
  (same id, locked fields verbatim); the diff shows it, but a safer variant
  would write a sibling template for the new shape instead. Done for a
  template that no longer fits on 2026-10-05 (12.2 "Changed code").
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
- **Done on 2026-10-04 (runs 7 to 10):** the harness prompt replaced in
  both clients (12.2 "The harness prompt is the templatizer's"), the
  `uint8` guidance with the R3 plurality and the construction hint (12.2
  "A getter keyed by a `uint8`…"), and one run on the Codex default
  model. Not done, for Adrian's decision: a run with no `--variant` at
  all (the provider's default effort), which `chooseModel` rejects on
  purpose and would need a plumbing change.
- **Next iteration candidates (2026-10-04, after runs 7 to 10), each
  small and measurable in one quick-suite run.** (a) Tolerate a raw line
  break inside a JSON string in `parseModelJson` (run 8's one unparsable
  reply; the repair round fixed it, at the cost of a round). (b) When the
  dry run fails an event field with "Invalid extraction key [x], not
  defined", append the parameter names of the events the field reads,
  from the ABI (run 7's Linea failure, a `groupBy` of `pauseType` over
  events whose parameter is `unPauseType`; the fix was one word and
  there was no round left). (c) The fold-versus-calls choice for a
  getter whose state events also announce (Linea's `isPaused`): both
  models take the fold; decide in review whether the committed calls or
  the fold is wanted before touching the guidance. (d) Codex's skills
  catalogue in the developer message (12.2): per-skill `skills.config`
  entries by path would remove it, at the cost of reading the skill
  directories; the model has no tool to open them, so it is noise, not
  risk. (e) The two Lighter market folds, zora's six `initBondGame*` and
  AgglayerGateway's `routes`/`aggchainVKeysUpdated` miss with both
  models: those are the misses left for a prompt change, and each needs
  its own look at the committed template first.
- **Benchmark noise.** Runs 3, 4 and 5 share the prompt and differ by one
  field in total but by up to two per contract (`ScrollChain`,
  `AgglayerGateway`, `LineaRollup`); runs 7, 8 and 9 widen the band to
  four contracts (`HubPool`, `AgglayerGateway`, `BorrowerOperations`,
  `LineaRollup`) and 48–54 for one prompt. Treat a difference under five
  fields on the quick suite as noise unless it lands where the change
  predicted it; the constructor change (+4 exactly on the four
  `constructorArgs` templates) and the Codex run (+4 on Lighter's five
  storage slots) are the kind that is not.
