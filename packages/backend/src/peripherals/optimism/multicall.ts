import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import {
  MulticallConfigEntry,
  MulticallRequest,
  MulticallResponse,
} from '../ethereum/types'

export const OPTIMISM_MULTICALL_CONFIG: MulticallConfigEntry[] = [
  {
    blockNumber: 0,
    batchSize: 150,
    address: EthereumAddress('0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe'),
    encodeBatch: encodeOptimismMulticall,
    decodeBatch: decodeOptimismMulticall,
  },
]

export const optimismMulticallInterface = new utils.Interface([
  'function multicall(tuple(address, bytes)[] memory calls) public returns (bytes[] memory results)',
])

export function encodeOptimismMulticall(requests: MulticallRequest[]) {
  const hexCalldata = optimismMulticallInterface.encodeFunctionData(
    'multicall',
    [
      requests.map((request) => [
        request.address.toString(),
        request.data.toString(),
      ]),
    ],
  )

  return Bytes.fromHex(hexCalldata)
}

export function decodeOptimismMulticall(response: Bytes): MulticallResponse[] {
  const decodedResponse = optimismMulticallInterface.decodeFunctionResult(
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
