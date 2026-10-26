import { readFileSync } from 'fs'
import { join } from 'path'

export interface EthereumDaTracking {
  projectId: string
  inbox: string
  sequencers: string[]
  topics: string[]
  sinceBlock: number
  untilBlock?: number
}

interface SnapshotEntry {
  config: {
    type: string
    inbox?: string
    sequencers?: string[]
    topics?: string[]
    sinceBlock?: number
    untilBlock?: number
  }
}

// The DA tracking snapshot lists every configuration the backend indexes
// (sovereign projects included) and is kept in sync with the config by the
// snapshot guard test, so it is what the Ethereum DA page attributes by.
export function loadEthereumDaTracking(
  projectsPath: string,
): EthereumDaTracking[] {
  const snapshotPath = join(
    projectsPath,
    '..',
    'snapshots',
    'daTracking',
    'snapshot.json',
  )
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8')) as Record<
    string,
    SnapshotEntry[]
  >
  const result: EthereumDaTracking[] = []
  for (const [projectId, entries] of Object.entries(snapshot)) {
    for (const { config } of entries) {
      if (config.type !== 'ethereum' || config.inbox === undefined) continue
      result.push({
        projectId,
        inbox: config.inbox.toLowerCase(),
        sequencers: (config.sequencers ?? []).map((s) => s.toLowerCase()),
        topics: (config.topics ?? []).map((t) => t.toLowerCase()),
        sinceBlock: config.sinceBlock ?? 0,
        untilBlock: config.untilBlock,
      })
    }
  }
  return result
}

/**
 * Mirrors matchEthereumProject in the backend's DaService (plus the indexer's
 * inclusive since/until range): a topic match wins, otherwise the inbox must
 * match and, if sequencers are listed, the sender too.
 */
export function matchDaTracking(
  tx: { from: string; to: string; blockNumber: number; topics: Set<string> },
  configs: EthereumDaTracking[],
): string[] {
  const projects = new Set<string>()
  for (const c of configs) {
    if (tx.blockNumber < c.sinceBlock) continue
    if (c.untilBlock !== undefined && tx.blockNumber > c.untilBlock) continue
    if (c.topics.some((t) => tx.topics.has(t))) {
      projects.add(c.projectId)
      continue
    }
    if (c.inbox !== tx.to) continue
    if (c.sequencers.length === 0 || c.sequencers.includes(tx.from)) {
      projects.add(c.projectId)
    }
  }
  return [...projects]
}
