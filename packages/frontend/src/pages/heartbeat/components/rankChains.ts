import type { UnixTime } from '@l2beat/shared-pure'
import type {
  Heartbeat,
  HeartbeatChain,
} from '~/server/features/heartbeat/buildHeartbeat'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'

export type HeartbeatMetric = 'uops' | 'tps' | 'gasPerSecond'

/** Seconds a chain's newest block may trail the read before it ranks below the live ones */
export const BEHIND_AFTER = 60

export interface RankedChain {
  project: HeartbeatProject
  chain: HeartbeatChain
  /** Seconds its newest block trails the read, once over `BEHIND_AFTER` */
  behindBy: number | undefined
}

/** Fastest first, chains running behind after the rest */
export function rankChains(
  projects: HeartbeatProject[],
  heartbeat: Heartbeat,
  metric: HeartbeatMetric,
): RankedChain[] {
  const byId = new Map(projects.map((project) => [project.id, project]))
  return heartbeat.chains
    .flatMap((chain): RankedChain[] => {
      const project = byId.get(chain.projectId)
      if (!project) return []
      const behind = heartbeat.readAt - chain.newest
      return [
        {
          project,
          chain,
          behindBy: behind > BEHIND_AFTER ? behind : undefined,
        },
      ]
    })
    .sort(
      (a, b) =>
        Number(a.behindBy !== undefined) - Number(b.behindBy !== undefined) ||
        b.chain[metric] - a.chain[metric],
    )
}

/** The rows in `order`, by project, with rows it does not have yet last */
export function keepOrder(
  ranked: RankedChain[],
  order: string[],
): RankedChain[] {
  const position = new Map(order.map((id, i) => [id, i]))
  const at = (row: RankedChain) => position.get(row.project.id) ?? order.length
  return [...ranked].sort((a, b) => at(a) - at(b))
}

/** Every chain's transactions per second, added up */
export function sumBeats(chains: HeartbeatChain[]): [UnixTime, number][] {
  const sums = new Map<UnixTime, number>()
  for (const chain of chains) {
    for (const [second, transactions] of chain.beats) {
      sums.set(second, (sums.get(second) ?? 0) + transactions)
    }
  }
  return [...sums].sort(([a], [b]) => a - b)
}
