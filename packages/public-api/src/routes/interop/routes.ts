import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import { BadRequestResponse, type OpenApi } from '../../OpenApi'
import { getInteropChainsData, getInteropProtocolsData } from './getInteropData'
import { getInteropPluginsData } from './getInteropPlugins'
import {
  getInteropMessagesData,
  getInteropTransfersData,
  interopRowsFingerprint,
  normalizeInteropRowsQuery,
} from './getInteropRows'
import {
  InteropChainsResultSchema,
  InteropMessagesQuerySchema,
  InteropMessagesResultSchema,
  InteropPluginsResultSchema,
  InteropProtocolsResultSchema,
  InteropTransfersQuerySchema,
  InteropTransfersResultSchema,
} from './types'
import { decodeCursor, type PageCursor } from './utils/cursor'

const RETENTION_NOTE =
  'Rows are retained for a limited window only - see oldestTimestamp in /v1/interop/plugins - and are deleted afterwards. ' +
  'To accumulate history, poll with overlapping windows and de-duplicate on the row id. ' +
  'A row can also be inserted with an older timestamp than rows already returned, because it is only written once both sides are matched.'

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

  openapi.get(
    '/v1/interop/plugins',
    {
      summary:
        'List interop plugins with the message and transfer types they emit.',
      description:
        'Use this to discover valid `plugin` and `type` values for /v1/interop/messages and /v1/interop/transfers, ' +
        'and to see how much data is currently retained for each of them. Counts and timestamps are cached for up to 15 minutes.',
      tags: ['interop'],
      result: InteropPluginsResultSchema,
    },
    async (_, res) => {
      const data = await cache.get(
        {
          key: ['interop', 'plugins'],
          ttl: 15 * UnixTime.MINUTE,
          staleWhileRevalidate: 15 * UnixTime.MINUTE,
        },
        () => getInteropPluginsData(db),
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/interop/messages',
    {
      summary: 'List individual cross-chain messages for a plugin.',
      description: `Keyset-paginated, ordered by (timestamp, messageId). ${RETENTION_NOTE}`,
      tags: ['interop'],
      query: InteropMessagesQuerySchema,
      result: InteropMessagesResultSchema,
      errors: {
        400: BadRequestResponse,
      },
    },
    async (req, res) => {
      const params = normalizeInteropRowsQuery(req.query)
      const cursor = readCursor(
        req.query.cursor,
        interopRowsFingerprint('messages', params),
      )
      if ('error' in cursor) {
        res.status(400).json({ path: '.query.cursor', message: cursor.error })
        return
      }

      const data = await getInteropMessagesData(db, params, cursor.value)

      if (
        data.data.length === 0 &&
        req.query.cursor === undefined &&
        !(await db.interopMessage.hasPlugin(params.plugin))
      ) {
        res.status(400).json(unknownPluginError(params.plugin))
        return
      }

      res.json(data)
    },
  )

  openapi.get(
    '/v1/interop/transfers',
    {
      summary: 'List individual cross-chain transfers for a plugin.',
      description:
        `Keyset-paginated, ordered by (timestamp, transferId). ${RETENTION_NOTE} ` +
        'Transfer rows are additionally updated in place once token resolution and pricing complete - see isProcessed.',
      tags: ['interop'],
      query: InteropTransfersQuerySchema,
      result: InteropTransfersResultSchema,
      errors: {
        400: BadRequestResponse,
      },
    },
    async (req, res) => {
      const params = normalizeInteropRowsQuery(req.query)
      const cursor = readCursor(
        req.query.cursor,
        interopRowsFingerprint('transfers', params),
      )
      if ('error' in cursor) {
        res.status(400).json({ path: '.query.cursor', message: cursor.error })
        return
      }

      const data = await getInteropTransfersData(db, params, cursor.value)

      if (
        data.data.length === 0 &&
        req.query.cursor === undefined &&
        !(await db.interopTransfer.hasPlugin(params.plugin))
      ) {
        res.status(400).json(unknownPluginError(params.plugin))
        return
      }

      res.json(data)
    },
  )
}

/**
 * Only reachable when the plugin has no retained rows at all, so a client
 * polling a live plugin with an empty `from`/`to` window still gets a 200 with
 * an empty page. A typo, on the other hand, never looks like "no new data".
 */
function unknownPluginError(plugin: string) {
  return {
    path: '.query.plugin',
    message: `No data is retained for plugin "${plugin}". See /v1/interop/plugins for the plugins that currently have data.`,
  }
}

function readCursor(
  raw: string | undefined,
  fingerprint: string,
): { value: PageCursor | undefined } | { error: string } {
  if (raw === undefined) {
    return { value: undefined }
  }

  const decoded = decodeCursor(raw, fingerprint)
  if (decoded.ok) {
    return { value: decoded.cursor }
  }

  return {
    error:
      decoded.reason === 'malformed'
        ? 'Malformed cursor. Pass back the nextCursor value from a previous response verbatim.'
        : 'This cursor was issued for a different filter set or order. Restart pagination without a cursor after changing filters.',
  }
}
