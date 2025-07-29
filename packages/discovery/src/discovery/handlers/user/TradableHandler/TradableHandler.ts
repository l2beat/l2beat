import { assert, ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'

const abi = ['event DealDeployed(string id, address deal, address manager)']

export type TradableDefinition = v.infer<typeof TradableDefinition>
export const TradableDefinition = v.strictObject({
  type: v.literal('tradable'),
})

export class TradableHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(readonly field: string) {}

  async execute(
    provider: IProvider,
    dealFactory: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const iface = new utils.Interface(abi)
    const topic0 = iface.getEventTopic('DealDeployed')

    const logs = await provider.getLogs(dealFactory, [topic0])

    const chainShortName = ChainSpecificAddress.chain(dealFactory)

    const dealsDeployed = logs.map((log) =>
      parseDealDeployed(log, chainShortName),
    )

    return Promise.resolve({
      field: this.field,
      value: dealsDeployed,
    })
  }
}

type DealDeployed = {
  id: Hash256
  deal: ChainSpecificAddress
  manager: ChainSpecificAddress
}

function parseDealDeployed(
  log: providers.Log,
  chainShortName: string,
): DealDeployed {
  const [_, id, deal, manager] = log.topics

  assert(id, 'id is required')
  assert(deal, 'deal is required')
  assert(manager, 'manager is required')

  return {
    id: Hash256(id),
    deal: fieldToAddress(deal, chainShortName),
    manager: fieldToAddress(manager, chainShortName),
  }
}

function fieldToAddress(field: string, chainShortName: string) {
  const address = `0x${field.slice(2 + 24)}`
  return ChainSpecificAddress.from(chainShortName, address)
}
