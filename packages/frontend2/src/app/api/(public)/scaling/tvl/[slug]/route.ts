import { layer2s, layer3s } from '@l2beat/config'
import { NextResponse } from 'next/server'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getTvlChartData } from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'

const projects = [...layer2s, ...layer3s]

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const project = projects.find((p) => p.display.slug === params.slug)

  if (!project) {
    return NextResponse.json({
      success: false,
      error: 'Project not found.',
    })
  }

  const chart = await getTvlChartData({
    range: '30d',
    filter: { type: 'projects', projectIds: [project.id] },
  })

  const oldestTvlData = chart.at(0)
  const latestTvlData = chart.at(-1)

  if (!oldestTvlData || !latestTvlData) {
    return NextResponse.json({
      success: false,
      error: 'Missing data.',
    })
  }

  const { breakdown } = await getTvlBreakdownForProject(project)

  const usdValue = latestTvlData[1] + latestTvlData[2] + latestTvlData[3]
  const ethPrice = latestTvlData[4]

  return NextResponse.json({
    success: true,
    data: {
      usdValue,
      ethPrice,
      chart: chart.map(([timestamp, canonical, external, native, ethPrice]) => [
        timestamp,
        canonical + external + native,
        ethPrice,
      ]),
      breakdown,
    },
  })
}
