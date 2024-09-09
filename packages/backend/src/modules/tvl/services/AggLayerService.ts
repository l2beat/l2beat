import { Logger } from '@l2beat/backend-tools'
import { AggLayerNativeEtherPreminted } from '@l2beat/shared-pure'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

export interface AggLayerServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  logger: Logger
}

export class AggLayerService {
  constructor(private readonly $: AggLayerServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getNativeEtherPreminted(
    token: AggLayerNativeEtherPreminted,
    blockNumber: number,
  ): Promise<bigint> {
    const bridgeBalance = await this.$.rpcClient.getBalance(
      token.l2BridgeAddress,
      blockNumber,
    )
    return BigInt(token.premintedAmount) - bridgeBalance.toBigInt()
  }
}

// getData in: tokens: AggLayerL2Token[] nativeToken: AggLayerNativeEtherPreminted | AggLayerNativeEtherWrapped | undefined

// getTokensData in: tokens: AggLayerL2Token[]
// getNatieEtherPreminted in: token: AggLayerNativeEtherPreminted
// getNativeEtherWrapped in: token: AggLayerNativeEtherWrapped
