import { Database } from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../config/Config'
import { BlockProviders } from '../../providers/BlockProviders'
import { Providers } from '../../providers/Providers'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import { TxsCountService } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { DegateTxsCountService } from './services/txs/DegateTxsCountService'
import { FuelTxsCountService } from './services/txs/FuelTxsCountService'
import { LoopringTxsCountService } from './services/txs/LoopringTxsCountService'
import { StarkexTxsCountService } from './services/txs/StarkexTxsCountService'
import { StarknetTxsCountService } from './services/txs/StarknetTxsCountService'
import { StarknetUopsAnalyzer } from './services/uops/analyzers/StarknetUopsAnalyzer'

export class ActivityDependencies {
  private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer
  private readonly blockProviders: BlockProviders

  constructor(
    private readonly config: ActivityConfig,
    readonly database: Database,
    providers: Providers,
  ) {
    this.starknetUopsAnalyzer = new StarknetUopsAnalyzer()
    this.blockProviders = providers.getBlockProviders()
  }

  getTxsCountService(chain: string): TxsCountService {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc':
      case 'zksync': {
        const provider = this.blockProviders.getBlockProvider(chain)

        return new BlockTxsCountService({
          provider,
          projectId: project.id,
          type: project.config.type,
          assessCount:
            project.config.type === 'zksync'
              ? undefined
              : project.config.assessCount,
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
      case 'loopring': {
        assert(
          this.blockProviders.loopringClient,
          'loopringClient should be defined',
        )
        return new LoopringTxsCountService(
          this.blockProviders.loopringClient,
          project.id,
        )
      }
      case 'degate': {
        assert(
          this.blockProviders.degateClient,
          'degateClient should be defined',
        )
        return new DegateTxsCountService(
          this.blockProviders.degateClient,
          project.id,
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
      case 'fuel': {
        assert(this.blockProviders.fuelClient, 'fuelClient should be defined')
        return new FuelTxsCountService(
          this.blockProviders.fuelClient,
          project.id,
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
