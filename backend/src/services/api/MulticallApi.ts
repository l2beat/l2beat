import { utils } from 'ethers'
import { AsyncCache } from '../AsyncCache'
import { AlchemyApi } from './AlchemyApi'

const MULTICALL_ADDRESS = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'
const MULTICALL_ABI = new utils.Interface([
  `function tryAggregate(
    bool requireSuccess,
    tuple(address target, bytes calldata)[] calls
  ) public returns (
    tuple(bool success, bytes returnData)[] returnData
  )`,
])

interface MulticallRequest {
  address: string
  data: string
}

interface MulticallResponse {
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
        (x): MulticallResponse => x
      )
      if (cached) {
        known.push([key, cached])
      } else {
        unknown.push([key, request])
      }
    }
    const callData = MULTICALL_ABI.encodeFunctionData('tryAggregate', [
      false,
      unknown.map(([, request]) => [request.address, request.data]),
    ])
    const returnData = await this.alchemyApi.call(
      MULTICALL_ADDRESS,
      callData,
      blockNumber
    )
    const [result] = MULTICALL_ABI.decodeFunctionResult(
      'tryAggregate',
      returnData
    )
    for (const [i, [key, request]] of unknown.entries()) {
      const value: MulticallResponse = {
        success: result[i][0],
        data: result[i][1],
      }
      this.asyncCache.set(
        ['multicall', blockNumber, request.address, request.data],
        value,
        (x) => x
      )
      known.push([key, value])
    }
    return Object.fromEntries(known)
  }
}
