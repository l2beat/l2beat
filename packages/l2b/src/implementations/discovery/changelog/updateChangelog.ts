import type { DiscoveryDiff } from '@l2beat/discovery'
import {
  createDiffHistoryEntryIdFactory,
  DiffHistoryParser,
  type DiscoveryChangelog,
  type DiscoveryChangelogEntry,
  serializeDiscoveryChangelog,
} from '@l2beat/shared'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { changelogEntryFromDiff } from './changelogFromDiff'
import { changelogFromDiffHistory } from './migrateChangelog'

/**
 * Keeps changelog.json in step with the diffHistory.md that updateDiffHistory
 * just finalized. The markdown remains the ledger of entries — its headers
 * decide which entries exist and what their ids are — while the changelog
 * carries each entry's structured diff, recorded here from the DiscoveryDiff
 * rather than read back from the rendered block.
 *
 * Maintained only for projects that opted into it: an existing changelog.json,
 * or an ossification.json marking the project as a consumer. A first run for
 * such a project migrates the pre-existing markdown history once.
 */
export function updateChangelog(
  discoveryFolder: string,
  newEntry: { timestamp: number; diff: DiscoveryDiff[] } | undefined,
  log: (message: string) => void,
): void {
  const changelogPath = `${discoveryFolder}/changelog.json`
  const diffHistoryPath = `${discoveryFolder}/diffHistory.md`
  const maintained =
    existsSync(changelogPath) ||
    existsSync(`${discoveryFolder}/ossification.json`)
  if (!maintained) return

  const markdown = existsSync(diffHistoryPath)
    ? readFileSync(diffHistoryPath, 'utf-8')
    : ''
  const existing = existsSync(changelogPath)
    ? (JSON.parse(readFileSync(changelogPath, 'utf-8')) as DiscoveryChangelog)
    : changelogFromDiffHistory(markdown)
  const byId = new Map(existing.entries.map((entry) => [entry.id, entry]))

  // Entry identity and order come from the markdown headers; the newest entry
  // is the one this run wrote, so its diff is recorded from the source.
  const idFor = createDiffHistoryEntryIdFactory()
  const headers = new DiffHistoryParser().parse(markdown)
  const entries: DiscoveryChangelogEntry[] = []
  for (const [index, header] of headers.entries()) {
    const id = idFor(header.date, header.current)
    const entry =
      index === 0 && newEntry !== undefined
        ? changelogEntryFromDiff(id, newEntry.timestamp, newEntry.diff)
        : byId.get(id)
    if (entry) entries.push(entry)
  }

  const serialized = serializeDiscoveryChangelog({ formatVersion: 1, entries })
  const current = existsSync(changelogPath)
    ? readFileSync(changelogPath, 'utf-8')
    : undefined
  if (current !== serialized) {
    writeFileSync(changelogPath, serialized)
    log(`Updated ${changelogPath}`)
  }
}
