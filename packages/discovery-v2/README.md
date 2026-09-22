# Discovery V2: single-address extractor

Given one address on one chain at one block, produce the same kind of entry that
V1 discovery writes into `discovered.json`, but with the per-contract "how to fetch
the non-trivial state" part authored by a model instead of by a researcher.

This package deliberately stops before traversal. The BFS loop over relatives is
V1's engine and is not reimplemented here.

## Why it is built this way

A census of every V1 config and template (1,769 researcher-written handlers,
52,952 value fields across 239 projects) drove the design:

| Fact | Consequence |
| --- | --- |
| 93% of value fields come from parameterless getters, 7% from handlers | The model is only needed for the 7%. Everything else is deterministic. |
| All 394 event handlers are one of three folds (membership set, append list, latest per key), 95 with an "argument equals literal" filter | The shaping vocabulary is tiny and closed. |
| 328 handlers are `accessControl`, one fixed output shape | Cross-project consistency in V1 comes from fixed handler code, not from researcher coordination. |
| 71 `call` handlers read another contract via `address: {{ field }}` | Keys may live elsewhere; a step needs an `at` target. |
| 711 `ignoreMethods` lists, mostly getters over user data | Deciding what *not* to fetch is part of the job and must be explicit. |

Two runs of the pipeline, or two models, can only disagree on four axes. Each is
pinned by construction rather than by prompting:

1. **Shape.** The model references a *library recipe* by name and fills its
   arguments. It never writes a transformation. Recipes are jq, versioned,
   tested, and changed only by humans.
2. **Name.** A field is named after the Solidity identifier it comes from
   (getter, state variable, event) or the fixed name of the recipe. The model
   does not name.
3. **Place.** A value belongs to the contract whose plan fetched it. The model
   does not place.
4. **Selection.** For every parametrized view function the model emits exactly
   one verdict: `enumerate` (with a recipe and a key source) or `skip` with one
   of a closed set of reasons. The validator rejects plans that leave an item
   without a verdict.

Plans are stored by *shape hash* (V1's template-matching hash), so a contract
whose code we have already seen never goes back to the model.

## Tools

Every tool is a function with a JSON input and a JSON output, exposed as a CLI
subcommand, so each can be tested and benchmarked alone.

| Tool | Input | Output | Deterministic |
| --- | --- | --- | --- |
| `prepare` | chain, address, block | `prepared.json`: bytecode class, proxy, deployment, sources, ABI, flattened source, shape hash | yes (reuses V1 provider, `ProxyDetector`, `SourceCodeService`, flattener) |
| `baseline` | prepared | `baseline.json`: every 0-arg view/pure getter with a value or an error (proxy `$` values stay in `prepared.json` and are merged by `output`) | yes (equals V1 system handlers minus the 5-index array probe) |
| `worklist` | prepared | `worklist.json`: every view/pure function with inputs, plus declared events, for the model to rule on | yes |
| `author` | prepared, baseline, worklist | `plan.json` via Codex, validated, repaired, stored | no (the only model step) |
| `execute` | prepared, plan | `values.json`: raw step results, shaped fields, errors | yes |
| `output` | prepared, baseline, values | `entry.json` in V1 `EntryParameters` shape, plus `entry.meta.json` | yes |
| `pipeline` | chain, address, block | all of the above; skips `author` when a stored plan applies | |
| `benchmark` | V1 project name | `benchmark.json`, `benchmark.md`: field-by-field comparison against the committed `discovered.json` at its block | yes, once every shape has a stored plan |
| `facts` | prepared | `facts.json`: per state variable, the externally callable writers, their modifiers and the events they emit, from the compiler AST and Datalog rules (Soufflé) | yes (needs `souffle` on PATH) |
| `suite` | label | `runs/benchmark/<label>/<project>/` for every project in `benchmarks/suite.json`, plans in `plans/experiments/<label>/` | as `benchmark` |
| `report` | several `benchmark.json` or a suite label directory | `BENCHMARK.html`: one self-contained page with the runs as bars, side by side | yes |

RPC access goes through V1's `AllProviders` with the shared SQLite cache
(`.discovery.json` → `packages/config/cache/discovery.sqlite`), so benchmark
runs mostly replay cached responses. Environment variables are the same as V1
(`<CHAIN>_RPC_URL`), loaded from `--env-file` or, by default, the first of
`<repo>/.env` and `<repo>/packages/backend/.env` that exists.

## Running

From `packages/discovery-v2`. Every command accepts `--env-file`; the logger
writes to stderr and JSON files are the outputs, so stdout stays quiet except
for `validate`, which prints its findings and exits 1 on errors. Outputs go to
`--out` or `runs/<chain>/<address>/` (gitignored); commands that take a
`prepared.json` write next to it.

```sh
# Scroll's TimelockSCEmergency at the block of its committed discovered.json
pnpm start prepare  ethereum 0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44 --block 25789575
pnpm start baseline runs/ethereum/0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44/prepared.json
pnpm start worklist runs/ethereum/0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44/prepared.json

# Everything, with a hand-written plan (validate + execute + output)
pnpm start pipeline ethereum 0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44 --block 25789575 \
  --plan plans/manual/scroll-L1Timelock.plan.json

# Without --plan, pipeline looks for plans/<shapeHash>.json and otherwise
# writes an entry with proxy and baseline values only (planStatus: missing).
pnpm start pipeline ethereum 0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44 --block 25789575

# The stages alone, from a run directory
R=runs/ethereum/0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44
pnpm start validate $R/prepared.json $R/baseline.json $R/worklist.json plans/manual/scroll-L1Timelock.plan.json
pnpm start execute  $R/prepared.json $R/baseline.json plans/manual/scroll-L1Timelock.plan.json
pnpm start output   $R/prepared.json $R/baseline.json $R/values.json $R/plan.json
```

### Running author

`author` is the model step. It needs a logged-in `codex` on the PATH
(`codex login status`) and an RPC for the dry run; it prints one summary line
and exits 1 when no acceptable plan was reached.

```sh
# Author a plan for a prepared run directory; writes $R/plan.json and $R/author/
pnpm start author $R/prepared.json $R/baseline.json $R/worklist.json
# status=ok rounds=1 steps=1 skips=8 model=gpt-5.6-sol tokens=29954+865 time=36s

# Options: --model M, --reasoning low|medium|high, --max-rounds N (repair rounds
# after the first turn, default 2), --no-store (keep the plan out of plans/), --out DIR

# Another model through opencode (any `opencode models` entry); tools are disabled
# by config in a scratch directory and the event stream is checked for tool parts
pnpm start author $R/prepared.json $R/baseline.json $R/worklist.json \
  --provider opencode --model opencode/deepseek-v4.1-flash

# Prompt strategies, each an experiment axis the benchmark can vary alone:
#   --review  second pass: the accepted plan's executed results go back to the model
#             with three questions (skip reasons, unused privileged events, empty
#             folds); the revision passes the same validator and dry run, and the
#             first plan stays when it never does
#   --facts   compile each verified source with its exact compiler, run the Datalog
#             rules and add "who writes each state variable, guarded by what,
#             emitting which events" to the prompt (see `facts` below)
pnpm start author $R/prepared.json $R/baseline.json $R/worklist.json --review --facts

# The facts alone, as a file, for reading or for another tool
pnpm start facts $R/prepared.json
# ScrollChain: 14 variable(s), 1 never-emitted event(s), solc 0.8.24+commit.e11b9ed9 (cancun)

# The whole pipeline, authoring only when the store has no plan for the shape
pnpm start pipeline ethereum 0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44 --block 25789575 --author
# status=ok source=model rounds=1 steps=1 skips=8 fields=8 errors=0 model=gpt-5.6-sol

# Ask the model again even though a stored plan applies, without touching the store
pnpm start pipeline ethereum 0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44 --block 25789575 \
  --reauthor --no-store --out runs/ethereum/0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44-run2
```

### Running the benchmark

`benchmark <project>` runs the pipeline over every verified `Contract` entry
of a V1 project on one chain, at the block of the committed `discovered.json`
(`usedBlockNumbers[chain]`), and compares each entry with V1's field by
field. Outputs go to `--out` or `runs/benchmark/<project>/`: `benchmark.json`
(everything recorded) and `benchmark.md` (the tables), with each contract's
pipeline files under `contracts/<address>/` so every row can be traced to the
prompt, plan and values behind it.

```sh
# Every ethereum contract of scroll, authoring where the store has no plan
pnpm start benchmark scroll --author

# Three contracts, two extra authorings each with the store bypassed and not
# saved, to count distinct decision hashes
pnpm start benchmark scroll --author --repeat 2 \
  --addresses 0xa13BAF47339d63B743e7Da8741db5456DAc1E556,0x4CEA3E866e7c57fD75CB0CA3E9F5f1151D4Ead3F

# Bound the model cost: the first 25 contracts in discovered.json order, or
# an explicit list when the first 25 would miss the templated ones
pnpm start benchmark plumenetwork --author --limit 25
pnpm start benchmark base --author --addresses 0x0b144E07A0826182B6b59788c34b32Bfa86Fb711,…

# Options: --chain ethereum (default), --model M, --reasoning low|medium|high,
# --max-rounds N, --out DIR, --env-file F
```

Without `--author` a run costs no tokens: shapes with a stored plan use it
and the rest end as `missing` entries whose proxy and baseline values are
still compared. `--no-plan` runs every contract with an empty plan and no
model: the floor, what proxy detection and 0-arg getters alone reproduce.
Every other run is judged by how far it climbs above that floor, so a floor
run over the same addresses should sit next to every model run.

```sh
# The floor for the same 25 Base contracts a model run used
pnpm start benchmark base --no-plan --addresses "$(node -e "console.log(require('./runs/benchmark/base/benchmark.json').contracts.map(c=>c.address).join(','))")" --out runs/benchmark/base-noplan

# One page from several runs; `label=path` names a run, else its setup does
pnpm start report floor=benchmarks/scroll-noplan.json benchmarks/scroll.json --out BENCHMARK.html
```

`benchmarks/` keeps the `benchmark.json` of every run reported in
`BENCHMARK.md` and `BENCHMARK.html` (the `runs/` directory is not committed),
so the page can be regenerated and a new run compared with the old ones.
See `BENCHMARK.md` for the results and what they mean.

An *experiment* is one setup over the whole suite. `benchmarks/suite.json`
names the projects and, where a project is too large for one run, the
contracts; adding a project there adds it to every later experiment.
`suite <label>` runs them all under one label with a plan store of its own,
so two experiments never share a decision:

```sh
pnpm start suite deepseek-flash --author --provider opencode --model opencode/deepseek-v4.1-flash
pnpm start suite deepseek-flash-facts --author --provider opencode --model opencode/deepseek-v4.1-flash --facts
pnpm start suite gpt-5.6-review --author --review
pnpm start report runs/benchmark/deepseek-flash runs/benchmark/deepseek-flash-facts --out BENCHMARK.html
```

When the verdict rules change, `--rejudge` re-compares a finished run from
the `entry.json` files on disk, so old runs stay comparable with new ones
without spending a token:

```sh
pnpm start benchmark scroll --rejudge --out runs/benchmark/scroll
pnpm start suite deepseek-flash --rejudge
```

`$R/author/` holds `round-N.prompt.md`, `round-N.response.txt`,
`round-N.findings.json`, `round-N.dryrun.json`, `codex-events.jsonl` and
`summary.json` (thread id, model, tokens, timing per round), so a plan can be
reviewed together with what the model was told. `src/author/codex/
CodexClient.smoke.test.ts` talks to the real Codex and runs only with
`DISCOVERY_V2_CODEX_SMOKE=1`; the normal suite never spends tokens.

`src/integration/scrollTimelock.test.ts` runs the pipeline above under mocha
whenever an Ethereum RPC is configured and asserts, against the committed V1
entry, that every plain 0-arg getter and the `accessControl` field are equal.
Stored plans live in `plans/<shapeHash>.json` as
`{ plan, provenance: { source, createdAt, model?, rounds? } }` (`PlanStore`);
hand-written plans live in `plans/manual/` and are passed with `--plan`.

## Plan format (version 1)

```jsonc
{
  "version": 1,
  "contract": "ZkLink",
  "shapeHash": "0x…",
  "steps": [
    {
      "id": "validators",                       // Solidity identifier of the mapping/getter
      "covers": ["validators(address)"],       // worklist items this step answers
      "fetch": { "kind": "logs", "events": ["ValidatorStatusUpdate"] },
      "use": "set@1",
      "args": {
        "key": "validatorAddress",
        "add":    [{ "event": "ValidatorStatusUpdate", "when": { "arg": "isActive", "equals": true } }],
        "remove": [{ "event": "ValidatorStatusUpdate", "when": { "arg": "isActive", "equals": true, "negate": true } }]
      },
      "reason": "validators is written only in setValidator (onlyGovernor), which emits ValidatorStatusUpdate"
    },
    {
      "id": "committeeThresholds",
      "covers": ["committeeThresholds(uint8,uint256)"],
      "fetch": { "kind": "callEach", "method": "committeeThresholds(uint8,uint256)",
                 "keys": { "literal": [[1, 0], [1, 1], [2, 0]] } },
      "use": "map@1",
      "reason": "keys are the enum values used in setThresholds"
    },
    {
      "id": "owner",
      "fetch": { "kind": "call", "method": "owner()", "at": "$baseline.registry" },
      "reason": "governance reads the owner of the registry it points to"
    }
  ],
  "skips": [
    { "item": "balanceOf(address)", "reason": "user-activity" },
    { "item": "quote(uint256)",     "reason": "computation" }
  ]
}
```

Fetch kinds:

| kind | fields | result handed to the recipe |
| --- | --- | --- |
| `call` | `method`, `args?`, `at?` | decoded return value |
| `callEach` | `method`, `keys`, `at?` | `[{ key, value }]` in key order; `keys` is one of `literal`, `{ from: "$step.id" }`, `{ range: { length, start? } }`, `{ untilRevert: { max } }` |
| `logs` | `events` | decoded logs `[{ event, blockNumber, logIndex, args }]` in chain order, fetched from block 0 to the target block |
| `storage` | `slot`, `as` (`address`, `uint`, `bytes32`), `at?` | decoded slot |
| `constructorArgs` | | decoded constructor arguments |
| `hardcoded` | `value` | the value |

References: `$baseline.<field>` (a baseline getter value), `$step.<id>` (a prior
step's shaped output), `$self` (the contract address). A `length` in a range may
be a number or a reference.

Skip reasons: `computation` (a pure function of its inputs, or derivable
from already fetched values, e.g. `isBatchFinalized` from
`lastFinalizedBatchIndex`), `user-activity` (per-user, per-message or
per-operation state written through unprivileged calls, e.g. balances),
`unbounded` (privileged-written state whose keys cannot be enumerated from
events, getters or literals, e.g. one hash per committed batch), `covered`
(already produced by another step or a 0-arg getter), `not-state` (interface
checks, version strings, helpers).

The validator enforces: JSON schema; every `covers` and every `skips.item` is a
worklist item, and their union is the whole worklist; every method and event
exists in the ABI; recipe arguments match the recipe's argument schema; every
reference resolves; no cycles; `id` is a Solidity identifier present in the ABI
or a recipe's fixed name; literals type-check against the ABI. Then a dry run at
the target block reports reverts, zero-log event sets and recipe errors back to
the model.

Four refinements the implementation adds: a step whose `at` names another
contract may give `method` as a full fragment that is not in this ABI (the
target's ABI is not available), and may be named after that method; a plan
whose `shapeHash` differs from `prepared.shapeHash` is rejected, because it was
authored for other code; a `constructorArgs` fetch must use the id
`constructorArgs`, which is what V1 calls the field; and a `logs` step may
carry no `covers` and be named after an event it folds in lowerCamelCase
(`revertBatch` for `RevertBatch`), for state that exists only in the events
of privileged functions and has no getter (V1's `revertedBatches`). Each recipe declares the
fetch kind it accepts (`logs`, `callEach` or a scalar `call`/`storage`/
`hardcoded`), and the validator rejects a recipe fed by the wrong kind.

## Library

`src/library/recipes/<name>/recipe.json` (name, version, input kind, argument
schema, output description, V1 equivalent), `recipe.jq` (the implementation), and
`tests/*.json` (input, args, expected output). Recipes receive
`{ "input": <fetch result>, "args": <plan args> }` and must produce one JSON
value. Initial recipes, each replacing a V1 handler family:

| Recipe | Replaces | Output |
| --- | --- | --- |
| `set@1` | event add/remove | sorted unique array of `key` |
| `list@1` | event add | array of `key` in emission order |
| `latest@1` | event set / groupBy | last `value`, or map of last `value` per `groupBy` |
| `count@1` | eventCount | number of matching logs |
| `accessControl@1` | accessControl | `{ ROLE_NAME: { adminRole, members } }` from RoleGranted/RoleRevoked/RoleAdminChanged |
| `map@1` | call with literal keys, mapping enumeration | `{ key: value }` from `callEach` pairs |
| `array@1` | array handler | `[value]` from `callEach` pairs |
| `format.seconds@1`, `format.undecimal@1` | Blip `format` edits | human-readable scalar |

jq runs through `jq-wasm` in a worker thread with a hard timeout, because a
recipe is code we execute on data we did not write, and a runaway filter must
not hang a run.

## Authoring loop

1. Build the prompt (`src/author/prompt/buildAuthoringPrompt.ts`), a pure
   function of the prepared, baseline and worklist files plus the library, in
   five fixed sections: the rules (the four pinned axes in imperative form,
   the closed skip reasons each defined with one example, "prefer events of
   privileged setters", an invitation to fold event-only state of privileged
   functions into a step without `covers`, "never fetch user activity"), the plan JSON schema with the ZkLink worked
   example, the library documentation rendered from `recipe.json`, the
   contract facts (identity, proxy values, ABI fragments, baseline values with
   long ones elided, the worklist, the events), and the flattened sources,
   proxy first, cut at a total character budget (default 400 000) with a
   marker; a cut prompt is recorded as `promptTruncated`.
2. Run `codex exec` (`src/author/codex/CodexClient.ts`) with the prompt on
   stdin and exactly these flags on every turn, first or resumed:
   `--skip-git-repo-check --ignore-user-config -c sandbox_mode="read-only"
   -c features.shell_tool=false -c web_search="disabled" --json
   --output-last-message <tmp>` (plus `--model` and
   `-c model_reasoning_effort=…` when asked). `--ignore-user-config` is what
   keeps the MCP servers of `~/.codex/config.toml` away from the model; the
   stored login still works with it. The first turn is not `--ephemeral`
   because repair rounds `codex exec resume <thread id>`, and an ephemeral
   thread cannot be resumed. The thread id comes from the `thread.started`
   event, usage from `turn.completed`, the final message from the
   `--output-last-message` file (falling back to the last `agent_message`
   item), and the model name from the thread's rollout file under
   `~/.codex/sessions` because the JSONL stream does not carry it (observed:
   `gpt-5.6-sol`). Isolation is verified, not assumed: a turn whose events
   contain any item other than `agent_message`, `reasoning` or `todo_list`
   (so `command_execution`, `mcp_tool_call`, `web_search`, `file_change`) is
   refused. A wall-clock timeout kills the process group.

   `--output-schema` is not used. The endpoint behind it is OpenAI's strict
   structured output: it rejected `planSchema` first for `const` values
   without a `type`, and after that was transformed because every object
   must carry `additionalProperties: false` with every property required.
   Recipe `args` is an open object by design (each recipe brings its own
   argument schema, and `accessControl@1`'s `roleNames` is a map with
   arbitrary keys), so the plan schema cannot be made strict without changing
   the plan format. The schema travels in the prompt as text instead, the
   model is asked for exactly one JSON object, the loop tolerates a code
   fence, and `validateSchema` checks the result; `CodexClient` keeps an
   `outputSchema` option for the day the schema is strict-compatible.
3. Parse, fill `shapeHash` from `prepared.json` when the model omitted it (it
   is a fact about the code, not a decision), `validatePlan`, and when there
   is no error, dry-run `executePlan` on the real provider. Step errors become
   `steps[i]` findings; a `logs` step that matched nothing becomes a warning
   when the step covers no getter (an empty history can be the truth) and an
   error when it does (the benchmark caught an `isBatchPoster = []` accepted
   as a warning while the getter returned true for five addresses), so the
   model must find the events the setters actually emit or skip the item. A
   contract whose worklist is empty never reaches the model: its plan is
   empty by construction and is stored with `source: trivial`; 16 of the 69
   calls in the first benchmark were spent on exactly such plans. Any error
   produces a repair message: the findings
   as a numbered list, errors first, then "Return the whole corrected plan",
   sent with `codex exec resume`. The model gets one first turn plus at most
   `maxRepairRounds` (default 2) repairs.
4. An accepted plan is stored under `plans/<shapeHash>.json` with provenance
   (`source: model`, model, rounds, `createdAt`, `decisionHash`). A failed authoring leaves
   `plan.json` (the last statically valid candidate, if any) and the round
   trail under the run directory, never in the store, and the entry gets
   `planStatus: failed`; `entry.meta.json` carries `model`, `planHash` and
   `decisionHash` on success. `decisionHash` (`src/plans/decisionHash.ts`)
   hashes the plan without its step `reason`s and with steps and skips in
   canonical order: two authorings of ScrollChain were seen to agree on every
   decision and differ only in wording, and consistency must count that as
   the same plan.

## Facts

`facts` is the static-analysis tool behind `--facts`. It follows the
repository's `queryable-facts` division of labour: the compiler observes,
Datalog infers, nothing is guessed by a walker with special cases.

1. Each verified source is compiled by the exact compiler the explorer
   recorded (`v0.8.24+commit.e11b9ed9`), downloaded once from
   binaries.soliditylang.org into `~/.cache/discovery-v2/solc/`, with only the
   AST requested. A source that needs a newer EVM (Yul `blobhash`, `tstore`)
   is retried on later EVM versions; the explorer's settings are not in the
   source, so this is inferred from the error.
2. `facts/astFacts.ts` turns the AST into flat relations: contracts and
   their linearised bases, state variables, functions with visibility and
   kind, modifiers and their invocations, events with canonical signatures,
   AST nesting, resolved references, written expressions (assignment,
   `++`/`--`/`delete`, `push`/`pop`, tuple targets, writes through local
   storage pointers), emit statements and internal or library calls.
3. `facts/rules/facts.dl` (Soufflé) derives, within the analysed contract's
   inheritance chain only: which external or public functions can reach a
   write of each mutable variable through internal calls and modifiers,
   which modifiers those functions declare, which events they can emit,
   which functions read each variable, and which declared events no entry
   point emits. Reachability is syntactic: the path exists, it need not run.
4. `facts/buildFacts.ts` names the ids back and writes `facts.json`; the
   prompt renders one line per variable, for example
   `isSequencer (mapping(address => bool)): written by addSequencer(address)
   [onlyOwner] emits UpdateSequencer(address,bool); removeSequencer(address)
   [onlyOwner] emits UpdateSequencer(address,bool)`.

A source that fails to compile or analyse is recorded with its error and the
prompt says so; the rest of the contract's facts still apply. Tests compile a
fixture with the bundled solc-js and skip the rule test when `souffle` is not
installed.

## Output compatibility

`output` produces a V1 `EntryParameters` object: `type`, `name`, `address`,
`proxyType`, `values` (proxy `$` values, baseline getters, plan fields),
`errors`, `sourceHashes`, `sinceTimestamp`, `sinceBlock`, `deployerAddress`,
`implementationNames`, `unverified`. Values go through V1's `toContractValue`
and `prefixAddresses`, so numbers, big integers and chain-prefixed addresses
look identical. V2-specific facts (plan hash, status, model, verdict counts)
live in `entry.meta.json` so V1 consumers see no unknown keys.

## Benchmark

`benchmark <project>` compares V2 with the committed V1 output, one contract
at a time and at V1's block, so what is measured is the extractor and not
chain activity. Only verified `Contract` entries on the chain are run (EOAs,
`Reference`s and unverified contracts are skipped); `--limit N` and
`--addresses a,b` bound the run, `--author` asks the model where the store has
no plan, and a contract whose pipeline throws is recorded and the run goes on.

Each V1 field is first *attributed* from the project's effective config,
read through V1's `ConfigReader` and `TemplateService` and merged exactly as
`AddressAnalyzer` merges template and override: `proxy` (`$…` values and the
proxy detector's other names), `getter` (no field config), `handler` (a
template or override field with a handler, reported with the handler type),
or `template-projection` (`pickRoleMembers`, `copy`, or a `call` handler whose
`edit` only formats a getter). A missed proxy value or getter is a bug in the
deterministic tools, a missed handler field is the model missing an
enumeration, and a missed projection is left to consumers by design; the
report never adds them up into one number.

Values then get one of five verdicts: `equal` (same name, deep-equal after
chain-prefixed addresses are normalised on both sides, since V1 templates
re-prefix some getters for display), `equal-renamed` (a V1 handler or
projection field whose value V2 produced under another name, as
`sequencers` → `isSequencer`), `equal-by-value` (every value V1 held is in
V2 under another shape: the same name with another nesting, or every
distinctive leaf, an address, a hash, a long number, found among V2 fields
no V1 field claimed; this is how `game0`…`game8` are credited against one
`gameImpls` map, because a researcher chose that shape by hand and the
benchmark measures extraction, not presentation), `different` (same name,
other value, with a one-line diff), `v1-only` (with its attribution) and
`v2-only`, split into
`ignored-by-v1` (the name is in V1's effective `ignoreMethods`) and `new`.
`proxyType`, `sourceHashes`, `sinceBlock` and `implementationNames` are
compared as entry facts. Per contract the report keeps plan status and source
(store, model, none), rounds, tokens, wall time and the verdict counts.

`--repeat N` (with `--author`) authors N more times with the store bypassed
and nothing saved, and reports how many distinct `decisionHash`es the N+1
plans have: the consistency requirement expressed as a number.
`BENCHMARK.md` holds the results of the real runs, with every V1 handler
field V2 missed or got different and where its fix belongs. `BENCHMARK.html`
(from `report`) shows the same runs as bars: one over all V1 fields, and one
over the V1 fields a researcher wrote a handler for, which is the only part a
model, a tool or a recipe can move and therefore the bar to compare setups on.

## Working on this package

- Always say why. A module header, a recipe's `recipe.json`, and a test's
  description carry the rationale. Tests also say how they test.
- If code needs a comment to be understood, extract a function whose name says
  what happens. Comments mark structure ("Pass 1: …") or say why, never what.
- Tests use mocha and earl, mocks via `mockObject`, the same as the rest of the
  monorepo. Anything touching RPC or Codex is behind an interface so tests
  never hit the network.
- `@l2beat/discovery` is imported, not modified, except for additive exports.
