import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { getTvlChartData } from '~/server/features/scaling/tvl/get-tvl-chart-data'

export async function GET() {
  const entries = await getScalingSummaryEntries()
  const data = await getTvlChartData({
    range: '30d',
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })
  return NextResponse.json({
    success: true,
    data: {
      chart: {
        types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
        data: data.map(([timestamp, native, canonical, external, ethPrice]) => [
          timestamp,
          native / 100,
          canonical / 100,
          external / 100,
          ethPrice / 100,
        ]),
      },
      projects: Object.fromEntries(
        entries.map((entry) => {
          return [
            entry.id,
            {
              id: entry.id,
              name: entry.name,
              shortName: entry.shortName,
              slug: entry.slug,
              type: entry.type,
              category: entry.category,
              provider: entry.provider,
              purposes: entry.purposes,
              isArchived: entry.isArchived,
              hostChain: entry.hostChain,
              isUpcoming: entry.isUpcoming,
              isUnderReview: entry.isUnderReview,
              badges: entry.badges.map(({ badge, kind }) => ({
                category: kind,
                name: badge,
              })),
              tvl: {
                breakdown: entry.tvl.breakdown,
                associatedTokens: entry.tvl.associatedTokens,
                change7d: entry.tvl.change,
              },
              stage: entry.stage.stage,
              risks: entry.risks,
            },
          ]
        }),
      ),
    },
  })
}
