import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { EthereumClient } from './EthereumClient'

export const MULTICALL_BATCH_SIZE = 150
export const MULTICALL_V1_BLOCK = 7929876
export const MULTICALL_V1_ADDRESS = EthereumAddress(
  '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
)
export const MULTICALL_V2_BLOCK = 12336033
export const MULTICALL_V2_ADDRESS = EthereumAddress(
  '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
)

export interface MulticallRequest {
  address: EthereumAddress
  data: Bytes
}

export interface MulticallResponse {
  success: boolean
  data: Bytes
}

export class MulticallClient {
  constructor(private readonly ethereumClient: EthereumClient) {}

  async multicallNamed(
    requests: Record<string, MulticallRequest>,
    blockNumber: number,
  ): Promise<Record<string, MulticallResponse>> {
    const entries = Object.entries(requests)
    const results = await this.multicall(
      entries.map((x) => x[1]),
      blockNumber,
    )
    const resultEntries = results.map(
      (result, i) => [entries[i][0], result] as const,
    )
    return Object.fromEntries(resultEntries)
  }

  async multicall(requests: MulticallRequest[], blockNumber: number) {
    try {
      if (blockNumber < MULTICALL_V1_BLOCK) {
        return this.executeIndividual(requests, blockNumber)
      }
      const batches = toBatches(requests, MULTICALL_BATCH_SIZE)
      const batchedResults = await Promise.all(
        batches.map((batch) => this.executeBatch(batch, blockNumber)),
      )
      return batchedResults.flat()
    } catch (e) {
      throw new Error(
        `Ethereum multicall failed for block number:  ${blockNumber}. Call size was ${requests.length}.`,
      )
    }
  }

  private async executeIndividual(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const results = await Promise.all(
      requests.map((request) =>
        this.ethereumClient.call(
          {
            to: request.address,
            data: request.data,
          },
          blockNumber,
        ),
      ),
    )
    return results.map(
      (result): MulticallResponse => ({
        success: result.length !== 0,
        data: result,
      }),
    )
  }

  private async executeBatch(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    if (blockNumber < MULTICALL_V2_BLOCK) {
      const encoded = encodeMulticallV1(requests)
      const result = await this.ethereumClient.call(
        {
          to: MULTICALL_V1_ADDRESS,
          data: encoded,
        },
        blockNumber,
      )
      return decodeMulticallV1(result)
    } else {
      const encoded = encodeMulticallV2(requests)
      const result = await this.ethereumClient.call(
        {
          to: MULTICALL_V2_ADDRESS,
          data: encoded,
        },
        blockNumber,
      )
      return decodeMulticallV2(result)
    }
  }
}

export function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

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
