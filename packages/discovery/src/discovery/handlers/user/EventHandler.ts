import { assert, EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { utils } from 'ethers'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { ContractValue } from '@l2beat/discovery-types'
import { toContractValue } from '../utils/toContractValue'
import { isDeepStrictEqual } from 'util'

export type EventHandlerDefinition = z.infer<typeof EventHandlerDefinition>
export const EventHandlerDefinition = z.strictObject({
  type: z.literal('event'),
  events: z.union([z.string(), z.array(z.string())]),
  select: z.union([z.string(), z.array(z.string())]).optional(),
  distinct: z.union([z.string(), z.array(z.string())]).optional(),

  filter: z.array(z.string()).optional(),
  groupBy: z.string().optional(),

  ignoreRelative: z.optional(z.boolean()),
})

export class EventHandler implements Handler {
  readonly dependencies: string[] = []
  readonly abi: utils.Interface
  readonly topics: string[]
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
    this.topics = fragments.map((f) => this.abi.getEventTopic(f))
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, this.topics)

    let result: ContractValue[] = []
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      result.push(getResultObject(parsed, this.keys))
    }

    const distinct = ensureArray(this.definition.distinct ?? [])
    if (distinct.length > 0) {
      const filtered: ContractValue[] = []

      // NOTE(radomski): Speed? Everything is n^2 here
      for (const entry of result) {
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

      result = filtered
    }

    const select = ensureArray(this.definition.select ?? [])
    if (select.length > 0) {
      result = result.map((entry) => extractKeys(entry, select))
    }

    const onlySingleKey = result.every((v) => Object.keys(v).length === 1)
    if (onlySingleKey) {
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      result = result.map((o) => Object.values(o)[0]!)
    }

    return {
      field: this.field,
      value: result,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function extractKeys(entry: ContractValue, keys: string[]): ContractValue {
  const result: ContractValue = {}

  assert(typeof entry === 'object' && !Array.isArray(entry))
  for (const selectKey of keys) {
    result[selectKey] = entry[selectKey]
  }

  return result
}

function getResultObject(
  log: utils.LogDescription,
  keys: string[],
): Record<string, ContractValue> {
  const result: Record<string, ContractValue> = {}

  for (const key of keys) {
    result[key] = toContractValue(log.args[key])
  }

  return result
}

function ensureArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}
