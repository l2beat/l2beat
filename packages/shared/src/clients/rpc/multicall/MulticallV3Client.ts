import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters } from '../types'

export interface MulticallV3Response {
  success: boolean
  data: Bytes
}

export const multicallInterface = new utils.Interface([
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public returns (tuple(bool success, bytes returnData)[] returnData)',
  'function getEthBalance(address account) view returns (uint256)',
])

export class MulticallV3Client {
  constructor(
    readonly address: EthereumAddress,
    readonly sinceBlock: number,
    readonly batchSize: number,
  ) {}

  encodeBatches(requests: CallParameters[]) {
    const batches = toBatches(requests, this.batchSize)

    return batches.map((batch) => {
      const calldata = multicallInterface.encodeFunctionData('tryAggregate', [
        false,
        batch.map((request) => [
          request.to.toString(),
          request.data.toString(),
        ]),
      ])

      return {
        to: this.address,
        data: Bytes.fromHex(calldata),
      }
    })
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

  encodeGetEthBalance(holder: string) {
    return {
      to: this.address,
      data: Bytes.fromHex(
        multicallInterface.encodeFunctionData('getEthBalance', [holder]),
      ),
    }
  }
}

function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
