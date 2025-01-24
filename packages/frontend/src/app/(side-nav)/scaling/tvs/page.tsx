import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingTvlTabs } from './_components/scaling-tvl-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvs',
  },
})

export default async function Page() {
  const entries = await getScalingTvlEntries()

  await api.tvl.chart.prefetch({
    filter: {
      type: 'rollups',
    },
    range: '1y',
    excludeAssociatedTokens: false,
    previewRecategorisation: false,
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <MainPageHeader>Value Secured</MainPageHeader>
          <ScalingTvlTabs {...entries} milestones={HOMEPAGE_MILESTONES} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
