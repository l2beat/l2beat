/**
 * The authoring prompt: everything the model needs to draft a template for
 * one contract.
 *
 * The prompt is a pure function of the facts, the worklist and the locked
 * fields, in a fixed section order, so two runs over the same contract send
 * byte-identical prompts and any difference between drafts is the model's
 * alone. The rules state what the validator and the dry run enforce, in
 * the words their findings use, so the model is told what will be checked
 * and nothing that would be refused; the wording of the research prompt's
 * rules, tuned over several benchmark runs, is kept where it still applies.
 *
 * The flattened source is last and is the only part that is cut: a draft is
 * decided from the ABI, the baseline and the worklist, and the source is
 * evidence for which setter writes which mapping. A cut source is flagged
 * so the caller can record that the model worked from partial evidence.
 */
import type { ContractValue } from '../../output/types'
import type { Draft } from '../draft/Draft'
import type { BaselineField, ContractFacts, FlatSource } from '../facts'
import type { Worklist, WorklistEvent, WorklistItem } from '../worklist'
import { draftJsonSchema } from './draftJsonSchema'
import { HANDLER_DOCS } from './handlerDocs'

/** Original JSON text of a field kept verbatim from an older template. */
export interface LockedFieldText {
  name: string
  text: string
}

export interface PromptInput {
  facts: ContractFacts
  worklist: Worklist
  locked?: LockedFieldText[]
}

export interface PromptOptions {
  /** Total characters of flattened source across all bundles. */
  sourceCharCap?: number
}

export interface AuthoringPrompt {
  prompt: string
  /** True when the source did not fit `sourceCharCap`. */
  truncated: boolean
}

export const DEFAULT_SOURCE_CHAR_CAP = 400_000

export const SECTION_HEADERS = {
  rules: '## 1. Role and rules',
  schema: '## 2. Draft schema and worked example',
  handlers: '## 3. Handlers',
  facts: '## 4. Contract facts',
  source: '## 5. Flattened source',
} as const

/** Values longer than this are elided: the model needs to know a value exists, not read a 2 kB tuple. */
export const VALUE_CHAR_CAP = 200

export const TRUNCATION_MARKER = '// [TRUNCATED'

export function buildPrompt(
  input: PromptInput,
  options: PromptOptions = {},
): AuthoringPrompt {
  const locked = input.locked ?? []
  const source = renderSources(
    input.facts,
    options.sourceCharCap ?? DEFAULT_SOURCE_CHAR_CAP,
  )
  const prompt = [
    '# Discovery template draft for one contract',
    '',
    renderRules(locked.length > 0),
    renderSchemaAndExample(),
    renderHandlerDocs(),
    renderFacts(input.facts, input.worklist, locked),
    source.text,
  ].join('\n')
  return { prompt, truncated: source.truncated }
}

interface Rule {
  title: string
  lines: string[]
}

function renderRules(hasLocked: boolean): string {
  const rules = [...RULES_BEFORE_LOCKED, ...(hasLocked ? [LOCKED_RULE] : [])]
  return [
    SECTION_HEADERS.rules,
    '',
    'You write a *draft* of a discovery template for one smart contract. Discovery reads the contract at one block: every 0-argument getter has already been read, and every view function with a single `uint256` argument has been probed at indices 0–4; their values are the baseline in section 4. What discovery cannot read without being told how is the state behind view functions that take other arguments (mappings, role tables, whole arrays) and the state that only events reveal. Your draft adds a field for each such piece of state, each with one handler that reads it, and gives a verdict on every function and event of the worklist. You decide *what* to read and *from where*; you never transform data yourself beyond the two `edit` forms.',
    '',
    'Rules. Each is checked by a validator or by a dry run of your handlers at the block in section 4, and a violation comes back to you as a finding to repair.',
    '',
    ...[...rules, OUTPUT_RULE].flatMap(renderRule),
    '',
  ].join('\n')
}

function renderRule(rule: Rule, index: number): string[] {
  const [first, ...rest] = rule.lines
  return [`${index + 1}. **${rule.title}** ${first}`, ...rest]
}

const RULES_BEFORE_LOCKED: Rule[] = [
  {
    title: 'Shape.',
    lines: [
      'Use only the seven handler types of section 3 (`call`, `array`, `event`, `accessControl`, `storage`, `constructorArgs`, `hardcoded`), each with only the keys documented for it. `edit` is either `["format", "FormatSeconds"]` or `["get", key, …]`, and an event `where` is either `["=", "#arg", literal]` or `["!=", "#arg", literal]`; no other form of either is accepted. Do not describe transformations in prose; if no handler fits, skip the item.',
    ],
  },
  {
    title: 'Name.',
    lines: [
      'A field name is a Solidity identifier naming the state the field holds: the getter or mapping it reads (`committedBatches`), the members of a boolean membership mapping (`sequencers` for `isSequencer(address)`), or, for event-only state, the event’s subject in lowerCamelCase (`revertedBatches` for `RevertBatch`). An `accessControl` field is named `accessControl` and a `constructorArgs` field `constructorArgs`. Never reuse a baseline field name: a field of that name replaces the baseline value. The one exception is an `array` field named exactly like the probed single-`uint256` getter it enumerates, which replaces the 0–4 probe with the whole array. Names never start with `$`.',
    ],
  },
  {
    title: 'Place.',
    lines: [
      'Read this contract. Use `address` only when a baseline field or another field holds the address of another contract whose state belongs to this one (e.g. `"address": "{{ registry }}"`), and then give `method` as a full `function …` fragment.',
    ],
  },
  {
    title: 'Selection.',
    lines: [
      'Give exactly one verdict to every worklist function and every event listed in section 4. The token is the function signature exactly as listed (`isSequencer(address)`) or the bare event name (`UpdateSequencer`, never its fragment), and it appears either in exactly one field’s `covers` or exactly once as a `skips[].item` with a reason. Leave nothing out, rule on nothing twice, and name nothing that is not listed. Skip reasons are only the five below; pick the one whose definition fits, not the softest one. They apply to events too, `covered` meaning that a getter or field already holds the state the event announces.',
      '   - `computation`: a pure function of its inputs, or derivable from values already fetched. Example: `isBatchFinalized(uint256)` is `batchIndex <= lastFinalizedBatchIndex`, a baseline getter; `hashOperation(address,uint256,bytes,bytes32,bytes32)` hashes its arguments.',
      '   - `user-activity`: per-user, per-message or per-operation state written through unprivileged calls, even when an event would let you enumerate it. Example: `balanceOf(address)`, `isMessageDropped(bytes32)`, `getTimestamp(bytes32)` for operations anyone can schedule; events such as `Transfer`, `Deposit` or `SentMessage` emitted for any caller.',
      '   - `unbounded`: state written only by privileged callers whose keys cannot be enumerated from events, getters or literals, or which grows with every batch or block the operator posts. Example: `committedBatches(uint256)`, one hash per batch committed by whitelisted sequencers, with no fixed key set to read; the events `CommitBatch` and `FinalizeBatch`, one per batch.',
      '   - `covered`: the value is already produced by another field or by a value in section 4. Example: `owners(uint256)` next to a `getOwners()` baseline getter; `OwnershipTransferred` next to the `owner` baseline getter; the proxy events `Upgraded`, `AdminChanged` and `BeaconUpgraded`, whose state the proxy values hold. An item answered by a field belongs in that field’s `covers`, not here.',
      '   - `not-state`: interface checks, version strings and helpers that read no storage of interest. Example: `supportsInterface(bytes4)`, `getFunctionSelector(string)`; the `Initialized` event of an initializer.',
    ],
  },
  {
    title: 'Covers.',
    lines: [
      'A field covers only what it reads. A `call` or `array` field covers the function it calls on this contract; an `event` field covers the events its actions name and, by claim, the getters whose state it reproduces (`sequencers` covers `UpdateSequencer` and `isSequencer(address)`); a `storage`, `constructorArgs` or `hardcoded` field covers a getter only by claim. Every event a field reads is in the `covers` of exactly one field that reads it and is never skipped.',
    ],
  },
  {
    title: 'Enumeration source.',
    lines: [
      'To enumerate a mapping, prefer the events emitted by its privileged setters (functions guarded by `onlyOwner`, `onlyRole`, `onlyGovernor` or similar) and fold them with an `event` field: `add` + `remove` for membership, `add` alone for an append-only list, `set` for the latest value, `set` + `groupBy` for the latest value per key. Use `call` with literal `args` only when the keys are fixed in the source (enum values, constants); `array` with `length` when a length getter is in the baseline; `array` without `length` for an array that reverts past its end; `array` with `indices` for the keys of a getter with one unsigned integer argument: literal keys, or keys collected by an `event` field. When events announce the keys of such a getter (versions, ids) but the value per key is read best from the getter, list the keys with an `event` field (`add`, `select` the key) and read the getter for each with an `array` field whose `indices` references that field, e.g. `"indices": "{{ verifierVersions }}"`.',
    ],
  },
  {
    title: 'Event-only state.',
    lines: [
      'Some state is observable only through events emitted by privileged functions and has no getter: a list of reverted batches (`RevertBatch`), a history of verifier updates (`UpdateVerifier`), a sequence of upgrades. Give such state an `event` field that covers those events, named after the event’s subject in Solidity terms (the state variable the event announces, or the subject in lowerCamelCase such as `revertedBatches`). Never do this for user-activity events (deposits, withdrawals, messages, transfers) or for the routine per-batch commits and finalizations an operator emits continuously.',
    ],
  },
  {
    title: 'Privileged events.',
    lines: [
      'An event emitted only by functions guarded by an `only*` modifier (`onlyOwner`, `onlyRole(…)`, …), or only in the constructor, announces privileged state: never skip it as `user-activity` or `not-state`. Fold it into an event field (event-only state such as a list of reverted batches, named after its subject), or skip it as `covered` when a getter already exposes the state (e.g. `OwnershipTransferred` next to `owner()`).',
    ],
  },
  {
    title: 'Roles.',
    lines: [
      'For OpenZeppelin AccessControl (`hasRole(bytes32,address)`, `getRoleAdmin(bytes32)`, events `RoleGranted`/`RoleRevoked`/`RoleAdminChanged`) use one `accessControl` handler in a field named `accessControl` that covers whichever of these five are listed. Roles with a `*_ROLE()` getter are named automatically when the role is the keccak256 of the getter’s name; add `roleNames` only for the others (section 3). `getRoleMember(bytes32,uint256)` and `getRoleMemberCount(bytes32)` are skipped as `covered`: the field already lists the members.',
    ],
  },
  {
    title: 'References.',
    lines: [
      '`{{ name }}` refers only to a baseline field, a field of your draft, a locked field, or `{{ $.address }}`; never to proxy values (`$admin`, `$implementation`, …), and never in a cycle. Section 3 lists the keys that accept references.',
    ],
  },
  {
    title: 'Literals.',
    lines: [
      'In a `where`, an address literal is chain-prefixed and checksummed exactly as section 4 shows addresses (`eth:0x…`), because log values are chain-prefixed before the comparison; a bare `0x…` never matches. In call `args`, an address is plain `0x…`. Integers are JSON numbers, or decimal strings above 2^53.',
    ],
  },
  {
    title: 'Reason.',
    lines: [
      '`reason` is one sentence naming the writer function and its modifier (e.g. "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer").',
    ],
  },
  {
    title: 'User activity is never fetched.',
    lines: [
      'Balances, deposits, withdrawals, per-user nonces, message or operation status by hash, queue contents: skip them as `user-activity` even when an event would let you enumerate them. Every address a field holds is analysed next as part of this system. A field that lists instances rather than parts of the system (every token a factory deployed, every game or pool created) adds `"ignoreRelative": true` to its handler; the dry run questions a field that would make discovery follow more than 20 addresses without it.',
    ],
  },
  {
    title: 'Only the draft.',
    lines: [
      'Write `fields` and `skips` and nothing else. `ignoreMethods` is derived from your skips by the tooling (a skipped probed function is no longer probed at indices 0–4); never write it, nor descriptions, severities, `copy` or any other template key.',
    ],
  },
]

const LOCKED_RULE: Rule = {
  title: 'Locked fields.',
  lines: [
    'Section 4 lists fields kept verbatim from the previous template of this contract. They are read-only and already part of the template: do not redefine them or reuse their names, and do not rule on what they cover, because those items are not on the worklist. You may reference them as `{{ name }}`.',
  ],
}

const OUTPUT_RULE: Rule = {
  title: 'Output.',
  lines: [
    'Reply with exactly one JSON object that matches the draft schema in section 2, and nothing else: no prose, no code fence, no comments.',
  ],
}

function renderSchemaAndExample(): string {
  return [
    SECTION_HEADERS.schema,
    '',
    'The draft must validate against this JSON schema. Each `handler` must match the one definition its `type` selects (for `event`: `eventSetHandler` when it has `set`, else `eventAddRemoveHandler`). `edit` and `where` are open here; the rules and section 3 restrict them.',
    '',
    '```json',
    JSON.stringify(draftJsonSchema(), null, 2),
    '```',
    '',
    WORKED_EXAMPLE_INTRO,
    '',
    '```json',
    JSON.stringify(WORKED_EXAMPLE, null, 2),
    '```',
    '',
  ].join('\n')
}

export const WORKED_EXAMPLE_INTRO =
  'A worked example, abbreviated: part of the draft for Morph’s `Rollup` (a contract outside this run). Challengers are a boolean mapping written only by owner-guarded setters that announce every change; the delay after which proposing becomes permissionless is shown formatted next to its getter; the skips show one item per kind of verdict. A real draft rules on every worklist function and event.'

/**
 * Morph's committed Rollup template (`_templates/morph/Rollup`) with the
 * verdicts a draft adds, cut to one example per idiom. It is deliberately
 * not a contract of the benchmark suite: a suite contract's answer in every
 * prompt would inflate exactly the fields the benchmark measures.
 */
export const WORKED_EXAMPLE: Draft = {
  fields: {
    challengers: {
      handler: {
        type: 'event',
        select: 'account',
        add: { event: 'UpdateChallenger', where: ['=', '#status', true] },
        remove: { event: 'UpdateChallenger', where: ['!=', '#status', true] },
      },
      covers: ['isChallenger(address)', 'UpdateChallenger'],
      reason:
        'isChallenger is written only by the owner-guarded challenger setters (onlyOwner), which emit UpdateChallenger with the new status',
    },
    rollupDelayPeriodFormatted: {
      handler: { type: 'call', method: 'rollupDelayPeriod', args: [] },
      edit: ['format', 'FormatSeconds'],
      covers: [],
      reason:
        'rollupDelayPeriod (set by the owner, announced by UpdateRollupDelayPeriod) is the censorship escape-hatch delay, shown in readable units',
    },
  },
  skips: [
    { item: 'committedBatches(uint256)', reason: 'unbounded' },
    { item: 'isBatchFinalized(uint256)', reason: 'computation' },
    { item: 'batchChallengeReward(address)', reason: 'user-activity' },
    { item: 'CommitBatch', reason: 'unbounded' },
    { item: 'UpdateRollupDelayPeriod', reason: 'covered' },
    { item: 'OwnershipTransferred', reason: 'covered' },
    { item: 'Upgraded', reason: 'covered' },
    { item: 'Initialized', reason: 'not-state' },
  ],
}

function renderHandlerDocs(): string {
  return [SECTION_HEADERS.handlers, '', HANDLER_DOCS, ''].join('\n')
}

function renderFacts(
  facts: ContractFacts,
  worklist: Worklist,
  locked: LockedFieldText[],
): string {
  return [
    SECTION_HEADERS.facts,
    '',
    '### Identity',
    '',
    ...renderIdentity(facts),
    '',
    '### ABI (proxy and implementations merged)',
    '',
    '```solidity',
    ...facts.abi,
    '```',
    '',
    ...renderBaseline(facts.baseline.fields),
    ...renderLocked(locked),
    ...renderWorklistItems(worklist.items),
    ...renderWorklistEvents(worklist.events, facts.abi),
  ].join('\n')
}

function renderIdentity(facts: ContractFacts): string[] {
  const lines = [
    `- Project: ${facts.project}`,
    `- Chain: ${facts.chain}`,
    `- Address: ${facts.address}`,
    `- Block: ${facts.blockNumber}`,
    `- Contract name: ${facts.name}`,
    `- Proxy type: ${facts.proxyType ?? 'none'}`,
  ]
  for (const [name, value] of Object.entries(facts.proxyValues)) {
    if (value !== undefined) {
      lines.push(
        `- Proxy value \`${name}\` (not referenceable): ${renderValue(value)}`,
      )
    }
  }
  for (const [address, name] of Object.entries(facts.implementationNames)) {
    lines.push(`- Implementation ${address}: ${name}`)
  }
  return lines
}

function renderBaseline(fields: Record<string, BaselineField>): string[] {
  const entries = Object.entries(fields)
  return [
    `### Baseline: values discovery already read (${entries.length})`,
    '',
    'Every 0-argument getter, and every view function with a single `uint256` argument probed at indices 0–4. Reference these as `{{ name }}`; never fetch them again, and never name a field like one of them, except an `array` field named like the probed getter it enumerates.',
    '',
    ...(entries.length === 0
      ? ['(none)']
      : entries.map(([name, field]) => renderBaselineField(name, field))),
    '',
  ]
}

function renderBaselineField(name: string, field: BaselineField): string {
  const probed = field.kind === 'probe' ? ' (probed at indices 0–4)' : ''
  return `- \`${name}\`${probed} = ${renderBaselineValue(field)}`
}

function renderBaselineValue(field: BaselineField): string {
  if (field.error !== undefined) {
    return `error: ${field.error}`
  }
  return renderValue(field.value as ContractValue)
}

function renderValue(value: ContractValue): string {
  const text = JSON.stringify(value)
  if (text.length <= VALUE_CHAR_CAP) {
    return text
  }
  return `${text.slice(0, VALUE_CHAR_CAP)}… [${text.length - VALUE_CHAR_CAP} more characters elided]`
}

/** Absent rather than empty when nothing is locked, so a first draft's prompt does not mention freezing at all. */
function renderLocked(locked: LockedFieldText[]): string[] {
  if (locked.length === 0) {
    return []
  }
  return [
    `### Locked fields (${locked.length})`,
    '',
    'Kept verbatim from the previous template of this contract, because they still run on this code. Read-only: do not redefine them and do not rule on what they cover; reference them as `{{ name }}` if useful.',
    '',
    ...locked.flatMap((field) => [
      '```jsonc',
      `${JSON.stringify(field.name)}: ${field.text}`,
      '```',
      '',
    ]),
  ]
}

function renderWorklistItems(items: WorklistItem[]): string[] {
  return [
    `### Worklist: functions needing a verdict (${items.length})`,
    '',
    '"(probed)": discovery reads it at indices 0–4 today; skipping it removes that probe, and an `array` field named like it replaces the probe.',
    '',
    ...(items.length === 0 ? ['(none)'] : items.map(renderWorklistItem)),
    '',
  ]
}

function renderWorklistItem(item: WorklistItem): string {
  const probed = item.probed ? ' (probed)' : ''
  return `- \`${item.signature}\`: ${item.fragment}${probed}`
}

function renderWorklistEvents(
  events: WorklistEvent[],
  abi: readonly string[],
): string[] {
  return [
    `### Events needing a verdict (${events.length})`,
    '',
    ...(events.length === 0
      ? ['(none declared)']
      : events.map((event) => renderWorklistEvent(event, abi))),
    '',
  ]
}

/**
 * The worklist keeps one entry per event name because V1 resolves events by
 * name; an overload is flagged so the model knows the bare name reads only
 * the declaration shown and another one needs its full fragment.
 */
function renderWorklistEvent(
  event: WorklistEvent,
  abi: readonly string[],
): string {
  const overloaded =
    countEventDeclarations(event.name, abi) > 1
      ? ' (overloaded: the bare name reads only this declaration; see the ABI for the others)'
      : ''
  return `- \`${event.name}\`: ${event.fragment}${overloaded}`
}

function countEventDeclarations(name: string, abi: readonly string[]): number {
  const prefix = `event ${name}(`
  return new Set(abi.filter((entry) => entry.startsWith(prefix))).size
}

/**
 * The proxy's own bundle first, because a reader orients on the entry
 * point; then every implementation in the analyzer's order. One shared
 * budget, so the total prompt size is bounded however many bundles there
 * are.
 */
function renderSources(
  facts: ContractFacts,
  cap: number,
): { text: string; truncated: boolean } {
  const lines = [SECTION_HEADERS.source, '']
  let budget = cap
  let truncated = false
  for (const source of proxyFirst(facts)) {
    const cut = cutToBudget(source.flattened, budget)
    budget -= cut.used
    truncated ||= cut.truncated
    lines.push(
      `### ${source.name} (${source.address})`,
      '',
      '```solidity',
      cut.text,
      '```',
      '',
    )
  }
  return { text: lines.join('\n'), truncated }
}

function proxyFirst(facts: ContractFacts): FlatSource[] {
  const isSelf = (source: FlatSource) =>
    source.address === facts.address ? 0 : 1
  return [...facts.sources].sort((a, b) => isSelf(a) - isSelf(b))
}

function cutToBudget(
  flattened: string,
  budget: number,
): { text: string; used: number; truncated: boolean } {
  if (flattened === '') {
    return {
      text: '// [UNAVAILABLE: this bundle could not be flattened]',
      used: 0,
      truncated: false,
    }
  }
  if (budget <= 0) {
    return {
      text: `${TRUNCATION_MARKER}: ${flattened.length} characters omitted; the source budget is exhausted]`,
      used: 0,
      truncated: true,
    }
  }
  if (flattened.length > budget) {
    return {
      text: `${flattened.slice(0, budget)}\n${TRUNCATION_MARKER}: ${flattened.length - budget} of ${flattened.length} characters omitted]`,
      used: budget,
      truncated: true,
    }
  }
  return { text: flattened, used: flattened.length, truncated: false }
}
