import { Logger } from '@l2beat/backend-tools'
import { BlockProvider } from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../config/Config'
import { TxsCountProvider } from '../modules/activity/indexers/types'
import { DegateTxsCountService } from '../modules/activity/services/txs/DegateTxsCountService'
import { LoopringTxsCountService } from '../modules/activity/services/txs/LoopringTxsCountService'
import { RpcTxsCountService } from '../modules/activity/services/txs/RpcTxsCountService'
import { StarkexTxsCountService } from '../modules/activity/services/txs/StarkexTxsCountService'
import { StarknetTxsCountService } from '../modules/activity/services/txs/StarknetTxsCountService'
import { ZKsyncLiteTxsCountService } from '../modules/activity/services/txs/ZKsyncLiteTxsCountService'
import { RpcUopsAnalyzer } from '../modules/activity/services/uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from '../modules/activity/services/uops/analyzers/StarknetUopsAnalyzer'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { BlockClients } from './BlockClients'

export class ActivityProviders {
  constructor(
    private readonly config: ActivityConfig,
    private readonly clients: BlockClients,
    private readonly rpcUopsAnalyzer: RpcUopsAnalyzer,
    private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer,
    private readonly logger: Logger,
  ) {}

  getTxsCountProvider(chain: string): TxsCountProvider {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc': {
        const clients = this.clients.getEvmClients(chain)
        const provider = new BlockProvider(clients)

        return new RpcTxsCountService(
          provider,
          project.id,
          this.rpcUopsAnalyzer,
          project.config.assessCount,
        )
      }
      case 'zksync': {
        return new ZKsyncLiteTxsCountService(
          this.clients.zksyncLiteClient,
          project.id,
        )
      }
      case 'starknet': {
        return new StarknetTxsCountService(
          this.clients.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'loopring': {
        return new LoopringTxsCountService(
          this.clients.loopringClient,
          project.id,
        )
      }
      case 'degate': {
        return new DegateTxsCountService(this.clients.degateClient, project.id)
      }
      case 'starkex': {
        return new StarkexTxsCountService(
          this.clients.starkexClient,
          project.id,
          project.config.product,
        )
      }

      default:
        assertUnreachable(project.config)
    }
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    assert(project.config.type !== 'starkex')

    const indexerClients = this.clients.getIndexerClients(chain)

    const clients = this.clients.getEvmClients(chain)

    return new BlockTimestampProvider({
      indexerClients: indexerClients,
      blockClients: clients,
      logger: this.logger.tag(`activity_${project.id}`),
    })
  }
}
