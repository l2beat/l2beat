import { utils } from 'ethers'
import { MULTICALL } from '../../constants'
import { AsyncCache } from '../AsyncCache'
import { AlchemyApi } from './AlchemyApi'

const MULTICALL_ABI = new utils.Interface([
  `function aggregate(tuple(address target, bytes callData)[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData)`,
])

export interface MulticallRequest {
  address: string
  data: string
}

export interface MulticallResponse {
  success: boolean
  data: string
}

export class MulticallApi {
  constructor(private alchemyApi: AlchemyApi, private asyncCache: AsyncCache) {}

  async multicall(
    requests: Record<string, MulticallRequest>,
    blockNumber: number
  ): Promise<Record<string, MulticallResponse>> {
    const known: [string, MulticallResponse][] = []
    const unknown: [string, MulticallRequest][] = []
    for (const [key, request] of Object.entries(requests)) {
      const cached = await this.asyncCache.get(
        ['multicall', blockNumber, request.address, request.data],
        (x): string => x
      )
      if (cached) {
        known.push([key, dataToResponse(cached)])
      } else {
        unknown.push([key, request])
      }
    }
    if (unknown.length > 0) {
      const callData = MULTICALL_ABI.encodeFunctionData('aggregate', [
        unknown.map(([, request]) => [request.address, request.data]),
      ])
      const returnData = await this.alchemyApi.call(
        MULTICALL,
        callData,
        blockNumber
      )
      const [, result] = MULTICALL_ABI.decodeFunctionResult(
        'aggregate',
        returnData
      )
      for (const [i, [key, request]] of unknown.entries()) {
        this.asyncCache.set(
          ['multicall', blockNumber, request.address, request.data],
          result[i],
          (x) => x
        )
        known.push([key, dataToResponse(result[i])])
      }
    }
    return Object.fromEntries(known)
  }
}

function dataToResponse(data: string): MulticallResponse {
  return {
    success: data !== '0x',
    data: data,
  }
}
