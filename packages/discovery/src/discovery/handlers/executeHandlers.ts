import { EthereumAddress, getErrorMessage } from '@l2beat/shared-pure'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { Handler, HandlerResult } from './Handler'

export async function executeHandlers(
  provider: DiscoveryProvider,
  handlers: Handler[],
  address: EthereumAddress,
  blockNumber: number,
  logger: DiscoveryLogger,
) {
  const results: HandlerResult[] = []
  const batches = orderByDependencies(handlers)
  for (const batch of batches) {
    const fields = Object.fromEntries(results.map((r) => [r.field, r]))
    const batchResults = await Promise.all(
      batch.map(async (x) => {
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

function orderByDependencies(handlers: Handler[]) {
  const known = new Set<string>()
  const batches = []
  const remaining = new Set(handlers)
  while (remaining.size > 0) {
    const batch = []
    for (const handler of remaining) {
      if (handler.dependencies.every((x) => known.has(x))) {
        batch.push(handler)
      }
    }
    if (batch.length === 0) {
      throw new Error('Impossible to resolve dependencies')
    }
    for (const handler of batch) {
      known.add(handler.field)
      remaining.delete(handler)
    }
    batches.push(batch)
  }
  return batches
}
