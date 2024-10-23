import { BlockIndexerClient, RpcClient2 } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { StarkexClient } from '../../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ZksyncLiteClient } from '../../peripherals/zksynclite/ZksyncLiteClient'

export class BlockClients {
  constructor(
    private readonly evmClients: RpcClient2[],
    readonly zksyncLiteClient: ZksyncLiteClient,
    readonly starknetClient: StarknetClient,
    readonly loopringClient: LoopringClient,
    readonly degateClient: DegateClient,
    readonly starkexClient: StarkexClient,
    private readonly indexerClients: BlockIndexerClient[],
  ) {}

  getEvmClients(chain: string) {
    const clients = this.evmClients.filter((r) => r.chain === chain)
    assert(clients.length > 0, `No configured clients for ${chain}`)
    return clients
  }

  getIndexerClients(chain: string) {
    return this.indexerClients.filter((r) => r.chain === chain)
  }
}
