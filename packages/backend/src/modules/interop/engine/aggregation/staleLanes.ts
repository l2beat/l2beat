/** A plugin cluster whose captured data on `chain` cannot be trusted for this snapshot. */
export interface AggregationBlocker {
  cluster: string
  chain: string
}

/** The part of a plugin cluster that matters here: which plugin names it syncs. */
export interface ClusterMembers {
  name: string
  plugins: { name: string }[]
}

export interface Lane {
  id: string
  srcChain: string
  dstChain: string
}

/** Project id -> chains on which at least one of its plugin clusters is blocked. */
export type StaleChainsByProject = Map<string, Set<string>>

/**
 * Every cluster runs a syncer on every enabled chain, so a lagging chain blocks
 * that chain for every project whose plugins live in a blocked cluster. Plugins
 * outside any cluster (API-fed ones) have no syncer and never block.
 */
export function getStaleChainsByProject(
  configs: { id: string; plugins: { plugin: string }[] }[],
  clusters: ClusterMembers[],
  blockers: AggregationBlocker[],
): StaleChainsByProject {
  const clusterByPlugin = new Map(
    clusters.flatMap((c) => c.plugins.map((p) => [p.name, c.name] as const)),
  )
  const staleChainsByCluster = new Map<string, Set<string>>()
  for (const { cluster, chain } of blockers) {
    const chains = staleChainsByCluster.get(cluster) ?? new Set()
    chains.add(chain)
    staleChainsByCluster.set(cluster, chains)
  }

  const result: StaleChainsByProject = new Map()
  for (const config of configs) {
    const chains = new Set<string>()
    for (const { plugin } of config.plugins) {
      const cluster = clusterByPlugin.get(plugin)
      if (!cluster) continue
      for (const chain of staleChainsByCluster.get(cluster) ?? []) {
        chains.add(chain)
      }
    }
    if (chains.size > 0) {
      result.set(config.id, chains)
    }
  }
  return result
}

export function isLaneStale(lane: Lane, stale: StaleChainsByProject): boolean {
  const chains = stale.get(lane.id)
  return (
    chains !== undefined &&
    (chains.has(lane.srcChain) || chains.has(lane.dstChain))
  )
}

/**
 * Stale lanes are undercounted (their captured data is behind), so showing them
 * would look like a drop in activity. The previous snapshot is the best
 * available data for them: drop the fresh rows of stale lanes and re-stamp the
 * previous snapshot's rows for those lanes to `timestamp` instead.
 */
export function carryForwardStaleLanes<T extends Lane & { timestamp: number }>(
  fresh: T[],
  previous: T[],
  stale: StaleChainsByProject,
  timestamp: number,
): T[] {
  if (stale.size === 0) return fresh
  return [
    ...fresh.filter((row) => !isLaneStale(row, stale)),
    ...previous
      .filter((row) => isLaneStale(row, stale))
      .map((row) => ({ ...row, timestamp })),
  ]
}
