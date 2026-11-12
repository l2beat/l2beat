import { UnixTime } from '@l2beat/shared-pure'
import { type RawBuilder, sql } from 'kysely'

/**
 * Keeps the rows a chart of this `resolution` draws: the ones at its steps,
 * and every row after the last step, so the chart can end on the latest
 * hour. It skips the rows in between: a daily chart would otherwise read 90
 * days of six-hourly and 7 days of hourly rows too.
 */
export function atResolutionSteps(
  timestampColumn: string,
  to: UnixTime,
  resolution: 'hour' | 'six hours' | 'day',
): RawBuilder<boolean> {
  const column = sql.ref(timestampColumn)
  const step = UnixTime.periodToSeconds(resolution)
  const lastStep = UnixTime.toDate(UnixTime.toStartOf(to, resolution))
  return sql<boolean>`(extract(epoch from ${column})::bigint % ${step} = 0 or ${column} > ${lastStep})`
}
