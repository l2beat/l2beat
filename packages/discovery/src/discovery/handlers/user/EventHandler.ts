import { assert, type ChainSpecificAddress, unique } from '@l2beat/shared-pure'
import { type Parser, type Validator, v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import groupBy from 'lodash/groupBy'
import { isDeepStrictEqual } from 'util'
import { executeBlip } from '../../../blip/executeBlip'
import type { BlipSexp } from '../../../blip/type'
import { validateBlip } from '../../../blip/validateBlip'
import type { ContractValue } from '../../output/types'
import { orderLogs } from '../../provider/BatchingAndCachingProvider'
import type { IProvider } from '../../provider/IProvider'
import { prefixAddresses } from '../../utils/prefixAddresses'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'
import { toEventFragment } from '../utils/toEventFragment'

interface LogRow {
  log: utils.LogDescription
  value: ContractValue
}

function oneOrMany<T>(schema: Validator<T>): Validator<T | T[]>
// @ts-ignore We allow this error for simplicity of use
function oneOrMany<T>(schema: Parser<T>): Parser<T | T[]>
function oneOrMany<T>(schema: Validator<T>): Validator<T | T[]> {
  return v.union([schema, v.array(schema)])
}

export const EventHandlerAction = v.object({
  event: oneOrMany(v.string()),
  where: v
    .unknown()
    .check((v): v is BlipSexp => validateBlip(v))
    .optional(),
})
export type EventHandlerAction = v.infer<typeof EventHandlerAction>

const common = {
  type: v.literal('event'),
  select: oneOrMany(v.string()).optional(),
  groupBy: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
}

const setOnlySchema = v.object({
  ...common,
  set: oneOrMany(EventHandlerAction),
  add: v.undefined().optional(),
  remove: v.undefined().optional(),
})

const addAndRemoveSchema = v.object({
  ...common,
  set: v.undefined().optional(),
  add: oneOrMany(EventHandlerAction),
  remove: oneOrMany(EventHandlerAction).optional(),
})

export type EventHandlerDefinition = v.infer<typeof EventHandlerDefinition>
export const EventHandlerDefinition = v.union([
  setOnlySchema,
  addAndRemoveSchema,
])

export class EventHandler implements Handler {
  readonly dependencies: string[] = []
  readonly abi: utils.Interface
  readonly topic0s: string[]

  constructor(
    readonly field: string,
    readonly definition: EventHandlerDefinition,
    stringAbi: string[],
  ) {
    const events: string[] = []
    const actions: EventHandlerAction[] = [
      ensureArray(definition.set ?? []),
      ensureArray(definition.add ?? []),
      ensureArray(definition.remove ?? []),
    ].flat()

    for (const action of actions) {
      if (action === undefined) {
        continue
      }

      const actionEvents = ensureArray(action.event)
      const abiCompatible = eventsAreCompatible(action, stringAbi)
      if (!abiCompatible) {
        throw new Error(
          'ABI compatibility error: The following events have incompatible parameter structures:\n' +
            `• Received events:\n${actionEvents.map((e) => `  - ${e}`).join('\n')}\n\n` +
            'All events in an action must contain compatible parameter names and types. ' +
            'Check that these fields match across all event ABIs:\n' +
            '  1. Parameter names\n' +
            '  2. Parameter types',
        )
      }

      events.push(...actionEvents)
    }

    const fragments = events.map((e) => getEventFragment(e, unique(stringAbi)))
    const uniqueFragments = unique(fragments, (f) => f.format())
    this.abi = new utils.Interface(uniqueFragments)
    this.topic0s = [
      ...new Set(uniqueFragments.map((f) => this.abi.getEventTopic(f))),
    ]
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await fetchLogs(provider, address, this.topic0s)

    const logRows: LogRow[] = []
    for (const rawLog of logs) {
      const log = this.abi.parseLog(rawLog)
      const value: Record<string, ContractValue> = {}

      for (const key of Object.keys(log.args).filter((k) => !isNumber(k))) {
        value[key] = toContractValue(log.args[key])
      }

      logRows.push({ log, value })
    }

    let value: ContractValue | undefined
    if (this.definition.groupBy !== undefined) {
      const groupByKey = this.definition.groupBy
      const grouped = groupBy(logRows, (e) => extractKey(e.value, groupByKey))
      value = {}
      for (const key in grouped) {
        // biome-ignore lint/style/noNonNullAssertion: we know it's there
        value[key] = this.processLogs(provider.chain, grouped[key]!)
      }
    } else {
      value = this.processLogs(provider.chain, logRows)
    }

    return {
      field: this.field,
      value,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  processLogs(
    longChain: string,
    logRows: LogRow[],
  ): ContractValue | ContractValue[] | undefined {
    const select = ensureArray(this.definition.select ?? [])

    const extractArray = this.definition.set !== undefined
    if (this.definition.set !== undefined) {
      const setActions = ensureArray(this.definition.set)
      logRows = this.executeSets(longChain, logRows, setActions)
    } else if (this.definition.add !== undefined) {
      const addActions = ensureArray(this.definition.add)
      const removeActions = ensureArray(this.definition.remove ?? [])

      logRows = this.executeAddRemove(
        longChain,
        logRows,
        addActions,
        removeActions,
        select,
      )
    }

    let values = logRows.map((r) => r.value)
    if (select.length > 0) {
      values = logRows.map((entry) => extractKeys(entry.value, select))
    }

    const onlySingleKey = values.every((v) => Object.keys(v).length === 1)
    if (onlySingleKey) {
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      values = values.map((o) => Object.values(o)[0]!)
    }

    return extractArray ? values[0] : values
  }

  executeSets(
    longChain: string,
    logs: LogRow[],
    setActions: EventHandlerAction[],
  ): LogRow[] {
    let result: LogRow | undefined = undefined

    for (const entry of logs) {
      const keep = setActions.some((action) =>
        evaluateAction(longChain, entry, action),
      )
      if (!keep) {
        continue
      }

      result = entry
    }

    return ensureArray(result ?? [])
  }

  executeAddRemove(
    longChain: string,
    logs: LogRow[],
    addActions: EventHandlerAction[],
    removeActions: EventHandlerAction[],
    select: string[],
  ): LogRow[] {
    const result: Map<string, LogRow> = new Map()

    for (const entry of logs) {
      const add = addActions.some((action) =>
        evaluateAction(longChain, entry, action),
      )
      const remove = removeActions.some((action) =>
        evaluateAction(longChain, entry, action),
      )

      assert(
        !(add && remove),
        'Conflict detected in log processing:\n' +
          '  A log entry cannot trigger both add AND remove actions simultaneously\n' +
          'Potential resolutions:\n' +
          '  1. Check event handler conditions for overlaps\n' +
          '  2. Verify mutually exclusive filters in add/remove actions\n' +
          '  3. Make sure that remove where clause is opposite to add one',
      )

      const value =
        select.length > 0 ? extractKeys(entry.value, select) : entry.value
      const string = JSON.stringify(value)

      if (add) {
        result.set(string, entry)
      } else if (remove) {
        result.delete(string)
      }
    }

    return [...result.values()]
  }
}

async function fetchLogs(
  provider: IProvider,
  address: ChainSpecificAddress,
  topic0s: string[],
): Promise<providers.Log[]> {
  const logs = await Promise.all(
    topic0s.map(async (t) => await provider.getLogs(address, [t])),
  )

  return logs.flat().sort(orderLogs)
}

function evaluateAction(
  longChain: string,
  log: LogRow,
  { event, where }: EventHandlerAction,
) {
  const eventMatch = ensureArray(event).some(
    (e) => getEventName(e) === log.log.name,
  )

  return (
    eventMatch &&
    executeBlip(prefixAddresses(longChain, log.value), where ?? true)
  )
}

function extractKeys(
  value: ContractValue,
  keys: string[],
): { [key: string]: ContractValue | undefined } {
  const result: ContractValue = {}

  for (const selectKey of keys) {
    result[selectKey] = extractKey(value, selectKey)
  }

  return result
}

function extractKey(value: ContractValue, key: string): ContractValue {
  assert(typeof value === 'object' && !Array.isArray(value), 'Extract keys')

  const result = value[key]
  assert(result !== undefined, `Invalid extraction key [${key}], not defined`)
  return result
}

function ensureArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}

function getEventName(eventString: string): string {
  if (eventString.includes(' ')) {
    const fragment = toEventFragment(eventString)
    return fragment.name
  }
  return eventString
}

function eventsAreCompatible(
  action: EventHandlerAction,
  stringAbi: string[],
): boolean {
  const events = ensureArray(action.event)
  const fragments = events.map((e) => getEventFragment(e, stringAbi))

  const inputsPerEvent = fragments.map((f) => f.inputs.map((elem) => elem))
  const smallest = inputsPerEvent.reduce((min, current) =>
    current.length < min.length ? current : min,
  )
  const abiCompatible = inputsPerEvent.every((inputs) => {
    if (smallest.length > 0) {
      return smallest.every((elem) =>
        inputs.some((i) => isDeepStrictEqual(i, elem)),
      )
    }
    return false
  })

  return abiCompatible
}

function isNumber(str: string): boolean {
  const trimmed = str.trim()
  if (trimmed === '') return false

  const num = Number(trimmed)
  return !isNaN(num) && isFinite(num)
}
