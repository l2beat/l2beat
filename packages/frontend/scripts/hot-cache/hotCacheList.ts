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
