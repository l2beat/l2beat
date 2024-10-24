import { Database } from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../config/Config'
import { BlockProviders } from '../../providers/BlockProviders'
import { Providers } from '../../providers/Providers'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import { TxsCountService } from './indexers/types'
import { DegateTxsCountService } from './services/txs/DegateTxsCountService'
import { LoopringTxsCountService } from './services/txs/LoopringTxsCountService'
import { RpcTxsCountService } from './services/txs/RpcTxsCountService'
import { StarkexTxsCountService } from './services/txs/StarkexTxsCountService'
import { StarknetTxsCountService } from './services/txs/StarknetTxsCountService'
import { ZKsyncLiteTxsCountService } from './services/txs/ZKsyncLiteTxsCountService'
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
      case 'rpc': {
        const provider = this.blockProviders.getEvmBlockProvider(chain)

        return new RpcTxsCountService(
          provider,
          project.id,
          this.rpcUopsAnalyzer,
          project.config.assessCount,
        )
      }
      case 'zksync': {
        return new ZKsyncLiteTxsCountService(
          this.blockProviders.zksyncLiteClient,
          project.id,
        )
      }
      case 'starknet': {
        return new StarknetTxsCountService(
          this.blockProviders.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'loopring': {
        return new LoopringTxsCountService(
          this.blockProviders.loopringClient,
          project.id,
        )
      }
      case 'degate': {
        return new DegateTxsCountService(
          this.blockProviders.degateClient,
          project.id,
        )
      }
      case 'starkex': {
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
