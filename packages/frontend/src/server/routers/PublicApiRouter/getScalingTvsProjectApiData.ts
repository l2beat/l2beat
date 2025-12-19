import { getTvsChart } from '~/server/features/scaling/tvs/getTvsChartData'
import { ps } from '~/server/projects'
import type { ChartRange } from '~/utils/range/range'

interface Params {
  slug: string
  range: ChartRange
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
}

export async function getScalingTvsProjectApiData({
  slug,
  range,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
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
    range,
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens,
    excludeRwaRestrictedTokens,
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
