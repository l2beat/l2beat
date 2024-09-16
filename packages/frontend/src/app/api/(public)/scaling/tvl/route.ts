import { type NextRequest, NextResponse } from 'next/server'
import { getTvlChartData } from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = TvlChartRange.catch('30d').parse(searchParams.get('range'))

  const data = await getTvlChartData({
    range,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
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
