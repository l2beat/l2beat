import { utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { MulticallConfig, MulticallRequest, MulticallResponse } from './types'

export const multicallConfig = {
  ethereum: getMulticall3Config(14353601),
  arbitrum: getMulticall3Config(7654707),
  optimism: getMulticall3Config(4286263),
  base: getMulticall3Config(5022),
  avalanche: getMulticall3Config(11907934),
  bsc: getMulticall3Config(15921452),
  celo: getMulticall3Config(13112599),
  gnosis: getMulticall3Config(21022491),
  linea: getMulticall3Config(42),
  polygonpos: getMulticall3Config(25770160),
  polygonzkevm: getMulticall3Config(57746),
}

export function getMulticall3Config(
  sinceBlock: number,
  address = EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
  batchSize = 150,
): MulticallConfig {
  return {
    address,
    sinceBlock,
    batchSize,
    encodeBatch: encodeMulticall3,
    decodeBatch: decodeMulticall3,
  }
}

export const multicallInterface = new utils.Interface([
  'function multicall(tuple(address, bytes)[] memory calls) public returns (bytes[] memory results)',
  'function aggregate(tuple(address target, bytes callData)[] calls) public returns (uint256 blockNumber, bytes[] returnData)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
])

export function encodeMulticall3(requests: MulticallRequest[]): Bytes {
  const string = multicallInterface.encodeFunctionData('tryAggregate', [
    false,
    requests.map((request): [string, string] => [
      request.address.toString(),
      request.data.toString(),
    ]),
  ])
  return Bytes.fromHex(string)
}

export function decodeMulticall3(result: Bytes): MulticallResponse[] {
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
