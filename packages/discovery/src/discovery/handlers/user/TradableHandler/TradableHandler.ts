import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'

const abi = [
  'event DealDeployed(string indexed id, address indexed deal, address indexed manager)',
]
const iface = new utils.Interface(abi)
const topic0 = iface.getEventTopic('DealDeployed')

export type TradableDefinition = v.infer<typeof TradableDefinition>
export const TradableDefinition = v.strictObject({
  type: v.literal('tradable'),
})

/**
 * I could've used EventHandler but
 * indexed fields there are pretty wonky.
 */
export class TradableHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(readonly field: string) {}

  async execute(
    provider: IProvider,
    dealFactory: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(dealFactory, [topic0])

    const chainShortName = ChainSpecificAddress.chain(dealFactory)

    const dealsDeployed = logs.map((log) =>
      parseDealDeployed(log, chainShortName),
    )

    return {
      field: this.field,
      value: dealsDeployed,
    }
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
  const [id, deal, manager] = iface.parseLog(log).args

  return {
    id: Hash256(id.hash),
    deal: ChainSpecificAddress.from(chainShortName, deal),
    manager: ChainSpecificAddress.from(chainShortName, manager),
  }
}
