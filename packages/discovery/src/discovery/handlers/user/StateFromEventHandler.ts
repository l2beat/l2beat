import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { pick, reduce } from 'lodash'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type StateFromEventDefinition = z.infer<typeof StateFromEventDefinition>
export const StateFromEventDefinition = z.strictObject({
  type: z.literal('stateFromEvent'),
  event: z.string(),
  returnParams: z.array(z.string()),
  groupBy: z.optional(z.string()),
  ignoreRelative: z.optional(z.boolean()),
})

export class StateFromEventHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly fragment: utils.EventFragment
  private readonly abi: utils.Interface

  constructor(
    readonly field: string,
    readonly definition: StateFromEventDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    this.fragment = getEventFragment(definition.event, abi, () => true)
    this.abi = new utils.Interface([this.fragment])
  }

  getEvent() {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Querying ', this.fragment.name])
    const logs = await provider.getLogs(
      address,
      [this.abi.getEventTopic(this.fragment)],
      0,
      blockNumber,
    )

    const values = new Set<ContractValue>()
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)

      const params = reduce(
        pick(parsed.args, this.definition.returnParams),
        (acc, value, key) => {
          acc[key] = toContractValue(value)
          return acc
        },
        {} as Record<string, ContractValue>,
      )
      values.add(params)
    }

    if (this.definition.groupBy !== undefined) {
      const result = reduce(
        [...values],
        (grouping: Record<string, ContractValue>, item) => {
          if (typeof item === 'object' && this.definition.groupBy) {
            const key: unknown = Reflect.get(item, this.definition.groupBy)
            if (typeof key === 'string' || typeof key === 'number') {
              grouping[key] = item
              return grouping
            }
          }
          throw new Error('Cannot group')
        },
        {},
      )

      return {
        field: this.field,
        value: result,
        ignoreRelative: this.definition.ignoreRelative,
      }
    }

    return {
      field: this.field,
      value: [...values],
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
