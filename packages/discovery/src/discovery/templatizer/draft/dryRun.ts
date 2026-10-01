/**
 * R10: the draft runs for real before it is accepted.
 *
 * The validator proves a draft is well-formed; only execution proves it
 * reads something. The run goes through V1's own `HandlerExecutor` with a
 * config built the way the analyzer builds one from a template, so a draft
 * that passes here yields the same values once written. Failures become
 * findings for the next repair round rather than exceptions, because the
 * model can usually fix them (a method that reverts, a wrong argument, an
 * edit that does not fit the value).
 */
import { getErrorMessage } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { StructureContract } from '../../config/StructureConfig'
import { makeEntryStructureConfig } from '../../config/structureUtils'
import { decodeHandlerResults } from '../../handlers/decodeHandlerResults'
import { getHandlers } from '../../handlers/getHandlers'
import type { Handler, HandlerResult } from '../../handlers/Handler'
import type { HandlerExecutor } from '../../handlers/HandlerExecutor'
import { getEventFragment } from '../../handlers/utils/getEventFragment'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
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
}

export interface DryRunRecord {
  blockNumber: number
  fields: FieldRun[]
}

export interface DryRunOptions {
  /** Fields kept from an older template; run too, so references resolve. */
  locked?: StructureContract['fields']
  /** As `deriveIgnoreMethods` gives them, so the run sees what V1 will. */
  ignoreMethods?: string[]
}

type Facts = Pick<ContractFacts, 'address' | 'abi'>

interface FieldValues {
  values: Record<string, ContractValue | undefined>
  errors: Record<string, string>
}

/** A run that failed as a whole and could not be pinned on any field. */
interface RunFailure {
  failure: string
}

/**
 * Runs template fields (handler + edit) exactly as the analyzer would, at
 * the provider's block. Never throws for a handler/edit failure: that
 * becomes the field's error. A failure that cannot be pinned on a field
 * is given to every field of the template, since none of them is proven.
 */
export async function runTemplateFields(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  facts: Facts,
  template: StructureContract,
): Promise<FieldValues> {
  const run = await runPinned(provider, handlerExecutor, facts, template)
  if ('failure' in run) {
    return { values: {}, errors: sameErrorForAll(template, run.failure) }
  }
  return run
}

/** R10 over a draft. Findings are for draft fields only, never locked ones. */
export async function dryRunDraft(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  facts: ContractFacts,
  draft: Draft,
  options: DryRunOptions = {},
): Promise<{ record: DryRunRecord; findings: Finding[] }> {
  const blockNumber = provider.blockNumber
  const template = draftTemplate(draft, options)
  if ('failure' in template) {
    return failedDryRun(blockNumber, draft, template.failure)
  }
  const run = await runPinned(provider, handlerExecutor, facts, template)
  if ('failure' in run) {
    return failedDryRun(blockNumber, draft, run.failure)
  }
  const findings = new Findings()
  for (const [name, field] of Object.entries(draft.fields)) {
    await checkField(provider, facts, name, field, run, findings)
  }
  return {
    record: { blockNumber, fields: fieldRuns(draft, run) },
    findings: findings.list,
  }
}

function draftTemplate(
  draft: Draft,
  options: DryRunOptions,
): StructureContract | RunFailure {
  try {
    return StructureContract.parse({
      ignoreMethods: options.ignoreMethods ?? [],
      fields: { ...options.locked, ...draftTemplateFields(draft) },
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

function failedDryRun(
  blockNumber: number,
  draft: Draft,
  failure: string,
): { record: DryRunRecord; findings: Finding[] } {
  const findings = new Findings()
  findings.error(
    'draft',
    `dry run at block ${blockNumber} failed as a whole: ${failure}; fix the fields involved or skip their items`,
  )
  const fields = Object.keys(draft.fields).map(
    (name): FieldRun => ({ name, size: 'error', error: failure }),
  )
  return { record: { blockNumber, fields }, findings: findings.list }
}

async function checkField(
  provider: IProvider,
  facts: Facts,
  name: string,
  field: DraftField,
  run: FieldValues,
  findings: Findings,
): Promise<void> {
  const path = fieldPath(name)
  const error = run.errors[name]
  if (error !== undefined) {
    findings.error(
      path,
      `dry run at block ${provider.blockNumber} failed: ${error}; fix the handler or skip the item`,
    )
    return
  }
  const followed = followedAddressCount(field, run.values[name])
  if (followed > MAX_FOLLOWED_ADDRESSES) {
    findings.list.push(tooManyRelativesFinding(path, followed))
  }
  if (field.handler.type === 'event' && isEmpty(run.values[name])) {
    const events = eventsOf(field)
    const unread = await unreadDeclarationsWithLogs(provider, facts, events)
    if (unread.length > 0) {
      findings.list.push(
        unreadDeclarationFinding(path, provider.blockNumber, events, unread),
      )
      return
    }
    const logCount = await countLogs(provider, facts, events)
    findings.list.push(
      emptyEventFinding(path, provider.blockNumber, events, field, logCount),
    )
  }
}

/**
 * Every address in a field's value becomes a relative that discovery
 * analyses next, unless the handler says `ignoreRelative`. A field listing
 * instances rather than parts of the system (every token a factory
 * deployed) turned a 96-contract scroll run into one that hit
 * `maxAddresses` and dropped 41 addresses. Twenty is above any committee
 * or verifier set the suite has.
 */
export const MAX_FOLLOWED_ADDRESSES = 20

const CHAIN_SPECIFIC_ADDRESS = /^[a-z0-9]+:0x[0-9a-fA-F]{40}$/

function followedAddressCount(
  field: DraftField,
  value: ContractValue | undefined,
): number {
  if (field.handler.ignoreRelative === true || value === undefined) {
    return 0
  }
  return new Set(addressesIn(value)).size
}

function addressesIn(value: ContractValue): string[] {
  if (typeof value === 'string') {
    return CHAIN_SPECIFIC_ADDRESS.test(value) ? [value] : []
  }
  if (Array.isArray(value)) {
    return value.flatMap(addressesIn)
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, entry]) => [
      ...addressesIn(key),
      ...(entry === undefined ? [] : addressesIn(entry)),
    ])
  }
  return []
}

function tooManyRelativesFinding(path: string, count: number): Finding {
  return {
    severity: 'error',
    path,
    message: `the value holds ${count} addresses and discovery would analyse every one of them as part of this system (more than ${MAX_FOLLOWED_ADDRESSES} is not allowed); when they are instances rather than parts of the system (deployed tokens, created games or pools, users), add \`"ignoreRelative": true\` to the handler; otherwise skip the item`,
  }
}

interface UnreadDeclaration {
  fragment: string
  logCount: number
}

/**
 * Contracts that changed an event's parameters across upgrades declare it
 * twice, and the merged ABI keeps both. A fold over one declaration that
 * comes back empty while the other has logs has read the wrong half of the
 * history: ScrollChain's reverted batches sit under the legacy
 * `RevertBatch(batchIndex, batchHash)` although the current code emits
 * `RevertBatch(startBatchIndex, finishBatchIndex)`. That is an error
 * whatever the field covers, because the state demonstrably exists.
 */
async function unreadDeclarationsWithLogs(
  provider: IProvider,
  facts: Facts,
  events: string[],
): Promise<UnreadDeclaration[]> {
  const read = new Set(events.map((event) => topicOf(event, facts.abi)))
  const unread = otherDeclarations(events, facts.abi).filter(
    (fragment) => !read.has(utils.Interface.getEventTopic(fragment)),
  )
  const counted = await Promise.all(
    unread.map(async (fragment) => ({
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

function otherDeclarations(
  events: string[],
  abi: readonly string[],
): utils.EventFragment[] {
  const names = new Set(events.map((event) => eventName(event, abi)))
  const declarations = [...new Set(abi)]
    .filter((entry) => [...names].some((n) => entry.startsWith(`event ${n}(`)))
    .map((entry) => utils.Fragment.from(entry) as utils.EventFragment)
  const seen = new Set<string>()
  return declarations.filter((fragment) => {
    const topic = utils.Interface.getEventTopic(fragment)
    const fresh = !seen.has(topic)
    seen.add(topic)
    return fresh
  })
}

function unreadDeclarationFinding(
  path: string,
  blockNumber: number,
  events: string[],
  unread: UnreadDeclaration[],
): Finding {
  const others = unread
    .map((d) => `\`${d.fragment}\` (${d.logCount} log(s))`)
    .join(', ')
  return {
    severity: 'error',
    path,
    message: `no logs for ${events.join(', ')} up to block ${blockNumber}, but another declaration of the same event has logs: ${others}; the contract recorded this state under that declaration, so read it too: in this field when its argument names fit the same select, otherwise in a second field named after the same subject`,
  }
}

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

/**
 * A fold over events nobody emitted is the truth for event-only state, but
 * for a field that claims to answer a getter it is more likely the wrong
 * event: the research benchmark accepted `isBatchPoster = []` that way
 * while the getter returned true for five addresses. So an empty event
 * field is an error when it covers a function and a warning when it covers
 * only events (which every event field does, to rule on what it reads).
 * The log count tells "the contract never emitted these" apart from "the
 * `where` or `remove` actions dropped every log", which need different
 * fixes.
 */
function emptyEventFinding(
  path: string,
  blockNumber: number,
  events: string[],
  field: DraftField,
  logCount: number,
): Finding {
  const names = events.join(', ')
  const observed =
    logCount === 0
      ? `no logs for events ${names} up to block ${blockNumber}`
      : `the ${logCount} logs for events ${names} up to block ${blockNumber} fold to nothing`
  const getters = field.covers.filter(isFunctionSignature)
  if (getters.length === 0) {
    const check =
      logCount === 0
        ? 'the event names'
        : 'the `where` conditions and the add/remove pairing'
    return {
      severity: 'warning',
      path,
      message: `${observed}; event-only state can truly be empty, but confirm ${check}`,
    }
  }
  const fix =
    logCount === 0
      ? 'find the events the setters actually emit (check the flattened source, including inherited contracts), enumerate another way, or skip the item'
      : 'check the `where` conditions (log addresses are chain-prefixed, so address literals must be too) and the add/remove pairing, enumerate another way, or skip the item'
  return {
    severity: 'error',
    path,
    message: `${observed}, yet the field covers ${field.covers.join(', ')}; ${fix}`,
  }
}

/** Worklist tokens: functions are `name(types)`, events are bare names. */
function isFunctionSignature(token: string): boolean {
  return token.includes('(')
}

function eventsOf(field: DraftField): string[] {
  const names = eventActions(field.handler).flatMap(({ action }) =>
    eventNamesOf(action),
  )
  return [...new Set(names)]
}

/**
 * The logs the event handler read, fetched the way it fetches them (one
 * topic at a time), so a caching provider answers from the same entries.
 * A count that cannot be taken reads as zero: the value is empty either way.
 */
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

function fieldRuns(draft: Draft, run: FieldValues): FieldRun[] {
  return Object.keys(draft.fields).map((name) => {
    const error = run.errors[name]
    return error === undefined
      ? { name, size: sizeOf(run.values[name]) }
      : { name, size: 'error', error }
  })
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

async function runPinned(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  facts: Facts,
  template: StructureContract,
): Promise<FieldValues | RunFailure> {
  try {
    const { values, errors } = await handlerExecutor.execute(
      provider,
      facts.address,
      facts.abi,
      configFor(facts, template),
    )
    return { values: values ?? {}, errors }
  } catch (error) {
    return await pinFailure(
      provider,
      handlerExecutor,
      facts,
      template,
      getErrorMessage(error),
    )
  }
}

/** The config the analyzer builds for an address its template matched. */
function configFor(facts: Facts, template: StructureContract) {
  const config = makeEntryStructureConfig({}, facts.address)
  config.pushValues(template)
  return config
}

/**
 * `execute` throws as a whole in two places the handlers do not guard: a
 * `{{ reference }}` that never resolves (dependency ordering) and an `edit`
 * that throws (edits run after all handlers, unguarded). Fields with the
 * first are found without running anything and left out; then handlers run
 * once without edits and each edit is decoded on its own, so a throwing
 * edit is pinned on its field and the other fields keep their values.
 */
async function pinFailure(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  facts: Facts,
  template: StructureContract,
  failure: string,
): Promise<FieldValues | RunFailure> {
  try {
    const unresolved = unresolvedReferences(facts, template)
    const runnable = withoutFields(template, Object.keys(unresolved))
    const { results } = await handlerExecutor.execute(
      provider,
      facts.address,
      facts.abi,
      configFor(facts, withoutEdits(runnable, Object.keys(runnable.fields))),
    )
    const decode = (fields: StructureContract['fields']) =>
      decodeAsExecutor(provider, facts, runnable, results, fields)
    const editErrors = failingEdits(runnable, decode)
    const decoded = decode(
      withoutEdits(runnable, Object.keys(editErrors)).fields,
    )
    const failed = [...Object.keys(unresolved), ...Object.keys(editErrors)]
    return {
      values: withoutKeys(decoded.values, failed),
      errors: { ...decoded.errors, ...editErrors, ...unresolved },
    }
  } catch {
    return { failure }
  }
}

/**
 * The decode step of `HandlerExecutor.execute`, repeated here so it can
 * run over the same handler results with different edits.
 */
function decodeAsExecutor(
  provider: IProvider,
  facts: Facts,
  template: StructureContract,
  results: HandlerResult[],
  fields: StructureContract['fields'],
): FieldValues {
  const config = configFor(facts, { ...template, fields })
  const { values, errors } = decodeHandlerResults(
    provider.chain,
    results,
    config.fields,
    config.types,
    {
      blockNumber: provider.blockNumber,
      timestamp: provider.timestamp,
      chainName: provider.chain,
      address: facts.address.toString(),
    },
  )
  return { values: values ?? {}, errors }
}

function failingEdits(
  template: StructureContract,
  decode: (fields: StructureContract['fields']) => FieldValues,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const edited = Object.keys(template.fields).filter(
    (name) => template.fields[name]?.edit !== undefined,
  )
  for (const name of edited) {
    const others = edited.filter((other) => other !== name)
    try {
      decode(withoutEdits(template, others).fields)
    } catch (error) {
      const edit = JSON.stringify(template.fields[name]?.edit)
      errors[name] = `the edit ${edit} throws: ${getErrorMessage(error)}`
    }
  }
  return errors
}

/**
 * Fields whose `{{ references }}` never resolve, found by the same
 * fixpoint `executeHandlers` orders handlers by: a field is ready once
 * every field it references is (`$` values always are).
 */
function unresolvedReferences(
  facts: Facts,
  template: StructureContract,
): Record<string, string> {
  const handlers = getHandlers(facts.abi, configFor(facts, template))
  const names = new Set(handlers.map((handler) => handler.field))
  const ready = new Set<string>()
  const isReady = (handler: Handler) =>
    handler.dependencies.every(
      (dependency) => ready.has(dependency) || dependency.startsWith('$'),
    )
  let pending: Handler[] = handlers
  let progressed = true
  while (progressed) {
    const batch = pending.filter(isReady)
    for (const handler of batch) {
      ready.add(handler.field)
    }
    pending = pending.filter((handler) => !batch.includes(handler))
    progressed = batch.length > 0
  }
  return Object.fromEntries(
    pending.map((handler) => [
      handler.field,
      unresolvedMessage(handler.dependencies, names),
    ]),
  )
}

function unresolvedMessage(dependencies: string[], names: Set<string>): string {
  const missing = dependencies.filter(
    (dependency) => !names.has(dependency) && !dependency.startsWith('$'),
  )
  if (missing.length > 0) {
    return `references ${missing.map(reference).join(', ')}, but no field or getter has that name`
  }
  return `references ${dependencies.map(reference).join(', ')}, which never resolve (a reference cycle, or a field that cannot run)`
}

function reference(name: string): string {
  return `{{ ${name} }}`
}

function withoutFields(
  template: StructureContract,
  names: string[],
): StructureContract {
  return {
    ...template,
    fields: Object.fromEntries(
      Object.entries(template.fields).filter(([name]) => !names.includes(name)),
    ),
  }
}

function withoutEdits(
  template: StructureContract,
  names: string[],
): StructureContract {
  return {
    ...template,
    fields: Object.fromEntries(
      Object.entries(template.fields).map(([name, field]) => {
        if (!names.includes(name)) {
          return [name, field]
        }
        const { edit: _edit, ...rest } = field
        return [name, rest]
      }),
    ),
  }
}

function withoutKeys<T>(
  record: Record<string, T>,
  keys: string[],
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !keys.includes(key)),
  )
}
