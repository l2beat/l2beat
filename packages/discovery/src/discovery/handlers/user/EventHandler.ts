import { assert, EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { isDeepStrictEqual } from 'util'
import { ContractValue } from '@l2beat/discovery-types'
import { providers, utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'
import { orderLogs } from '../../provider/BatchingAndCachingProvider'

interface LogRow {
  log: utils.LogDescription
  value: ContractValue
}

type FilterType =
  | { truthy: { column: string } }
  | { eq: { column: string; value: string | number | boolean } }
  | { event: { value: string } }
  | { not: FilterType }
  | { and: { lhs: FilterType; rhs: FilterType } }

export const EventHandlerFilter: z.ZodType<FilterType> = z.lazy(() =>
  z.union([
    z.object({ truthy: z.object({ column: z.string() }) }),
    z.object({
      eq: z.object({
        column: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      }),
    }),
    z.object({ event: z.object({ value: z.string() }) }),
    z.object({ not: EventHandlerFilter }),
    z.object({
      and: z.object({ lhs: EventHandlerFilter, rhs: EventHandlerFilter }),
    }),
  ]),
)
export type EventHandlerFilter = z.infer<typeof EventHandlerFilter>

export type EventHandlerDefinition = z.infer<typeof EventHandlerDefinition>
export const EventHandlerDefinition = z.strictObject({
  type: z.literal('event'),
  events: z.union([z.string(), z.array(z.string())]),
  select: z.union([z.string(), z.array(z.string())]).optional(),
  distinct: z.union([z.string(), z.array(z.string())]).optional(),

  where: EventHandlerFilter.optional(),
  latch: EventHandlerFilter.optional(),
  groupBy: z.string().optional(),

  ignoreRelative: z.optional(z.boolean()),
})

export class EventHandler implements Handler {
  readonly dependencies: string[] = []
  readonly abi: utils.Interface
  readonly topic0s: string[]
  readonly keys: string[]

  constructor(
    readonly field: string,
    readonly definition: EventHandlerDefinition,
    stringAbi: string[],
  ) {
    const events = ensureArray(definition.events)
    const fragments = events.map((e) =>
      getEventFragment(e, stringAbi, () => true),
    )

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
    this.topic0s = fragments.map((f) => this.abi.getEventTopic(f))
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await fetchLogs(provider, address, this.topic0s)

    let logRows: LogRow[] = []
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      logRows.push(getResultObject(parsed, this.keys))
    }

    if (this.definition.where !== undefined) {
      logRows = evaluateWhere(logRows, this.definition.where)
    }

    const select = ensureArray(this.definition.select ?? [])
    if (this.definition.latch !== undefined) {
      logRows = evaluateLatch(logRows, this.definition.latch, select)
    }

    const distinct = ensureArray(this.definition.distinct ?? [])
    if (distinct.length > 0) {
      const filtered: LogRow[] = []

      // NOTE(radomski): Speed? Everything is n^2 here
      for (const entry of logRows) {
        const alreadyPresent = filtered.some((e) =>
          isDeepStrictEqual(
            extractKeys(e, distinct),
            extractKeys(entry, distinct),
          ),
        )

        if (!alreadyPresent) {
          filtered.push(entry)
        }
      }

      logRows = filtered
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

function evaluateLatch(
  entries: LogRow[],
  filter: EventHandlerFilter,
  select: string[],
): LogRow[] {
  const result: Map<string, LogRow> = new Map()

  for (const entry of entries) {
    const latching = evaluateFilter(entry, filter)
    const value = select.length > 0 ? extractKeys(entry, select) : entry
    const string = JSON.stringify(value)

    if (latching) {
      result.set(string, entry)
    } else {
      result.delete(string)
    }
  }

  return [...result.values()]
}

function evaluateWhere(
  entries: LogRow[],
  filter: EventHandlerFilter,
): LogRow[] {
  return entries.filter((e) => evaluateFilter(e, filter))
}

function evaluateFilter(e: LogRow, filter: EventHandlerFilter): boolean {
  if ('truthy' in filter) {
    const { truthy } = filter
    return !!extractKeys(e, [truthy.column])[truthy.column]
  } else if ('eq' in filter) {
    const { eq } = filter
    return extractKeys(e, [eq.column])[eq.column] === eq.value
  } else if ('not' in filter) {
    const { not } = filter
    return !evaluateFilter(e, not)
  } else if ('and' in filter) {
    const { and } = filter
    return evaluateFilter(e, and.lhs) && evaluateFilter(e, and.rhs)
  } else if ('event' in filter) {
    const { event } = filter
    return (
      e.log.topic === event.value ||
      e.log.eventFragment.name.includes(event.value)
    )
  } else {
    assert(false, 'unknown filter')
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
