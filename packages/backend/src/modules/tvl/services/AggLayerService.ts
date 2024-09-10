import { Logger } from '@l2beat/backend-tools'
import { AmountRecord } from '@l2beat/database'
import {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  Bytes,
  EthereumAddress,
  UnixTime,
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

type AggLayerAmountConfig =
  | AggLayerL2Token
  | AggLayerNativeEtherPreminted
  | AggLayerNativeEtherWrapped

type Config = AggLayerAmountConfig & { id: string }

export interface AggLayerServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  logger: Logger
}

export class AggLayerService {
  constructor(private readonly $: AggLayerServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getL2TokensAmounts(
    tokens: (AggLayerL2Token & { id: string })[],
    blockNumber: number,
    timestamp: UnixTime,
  ) {
    const tokensWithL2Addresses = await this.getL2TokensAddresses(
      tokens,
      blockNumber,
    )

    return await this.getL2TokensTotalSupply(
      tokensWithL2Addresses,
      blockNumber,
      timestamp,
    )
  }

  async getL2TokensTotalSupply(
    tokens: (AggLayerL2Token & { address: EthereumAddress; id: string })[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const encoded: MulticallRequest[] = tokens.map((token) => ({
      address: token.address,
      data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, index) => {
      const token = tokens[index]
      const [value] = erc20Interface.decodeFunctionResult(
        'totalSupply',
        response.data.toString(),
      )
      return {
        configId: token.id,
        timestamp,
        amount: (value as BigNumber).toBigInt(),
      }
    })
  }

  async getL2TokensAddresses(
    tokens: (AggLayerL2Token & { id: string })[],
    blockNumber: number,
  ): Promise<(AggLayerL2Token & { address: EthereumAddress; id: string })[]> {
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

  async getNativeEtherPremintedAmount(
    token: AggLayerNativeEtherPreminted & { id: string },
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord> {
    const bridgeBalance = await this.$.rpcClient.getBalance(
      token.l2BridgeAddress,
      blockNumber,
    )
    const amount = BigInt(token.premintedAmount) - bridgeBalance.toBigInt()
    return {
      configId: token.id,
      amount,
      timestamp,
    }
  }

  async getNativeEtherWrappedAmount(
    token: AggLayerNativeEtherWrapped & { id: string },
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord> {
    const response = await this.$.rpcClient.call(
      {
        to: token.wethAddress,
        data: Bytes.fromHex(
          erc20Interface.encodeFunctionData('totalSupply', []),
        ),
      },
      blockNumber,
    )

    const [totalSupply] = erc20Interface.decodeFunctionResult(
      'totalSupply',
      response.toString(),
    )

    return {
      configId: token.id,
      amount: (totalSupply as BigNumber).toBigInt(),
      timestamp,
    }
  }
}

// getData in: tokens: AggLayerL2Token[] nativeToken: AggLayerNativeEtherPreminted | AggLayerNativeEtherWrapped | undefined
