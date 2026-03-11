import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type SecuritizeClassSwapActorsHandlerDefinition = v.infer<
  typeof SecuritizeClassSwapActorsHandlerDefinition
>
export const SecuritizeClassSwapActorsHandlerDefinition = v.strictObject({
  type: v.literal('securitizeClassSwapActors'),
})

const classSwapAbi = new utils.Interface([
  'function sourceServiceConsumer() view returns (address)',
])
const dsServiceConsumerAbi = new utils.Interface([
  'function getDSService(uint256) view returns (address)',
])
const registryAbi = new utils.Interface([
  'event DSRegistryServiceWalletAdded(address wallet, string investorId, address sender)',
  'event DSRegistryServiceWalletRemoved(address wallet, string investorId, address sender)',
])

const REGISTRY_SERVICE_ID = 4

export class SecuritizeClassSwapActorsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: SecuritizeClassSwapActorsHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const sourceServiceConsumer = await provider.callMethod<string>(
      address,
      classSwapAbi.getFunction('sourceServiceConsumer'),
      [],
    )
    assert(sourceServiceConsumer !== undefined)

    const sourceServiceConsumerAddress = ChainSpecificAddress.from(
      provider.chain,
      EthereumAddress(sourceServiceConsumer),
    )
    const sourceRegistryService = await provider.callMethod<string>(
      sourceServiceConsumerAddress,
      dsServiceConsumerAbi.getFunction('getDSService'),
      [REGISTRY_SERVICE_ID],
    )
    assert(sourceRegistryService !== undefined)

    const sourceRegistryServiceAddress = ChainSpecificAddress.from(
      provider.chain,
      EthereumAddress(sourceRegistryService),
    )
    const logs = await provider.getLogs(sourceRegistryServiceAddress, [
      [
        registryAbi.getEventTopic('DSRegistryServiceWalletAdded'),
        registryAbi.getEventTopic('DSRegistryServiceWalletRemoved'),
      ],
    ])

    return {
      field: this.field,
      value: parseCurrentWallets(provider.chain, logs),
    }
  }
}

function parseCurrentWallets(chain: string, logs: providers.Log[]) {
  const orderedLogs = [...logs].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber - b.blockNumber
    }
    return a.logIndex - b.logIndex
  })

  const currentWallets = new Map<string, ChainSpecificAddress>()
  for (const log of orderedLogs) {
    const parsed = registryAbi.parseLog(log)
    const wallet = ChainSpecificAddress.from(
      chain,
      EthereumAddress(parsed.args.wallet),
    )
    if (parsed.name === 'DSRegistryServiceWalletAdded') {
      currentWallets.set(wallet.toString(), wallet)
      continue
    }
    if (parsed.name === 'DSRegistryServiceWalletRemoved') {
      currentWallets.delete(wallet.toString())
      continue
    }
    assert(false)
  }

  return [...currentWallets.values()]
}
