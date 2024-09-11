import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { getTvlChartData } from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'

export async function GET() {
  const entries = await getScalingSummaryEntries()
  const chart = await getTvlChartData({
    range: '30d',
    filter: { type: 'layer2' },
  })
  return NextResponse.json({
    success: true,
    data: {
      chart,
      projects: entries.reduce<Record<string, unknown>>((acc, entry) => {
        acc[entry.id] = {
          ...entry,
          // Remap change to change7d, remove TVL warnings
          tvl: {
            ...entry.tvl,
            change: undefined,
            warnings: undefined,
            change7d: entry.tvl.change,
          },
          // For stage - only return the stage name
          stage: entry.stage.stage,
          // Strip out the following fields
          entryType: undefined,
          href: undefined,
          isVerified: undefined,
          hasImplementationChanged: undefined,
          warning: undefined,
          showProjectUnderReview: undefined,
        }
        return acc
      }, {}),
    },
  })
}
