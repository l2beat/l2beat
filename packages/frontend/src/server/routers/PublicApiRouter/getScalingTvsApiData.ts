import { getTvsChart } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import type { TvsProjectFilterType } from '~/server/features/scaling/tvs/utils/project-filter-utils'
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
    range,
    filter:
      type === 'projects'
        ? {
            type: 'projects',
            projectIds,
          }
        : { type: type ?? 'layer2' },
    excludeAssociatedTokens,
    previewRecategorisation: false,
  })

  const latestTvsData = data.at(-1)

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
