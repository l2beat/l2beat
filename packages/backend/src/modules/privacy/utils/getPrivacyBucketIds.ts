import { unique } from '@l2beat/shared-pure'

/**
 * The buckets behind a set of flow configurations, in a stable order. Both
 * the hourly tick and a saved batch key the privacy sync metadata by them. A
 * batch holds every configuration of its indexer that was behind, and a
 * bucket's configurations all live in one indexer, so its buckets are synced
 * exactly to the batch end.
 */
export function getPrivacyBucketIds(
  configurations: { bucketId: string }[],
): string[] {
  return unique(configurations.map((c) => c.bucketId)).sort()
}
