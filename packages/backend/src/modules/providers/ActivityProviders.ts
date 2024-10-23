import { Logger } from '@l2beat/backend-tools'
import { BlockExplorerClient, BlockProvider, RpcClient2 } from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { ActivityConfig } from '../../config/Config'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../peripherals/zksynclite/ZksyncLiteClient'
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

export class ActivityProviders {
  constructor(
    private readonly logger: Logger,
    private readonly rpcUopsAnalyzer: RpcUopsAnalyzer,
    private readonly starknetUopsAnalyzer: StarknetUopsAnalyzer,
    private readonly rpcClients: RpcClient2[],
    private readonly blockExplorerClients: BlockExplorerClient[],
    private readonly config: ActivityConfig,
    private readonly zksyncLiteClient: ZksyncLiteClient,
    private readonly starknetClient: StarknetClient,
    private readonly loopringClient: LoopringClient,
    private readonly degateClient: DegateClient,
    private readonly starkexClient: StarkexClient,
  ) {}

  // TODO: are project and chain the same?
  getTxsCountProvider(chain: string): TxsCountProvider {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.config.type) {
      case 'rpc': {
        const clients = this.rpcClients.filter((r) => r.chain === chain)
        assert(
          clients.length > 0,
          `There should be clients defined for ${chain}`,
        )

        const provider = new BlockProvider(clients)

        return new RpcTxsCountProvider(
          provider,
          project.id,
          this.rpcUopsAnalyzer,
          project.config.assessCount,
        )
      }
      case 'zksync': {
        return new ZKsyncLiteTxsCountProvider(this.zksyncLiteClient, project.id)
      }
      case 'starknet': {
        return new StarknetTxsCountProvider(
          this.starknetClient,
          project.id,
          this.starknetUopsAnalyzer,
        )
      }
      case 'loopring': {
        return new LoopringTxsCountProvider(this.loopringClient, project.id)
      }
      case 'degate': {
        return new DegateTxsCountProvider(this.degateClient, project.id)
      }
      case 'starkex': {
        return new StarkexTxsCountProvider(
          this.starkexClient,
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

    const blockExplorerClient = this.blockExplorerClients.find((b) => b.chain)

    const clients = this.rpcClients.filter((r) => r.chain === chain)
    assert(clients.length > 0, `There should be clients defined for ${chain}`)

    const provider = new BlockProvider(clients)

    return new BlockTimestampProvider({
      client: provider,
      logger: this.logger.tag(`activity_${project.id}`),
      blockExplorerClient,
    })
  }
}
