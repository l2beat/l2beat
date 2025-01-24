import type { ContractValue } from '@l2beat/discovery-types'
import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { reduce } from 'lodash'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'
import { toTopics } from '../utils/toTopics'

/**
 * This handler was created specifically for the LayerZero v2 contracts.
 * example event:
 * event DefaultConfigsSet(tuple(uint32 eid, tuple(...) config)[] params)",
 *
 * As there is a lot of similar events, the logic is quite coupled to the event structure
 * for the sake of simplicity. This can be improved in the future if more generic approach is needed.
 *
 * Logic:
 * 1. Get all logs for the event
 * 2. Group logs by returnParam[0] (it is always eid with current approach)
 * 3. Expand tuple of values into named values dictionary if expandParam is provided
 * 4. Keep only the latest log for each group
 */

export type StateFromEventTupleDefinition = z.infer<
  typeof StateFromEventTupleDefinition
>
export const StateFromEventTupleDefinition = z.strictObject({
  type: z.literal('stateFromEventTuple'),
  event: z.string(),
  returnParam: z.string(),
  expandParam: z.string().optional(),
  ignoreRelative: z.boolean().optional(),
})

export class StateFromEventTupleHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly fragment: utils.EventFragment
  private readonly abi: utils.Interface

  constructor(
    readonly field: string,
    readonly definition: StateFromEventTupleDefinition,
    abi: string[],
  ) {
    this.fragment = getEventFragment(definition.event, abi, () => true)
    assert(this.fragment.inputs.length === 1, 'Event should have 1 input')
    assert(
      this.fragment.inputs[0]?.name === definition.returnParam,
      `Invalid returnParam, ${this.fragment.inputs[0]?.name ?? ''} expected, ${
        definition.returnParam
      } given`,
    )
    this.abi = new utils.Interface([this.fragment])
  }

  getEvent(): string {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const topics = toTopics(this.abi, this.fragment)
    const logs = await provider.getLogs(address, topics)

    const values = new Map<number, ContractValue>()
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      const params = reduce(
        parsed.args,
        (acc, value, key) => {
          acc[key] = toContractValue(value) as [number, ContractValue][]
          return acc
        },
        {} as Record<string, [number, ContractValue][]>,
      )
      for (const array of Object.values(params)) {
        assert(Array.isArray(array), 'Invalid param type')
        for (const tuple of array) {
          if (this.definition.expandParam) {
            const returnParam = this.fragment.inputs[0]
            assert(returnParam, 'Return param not returned from event')
            const inputToExpand = returnParam.components.find(
              (component) => component.name === this.definition.expandParam,
            )

            assert(
              inputToExpand,
              'Input to expand not found in the return param',
            )

            const inputLabels = inputToExpand.components.map(
              (component) => component.name,
            )

            assert(Array.isArray(tuple[1]), 'Cannot expand non-tuple value')

            const expanded = Object.fromEntries(
              tuple[1].map((value, index) => [inputLabels[index], value]),
            ) as ContractValue

            values.set(tuple[0], expanded)
          } else {
            values.set(tuple[0], tuple[1])
          }
        }
      }
    }

    const value = Object.fromEntries(values.entries())

    return {
      field: this.field,
      value,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
