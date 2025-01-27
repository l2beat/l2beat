import type { Logger } from '@l2beat/backend-tools'
import {
  assert,
  Bytes,
  type EscrowEntry,
  type EthereumAddress,
  type UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { partition } from 'lodash'

import type { AmountRecord } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { utils } from 'ethers'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type {
  MulticallRequest,
  MulticallResponse,
} from '../../../peripherals/multicall/types'
import type { ChainAmountConfig } from '../indexers/types'

export const multicallInterface = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

type Config = ChainAmountConfig & { id: string }

export interface AmountServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  logger: Logger
}

export class AmountService {
  constructor(private readonly $: AmountServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  public async fetchAmounts(
    timestamp: UnixTime,
    blockNumber: number,
    configurations: Config[],
  ): Promise<(AmountRecord & { type: 'escrow' | 'totalSupply' })[]> {
    const [forRpc, forMulticall] = partition(
      configurations,
      (c): c is EscrowEntry & { id: string } =>
        isNotSupportedByMulticall(c, this.$.multicallClient, blockNumber),
    )

    const rpcAmounts = await this.fetchWithRpc(forRpc, blockNumber)

    const multicallAmounts = await this.fetchWithMulticall(
      forMulticall,
      blockNumber,
    )

    return [...rpcAmounts, ...multicallAmounts].map((amount) => ({
      ...amount,
      timestamp,
    }))
  }

  private async fetchWithRpc(
    configurations: (EscrowEntry & { id: string })[],
    blockNumber: number,
  ) {
    return await Promise.all(
      configurations.map(async (configuration) => {
        const amount = await this.$.rpcClient.getBalance(
          configuration.escrowAddress,
          blockNumber,
        )

        return {
          configId: configuration.id,
          type: configuration.type,
          amount,
        }
      }),
    )
  }

  async fetchWithMulticall(configurations: Config[], blockNumber: number) {
    if (configurations.length === 0) {
      return []
    }
    const encoded = configurations.map((configuration) => ({
      ...this.encodeForMulticall(configuration, blockNumber),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, i) => {
      const amount = this.decodeForMulticall(configurations[i], response)

      // In the rare event of a contract call revert we do not want backend to stop because of it
      // That is why we set the amount to 0n & report the error to the logger
      if (amount === undefined) {
        this.$.logger.error(
          `Failed to decode amount for configuration ${configurations[i].id}`,
        )
        return {
          configId: configurations[i].id,
          type: configurations[i].type,
          amount: 0n,
        }
      }

      return {
        configId: configurations[i].id,
        type: configurations[i].type,
        amount,
      }
    })
  }

  encodeForMulticall(
    configuration: Config,
    blockNumber: number,
  ): MulticallRequest {
    switch (configuration.type) {
      case 'totalSupply':
        return encodeErc20TotalSupplyQuery(configuration.address)
      case 'escrow':
        if (configuration.address === 'native') {
          // choose multicall address based on block number
          const multicallAddress =
            this.$.multicallClient.getMulticallAddressAt(blockNumber)

          assert(multicallAddress, 'Multicall address not found')

          return encodeGetEthBalance(
            multicallAddress,
            configuration.escrowAddress,
          )
        }
        return encodeErc20BalanceQuery(
          configuration.escrowAddress,
          configuration.address,
        )
      default:
        assertUnreachable(configuration)
    }
  }

  decodeForMulticall(configuration: Config, response: MulticallResponse) {
    if (!response.success) {
      return
    }
    switch (configuration.type) {
      case 'totalSupply':
        return decodeErc20TotalSupplyQuery(response.data)
      case 'escrow':
        if (configuration.address === 'native') {
          return decodeGetEthBalance(response.data)
        }
        return decodeErc20BalanceQuery(response.data)
      default:
        assertUnreachable(configuration)
    }
  }
}

function isNotSupportedByMulticall(
  configuration: Config,
  multicallClient: MulticallClient,
  blockNumber: number,
): configuration is EscrowEntry & { id: string } {
  return (
    configuration.type === 'escrow' &&
    configuration.address === 'native' &&
    !multicallClient.isNativeBalanceSupported(blockNumber)
  )
}

export function encodeGetEthBalance(
  multicall: EthereumAddress,
  address: EthereumAddress,
): MulticallRequest {
  return {
    address: multicall,
    data: Bytes.fromHex(
      multicallInterface.encodeFunctionData('getEthBalance', [
        address.toString(),
      ]),
    ),
  }
}

function decodeGetEthBalance(response: Bytes) {
  return BigInt(response.toString())
}

export function encodeErc20BalanceQuery(
  holder: EthereumAddress,
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder.toString()]),
    ),
  }
}

function decodeErc20BalanceQuery(response: Bytes): bigint {
  return BigInt(response.toString())
}

export function encodeErc20TotalSupplyQuery(
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}

function decodeErc20TotalSupplyQuery(response: Bytes): bigint {
  return BigInt(response.toString())
}
