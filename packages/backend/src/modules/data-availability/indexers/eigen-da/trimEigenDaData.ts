import type { Logger } from '@l2beat/backend-tools'
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
 * - head trim (minHeight raised, `[oldMinHeight, newMinHeight - 1]`): the bucket
 *   containing the new minHeight is kept. After a trim `currentHeight` stays
 *   where it was, so no update would ever fill that hour again and deleting it
 *   would leave a permanent hole in the middle of the retained data. The bucket
 *   also holds the value of the whole hour (the API is always queried for a
 *   full hour), so it is not a partial value.
 * - tail trim (maxHeight lowered, `[newMaxHeight + 1, currentHeight]`): needs no
 *   adjustment. Records are hour aligned and the range starts at maxHeight + 1,
 *   which already keeps the bucket containing maxHeight.
 *
 * Keeping the boundary buckets cannot lead to double counting when the range is
 * extended again later: the indexer resumes at `currentHeight + 1`, re-fetches
 * the full hour and the records are upserted by overwriting `totalSize`
 * (`DataAvailabilityRepository.upsertMany`), never by accumulating it.
 *
 * We delete only what the framework asks for instead of everything outside the
 * configuration range on purpose: `EigenDaProjectsIndexer` writes the records of
 * the PREVIOUS day at every 02:00 height, so records legitimately exist below
 * minHeight and nothing would ever recreate them.
 */
export function getEigenDaTrimRange(
  range: [number, number],
  minHeight: number,
): [number, number] {
  const [from, to] = range
  // mergeConfigurations only asks to trim the head of the range (entirely below
  // the new minHeight) or its tail (entirely above the new maxHeight, which it
  // asserts is not lower than minHeight)
  const isHeadTrim = to < minHeight
  if (!isHeadTrim) {
    return [from, to]
  }
  return [from, UnixTime.toStartOf(minHeight, 'hour') - 1]
}

export async function trimEigenDaData<T>(
  $: { db: Database; configurations: Configuration<T>[] },
  logger: Logger,
  toTrim: TrimRemovalConfiguration[],
): Promise<void> {
  const configurations = new Map($.configurations.map((c) => [c.id, c]))

  let deletedRecords = 0
  for (const trim of toTrim) {
    // mergeConfigurations only trims configurations the indexer was
    // constructed with
    const configuration = configurations.get(trim.id)
    assert(configuration, `Configuration ${trim.id} not found`)

    const [from, to] = getEigenDaTrimRange(trim.range, configuration.minHeight)
    if (to < from) {
      continue
    }

    deletedRecords += await $.db.dataAvailability.deleteByConfigInTimeRange(
      trim.id,
      from,
      to,
    )
  }

  if (deletedRecords > 0) {
    logger.info('Trimmed DA records for configurations', {
      configurations: toTrim.length,
      deletedRecords,
    })
  }
}
