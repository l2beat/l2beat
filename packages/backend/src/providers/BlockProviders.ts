import { BlockIndexerClient, BlockProvider, RpcClient2 } from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { DegateClient } from '../peripherals/degate'
import { LoopringClient } from '../peripherals/loopring/LoopringClient'
import { StarkexClient } from '../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../peripherals/zksynclite/ZksyncLiteClient'

export class BlockProviders {
  constructor(
    private readonly config: ActivityConfig,
    private readonly evmClients: RpcClient2[],
    readonly zksyncLiteClient: ZksyncLiteClient,
    readonly starknetClient: StarknetClient,
    readonly loopringClient: LoopringClient,
    readonly degateClient: DegateClient,
    readonly starkexClient: StarkexClient,
    private readonly indexerClients: BlockIndexerClient[],
  ) {}

  getEvmBlockProvider(chain: string) {
    const clients = this.evmClients.filter((r) => r.chain === chain)
    assert(clients.length > 0, `No configured clients for ${chain}`)

    return new BlockProvider(clients)
  }

  getBlockTimestampProvider(chain: string) {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    const indexerClients = this.indexerClients.filter((c) => c.chain === chain)

    switch (project.config.type) {
      case 'rpc': {
        const blockClients = this.evmClients.filter((r) => r.chain === chain)
        assert(blockClients.length > 0, `No configured clients for ${chain}`)
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'zksync': {
        const blockClients = [this.zksyncLiteClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'starknet': {
        const blockClients = [this.starknetClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'loopring': {
        const blockClients = [this.loopringClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'degate': {
        const blockClients = [this.degateClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'starkex': {
        throw new Error('Starkex should not be handled with this method')
      }
      default:
        assertUnreachable(project.config)
    }
  }
}
