import { assert, Logger } from '@l2beat/backend-tools'
import {
  assertUnreachable,
  EscrowEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '@l2beat/uif'
import { partition } from 'lodash'

import {
  ERC20MulticallCodec,
  NativeAssetMulticallCodec,
} from '../../peripherals/multicall/codecs'
import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../peripherals/multicall/types'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { AmountRecord } from './repositories/AmountRepository'

export type AmountConfiguration = EscrowEntry | TotalSupplyEntry

export interface AmountServiceDependencies {
  readonly logger: Logger
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  readonly nativeAssetCodec?: NativeAssetMulticallCodec
  readonly erc20Codec: ERC20MulticallCodec
}

export class AmountService {
  constructor(private readonly dependencies: AmountServiceDependencies) {}

  public async fetchAmounts(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const [nonMulticall, multicall] = partition(configurations, (c) =>
      isNotSupportedByMulticall(
        this.dependencies.nativeAssetCodec,
        c,
        blockNumber,
      ),
    )

    const nonMulticallAmounts = await this.getNonMulticallAmounts(
      // TODO: solve it better with types
      nonMulticall as Configuration<EscrowEntry>[],
      blockNumber,
    )

    const multicallAmounts = await this.getMulticallAmounts(
      multicall,
      blockNumber,
    )

    return [...nonMulticallAmounts, ...multicallAmounts].map((amount) => ({
      ...amount,
      timestamp,
    }))
  }

  async getNonMulticallAmounts(
    nonMulticall: Configuration<EscrowEntry>[],
    blockNumber: number,
  ) {
    return Promise.all(
      nonMulticall.map(async (configuration) => {
        const amount = await this.dependencies.rpcClient.getBalance(
          configuration.properties.escrowAddress,
          blockNumber,
        )

        return {
          configurationId: +configuration.id,
          amount: amount.toBigInt(),
        }
      }),
    )
  }

  private async getMulticallAmounts(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
  ) {
    const encoded = configurations.map((configuration) => ({
      ...this.encodeForMulticall(configuration, blockNumber),
    }))

    const responses = await this.dependencies.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, i) => {
      const configuration = configurations[i]
      // In the rare event of a contract call revert we do not want backend to stop because of it
      // That is why we set the amount to 0n & report the error to the logger
      const amount =
        this.decodeForMulticall(configuration, blockNumber, response) ?? 0n

      return {
        configurationId: +configuration.id,
        amount,
      }
    })
  }

  private encodeForMulticall(
    { properties }: Configuration<AmountConfiguration>,
    blockNumber: number,
  ): MulticallRequest {
    const nativeAssetEncoder = getNativeCodecForBlock(
      this.dependencies.nativeAssetCodec,
      blockNumber,
    )
    const erc20Codec = this.dependencies.erc20Codec

    switch (properties.type) {
      case 'totalSupply':
        return erc20Codec.totalSupply.encode(properties.address)
      case 'escrow':
        if (properties.address === 'native') {
          assert(
            nativeAssetEncoder,
            `No native balance encoding for chain ${properties.chain}`,
          )
          return nativeAssetEncoder.balance.encode(properties.escrowAddress)
        }
        return erc20Codec.balance.encode({
          holder: properties.escrowAddress,
          token: properties.address,
        })
      default:
        assertUnreachable(properties)
    }
  }

  private decodeForMulticall(
    { id, properties }: Configuration<AmountConfiguration>,
    blockNumber: number,
    response: MulticallResponse,
  ) {
    const nativeAssetCodec = getNativeCodecForBlock(
      this.dependencies.nativeAssetCodec,
      blockNumber,
    )
    const erc20Codec = this.dependencies.erc20Codec

    if (!response.success) {
      this.dependencies.logger.error(
        `Multicall failed for configuration: ${id}}`,
      )
      return
    }
    switch (properties.type) {
      case 'totalSupply':
        return erc20Codec.totalSupply.decode(response)
      case 'escrow':
        if (properties.address === 'native') {
          assert(nativeAssetCodec, `No native balance encoding `)
          return nativeAssetCodec.balance.decode(response)
        }
        return erc20Codec.balance.decode(response)
      default:
        assertUnreachable(properties)
    }
  }
}

export function getNativeCodecForBlock(
  nativeAssetCodec: NativeAssetMulticallCodec | undefined,
  blockNumber: number,
) {
  return nativeAssetCodec && nativeAssetCodec.sinceBlock <= blockNumber
    ? nativeAssetCodec
    : undefined
}

export function isNotSupportedByMulticall(
  nativeCodec: NativeAssetMulticallCodec | undefined,
  configuration: Configuration<AmountConfiguration>,
  blockNumber: number,
) {
  const nativeAssetBalanceEncoder = getNativeCodecForBlock(
    nativeCodec,
    blockNumber,
  )

  return (
    configuration.properties.type === 'escrow' &&
    configuration.properties.address === 'native' &&
    nativeAssetBalanceEncoder === undefined
  )
}
