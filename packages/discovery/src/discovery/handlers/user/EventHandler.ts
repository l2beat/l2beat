import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { isDeepStrictEqual } from 'util'
import type { ContractValue } from '@l2beat/discovery-types'
import { type providers, utils } from 'ethers'
import { groupBy } from 'lodash'
import { executeBlip } from '../../../blip/executeBlip'
import type { BlipSexp } from '../../../blip/type'
import { validateBlip } from '../../../blip/validateBlip'
import { orderLogs } from '../../provider/BatchingAndCachingProvider'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'
import { toEventFragment } from '../utils/toEventFragment'

interface LogRow {
  log: utils.LogDescription
  value: ContractValue
}

export const EventHandlerAction = z.object({
  event: z.union([z.string(), z.array(z.string())]),
  where: z
    .unknown()
    .refine(validateBlip)
    .transform((v): BlipSexp => v as BlipSexp)
    .optional(),
})
export type EventHandlerAction = z.infer<typeof EventHandlerAction>

export type EventHandlerDefinition = z.infer<typeof EventHandlerDefinition>
export const EventHandlerDefinition = z.strictObject({
  type: z.literal('event'),
  select: z.union([z.string(), z.array(z.string())]).optional(),
  set: z.union([EventHandlerAction, z.array(EventHandlerAction)]).optional(),
  add: z.union([EventHandlerAction, z.array(EventHandlerAction)]).optional(),
  remove: z.union([EventHandlerAction, z.array(EventHandlerAction)]).optional(),
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

    const logRows: LogRow[] = []
    for (const rawLog of logs) {
      const log = this.abi.parseLog(rawLog)
      const value: Record<string, ContractValue> = {}

      for (const key of this.keys) {
        value[key] = toContractValue(log.args[key])
      }

      logRows.push({ log, value })
    }

    let values: ContractValue
    if (this.definition.groupBy !== undefined) {
      const groupByKey = this.definition.groupBy
      const grouped = groupBy(logRows, (e) => extractKey(e.value, groupByKey))
      values = {}
      for (const key in grouped) {
        // biome-ignore lint/style/noNonNullAssertion: we know it's there
        values[key] = this.processLogs(grouped[key]!)
      }
    } else {
      values = this.processLogs(logRows)
    }

    return {
      field: this.field,
      value: values,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  processLogs(logRows: LogRow[]): ContractValue | ContractValue[] {
    const select = ensureArray(this.definition.select ?? [])

    const extractArray = this.definition.set !== undefined
    if (this.definition.set !== undefined) {
      const setActions = ensureArray(this.definition.set)
      logRows = this.executeSets(logRows, setActions)
    } else if (this.definition.add !== undefined) {
      const addActions = ensureArray(this.definition.add)
      const removeActions = ensureArray(this.definition.remove ?? [])

      logRows = this.executeAddRemove(
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

    // TODO(radomski):
    // biome-ignore lint/style/noNonNullAssertion: We know it's there
    return extractArray ? values[0]! : values
  }

  executeSets(logs: LogRow[], setActions: EventHandlerAction[]): LogRow[] {
    let result: LogRow | undefined = undefined

    for (const entry of logs) {
      const keep = setActions.some((action) => evaluateAction(entry, action))
      if (!keep) {
        continue
      }

      result = entry
    }

    return ensureArray(result ?? [])
  }

  executeAddRemove(
    logs: LogRow[],
    addActions: EventHandlerAction[],
    removeActions: EventHandlerAction[],
    select: string[],
  ): LogRow[] {
    const result: Map<string, LogRow> = new Map()

    for (const entry of logs) {
      const add = addActions.some((action) => evaluateAction(entry, action))
      const remove = removeActions.some((action) =>
        evaluateAction(entry, action),
      )
      assert(!(add && remove), 'Both add and remove are true')
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
  address: EthereumAddress,
  topic0s: string[],
): Promise<providers.Log[]> {
  const logs = await Promise.all(
    topic0s.map(async (t) => await provider.getLogs(address, [t])),
  )

  return logs.flat().sort(orderLogs)
}

function evaluateAction(log: LogRow, { event, where }: EventHandlerAction) {
  const eventMatch = ensureArray(event).some(
    (e) => getEventName(e) === log.log.name,
  )

  return eventMatch && executeBlip(log.value, where ?? true)
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

function extractKey(
  value: ContractValue,
  key: string,
): ContractValue | undefined {
  assert(typeof value === 'object' && !Array.isArray(value), 'Extract keys')

  return value[key]
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
