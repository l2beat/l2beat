import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

/**
 * When a project's data last changed, from its public discovery updates.
 * Discovery re-runs that found nothing new leave no update, because the page
 * didn't change. Unknown when the project has none, so the caller can fall
 * back to a site-wide date.
 */
export function getProjectLastModified(
  project: Pick<Project<never, 'discoveryUpdates'>, 'discoveryUpdates'>,
): UnixTime | undefined {
  return newestTimestamp(
    (project.discoveryUpdates ?? []).map((update) => update.timestamp),
  )
}

/** UnixTime(0) counts as unknown: some configs use it as a placeholder. */
export function newestTimestamp(
  timestamps: (number | null | undefined)[],
): UnixTime | undefined {
  const known = timestamps.filter(
    (timestamp): timestamp is number => !!timestamp && timestamp > 0,
  )
  return known.length > 0 ? UnixTime(Math.max(...known)) : undefined
}
