/**
 * The only place V2 constructs RPC access.
 *
 * V1's `AllProviders` gives batching (same-tick calls become one multicall),
 * reorg-aware caching in the shared SQLite file that `.discovery.json` points
 * at, and explorer clients per chain. Reusing it means a benchmark run at a
 * committed block mostly replays cached responses, and that every value V2
 * reads went through the same code path as the V1 value it is compared with.
 *
 * Benchmarks fix the block, so `getProvider` takes a block number directly
 * and only falls back to V1's timestamp-to-block resolution when a timestamp
 * is all the caller has. Everything downstream receives an `IProvider`, which
 * tests replace with `mockObject<IProvider>`.
 */

import type { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  getChainConfigs,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

export type ProviderTarget = { blockNumber: number } | { timestamp: number }

export function createProviders(logger: Logger): AllProviders {
  const paths = getDiscoveryPaths()
  return new AllProviders(
    getChainConfigs(),
    new HttpClient(),
    new SQLiteCache(paths.cache),
    logger,
  )
}

export function getProvider(
  allProviders: Pick<AllProviders, 'get' | 'getByBlockNumber'>,
  chain: string,
  target: ProviderTarget,
): Promise<IProvider> {
  if ('blockNumber' in target) {
    return allProviders.getByBlockNumber(chain, target.blockNumber)
  }
  return allProviders.get(chain, UnixTime(target.timestamp))
}
