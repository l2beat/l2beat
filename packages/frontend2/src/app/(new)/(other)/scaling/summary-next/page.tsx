import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'
import { StackedTvlChart } from './_components/stacked-tvl-chart'
import { ScalingAssociatedTokensContextProvider } from '../../_components/scaling-associated-tokens-context'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
  robots: {
    index: false,
  },
})

export default async function Page() {
  // This gets all the data for the table, but NOT the % change (which comes from the API)
  const projects = await getScalingSummaryEntries()

  await api.scaling.summary.chart.prefetch({
    excludeAssociatedTokens: false,
    range: getCookie('scalingSummaryChartRange'),
    type: 'layer2',
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <StackedTvlChart
            milestones={HOMEPAGE_MILESTONES}
            entries={projects}
          />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTables projects={projects} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
