import type {
  AggregatedInteropLaneCandidateRecord,
  AggregatedInteropTokenVolumeRecord,
} from '@l2beat/database'
import { type UnixTime, unique } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { buildTokensDetailsMap } from '../utils/buildTokensDetailsMap'
import {
  getWindowMedian,
  type HistoryPointSnapshot,
} from './buildHistoryPoints'
import {
  FLAG_BASELINE_WINDOW,
  FLAG_TOKEN_MULTIPLIER,
  FLAG_TOKEN_VOLUME_USD,
  LANE_CAP_USD,
} from './historyRules'
import type {
  InteropHistoryLaneCandidate,
  InteropHistoryResolution,
  InteropHistoryTokenCandidate,
} from './types'

export interface InteropHistoryCandidates {
  lanes: InteropHistoryLaneCandidate[]
  tokens: (Omit<InteropHistoryTokenCandidate, 'lanes'> & {
    lanes: Omit<InteropHistoryTokenCandidate['lanes'][number], 'inSelection'>[]
  })[]
}

const cache = new FrontendInMemoryCache('getInteropHistoryCandidates')

/**
 * The lane-days the lane cap excludes and the token-days that may be
 * flagged, over all chains and protocols, so a selection never changes what
 * a rule does.
 */
export function getInteropHistoryCandidates(
  resolution: InteropHistoryResolution,
  points: HistoryPointSnapshot[],
): Promise<InteropHistoryCandidates> {
  return cache.get(
    {
      key: [
        'interop-history-candidates',
        resolution,
        String(points.at(-1)?.snapshot ?? 0),
      ],
      ttl: 30 * 60,
      staleWhileRevalidate: 30 * 60,
    },
    () => buildCandidates(points),
  )
}

async function buildCandidates(
  points: HistoryPointSnapshot[],
): Promise<InteropHistoryCandidates> {
  const db = getDb()
  const pointBySnapshot = new Map<number, number>()
  points.forEach((point, i) => {
    if (point.snapshot !== undefined) pointBySnapshot.set(point.snapshot, i)
  })
  const snapshots = points.flatMap((point) => point.snapshot ?? [])

  const [lanes, bigTokenDays] = await Promise.all([
    db.aggregatedInteropToken.getHistoryLanesAbove(snapshots, LANE_CAP_USD),
    db.aggregatedInteropToken.getHistoryTokensAbove(
      snapshots,
      FLAG_TOKEN_VOLUME_USD,
    ),
  ])

  const tokenDays = await withBaselines(snapshots, bigTokenDays)
  const candidateTokenDays = tokenDays.filter(
    (day) => day.volume > FLAG_TOKEN_MULTIPLIER * day.baseline,
  )
  const tokenLanes =
    await db.aggregatedInteropToken.getHistoryTokenLanes(candidateTokenDays)

  const tokens = await buildTokensDetailsMap(
    unique([
      ...lanes.map((l) => l.topAbstractTokenId),
      ...candidateTokenDays.map((t) => t.abstractTokenId),
    ]),
  )
  const symbol = (id: string) => tokens.get(id)?.symbol ?? id

  const laneVolume = new Map(lanes.map((lane) => [laneKey(lane), lane.volume]))

  return {
    lanes: lanes.map((lane: AggregatedInteropLaneCandidateRecord) => ({
      point: pointBySnapshot.get(lane.timestamp) as number,
      id: lane.id,
      bridgeType: lane.bridgeType,
      srcChain: lane.srcChain,
      dstChain: lane.dstChain,
      volume: lane.volume,
      topToken: symbol(lane.topAbstractTokenId),
    })),
    tokens: candidateTokenDays.map((day) => ({
      point: pointBySnapshot.get(day.timestamp) as number,
      id: day.id,
      token: symbol(day.abstractTokenId),
      volume: day.volume,
      baseline: day.baseline,
      lanes: tokenLanes
        .filter(
          (lane) =>
            lane.timestamp === day.timestamp &&
            lane.id === day.id &&
            lane.abstractTokenId === day.abstractTokenId,
        )
        .map((lane) => ({
          bridgeType: lane.bridgeType,
          srcChain: lane.srcChain,
          dstChain: lane.dstChain,
          volume: lane.volume,
          laneVolume: laneVolume.get(laneKey(lane)),
        })),
    })),
  }
}

async function withBaselines(
  snapshots: UnixTime[],
  days: AggregatedInteropTokenVolumeRecord[],
) {
  const pairs = unique(days.map((d) => `${d.id}|${d.abstractTokenId}`)).map(
    (pair) => {
      const [id, abstractTokenId] = pair.split('|') as [string, string]
      return { id, abstractTokenId }
    },
  )
  const series = await getDb().aggregatedInteropToken.getHistoryTokenSeries(
    snapshots,
    pairs,
  )
  const valuesByPair = new Map<string, Map<number, number>>()
  for (const row of series) {
    const pair = `${row.id}|${row.abstractTokenId}`
    let values = valuesByPair.get(pair)
    if (!values) {
      values = new Map()
      valuesByPair.set(pair, values)
    }
    values.set(row.timestamp, row.volume)
  }

  return days.map((day) => {
    const values = valuesByPair.get(`${day.id}|${day.abstractTokenId}`)
    // A snapshot without the token's rows saw none of it.
    const volumes = snapshots.map((s) => values?.get(s) ?? 0)
    const index = snapshots.indexOf(day.timestamp)
    return {
      ...day,
      baseline: getWindowMedian(
        snapshots,
        volumes,
        index,
        FLAG_BASELINE_WINDOW,
      ),
    }
  })
}

function laneKey(lane: {
  timestamp: UnixTime
  id: string
  bridgeType: string
  srcChain: string
  dstChain: string
}) {
  return `${lane.timestamp}|${lane.id}|${lane.bridgeType}|${lane.srcChain}|${lane.dstChain}`
}
