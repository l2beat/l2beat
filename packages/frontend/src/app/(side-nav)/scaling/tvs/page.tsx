import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingTvsTabs } from './_components/scaling-tvs-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvs',
  },
})

export default async function Page() {
  const entries = await getScalingTvsEntries()

  await api.tvs.chart.prefetch({
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
          <ScalingTvsTabs {...entries} milestones={HOMEPAGE_MILESTONES} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
