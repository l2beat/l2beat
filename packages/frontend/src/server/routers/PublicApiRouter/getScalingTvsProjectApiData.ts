import { getTvsChart } from '~/server/features/scaling/tvs/getTvsChartData'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ps } from '~/server/projects'

interface Params {
  slug: string
  range: TvsChartRange
  excludeAssociatedTokens: boolean
}

export async function getScalingTvsProjectApiData({
  slug,
  range,
  excludeAssociatedTokens,
}: Params) {
  const project = await ps.getProject({
    slug,
    where: ['tvsConfig', 'isScaling'],
  })

  if (!project) {
    return {
      success: false,
      error: 'Project not found.',
    } as const
  }

  const data = await getTvsChart({
    range: { type: range },
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens,
  })

  const pointsWithData = data.chart.filter(
    ([_, native, canonical, external]) =>
      native !== null && canonical !== null && external !== null,
  ) as [number, number, number, number, number][]
  const oldestTvsData = pointsWithData.at(0)
  const latestTvsData = pointsWithData.at(-1)

  if (!oldestTvsData || !latestTvsData) {
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
      },
    },
  } as const
}
