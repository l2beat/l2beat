import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

export function getActiveEcosystemProjects<
  T extends Project<'ecosystemInfo', 'archivedAt'>,
>(projects: T[], timestamp?: UnixTime): T[] {
  return projects.filter((e) => {
    const since = e.ecosystemInfo.sinceTimestamp ?? e.addedAt
    const until = e.ecosystemInfo.untilTimestamp ?? e.archivedAt
    return (
      UnixTime.toStartOf(since, 'day') <= (timestamp ?? UnixTime.now()) &&
      (!until ||
        UnixTime.toStartOf(until, 'day') > (timestamp ?? UnixTime.now()))
    )
  })
}
