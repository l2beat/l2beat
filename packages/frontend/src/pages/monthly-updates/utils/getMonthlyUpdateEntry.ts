import { UnixTime } from '@l2beat/shared-pure'
import type { CollectionEntry } from '~/content/getCollection'
import type { UpcomingProjectUpdate } from '~/content/monthly-updates'
import { formatPublicationDate } from '~/utils/dates'
import {
  type DaMonthlyUpdateEntry,
  getDaMonthlyUpdateEntries,
} from './getDaEntries'
import {
  type EcosystemMonthlyUpdateEntry,
  getEcosystemMonthlyUpdateEntries,
} from './getEcosystemEntries'

export interface MonthlyUpdateEntry {
  id: string
  title: string
  publishedOn: string
  from: UnixTime
  to: UnixTime
  ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
  daUpdatesEntries: DaMonthlyUpdateEntry[]
  upcomingProjectsUpdatesEntries: UpcomingProjectUpdate[]
}

export async function getMonthlyUpdateEntry(
  entry: CollectionEntry<'monthly-updates'>,
): Promise<MonthlyUpdateEntry> {
  const from = UnixTime.fromDate(entry.data.startDate)
  const to = UnixTime.fromDate(entry.data.endDate)

  const ecosystemsUpdatesEntries = await getEcosystemMonthlyUpdateEntries(
    entry.data.updates.filter((update) => update.type === 'ecosystem'),
    from,
    to,
  )
  const daUpdatesEntries = await getDaMonthlyUpdateEntries(
    entry.data.updates.filter((update) => update.type === 'data-availability'),
  )
  const upcomingProjectsUpdatesEntries = entry.data.updates.filter(
    (update) => update.type === 'upcoming-project',
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
