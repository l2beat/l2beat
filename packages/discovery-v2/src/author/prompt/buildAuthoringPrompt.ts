/**
 * The authoring prompt: everything the model needs to rule on one contract.
 *
 * The prompt is a pure function of the prepared, baseline and worklist files
 * plus the library, in a fixed section order, so two runs over the same
 * contract send byte-identical prompts and any difference in the plans is
 * the model's alone. The four pinned axes (shape, name, place, selection)
 * are stated as rules the validator will enforce, so the model is told the
 * same thing the validator checks and nothing the validator would refuse.
 *
 * The flattened source is last and is the only part that is cut: a plan is
 * decided from the ABI, the baseline and the worklist, and the source is
 * evidence for which setter writes which mapping. A cut source is flagged so
 * the caller can record that the model worked from partial evidence.
 */
import type { Library } from '../../library/Library'
import { planSchema } from '../../plan/planSchema'
import type { Baseline, BaselineField } from '../../types/Baseline'
import type { ContractValue } from '../../types/ContractValue'
import type { Facts, FactsSource, FactsVariable } from '../../types/Facts'
import type { Prepared, PreparedSource } from '../../types/Prepared'
import type { Worklist } from '../../types/Worklist'

export interface PromptContext {
  prepared: Prepared
  baseline: Baseline
  worklist: Worklist
  library: Library
  /** Static-analysis facts; when present they are rendered after the events. */
  facts?: Facts
}

export interface PromptOptions {
  /** Total characters of flattened source across all bundles. */
  sourceCharCap: number
}

export interface AuthoringPrompt {
  prompt: string
  /** True when the source did not fit `sourceCharCap`. */
  truncated: boolean
}

export const SECTION_HEADERS = {
  rules: '## 1. Role and rules',
  schema: '## 2. Plan schema and worked example',
  library: '## 3. Recipe library',
  facts: '## 4. Contract facts',
  source: '## 5. Flattened source',
} as const

/** Baseline values longer than this are elided: the model needs to know a value exists, not read a 2 kB tuple. */
export const BASELINE_VALUE_CAP = 200

export const TRUNCATION_MARKER = '// [TRUNCATED'

export function buildAuthoringPrompt(
  ctx: PromptContext,
  options: PromptOptions,
): AuthoringPrompt {
  const source = renderSources(ctx.prepared, options.sourceCharCap)
  const prompt = [
    '# Discovery plan for one contract',
    '',
    renderRules(),
    renderSchemaAndExample(),
    renderLibrary(ctx.library),
    renderFacts(ctx),
    source.text,
  ].join('\n')
  return { prompt, truncated: source.truncated }
}

function renderRules(): string {
  return [
    SECTION_HEADERS.rules,
    '',
    'You write a *plan* that tells a deterministic executor how to fetch the non-trivial state of one smart contract at one block: the state behind view functions that take arguments (mappings, arrays, role tables), which the executor cannot read without knowing the keys. Every 0-argument getter has already been read; its value is in the baseline below. You decide *what* to fetch and *from where*; you never transform data yourself.',
    '',
    'Rules. Each is checked by a validator, and a violation comes back to you as a finding to repair.',
    '',
    '1. **Shape.** Pick recipes only from the recipe library in section 3, by their exact id (e.g. `set@1`), and fill their arguments as documented. Do not describe transformations in prose; if no recipe fits, skip the item.',
    "2. **Name.** A step `id` is the Solidity identifier the value comes from: the getter or mapping name for a `callEach`, the mapping or state variable name for a `logs` step, or the fixed name of the recipe (`accessControl` for `accessControl@1`, `constructorArgs` for a `constructorArgs` fetch). For event-only state (rule 6) it is the event's subject: the variable the event announces, or the event name in lowerCamelCase. Never invent a name and never reuse a baseline field name.",
    '3. **Place.** Read this contract. Use `at` only when a baseline field holds the address of another contract whose state belongs to this one (e.g. `at: "$baseline.registry"` with a full `function ...` fragment as `method`).',
    "4. **Selection.** Give exactly one verdict to every item in the worklist: either its signature appears in exactly one step's `covers`, or it appears in `skips` with a reason. Leave nothing out and rule on nothing twice. Skip reasons are only the five below; pick the one whose definition fits, not the softest one.",
    '   - `computation`: a pure function of its inputs, or derivable from values already fetched. Example: `isBatchFinalized(uint256)` is `batchIndex <= lastFinalizedBatchIndex`, a baseline getter; `hashOperation(address,uint256,bytes,bytes32,bytes32)` hashes its arguments.',
    '   - `user-activity`: per-user, per-message or per-operation state written through unprivileged calls, even when an event would let you enumerate it. Example: `balanceOf(address)`, `isMessageDropped(bytes32)`, `getTimestamp(bytes32)` for operations anyone can schedule.',
    '   - `unbounded`: state written only by privileged callers whose keys cannot be enumerated from events, getters or literals, or which grows with every batch or block the operator posts. Example: `committedBatches(uint256)`, one hash per batch committed by whitelisted sequencers, with no fixed key set to read.',
    "   - `covered`: the value is already produced by another step or by a 0-argument getter in the baseline. Example: `owners(uint256)` next to a `getOwners()` baseline getter. An item answered by a step belongs in that step's `covers`, not here.",
    '   - `not-state`: interface checks, version strings and helpers that read no storage of interest. Example: `supportsInterface(bytes4)`, `getFunctionSelector(string)`.',
    '5. **Enumeration source.** To enumerate a mapping, prefer the events emitted by its privileged setters (functions guarded by `onlyOwner`, `onlyRole`, `onlyGovernor` or similar). Fold them with `set@1` (membership with add/remove), `list@1` (append-only), or `latest@1` (last value, optionally per key). Use `callEach` with `literal` keys only when the keys are fixed in the source (enum values, constants), `range` when a length getter is in the baseline, `untilRevert` for arrays without one.',
    "6. **Event-only state.** Some state is observable only through events emitted by privileged functions and has no getter: a list of reverted batches (`RevertBatch`), a history of verifier updates (`UpdateVerifier`), a sequence of upgrades. You may add a step without `covers` for such state: fetch it with `logs` and fold it with `list@1`, `set@1`, `latest@1` or `count@1`, named after the event's subject in Solidity terms (the state variable the event announces, or the event name in lowerCamelCase such as `revertBatch` when no variable exists). Never do this for user-activity events (deposits, withdrawals, messages, transfers) or for the routine per-batch commits and finalizations an operator emits continuously.",
    "7. **Roles.** For OpenZeppelin AccessControl (`hasRole`, `getRoleAdmin`, events `RoleGranted`/`RoleRevoked`/`RoleAdminChanged`) use one `accessControl@1` step with id `accessControl` that covers both items, and fill `roleNames` with every `*_ROLE()` baseline getter: the getter's value (the bytes32 hash) as key, the getter's name as value. The zero hash is `DEFAULT_ADMIN_ROLE` automatically.",
    '8. **Reason.** `reason` is one sentence naming the writer function and its modifier (e.g. "sequencers is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer").',
    '9. **User activity is never fetched.** Balances, deposits, withdrawals, per-user nonces, message or operation status by hash, queue contents: skip them as `user-activity` even when an event would let you enumerate them.',
    '11. **Facts.** When section 4 ends with static-analysis facts, take the writers, modifiers and events from there: a mapping whose writers all carry an owner/governor/role modifier is privileged state, and the events those writers emit are the ones to fold; an event listed as never emitted must not be used.',
    '10. **Output.** Reply with exactly one JSON object that matches the plan schema in section 2, and nothing else: no prose, no code fence, no comments. Copy `contract` from the contract facts. Omit `shapeHash` unless it is given below.',
    '',
  ].join('\n')
}

function renderSchemaAndExample(): string {
  return [
    SECTION_HEADERS.schema,
    '',
    'The plan must validate against this JSON schema:',
    '',
    '```json',
    JSON.stringify(planSchema, null, 2),
    '```',
    '',
    "Fetch kinds: `call` (one call, one value), `callEach` (one method over many keys, for `map@1`/`array@1`), `logs` (this contract's events from block 0, for `set@1`/`list@1`/`latest@1`/`count@1`/`accessControl@1`), `storage` (a raw slot), `constructorArgs`, `hardcoded`. References: `$baseline.<field>`, `$step.<id>`, `$self`.",
    '',
    'A worked example for a contract with an event-announced validator mapping, a two-key threshold mapping keyed by enum values, and a registry whose owner matters:',
    '',
    '```json',
    JSON.stringify(EXAMPLE_PLAN, null, 2),
    '```',
    '',
  ].join('\n')
}

/** The README's ZkLink example, the one plan every reader of this package has seen. */
const EXAMPLE_PLAN = {
  version: 1,
  contract: 'ZkLink',
  steps: [
    {
      id: 'validators',
      covers: ['validators(address)'],
      fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
      use: 'set@1',
      args: {
        key: 'validatorAddress',
        add: [
          {
            event: 'ValidatorStatusUpdate',
            when: { arg: 'isActive', equals: true },
          },
        ],
        remove: [
          {
            event: 'ValidatorStatusUpdate',
            when: { arg: 'isActive', equals: true, negate: true },
          },
        ],
      },
      reason:
        'validators is written only in setValidator (onlyGovernor), which emits ValidatorStatusUpdate',
    },
    {
      id: 'committeeThresholds',
      covers: ['committeeThresholds(uint8,uint256)'],
      fetch: {
        kind: 'callEach',
        method: 'committeeThresholds(uint8,uint256)',
        keys: {
          literal: [
            [1, 0],
            [1, 1],
            [2, 0],
          ],
        },
      },
      use: 'map@1',
      reason: 'keys are the enum values used in setThresholds (onlyGovernor)',
    },
    {
      id: 'owner',
      fetch: {
        kind: 'call',
        method: 'function owner() view returns (address)',
        at: '$baseline.registry',
      },
      reason: 'governance reads the owner of the registry it points to',
    },
  ],
  skips: [
    { item: 'balanceOf(address)', reason: 'user-activity' },
    { item: 'quote(uint256)', reason: 'computation' },
  ],
}

function renderLibrary(library: Library): string {
  return [SECTION_HEADERS.library, '', library.renderDocs()].join('\n')
}

function renderFacts(ctx: PromptContext): string {
  const { prepared, baseline, worklist } = ctx
  return [
    SECTION_HEADERS.facts,
    '',
    '### Identity',
    '',
    ...renderIdentity(prepared),
    '',
    '### ABI (proxy and implementations merged)',
    '',
    '```solidity',
    ...prepared.abi,
    '```',
    '',
    `### Baseline: 0-argument getters already read (${Object.keys(baseline.fields).length})`,
    '',
    'Reference these as `$baseline.<name>`; never fetch them again.',
    '',
    ...renderBaseline(baseline),
    '',
    `### Worklist: items needing a verdict (${worklist.items.length})`,
    '',
    ...worklist.items.map(
      (item) => `- \`${item.signature}\`: ${item.fragment}`,
    ),
    '',
    `### Events (${worklist.events.length})`,
    '',
    ...(worklist.events.length === 0
      ? ['(none declared)']
      : worklist.events.map((event) => `- ${event.fragment}`)),
    '',
    ...(ctx.facts === undefined ? [] : renderStaticFacts(ctx.facts)),
  ].join('\n')
}

/**
 * Compiler-derived facts replace guesswork about which event announces
 * which mapping: for every mutable state variable, the externally callable
 * functions that can write it, their modifiers and the events they emit.
 * Rendered per source (proxy, implementation) so the model sees which code
 * the facts describe, and a source that failed analysis says so.
 */
export function renderStaticFacts(facts: Facts): string[] {
  return [
    '### Static analysis: who writes each state variable (compiler AST + Datalog)',
    '',
    'Derived from the verified source by the compiler and a fixed set of rules, not by a model. "Writers" are external/public functions from which a write of the variable is reachable through internal calls and modifiers; each is shown with its own modifiers and every event it can emit. Use this to pick the events that enumerate a mapping and to tell privileged setters (modifier-guarded) from user activity. A writer list is syntactic reachability: the path exists, it need not run.',
    '',
    ...facts.sources.flatMap(renderFactsSource),
  ]
}

function renderFactsSource(source: FactsSource): string[] {
  const head = `#### ${source.name} (${source.address})`
  if (source.error !== undefined) {
    return [head, '', `No facts: ${source.error}`, '']
  }
  if (source.variables.length === 0) {
    return [
      head,
      '',
      'No mutable state variable is written by any entry point.',
      '',
    ]
  }
  return [
    head,
    '',
    ...source.variables.map(renderFactsVariable),
    ...(source.neverEmitted.length === 0
      ? []
      : [
          '',
          `Events declared here that no entry point emits (a fold over them returns nothing): ${source.neverEmitted.map((e) => `\`${e}\``).join(', ')}`,
        ]),
    '',
  ]
}

function renderFactsVariable(variable: FactsVariable): string {
  const writers =
    variable.writers.length === 0
      ? variable.writtenInConstructor
        ? 'set only in the constructor'
        : 'no external writer found'
      : variable.writers
          .map((writer) => {
            const guards =
              writer.modifiers.length === 0
                ? ' [no modifier]'
                : ` [${writer.modifiers.join(', ')}]`
            const events =
              writer.events.length === 0
                ? ''
                : ` emits ${writer.events.join(', ')}`
            return `${writer.function}${guards}${events}`
          })
          .join('; ')
  const readers = variable.readers.filter(
    (r) => r.includes('(') && !r.endsWith('()'),
  )
  const readBy = readers.length === 0 ? '' : `; read by ${readers.join(', ')}`
  return `- \`${variable.name}\` (${variable.type}, ${variable.visibility}, in ${variable.declaredIn}): written by ${writers}${readBy}`
}

function renderIdentity(prepared: Prepared): string[] {
  const lines = [
    `- Chain: ${prepared.chain}`,
    `- Address: ${prepared.address}`,
    `- Block: ${prepared.blockNumber}`,
    `- Contract name (\`contract\`): ${prepared.name}`,
    `- Proxy type: ${prepared.proxy.type}`,
  ]
  for (const [name, value] of Object.entries(prepared.proxy.values)) {
    lines.push(`- Proxy value ${name}: ${elide(JSON.stringify(value))}`)
  }
  for (const [address, name] of Object.entries(
    prepared.implementationNames ?? {},
  )) {
    lines.push(`- Implementation ${address}: ${name}`)
  }
  if (prepared.shapeHash !== undefined) {
    lines.push(`- Shape hash (\`shapeHash\`): ${prepared.shapeHash}`)
  }
  return lines
}

function renderBaseline(baseline: Baseline): string[] {
  const entries = Object.entries(baseline.fields)
  if (entries.length === 0) {
    return ['(none)']
  }
  return entries.map(([name, field]) => `- \`${name}\` = ${renderField(field)}`)
}

function renderField(field: BaselineField): string {
  if (field.error !== undefined) {
    return `error: ${field.error}`
  }
  return elide(JSON.stringify(field.value as ContractValue))
}

function elide(text: string): string {
  if (text.length <= BASELINE_VALUE_CAP) {
    return text
  }
  return `${text.slice(0, BASELINE_VALUE_CAP)}… [${text.length - BASELINE_VALUE_CAP} more characters elided]`
}

/**
 * Proxy first, because a reader orients on the entry point; then every
 * implementation. One shared budget so the total prompt size is bounded no
 * matter how many implementations a diamond has.
 */
function renderSources(
  prepared: Prepared,
  cap: number,
): { text: string; truncated: boolean } {
  const ordered = orderSources(prepared)
  const lines = [SECTION_HEADERS.source, '']
  let budget = cap
  let truncated = false
  for (const source of ordered) {
    lines.push(`### ${source.name} (${source.address})`, '', '```solidity')
    if (budget <= 0) {
      truncated = true
      lines.push(
        `${TRUNCATION_MARKER}: ${source.flattened.length} characters omitted; the source budget is exhausted]`,
      )
    } else if (source.flattened.length > budget) {
      truncated = true
      lines.push(
        source.flattened.slice(0, budget),
        `${TRUNCATION_MARKER}: ${source.flattened.length - budget} of ${source.flattened.length} characters omitted]`,
      )
      budget = 0
    } else {
      lines.push(source.flattened)
      budget -= source.flattened.length
    }
    lines.push('```', '')
  }
  return { text: lines.join('\n'), truncated }
}

function orderSources(prepared: Prepared): PreparedSource[] {
  const self = prepared.address.toString()
  return [...prepared.sources].sort((a, b) => {
    const aSelf = a.address.toString() === self ? 0 : 1
    const bSelf = b.address.toString() === self ? 0 : 1
    return aSelf - bSelf
  })
}
