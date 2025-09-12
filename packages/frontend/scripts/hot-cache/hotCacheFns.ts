// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import '../../src/dotenv'

import type { Request } from 'express'
import { getScalingTvsData } from '~/pages/scaling/tvs/getScalingTvsData'
import type { ICache } from '~/server/cache/ICache'
import { manifest } from '~/utils/Manifest'

class FakeCache implements ICache {
  get: <T>(
    options: {
      key: (string | undefined)[]
      ttl: number
      staleWhileRevalidate?: number
    },
    fallback: () => Promise<T>,
  ) => Promise<T> = (_, fallback) => {
    return fallback()
  }
}
const cache = new FakeCache()

/*
 * Hot cache functions
 *
 * This is a list of functions that are used to warm up the cache.
 * It is used in CI to warm up the cache before server starts.
 * Also, it is used on production server each 30 minute of every hour.
 * Do not add new functions here without a good reason.
 * I.e. getScalingTvsData is a database heavy function resulting in >3s of execution time.
 */
export const hotCacheFns: Record<string, () => Promise<unknown>> = {
  scalingTvs: () =>
    getScalingTvsData(
      {
        query: {
          tab: 'rollups',
        },
        originalUrl: '/scaling/tvs',
      } as Request<unknown, unknown, unknown, { tab: 'rollups' }>,
      manifest,
      cache,
    ),
}
