import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { getTvlChart } from '~/server/features/scaling/tvl/get-tvl-chart-data'

export async function GET() {
  const data = await getCachedData()
  return NextResponse.json({
    success: true,
    data,
  })
}

const getCachedData = cache(
  async () => {
    const entries = await getScalingSummaryEntries()
    const items = [
      ...entries.rollups,
      ...entries.validiumsAndOptimiums,
      ...(entries.others ?? []),
    ]

    const data = await getTvlChart({
      range: '30d',
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
    })
    return {
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
        items.map((entry) => {
          return [
            entry.id,
            {
              id: entry.id,
              name: entry.name,
              shortName: entry.shortName,
              slug: entry.slug,
              // TODO: type, purposes, isArchived, isUpcoming, badges, hostChain, stage
              category: entry.category,
              provider: entry.provider,
              isUnderReview: !!entry.statuses?.underReview,
              tvl: {
                breakdown: entry.tvl.breakdown,
                associatedTokens: entry.tvl.associatedTokens,
                change7d: entry.tvl.change,
              },
              risks: entry.risks,
            },
          ]
        }),
      ),
    }
  },
  ['scaling-summary-route'],
  {
    tags: ['activity'],
  },
)
