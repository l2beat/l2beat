import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type {
  Configuration,
  TrimRemovalConfiguration,
} from '../../../../tools/uif/multi/types'

/**
 * Returns the range of record timestamps to delete for a trim of `range`.
 *
 * The EigenDA indexers are timestamp based - their UIF heights ARE unix
 * timestamps - and every record is an hourly bucket that holds the data of the
 * whole hour it starts. A bucket can therefore straddle the edge of the trimmed
 * range, so we only delete buckets that lie ENTIRELY outside the retained range:
 *
 * - head trim (minHeight raised): the bucket containing the new minHeight is
 *   kept. After a trim `currentHeight` stays where it was, so no update would
 *   ever fill that hour again and deleting it would leave a permanent hole in
 *   the middle of the retained data. The bucket also holds the value of the
 *   whole hour (the API is always queried for a full hour), so it is not a
 *   partial value.
 * - tail trim (maxHeight lowered): needs no adjustment. Records are hour
 *   aligned and the trim starts at `maxHeight + 1`, which already keeps the
 *   bucket containing maxHeight.
 *
 * Keeping the boundary buckets cannot lead to double counting when the range is
 * extended again later: the indexer resumes at `currentHeight + 1`, re-fetches
 * the full hour and the records are upserted by overwriting `totalSize`
 * (`DataAvailabilityRepository.upsertMany`), never by accumulating it.
 */
export function getEigenDaTrimRange(
  range: [number, number],
  minHeight: number,
): [number, number] {
  const [from, to] = range
  const boundaryBucket = UnixTime.toStartOf(minHeight, 'hour')
  // Only a trim of the head of the range can contain the boundary bucket,
  // for a tail trim `boundaryBucket <= minHeight <= maxHeight < from`.
  return boundaryBucket >= from
    ? [from, Math.min(to, boundaryBucket - 1)]
    : [from, to]
}

export async function trimEigenDaData<T>(
  db: Database,
  indexerConfigurations: Configuration<T>[],
  toTrim: TrimRemovalConfiguration[],
): Promise<number> {
  let deletedRecords = 0

  for (const configuration of toTrim) {
    const indexerConfiguration = indexerConfigurations.find(
      (c) => c.id === configuration.id,
    )
    assert(
      indexerConfiguration,
      `Configuration ${configuration.id} not found among indexer configurations`,
    )

    const [from, to] = getEigenDaTrimRange(
      configuration.range,
      indexerConfiguration.minHeight,
    )
    if (to < from) {
      continue
    }

    deletedRecords +=
      await db.dataAvailability.deleteByConfigurationIdInTimeRange(
        configuration.id,
        from,
        to,
      )
  }

  return deletedRecords
}
