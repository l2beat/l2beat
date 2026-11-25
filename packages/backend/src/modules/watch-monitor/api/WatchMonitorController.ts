import type { Database, WatchMonitorRecord } from '@l2beat/database'
import {
  hashWatchConfig,
  type WatchLocation,
  type WatchReader,
  watchDiffToMarkdown,
} from '@l2beat/discovery'
import type { Hash256 } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import {
  computePendingWatchDiff,
  type PendingWatchDiff,
} from '../pendingWatchDiffs'

export interface PendingWatchApiEntry extends PendingWatchDiff {
  judge: string | null
  lastAttemptAt: UnixTime | null
  lastError: string | null
}

export interface FailedWatchApiEntry {
  name: string
  kind: WatchLocation['kind']
  lastAttemptAt: UnixTime | null
  lastSuccessAt: UnixTime | null
  lastError: string
}

export interface PendingWatchesResponse {
  generatedAt: string
  watches: PendingWatchApiEntry[]
  failedWatches: FailedWatchApiEntry[]
}

type WatchStatusKind =
  | 'disabled'
  | 'failed'
  | 'stale'
  | 'never-run'
  | 'changes'
  | 'up-to-date'

interface ClassifiedWatch {
  location: WatchLocation
  status: WatchStatusKind
  record: WatchMonitorRecord | undefined
  pending: PendingWatchDiff | undefined
}

export class WatchMonitorController {
  private readonly disabledSet: Set<string>

  constructor(
    private readonly db: Database,
    private readonly watchReader: WatchReader,
    disabledWatches: string[] = [],
  ) {
    this.disabledSet = new Set(disabledWatches)
  }

  async getPendingWatches(): Promise<PendingWatchesResponse> {
    const stored = await this.loadStoredMap()
    const watches: PendingWatchApiEntry[] = []
    const failedWatches: FailedWatchApiEntry[] = []

    for (const location of this.watchReader.readAllWatches()) {
      const record = stored.get(location.name)
      if (record === undefined) {
        continue
      }
      const config = this.watchReader.readWatchConfig(location.name)
      const expectedConfigHash = hashWatchConfig(config)
      const snapshotMatches =
        record.configHash !== null && record.configHash === expectedConfigHash
      const attemptMatches =
        record.lastAttemptConfigHash !== null &&
        record.lastAttemptConfigHash === expectedConfigHash

      if (record.lastError !== null && attemptMatches) {
        failedWatches.push({
          name: location.name,
          kind: location.kind,
          lastAttemptAt: record.lastAttemptAt,
          lastSuccessAt: snapshotMatches ? record.timestamp : null,
          lastError: record.lastError,
        })
      } else if (!snapshotMatches) {
        failedWatches.push({
          name: location.name,
          kind: location.kind,
          lastAttemptAt: attemptMatches ? record.lastAttemptAt : null,
          lastSuccessAt: null,
          lastError:
            'Stored watch snapshot is stale (watch.jsonc changed); awaiting refresh',
        })
      }

      if (!snapshotMatches) {
        continue
      }
      const committed = this.watchReader.readWatched(location.name)
      // Diffing against nothing would report the whole value as new, paired
      // with the current judge.md.
      if (
        committed !== undefined &&
        committed.configHash !== expectedConfigHash
      ) {
        const reported = record.lastError !== null && attemptMatches
        if (!reported) {
          failedWatches.push({
            name: location.name,
            kind: location.kind,
            lastAttemptAt: attemptMatches ? record.lastAttemptAt : null,
            lastSuccessAt: record.timestamp,
            lastError:
              'Committed watched.json is stale (watch.jsonc changed); run l2b watch',
          })
        }
        continue
      }
      const pending = computePendingWatchDiff(location, record, committed)
      if (pending !== undefined) {
        watches.push({
          ...pending,
          judge: this.watchReader.readJudgePrompt(location.name),
          lastAttemptAt: attemptMatches
            ? record.lastAttemptAt
            : record.timestamp,
          lastError: attemptMatches ? record.lastError : null,
        })
      }
    }

    return {
      generatedAt: new Date().toISOString(),
      watches,
      failedWatches,
    }
  }

  async getWatchDashboardMarkdown(): Promise<string> {
    const stored = await this.loadStoredMap()
    // Only publish watches explicitly marked `"public": true` in watch.jsonc,
    // and only observations captured under the current public configHash so a
    // private->public switch never leaks an older private snapshot.
    const publicWatches = this.watchReader
      .readAllWatches()
      .map((location) => ({
        location,
        config: this.watchReader.readWatchConfig(location.name),
      }))
      .filter(({ config }) => config.isPublic === true)
    const classified = publicWatches.map(({ location, config }) =>
      this.classifyPublicWatch(
        location,
        stored.get(location.name),
        hashWatchConfig(config),
      ),
    )

    const errored = classified.filter(
      (c) => c.status === 'failed' || c.status === 'stale',
    )
    const changed = classified
      .filter((c) => c.status === 'changes')
      .sort(compareByPendingCount)
    const inactive = classified.filter(
      (c) => c.status === 'never-run' || c.status === 'disabled',
    )
    const clean = classified.filter((c) => c.status === 'up-to-date')

    const lines = [
      '# ETHBEAT Watch Dashboard',
      '',
      '> Offchain monitoring of public watches configured in ETHBEAT.',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `Monitoring ${publicWatches.length} public watch(es); ${changed.length} with pending changes, ${errored.length} with errors.`,
      '',
    ]

    if (errored.length > 0) {
      lines.push('## Watches with Errors', '')
      for (const item of errored) {
        const href = watchHref(item.location.name)
        const lastSuccess = item.record?.timestamp
          ? `last success ${formatIso(item.record.timestamp)}`
          : 'never succeeded'
        lines.push(
          `- [${item.location.name}](${href}) [${item.location.kind}]: ${statusLabel(item.status)} (${lastSuccess})`,
        )
      }
      lines.push('')
    }

    if (changed.length > 0) {
      lines.push('## Watches with Changes', '')
      for (const item of changed) {
        const href = watchHref(item.location.name)
        const pending = item.pending
        lines.push(
          `- [${item.location.name}](${href}) [${item.location.kind}]: ${pending?.pendingItems ?? 0} pending, ${pending?.changedPaths ?? 0} changed (last run ${formatIso(item.record?.timestamp ?? null)})`,
        )
      }
      lines.push('')
    }

    if (inactive.length > 0) {
      lines.push('## Not Yet Run / Disabled', '')
      for (const item of inactive) {
        const href = watchHref(item.location.name)
        lines.push(
          `- [${item.location.name}](${href}) [${item.location.kind}]: ${statusLabel(item.status)}`,
        )
      }
      lines.push('')
    }

    if (clean.length > 0) {
      lines.push('## Optional', '')
      for (const item of clean) {
        const href = watchHref(item.location.name)
        lines.push(
          `- [${item.location.name}](${href}) [${item.location.kind}]: No changes (last run ${formatIso(item.record?.timestamp ?? null)})`,
        )
      }
      lines.push('')
    }

    return lines.join('\n')
  }

  async getWatchMarkdown(watchName: string): Promise<string | null> {
    const location = this.watchReader.findWatch(watchName)
    if (location === undefined) {
      return null
    }
    const config = this.watchReader.readWatchConfig(location.name)
    if (config.isPublic !== true) {
      return null
    }

    const record = await this.db.watchMonitor.findLatest(location.name)
    const classified = this.classifyPublicWatch(
      location,
      record,
      hashWatchConfig(config),
    )
    const label = statusLabel(classified.status)
    const publishableRecord = classified.record

    const lines = [
      `# ${location.name}`,
      '',
      `> ${label} for ${location.name} (${location.kind} watch).`,
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `- **Kind**: ${location.kind}`,
      `- **Status**: ${label}`,
      `- **Last successful run**: ${formatIso(publishableRecord?.timestamp ?? null)}`,
      `- **Last attempt**: ${formatIso(publishableRecord?.lastAttemptAt ?? null)}`,
      `- **Pending items**: ${classified.pending?.pendingItems ?? 0}`,
      `- **Changed paths**: ${classified.pending?.changedPaths ?? 0}`,
      '',
    ]

    if (
      classified.pending !== undefined &&
      classified.pending.diff.length > 0
    ) {
      lines.push(
        '## Changes',
        '',
        watchDiffToMarkdown(classified.pending.diff),
        '',
      )
    }

    lines.push(
      '## Related',
      '',
      '- [Watch LLM Overview](/status/watch/llms.txt): Machine-readable watch index',
      '- [Discovery LLM Overview](/status/discovery/llms.txt): Machine-readable discovery index',
      '',
    )

    return lines.join('\n')
  }

  private async loadStoredMap(): Promise<Map<string, WatchMonitorRecord>> {
    return new Map(
      (await this.db.watchMonitor.getAll()).map((record) => [
        record.name,
        record,
      ]),
    )
  }

  private classifyPublicWatch(
    location: WatchLocation,
    record: WatchMonitorRecord | undefined,
    expectedConfigHash: Hash256,
  ): ClassifiedWatch {
    if (this.disabledSet.has(location.name)) {
      return {
        location,
        status: 'disabled',
        record: undefined,
        pending: undefined,
      }
    }
    if (record === undefined) {
      return {
        location,
        status: 'never-run',
        record: undefined,
        pending: undefined,
      }
    }
    // Never publish a snapshot, attempt timestamp, or failure status captured
    // under a private or outdated watch config. Raw error text always stays
    // behind authenticated /watch/pending.
    const snapshotMatches =
      record.isPublic &&
      record.configHash !== null &&
      record.configHash === expectedConfigHash
    const attemptMatches =
      record.lastAttemptConfigHash !== null &&
      record.lastAttemptConfigHash === expectedConfigHash

    if (!snapshotMatches) {
      if (attemptMatches && record.lastError !== null) {
        return {
          location,
          status: 'failed',
          record: {
            ...record,
            timestamp: null,
            values: null,
            lastError: null,
          },
          pending: undefined,
        }
      }
      return {
        location,
        status: 'never-run',
        record: undefined,
        pending: undefined,
      }
    }

    const publicRecord: WatchMonitorRecord = {
      ...record,
      lastAttemptAt: attemptMatches ? record.lastAttemptAt : record.timestamp,
      lastError: null,
    }
    const committed = this.watchReader.readWatched(location.name)
    // Apply the same public-config provenance check to the committed baseline
    // so an older private watched.json never leaks private paths as removals
    // after a watch is repointed and switched to public.
    const publishableCommitted =
      committed !== undefined && committed.configHash === expectedConfigHash
        ? committed
        : undefined
    const pending = computePendingWatchDiff(
      location,
      publicRecord,
      publishableCommitted,
    )
    if (attemptMatches && record.lastError !== null) {
      return {
        location,
        status: publicRecord.timestamp === null ? 'failed' : 'stale',
        record: publicRecord,
        pending,
      }
    }
    if (publicRecord.timestamp === null) {
      return {
        location,
        status: 'never-run',
        record: publicRecord,
        pending: undefined,
      }
    }
    return {
      location,
      status: pending !== undefined ? 'changes' : 'up-to-date',
      record: publicRecord,
      pending,
    }
  }
}

function compareByPendingCount(a: ClassifiedWatch, b: ClassifiedWatch): number {
  const aPending = a.pending?.pendingItems ?? 0
  const bPending = b.pending?.pendingItems ?? 0
  if (bPending !== aPending) {
    return bPending - aPending
  }
  const aChanged = a.pending?.changedPaths ?? 0
  const bChanged = b.pending?.changedPaths ?? 0
  if (bChanged !== aChanged) {
    return bChanged - aChanged
  }
  return a.location.name.localeCompare(b.location.name)
}

function watchHref(name: string): string {
  return `/status/watch/${encodeURIComponent(name)}.html.md`
}

function formatIso(timestamp: UnixTime | null): string {
  return timestamp === null ? 'Never' : UnixTime.toDate(timestamp).toISOString()
}

function statusLabel(status: WatchStatusKind): string {
  switch (status) {
    case 'disabled':
      return 'Disabled'
    case 'failed':
      return 'Failed (no successful run)'
    case 'stale':
      return 'Stale (last run failed)'
    case 'never-run':
      return 'Not yet run'
    case 'changes':
      return 'Changes detected'
    case 'up-to-date':
      return 'No changes'
  }
}
