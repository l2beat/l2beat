import type { HomeSparklineDataPoint } from '../components/charts/HomeSparkline'

/** Relative change between the first and last non-null points, i.e. over the
 * whole chart range. */
export function computeSparklineChange(
  data: HomeSparklineDataPoint[] | undefined,
): number | undefined {
  if (!data) return undefined
  const withData = data.filter((d) => d.value !== null)
  const first = withData.at(0)?.value
  const last = withData.at(-1)?.value
  if (first === null || first === undefined || first === 0) return undefined
  if (last === null || last === undefined) return undefined
  return last / first - 1
}
