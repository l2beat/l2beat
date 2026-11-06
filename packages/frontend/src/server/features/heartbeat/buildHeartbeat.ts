import type { LiveActivitySecondRecord } from '@l2beat/database'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

/** Seconds of beats sent: the trace's minute, the wait before it, and chains running behind */
export const HEARTBEAT_WINDOW = 5 * 60
/** Seconds the rates are averaged over */
export const RATE_WINDOW = 60

export interface Heartbeat {
  /** When the blocks were read */
  readAt: UnixTime
  chains: HeartbeatChain[]
}

export interface HeartbeatChain {
  projectId: string
  /** Of the newest block */
  newest: UnixTime
  /** Per second, over the minute up to the newest block */
  tps: number
  uops: number
  gasPerSecond: number
  /** In that minute */
  blocks: number
  /** [second, transactions] of every second with a block, oldest first */
  beats: [UnixTime, number][]
}

/** Rows oldest first */
export function buildHeartbeat(
  seconds: LiveActivitySecondRecord[],
  readAt: UnixTime,
): Heartbeat {
  const byProject = groupBy(seconds, (second) => second.projectId)
  const chains = Object.entries(byProject).map(
    ([projectId, rows]): HeartbeatChain => {
      const newest = rows.at(-1)?.timestamp
      assert(newest !== undefined, 'Grouped rows are never empty')
      const lastMinute = rows.filter((r) => r.timestamp > newest - RATE_WINDOW)
      const perSecond = (sum: (row: LiveActivitySecondRecord) => number) =>
        lastMinute.reduce((total, row) => total + sum(row), 0) / RATE_WINDOW
      return {
        projectId,
        newest,
        tps: perSecond((r) => r.count),
        uops: perSecond((r) => r.uopsCount),
        gasPerSecond: perSecond((r) => r.gasUsed),
        blocks: lastMinute.reduce((total, row) => total + row.blocks, 0),
        beats: rows.map((r) => [r.timestamp, r.count]),
      }
    },
  )
  return { readAt, chains }
}
