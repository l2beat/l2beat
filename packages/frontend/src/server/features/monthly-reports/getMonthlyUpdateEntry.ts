import { UnixTime } from '@l2beat/shared-pure'
import type { CollectionEntry } from '~/content/getCollection'
import { ps } from '~/server/projects'
import { formatPublicationDate } from '~/utils/dates'
import { getActivityLatestUops } from '../scaling/activity/getActivityLatestTps'
import { get7dTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import {
  type DaMonthlyUpdateEntry,
  getDaMonthlyUpdateEntries,
} from './getDaEntries'
import {
  type EcosystemMonthlyUpdateEntry,
  getEcosystemMonthlyUpdateEntries,
} from './getEcosystemEntries'
import {
  getUpcomingProjectUpdateEntries,
  type UpcomingProjectUpdateEntry,
} from './getUpcomingEntries'

export interface MonthlyUpdateEntry {
  id: string
  title: string
  publishedOn: string
  from: UnixTime
  to: UnixTime
  ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
  daUpdatesEntries: DaMonthlyUpdateEntry[]
  upcomingProjectsUpdatesEntries: UpcomingProjectUpdateEntry[]
}

export async function getMonthlyUpdateEntry(
  entry: CollectionEntry<'monthly-updates'>,
): Promise<MonthlyUpdateEntry> {
  const from = UnixTime.fromDate(entry.data.startDate)
  const to = UnixTime.fromDate(entry.data.endDate)

  const allScalingProjects = await ps.getProjects({
    select: ['isScaling'],
  })

  const [tvs, activity] = await Promise.all([
    get7dTvsBreakdown({ type: 'layer2' }, to),
    getActivityLatestUops(allScalingProjects, { type: 'custom', from, to }),
  ])

  const [ecosystemsUpdatesEntries, daUpdatesEntries] = await Promise.all([
    getEcosystemMonthlyUpdateEntries(
      entry.data.updates.filter((update) => update.type === 'ecosystem'),
      allScalingProjects,
      tvs,
      activity,
      from,
      to,
    ),
    getDaMonthlyUpdateEntries(
      entry.data.updates.filter(
        (update) => update.type === 'data-availability',
      ),
      tvs,
      activity,
      to,
    ),
  ])

  const upcomingProjectsUpdatesEntries = getUpcomingProjectUpdateEntries(
    entry.data.updates.filter((update) => update.type === 'upcoming-project'),
  )

  return {
    id: entry.id,
    title: entry.data.title,
    from,
    to,
    publishedOn: formatPublicationDate(entry.data.publishedOn),
    ecosystemsUpdatesEntries,
    daUpdatesEntries,
    upcomingProjectsUpdatesEntries,
  }
}
