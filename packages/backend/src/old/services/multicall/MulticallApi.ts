import { Logger } from '@l2beat/common'

import {
  MULTICALL,
  MULTICALL_BATCH_SIZE,
  MULTICALL_BLOCK_NUMBER,
} from '../../constants'
import { fastHash } from '../../utils'
import { AlchemyApi } from '../api/AlchemyApi'
import { AsyncCache } from '../AsyncCache'
import { AggregateMulticall } from './calls/AggregateMulticall'
import { MulticallRequest } from './MulticallRequest'

interface RequestWithCacheKey {
  cacheKey: string
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
    private logger: Logger,
  ) {}

  async multicall(
    requests: Record<string, MulticallRequest>,
    blockNumber: number,
  ): Promise<Record<string, MulticallResponse>> {
    const known: [string, MulticallResponse][] = []
    const unknown: [string, RequestWithCacheKey][] = []
    for (const [key, request] of Object.entries(requests)) {
      const cacheKey = getCacheKey(blockNumber, request)
      const cached = await this.asyncCache.get(cacheKey, (x): string => x)
      if (cached) {
        known.push([key, dataToResponse(cached)])
      } else {
        unknown.push([key, { ...request, cacheKey }])
      }
    }
    if (unknown.length > 0) {
      const requests = unknown.map((x) => x[1])
      const results =
        blockNumber >= MULTICALL_BLOCK_NUMBER
          ? await this.callInBatches(requests, blockNumber)
          : await this.callIndividually(requests, blockNumber)
      for (const [i, [key]] of unknown.entries()) {
        known.push([key, results[i]])
      }
    }
    return Object.fromEntries(known)
  }

  private async callInBatches(
    requests: RequestWithCacheKey[],
    blockNumber: number,
  ) {
    const batches = toBatches(requests, MULTICALL_BATCH_SIZE)
    const batchedResults = await Promise.all(
      batches.map((batch, i) =>
        this.executeBatch(batch, `${i + 1}/${batches.length}`, blockNumber),
      ),
    )
    return batchedResults.flat()
  }

  private async executeBatch(
    requests: RequestWithCacheKey[],
    batchId: string,
    blockNumber: number,
  ) {
    const callData = AggregateMulticall.encode(requests)
    const returnData = await this.alchemyApi.call(
      MULTICALL,
      callData,
      blockNumber,
    )
    this.logger.info(
      `fetched batch ${batchId} (${requests.length} calls) @ ${blockNumber}`,
    )
    const result = AggregateMulticall.decode(returnData)
    for (const [i, request] of requests.entries()) {
      this.asyncCache.set(request.cacheKey, result[i], (x) => x)
    }
    return result.map(dataToResponse)
  }

  private async callIndividually(
    requests: RequestWithCacheKey[],
    blockNumber: number,
  ) {
    let completed = 0
    return Promise.all(
      requests.map(async (request) => {
        const data = await this.alchemyApi.call(
          request.address,
          request.data,
          blockNumber,
        )
        this.asyncCache.set(request.cacheKey, data, (x) => x)
        completed++
        this.logger.info(
          `fetched request ${completed} of ${requests.length} @ ${blockNumber}`,
        )
        return dataToResponse(data)
      }),
    )
  }
}

function getCacheKey(blockNumber: number, request: MulticallRequest) {
  const addr = request.address.slice(-8)
  const hash = fastHash(request.data)
  return `mc-${blockNumber}-${addr}-${hash}`
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
