import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type { ActivityFileEvent } from './activityClassifier'

export interface ActivityFile {
  version: '1.0'
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
    version: '1.0',
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
    return {
      version: '1.0',
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
