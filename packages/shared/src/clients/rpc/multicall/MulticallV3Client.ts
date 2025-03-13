import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { RpcClient } from '../RpcClient'
import type { CallParameters } from '../types'

interface MulticallV3Response {
  success: boolean
  data: Bytes
}

export const multicallInterface = new utils.Interface([
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
])

// ClientCore functionality is provided via RpcClient
export class MulticallV3Client {
  constructor(
    private readonly rpc: RpcClient,
    private readonly address: EthereumAddress,
  ) {}

  async multicall(
    requests: CallParameters[],
    blockNumber: number,
  ): Promise<MulticallV3Response[]> {
    const encoded = this.encode(requests)
    const result = await this.rpc.call(encoded, blockNumber)
    return this.decode(result)
  }

  encode(requests: CallParameters[]) {
    const string = multicallInterface.encodeFunctionData('tryAggregate', [
      false,
      requests.map((request) => [
        request.to.toString(),
        request.data?.toString() ?? '',
      ]),
    ])
    return {
      to: this.address,
      data: Bytes.fromHex(string),
    }
  }

  decode(result: Bytes) {
    const decoded = multicallInterface.decodeFunctionResult(
      'tryAggregate',
      result.toString(),
    )
    const values = decoded[0] as [boolean, string][]
    return values.map(([success, data]): MulticallV3Response => {
      const bytes = Bytes.fromHex(data)
      return {
        success: success && bytes.length !== 0,
        data: bytes,
      }
    })
  }
}
