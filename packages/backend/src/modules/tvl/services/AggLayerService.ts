import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

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

  async getNativeEtherWrapped(
    token: AggLayerNativeEtherWrapped,
    blockNumber: number,
  ): Promise<bigint> {
    const response = await this.$.rpcClient.call(
      {
        to: token.wethAddress,
        data: Bytes.fromHex(
          erc20Interface.encodeFunctionData('totalSupply', []),
        ),
      },
      blockNumber,
    )

    const [value] = erc20Interface.decodeFunctionResult(
      'totalSupply',
      response.toString(),
    )

    return (value as BigNumber).toBigInt()
  }
}

// getData in: tokens: AggLayerL2Token[] nativeToken: AggLayerNativeEtherPreminted | AggLayerNativeEtherWrapped | undefined

// getTokensData in: tokens: AggLayerL2Token[]
// getNativeEtherWrapped in: token: AggLayerNativeEtherWrapped
