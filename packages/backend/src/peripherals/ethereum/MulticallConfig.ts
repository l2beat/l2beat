import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  MulticallConfigEntry,
  MulticallRequest,
  MulticallResponse,
} from './types'

export const MULTICALL_V1_ADDRESS = EthereumAddress(
  '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
)

export const ETHEREUM_MULTICALL_CONFIG: MulticallConfigEntry[] = [
  {
    blockNumber: 12336033,
    batchSize: 150,
    address: EthereumAddress('0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'),
    encodeBatch: encodeMulticallV2,
    decodeBatch: decodeMulticallV2,
  },
  {
    blockNumber: 7929876,
    batchSize: 150,
    address: MULTICALL_V1_ADDRESS,
    encodeBatch: encodeMulticallV1,
    decodeBatch: decodeMulticallV1,
  },
]

export const multicallInterface = new utils.Interface([
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
