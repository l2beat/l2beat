import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
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
    readonly logger: DiscoveryLogger,
  ) {
    this.filterBy = getFunctionFragment(
      definition.filterBy,
      abi,
      (x) =>
        x.constant &&
        x.inputs.length === 1 &&
        x.inputs[0].type === 'address' &&
        x.outputs?.length === 1 &&
        x.outputs[0].type === 'bool',
    )
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Querying ', EVENT_FRAGMENT.name])
    const logs = await provider.getLogs(
      address,
      [[ABI.getEventTopic(EVENT_FRAGMENT)]],
      0,
      blockNumber,
    )
    const values = new Set<ContractValue>()
    for (const log of logs) {
      const parsed = ABI.parseLog(log)
      values.add(toContractValue(parsed.args[EVENT_KEY]))
    }

    const unfiltered = [...values]
    const governorStatuses = await Promise.all(
      unfiltered.map((governor) =>
        callMethod(provider, address, this.filterBy, [governor], blockNumber),
      ),
    )
    const error = governorStatuses.find((x) => x.error)?.error
    if (error) {
      return { field: this.field, error: error }
    }
    const filtered = unfiltered.filter((_, i) => governorStatuses[i].value)
    return { field: this.field, value: filtered }
  }
}
