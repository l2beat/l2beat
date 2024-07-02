export function getLineDashSegments(range: [number, number]) {
  const [start, end] = range
  const time = end - start
  const isMoreThanYear = time > 365 * 24 * 60 * 60
  // TODO: Come up with nice dash segments
  if (isMoreThanYear) {
    return [3, 2]
  }

  return [10, 5]
}
