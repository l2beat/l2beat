import { Logger } from '@l2beat/backend-tools'
import {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { MulticallRequest } from '../../../peripherals/multicall/types'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

export const bridgeInterface = new utils.Interface([
  'function getTokenWrappedAddress(uint32 originNetwork, address originTokenAddress) view returns (address)',
])

const BRIDGE_ADDRESS = EthereumAddress(
  '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
)

export interface AggLayerServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  logger: Logger
}

export class AggLayerService {
  constructor(private readonly $: AggLayerServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  //   async getTokensData(tokens: AggLayerL2Token[], blockNumber: number) {}

  async getL2TokensAddresses(
    tokens: AggLayerL2Token[],
    blockNumber: number,
  ): Promise<(AggLayerL2Token & { address: EthereumAddress })[]> {
    const encoded: MulticallRequest[] = tokens.map((token) => ({
      address: BRIDGE_ADDRESS,
      data: Bytes.fromHex(
        bridgeInterface.encodeFunctionData('getTokenWrappedAddress', [
          0, // originNetwork - 0 for Ethereum
          token.l1Address,
        ]),
      ),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, index) => {
      const token = tokens[index]
      const [address] = bridgeInterface.decodeFunctionResult(
        'getTokenWrappedAddress',
        response.data.toString(),
      )
      return {
        ...token,
        address: address as EthereumAddress,
      }
    })
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
