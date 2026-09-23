import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

/**
 * When a project's own data last changed: the newest recorded discovery
 * update, else when it was added. Discovery re-runs that found nothing new
 * don't count, because the page didn't change.
 */
export function getProjectLastModified(
  project: Pick<
    Project<never, 'discoveryUpdates'>,
    'addedAt' | 'discoveryUpdates'
  >,
): UnixTime | undefined {
  const timestamps = [
    project.addedAt,
    ...(project.discoveryUpdates ?? []).map((update) => update.timestamp),
  ].filter(isKnownTimestamp)

  return timestamps.length > 0 ? UnixTime(Math.max(...timestamps)) : undefined
}

/** Some configs use UnixTime(0) as an "unknown" placeholder for addedAt. */
function isKnownTimestamp(timestamp: number | null): timestamp is number {
  return timestamp !== null && timestamp > 0
}
