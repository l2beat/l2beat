import { UnixTime } from '@l2beat/shared-pure'
import type { PerimeterMember } from './perimeterTimeline'

// Where the coverage history is evaluated: the launch, every report date,
// every change of the perimeter's code, and the present. Code changes are
// clustered like ossification clusters critical changes, so that a rollout
// of several upgrades within a day is one point.

const CLUSTER_WINDOW = UnixTime.DAY

export interface HistoryPoint {
  /** Where the point is drawn. */
  timestamp: number
  /** The perimeter is taken at this moment; the cluster's last change. */
  stateAt: number
  /** Reports dated at or before this moment count. */
  auditsAt: number
}

export function getHistoryPoints(
  members: PerimeterMember[],
  launch: number,
  reportDates: Iterable<number>,
  now: number,
): HistoryPoint[] {
  const points = new Map<number, HistoryPoint>()
  const add = (point: HistoryPoint) => {
    const existing = points.get(point.timestamp)
    points.set(
      point.timestamp,
      existing === undefined
        ? point
        : {
            timestamp: point.timestamp,
            stateAt: Math.max(existing.stateAt, point.stateAt),
            auditsAt: Math.max(existing.auditsAt, point.auditsAt),
          },
    )
  }
  add({ timestamp: launch, stateAt: launch, auditsAt: launch })
  for (const date of reportDates) {
    if (date > launch && date <= now) {
      add({ timestamp: date, stateAt: date, auditsAt: date })
    }
  }
  for (const cluster of clusterEvents(codeEvents(members, launch, now))) {
    const last = cluster[cluster.length - 1] as number
    add({ timestamp: cluster[0] as number, stateAt: last, auditsAt: last })
  }
  add({ timestamp: now, stateAt: now, auditsAt: now })
  return [...points.values()].sort((a, b) => a.timestamp - b.timestamp)
}

/** Every change of the perimeter's code after the launch, up to now. */
export function codeEvents(
  members: PerimeterMember[],
  launch: number,
  now: number,
): number[] {
  const events = new Set<number>()
  for (const member of members) {
    if (member.since > launch) events.add(member.since)
    if (member.until !== undefined) events.add(member.until)
    for (const interval of member.code.slice(1)) events.add(interval.from)
  }
  return [...events].filter((t) => t > launch && t <= now).sort((a, b) => a - b)
}

/** Ascending events grouped from each cluster's start, 24h as ossification. */
export function clusterEvents(sorted: number[]): number[][] {
  const clusters: number[][] = []
  for (const timestamp of sorted) {
    const current = clusters[clusters.length - 1]
    if (
      current === undefined ||
      timestamp - (current[0] as number) > CLUSTER_WINDOW
    ) {
      clusters.push([timestamp])
    } else {
      current.push(timestamp)
    }
  }
  return clusters
}
