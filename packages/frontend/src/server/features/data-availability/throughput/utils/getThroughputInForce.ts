import type { DaLayerThroughput } from '@l2beat/config'

/** A limit change is added to the config ahead of its fork, so the newest entry may not be live yet */
export function getThroughputInForce(
  throughput: DaLayerThroughput[],
  at: number,
): DaLayerThroughput | undefined {
  return throughput
    .filter((t) => t.sinceTimestamp <= at)
    .toSorted((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)
}
