import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../../config/Config'
import { BlockProviders } from '../../../providers/BlockProviders'
import { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'
import { TxsCountService } from '../indexers/types'
import { DegateTxsCountService } from './txs/DegateTxsCountService'
import { LoopringTxsCountService } from './txs/LoopringTxsCountService'
import { RpcTxsCountService } from './txs/RpcTxsCountService'
import { StarkexTxsCountService } from './txs/StarkexTxsCountService'
import { StarknetTxsCountService } from './txs/StarknetTxsCountService'
import { ZKsyncLiteTxsCountService } from './txs/ZKsyncLiteTxsCountService'
import { RpcUopsAnalyzer } from './uops/analyzers/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from './uops/analyzers/StarknetUopsAnalyzer'

export class ActivityServices {
  private readonly rpcUopsAnalyzer: RpcUopsAnalyzer
  private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer

  constructor(
    private readonly config: ActivityConfig,
    private readonly providers: BlockProviders,
  ) {
    this.rpcUopsAnalyzer = new RpcUopsAnalyzer()
    this.starknetUopsAnalyzer = new StarknetUopsAnalyzer()
  }

  getTxsCountService(chain: string): TxsCountService {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc': {
        const provider = this.providers.getEvmBlockProvider(chain)

        return new RpcTxsCountService(
          provider,
          project.id,
          this.rpcUopsAnalyzer,
          project.config.assessCount,
        )
      }
      case 'zksync': {
        return new ZKsyncLiteTxsCountService(
          this.providers.zksyncLiteClient,
          project.id,
        )
      }
      case 'starknet': {
        return new StarknetTxsCountService(
          this.providers.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'loopring': {
        return new LoopringTxsCountService(
          this.providers.loopringClient,
          project.id,
        )
      }
      case 'degate': {
        return new DegateTxsCountService(
          this.providers.degateClient,
          project.id,
        )
      }
      case 'starkex': {
        return new StarkexTxsCountService(
          this.providers.starkexClient,
          project.id,
          project.config.product,
        )
      }

      default:
        assertUnreachable(project.config)
    }
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.providers.getBlockTimestampProvider(chain)
  }
}
