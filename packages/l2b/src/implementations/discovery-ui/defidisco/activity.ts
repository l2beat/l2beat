import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { ActivityFileEvent } from './activityClassifier'

/**
 * Bump this whenever the on-disk shape of activity events changes.
 *
 * History:
 * - `1.0`: per-field events (one event per changed field per row)
 * - `1.1`: grouped events (one event per (contract, type[, role]) per row,
 *   with a `changes[]` array of FieldChange)
 *
 * Files at an older version are dropped on read and re-reconciled from the
 * `UpdateNotifier` table on the next monitor cycle.
 */
export const ACTIVITY_FILE_VERSION = '1.1'

export interface ActivityFile {
  version: typeof ACTIVITY_FILE_VERSION
  /** Unix seconds — informational, updated each reconciliation pass. */
  lastReconciledAt: number
  /**
   * Monotonic `UpdateNotifier.id` cursor. `0` means "never reconciled" —
   * the next run performs a full backfill from the start of history.
   */
  lastConsumedUpdateNotifierId: number
  events: ActivityFileEvent[]
}

function emptyFile(): ActivityFile {
  return {
    version: ACTIVITY_FILE_VERSION,
    lastReconciledAt: 0,
    lastConsumedUpdateNotifierId: 0,
    events: [],
  }
}

export function getActivityFilePath(
  paths: DiscoveryPaths,
  project: string,
): string {
  return path.join(paths.discovery, project, 'activity.json')
}

export function readActivityFile(
  paths: DiscoveryPaths,
  project: string,
): ActivityFile {
  const filePath = getActivityFilePath(paths, project)
  if (!fs.existsSync(filePath)) {
    return emptyFile()
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    if (parsed.version !== ACTIVITY_FILE_VERSION) {
      // Schema migration: drop the file, force full re-reconciliation from
      // the UpdateNotifier table on the next monitor pass. The DB is the
      // source of truth — re-reading it is cheap and avoids carrying a
      // legacy-shape transformation step around forever.
      console.log(
        `[activity] ${project}: activity.json version ${String(parsed.version)} != ${ACTIVITY_FILE_VERSION}, resetting cursor for full backfill`,
      )
      return emptyFile()
    }
    return {
      version: ACTIVITY_FILE_VERSION,
      lastReconciledAt: Number(parsed.lastReconciledAt ?? 0),
      lastConsumedUpdateNotifierId: Number(
        parsed.lastConsumedUpdateNotifierId ?? 0,
      ),
      events: Array.isArray(parsed.events)
        ? (parsed.events as ActivityFileEvent[])
        : [],
    }
  } catch (error) {
    console.error(`Error parsing activity.json for ${project}:`, error)
    return emptyFile()
  }
}

export function writeActivityFile(
  paths: DiscoveryPaths,
  project: string,
  file: ActivityFile,
): void {
  const filePath = getActivityFilePath(paths, project)
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(file, null, 2))
}

/**
 * Returns all activity events for a project, or an empty array if the file
 * doesn't exist / is unreadable. Used by the review compiler to merge with
 * the upgrade event stream.
 */
export function getActivityEvents(
  paths: DiscoveryPaths,
  project: string,
): ActivityFileEvent[] {
  return readActivityFile(paths, project).events
}
