import { Database } from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../config/Config'
import { BlockProviders } from '../../providers/BlockProviders'
import { Providers } from '../../providers/Providers'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import { TxsCountService } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { StarkexTxsCountService } from './services/txs/StarkexTxsCountService'
import { StarknetTxsCountService } from './services/txs/StarknetTxsCountService'
import { RpcUopsAnalyzer } from './services/uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from './services/uops/analyzers/StarknetUopsAnalyzer'

export class ActivityDependencies {
  private readonly rpcUopsAnalyzer: RpcUopsAnalyzer
  private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer
  private readonly blockProviders: BlockProviders

  constructor(
    private readonly config: ActivityConfig,
    readonly database: Database,
    providers: Providers,
  ) {
    this.rpcUopsAnalyzer = new RpcUopsAnalyzer()
    this.starknetUopsAnalyzer = new StarknetUopsAnalyzer()
    this.blockProviders = providers.getBlockProviders()
  }

  getTxsCountService(chain: string): TxsCountService {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'degate3':
      case 'loopring':
      case 'fuel': {
        const provider = this.blockProviders.getBlockProvider(chain)

        return new BlockTxsCountService({
          provider,
          projectId: project.id,
          assessCount:
            project.config.type === 'rpc'
              ? project.config.assessCount
              : undefined,
          rpcUopsAnalyzer: this.rpcUopsAnalyzer,
        })
      }
      case 'starknet': {
        assert(
          this.blockProviders.starknetClient,
          'starknetClient should be defined',
        )
        return new StarknetTxsCountService(
          this.blockProviders.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'starkex': {
        assert(
          this.blockProviders.starkexClient,
          'starkexClient should be defined',
        )
        return new StarkexTxsCountService(
          this.blockProviders.starkexClient,
          project.id,
          project.config.product,
        )
      }

      default:
        assertUnreachable(project.config)
    }
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.blockProviders.getBlockTimestampProvider(chain)
  }
}
