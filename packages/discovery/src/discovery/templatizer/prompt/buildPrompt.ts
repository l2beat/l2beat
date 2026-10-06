/**
 * The authoring prompt: everything the model needs to write the part of a
 * template one contract needs.
 *
 * The prompt is a pure function of the facts, the worklist and the
 * existing template, in a fixed section order, so two runs over the same
 * contract send byte-identical prompts and any difference between drafts is
 * the model's alone. Section 1 says what is checked (little: parsing,
 * discovery's schema, that nothing the template has is replaced, and the
 * fields run at the block) and then gives the guidance researchers'
 * practice has produced; the wording of the research prompt's rules, tuned
 * over several benchmark runs, is kept where it still applies.
 *
 * The flattened source is last and is the only part that is cut: a draft is
 * decided from the ABI, the baseline and the worklist, and the source is
 * evidence for which setter writes which mapping. A cut source is flagged
 * so the caller can record that the model worked from partial evidence.
 */
import type { StructureContract } from '../../config/StructureConfig'
import type { ContractValue } from '../../output/types'
import { AbiIndex } from '../abi/AbiIndex'
import type { FailingField } from '../existingTemplate'
import {
  type BaselineField,
  type ContractFacts,
  type FlatSource,
  PROBE_RANGE,
} from '../facts'
import type {
  Worklist,
  WorklistConstructor,
  WorklistEvent,
  WorklistItem,
} from '../worklist'
import { draftJsonSchema } from './draftJsonSchema'
import { HANDLER_DOCS } from './handlerDocs'
import {
  editOperatorsOf,
  type ReadmeIndex,
  readmeReferenceFor,
} from './readmeSections'

/** The template of this contract when it exists already and is being added to. */
export interface ExistingTemplateText {
  templateId: string
  /** `template.jsonc` as it is, comments included. */
  text: string
  /** Parsed, to know which README sections its handlers and edits need. */
  template: StructureContract
  /** Its fields that error at this block on this contract. */
  failing: FailingField[]
}

export interface PromptInput {
  facts: ContractFacts
  worklist: Worklist
  existing?: ExistingTemplateText
}

export interface PromptOptions {
  /** Total characters of flattened source across all bundles. */
  sourceCharCap?: number
  /** The parsed README; tests pass one, a run reads the package's. */
  readme?: ReadmeIndex
}

export interface AuthoringPrompt {
  prompt: string
  /** True when the source did not fit `sourceCharCap`. */
  truncated: boolean
}

export const DEFAULT_SOURCE_CHAR_CAP = 400_000

export const SECTION_HEADERS = {
  rules: '## 1. Role and rules',
  schema: '## 2. Reply shape and worked example',
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
  const source = renderSources(
    input.facts,
    options.sourceCharCap ?? DEFAULT_SOURCE_CHAR_CAP,
  )
  const prompt = [
    '# Discovery template fields for one contract',
    '',
    renderRules(input.existing !== undefined),
    renderSchemaAndExample(),
    renderHandlerDocs(input.existing, options.readme),
    renderFacts(input.facts, input.worklist, input.existing),
    source.text,
  ].join('\n')
  return { prompt, truncated: source.truncated }
}

interface Rule {
  title: string
  lines: string[]
}

function renderRules(hasExisting: boolean): string {
  const rules = [...RULES, ...(hasExisting ? [EXISTING_RULE] : [])]
  return [
    SECTION_HEADERS.rules,
    '',
    `You write the fields a discovery template (\`template.jsonc\`) needs for one smart contract. Discovery reads the contract at one block: every 0-argument getter has already been read, and every view function with a single \`uint256\` argument has been probed at indices ${PROBE_RANGE}; their values are the baseline in section 4. What discovery cannot read without being told how is the state behind view functions that take other arguments (mappings, role tables, whole arrays) and the state that only events reveal. Add a field for each such piece of state, each with one handler that reads it. The worklist in section 4 lists every function and event discovery does not read by itself, and the constructor when it has parameters: go through all of it, though most items need no field. You decide *what* to read and *from where*; you never transform data yourself beyond the two \`edit\` forms.`,
    '',
    'What is checked: your reply parses as one JSON object of the shape in section 2, discovery’s own schema accepts it, it replaces nothing the template or the baseline already has, and every field you add is run at the block in section 4. Errors come back to you to repair, verbatim. Everything else below is guidance from how researchers write templates; follow it, and where this contract calls for something else, use your judgment: the template is reviewed by a researcher before it is committed.',
    '',
    ...[...rules, OUTPUT_RULE].flatMap(renderRule),
    '',
  ].join('\n')
}

function renderRule(rule: Rule, index: number): string[] {
  const [first, ...rest] = rule.lines
  return [`${index + 1}. **${rule.title}** ${first}`, ...rest]
}

const RULES: Rule[] = [
  {
    title: 'Shape.',
    lines: [
      'Reply with `fields` and nothing else at the top level, and give each field exactly a `handler`, optionally an `edit`, and a `reason`. Use only the seven handler types of section 3 (`call`, `array`, `event`, `accessControl`, `storage`, `constructorArgs`, `hardcoded`), each with only the keys documented for it. `edit` and an event `where` are small programs; the forms researchers use are `["format", "FormatSeconds"]` and `["get", key, …]` for `edit`, and `["=", "#arg", literal]` or `["!=", "#arg", literal]` for `where` (section 3). Do not describe transformations in prose; if no handler fits, leave the item out. `ignoreMethods`, descriptions, severities, permissions and every other template key are the researcher’s to write.',
    ],
  },
  {
    title: 'Name.',
    lines: [
      'A field name is a Solidity identifier naming the state the field holds: the getter or mapping it reads (`committedBatches`), the members of a boolean membership mapping (`sequencers` for `isSequencer(address)`), or, for event-only state, the event’s subject in lowerCamelCase (`revertedBatches` for `RevertBatch`). An `accessControl` field is named `accessControl` and a `constructorArgs` field `constructorArgs`. Never give a field the name of a baseline value: a field of that name replaces the value. The one exception is an `array` field named exactly like the probed single-`uint256` getter it enumerates, which replaces the probe with the whole array. Names never start with `$`.',
    ],
  },
  {
    title: 'Place.',
    lines: [
      'Read this contract. Use `address` only when a baseline field or another field holds the address of another contract whose state belongs to this one (e.g. `"address": "{{ registry }}"`), and then give `method` as a full `function …` fragment.',
    ],
  },
  {
    title: 'What to read.',
    lines: [
      'Go through every worklist function, the constructor when it is listed, and every event listed in section 4, and add a field for each piece of privileged state that no baseline value shows. Several fields may read one item, for example `call` fields with different literal `args`, or `event` fields that read different parts of one event. Leave the rest out; these need no field, and they apply to events too:',
      '   - A computation: a pure function of its inputs, or derivable from values already fetched. Example: `isBatchFinalized(uint256)` is `batchIndex <= lastFinalizedBatchIndex`, a baseline getter; `hashOperation(address,uint256,bytes,bytes32,bytes32)` hashes its arguments.',
      '   - User activity: per-user, per-message or per-operation state written through unprivileged calls, even when an event would let you enumerate it. Example: `balanceOf(address)`, `isMessageDropped(bytes32)`, `getTimestamp(bytes32)` for operations anyone can schedule; events such as `Transfer`, `Deposit` or `SentMessage` emitted for any caller.',
      '   - Unbounded state: written only by privileged callers, but with keys that cannot be enumerated from events, getters or literals, or growing with every batch or block the operator posts. Example: `committedBatches(uint256)`, one hash per batch committed by whitelisted sequencers, with no fixed key set to read; the events `CommitBatch` and `FinalizeBatch`, one per batch.',
      '   - State already shown: by another field or by a value in section 4. Example: `owners(uint256)` next to a `getOwners()` baseline getter; `OwnershipTransferred` next to the `owner` baseline getter; the proxy events `Upgraded`, `AdminChanged` and `BeaconUpgraded`, whose state the proxy values hold.',
      '   - Not state: interface checks, version strings and helpers that read no storage of interest. Example: `supportsInterface(bytes4)`, `getFunctionSelector(string)`; the `Initialized` event of an initializer.',
    ],
  },
  {
    title: 'Enumeration source.',
    lines: [
      'To enumerate a mapping, prefer the events emitted by its privileged setters (functions guarded by `onlyOwner`, `onlyRole`, `onlyGovernor` or similar) and fold them with an `event` field: `add` + `remove` for membership, `add` alone for an append-only list, `set` for the latest value, `set` + `groupBy` for the latest value per key. Use `call` with literal `args`, one field per key, only when the keys are fixed in the source (enum values, constants), which is also how a getter keyed by a `uint8` is read, since `array` takes no `uint8` key; `array` with `length` when a length getter is in the baseline; `array` without `length` for an array that reverts past its end; `array` with `indices` for the keys of a getter with one unsigned integer argument: literal keys, or keys collected by an `event` field. When events announce the keys of such a getter (versions, ids) but the value per key is read best from the getter, list the keys with an `event` field (`add`, `select` the key) and read the getter for each with an `array` field whose `indices` references that field, e.g. `"indices": "{{ verifierVersions }}"`.',
    ],
  },
  {
    title: 'Event-only state.',
    lines: [
      'Some state is observable only through events emitted by privileged functions and has no getter: a list of reverted batches (`RevertBatch`), a history of verifier updates (`UpdateVerifier`), a sequence of upgrades. Give such state an `event` field that reads those events, named after the event’s subject in Solidity terms (the state variable the event announces, or the subject in lowerCamelCase such as `revertedBatches`). Never do this for user-activity events (deposits, withdrawals, messages, transfers) or for the routine per-batch commits and finalizations an operator emits continuously.',
    ],
  },
  {
    title: 'Privileged events.',
    lines: [
      'An event emitted only by functions guarded by an `only*` modifier (`onlyOwner`, `onlyRole(…)`, …), or only in the constructor, announces privileged state: it is never user activity or "not state". Fold it into an event field (event-only state such as a list of reverted batches, named after its subject), or leave it out when a getter already shows the state (e.g. `OwnershipTransferred` next to `owner()`).',
    ],
  },
  {
    title: 'Roles.',
    lines: [
      'For OpenZeppelin AccessControl (`hasRole(bytes32,address)`, `getRoleAdmin(bytes32)`, events `RoleGranted`/`RoleRevoked`/`RoleAdminChanged`) use one `accessControl` handler in a field named `accessControl`, which reads all five. Roles with a `*_ROLE()` getter are named automatically when the role is the keccak256 of the getter’s name; add `roleNames` only for the others (section 3). `getRoleMember(bytes32,uint256)` and `getRoleMemberCount(bytes32)` need no field: the `accessControl` field already lists the members.',
    ],
  },
  {
    title: 'References.',
    lines: [
      '`{{ name }}` refers only to a baseline field, a field you add, a field of the existing template that has a `handler`, or `{{ $.address }}`; never to proxy values (`$admin`, `$implementation`, …), and never in a cycle. Section 3 lists the keys that accept references.',
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
      '`reason` is one sentence naming the writer function and its modifier (e.g. "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer"). It is written into the template as a comment above the field, for the reviewer.',
    ],
  },
  {
    title: 'User activity is never fetched.',
    lines: [
      'Balances, deposits, withdrawals, per-user nonces, message or operation status by hash, queue contents: leave them out even when an event would let you enumerate them. Every address a field holds is analysed next as part of this system. A field that lists instances rather than parts of the system (every token a factory deployed, every game or pool created) adds `"ignoreRelative": true` to its handler; a field that would make discovery follow more than 20 addresses without it is noted for the reviewer.',
    ],
  },
]

const EXISTING_RULE: Rule = {
  title: 'Existing template.',
  lines: [
    'Section 4 shows the template this contract already has, verbatim. It stays exactly as it is and your fields are added to it: do not repeat its fields or reuse their names. You may reference those that have a `handler` as `{{ name }}`; a field with only `copy` gets its value after every handler has run. Read what they do not: worklist items no existing field reads, and more state of an item they read only in part. When the template already reads everything worth reading, reply with `{ "fields": {} }`.',
  ],
}

const OUTPUT_RULE: Rule = {
  title: 'Output.',
  lines: [
    'Reply with exactly one JSON object of the shape in section 2, and nothing else: no prose, no code fence, no comments.',
  ],
}

function renderSchemaAndExample(): string {
  return [
    SECTION_HEADERS.schema,
    '',
    'The reply must validate against this JSON schema: discovery’s own definition of a template field, cut to the keys you write. Each `handler` must match the one definition its `type` names (for `event`, the form with `set` or the form with `add`). `edit` and `where` are open here; the rules and section 3 restrict them.',
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
    WORKED_EXAMPLE_OUTRO,
    '',
  ].join('\n')
}

export const WORKED_EXAMPLE_INTRO =
  'A worked example, abbreviated: part of the reply for Morph’s `Rollup` (a contract outside this run). Challengers are a boolean mapping written only by owner-guarded setters that announce every change; the delay after which proposing becomes permissionless is shown formatted next to its getter.'

export const WORKED_EXAMPLE_OUTRO =
  'The rest of its worklist needs no field: `committedBatches(uint256)` and the `CommitBatch` event grow with every batch, `isBatchFinalized(uint256)` is computed from the `lastFinalizedBatchIndex` getter, `batchChallengeReward(address)` is per user, `UpdateRollupDelayPeriod` and `OwnershipTransferred` announce what getters show and `Upgraded` what the proxy values show, and `Initialized` is no state.'

/**
 * Morph's committed Rollup template (`_templates/morph/Rollup`), cut to one
 * example per idiom. It is deliberately not a contract of the benchmark
 * suite: a suite contract's answer in every prompt would inflate exactly
 * the fields the benchmark measures.
 */
export const WORKED_EXAMPLE = {
  fields: {
    challengers: {
      reason:
        'isChallenger is written only by the owner-guarded challenger setters (onlyOwner), which emit UpdateChallenger with the new status',
      handler: {
        type: 'event',
        select: 'account',
        add: { event: 'UpdateChallenger', where: ['=', '#status', true] },
        remove: { event: 'UpdateChallenger', where: ['!=', '#status', true] },
      },
    },
    rollupDelayPeriodFormatted: {
      reason:
        'rollupDelayPeriod (set by the owner, announced by UpdateRollupDelayPeriod) is the censorship escape-hatch delay, shown in readable units',
      handler: { type: 'call', method: 'rollupDelayPeriod', args: [] },
      edit: ['format', 'FormatSeconds'],
    },
  },
}

function renderHandlerDocs(
  existing: ExistingTemplateText | undefined,
  readme: ReadmeIndex | undefined,
): string {
  return [
    SECTION_HEADERS.handlers,
    '',
    HANDLER_DOCS,
    '',
    ...renderReadmeReference(existing, readme),
  ].join('\n')
}

/**
 * Only when the existing fields use a handler type or an edit operator the
 * condensed reference leaves out, so the prompt for a template of generic
 * fields is unchanged: the model has no tools to look these up, and it
 * must know what an existing field does to tell what the template still
 * misses.
 */
function renderReadmeReference(
  existing: ExistingTemplateText | undefined,
  readme: ReadmeIndex | undefined,
): string[] {
  const fields = Object.values(existing?.template.fields ?? {})
  const sections = readmeReferenceFor(
    fields.flatMap((field) =>
      field.handler === undefined ? [] : [field.handler.type],
    ),
    fields.flatMap((field) => editOperatorsOf(field.edit)),
    readme,
  )
  if (sections.length === 0) {
    return []
  }
  return [
    README_REFERENCE_HEADER,
    '',
    'The existing fields in section 4 use handlers or edit operators beyond the seven types above. They stay as they are; this is what they do, from the discovery README, so that you can tell what state the template already holds and reference their values.',
    '',
    ...sections.flatMap((section) => [section, '']),
  ]
}

export const README_REFERENCE_HEADER =
  '### Reference for handlers and edits used by existing fields'

function renderFacts(
  facts: ContractFacts,
  worklist: Worklist,
  existing: ExistingTemplateText | undefined,
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
    ...renderExisting(existing, facts.blockNumber),
    ...renderWorklistItems(worklist.items),
    ...renderWorklistConstructor(worklist.constructorItem),
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
    `Every 0-argument getter, and every view function with a single \`uint256\` argument probed at indices ${PROBE_RANGE}. Reference these as \`{{ name }}\`, except one shown as an error alone or as no value, which has none; never fetch them again, and never name a field like one of them, except an \`array\` field named like the probed getter it enumerates.`,
    '',
    ...(entries.length === 0
      ? ['(none)']
      : entries.map(([name, field]) => renderBaselineField(name, field))),
    '',
  ]
}

function renderBaselineField(name: string, field: BaselineField): string {
  const origin =
    field.kind === 'probe'
      ? ` (probed at indices ${PROBE_RANGE})`
      : field.kind === 'override'
        ? ' (from the project config)'
        : ''
  return `- \`${name}\`${origin} = ${renderBaselineValue(field)}`
}

/**
 * A value and an error together come from a probe whose every index
 * answered: V1 keeps the values and says there may be more.
 */
function renderBaselineValue(field: BaselineField): string {
  if (field.error === undefined) {
    return field.value === undefined
      ? 'no value at this block'
      : renderValue(field.value)
  }
  if (field.value === undefined) {
    return `error: ${field.error}`
  }
  return `${renderValue(field.value)} (error: ${field.error})`
}

function renderValue(value: ContractValue): string {
  const text = JSON.stringify(value)
  if (text.length <= VALUE_CHAR_CAP) {
    return text
  }
  return `${text.slice(0, VALUE_CHAR_CAP)}… [${text.length - VALUE_CHAR_CAP} more characters elided]`
}

/** Absent for a new template, so its prompt does not mention an existing one at all. */
function renderExisting(
  existing: ExistingTemplateText | undefined,
  blockNumber: number,
): string[] {
  if (existing === undefined) {
    return []
  }
  const failing = existing.failing.map(
    (field) =>
      `- \`${field.name}\` fails at block ${blockNumber}: ${field.error}`,
  )
  return [
    `### The template this contract already has (\`${existing.templateId}\`)`,
    '',
    'Kept exactly as it is; your fields are added to it. Reference its fields that have a `handler` as `{{ name }}` if useful.',
    '',
    '```jsonc',
    existing.text.trimEnd(),
    '```',
    '',
    ...(failing.length === 0
      ? []
      : [
          'These of its fields fail on this contract at this block; they are kept too:',
          '',
          ...failing,
          '',
        ]),
  ]
}

function renderWorklistItems(items: WorklistItem[]): string[] {
  return [
    `### Worklist: functions discovery does not read by itself (${items.length})`,
    '',
    `"(probed)": discovery reads it at indices ${PROBE_RANGE} today; an \`array\` field named like it replaces the probe with the whole array.`,
    '',
    ...(items.length === 0 ? ['(none)'] : items.map(renderWorklistItem)),
    '',
  ]
}

function renderWorklistItem(item: WorklistItem): string {
  const probed = item.probed ? ' (probed)' : ''
  return `- \`${item.signature}\`: ${item.fragment}${probed}`
}

/** Absent when the constructor has no parameters: nothing to decode. */
function renderWorklistConstructor(
  item: WorklistConstructor | undefined,
): string[] {
  if (item === undefined) {
    return []
  }
  return [
    '### Constructor',
    '',
    `- \`${item.signature}\`: ${item.fragment}`,
    '',
    'Only a `constructorArgs` field reads it: the arguments of this address’s deployment, decoded with this constructor (for a proxy, the proxy’s own constructor). Add that field when the arguments set state a reviewer would look at and no getter or proxy value already shows it.',
    '',
  ]
}

function renderWorklistEvents(
  events: WorklistEvent[],
  abi: readonly string[],
): string[] {
  return [
    `### Events (${events.length})`,
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
    AbiIndex.of(abi).eventDeclarations(event.name).length > 1
      ? ' (overloaded: the bare name reads only this declaration; see the ABI for the others)'
      : ''
  return `- \`${event.name}\`: ${event.fragment}${overloaded}`
}

/**
 * The proxy's own bundle first, because a reader orients on the entry
 * point; then every implementation in discovery's order. One shared
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
