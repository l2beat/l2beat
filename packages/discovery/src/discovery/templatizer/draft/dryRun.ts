/**
 * The draft runs for real before it is accepted.
 *
 * The validator proves a draft is well-formed; only execution proves it
 * reads something. The run goes through V1's own `HandlerExecutor` with the
 * analyzer's own config for the address (the project and global `types`,
 * the override from `config.jsonc`) plus the template the file will hold,
 * so a draft that passes here yields the same values once written, and a
 * draft that fails here failed for the reason V1 gives.
 *
 * A field that errors is a finding for the next repair round, because the
 * model can usually fix it (a method that reverts, a wrong argument, an
 * edit that does not fit the value). Everything else the run observed that
 * a reviewer should know (an empty fold, which function a bare name read,
 * how many addresses discovery will follow, logs under another declaration
 * of the event) is a note, written above the field in the template. None
 * of it blocks: logs cannot tell "nothing happened yet" from "the wrong
 * events", and a count of addresses says nothing certain about what they
 * are.
 */
import { getErrorMessage } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { StructureContract } from '../../config/StructureConfig'
import {
  type StructureContractConfig,
  withTemplate,
} from '../../config/structureUtils'
import type { HandlerResult } from '../../handlers/Handler'
import type { HandlerExecutor } from '../../handlers/HandlerExecutor'
import { getEventFragment } from '../../handlers/utils/getEventFragment'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { toAddressArray } from '../../utils/extractors'
import { AbiIndex } from '../abi/AbiIndex'
import type { ContractFacts } from '../facts'
import {
  type Draft,
  type DraftField,
  eventActions,
  eventNamesOf,
} from './Draft'
import { type Finding, Findings, fieldPath } from './Finding'

export interface FieldRun {
  name: string
  /** Items of an array, keys of an object, `empty` when there is no value. */
  size: number | 'scalar' | 'empty' | 'error'
  error?: string
  /** What the run observed that the reviewer should check; written above the field, never a finding. */
  notes: string[]
}

export interface DryRunRecord {
  blockNumber: number
  fields: FieldRun[]
}

export interface DryRunOptions {
  /** The analyzer's config for the address before any template. */
  config: StructureContractConfig
  /**
   * What the template file will hold besides the draft's fields: an
   * existing template as it is (its fields run too, so references resolve
   * and the model's additions are judged next to them), or the
   * `ignoreMethods` a new template gets.
   */
  base?: StructureContract
}

type Facts = Pick<ContractFacts, 'address' | 'abi'>

interface FieldValues {
  values: Record<string, ContractValue | undefined>
  errors: Record<string, string>
  /** The raw results, which carry the fragment a method handler resolved to. */
  results: HandlerResult[]
}

/** A run that failed as a whole: `execute` threw before any field had a value. */
interface RunFailure {
  failure: string
}

/**
 * Runs a template exactly as the analyzer would for this address, at the
 * provider's block: `config` with `template` pushed, through
 * `HandlerExecutor`. Never throws for a handler/edit failure: that becomes
 * the field's error. A failure of the run as a whole is given to every
 * field of the template, since none of them is proven.
 */
export async function runTemplateFields(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  abi: string[],
  config: StructureContractConfig,
  template: StructureContract,
): Promise<FieldValues> {
  const run = await runOrFail(
    provider,
    handlerExecutor,
    abi,
    withTemplate(config, template),
  )
  if ('failure' in run) {
    return {
      values: {},
      errors: sameErrorForAll(template, run.failure),
      results: [],
    }
  }
  return run
}

/** The dry run of a draft. Findings and notes are for draft fields only, never the base's. */
export async function dryRunDraft(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  facts: ContractFacts,
  draft: Draft,
  options: DryRunOptions,
): Promise<{ record: DryRunRecord; findings: Finding[] }> {
  const blockNumber = provider.blockNumber
  const template = draftTemplate(draft, options.base)
  if ('failure' in template) {
    return failedDryRun(blockNumber, draft, template.failure)
  }
  const run = await runOrFail(
    provider,
    handlerExecutor,
    facts.abi,
    withTemplate(options.config, template),
  )
  if ('failure' in run) {
    return failedDryRun(blockNumber, draft, run.failure)
  }
  const findings = new Findings()
  const fields: FieldRun[] = []
  for (const [name, field] of Object.entries(draft.fields)) {
    fields.push(await checkField(provider, facts, name, field, run, findings))
  }
  return { record: { blockNumber, fields }, findings: findings.list }
}

/** The template the file will hold: the base as it is, plus the draft's fields. */
function draftTemplate(
  draft: Draft,
  base: StructureContract | undefined,
): StructureContract | RunFailure {
  try {
    return StructureContract.parse({
      ...base,
      fields: { ...base?.fields, ...draftTemplateFields(draft) },
    })
  } catch (error) {
    return {
      failure: `the draft is not a valid V1 template: ${getErrorMessage(error)}`,
    }
  }
}

/** What the template file will hold for each field: handler and edit only. */
function draftTemplateFields(draft: Draft): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(draft.fields).map(([name, field]) => [
      name,
      field.edit === undefined
        ? { handler: field.handler }
        : { handler: field.handler, edit: field.edit },
    ]),
  )
}

/**
 * `execute` throws as a whole, before any field has a value, when a
 * `{{ reference }}` never resolves (V1 cannot order the handlers) or when
 * an `edit` throws (edits run after all handlers, unguarded). V1's message
 * names what it can; the finding passes it on and says what usually causes
 * it, without guessing which field.
 */
function failedDryRun(
  blockNumber: number,
  draft: Draft,
  failure: string,
): { record: DryRunRecord; findings: Finding[] } {
  const findings = new Findings()
  findings.error(
    'draft',
    `dry run at block ${blockNumber} failed as a whole: ${failure}; this is usually a {{ reference }} to a name no field or getter has, a reference cycle, or an edit that does not fit its value: fix the fields involved or skip their items`,
  )
  const fields = Object.keys(draft.fields).map(
    (name): FieldRun => ({ name, size: 'error', error: failure, notes: [] }),
  )
  return { record: { blockNumber, fields }, findings: findings.list }
}

/** The field's error as a finding, or what the run observed as notes. */
async function checkField(
  provider: IProvider,
  facts: Facts,
  name: string,
  field: DraftField,
  run: FieldValues,
  findings: Findings,
): Promise<FieldRun> {
  const error = run.errors[name]
  if (error !== undefined) {
    findings.error(
      fieldPath(name),
      `dry run at block ${provider.blockNumber} failed: ${error}; fix the handler or skip the item`,
    )
    return { name, size: 'error', error, notes: [] }
  }
  const value = run.values[name]
  const notes = [
    ...resolvedMethodNote(name, field, run.results),
    ...followedAddressesNote(field, value),
    ...(await foldNotes(provider, facts, field, value)),
  ]
  return { name, size: sizeOf(value), notes }
}

/**
 * V1 resolves a bare `method` by prefix, so `owner` with one argument can
 * read `owners(uint256)`. The handler's result carries the fragment it
 * read; when its name is not the name the model wrote, the reviewer
 * should see which function the field reads.
 */
function resolvedMethodNote(
  name: string,
  field: DraftField,
  results: HandlerResult[],
): string[] {
  if (field.handler.type !== 'call' && field.handler.type !== 'array') {
    return []
  }
  const method =
    typeof field.handler.method === 'string' ? field.handler.method : name
  if (method.startsWith('function ')) {
    return []
  }
  const fragment = results.find((result) => result.field === name)?.fragment
  if (fragment === undefined || fragment.name === method) {
    return []
  }
  return [`reads ${fragment.format(utils.FormatTypes.full)}`]
}

/**
 * Every address in a field's value becomes a relative that discovery
 * analyses next, unless the handler says `ignoreRelative`. A field listing
 * instances rather than parts of the system (every token a factory
 * deployed) turned a 96-contract scroll run into one that hit
 * `maxAddresses` and dropped 41 addresses. Twenty is above any committee
 * or verifier set the suite has, but a count says nothing certain about
 * what the addresses are, so going over it is a note.
 */
export const MAX_FOLLOWED_ADDRESSES = 20

/** Counted as discovery collects relatives (`toAddressArray`): values only, never the keys of an object. */
function followedAddressesNote(
  field: DraftField,
  value: ContractValue | undefined,
): string[] {
  if (field.handler.ignoreRelative === true || value === undefined) {
    return []
  }
  const count = new Set(toAddressArray(value)).size
  if (count <= MAX_FOLLOWED_ADDRESSES) {
    return []
  }
  return [
    `holds ${count} addresses discovery will follow as parts of this system; if they are instances (deployed tokens, created games or pools, users), add "ignoreRelative": true to the handler`,
  ]
}

/**
 * An empty fold is a note for the reviewer, never a finding, because logs
 * cannot tell "nothing happened yet" from "this state was written without
 * these events". It used to be an error whenever the field also claimed a
 * getter, and the model answered by dropping the field: 17 of 27 times in
 * the first benchmark, `blacklistedGames` and `tokenMapping` among them,
 * which the committed templates keep although they are empty. A dropped
 * field is invisible, and it is the one that would have announced the
 * first blacklisted game. The price is that a fold over the wrong events is
 * accepted as empty too (Plume's batch posters were set by an older
 * implementation that did not emit `BatchPosterSet`); the note is what
 * makes the reviewer check it. When another declaration of the same event
 * does have logs, the note says so whether or not the fold is empty:
 * ScrollChain's reverted batches sit under the legacy
 * `RevertBatch(batchIndex, batchHash)` although the current code emits
 * `RevertBatch(startBatchIndex, finishBatchIndex)`, and a contract that
 * reverted batches under both has a fold that is not empty but not whole.
 */
async function foldNotes(
  provider: IProvider,
  facts: Facts,
  field: DraftField,
  value: ContractValue | undefined,
): Promise<string[]> {
  if (field.handler.type !== 'event') {
    return []
  }
  const events = eventsOf(field)
  const blockNumber = provider.blockNumber
  const unread = await unreadDeclarationsWithLogs(provider, facts, events)
  if (unread.length > 0) {
    const others = unread
      .map((d) => `${d.fragment} (${d.logCount} log(s))`)
      .join(', ')
    if (isEmpty(value)) {
      return [
        `empty at block ${blockNumber}: no logs for ${events.join(', ')}, but another declaration of the same event has logs: ${others}; the contract most likely recorded this state under that declaration (older code), so read it too`,
      ]
    }
    const names = [...new Set(unread.map((d) => d.name))].join(', ')
    return [
      `another declaration of ${names} has logs too: ${others}; the field reads only the declaration it names, so part of this state was most likely recorded under that one (older code): read it too`,
    ]
  }
  if (!isEmpty(value)) {
    return []
  }
  const logCount = await countLogs(provider, facts, events)
  const names = events.join(', ')
  return [
    logCount === 0
      ? `empty at block ${blockNumber}: no logs yet for ${names}`
      : `empty at block ${blockNumber}: the ${logCount} logs for ${names} fold to nothing`,
  ]
}

interface UnreadDeclaration {
  name: string
  fragment: string
  logCount: number
}

/**
 * The declarations of the field's events that the field does not read are
 * counted for logs, one topic at a time as the event handler fetches them,
 * so a caching provider answers from the same entries.
 */
async function unreadDeclarationsWithLogs(
  provider: IProvider,
  facts: Facts,
  events: string[],
): Promise<UnreadDeclaration[]> {
  const read = new Set(events.map((event) => topicOf(event, facts.abi)))
  const names = new Set(events.map((event) => eventName(event, facts.abi)))
  const unread = [...names]
    .flatMap((name) => AbiIndex.of(facts.abi).eventDeclarations(name))
    .filter((fragment) => !read.has(utils.Interface.getEventTopic(fragment)))
  const counted = await Promise.all(
    unread.map(async (fragment) => ({
      name: fragment.name,
      fragment: fragment.format(utils.FormatTypes.full),
      logCount: await countTopicLogs(
        provider,
        facts,
        utils.Interface.getEventTopic(fragment),
      ),
    })),
  )
  return counted.filter((declaration) => declaration.logCount > 0)
}

/** The topic of the event the model's reference reads, resolved as V1 resolves it. */
function topicOf(event: string, abi: readonly string[]): string | undefined {
  try {
    return utils.Interface.getEventTopic(getEventFragment(event, [...abi]))
  } catch {
    return undefined
  }
}

function eventName(event: string, abi: readonly string[]): string {
  try {
    return getEventFragment(event, [...abi]).name
  } catch {
    return event
  }
}

async function countTopicLogs(
  provider: IProvider,
  facts: Facts,
  topic: string,
): Promise<number> {
  try {
    return (await provider.getLogs(facts.address, [topic])).length
  } catch {
    return 0
  }
}

function eventsOf(field: DraftField): string[] {
  const names = eventActions(field.handler).flatMap(({ action }) =>
    eventNamesOf(action),
  )
  return [...new Set(names)]
}

/** A count that cannot be taken reads as zero: the value is empty either way. */
async function countLogs(
  provider: IProvider,
  facts: Facts,
  events: string[],
): Promise<number> {
  try {
    const topics = new Set(
      events.map((event) =>
        utils.Interface.getEventTopic(getEventFragment(event, facts.abi)),
      ),
    )
    const logs = await Promise.all(
      [...topics].map((topic) => provider.getLogs(facts.address, [topic])),
    )
    return logs.flat().length
  } catch {
    return 0
  }
}

function sizeOf(value: ContractValue | undefined): FieldRun['size'] {
  if (value === undefined) {
    return 'empty'
  }
  if (Array.isArray(value)) {
    return value.length
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length
  }
  return 'scalar'
}

function isEmpty(value: ContractValue | undefined): boolean {
  const size = sizeOf(value)
  return size === 'empty' || size === 0
}

function sameErrorForAll(
  template: StructureContract,
  failure: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.keys(template.fields).map((name) => [name, failure]),
  )
}

async function runOrFail(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  abi: string[],
  config: StructureContractConfig,
): Promise<FieldValues | RunFailure> {
  try {
    const { values, errors, results } = await handlerExecutor.execute(
      provider,
      config.address,
      abi,
      config,
    )
    return { values: values ?? {}, errors, results }
  } catch (error) {
    return { failure: getErrorMessage(error) }
  }
}
