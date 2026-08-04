import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { getShadeRamp } from '~/components/core/chart/utils/getShadeRamp'
import type { AnonymitySetCurveBucket } from '~/server/features/privacy/anonymitySetCurves'

/**
 * One hue per token family, one shade per bucket inside it. Families are
 * ordered by the data, so the busiest token gets the strongest hue.
 *
 * Shared by every anonymity set chart: they all plot the same buckets in the
 * same order, and a bucket that changed color between two charts of one section
 * would read as two different pools.
 */
export function useAnonymitySetChartMeta(
  buckets: AnonymitySetCurveBucket[],
): ChartMeta {
  return useMemo(() => {
    const families: string[] = []
    for (const bucket of buckets) {
      if (!families.includes(bucket.family)) families.push(bucket.family)
    }

    const ramps = families.map((family, index) =>
      getShadeRamp(
        index,
        buckets.filter((bucket) => bucket.family === family).length,
      ),
    )

    const shadeIndexes = new Map<string, number>()
    return Object.fromEntries(
      buckets.map((bucket) => {
        const familyIndex = families.indexOf(bucket.family)
        const shade = shadeIndexes.get(bucket.family) ?? 0
        shadeIndexes.set(bucket.family, shade + 1)

        return [
          bucket.id,
          {
            label: bucket.label,
            color: ramps[familyIndex]?.[shade] ?? 'var(--chart-ethereum)',
            indicatorType: { shape: 'line' as const },
          },
        ]
      }),
    )
  }, [buckets])
}
