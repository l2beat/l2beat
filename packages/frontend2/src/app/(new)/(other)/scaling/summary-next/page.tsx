import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { About } from '~/app/_components/about'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OtherSites } from '~/app/_components/other-sites'
import { getScalingSummaryEntries } from '~/server/features/scaling/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'

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
      <div className="mb-20">
        <ScalingFilterContextProvider>
          <TvlChart milestones={HOMEPAGE_MILESTONES} entries={projects} />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTables projects={projects} />
        </ScalingFilterContextProvider>
        <OtherSites />
        <About />
      </div>
    </HydrateClient>
  )
}
