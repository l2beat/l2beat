import { BlockIndexerClient, RpcClient2 } from '@l2beat/shared'
import { ActivityConfig } from '../../config/Config'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../peripherals/zksynclite/ZksyncLiteClient'

export class BlockClients {
  constructor(
    readonly rpc: RpcClient2[],
    readonly blockExplorerClients: BlockIndexerClient[],
    readonly config: ActivityConfig,
    readonly zksyncLiteClient: ZksyncLiteClient,
    readonly starknetClient: StarknetClient,
    readonly loopringClient: LoopringClient,
    readonly degateClient: DegateClient,
    readonly starkexClient: StarkexClient,
  ) {}
}
