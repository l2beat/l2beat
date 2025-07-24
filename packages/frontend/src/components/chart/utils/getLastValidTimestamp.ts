type ChartPoint = readonly [timestamp: number, ...rest: (number | null)[]]

export type ChartNotSyncedTimestamps = {
  x1: number
  x2: number
}

export function getLastValidTimestamp<T extends ChartPoint>(
  data: T[] | undefined,
): number | undefined {
  if (!data) {
    return undefined
  }
  const lastValidTimestamp = data.findLast(([_, ...rest]) =>
    rest.every((v) => v !== null),
  )?.[0]
  if (lastValidTimestamp === undefined) {
    return undefined
  }

  return lastValidTimestamp
}
