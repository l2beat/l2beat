import { assert, EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { ContractValue } from '@l2beat/discovery-types'
import { providers, utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'
import { orderLogs } from '../../provider/BatchingAndCachingProvider'
import { getEventFragment } from '../utils/getEventFragment'
import { toEventFragment } from '../utils/toEventFragment'
import { isDeepStrictEqual } from 'util'

interface LogRow {
  log: utils.LogDescription
  value: ContractValue
}

type PrimitiveType = string | number | boolean

type FilterType =
  | string
  | number
  | boolean
  | ['!!', FilterType]
  | ['=', string, FilterType]
  | ['not', FilterType]
  | ['and', FilterType, FilterType]

export const Event2HandlerFilter = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.tuple([z.literal('!!'), z.any()]),
  z.tuple([z.literal('='), z.string(), z.any()]),
  z.tuple([z.literal('not'), z.any()]),
  z.tuple([z.literal('and'), z.any(), z.any()]),
])

export const Event2HandlerAction = z.object({
  event: z.union([z.string(), z.array(z.string())]),
  where: Event2HandlerFilter.optional(),
})
export type Event2HandlerAction = z.infer<typeof Event2HandlerAction>

export type Event2HandlerDefinition = z.infer<typeof Event2HandlerDefinition>
export const Event2HandlerDefinition = z.strictObject({
  type: z.literal('event2'),
  select: z.union([z.string(), z.array(z.string())]).optional(),
  set: z.union([Event2HandlerAction, z.array(Event2HandlerAction)]).optional(),
  add: z.union([Event2HandlerAction, z.array(Event2HandlerAction)]).optional(),
  remove: z
    .union([Event2HandlerAction, z.array(Event2HandlerAction)])
    .optional(),
  ignoreRelative: z.optional(z.boolean()),
})

export class Event2Handler implements Handler {
  readonly dependencies: string[] = []
  readonly abi: utils.Interface
  readonly topic0s: string[]
  readonly keys: string[]

  constructor(
    readonly field: string,
    readonly definition: Event2HandlerDefinition,
    stringAbi: string[],
  ) {
    const events: string[] = []
    const actions = [definition.set, definition.add, definition.remove]
    for (const action of actions) {
      if (action === undefined) {
        continue
      }

      events.push(...ensureArray(action).flatMap((a) => ensureArray(a.event)))
    }

    const fragments = events.map((e) =>
      getEventFragment(e, stringAbi, () => true),
    )

    // TODO(radomski): This might be useless
    const inputsPerEvent = fragments.map((f) => f.inputs.map((elem) => elem))
    const smallest = inputsPerEvent.reduce((min, current) =>
      current.length < min.length ? current : min,
    )
    const abiCompatible = inputsPerEvent.every((inputs) => {
      if (smallest.length > 0) {
        return smallest.every((elem) =>
          inputs.some((i) => isDeepStrictEqual(i, elem)),
        )
      } else {
        return false
      }
    })

    if (!abiCompatible) {
      // TODO(radomski): More user friendly error message.
      // We should know which event is not compatible
      throw new Error('ABI between events is not compatible')
    }

    this.keys = smallest.map((e, i) => e.name ?? i.toString())
    this.abi = new utils.Interface(fragments)
    this.topic0s = [...new Set(fragments.map((f) => this.abi.getEventTopic(f)))]
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await fetchLogs(provider, address, this.topic0s)
    const select = ensureArray(this.definition.select ?? [])

    let logRows: LogRow[] = []
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      logRows.push(getResultObject(parsed, this.keys))
    }

    if (this.definition.set !== undefined) {
      const setActions = ensureArray(this.definition.set)
      logRows = await this.executeSets(logRows, setActions, select)
    } else if (this.definition.add !== undefined) {
      const addActions = ensureArray(this.definition.add)
      const removeActions = ensureArray(this.definition.remove ?? [])

      logRows = await this.executeAddRemove(
        logRows,
        addActions,
        removeActions,
        select,
      )
    }

    let values = logRows.map((r) => r.value)
    if (select.length > 0) {
      values = logRows.map((entry) => extractKeys(entry, select))
    }

    const onlySingleKey = values.every((v) => Object.keys(v).length === 1)
    if (onlySingleKey) {
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      values = values.map((o) => Object.values(o)[0]!)
    }

    return {
      field: this.field,
      value: values,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  async executeSets(
    logs: LogRow[],
    setActions: Event2HandlerAction[],
    select: string[],
  ): Promise<LogRow[]> {
    const result: Map<string, LogRow> = new Map()

    for (const entry of logs) {
      const keep = setActions.some((action) => evaluateAction(entry, action))
      if (!keep) {
        continue
      }

      const value = select.length > 0 ? extractKeys(entry, select) : entry
      const string = JSON.stringify(value)
      result.set(string, entry)
    }

    return [...result.values()]
  }

  async executeAddRemove(
    logs: LogRow[],
    addActions: Event2HandlerAction[],
    removeActions: Event2HandlerAction[],
    select: string[],
  ): Promise<LogRow[]> {
    const result: Map<string, LogRow> = new Map()

    for (const entry of logs) {
      const add = addActions.some((action) => evaluateAction(entry, action))
      const remove = removeActions.some((action) =>
        evaluateAction(entry, action),
      )
      assert(!(add && remove), 'Both add and remove are true')
      const value = select.length > 0 ? extractKeys(entry, select) : entry
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
  address: EthereumAddress,
  topic0s: string[],
): Promise<providers.Log[]> {
  const logs = await Promise.all(
    topic0s.map(async (t) => await provider.getLogs(address, [t])),
  )

  return logs.flat().sort(orderLogs)
}

function evaluateAction(log: LogRow, action: Event2HandlerAction) {
  const eventMatch = ensureArray(action.event).some(
    (e) => getEventName(e) === log.log.name,
  )

  return eventMatch && evaluateFilter(log, action.where)
}

function evaluateFilter(
  e: LogRow,
  filter?: FilterType | undefined,
): ContractValue {
  if (filter === undefined) {
    return true
  }
  if (!Array.isArray(filter)) {
    if (typeof filter === 'string' && filter.startsWith('#')) {
      const key = filter.slice(1) // remove leading #
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      return extractKeys(e, [key])[key]!
    }

    return filter
  }

  const [operation] = filter
  switch (operation) {
    case 'not':
      return !evaluateFilter(e, filter[1])
    case '=':
      return evaluateFilter(e, filter[1]) === evaluateFilter(e, filter[2])
    case '!!':
      return !!evaluateFilter(e, filter[1])
    case 'and':
      return evaluateFilter(e, filter[1]) && evaluateFilter(e, filter[2])
    default: {
      assert(false, 'unhandled')
    }
  }
}

function extractKeys(
  entry: LogRow,
  keys: string[],
): { [key: string]: ContractValue | undefined } {
  const result: ContractValue = {}

  const value = entry.value
  assert(typeof value === 'object' && !Array.isArray(value), 'Extract keys')
  for (const selectKey of keys) {
    result[selectKey] = value[selectKey]
  }

  return result
}

function getResultObject(log: utils.LogDescription, keys: string[]): LogRow {
  const result: Record<string, ContractValue> = {}

  for (const key of keys) {
    result[key] = toContractValue(log.args[key])
  }

  return { log, value: result }
}

function ensureArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}

function getEventName(eventString: string): string {
  if (eventString.includes(' ')) {
    const fragment = toEventFragment(eventString)
    return fragment.name
  } else {
    return eventString
  }
}
