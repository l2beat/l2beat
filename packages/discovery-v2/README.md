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
| `benchmark` | V1 project name | field-by-field comparison against the committed `discovered.json` at its block | |

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

Skip reasons: `user-activity` (state written by anyone, e.g. balances),
`computation` (pure function of its inputs), `unbounded` (state we cannot
enumerate from anything available), `covered` (already produced by another
step or a 0-arg getter), `not-state` (helpers, versions, interface checks).

The validator enforces: JSON schema; every `covers` and every `skips.item` is a
worklist item, and their union is the whole worklist; every method and event
exists in the ABI; recipe arguments match the recipe's argument schema; every
reference resolves; no cycles; `id` is a Solidity identifier present in the ABI
or a recipe's fixed name; literals type-check against the ABI. Then a dry run at
the target block reports reverts, zero-log event sets and recipe errors back to
the model.

Three refinements the implementation adds: a step whose `at` names another
contract may give `method` as a full fragment that is not in this ABI (the
target's ABI is not available), and may be named after that method; a plan
whose `shapeHash` differs from `prepared.shapeHash` is rejected, because it was
authored for other code; and a `constructorArgs` fetch must use the id
`constructorArgs`, which is what V1 calls the field. Each recipe declares the
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

1. Build the prompt: rules (the four pinned axes), the plan JSON schema, the
   library documentation generated from `recipe.json` files, the ABI in
   human-readable form, baseline values with errors, the worklist, the event
   list, the flattened source. Sources above a size cap are truncated with a
   marker, and the plan is flagged.
2. Run `codex exec` with `--output-schema`, read-only sandbox, shell tool
   disabled, web search disabled, user config ignored. The prompt goes in on
   stdin so the model never needs disk access. Capture the thread id from the
   JSON event stream.
3. Validate statically, then dry-run. On findings, `codex exec resume <thread>`
   with the findings only. At most two repair rounds.
4. Store an accepted plan under `plans/<shapeHash>.json` with provenance
   (model, timestamps, rounds). A failed plan stays under the run directory,
   never in the store, and the entry gets `planStatus: failed`.

## Output compatibility

`output` produces a V1 `EntryParameters` object: `type`, `name`, `address`,
`proxyType`, `values` (proxy `$` values, baseline getters, plan fields),
`errors`, `sourceHashes`, `sinceTimestamp`, `sinceBlock`, `deployerAddress`,
`implementationNames`, `unverified`. Values go through V1's `toContractValue`
and `prefixAddresses`, so numbers, big integers and chain-prefixed addresses
look identical. V2-specific facts (plan hash, status, model, verdict counts)
live in `entry.meta.json` so V1 consumers see no unknown keys.

## Benchmark

For every `Contract` entry of a V1 project at the project's committed block:
run the pipeline and compare `values` field by field as `equal`,
`different`, `v1-only` or `v2-only`. `v1-only` is split into "system getter"
and "handler" by consulting the template and config, because a missed handler
field means the model missed an enumeration, while a missed getter is a bug.
`v2-only` fields that V1 lists in `ignoreMethods` count against precision.
`--repeat N` authors N times and reports how many canonical plans were
identical, which is the consistency requirement expressed as a number.

## Working on this package

- Always say why. A module header, a recipe's `recipe.json`, and a test's
  description carry the rationale. Tests also say how they test.
- If code needs a comment to be understood, extract a function whose name says
  what happens. Comments mark structure ("Pass 1: …") or say why, never what.
- Tests use mocha and earl, mocks via `mockObject`, the same as the rest of the
  monorepo. Anything touching RPC or Codex is behind an interface so tests
  never hit the network.
- `@l2beat/discovery` is imported, not modified, except for additive exports.
