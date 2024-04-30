import { MulticallContractConfig } from '@l2beat/config'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  MulticallConfigEntry,
  MulticallRequest,
  MulticallResponse,
} from './types'

/** @deprecated Don't use this in future code, rely on configuration instead */
export const ETHEREUM_MULTICALL_V1_ADDRESS = EthereumAddress(
  '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
)

/** @deprecated Don't use this in future code, rely on configuration instead */
export const ETHEREUM_MULTICALL_V1_BLOCK = 7929876

export function toMulticallConfigEntry(
  config: MulticallContractConfig,
): MulticallConfigEntry {
  const [encodeBatch, decodeBatch, isNativeBalanceSupported] =
    getEncodeAndDecode(config.version)

  return {
    sinceBlock: config.sinceBlock,
    batchSize: config.batchSize,
    address: config.address,
    encodeBatch,
    decodeBatch,
    isNativeBalanceSupported,
  }
}

function getEncodeAndDecode(
  version: MulticallContractConfig['version'],
): [
  MulticallConfigEntry['encodeBatch'],
  MulticallConfigEntry['decodeBatch'],
  boolean,
] {
  switch (version) {
    case '1':
      return [encodeMulticallV1, decodeMulticallV1, true]
    case '2':
    case '3':
      return [encodeMulticallV2, decodeMulticallV2, true]
    case 'optimism':
      return [encodeOptimismMulticall, decodeOptimismMulticall, false]
  }
}

export const multicallInterface = new utils.Interface([
  'function multicall(tuple(address, bytes)[] memory calls) public returns (bytes[] memory results)',
  'function aggregate(tuple(address target, bytes callData)[] calls) public returns (uint256 blockNumber, bytes[] returnData)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
])

export function encodeMulticallV1(requests: MulticallRequest[]) {
  const string = multicallInterface.encodeFunctionData('aggregate', [
    requests.map((request) => [
      request.address.toString(),
      request.data.toString(),
    ]),
  ])
  return Bytes.fromHex(string)
}

export function decodeMulticallV1(result: Bytes) {
  const decoded = multicallInterface.decodeFunctionResult(
    'aggregate',
    result.toString(),
  )
  const values = decoded[1] as string[]
  return values.map(
    (data): MulticallResponse => ({
      success: data !== '0x',
      data: Bytes.fromHex(data),
    }),
  )
}

export function encodeMulticallV2(requests: MulticallRequest[]) {
  const string = multicallInterface.encodeFunctionData('tryAggregate', [
    false,
    requests.map((request) => [
      request.address.toString(),
      request.data.toString(),
    ]),
  ])
  return Bytes.fromHex(string)
}

export function decodeMulticallV2(result: Bytes) {
  const decoded = multicallInterface.decodeFunctionResult(
    'tryAggregate',
    result.toString(),
  )
  const values = decoded[0] as [boolean, string][]
  return values.map(([success, data]): MulticallResponse => {
    const bytes = Bytes.fromHex(data)
    return {
      success: success && bytes.length !== 0,
      data: bytes,
    }
  })
}

export function encodeOptimismMulticall(requests: MulticallRequest[]) {
  const hexCalldata = multicallInterface.encodeFunctionData('multicall', [
    requests.map((request) => [
      request.address.toString(),
      request.data.toString(),
    ]),
  ])

  return Bytes.fromHex(hexCalldata)
}

export function decodeOptimismMulticall(response: Bytes): MulticallResponse[] {
  const decodedResponse = multicallInterface.decodeFunctionResult(
    'multicall',
    response.toString(),
  )

  const values = decodedResponse[0] as string[]

  return values.map(
    (data): MulticallResponse => ({
      success: data !== '0x',
      data: Bytes.fromHex(data),
    }),
  )
}
