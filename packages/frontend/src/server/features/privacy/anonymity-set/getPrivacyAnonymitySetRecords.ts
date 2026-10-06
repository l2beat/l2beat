import type { Database } from '@l2beat/database'
import { type UnixTime, unique } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetRecords } from './calculateAnonymitySets'
import type {
  PrivacyAnonymitySetSeries,
  PrivacyAnonymitySetUnit,
} from './getPrivacyAnonymitySetSeries'

/**
 * Each table is asked only about the projects whose unit reads it. The
 * repositories skip the query for an empty project list.
 */
export async function getPrivacyAnonymitySetRecords(
  db: Database,
  series: PrivacyAnonymitySetSeries[],
  fromInclusive: UnixTime,
  toExclusive: UnixTime,
): Promise<PrivacyAnonymitySetRecords> {
  const depositorProjectIds = getProjectIdsWithUnit(series, 'depositor')
  const noteProjectIds = getProjectIdsWithUnit(series, 'note')

  const [senderDays, notes, noteStatusChanges] = await Promise.all([
    db.privacyAnonymitySetEvent.getSenderDaysByProjectIds(
      depositorProjectIds,
      fromInclusive,
      toExclusive,
    ),
    db.privacyNote.getByProjectIds(noteProjectIds, fromInclusive, toExclusive),
    db.privacyNoteStatusChange.getByProjectIds(
      noteProjectIds,
      fromInclusive,
      toExclusive,
    ),
  ])

  return { senderDays, notes, noteStatusChanges }
}

function getProjectIdsWithUnit(
  series: PrivacyAnonymitySetSeries[],
  unit: PrivacyAnonymitySetUnit,
): string[] {
  return unique(
    series.filter((item) => item.unit === unit).map((item) => item.projectId),
  )
}
