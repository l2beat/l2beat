import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { getScalingTvlEntries } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { SummaryTvlChart } from './_components/scaling-tvl-chart'
import { ScalingTvlTable } from './_components/scaling-tvl-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
  robots: {
    index: false,
  },
})

export default async function Page() {
  const projects = await getScalingTvlEntries()

  // TODO: prefetch chart data

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <SummaryTvlChart milestones={HOMEPAGE_MILESTONES} entries={projects} />
        <HorizontalSeparator className="my-4 md:my-6" />
        <ScalingTvlTable projects={projects} />
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
