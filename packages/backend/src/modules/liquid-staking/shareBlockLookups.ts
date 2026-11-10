import type { UnixTime } from '@l2beat/shared-pure'
import type { EthereumBlockFinder } from './types'

/**
 * One lookup per timestamp for every indexer that asks, as the token indexers
 * ask for the same hours. A failed lookup is forgotten, so a retry asks again.
 */
export function shareBlockLookups(
  finder: EthereumBlockFinder,
): EthereumBlockFinder {
  const found = new Map<UnixTime, Promise<number>>()
  return {
    getBlockNumberAtOrBefore: (timestamp) => {
      let block = found.get(timestamp)
      if (!block) {
        block = finder.getBlockNumberAtOrBefore(timestamp)
        found.set(timestamp, block)
        block.catch(() => found.delete(timestamp))
      }
      return block
    },
  }
}
