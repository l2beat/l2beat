import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import type { OpenApi } from '../../OpenApi'
import { getInteropChainsData, getInteropProtocolsData } from './getInteropData'
import {
  InteropChainsResultSchema,
  InteropProtocolsResultSchema,
} from './types'

export function addInteropRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/interop/protocols',
    {
      summary: 'List interop data per protocol.',
      tags: ['interop'],
      result: InteropProtocolsResultSchema,
    },
    async (_, res) => {
      const data = await cache.get(
        {
          key: ['interop', 'protocols'],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getInteropProtocolsData(db, ps),
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/interop/chains',
    {
      summary: 'List interop data per chain.',
      tags: ['interop'],
      result: InteropChainsResultSchema,
    },
    async (_, res) => {
      const data = await cache.get(
        {
          key: ['interop', 'chains'],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getInteropChainsData(db, ps),
      )

      res.json(data)
    },
  )
}
