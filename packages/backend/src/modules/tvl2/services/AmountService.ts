import { Logger } from '@l2beat/backend-tools'
import {
  assertUnreachable,
  EscrowEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { partition } from 'lodash'

import {
  erc20Codec,
  nativeAssetCodec,
} from '../../../peripherals/multicall/codecs'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../../peripherals/multicall/types'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { Configuration } from '../../../tools/uif/multi/types'
import { AmountRecord } from '../repositories/AmountRepository'

export type ChainAmountConfig = EscrowEntry | TotalSupplyEntry

export interface AmountServiceDependencies {
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  logger: Logger
}

interface Amount {
  configId: string
  amount: bigint
}

export class AmountService {
  constructor(private readonly $: AmountServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  public async fetchAmounts(
    configurations: Configuration<ChainAmountConfig>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const [forRpc, forMulticall] = partition(
      configurations,
      (c): c is Configuration<EscrowEntry> =>
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
    configurations: Configuration<EscrowEntry>[],
    blockNumber: number,
  ): Promise<Amount[]> {
    return Promise.all(
      configurations.map(async (configuration) => {
        const amount = await this.$.rpcClient.getBalance(
          configuration.properties.escrowAddress,
          blockNumber,
        )

        return {
          configId: configuration.id,
          amount: amount.toBigInt(),
        }
      }),
    )
  }

  private async fetchWithMulticall(
    configurations: Configuration<ChainAmountConfig>[],
    blockNumber: number,
  ): Promise<Amount[]> {
    if (configurations.length === 0) {
      return []
    }
    const encoded = configurations.map((configuration) => ({
      ...this.encodeForMulticall(configuration),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, i): Amount => {
      const amount = this.decodeForMulticall(configurations[i], response)

      // In the rare event of a contract call revert we do not want backend to stop because of it
      // That is why we set the amount to 0n & report the error to the logger
      if (amount === undefined) {
        this.$.logger.error(
          `Failed to decode amount for configuration ${configurations[i].id}`,
        )
        return {
          configId: configurations[i].id,
          amount: 0n,
        }
      }

      return {
        configId: configurations[i].id,
        amount,
      }
    })
  }

  encodeForMulticall({
    properties,
  }: Configuration<ChainAmountConfig>): MulticallRequest {
    switch (properties.type) {
      case 'totalSupply':
        return erc20Codec.totalSupply.encode(properties.address)
      case 'escrow':
        if (properties.address === 'native') {
          return nativeAssetCodec.balance.encode(properties.escrowAddress)
        }
        return erc20Codec.balance.encode(
          properties.escrowAddress,
          properties.address,
        )
      default:
        assertUnreachable(properties)
    }
  }

  decodeForMulticall(
    { properties }: Configuration<ChainAmountConfig>,
    response: MulticallResponse,
  ) {
    if (!response.success) {
      return
    }
    switch (properties.type) {
      case 'totalSupply':
        return erc20Codec.totalSupply.decode(response.data)
      case 'escrow':
        if (properties.address === 'native') {
          return nativeAssetCodec.balance.decode(response.data)
        }
        return erc20Codec.balance.decode(response.data)
      default:
        assertUnreachable(properties)
    }
  }
}

function isNotSupportedByMulticall(
  configuration: Configuration<ChainAmountConfig>,
  multicallClient: MulticallClient,
  blockNumber: number,
): configuration is Configuration<EscrowEntry> {
  return (
    configuration.properties.type === 'escrow' &&
    configuration.properties.address === 'native' &&
    !multicallClient.isNativeBalanceSupported(blockNumber)
  )
}
