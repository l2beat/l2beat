import type { ContractValue } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type ArrayFromOneEventWithArgHandlerDefinition = z.infer<
  typeof ArrayFromOneEventWithArgHandlerDefinition
>

export const ArrayFromOneEventWithArgHandlerDefinition = z.strictObject({
  type: z.literal('arrayFromOneEventWithArg'),
  event: z.string(),
  valueKey: z.string(),
  flagKey: z.optional(z.string()),
  invert: z.optional(z.boolean()),
  ignoreRelative: z.optional(z.boolean()),
  arg: z.string(),
  argValue: z.string(),
})

export class ArrayFromOneEventWithArgHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly fragment: utils.EventFragment
  private readonly abi: utils.Interface

  constructor(
    readonly field: string,
    readonly definition: ArrayFromOneEventWithArgHandlerDefinition,
    abi: string[],
  ) {
    this.fragment = getEventFragment(
      definition.event,
      abi,
      (fragment) =>
        (!definition.flagKey ||
          fragment.inputs.some(
            (x) => x.type === 'bool' && x.name === definition.flagKey,
          )) &&
        fragment.inputs.some((x) => x.name === definition.valueKey) &&
        fragment.inputs.some((x) => x.name === definition.arg),
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
    const logs = await provider.getLogs(address, [
      this.abi.getEventTopic(this.fragment),
    ])
    const values = new Set<ContractValue>()
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      const argValue = toContractValue(
        parsed.args[this.definition.arg],
      ).toString()
      if (argValue !== this.definition.argValue) {
        continue
      }
      const value = toContractValue(parsed.args[this.definition.valueKey])
      let flag =
        !this.definition.flagKey ||
        Boolean(parsed.args[this.definition.flagKey])
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
