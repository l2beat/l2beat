import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import {
  type InteropBridgeType,
  type InteropLane,
  interopLaneKey,
  type KnownInteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
import type { LaggingChainsByPlugin } from '../sync/InteropSyncersManager'
import type { AggregationResult } from './InteropAggregationService'

/**
 * Past this age the previous numbers stop being a fair stand-in for current
 * activity, so the lane falls back to its fresh, undercounted rows and the lag
 * shows up as a drop instead of being hidden indefinitely.
 */
export const MAX_CARRY_FORWARD_AGE = UnixTime.DAY

/** `${projectId}:${bridgeType}` -> chains on which those transfers lag. */
export type StaleChains = Map<string, Set<string>>

/**
 * A plugin's transfers aggregate under the bridge type its project config gives
 * it, or under `unknown` for one-sided transfers the classifier cannot type, so
 * a lagging plugin makes both stale. The `chain` and `abstractTokenId`
 * qualifiers of a plugin entry are ignored: over-marking only means a lane
 * shows its previous numbers for an hour.
 */
export function getStaleChains(
  configs: {
    id: string
    plugins: { plugin: string; bridgeType: KnownInteropBridgeType }[]
  }[],
  laggingChainsByPlugin: LaggingChainsByPlugin,
): StaleChains {
  const result: StaleChains = new Map()
  for (const config of configs) {
    for (const { plugin, bridgeType } of config.plugins) {
      const laggingChains = laggingChainsByPlugin.get(plugin)
      if (!laggingChains) continue
      const types: InteropBridgeType[] = [bridgeType, 'unknown']
      for (const type of types) {
        const key = projectBridgeKey(config.id, type)
        result.set(key, new Set([...(result.get(key) ?? []), ...laggingChains]))
      }
    }
  }
  return result
}

/**
 * Stale lanes undercount (their captured data lags), so showing them would
 * look like a drop in activity. Their rows from the previous snapshot,
 * re-stamped to `timestamp`, replace the fresh ones. A stale lane missing from
 * the previous snapshot, partial there, or computed longer than
 * MAX_CARRY_FORWARD_AGE ago, keeps its fresh rows marked partial, so a later
 * update does not mistake them for a healthy computation and copy them.
 */
export function carryForwardStaleLanes(
  fresh: AggregationResult,
  previous: AggregationResult,
  stale: StaleChains,
  timestamp: UnixTime,
): AggregationResult {
  const carriedLanes = new Set(
    previous.aggregatedTransfers
      .filter(
        (row) =>
          isLaneStale(row, stale) &&
          !row.isPartial &&
          computedAt(row) >= timestamp - MAX_CARRY_FORWARD_AGE,
      )
      .map(interopLaneKey),
  )
  const isCarried = (row: InteropLane) => carriedLanes.has(interopLaneKey(row))

  // Every aggregate table is keyed by a lane, so all of them carry forward alike.
  function merge<T extends InteropLane & { timestamp: UnixTime }>(
    freshRows: T[],
    previousRows: T[],
  ): T[] {
    return [
      ...freshRows.filter((row) => !isCarried(row)),
      ...previousRows.filter(isCarried).map((row) => ({ ...row, timestamp })),
    ]
  }

  return {
    aggregatedTransfers: merge(
      fresh.aggregatedTransfers.map((row) =>
        isLaneStale(row, stale) ? { ...row, isPartial: true } : row,
      ),
      previous.aggregatedTransfers.map((row) => ({
        ...row,
        carriedFrom: computedAt(row),
      })),
    ),
    aggregatedTokens: merge(fresh.aggregatedTokens, previous.aggregatedTokens),
    aggregatedDeployedTokens: merge(
      fresh.aggregatedDeployedTokens,
      previous.aggregatedDeployedTokens,
    ),
    aggregatedTokensPairs: merge(
      fresh.aggregatedTokensPairs,
      previous.aggregatedTokensPairs,
    ),
  }
}

function isLaneStale(lane: InteropLane, stale: StaleChains): boolean {
  const chains = stale.get(projectBridgeKey(lane.id, lane.bridgeType))
  return (
    chains !== undefined &&
    (chains.has(lane.srcChain) || chains.has(lane.dstChain))
  )
}

/** A lane carried more than once keeps pointing at the snapshot it was last computed in. */
function computedAt(row: AggregatedInteropTransferRecord): UnixTime {
  return row.carriedFrom ?? row.timestamp
}

function projectBridgeKey(id: string, bridgeType: InteropBridgeType): string {
  return `${id}:${bridgeType}`
}
