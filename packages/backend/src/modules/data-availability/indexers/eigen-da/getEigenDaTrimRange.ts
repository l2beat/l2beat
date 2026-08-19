import { UnixTime } from '@l2beat/shared-pure'

/**
 * Maps a range of indexer heights to trim to the inclusive range of
 * `DataAvailability` record timestamps to delete.
 *
 * EigenDA heights are unix timestamps and every record is an hourly bucket:
 * the record at T holds the hour [T, T + 1h). A trim edge that is not a full
 * hour has a bucket straddling it, which goes one way or the other - the same
 * way as in the block DA indexer, so both leave the shared table in the same
 * shape:
 *
 * - raised sinceTimestamp (range `[oldSince, newSince - 1]`): the bucket
 *   holding the new sinceTimestamp is kept. Nothing revisits it, so deleting
 *   it would leave a hole; keeping it overcounts at most an hour.
 * - lowered untilTimestamp (range `[newUntil + 1, currentHeight]`): the bucket
 *   holding the new untilTimestamp is deleted, so nothing past the end of the
 *   range stays. If the range is extended again the indexer resumes at
 *   `newUntil + 1`, inside that hour, and re-fetches the whole bucket.
 *
 * Both fall out of one rule: delete the buckets starting in
 * [startOfHour(from), startOfHour(to + 1)) - from the bucket holding the first
 * trimmed height up to, but excluding, the bucket holding the first height
 * that stays.
 */
export function getEigenDaTrimRange(
  range: [number, number],
): [UnixTime, UnixTime] {
  const [from, to] = range
  return [
    UnixTime.toStartOf(from, 'hour'),
    UnixTime.toStartOf(to + 1, 'hour') - 1,
  ]
}
