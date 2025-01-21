import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type ArrayFromTwoEventsHandlerDefinition = z.infer<
  typeof ArrayFromTwoEventsHandlerDefinition
>
export const ArrayFromTwoEventsHandlerDefinition = z.strictObject({
  type: z.literal('arrayFromTwoEvents'),

  // Select & Negative event
  addEvent: z.string(),
  addKey: z.string(),
  removeEvent: z.string(),
  removeKey: z.string(),

  ignoreRelative: z.optional(z.boolean()),
})

export class ArrayFromTwoEventsHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly addFragment: utils.EventFragment
  private readonly removeFragment: utils.EventFragment
  private readonly abi: utils.Interface

  constructor(
    readonly field: string,
    readonly definition: ArrayFromTwoEventsHandlerDefinition,
    abi: string[],
  ) {
    this.addFragment = getEventFragment(definition.addEvent, abi, (fragment) =>
      fragment.inputs.some((x) => x.name === definition.addKey),
    )
    this.removeFragment = getEventFragment(
      definition.removeEvent,
      abi,
      (fragment) =>
        fragment.inputs.some((x) => x.name === definition.removeKey),
    )
    this.abi = new utils.Interface([this.addFragment, this.removeFragment])
  }

  getAddEvent(): string {
    return this.addFragment.format(utils.FormatTypes.full)
  }

  getRemoveEvent(): string {
    return this.removeFragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [
        this.abi.getEventTopic(this.addFragment),
        this.abi.getEventTopic(this.removeFragment),
      ],
    ])
    const values = new Set<ContractValue>()
    for (const log of logs) {
      const parsed = this.abi.parseLog(log)
      if (parsed.name === this.addFragment.name) {
        values.add(toContractValue(parsed.args[this.definition.addKey]))
      } else {
        values.delete(toContractValue(parsed.args[this.definition.removeKey]))
      }
    }
    return {
      field: this.field,
      value: [...values],
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
