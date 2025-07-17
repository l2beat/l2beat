import type { ChainSpecificAddress } from '@l2beat/shared-pure'

import { getErrorMessage } from '../../utils/getErrorMessage'
import type { IProvider } from '../provider/IProvider'
import type { Handler, HandlerResult } from './Handler'

export async function executeHandlers(
  provider: IProvider,
  handlers: Handler[],
  address: ChainSpecificAddress,
): Promise<HandlerResult[]> {
  const results: HandlerResult[] = []
  const batches = orderByDependencies(handlers)
  for (const batch of batches) {
    const fields = Object.fromEntries(results.map((r) => [r.field, r]))
    const batchResults = await Promise.all(
      batch.map(async (x) => {
        try {
          return await x.execute(provider, address, fields)
        } catch (e) {
          return { field: x.field, error: getErrorMessage(e) }
        }
      }),
    )
    results.push(...batchResults)
  }
  return results
}

function orderByDependencies(handlers: Handler[]): Handler[][] {
  const known = new Set<string>()
  const batches = []
  const remaining = new Set(handlers)
  while (remaining.size > 0) {
    const batch: Handler[] = []
    for (const handler of remaining) {
      if (
        handler.dependencies.every((x) => known.has(x) || x.startsWith('$'))
      ) {
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
