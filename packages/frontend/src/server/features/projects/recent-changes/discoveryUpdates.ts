import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

const RECENT_UPDATES_WINDOW_SECONDS = 7 * 24 * 60 * 60

export function countRecentDiscoveryUpdates(
  updates: ProjectDiscoveryUpdate[],
  now: number = UnixTime.now(),
): number {
  return updates.filter(
    (update) =>
      update.timestamp !== null &&
      now - update.timestamp <= RECENT_UPDATES_WINDOW_SECONDS,
  ).length
}
