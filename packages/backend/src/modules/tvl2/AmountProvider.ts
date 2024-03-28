import {
  assert,
  AssetId,
  Bytes,
  ChainId,
  EscrowEntry,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { UpdateConfiguration } from '@l2beat/uif'
import { BigNumber, utils } from 'ethers'
import { partition } from 'lodash'

import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../peripherals/multicall/types'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { AmountRecord } from './repositories/AmountRepository'

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

export interface BalanceQuery {
  holder: EthereumAddress
  assetId: AssetId
}

export interface NativeBalanceEncoding {
  sinceBlock: number
  address: EthereumAddress
  encode: (address: EthereumAddress) => Bytes
  decode: (response: Bytes) => bigint
}

export class AmountProvider {
  constructor(
    private readonly rpcClient: RpcClient,
    private readonly multicallClient: MulticallClient,
    private readonly chainId: ChainId,
    private readonly nativeBalanceEncoding: NativeBalanceEncoding | undefined,
  ) {}

  public getChainId(): ChainId {
    return this.chainId
  }

  public async fetchAmounts(
    configurations: UpdateConfiguration<EscrowEntry>[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<AmountRecord[]> {
    const nativeEncoding =
      this.nativeBalanceEncoding &&
      this.nativeBalanceEncoding.sinceBlock <= blockNumber
        ? this.nativeBalanceEncoding
        : undefined

    const [native, nonNative] = partition(
      configurations,
      (c) => c.properties.address === 'native' && nativeEncoding === undefined,
    )

    const nonNativeCalls = nonNative.map((configuration) =>
      this.encodeForMulticall(configuration.properties, nativeEncoding),
    )
    const nonNativeResponses = await this.multicallClient.multicall(
      nonNativeCalls,
      blockNumber,
    )

    const nativeResponses = await Promise.all(
      native.map((configuration) =>
        this.rpcClient.getBalance(
          configuration.properties.escrowAddress,
          blockNumber,
        ),
      ),
    )

    let nonNativeIndex = 0
    let nativeIndex = 0
    return configurations.map((configuration) => {
      if (
        this.usesNativeCall(configuration.properties.address, nativeEncoding)
      ) {
        const response = nativeResponses[nativeIndex++]
        return {
          configurationId: +configuration.id,
          timestamp,
          amount: response.toBigInt(),
        }
      } else {
        const response = nonNativeResponses[nonNativeIndex++]
        return {
          configurationId: +configuration.id,
          timestamp,
          amount: this.decodeForMulticall(
            response,
            configuration.properties,
            nativeEncoding,
          ),
        }
      }
    })
  }

  private encodeForMulticall(
    { address, escrowAddress, chain }: EscrowEntry,
    nativeEncoding: NativeBalanceEncoding | undefined,
  ): MulticallRequest {
    if (address === 'native') {
      assert(nativeEncoding, `No native balance encoding for chain ${chain}`)

      return {
        address: nativeEncoding.address,
        data: nativeEncoding.encode(escrowAddress),
      }
    }

    return encodeErc20BalanceQuery(escrowAddress, address)
  }

  private usesNativeCall(
    address: EthereumAddress | 'native',
    nativeEncoding: NativeBalanceEncoding | undefined,
  ): boolean {
    return address === 'native' && nativeEncoding === undefined
  }

  private decodeForMulticall(
    response: MulticallResponse,
    configuration: EscrowEntry,
    nativeEncoding: NativeBalanceEncoding | undefined,
  ) {
    if (!response.success) {
      throw new Error(
        'Multicall failed for ' + configuration.address.toString(),
      )
    }
    if (configuration.address === 'native') {
      assert(nativeEncoding, `No native balance encoding `)
      return nativeEncoding.decode(response.data)
    }
    return decodeErc20BalanceQuery(response.data)
  }
}

function encodeErc20BalanceQuery(
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
  const [value] = erc20Interface.decodeFunctionResult(
    'balanceOf',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}
