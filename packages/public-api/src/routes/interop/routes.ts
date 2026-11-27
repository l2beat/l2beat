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
      operationId: 'listInteropProtocols',
      summary: 'List interop data per protocol.',
      description: INTEROP_DESCRIPTION,
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
      operationId: 'listInteropChains',
      summary: 'List interop data per chain.',
      description: INTEROP_DESCRIPTION,
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

const INTEROP_DESCRIPTION = [
  'Transfers between chains over the last 24 hours, from a snapshot we refresh about once an hour. `timestamp` on each item is the end of those 24 hours: check it to see how fresh the snapshot is. When we fall behind on a chain, its last numbers are carried into newer snapshots for up to a day, so a fresh snapshot can hold older numbers for that chain.',
  'Values are in USD and durations in seconds. The list is empty when there is no snapshot yet.',
].join('\n\n')
