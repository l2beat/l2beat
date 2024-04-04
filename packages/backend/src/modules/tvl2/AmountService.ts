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
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  readonly nativeAssetCodec?: NativeAssetMulticallCodec
  readonly erc20Codec: ERC20MulticallCodec
  readonly logger: Logger
}

export class AmountService {
  constructor(private readonly dependencies: AmountServiceDependencies) {}

  public async fetchAmounts(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const nativeAssetCodecAtBlock = this.getNativeAssetCodecAtBlock(blockNumber)
    const [forRpc, forMulticall] = partition(configurations, (c) =>
      isNotSupportedByMulticall(nativeAssetCodecAtBlock, c),
    )

    const rpcAmounts = await this.fetchWithRpc(
      // TODO: solve it better with types
      forRpc as Configuration<EscrowEntry>[],
      blockNumber,
    )

    const multicallAmounts = await this.fetchWithMulticall(
      forMulticall,
      blockNumber,
    )

    return [...rpcAmounts, ...multicallAmounts].map((amount) => ({
      ...amount,
      timestamp,
    }))
  }

  async fetchWithRpc(
    configurations: Configuration<EscrowEntry>[],
    blockNumber: number,
  ) {
    return Promise.all(
      configurations.map(async (configuration) => {
        let amount: bigint
        try {
          amount = (
            await this.dependencies.rpcClient.getBalance(
              configuration.properties.escrowAddress,
              blockNumber,
            )
          ).toBigInt()
        } catch (_) {
          this.dependencies.logger.error(`Revert detected ${configuration.id}`)
          amount = 0n
        }

        return {
          configurationId: +configuration.id,
          amount,
        }
      }),
    )
  }

  private async fetchWithMulticall(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
  ) {
    const nativeAssetCodecAtBlock = this.getNativeAssetCodecAtBlock(blockNumber)
    const erc20Codec = this.dependencies.erc20Codec

    const encoded = configurations.map((configuration) => ({
      ...this.encodeForMulticall(
        nativeAssetCodecAtBlock,
        erc20Codec,
        configuration,
      ),
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
        this.decodeForMulticall(
          nativeAssetCodecAtBlock,
          erc20Codec,
          configuration,
          response,
        ) ?? 0n

      return {
        configurationId: +configuration.id,
        amount,
      }
    })
  }

  private encodeForMulticall(
    nativeAssetCodec: NativeAssetMulticallCodec | undefined,
    erc20Codec: ERC20MulticallCodec,
    { properties }: Configuration<AmountConfiguration>,
  ): MulticallRequest {
    switch (properties.type) {
      case 'totalSupply':
        return erc20Codec.totalSupply.encode(properties.address)
      case 'escrow':
        if (properties.address === 'native') {
          assert(
            nativeAssetCodec,
            `No native balance encoding for chain ${properties.chain}`,
          )
          return nativeAssetCodec.balance.encode(properties.escrowAddress)
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
    nativeAssetCodec: NativeAssetMulticallCodec | undefined,
    erc20Codec: ERC20MulticallCodec,
    { id, properties }: Configuration<AmountConfiguration>,
    response: MulticallResponse,
  ) {
    if (!response.success) {
      this.dependencies.logger.error(`Revert detected: ${id}}`)
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

  getNativeAssetCodecAtBlock(blockNumber: number) {
    return this.dependencies.nativeAssetCodec &&
      this.dependencies.nativeAssetCodec.sinceBlock <= blockNumber
      ? this.dependencies.nativeAssetCodec
      : undefined
  }
}

export function isNotSupportedByMulticall(
  nativeCodec: NativeAssetMulticallCodec | undefined,
  configuration: Configuration<AmountConfiguration>,
) {
  return (
    configuration.properties.type === 'escrow' &&
    configuration.properties.address === 'native' &&
    nativeCodec === undefined
  )
}
