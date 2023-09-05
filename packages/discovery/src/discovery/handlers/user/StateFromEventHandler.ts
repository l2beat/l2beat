import { ContractValue } from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
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
  onlyValue: z.optional(z.boolean()),
  multipleInGroup: z.optional(z.boolean()),
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
      const groupBy = this.definition.groupBy
      const result = reduce(
        [...values],
        (grouping: Partial<Record<string, ContractValue>>, item) => {
          assert(typeof item === 'object', 'Invalid item type')

          const key: unknown = Reflect.get(item, groupBy)
          assert(
            typeof key === 'string' || typeof key === 'number',
            'Invalid key type',
          )
          if (this.definition.onlyValue) {
            Reflect.deleteProperty(item, groupBy)
          }

          const value =
            Object.keys(item).length === 1 ? Object.values(item)[0] : item
          assert(value !== undefined, 'Value is undefined')

          const group = grouping[key]
          if (group === undefined || !this.definition.multipleInGroup) {
            grouping[key] = value
          } else {
            grouping[key] = group
            if (Array.isArray(group)) {
              group.push(value)
            } else {
              grouping[key] = [group, value]
            }
          }

          return grouping
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
