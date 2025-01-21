import type { ContractValue } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'
import { toTopics } from '../utils/toTopics'

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
  topics: z.optional(z.array(z.union([z.string(), z.null()]))),
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

  getEvent(): string {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const topics = toTopics(this.abi, this.fragment, this.definition.topics)
    const logs = await provider.getLogs(address, topics)
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
