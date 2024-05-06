import { assert } from '@l2beat/backend-tools'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { MulticallClient } from '../provider/multicall/MulticallClient'
import { MulticallRequest } from '../provider/multicall/types'
import { Handler, HandlerResult, MulticallableHandler } from './Handler'

export async function executeHandlers(
  provider: DiscoveryProvider,
  multicallClient: MulticallClient,
  handlers: Handler[],
  address: EthereumAddress,
  blockNumber: number,
  logger: DiscoveryLogger,
): Promise<HandlerResult[]> {
  const results: HandlerResult[] = []

  const batches = orderByDependenciesWithMulticall(handlers)
  for (const batch of batches) {
    const fields = Object.fromEntries(results.map((r) => [r.field, r]))
    if (batch.multicallable.length > 0) {
      const encodedNamedRequests = new Map<string, MulticallRequest[]>()
      for (const handler of batch.multicallable) {
        const requests = handler.encode(address, fields)
        assert(requests)
        encodedNamedRequests.set(handler.field, requests)
      }
      const multicallResults = await multicallClient.multicallNamed(
        Object.fromEntries(encodedNamedRequests),
        blockNumber,
      )

      for (const handler of batch.multicallable) {
        const encoded = multicallResults[handler.field]
        assert(encoded)
        const decoded = handler.decode(encoded)
        results.push(decoded)
      }
    }

    const batchResults = await Promise.all(
      batch.nonMulticallable.map(async (x) => {
        try {
          const result = await x.execute(provider, address, blockNumber, fields)
          if (result.error) {
            logger.logExecutionError(x.field, result.error)
          }
          return result
        } catch (e) {
          return { field: x.field, error: getErrorMessage(e) }
        }
      }),
    )
    results.push(...batchResults)
  }
  return results
}

function orderByDependenciesWithMulticall(handlers: Handler[]): {
  multicallable: MulticallableHandler[]
  nonMulticallable: Handler[]
}[] {
  const known = new Set<string>()
  const batches = []
  const remaining = new Set(handlers)
  while (remaining.size > 0) {
    const multicallableBatch: MulticallableHandler[] = []
    const nonMulticallableBatch: Handler[] = []
    for (const handler of remaining) {
      if (handler.dependencies.every((x) => known.has(x))) {
        if (handler.multicallable) {
          multicallableBatch.push(handler)
        } else {
          nonMulticallableBatch.push(handler)
        }
      }
    }
    if (multicallableBatch.length === 0 && nonMulticallableBatch.length === 0) {
      throw new Error('Impossible to resolve dependencies')
    }
    for (const handler of [...multicallableBatch, ...nonMulticallableBatch]) {
      known.add(handler.field)
      remaining.delete(handler)
    }
    batches.push({
      multicallable: multicallableBatch,
      nonMulticallable: nonMulticallableBatch,
    })
  }
  return batches
}
