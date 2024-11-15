import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { getTvlChart } from '~/server/features/scaling/tvl/get-tvl-chart-data'

export async function GET() {
  return getCachedResponse()
}

const getCachedResponse = cache(
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
    return NextResponse.json({
      success: true,
      data: {
        chart: {
          types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
          data: data.map(
            ([timestamp, native, canonical, external, ethPrice]) => [
              timestamp,
              native / 100,
              canonical / 100,
              external / 100,
              ethPrice / 100,
            ],
          ),
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
                type: entry.type,
                category: entry.category,
                provider: entry.provider,
                purposes: entry.purposes,
                isArchived: entry.isArchived,
                hostChain: entry.hostChain,
                isUpcoming: entry.isUpcoming,
                isUnderReview: !!entry.underReviewStatus,
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
  },
  ['scaling-summary-route'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)
