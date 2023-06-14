import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getEventFragment } from '../utils/getEventFragment'
import { toContractValue } from '../utils/toContractValue'

export type ArrayFromTwoEventsHandlerDefinition = z.infer<
  typeof ArrayFromTwoEventsHandlerDefinition
>
export const ArrayFromTwoEventsHandlerDefinition = z.strictObject({
  type: z.literal('arrayFromTwoEvents'),
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
    readonly logger: DiscoveryLogger,
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

  getAddEvent() {
    return this.addFragment.format(utils.FormatTypes.full)
  }

  getRemoveEvent() {
    return this.removeFragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Querying ',
      this.addFragment.name,
      ' and ',
      this.removeFragment.name,
    ])
    const logs = await provider.getLogs(
      address,
      [
        [
          this.abi.getEventTopic(this.addFragment),
          this.abi.getEventTopic(this.removeFragment),
        ],
      ],
      0,
      blockNumber,
    )
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
