import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type ArrayFromOneEventHandlerDefinition = z.infer<
  typeof ArrayFromOneEventHandlerDefinition
>
export const ArrayFromOneEventHandlerDefinition = z.strictObject({
  type: z.literal('arrayFromOneEvent'),
  event: z.string(),
  valueKey: z.string(),
  flagKey: z.optional(z.string()),
  flagTrueValues: z.optional(
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ),
  flagFalseValues: z.optional(
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ),
  invert: z.optional(z.boolean()),
  ignoreRelative: z.optional(z.boolean()),
})

export class ArrayFromOneEventHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly fragment: utils.EventFragment
  private readonly abi: utils.Interface
  private readonly isFlagTrue: (value: ContractValue) => boolean

  constructor(
    readonly field: string,
    readonly definition: ArrayFromOneEventHandlerDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    this.fragment = getEventFragment(
      definition.event,
      abi,
      (fragment) =>
        (!definition.flagKey ||
          fragment.inputs.some((x) => x.name === definition.flagKey)) &&
        fragment.inputs.some((x) => x.name === definition.valueKey),
    )
    this.abi = new utils.Interface([this.fragment])

    const trueValues = (this.definition.flagTrueValues ?? ['true']).map(String)
    const falseValues = (this.definition.flagFalseValues ?? ['false']).map(
      String,
    )

    this.isFlagTrue = (value: ContractValue): boolean => {
      if (trueValues.includes(String(value))) {
        return true
      }
      if (falseValues.includes(String(value))) {
        return false
      }
      throw new Error('Unexpected flag value')
    }
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
      const value = toContractValue(parsed.args[this.definition.valueKey])
      let flag =
        !this.definition.flagKey ||
        this.isFlagTrue(parsed.args[this.definition.flagKey] as ContractValue)
      if (this.definition.invert) {
        flag = !flag
      }
      if (flag) {
        values.add(value)
      } else {
        values.delete(value)
      }
    }
    return {
      field: this.field,
      value: [...values],
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
