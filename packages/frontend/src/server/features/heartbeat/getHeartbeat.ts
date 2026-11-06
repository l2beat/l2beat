import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  buildHeartbeat,
  HEARTBEAT_WINDOW,
  type Heartbeat,
} from './buildHeartbeat'
import { getHeartbeatProjectIds } from './getHeartbeatProjects'
import { createMockHeartbeatSource } from './mockHeartbeatSource'

/** The database, or made-up seconds in mock mode */
export type HeartbeatSource = Pick<
  Database['liveActivityBlock'],
  'getSecondsSince'
>

const cache = new FrontendInMemoryCache('getHeartbeat')
let source: HeartbeatSource | undefined

/** Read once every couple of seconds for every visitor of this server */
export function getHeartbeat(): Promise<Heartbeat> {
  return cache.get({ key: ['heartbeat'], ttl: 2 }, async () => {
    const readAt = UnixTime.now()
    const seconds = await getSource().getSecondsSince(readAt - HEARTBEAT_WINDOW)
    return buildHeartbeat(seconds, readAt)
  })
}

function getSource(): HeartbeatSource {
  source ??= env.MOCK
    ? createMockHeartbeatSource(getHeartbeatProjectIds())
    : getDb().liveActivityBlock
  return source
}
