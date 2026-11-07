import {
  FLAG_TOKEN_MULTIPLIER,
  FLAG_TOKEN_VOLUME_USD,
  LANE_CAP_USD,
} from '~/server/features/layer2s/interop/history/historyRules'
import type {
  InteropHistoryChainSeries,
  InteropHistoryData,
} from '~/server/features/layer2s/interop/history/types'

export interface HistoryExclusions {
  /** Takes the lanes over the lane cap out of volume and flows. */
  laneCap: boolean
  /** Takes the unusual token days out of volume and flows. */
  tokenDays: boolean
  /** Treats snapshots the promotion rules blocked as gaps. */
  blocked: boolean
}

export const NO_EXCLUSIONS: HistoryExclusions = {
  laneCap: false,
  tokenDays: false,
  blocked: false,
}

/** A lane-day above the lane cap. */
export interface HistoryCappedLane {
  point: number
  id: string
  volume: number
  token: string
  srcChain: string
  dstChain: string
  excluded: boolean
}

/** A token-day far above its usual day, after the lane cap. */
export interface HistoryTokenDay {
  point: number
  id: string
  /** On the selection's lanes; the token can also move on others. */
  volume: number
  token: string
  baseline: number
  lanes: { srcChain: string; dstChain: string }[]
  excluded: boolean
}

export interface MarkedHistory {
  volume: Record<string, number[]>
  byChain: Record<string, InteropHistoryChainSeries>
  cappedLanes: HistoryCappedLane[]
  tokenDays: HistoryTokenDay[]
}

/**
 * Marks the lanes over the cap and the unusual token days, and takes out of
 * the selection's volumes the kinds `exclusions` asks for. Which days are
 * marked never depends on the selection or on what is excluded: a token day
 * is judged on what the lane cap leaves of it, over all chains.
 */
export function applyHistoryExclusions(
  data: InteropHistoryData,
  exclusions: HistoryExclusions,
): MarkedHistory {
  const volume: Record<string, number[]> = {}
  for (const [id, series] of Object.entries(data.byProtocol)) {
    volume[id] = [...series.volume]
  }
  const byChain: Record<string, InteropHistoryChainSeries> = {}
  for (const [chain, series] of Object.entries(data.byChain)) {
    byChain[chain] = {
      inflow: [...series.inflow],
      outflow: [...series.outflow],
    }
  }
  const subtract = (
    point: number,
    id: string,
    lane: { srcChain: string; dstChain: string },
    amount: number,
  ) => {
    const protocol = volume[id]
    if (protocol) protocol[point] = Math.max(0, (protocol[point] ?? 0) - amount)
    const dst = byChain[lane.dstChain]
    if (dst) dst.inflow[point] = Math.max(0, (dst.inflow[point] ?? 0) - amount)
    const src = byChain[lane.srcChain]
    if (src) {
      src.outflow[point] = Math.max(0, (src.outflow[point] ?? 0) - amount)
    }
  }

  const cappedLanes: HistoryCappedLane[] = []
  for (const lane of data.laneCandidates) {
    if (lane.volume <= LANE_CAP_USD) continue
    if (exclusions.laneCap) subtract(lane.point, lane.id, lane, lane.volume)
    cappedLanes.push({
      point: lane.point,
      id: lane.id,
      volume: lane.volume,
      token: lane.topToken,
      srcChain: lane.srcChain,
      dstChain: lane.dstChain,
      excluded: exclusions.laneCap,
    })
  }

  const tokenDays: HistoryTokenDay[] = []
  for (const token of data.tokenCandidates) {
    const uncapped = token.lanes.filter(
      (lane) =>
        lane.laneVolume === undefined || lane.laneVolume <= LANE_CAP_USD,
    )
    const total = uncapped.reduce((sum, lane) => sum + lane.volume, 0)
    if (
      total <= FLAG_TOKEN_VOLUME_USD ||
      total <= FLAG_TOKEN_MULTIPLIER * token.baseline
    ) {
      continue
    }
    const selected = uncapped.filter((lane) => lane.inSelection)
    if (selected.length === 0) continue
    if (exclusions.tokenDays) {
      for (const lane of selected) {
        subtract(token.point, token.id, lane, lane.volume)
      }
    }
    tokenDays.push({
      point: token.point,
      id: token.id,
      volume: selected.reduce((sum, lane) => sum + lane.volume, 0),
      token: token.token,
      baseline: token.baseline,
      lanes: selected,
      excluded: exclusions.tokenDays,
    })
  }

  cappedLanes.sort((a, b) => b.volume - a.volume)
  tokenDays.sort((a, b) => b.volume - a.volume)
  return { volume, byChain, cappedLanes, tokenDays }
}
