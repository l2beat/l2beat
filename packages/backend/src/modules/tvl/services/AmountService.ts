import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  EscrowEntry,
  UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { partition } from 'lodash'

import { AmountRecord } from '@l2beat/database'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import {
  erc20Codec,
  nativeAssetCodec,
} from '../../../peripherals/multicall/codecs'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../../peripherals/multicall/types'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { ChainAmountConfig } from '../indexers/types'

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
          amount: amount.toBigInt(),
        }
      }),
    )
  }

  private async fetchWithMulticall(
    configurations: Config[],
    blockNumber: number,
  ) {
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
        return erc20Codec.totalSupply.encode(configuration.address)
      case 'escrow':
        if (configuration.address === 'native') {
          // choose multicall address based on block number
          const multicallAddress =
            this.$.multicallClient.getMulticallAddressAt(blockNumber)

          assert(multicallAddress, 'Multicall address not found')

          return nativeAssetCodec.balance.encode(
            multicallAddress,
            configuration.escrowAddress,
          )
        }
        return erc20Codec.balance.encode(
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
        return erc20Codec.totalSupply.decode(response.data)
      case 'escrow':
        if (configuration.address === 'native') {
          return nativeAssetCodec.balance.decode(response.data)
        }
        return erc20Codec.balance.decode(response.data)
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
