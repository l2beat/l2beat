import type { Database } from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import type { ActivityConfig } from '../../config/Config'
import type { Providers } from '../../providers/Providers'
import type { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import type { TxsCountService } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { StarkexTxsCountService } from './services/txs/StarkexTxsCountService'
import { RpcUopsAnalyzer } from './services/uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from './services/uops/analyzers/StarknetUopsAnalyzer'

export class ActivityDependencies {
  private readonly rpcUopsAnalyzer: RpcUopsAnalyzer
  private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer

  constructor(
    private readonly config: ActivityConfig,
    readonly database: Database,
    private readonly providers: Providers,
  ) {
    this.rpcUopsAnalyzer = new RpcUopsAnalyzer()
    this.starknetUopsAnalyzer = new StarknetUopsAnalyzer()
  }

  getTxsCountService(chain: string): TxsCountService {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc': {
        const provider = this.providers.block.getBlockProvider(chain)

        return new BlockTxsCountService({
          provider,
          projectId: project.id,
          assessCount: project.config.assessCount,
          uopsAnalyzer: this.rpcUopsAnalyzer,
        })
      }
      case 'starknet': {
        const provider = this.providers.block.getBlockProvider(chain)
        return new BlockTxsCountService({
          provider,
          projectId: project.id,
          uopsAnalyzer: this.starknetUopsAnalyzer,
        })
      }
      case 'zksync':
      case 'fuel':
      case 'degate3':
      case 'loopring': {
        const provider = this.providers.block.getBlockProvider(chain)
        return new BlockTxsCountService({
          provider,
          projectId: project.id,
        })
      }
      case 'starkex': {
        assert(
          this.providers.block.starkexClient,
          'starkexClient should be defined',
        )
        return new StarkexTxsCountService(
          this.providers.block.starkexClient,
          project.id,
          project.config.product,
        )
      }

      default:
        assertUnreachable(project.config)
    }
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.providers.block.getBlockTimestampProvider(chain)
  }
}
