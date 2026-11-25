import type { Database } from '@l2beat/database'
import { type WatchReader, watchDiffToMarkdown } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import {
  computePendingWatchDiff,
  getPendingWatchDiffs,
  type PendingWatchDiff,
} from '../pendingWatchDiffs'

export interface PendingWatchApiEntry extends PendingWatchDiff {
  judge: string | null
}

export interface PendingWatchesResponse {
  generatedAt: string
  watches: PendingWatchApiEntry[]
}

export class WatchMonitorController {
  constructor(
    private readonly db: Database,
    private readonly watchReader: WatchReader,
  ) {}

  async getPendingWatches(): Promise<PendingWatchesResponse> {
    const pending = await getPendingWatchDiffs(this.watchReader, this.db)
    const watches = pending.map((entry) => ({
      ...entry,
      judge: this.watchReader.readJudgePrompt(entry.name),
    }))
    return {
      generatedAt: new Date().toISOString(),
      watches,
    }
  }

  async getWatchDashboardMarkdown(): Promise<string> {
    const allWatches = this.watchReader.readAllWatches()
    const pending = await getPendingWatchDiffs(this.watchReader, this.db)
    const pendingByName = new Map(pending.map((entry) => [entry.name, entry]))

    const sortedPending = [...pending].sort((a, b) => {
      if (b.pendingItems !== a.pendingItems) {
        return b.pendingItems - a.pendingItems
      }
      if (b.changedPaths !== a.changedPaths) {
        return b.changedPaths - a.changedPaths
      }
      return a.name.localeCompare(b.name)
    })
    const quiet = allWatches.filter(
      (location) => !pendingByName.has(location.name),
    )

    const lines = [
      '# ETHBEAT Watch Dashboard',
      '',
      '> Offchain monitoring of watches configured in ETHBEAT.',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `Monitoring ${allWatches.length} watch(es); ${sortedPending.length} with pending changes.`,
      '',
    ]

    if (sortedPending.length > 0) {
      lines.push('## Watches with Changes', '')
      for (const watch of sortedPending) {
        const href = `/status/watch/${encodeURIComponent(watch.name)}.html.md`
        lines.push(
          `- [${watch.name}](${href}) [${watch.kind}]: ${watch.pendingItems} pending, ${watch.changedPaths} changed`,
        )
      }
      lines.push('')
    }

    if (quiet.length > 0) {
      lines.push('## Optional', '')
      for (const watch of quiet) {
        const href = `/status/watch/${encodeURIComponent(watch.name)}.html.md`
        lines.push(`- [${watch.name}](${href}) [${watch.kind}]: No changes`)
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

    const latest = await this.db.watchMonitor.findLatest(location.name)
    const committed = this.watchReader.readWatched(location.name)
    const pending =
      latest === undefined
        ? undefined
        : computePendingWatchDiff(location, latest, committed)
    const judge = this.watchReader.readJudgePrompt(location.name)

    const status =
      latest === undefined
        ? 'Not yet run'
        : pending !== undefined
          ? 'Changes detected'
          : 'No changes'

    const lines = [
      `# ${location.name}`,
      '',
      `> ${status} for ${location.name} (${location.kind} watch).`,
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `- **Kind**: ${location.kind}`,
      `- **Status**: ${status}`,
      `- **Last run**: ${latest ? UnixTime.toDate(latest.timestamp).toISOString() : 'Never'}`,
      `- **Pending items**: ${pending?.pendingItems ?? 0}`,
      `- **Changed paths**: ${pending?.changedPaths ?? 0}`,
      '',
    ]

    if (pending !== undefined && pending.diff.length > 0) {
      lines.push('## Changes', '', watchDiffToMarkdown(pending.diff), '')
    }

    if (judge !== null) {
      lines.push('## Judge Guidance', '', judge.trim(), '')
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
}
