import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingStackedTvlChart } from '~/components/chart/tvl/stacked/scaling-stacked-tvl-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { featureFlags } from '~/consts/feature-flags'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingTvlTabs } from './_components/scaling-tvl-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvl',
  },
})

export default async function Page() {
  const entries = await getScalingTvlEntries()

  if (featureFlags.showOthers) {
    await api.tvl.chart.prefetch({
      filter: {
        type: 'projects',
        projectIds: entries.rollups.map((project) => project.id),
      },
      range: '1y',
      excludeAssociatedTokens: false,
    })
  }

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <MainPageHeader>Value Locked</MainPageHeader>
          {featureFlags.showOthers && (
            <HorizontalSeparator className="max-lg:hidden" />
          )}
          {!featureFlags.showOthers && (
            <MainPageCard>
              <ScalingStackedTvlChart
                milestones={HOMEPAGE_MILESTONES}
                entries={[
                  ...entries.rollups,
                  ...entries.validiumsAndOptimiums,
                  ...entries.others,
                ]}
              />
            </MainPageCard>
          )}
          <ScalingTvlTabs {...entries} milestones={HOMEPAGE_MILESTONES} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
