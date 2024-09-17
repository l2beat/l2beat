export function getChartRange<T extends readonly [number, ...unknown[]]>(
  data: T[] | undefined,
): [number, number] | undefined {
  if (!data) {
    return
  }
  const start = data.at(0)?.[0]
  const end = data.at(-1)?.[0]

  if (!start || !end) {
    return
  }

  return [start, end]
}
