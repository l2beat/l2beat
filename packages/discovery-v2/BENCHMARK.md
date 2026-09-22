# Benchmark: Discovery V2 against committed V1 output

Two things are measured here, always at V1's own block so chain activity
cannot move the numbers: how much of a project's committed `discovered.json`
the V2 extractor reproduces, and how that changes when one thing about the
setup changes (the model, the prompt strategy, the evidence in the prompt).
`BENCHMARK.html` draws the same data; open it with

```sh
xdg-open packages/discovery-v2/BENCHMARK.html   # or any browser
```

and regenerate it from the committed inputs with

```sh
cd packages/discovery-v2
pnpm start report benchmarks/floor benchmarks/gpt-5.6 benchmarks/gpt-5.6-facts \
  benchmarks/deepseek-flash benchmarks/deepseek-flash-facts benchmarks/deepseek-flash-review \
  benchmarks/deepseek-flash-review-facts "gpt-5.6 repeat x3=benchmarks/gpt-5.6-repeat" \
  --out BENCHMARK.html --markdown runs/comparison.md
```

## How a field is judged

Each V1 field is first attributed to its origin from the project's effective
config: `proxy` (`$…` values), `getter` (a 0-argument view with no handler),
`handler` (a researcher-written handler, with its type) or
`template-projection` (`pickRoleMembers`, `copy`, a formatted `call`: a V1
display convenience, not extraction, left to consumers by design). Then one
verdict:

- **equal**: same name, same value (addresses normalised to lowercase
  `0x…` whatever the chain prefix; a bytes32 that pads an address equals the
  address).
- **equal, other name** (`equal-renamed`): same whole value under another
  name, as `sequencers` → `isSequencer`.
- **same values, other shape** (`equal-by-value`): every value V1 held is in
  V2 under another structure or key: the same name with another nesting
  (`legacyVerifiersLength` as a list vs a map), or, for a V1 field with no
  namesake, every *distinctive* leaf (address, hash, long number or string)
  found among the V2 fields no V1 field claimed (`game0`…`game8` against
  one `gameImpls` map). Short leaves (`0`, `false`, small counts) never
  credit a nameless match. A researcher chose V1's shape by hand and the
  benchmark measures extraction, so this counts as found.
- **different**: same name, values differ.
- **missed**: V1 has the value, V2 has nothing holding it.

"Found" is the first three over V1's extracted fields (display-only fields
excluded from the denominator). Because 93% of V1's values are plain getters
that every setup reproduces, the number that separates setups is **handler
fields found**: the V1 fields a researcher wrote a handler for that V2 has
the values of, in any shape. That is the first chart on the page.

## Experiments (2026-09-22)

Same three projects and contracts in every run (`benchmarks/suite.json`:
scroll all 48 verified Ethereum contracts, base 25 with `--addresses`,
plumenetwork 6 with `--addresses`; selection rationale under Run 1 below).
Each run has its own plan store under `plans/experiments/<label>/`, so no
run inherits another's decisions. Axes:

- **Model**: `gpt-5.6-sol` through Codex at its default reasoning effort
  (`plumenetwork` in Run 1 at `medium`), or `deepseek-v4.1-flash` through
  opencode, both with tools disabled and the event stream checked for tool
  parts.
- **Strategy**: *one shot* (prompt, validate, dry-run, up to two repair
  rounds); *review* (after acceptance, the executed results go back with
  three questions: skip reasons, unused privileged events, empty folds;
  the revision passes the same checks, the first plan stays if it never
  does); *facts* (the prompt carries, per state variable, the externally
  callable writers, their modifiers and the events they emit, derived from
  the compiler AST by Datalog rules; see README "Facts").
- **Floor**: an empty plan and no model, so the bars show what proxy
  detection and 0-argument getters alone reproduce.

| Project | Run | Setup | Contracts (failed) | V1 fields found | Handler fields found | Handler missed | Different | Model calls | Tokens in / out | Wall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| base | floor | no plan (floor) | 25 | 369/405 (91.1%) | 1/32 (3.1%) | 31 | 0 | 0 | 0k / 0k | 2 s |
| plumenetwork | floor | no plan (floor) | 6 | 96/109 (88.1%) | 0/11 (0.0%) | 11 | 0 | 0 | 0k / 0k | 1 s |
| scroll | floor | no plan (floor) | 48 | 311/323 (96.3%) | 0/12 (0.0%) | 12 | 0 | 0 | 0k / 0k | 4 s |
| base | gpt-5.6 | gpt-5.6-sol, one shot | 25 | 390/405 (96.3%) | 21/32 (65.6%) | 11 | 0 | 24 | 1126k / 18k | 877 s |
| plumenetwork | gpt-5.6 | gpt-5.6-sol (medium), one shot | 6 | 99/109 (90.8%) | 1/11 (9.1%) | 10 | 0 | 6 | 311k / 6k | 271 s |
| scroll | gpt-5.6 | gpt-5.6-sol, one shot | 48 | 320/323 (99.1%) | 9/12 (75.0%) | 2 | 1 | 33 | 1072k / 16k | 722 s |
| base | gpt-5.6-facts | gpt-5.6-sol, facts | 25 | 389/405 (96.0%) | 21/32 (65.6%) | 11 | 0 | 22 | 1350k / 18k | 963 s |
| plumenetwork | gpt-5.6-facts | gpt-5.6-sol, facts | 6 | 99/109 (90.8%) | 3/11 (27.3%) | 8 | 0 | 6 | 528k / 9k | 280 s |
| scroll | gpt-5.6-facts | gpt-5.6-sol, facts | 48 | 321/323 (99.4%) | 10/12 (83.3%) | 1 | 1 | 22 | 1247k / 21k | 675 s |
| base | deepseek-flash | opencode/deepseek-v4.1-flash, one shot | 25 | 390/405 (96.3%) | 21/32 (65.6%) | 11 | 0 | 6 | 80k / 2k | 414 s |
| plumenetwork | deepseek-flash | opencode/deepseek-v4.1-flash, one shot | 6 | 99/109 (90.8%) | 1/11 (9.1%) | 10 | 0 | 1 | 0k / 1k | 80 s |
| scroll | deepseek-flash | opencode/deepseek-v4.1-flash, one shot | 48 | 321/323 (99.4%) | 10/12 (83.3%) | 1 | 1 | 6 | 142k / 3k | 449 s |
| base | deepseek-flash-facts | opencode/deepseek-v4.1-flash, facts | 25 | 389/405 (96.0%) | 21/32 (65.6%) | 11 | 0 | 22 | 866k / 7k | 1476 s |
| plumenetwork | deepseek-flash-facts | opencode/deepseek-v4.1-flash, facts | 6 | 101/109 (92.7%) | 3/11 (27.3%) | 8 | 0 | 6 | 158k / 3k | 672 s |
| scroll | deepseek-flash-facts | opencode/deepseek-v4.1-flash, facts | 48 | 318/323 (98.5%) | 7/12 (58.3%) | 4 | 1 | 21 | 657k / 7k | 667 s |
| base | deepseek-flash-review | opencode/deepseek-v4.1-flash, review | 25 | 389/405 (96.0%) | 21/32 (65.6%) | 11 | 0 | 21 | 768k / 15k | 1883 s |
| plumenetwork | deepseek-flash-review | opencode/deepseek-v4.1-flash, review | 6 | 99/109 (90.8%) | 3/11 (27.3%) | 8 | 0 | 6 | 239k / 7k | 772 s |
| scroll | deepseek-flash-review | opencode/deepseek-v4.1-flash, review | 48 | 321/323 (99.4%) | 10/12 (83.3%) | 1 | 1 | 22 | 638k / 15k | 3123 s |
| base | deepseek-flash-review-facts | opencode/deepseek-v4.1-flash, review + facts | 25 | 386/405 (95.3%) | 17/32 (53.1%) | 15 | 0 | 21 | 855k / 13k | 1637 s |
| plumenetwork | deepseek-flash-review-facts | opencode/deepseek-v4.1-flash, review + facts | 6 | 99/109 (90.8%) | 1/11 (9.1%) | 10 | 0 | 6 | 256k / 6k | 579 s |
| scroll | deepseek-flash-review-facts | opencode/deepseek-v4.1-flash, review + facts | 48 | 321/323 (99.4%) | 10/12 (83.3%) | 1 | 1 | 22 | 621k / 18k | 1792 s |
| scroll | gpt-5.6 repeat x3 | model, one shot | 3 | 30/32 (93.8%) | 5/7 (71.4%) | 2 | 0 | 0 | 215k / 10k | 1 s |

`deepseek-flash` tokens and wall time are those of the re-authoring pass
only (see "Refused turns" below); the first pass cost 792k+5k tokens and
1520 s for scroll, 1108k+5k and 797 s for base, 371k+3k and 536 s for
plumenetwork. `gpt-5.6-review` and `gpt-5.6-review-facts` ran out of Codex
credits after 14 and 1 authored contracts and are not in the page; their
labels rerun as soon as the quota resets, reusing the plans already stored.

### What the runs show

- **The floor is high and flat.** 88–96% of V1's extracted fields are
  plain getters and proxy values, and every setup reproduces every one of
  them. Model, prompt and evidence change only the handler fields, so the
  whole-field number barely moves (96–99%) and the handler number is the
  one to read.
- **DeepSeek V4.1 Flash matches GPT-5.6 one shot for one twentieth of the
  tokens.** Handler fields found are the same or better on all three
  projects (scroll 10/12 against GPT's 9/12, base 21/32, plumenetwork 1/11), at 3–7k output tokens per project against 16–18k and with a plan
  accepted after one round in most cases. Its weakness is behavioural, not
  analytical: 13 of 79 first-pass turns were refused for emitting tool calls
  when no tool was offered (see below).
- **Facts help where events are the answer.** With the writer/event facts,
  both models take the two `Bridge` event-only histories on plumenetwork
  that neither found one shot (`inboxHistory`, `outboxHistory`, now
  `allowedDelayedInboxes`/`allowedOutboxes`): plumenetwork goes from 1/11 to
  3/11 for both. GPT with facts also takes `verifierVersions` on scroll
  (9/12 → 10/12). Facts cost 10–25% more input tokens. DeepSeek with facts
  lost three MultipleVersionRollupVerifier fields on scroll that it had one
  shot (7/12): the facts list `latestVerifier` and `legacyVerifiers` as
  written only by owner functions with no event, and the model skipped them
  as `unbounded` instead of enumerating the array with `untilRevert`; a
  prompt rule about arrays with a length getter would fix it.
- **Review helps DeepSeek exactly as much as facts do on plumenetwork
  (3/11) and nothing on scroll or base**, at 2–4× the wall time of one
  shot because every contract gets a second full turn. Review plus facts
  was worse than either alone on base (17/32: the revision dropped four
  `NitroEnclaveVerifier` values it had) and plumenetwork (1/11). Two
  passes give the model two chances to be wrong; the validator only
  catches structural errors, not a skip that should have been a step.
- **The stable misses are the same in every setup**, which is what makes
  them actionable: on base, the six `RiscZeroVerifierRouter.verifier_*`
  literal-selector fields (V1 hard-codes six selectors; V2 needs a
  `VerifierAdded`-event fold that no model chose), `zkVerifierRoutes`
  (same), `permissionedGamesTotal` (an `eventCount`, which `count@1` can
  do), `initBondGame42` (its value is a short number, so the by-value rule
  cannot credit it inside `initBonds`) and the two custom OP Stack handlers
  (`opStackDA`, `sequencerInbox`, no V2 data source by design). On
  plumenetwork, the Orbit templates' custom TypeScript handlers
  (`arbitrumActors`, `arbitrumDACKeyset`, `arbitrumSequencerVersion`,
  `orbitPostsBlobs`), two `eventCount`s, and `challenges`. On scroll,
  `revertedBatches` in every setup, and `ScrollOwner.accessControl`
  (Scroll's custom role table, `different` in every setup).
- **Consistency**: GPT's three repeated authorings of three scroll contracts
  gave identical plan steps in 8 of 9 plans (Run 1). Across the four
  DeepSeek setups the handler verdicts are identical on base for three of
  them, which is the same stability seen through another lens.

### Refused turns

DeepSeek's first one-shot pass had 13 of 79 turns refused: the model emitted
tool calls (`bash`, `grep`, `read`) although the opencode configuration
offered no tool, and the client refuses any turn whose event stream shows a
tool part. One turn hung for the full 15 minutes. The fix was a "you have no
tools" instruction in the scratch configuration, one retry with a fresh
session on a refused first turn, and an 8-minute timeout; the three later
DeepSeek suites had 2, 2 and 2 refusals, and the re-authoring pass over the
one-shot label had none. GPT never emitted a tool call.

### Cost

| Setup | Model calls | Input tokens | Output tokens | Wall |
| --- | --- | --- | --- | --- |
| gpt-5.6 one shot (Run 1) | 63 | 2.5M | 40k | 31 min |
| gpt-5.6 facts | 50 | 3.1M | 48k | 32 min |
| deepseek-flash one shot (first pass) | ~63 | 2.3M | 13k | 48 min |
| deepseek-flash facts | 49 | 1.7M | 17k | 47 min |
| deepseek-flash review | 49 | 1.6M | 37k | 96 min |
| deepseek-flash review + facts | 49 | 1.7M | 37k | 67 min |

Contracts with an empty worklist need no model call and are not counted.
DeepSeek's provider reports about 0.25 USD per million input tokens; a
whole-suite DeepSeek run costs well under a dollar, a GPT run about a
tenth of a 5-hour Codex window.

### Still to run

- `gpt-5.6-review` and `gpt-5.6-review-facts` over the full suite (quota).
- A second `--repeat` consistency run per model, now that the by-value
  verdict exists, to put a number on shape variance rather than decision
  variance.
- More projects in `benchmarks/suite.json`, in particular one with few or no
  templates, where V1's field set is not a strong prior.

## Run 1 in detail: GPT-5.6 one shot

The first full run, before the by-value verdict, the floor, the facts and the
review pass existed. Numbers below are as recorded then; the summary table
above re-judges the same entries under the current rules.

### Purpose

This benchmark measures how much of a V1 `discovered.json` entry the
single-address extractor reproduces, contract by contract, when the
per-contract plan is authored by a model instead of by a researcher. For every
verified `Contract` entry of a project on Ethereum, the pipeline (`prepare`,
`baseline`, `worklist`, `author` where the plan store has nothing for the
shape, `execute`, `output`) runs at V1's block and the resulting entry is
compared with V1's, field by field. Each V1 field is first attributed to its
origin from the project's effective config (template merged with the address
override, read through V1's `ConfigReader` and `TemplateService`): `proxy`
(`$…` values and the proxy detectors' other names), `getter` (no field
config), `handler` (a configured handler, reported with its type) or
`template-projection` (`pickRoleMembers`, `copy`, or a `call` whose `edit`
only formats a getter). The four attributions are never summed into one
number, because a missed getter is a bug in the deterministic tools, a missed
handler field is the model missing an enumeration, and a missed projection is
a V1 presentation artefact V2 leaves to consumers by design.

"Equal" means: same field name on both sides and deep-equal values after one
normalisation applied to both, in which chain-prefixed and bare addresses
become lowercase `0x…` (V1 templates re-prefix some getters for display,
`edit: ["format", "ScrollAddress"]`, and V2 always prefixes with the chain it
read from). "Equal-renamed" is a V1 handler or projection field whose value V2
produced under another name (`sequencers` → `isSequencer`), matched by value
only when the value is a non-empty array, object or string. "Different" is the
same name with another value. "V1-only" carries its attribution; "v2-only" is
split into `ignored-by-v1` (the name is in the contract's effective
`ignoreMethods`) and `new`. The block is fixed to each project's
`usedBlockNumbers.ethereum`, so V1 and V2 read the same state and the numbers
measure the extractor, not chain activity. `proxyType`, `sourceHashes`,
`sinceBlock` and `implementationNames` are compared as entry facts.

### Setup

- Model: `gpt-5.6-sol`, the Codex CLI default (codex-cli 0.155.1, ChatGPT
  login), default reasoning effort for `scroll` and `base`; `--reasoning
  medium` for `plumenetwork` (a scope change during the run, to bound quota
  use; see below). Prompt: `src/author/prompt/buildAuthoringPrompt.ts` as
  committed, unchanged between projects and not tuned after seeing results.
  Repair rounds: default 2.
- Date: 2026-09-22, 05:44–06:35 UTC.
- Blocks: `scroll` at Ethereum 25789575, `base` at 25630023, `plumenetwork`
  at 25832885 (each project's `usedBlockNumbers.ethereum`).
- Plan store before the first contract ran: the three re-authored Scroll
  plans only (`0x3a4b7f80…` L1MessageQueueV2, `0x86f2f8f0…` TimelockController,
  `0xbae3ab76…` ScrollChain). Every other plan under `plans/` was authored
  during these runs and is listed at the end.
- Contract selection: `scroll` all 48 verified Ethereum contracts
  (`--author`); then `--repeat 2` on the three Scroll contracts whose templates
  carry `event`/`array` handlers (ScrollChain, MultipleVersionRollupVerifier,
  L1GatewayRouter); `base` 25 contracts chosen with `--addresses` because the
  first 25 in `discovered.json` order would have missed SystemConfig,
  Escrow, NitroEnclaveVerifier, RiscZeroVerifierRouter, AnchorStateRegistry,
  SuperchainConfig, SP1VerifierGateway and AggregateVerifier (all 13 templated
  contracts with handlers plus the first 12 others by address);
  `plumenetwork` 6 contracts with `--addresses` (Bridge, RollupProxy,
  SequencerInbox, UpgradeExecutor, which carry the Orbit templates'
  `event`/`eventCount`/`accessControl`/custom handlers, plus Outbox and Inbox
  for getter coverage). The original plan was `--limit 25` on the Orbit
  project; it was cut to 6 contracts and `--reasoning medium`, without
  `--repeat`, when about 65% of the 5-hour Codex window had been used by the
  Scroll and Base runs.
- Commands (from `packages/discovery-v2`):

  ```sh
  pnpm start benchmark scroll --author --out runs/benchmark/scroll
  pnpm start benchmark scroll --author --repeat 2 --out runs/benchmark/scroll-repeat \
    --addresses 0xa13BAF47339d63B743e7Da8741db5456DAc1E556,0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F,0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6
  pnpm start benchmark base --author --out runs/benchmark/base --addresses <25 addresses, see runs/benchmark/base/benchmark.json>
  pnpm start benchmark plumenetwork --author --reasoning medium --out runs/benchmark/plumenetwork --addresses <6 addresses>
  ```

  The per-run `benchmark.json`/`benchmark.md` and every contract's pipeline
  files (prompt, response, plan, values, entry) are under
  `runs/benchmark/<project>/` (gitignored).

### Summary

| Project | Contracts (failed) | V1 fields | V2 fields | equal | equal-renamed | different | v1-only proxy | v1-only getter | v1-only handler | v1-only template-projection | v2-only ignored-by-v1 | v2-only new |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| scroll | 48 (0) | 347 | 360 | 315 | 3 | 3 | 0 | 0 | 2 | 24 | 15 | 24 |
| base | 25 (0) | 421 | 394 | 371 | 0 | 1 | 0 | 4 | 29 | 16 | 6 | 16 |
| plumenetwork | 6 (0) | 111 | 105 | 98 | 0 | 1 | 0 | 0 | 10 | 2 | 0 | 6 |

The `scroll` row is the full project run; the `--repeat 2` run over three
Scroll contracts (all store hits, so the same entries) is reported under
Consistency and Cost only.

### Against the floor

`--no-plan` runs the same contracts with an empty plan and no model, so the
difference between a floor row and a model row is what the model's decisions
bought. Same addresses and blocks as above; floor runs cost no tokens.

| Project | Run | V1 fields | equal (+renamed) | coverage | V1 handler fields | handler fields equal (+renamed) | handler coverage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| scroll | floor | 347 | 311 | 89.6% | 12 | 0 | 0% |
| scroll | gpt-5.6-sol | 347 | 315 (+3) | 91.6% | 12 | 4 (+3) | 58% |
| base | floor | 421 | 368 | 87.4% | 32 | 0 | 0% |
| base | gpt-5.6-sol | 421 | 371 | 88.1% | 32 | 2 | 6% |
| plumenetwork | floor | 111 | 95 | 85.6% | 11 | 0 | 0% |
| plumenetwork | gpt-5.6-sol (medium) | 111 | 98 | 88.3% | 11 | 1 | 9% |

Reading it: the floor is already high because 93% of V1's fields are plain
getters, and V2 gets every one of them. The model moves only the handler
fields, and there the picture differs per project: on Scroll it reproduces
7 of 12; on Base 2 of 32, because 20 of the 32 are literal-key `call`
fields that V2 returns as one map (same information, other shape, not
credited) and most of the rest are bespoke handlers; on plumenetwork 1 of
11, the rest being Orbit's custom TypeScript handlers. So the whole-field
coverage number barely moves between floor and model, and the handler
coverage number is the one to watch when a model, a reasoning level or a
recipe changes. `BENCHMARK.html` draws both; `benchmarks/*.json` are the
inputs.

Reading the table: on Scroll 315 of 347 V1 fields are equal by name and value
and 3 more by value under another name; the 2 missed handler fields are
`revertedBatches` and `verifierVersions`, the 24 missed projections are the
role pickers and formatted delays of five timelocks and the four `copy` fields
of ScrollOwner. On Base 371 of 421 are equal; 29 handler fields are missed,
of which 20 are `call` handlers with literal arguments whose values V2 did
fetch but under a different shape (a `gameImpls` map instead of six `game<N>`
fields), which the by-value rename match does not credit because the shapes
differ. No proxy value and no plain getter was missed on any project; the 4
`v1-only getter` fields on Base are V1's 5-index array probe (`proposals`,
`claimData`, `getChallengerDuration`), which V2 does not run by design. On
plumenetwork 98 of 111 are equal; the 10 missed handler fields are the Orbit
templates' custom handlers (`arbitrumActors`, `arbitrumDACKeyset`,
`arbitrumSequencerVersion`, `orbitPostsBlobs`, two `eventCount`s) and three
`event` folds; one of them, `batchPosters`, V2 answered *wrongly* rather than
not at all (see below).

### Consistency (`--repeat 2`)

Three plans per contract: the one the pipeline stored plus two more
authorings with the store bypassed, compared by `decisionHash` (steps and
skips without the free-text `reason`, in canonical order).

| Contract | plans | distinct decision hashes | what differed |
| --- | --- | --- | --- |
| ScrollChain | 3 | 1 | nothing: same two `set@1` steps, same four skips (`unbounded` ×3, `computation`), and no `RevertBatch` step in any of the three |
| L1GatewayRouter | 3 | 2 | the `latest@1` step is identical in all three; `getL2ERC20Address(address)` was skipped as `computation` once and `not-state` twice |
| MultipleVersionRollupVerifier | 3 | 3 | the event step was `list@1` twice and `set@1` once; `legacyVerifiers(uint256,uint256)` was `unbounded` twice and `computation` once; the two `map@1` steps were identical |

Steps agree across the nine plans wherever the shape is settled (membership
sets, per-key latest, mappings over a step's keys); the variation is in
borderline skip reasons and in `list@1` against `set@1` for an
append-only version list. The repeats cost 215,236 input + 9,915 output tokens.

### V1 handler fields V2 missed or got different

Every `handler` and `template-projection` field whose verdict is not `equal`,
with the cause and where the fix belongs. Projections are grouped because
they share one cause.

#### Scroll

| Field | Verdict | Cause | Fix belongs |
| --- | --- | --- | --- |
| ScrollChain `revertedBatches` (event) | v1-only | The model added no `RevertBatch` step in any of three authorings although rule 6 now invites it; `RevertBatch` is also overloaded on this ABI (two signatures), so a step would have needed full signatures. | worklist: events emitted only by privileged functions and matching no getter should be worklist items that need a verdict, so leaving them out is a validator error, not a judgement call |
| MultipleVersionRollupVerifier `verifierVersions` (event) | v1-only | V2 folded `UpdateVerifier` with `list@1` (duplicates kept: `[0,1,2,3,4,6,7,7,7,7,8,9,10,10,10]`) under the name `updateVerifier`; V1's `event` handler with `add` only deduplicates by `select`, giving `[0,1,2,3,4,6,7,8,9,10]`. The value differs, so the rename match does not fire. | library: `list@1` claims to replace "event (add only)" but V1's add-only fold is unique-by-select; either `list@1` needs a `unique` argument or its `replaces` claim must go and the docs must steer to `set@1` |
| MultipleVersionRollupVerifier `latestVerifier`, `legacyVerifiersLength` (array) | different | Same elements, other shape: V1 `array` handler yields a list in index order, V2 `map@1` keyed by version yields `{ "0": …, "1": … }`, with the duplicated keys from the list above collapsed. | library/prompt: `array@1` exists for exactly this and takes `callEach` pairs; the prompt should say that keys that are array indices call for `array@1`, or `map@1` should be refused when the keys come from an index-like list |
| ScrollOwner `accessControl` (scrollAccessControl) | different | V1's custom handler produces `{ roles, targets }` from Scroll's non-OpenZeppelin access control (roles named by string hashes, per-target callable selectors); V2 ran `accessControl@1` and, with no `*_ROLE()` getters to name roles, produced a table keyed by raw hashes without targets. | library: a `scrollAccessControl@1` recipe (or `roleNames` from a literal map the model may copy from the source) |
| ScrollOwner `opsFast`, `opsNoDelay`, `scNoDelay`, `scMinorityNoDelay` (copy) | v1-only | Projections of `accessControl` by role name. | by design (consumer-side) |
| L1GatewayRouter `gateways` (event) | equal-renamed → `ERC20Gateway` | Same value; V2 names after the getter. | by design (naming axis) |
| ScrollChain `sequencers`, `provers` (event) | equal-renamed → `isSequencer`, `isProver` | Same value; V2 names after the getter. | by design (naming axis) |
| Timelocks ×5: `Proposer`, `Canceller`, `Executor`, `timelockAdminAC` (pickRoleMembers), `getMinDelayFormatted` (edit on call) | v1-only | Role pickers over `accessControl` and a formatted copy of `getMinDelay`; V2's `accessControl` is equal on all five. | by design (consumer-side) |

#### Base

| Field | Verdict | Cause | Fix belongs |
| --- | --- | --- | --- |
| DisputeGameFactory `game0/1/8/42/621/1337`, `initBondGame0/1/8/42/621`, `game8Args`, `permissionedGameArgs` (call ×13) | v1-only | V1 reads `gameImpls(N)`, `initBonds(N)`, `gameArgs(N)` for hand-picked game types; V2 folded `ImplementationSet`, `InitBondUpdated` and `ImplementationArgsSet` with `latest@1` into `gameImpls`, `initBonds`, `gameArgs` maps keyed by game type, whose entries equal V1's values (`game8` = `gameImpls["8"]`, `initBondGame0` = `initBonds["0"]`). The benchmark compares whole fields, so one map against thirteen scalars is a miss on paper. | benchmark (a per-key match for `call` handlers with literal args against V2 maps) and by design (V2 does not name one field per literal key) |
| DisputeGameFactory `permissionedGamesTotal` (eventCount) | v1-only | No `count@1` step for `DisputeGameCreated` with `gameType == 1`; the model skipped `games(...)`/`gameAtIndex` as user-activity, which rule 6 also says about per-game creation events. | prompt/by design: counting user-created games is user activity under the current rules; V1 wanted it anyway |
| SystemConfig `batcherHash` (call) | different | V1's `call` handler re-declares `batcherHash()` as `returns (address)` to turn the bytes32 into an address; V2's baseline reads the ABI's bytes32. Same 20 bytes. | library: a `format.address@1` recipe (bytes32 → address), or a prompt rule inviting a `call` step with a re-typed fragment for padded addresses |
| SystemConfig `opStackDA`, `sequencerInbox` (opStackDA, opStackSequencerInbox) | v1-only | Custom handlers that inspect batcher transactions and blobs; no recipe and no data source in V2. | by design (out of scope) |
| NitroEnclaveVerifier `zkConfigRiscZero`, `zkConfigSuccinct`, `verifierProofIdRiscZero`, `verifierProofIdSuccinct` (call ×4) | v1-only | V2 fetched `zkConfig(0..2)` and `getVerifierProofId(0..2)` as `map@1`; entries equal V1's per-processor fields under enum keys. Whole-field comparison again. | benchmark (per-key match) and by design (naming) |
| NitroEnclaveVerifier `zkVerifierRoutes` (event) | v1-only | The model skipped `getZkVerifier(uint8,bytes4)` as `unbounded` rather than folding `ZkVerifierRouteSet`-style events; no event-only step was added. | prompt: routes set by the owner are event-enumerable; the `unbounded` definition should exclude keys that an event carries |
| RiscZeroVerifierRouter `verifier_242f9d5b` … `verifier_f536085a` (call ×6) | v1-only | V1 reads `verifiers(bytes4)` for six literal selectors; V2 skipped `verifiers(bytes4)` and both `getVerifier` overloads as `unbounded` even though `VerifierAdded` events carry the selector. | prompt: same as above; the model applied `unbounded` where events enumerate the keys |
| SP1VerifierGateway `activeVerifiers`, `allVerifiers` (event) | v1-only | V2 produced `routes` (`latest@1` per selector with `frozen`) and `routeAdded` (`list@1` of selectors) whose content is the same information (`0x4388a21c` frozen, `0x5a093a2f` active) in another shape than V1's two filtered lists. | by design (shape axis: V1's `where` filter + `select` of two fields has no one-to-one recipe; `latest@1` per key is the closest) |
| TimelockController `Proposer`, `Canceller`, `Executor`, `defaultAdminAC`, `getMinDelayFormatted`; DisputeGameFactory `challengerFromDGF`, `proposerFromDGF`, `wethFromDGF`, `game8Vm`; OptimismPortal2 and AnchorStateRegistry `RespectedGameString`; Fault/PermissionedDisputeGame `absolutePrestateDecoded`; SuperchainConfig `pauseExpiryFmt`; AggregateVerifier `fastFinalizationDelayFmt`, `slowFinalizationDelayFmt` (16 projections) | v1-only | `pickRoleMembers`, `copy` and `edit`-only `call`s deriving from fields V2 has. | by design (consumer-side) |

#### plumenetwork

| Field | Verdict | Cause | Fix belongs |
| --- | --- | --- | --- |
| SequencerInbox `batchPosters` (arbitrumActors) | v1-only, and V2's `isBatchPoster` is `[]` | V1 decodes `OwnerFunctionCalled(1)` transactions to list the five batch posters. V2 folded `BatchPosterSet` with `set@1` and covered `isBatchPoster(address)` with it, but this SequencerInbox never emitted that event: the dry run warned "no logs found for events BatchPosterSet" and the plan was accepted anyway (a zero-log set can be the truth). The result is an empty set where the chain has five members: a silent wrong answer, the worst outcome in this benchmark. Same for `isSequencer` (`SequencerSet`, also never emitted). | validator/author: a zero-log warning on a step that `covers` a getter should trigger a check, e.g. a `callEach` probe of the getter with one address from the source or the deployer, or a repair round asking for another source; and library: an `ownerFunctionCalled`-style recipe would be needed for Orbit's setter events |
| SequencerInbox `setIsBatchPosterCount`, `keySetUpdates` (eventCount) | v1-only | Counts of `OwnerFunctionCalled(1)` and `SetValidKeyset`; V2 has the keyset list (`setValidKeyset`, 1 entry, matching `keySetUpdates` = 1) but no `count@1` step, and cannot see the batch-poster changes at all. | prompt (a `count@1` for a `list@1` is redundant; V1 wanted the number) and library as above |
| SequencerInbox `dacKeyset` (arbitrumDACKeyset), `sequencerVersion` (arbitrumSequencerVersion), `postsBlobs` (orbitPostsBlobs) | v1-only | Custom handlers that decode keyset bytes and inspect batch transactions; no recipe and no data source in V2. V2's `dasKeySetInfo` carries the keyset hash, validity and creation block instead. | by design (out of scope) |
| Bridge `inboxHistory`, `outboxHistory` (event) | v1-only | V1 lists every inbox/outbox ever enabled (`add` only); V2 folded the same `InboxToggle`/`OutboxToggle` events into the *current* sets `allowedDelayedInboxList`/`allowedOutboxList` (equal to V1's getters) and added no history step, although rule 6 names "a history" as the case for `list@1`. | prompt/worklist (same as `revertedBatches`: event-only history is invited, not required) |
| RollupProxy `challenges` (event) | v1-only | `RollupChallengeStarted` fold; empty on both sides in substance (V1 `[]`), V2 has no step. | prompt/worklist as above |
| RollupProxy `isPostBoLD` (hardcoded) | v1-only | A template constant. | by design |
| RollupProxy `arbOsFromWmRoot` (edit on call), UpgradeExecutor `executors` (pickRoleMembers) | v1-only | Projections; `accessControl` is equal on UpgradeExecutor. | by design (consumer-side) |
| SequencerInbox `maxTimeVariation` (getter, edited) | different | Not a handler: V1's template `edit: ["shape", …]` turns the 4-tuple into a named object; V2 returns the tuple as the ABI gives it (`[7200, 48, 86400, 3600]`, same numbers). | by design (consumer-side edit) |

### `v2-only new` fields of interest

Fields V2 produced that V1 neither has nor lists in `ignoreMethods`.

- Every Gnosis Safe (Scroll ×5, Base ×1): `modules` (the enabled-module set
  from `EnabledModule`/`DisabledModule`, equal to V1's proxy-detector field
  `GnosisSafe_modules`, so redundant), `fallbackHandler` and `guard` (read from
  the Safe's storage slots; V1 does not track them). `getOwners` and
  `getThreshold` are `ignored-by-v1` (V1 has `$members`/`$threshold`).
- Scroll gateways ×4 (`L1ERC721Gateway`, `L1ERC1155Gateway`,
  `L1CustomERC20Gateway`, `pufETHEscrow`, `DaiEscrow`): `tokenMapping`, the
  owner-set L1→L2 token map folded from `UpdateTokenMapping` with `latest@1`.
  Empty at this block for the custom gateways, so cheap but not yet informative.
- Scroll `PauseController`: `lastUnpauseTime` (components seen in
  `Unpause`/`ResetPauseCooldownPeriod`) and `getLastUnpauseTime` over them;
  both empty at this block.
- Scroll `MultipleVersionRollupVerifier`: `updateVerifier`, the version list
  discussed above (V1's `verifierVersions` with duplicates).
- Scroll `wstETHescrowLido`: `accessControl` (Lido's bridge uses
  AccessControl; V1 tracks no roles here).
- Base `DisputeGameFactory`: `gameImpls`, `initBonds`, `gameArgs` maps over all
  game types ever set (0, 1, 8, 621), a superset of V1's hand-picked keys.
- Base `SystemConfig`: `isFeatureEnabled` (feature flags from `FeatureSet`).
- Base `SuperchainConfig`: `pauseTimestamps`, `expiration` (per-identifier
  pause state from `Paused`/`Unpaused`, which V1 formats only as
  `pauseExpiryFmt`).
- Base `AnchorStateRegistry`: `disputeGameBlacklist` (games blacklisted by the
  guardian, from `DisputeGameBlacklisted`).
- Base `SP1VerifierGateway`: `routes`, `routeAdded` (see above).
- Base `TEEProverRegistry`: `isValidProposer`, `signerImageHash`
  (owner-registered proposers and image hashes).
- Base `NitroEnclaveVerifier`: `zkConfig`, `getVerifierProofId` (see above).

- plumenetwork `Outbox`: `roots`, every `SendRootUpdated` output root by
  hash (713 entries at this block): the model called per-root state privileged
  because only the rollup posts it. Correct under the rules as written, and
  the kind of unbounded per-batch list rule 4 meant to exclude; the
  `unbounded` definition should name "one entry per posted root or batch"
  explicitly.
- plumenetwork `SequencerInbox`: `setValidKeyset` and `dasKeySetInfo` (the
  one valid DAS keyset with its creation block, the information behind V1's
  `dacKeyset` minus the decoded members), plus the empty and wrong
  `isBatchPoster`/`isSequencer` discussed above.
- plumenetwork `Inbox`: `isAllowed` (the allow-list from `AllowListAddressSet`,
  empty because the allow list is disabled).

None of the `new` fields is user activity; the model's `user-activity`/`
unbounded` skips held on every balance, message and per-game getter in all
three projects.

### Entry facts

`proxyType`, `sinceBlock` and `implementationNames` were equal on every
compared contract. `sourceHashes` differed on 9 contracts, all with V1
`manualSourcePaths` (the eight Scroll `PlonkVerifier*` contracts whose source
is a Yul or binary artefact fetched from a URL, and Base's EIP-2935
`HistoryStorage`): V2's `prepare` does not read `manualSourcePaths`, marks the
contract unverified and writes no `sourceHashes`. These nine ran through the
model anyway (one `verify(bytes,bytes)`-style worklist item each) and their
plans were not stored because `prepared.json` has no shape hash for unverified
code. Fix belongs in `prepare` (honour `manualSourcePaths`) or in the
benchmark's selection (skip contracts V1 itself sourced manually).

### Cost

| Run | contracts | model calls (store hits) | rounds | input tokens (cached) | output (reasoning) | wall s | model s | failures |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| scroll | 48 | 33 (15) | 32×1, 1×2 | 1,072,386 (174,976) | 16,042 (10,634) | 722 | 648 | 0 threw, 0 authoring failed |
| base | 25 | 24 (1) | 24×1 | 1,125,656 (161,280) | 18,065 (12,779) | 877 | 823 | 0 threw, 0 authoring failed |
| plumenetwork (reasoning medium) | 6 | 6 (0) | 6×1 | 310,716 (40,320) | 6,024 (3,779) | 271 | 255 | 0 threw, 0 authoring failed |
| scroll `--repeat 2` | 3 | 6 (3) | 6×1 | 215,236 (32,256) | 9,915 (7,908) | 1 | 391 | 0 threw, 0 authoring failed |
| total | 82 | 69 | 68×1, 1×2 | 2,723,994 (408,832) | 50,046 (35,100) | 1,870 | 2,117 | none |

Model seconds exceed wall seconds on the repeat run because repeats are
counted as model time while the pipeline itself was a store hit. No Codex
rate-limit or API error occurred in any run; nothing was skipped for that
reason. The Orbit project was cut from `--limit 25` to 6 contracts and
`--reasoning medium` by a scope decision to protect the Codex quota, not
because of an error.

Observations:

- No pipeline threw and no authoring failed on any project; every accepted
  plan passed the static validator and a dry run at the target block.
- One repair round in total (Scroll Multisig 1: the model named the
  `ChangedFallbackHandler` argument `fallbackHandler` instead of `handler`; the
  validator's finding fixed it in round 2). All other plans were accepted on
  the first turn.
- 16 of the model calls (14 on Scroll, 2 on Base) were for contracts whose
  worklist had no items and whose plan is therefore `steps: [], skips: []`
  (Scroll's verifier contracts, `ProxyAdmin`, `HistoryStorage`). At roughly
  18,000 input tokens each they cost about 290,000 tokens for nothing a
  deterministic rule could not have written. The pipeline should short-circuit
  an empty worklist without events, or with events only from proxies.
- Input tokens are dominated by the flattened source: Scroll averaged 32,000
  input tokens per model call, Base 47,000 (the dispute game contracts run to
  80,000). Prompt caching covered about 15% of input.
- Wall time is almost all model time (Scroll 648 of 722 s, Base 823 of 877 s);
  the RPC side replays V1's SQLite cache.

### What this shows and does not show

Shows: the deterministic 93% holds up. Across three projects every proxy value
and every plain 0-arg getter V1 has, V2 has with the same value, and the
entry facts match except where V1 used manual source paths. On the 7% that
needs the model, the model gets the *shape* right where the library has an
exact counterpart (membership sets, latest-per-key, role tables, mappings
over enumerable keys): every `set@1` and `accessControl@1` step in these runs
equals V1's value. Where V1 chose a shape the library does not have (a list
that deduplicates, a filtered projection of two event arguments, one field per
literal key, a bytes32 re-typed as an address, Scroll's custom access control)
the values are the same information in another form, and the whole-field
comparison counts them as misses. Consistency is high on decisions that the
rules pin (identical steps in 8 of 9 repeated plans) and low on borderline
skip reasons, which the decision hash counts.

Does not show: whether the `new` fields are worth having (nobody has
reviewed them); how the model behaves on projects without templates (all
three projects here are heavily templated, so V1's field set is a strong
baseline); anything about traversal, since the benchmark takes V1's address
list as given; anything about cost at scale beyond three projects and about
2.7 million input tokens; and, for `plumenetwork`, anything at default
reasoning effort, since that run used `medium` and only 6 contracts. Two
genuine misses remain unexplained by shape: `revertedBatches` (the model
never took the event-only invitation) and `zkVerifierRoutes`/the RISC Zero
router selectors (the model called event-enumerable keys `unbounded`); both
point at the prompt and worklist, not the library. And one answer is wrong
rather than missing: `isBatchPoster = []` on plumenetwork's SequencerInbox,
accepted because an empty event fold is only a warning; the benchmark caught
it only because V1 had the handler, which is exactly the coverage this
benchmark cannot claim for projects without templates.

### Changes made after these runs, not yet re-benchmarked

Two fixes followed directly from the findings above and landed after the
numbers in this file were produced, so a re-run will differ in two ways:

- A `logs` step that matched no logs and `covers` a getter is now an error,
  not a warning, forcing a repair round. The plumenetwork `isBatchPoster`
  and `isSequencer` wrong answers would have gone back to the model instead
  of being accepted.
- A contract with an empty worklist no longer calls the model; its empty
  plan is stored as `source: trivial`. That removes 16 of the 69 model calls
  and roughly 290k of the 2.7M input tokens.

### Plans authored during these runs

Every accepted model plan is stored under `plans/<shapeHash>.json` with
`decisionHash` in its provenance and stays reusable: a later run over the
same shape costs no tokens.

57 plans, all `source: model`, `gpt-5.6-sol`, one round each except
`GnosisSafe` (two). By contract name (`steps/skips`, first 10 hex of the shape
hash):

- Scroll: ScrollChain 2/4 `0xbae3ab76`, TimelockController 1/8 `0x86f2f8f0`,
  L1MessageQueueV2 0/5 `0x3a4b7f80`, MultipleVersionRollupVerifier 3/2
  `0x68ef4e9f`, ScrollOwner 1/4 `0x83b59f05`, L1GatewayRouter 1/2
  `0xf3c6e738`, GnosisSafe 3/6 `0x22c7fb83`, L1ScrollMessenger 0/4
  `0x6bec1db1`, EnforcedTxGateway 0/1 `0xe46a3fa8`, L1ERC721Gateway 1/0
  `0x15e06267`, L1ERC1155Gateway 1/1 `0x466121c4`, L1CustomERC20Gateway 1/0
  `0x66c27813`, `0x9a784d13`, `0xa4062ee0` (three shapes), L1LidoGateway 1/1
  `0xac665573`, L1ETHGateway 0/0 `0xcec82756`, L1WETHGateway 0/1
  `0x97068890`, L1StandardERC20Gateway 0/1 `0x225810cb`, L1USDCGateway 0/1
  `0x2e9da556`, `0xcb1c41c6`, PauseController 2/0 `0xb77c7126`, SystemConfig
  0/0 `0x94a50a4d`, ProxyAdmin 0/2 `0x68f689a2`, ZkEvmVerifierPostEuclid 0/0
  `0xb3a265a8`, ZkEvmVerifierPostFeynman 0/0 `0xb3a66aa5`, ZkEvmVerifierV1
  0/0 `0xac7d02f7`, ZkEvmVerifierV2 0/0 `0xa3e375ce`.
- Base: TimelockController 1/9 `0xd75c3ac3`, DisputeGameFactory 3/4
  `0x780eaf9d`, OptimismPortal2 0/6 `0x247eac30`, PermissionedDisputeGameV2
  3/9 `0xc36a2d08`, FaultDisputeGameV2 0/12 `0x2987fcaf`, SystemConfig 1/0
  `0x05f19560`, Escrow 1/0 `0xe53585e5`, NitroEnclaveVerifier 2/4
  `0x68756143`, RiscZeroVerifierRouter 0/3 `0x3cae3ae6`, AnchorStateRegistry
  1/8 `0x9340bfba`, SuperchainConfig 2/3 `0x90c9d860`, SP1VerifierGateway 2/0
  `0xf67f0dc1`, AggregateVerifier 0/1 `0x3fb3f290`, Safe 3/6 `0xe23c519b`,
  TEEProverRegistry 2/2 `0x9831f036`, TEEVerifier 0/1 `0x3b192657`,
  RiscZeroVerifierEmergencyStop 0/0 `0x285eacaa`, PreimageOracle 1/12
  `0x16701fca`, OptimismMintableERC20Factory 0/1 `0x307d4cb8`,
  L1StandardBridge 0/1 `0xcacd38e7`, L1ERC721Bridge 0/1 `0x1f65fda2`,
  DelayedWETH 0/3 `0xee6bf327`, L1CrossDomainMessenger 0/3 `0x1f2c13ad`,
  ProxyAdmin 0/4 `0x96d2f0fa`.
- plumenetwork: ERC20Bridge 2/2 `0xcf23a155`, RollupProxy 0/16 `0x865eda6a`,
  ERC20Outbox 1/4 `0xb9f7bc73`, SequencerInbox 4/2 `0xd9d7945b`, ERC20Inbox
  1/1 `0x03939c3c`, UpgradeExecutor 1/1 `0x11607080`.

Nine contracts (Scroll's eight `PlonkVerifier*`, Base's `HistoryStorage`)
produced plans that were not stored because V2 saw them as unverified (no
shape hash); the plan files are under their run directories only.
