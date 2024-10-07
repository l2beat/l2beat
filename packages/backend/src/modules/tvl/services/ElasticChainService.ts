import { AmountRecord } from '@l2beat/database'
import {
  assert,
  Bytes,
  ElasticChainL2Token,
  EthereumAddress,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { MulticallRequest } from '../../../peripherals/multicall/types'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { ElasticChainAmountConfig } from '../indexers/types'

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

export const bridgeInterface = new utils.Interface([
  'function l2TokenAddress(address _l1Token) view returns (address)',
])

export type Config<T extends ElasticChainAmountConfig['type']> =
  ElasticChainAmountConfig & { type: T } & { id: string }

export interface ElasticChainServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  readonly bridgeAddress: EthereumAddress
}

export class ElasticChainService {
  constructor(private readonly $: ElasticChainServiceDependencies) {}

  async fetchAmounts(
    timestamp: UnixTime,
    blockNumber: number,
    tokens: Config<'elasticChainL2Token' | 'elasticChainEther'>[],
  ): Promise<AmountRecord[]> {
    const l2Tokens = tokens.filter(
      (token) => token.type === 'elasticChainL2Token',
    )

    const ether = tokens.find((token) => token.type === 'elasticChainEther')
    assert(ether, 'ElasticChainEther config not found')
    const etherAmount = await this.getEtherAmount(timestamp, blockNumber, ether)

    const l2TokensAmounts = await this.getL2TokensAmounts(
      timestamp,
      blockNumber,
      l2Tokens,
    )

    return [...l2TokensAmounts, etherAmount]
  }

  async getEtherAmount(
    timestamp: UnixTime,
    blockNumber: number,
    token: Config<'elasticChainEther'>,
  ): Promise<AmountRecord> {
    const response = await this.$.rpcClient.call(
      {
        to: token.address,
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

  async getL2TokensAmounts(
    timestamp: UnixTime,
    blockNumber: number,
    tokens: Config<'elasticChainL2Token'>[],
  ) {
    const tokensWithL2Addresses = await this.getL2TokensAddresses(
      blockNumber,
      tokens,
    )

    return await this.getL2TokensTotalSupply(
      timestamp,
      blockNumber,
      tokensWithL2Addresses,
    )
  }

  async getL2TokensTotalSupply(
    timestamp: UnixTime,
    blockNumber: number,
    tokens: (Config<'elasticChainL2Token'> & { address: EthereumAddress })[],
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
      if (response.data.toString() === '0x') {
        return {
          configId: token.id,
          timestamp,
          amount: 0n,
        }
      }
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
    blockNumber: number,
    tokens: Config<'elasticChainL2Token'>[],
  ): Promise<
    (ElasticChainL2Token & { address: EthereumAddress; id: string })[]
  > {
    const encoded: MulticallRequest[] = tokens.map((token) => ({
      address: this.$.bridgeAddress,
      data: Bytes.fromHex(
        bridgeInterface.encodeFunctionData('l2TokenAddress', [token.l1Address]),
      ),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses
      .map((response, index) => {
        const token = tokens[index]
        if (response.data.toString() === '0x') {
          return
        }

        const [address] = bridgeInterface.decodeFunctionResult(
          'l2TokenAddress',
          response.data.toString(),
        )
        return {
          ...token,
          address,
        }
      })
      .filter(notUndefined)
  }
}
