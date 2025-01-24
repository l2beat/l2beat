import type { AmountRecord } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import {
  Bytes,
  type ElasticChainL2Token,
  type EthereumAddress,
  type UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { MulticallRequest } from '../../../peripherals/multicall/types'
import type { ElasticChainAmountConfig } from '../indexers/types'

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
    const results: AmountRecord[] = []

    const ether = tokens.find((token) => token.type === 'elasticChainEther')
    if (ether) {
      const etherAmount = await this.getEtherAmount(
        timestamp,
        blockNumber,
        ether,
      )
      results.push(etherAmount)
    }

    const l2Tokens = tokens.filter(
      (token) => token.type === 'elasticChainL2Token',
    )
    const l2TokensAmounts = await this.getL2TokensAmounts(
      timestamp,
      blockNumber,
      l2Tokens,
    )
    results.push(...l2TokensAmounts)

    return results
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

    if (response.toString() === '0x') {
      return {
        configId: token.id,
        amount: 0n,
        timestamp,
      }
    }
    const amount = BigInt(response.toString())

    return {
      configId: token.id,
      amount,
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
      const amount = BigInt(response.data.toString())

      return {
        configId: token.id,
        timestamp,
        amount,
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
