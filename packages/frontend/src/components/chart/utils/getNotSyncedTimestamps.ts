type ChartPoint = readonly [timestamp: number, ...rest: (number | null)[]]

export type ChartNotSyncedTimestamps = {
  x1: number
  x2: number
}

export function getNotSyncedTimestamps<T extends ChartPoint>(
  data: T[] | undefined,
): ChartNotSyncedTimestamps | undefined {
  if (!data) {
    return undefined
  }
  const lastValidTimestamp = data.findLast(([_, ...rest]) =>
    rest.every((v) => v !== null),
  )?.[0]
  const lastTimestamp = data.at(-1)?.[0]
  if (lastValidTimestamp === undefined || lastTimestamp === undefined) {
    return undefined
  }

  return {
    x1: lastValidTimestamp,
    x2: lastTimestamp,
  }
}
