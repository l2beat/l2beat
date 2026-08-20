/**
 * Backfill scanner for the ossification factor. Walks the full git history of
 * a project's discovered.json (all three repo layouts) and reports every
 * contract that once existed in discovery but is absent today — the
 * candidates for the `historicalContracts` judgment list in ossification.json.
 *
 * Mechanical evidence only; criticality is classified by researchers/agents.
 * Usage: npx tsx scripts/ossification-backfill.ts <projectId> [...] [--json]
 */

import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { execFileSync } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'
import { getDiscoveryUpdates } from '~/server/features/projects/recent-changes/getDiscoveryUpdates'
import {
  extractDiffBlockAddress,
  extractDiffBlockSpans,
  isHighSeverityDiffBody,
  isImplementationChangeDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'

const REPO_ROOT = path.join(process.cwd(), '../..')
interface HistoricalContract {
  address: string
  name: string
  critical: null
  sinceTimestamp?: number
  upgradeTimestamps: number[]
  /** HIGH-severity watched-changes diff blocks attributable to this address */
  diffEventCount: number
  firstSeenAt: number
  lastSeenAt: number
  lastSeenCommit: string
  note: ''
}

function git(args: string[]): string {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
}

function listSnapshots(
  projectId: string,
): { commit: string; timestamp: number; path: string }[] {
  const patterns = [
    `packages/config/src/projects/${projectId}/discovered.json`,
    `packages/config/src/projects/${projectId}/*/discovered.json`,
    `packages/backend/discovery/${projectId}/*/discovered.json`,
  ]
  const log = git(['log', '--format=%H\t%ct', '--name-only', '--', ...patterns])
  const snapshots: { commit: string; timestamp: number; path: string }[] = []
  let commit = ''
  let timestamp = 0
  for (const line of log.split('\n')) {
    if (line.includes('\t')) {
      const [hash, ts] = line.split('\t')
      commit = hash ?? ''
      timestamp = Number(ts)
    } else if (line.endsWith('discovered.json')) {
      snapshots.push({ commit, timestamp, path: line })
    }
  }
  return snapshots
}

function toChainSpecific(
  address: string,
  longChain: string,
): string | undefined {
  if (address.includes(':')) return address.toLowerCase()
  try {
    return ChainSpecificAddress.fromLong(longChain, address).toLowerCase()
  } catch {
    return undefined
  }
}

function parseUpgradeTimestamps(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const timestamps: number[] = []
  for (const upgrade of value) {
    if (!Array.isArray(upgrade) || typeof upgrade[0] !== 'string') continue
    const timestamp = Date.parse(upgrade[0])
    if (Number.isFinite(timestamp))
      timestamps.push(Math.floor(timestamp / 1000))
  }
  return timestamps.sort((a, b) => a - b)
}

function scanProject(projectId: string): HistoricalContract[] {
  const seen = new Map<
    string,
    Omit<HistoricalContract, 'critical' | 'note' | 'diffEventCount'>
  >()

  for (const snapshot of listSnapshots(projectId)) {
    interface SnapshotContract {
      type?: string
      address?: unknown
      name?: string
      sinceTimestamp?: number
      values?: { $pastUpgrades?: unknown }
    }
    let parsed: {
      chain?: string
      entries?: SnapshotContract[]
      contracts?: SnapshotContract[]
    }
    try {
      parsed = JSON.parse(git(['show', `${snapshot.commit}:${snapshot.path}`]))
    } catch {
      continue
    }
    // long chain name: in-file for old layouts, address prefix for the merged one
    const chainDir = path.basename(path.dirname(snapshot.path))
    const longChain =
      parsed.chain ?? (chainDir === projectId ? 'ethereum' : chainDir)
    const contracts: SnapshotContract[] =
      parsed.entries?.filter((e) => e.type === 'Contract') ??
      parsed.contracts ??
      []

    for (const contract of contracts) {
      if (typeof contract.address !== 'string') continue
      const address = toChainSpecific(contract.address, longChain)
      if (!address) continue
      const upgradeTimestamps = parseUpgradeTimestamps(
        contract.values?.$pastUpgrades,
      )
      const existing = seen.get(address)
      if (!existing) {
        seen.set(address, {
          address,
          name: contract.name ?? address,
          sinceTimestamp: contract.sinceTimestamp,
          upgradeTimestamps,
          firstSeenAt: snapshot.timestamp,
          lastSeenAt: snapshot.timestamp,
          lastSeenCommit: snapshot.commit,
        })
      } else {
        existing.firstSeenAt = Math.min(
          existing.firstSeenAt,
          snapshot.timestamp,
        )
        if (snapshot.timestamp >= existing.lastSeenAt) {
          existing.lastSeenAt = snapshot.timestamp
          existing.lastSeenCommit = snapshot.commit
          existing.name = contract.name ?? existing.name
        }
        existing.sinceTimestamp ??= contract.sinceTimestamp
        if (upgradeTimestamps.length > existing.upgradeTimestamps.length) {
          existing.upgradeTimestamps = upgradeTimestamps
        }
      }
    }
  }

  const currentPath = path.join(
    REPO_ROOT,
    'packages/config/src/projects',
    projectId,
    'discovered.json',
  )
  const current = new Set(
    (
      JSON.parse(readFileSync(currentPath, 'utf-8')).entries as {
        address?: unknown
      }[]
    )
      .filter((e) => typeof e.address === 'string')
      .map((e) => (e.address as string).toLowerCase()),
  )

  const removed = [...seen.values()]
    .filter((c) => !current.has(c.address))
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)

  const diffEventCounts = countDiffEvents(
    projectId,
    removed.map((c) => c.address),
    new Set(
      removed
        .filter((c) => c.upgradeTimestamps.length > 0)
        .map((c) => c.address),
    ),
  )
  return removed.map((c) => ({
    ...c,
    diffEventCount: diffEventCounts.get(c.address) ?? 0,
    critical: null,
    note: '',
  }))
}

/** Same attribution rules as getOssificationFactor.collectDiffEvents:
 *  implementation-change blocks only count when the contract has no
 *  $pastUpgrades record; HIGH-severity value blocks always count. */
function countDiffEvents(
  projectId: string,
  addresses: string[],
  hasPastUpgrades: Set<string>,
): Map<string, number> {
  const byAddress = new Map<string, string>()
  for (const address of addresses) {
    byAddress.set(address, address)
    const bare = address.split(':').at(-1)
    if (bare) byAddress.set(bare, address)
  }
  const counts = new Map<string, number>()
  for (const update of getDiscoveryUpdates(
    projectId,
    Number.POSITIVE_INFINITY,
  )) {
    if (update.timestamp === null) continue
    for (const section of update.sections) {
      if (section.kind !== 'watched-changes') continue
      for (const { content } of extractDiffBlockSpans(section.body)) {
        const match = extractDiffBlockAddress(content)
        const address = match && byAddress.get(match)
        if (!address) continue
        if (isImplementationChangeDiffBody(content)) {
          if (hasPastUpgrades.has(address)) continue
          counts.set(address, (counts.get(address) ?? 0) + 1)
        } else if (isHighSeverityDiffBody(content)) {
          counts.set(address, (counts.get(address) ?? 0) + 1)
        }
      }
    }
  }
  return counts
}

function main() {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const ids = args.filter((a) => !a.startsWith('--'))
  if (ids.length === 0) {
    console.error('usage: ossification-backfill.ts <projectId> [...] [--json]')
    process.exit(1)
  }
  for (const id of ids) {
    const removed = scanProject(id)
    if (json) {
      console.log(
        JSON.stringify({ project: id, historicalContracts: removed }, null, 2),
      )
    } else {
      const relevant = removed.filter(
        (c) => c.upgradeTimestamps.length > 1 || c.diffEventCount > 0,
      )
      console.log(
        `\n=== ${id}: ${removed.length} removed contracts, ${relevant.length} with countable events`,
      )
      for (const c of relevant) {
        console.log(
          `  ${c.name.padEnd(40)} ${c.address}  upgrades=${Math.max(0, c.upgradeTimestamps.length - 1)}  diffEvents=${c.diffEventCount}  lastSeen=${new Date(c.lastSeenAt * 1000).toISOString().slice(0, 10)}`,
        )
      }
    }
  }
}

main()
