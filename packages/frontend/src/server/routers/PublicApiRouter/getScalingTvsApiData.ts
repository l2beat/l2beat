import { getTvsChart } from '~/server/features/scaling/tvs/getTvsChartData'
import type { TvsProjectFilterType } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'

interface Params {
  range: TvsChartRange
  type: TvsProjectFilterType
  projectIds: string[]
  excludeAssociatedTokens: boolean
}

export async function getScalingTvsApiData({
  range,
  type,
  projectIds,
  excludeAssociatedTokens,
}: Params) {
  if (type === 'projects' && !projectIds) {
    return {
      success: false,
      errors: [{ message: 'projectIds is required for "projects" type' }],
    } as const
  }

  const data = await getTvsChart({
    range: { type: range },
    filter:
      type === 'projects'
        ? {
            type: 'projects',
            projectIds,
          }
        : { type: type ?? 'layer2' },
    excludeAssociatedTokens,
  })

  const pointsWithData = data.chart.filter(
    ([_, native, canonical, external]) =>
      native !== null && canonical !== null && external !== null,
  ) as [number, number, number, number, number][]
  const latestTvsData = pointsWithData.at(-1)

  if (!latestTvsData) {
    return {
      success: false,
      error: 'Missing data.',
    } as const
  }

  const usdValue = latestTvsData[1] + latestTvsData[2] + latestTvsData[3]
  const ethValue = usdValue / latestTvsData[4]

  return {
    success: true,
    data: {
      usdValue,
      ethValue,
      chart: {
        types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
        data: data.chart.map(
          ([timestamp, native, canonical, external, ethPrice]) => [
            timestamp,
            native,
            canonical,
            external,
            ethPrice,
          ],
        ),
        syncedUntil: data.syncedUntil,
      },
    },
  } as const
}
