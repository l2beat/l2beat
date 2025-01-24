import type { ContractValue } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { callMethod } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'
import { toContractValue } from '../utils/toContractValue'
import { toEventFragment } from '../utils/toEventFragment'

export type StarkWareGovernanceHandlerDefinition = z.infer<
  typeof StarkWareGovernanceHandlerDefinition
>
export const StarkWareGovernanceHandlerDefinition = z.strictObject({
  type: z.literal('starkWareGovernance'),
  filterBy: z.string(),
})

const EVENT_FRAGMENT = toEventFragment(
  'event LogNewGovernorAccepted(address acceptedGovernor)',
)
const EVENT_KEY = 'acceptedGovernor'
const ABI = new utils.Interface([EVENT_FRAGMENT])

export class StarkWareGovernanceHandler implements Handler {
  readonly dependencies: string[] = []
  readonly filterBy: utils.FunctionFragment

  constructor(
    readonly field: string,
    readonly definition: StarkWareGovernanceHandlerDefinition,
    abi: string[],
  ) {
    this.filterBy = getFunctionFragment(
      definition.filterBy,
      abi,
      (x) =>
        x.constant &&
        x.inputs.length === 1 &&
        x.inputs[0]?.type === 'address' &&
        x.outputs?.length === 1 &&
        x.outputs[0]?.type === 'bool',
    )
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [ABI.getEventTopic(EVENT_FRAGMENT)],
    ])
    const values = new Set<ContractValue>()
    for (const log of logs) {
      const parsed = ABI.parseLog(log)
      values.add(toContractValue(parsed.args[EVENT_KEY]))
    }

    const unfiltered = [...values]
    const governorStatuses = await Promise.all(
      unfiltered.map((governor) =>
        callMethod(provider, address, this.filterBy, [governor]),
      ),
    )
    const error = governorStatuses.find((x) => x.error)?.error
    if (error) {
      return { field: this.field, error }
    }
    const filtered = unfiltered.filter((_, i) => governorStatuses[i]?.value)
    return { field: this.field, value: filtered }
  }
}
