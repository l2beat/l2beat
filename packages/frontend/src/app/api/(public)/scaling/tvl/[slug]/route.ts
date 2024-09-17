import { layer2s, layer3s } from '@l2beat/config'
import { type NextRequest, NextResponse } from 'next/server'
import { getTvlChartData } from '~/server/features/scaling/tvl/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

const projects = [...layer2s, ...layer3s]

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const searchParams = request.nextUrl.searchParams
  const range = TvlChartRange.catch('30d').parse(searchParams.get('range'))

  const project = projects.find((p) => p.display.slug === params.slug)

  if (!project) {
    return NextResponse.json({
      success: false,
      error: 'Project not found.',
    })
  }

  const data = await getTvlChartData({
    range,
    excludeAssociatedTokens: false,
    filter: { type: 'projects', projectIds: [project.id] },
  })

  const oldestTvlData = data.chart.at(0)
  const latestTvlData = data.chart.at(-1)

  if (!oldestTvlData || !latestTvlData) {
    return NextResponse.json({
      success: false,
      error: 'Missing data.',
    })
  }

  const centsValue = latestTvlData[1] + latestTvlData[2] + latestTvlData[3]
  const ethValue = centsValue / latestTvlData[4]

  return NextResponse.json({
    success: true,
    data: {
      usdValue: centsValue / 100,
      ethValue,
      chart: {
        types: ['timestamp', 'canonical', 'external', 'native', 'ethPrice'],
        data: data.chart.map(
          ([timestamp, canonical, external, native, ethPrice]) => [
            timestamp,
            canonical / 100,
            external / 100,
            native / 100,
            ethPrice / 100,
          ],
        ),
      },
    },
  })
}
