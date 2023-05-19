import { ContractValue, EthereumAddress } from '@l2beat/shared'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type ArrayFromOneEventWithArgsHandlerDefinition = z.infer<
  typeof ArrayFromOneEventWithArgsHandlerDefinition
>

export const ArrayFromOneEventWithArgsHandlerDefinition = z.strictObject({
  type: z.literal('arrayFromOneEventWithArgs'),
  event: z.string(),
  valueKey: z.string(),
  flagKey: z.optional(z.string()),
  invert: z.optional(z.boolean()),
  ignoreRelative: z.optional(z.boolean()),
  arg: z.string(),
  argValue: z.string(),
})

export class ArrayFromOneEventWithArgsHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly fragment: utils.EventFragment
  private readonly abi: utils.Interface

  constructor(
    readonly field: string,
    readonly definition: ArrayFromOneEventWithArgsHandlerDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
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
      const argValue = parsed.args[this.definition.arg] as string
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
