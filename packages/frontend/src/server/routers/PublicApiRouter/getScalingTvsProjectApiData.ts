import { getTvsChart } from '~/server/features/scaling/tvs/get-tvs-chart-data'
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
    range,
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens,
    previewRecategorisation: false,
  })

  const oldestTvsData = data.at(0)
  const latestTvsData = data.at(-1)

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
        data: data.map(([timestamp, native, canonical, external, ethPrice]) => [
          timestamp,
          native,
          canonical,
          external,
          ethPrice,
        ]),
      },
    },
  } as const
}
