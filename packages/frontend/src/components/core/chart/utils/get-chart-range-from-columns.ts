export function getChartRange<T extends { timestamp: number }>(
  data: T[] | undefined,
): [number, number] | undefined {
  if (!data) {
    return
  }

  const start = data.at(0)?.timestamp
  const end = data.at(-1)?.timestamp

  if (!start || !end) {
    return
  }

  return [start, end]
}
