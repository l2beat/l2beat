export type ChartNotSyncedTimestamps = {
  x1: number
  x2: number
}

export function getLastValidTimestamp<
  T extends [timestamp: number, ...rest: (number | null)[]],
>(data: T[] | undefined): number | undefined {
  if (!data) {
    return undefined
  }
  const lastValidTimestamp = data.findLast(([_, ...rest]) =>
    rest.every((v) => v !== null),
  )?.[0]

  return lastValidTimestamp
}

export function getCostsLastValidTimestamp<
  T extends [timestamp: number, ...rest: (number | null)[]],
>(data: T[] | undefined): number | undefined {
  if (!data) {
    return undefined
  }
  const lastValidTimestamp = data.findLast(([_, ...rest]) =>
    rest.some((v) => v !== null),
  )?.[0]

  return lastValidTimestamp
}
