import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { Handler, HandlerResult } from './Handler'

export async function executeHandlers(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  handlers: Handler[],
) {
  const results: HandlerResult[] = []
  const batches = orderByDependencies(handlers)
  for (const batch of batches) {
    const fields = Object.fromEntries(results.map((r) => [r.field, r]))
    const batchResults = await Promise.all(
      batch.map((x) => x.execute(provider, address, fields)),
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
