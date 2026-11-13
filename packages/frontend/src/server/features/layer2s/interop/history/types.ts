import type { InteropBridgeType } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type InteropHistoryResolution = v.infer<typeof InteropHistoryResolution>
export const InteropHistoryResolution = v.enum(['daily', 'hourly'])

export type InteropHistoryParams = v.infer<typeof InteropHistoryParams>
export const InteropHistoryParams = v.object({
  from: v.array(v.string()),
  to: v.array(v.string()),
  /** All protocols when omitted. */
  protocolIds: v.array(v.string()).optional(),
  resolution: InteropHistoryResolution,
})

/**
 * One point on the time axis. Every snapshot covers the 24 hours before it.
 * Daily points take the day's earliest snapshot, which is the one retention
 * keeps after 14 days.
 */
export interface InteropHistoryPoint {
  /** Midnight of the day, or the hour, the point stands for. */
  timestamp: number
  /** The snapshot read for the point; null when there is none. */
  snapshot: number | null
  /** The snapshot failed the promotion rules and is never served. */
  isBlocked: boolean
  /** Lanes copied from an older snapshot because their syncers lagged. */
  carriedLanes: number
  /** Lanes computed while their syncers lagged, so they undercount. */
  partialLanes: number
}

export interface InteropHistoryProtocol {
  id: string
  name: string
  iconUrl: string | undefined
  /** False for ids no project claims any more, e.g. a renamed plugin. */
  isListed: boolean
}

/** Values aligned with `points`; 0 where a point has no snapshot. */
export interface InteropHistoryProtocolSeries {
  volume: number[]
  transferCount: number[]
  timedTransferCount: number[]
  durationSum: number[]
}

export interface InteropHistoryChainSeries {
  inflow: number[]
  outflow: number[]
}

export interface InteropHistoryLane {
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
}

/** A lane-day above the lane cap, which the page excludes. */
export interface InteropHistoryLaneCandidate extends InteropHistoryLane {
  point: number
  id: string
  volume: number
  topToken: string
}

/**
 * A protocol-day of one token, over all its lanes, far above its usual day.
 * The page flags it if it still is after the lane cap.
 */
export interface InteropHistoryTokenCandidate {
  point: number
  id: string
  token: string
  volume: number
  /** Median of the token's volume on the protocol over ±14 days. */
  baseline: number
  lanes: (InteropHistoryLane & {
    volume: number
    /** The whole lane's volume, if it is a lane candidate. */
    laneVolume: number | undefined
    inSelection: boolean
  })[]
}

export interface InteropHistoryData {
  resolution: InteropHistoryResolution
  points: InteropHistoryPoint[]
  /** Sorted by volume, largest first. */
  protocols: InteropHistoryProtocol[]
  byProtocol: Record<string, InteropHistoryProtocolSeries>
  byChain: Record<string, InteropHistoryChainSeries>
  laneCandidates: InteropHistoryLaneCandidate[]
  tokenCandidates: InteropHistoryTokenCandidate[]
}
