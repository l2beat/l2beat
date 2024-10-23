import { Logger } from '@l2beat/backend-tools'
import { BlockProvider } from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../config/Config'
import { TxsCountProvider } from '../activity/indexers/types'
import { DegateTxsCountProvider } from '../activity/services/providers/DegateTxsCountProvider'
import { LoopringTxsCountProvider } from '../activity/services/providers/LoopringTxsCountProvider'
import { RpcTxsCountProvider } from '../activity/services/providers/RpcTxsCountProvider'
import { StarkexTxsCountProvider } from '../activity/services/providers/StarkexTxsCountProvider'
import { StarknetTxsCountProvider } from '../activity/services/providers/StarknetTxsCountProvider'
import { ZKsyncLiteTxsCountProvider } from '../activity/services/providers/ZKsyncLiteTxsCountProvider'
import { RpcUopsAnalyzer } from '../activity/services/uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from '../activity/services/uops/analyzers/StarknetUopsAnalyzer'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
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

        return new RpcTxsCountProvider(
          provider,
          project.id,
          this.rpcUopsAnalyzer,
          project.config.assessCount,
        )
      }
      case 'zksync': {
        return new ZKsyncLiteTxsCountProvider(
          this.clients.zksyncLiteClient,
          project.id,
        )
      }
      case 'starknet': {
        return new StarknetTxsCountProvider(
          this.clients.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'loopring': {
        return new LoopringTxsCountProvider(
          this.clients.loopringClient,
          project.id,
        )
      }
      case 'degate': {
        return new DegateTxsCountProvider(this.clients.degateClient, project.id)
      }
      case 'starkex': {
        return new StarkexTxsCountProvider(
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
