import { MULTICALL, MULTICALL_BATCH_SIZE } from '../../constants'
import { AsyncCache } from '../AsyncCache'
import { Logger } from '../Logger'
import { AlchemyApi } from '../api/AlchemyApi'
import { AggregateMulticall } from './calls'

export interface MulticallRequest {
  address: string
  data: string
}

export interface MulticallResponse {
  success: boolean
  data: string
}

export class MulticallApi {
  constructor(
    private alchemyApi: AlchemyApi,
    private asyncCache: AsyncCache,
    private logger: Logger
  ) {}

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
      const requests = unknown.map((x) => x[1])
      const results = await this.callInBatches(requests, blockNumber)
      for (const [i, [key]] of unknown.entries()) {
        known.push([key, results[i]])
      }
    }
    return Object.fromEntries(known)
  }

  private async callInBatches(
    requests: MulticallRequest[],
    blockNumber: number
  ) {
    const batches = toBatches(requests, MULTICALL_BATCH_SIZE)
    const batchedResults = await Promise.all(
      batches.map((batch, i) =>
        this.executeBatch(batch, `${i + 1}/${batches.length}`, blockNumber)
      )
    )
    return batchedResults.flat()
  }

  private async executeBatch(
    requests: MulticallRequest[],
    batchId: string,
    blockNumber: number
  ) {
    const callData = AggregateMulticall.encode(requests)
    const returnData = await this.alchemyApi.call(
      MULTICALL,
      callData,
      blockNumber
    )
    this.logger.log(
      `fetched batch ${batchId} (${requests.length} calls) @ ${blockNumber}`
    )
    const result = AggregateMulticall.decode(returnData)
    for (const [i, request] of requests.entries()) {
      this.asyncCache.set(
        ['multicall', blockNumber, request.address, request.data],
        result[i],
        (x) => x
      )
    }
    return result.map(dataToResponse)
  }
}

function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

function dataToResponse(data: string): MulticallResponse {
  return {
    success: data !== '0x',
    data: data,
  }
}
