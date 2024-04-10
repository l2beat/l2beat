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
  readonly erc20Codec: ERC20MulticallCodec
  readonly nativeAssetCodec?: NativeAssetMulticallCodec
  logger: Logger
}

interface Amount {
  configurationId: string
  amount: bigint
}

export class AmountService {
  constructor(private readonly $: AmountServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  public async fetchAmounts(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    const nativeAssetCodecAtBlock = getNativeAssetCodecAtBlock(
      this.$.nativeAssetCodec,
      blockNumber,
    )
    const [forRpc, forMulticall] = partition(
      configurations,
      (c): c is Configuration<EscrowEntry> =>
        isNotSupportedByMulticall(nativeAssetCodecAtBlock, c),
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
          configurationId: configuration.id,
          amount: amount.toBigInt(),
        }
      }),
    )
  }

  private async fetchWithMulticall(
    configurations: Configuration<AmountConfiguration>[],
    blockNumber: number,
  ): Promise<Amount[]> {
    if (configurations.length === 0) {
      return []
    }

    const nativeAssetCodecAtBlock = getNativeAssetCodecAtBlock(
      this.$.nativeAssetCodec,
      blockNumber,
    )
    const erc20Codec = this.$.erc20Codec

    const encoded = configurations.map((configuration) => ({
      ...encodeForMulticall(nativeAssetCodecAtBlock, erc20Codec, configuration),
    }))

    const responses = await this.$.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, i): Amount => {
      const amount = decodeForMulticall(
        nativeAssetCodecAtBlock,
        erc20Codec,
        configurations[i],
        response,
      )

      // In the rare event of a contract call revert we do not want backend to stop because of it
      // That is why we set the amount to 0n & report the error to the logger
      if (amount === undefined) {
        this.$.logger.error(
          `Failed to decode amount for configuration ${configurations[i].id}`,
        )
        return {
          configurationId: configurations[i].id,
          amount: 0n,
        }
      }

      return {
        configurationId: configurations[i].id,
        amount,
      }
    })
  }
}

function encodeForMulticall(
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

function decodeForMulticall(
  nativeAssetCodec: NativeAssetMulticallCodec | undefined,
  erc20Codec: ERC20MulticallCodec,
  { properties }: Configuration<AmountConfiguration>,
  response: MulticallResponse,
) {
  if (!response.success) {
    return
  }
  switch (properties.type) {
    case 'totalSupply':
      return erc20Codec.totalSupply.decode(response)
    case 'escrow':
      if (properties.address === 'native') {
        assert(
          nativeAssetCodec,
          `Programmer error: native codec should be defined`,
        )
        return nativeAssetCodec.balance.decode(response)
      }
      return erc20Codec.balance.decode(response)
    default:
      assertUnreachable(properties)
  }
}

function getNativeAssetCodecAtBlock(
  nativeAssetCodec: NativeAssetMulticallCodec | undefined,
  blockNumber: number,
) {
  return nativeAssetCodec && nativeAssetCodec.sinceBlock <= blockNumber
    ? nativeAssetCodec
    : undefined
}

function isNotSupportedByMulticall(
  nativeCodec: NativeAssetMulticallCodec | undefined,
  configuration: Configuration<AmountConfiguration>,
): configuration is Configuration<EscrowEntry> {
  return (
    configuration.properties.type === 'escrow' &&
    configuration.properties.address === 'native' &&
    nativeCodec === undefined
  )
}
