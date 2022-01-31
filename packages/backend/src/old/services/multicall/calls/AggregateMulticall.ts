import { utils } from 'ethers'

import { MulticallRequest } from '../MulticallRequest'

const coder = new utils.Interface([
  `function aggregate(tuple(address target, bytes callData)[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData)`,
])

export const AggregateMulticall = {
  encode(requests: MulticallRequest[]) {
    return coder.encodeFunctionData('aggregate', [
      requests.map((request) => [request.address, request.data]),
    ])
  },
  decode(result: string) {
    const decoded = coder.decodeFunctionResult('aggregate', result)
    return decoded[1] as string[]
  },
}
