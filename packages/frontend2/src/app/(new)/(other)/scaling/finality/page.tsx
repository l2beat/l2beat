import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { layer2s } from '@l2beat/config'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getImplementationChangeReport } from '~/server/features/implementation-change-report/get-implementation-change-report'
import { getFinality } from '~/server/features/scaling/finality/get-finality'
import { getFinalityConfigurations } from '~/server/features/scaling/finality/get-finality-configurations'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { FinalityDiagramsSection } from './_components/diagram-section'
import { ScalingFinalityTable } from './_components/table/scaling-finality-table'
import { FinalityWarning } from './_components/warning'
import { finalityDiagrams } from './_utils/finality-diagrams'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const configurations = getFinalityConfigurations()

  const [finality, tvlForOrdering, icReport] = await Promise.all([
    getFinality(configurations),
    getLatestTvlUsd({ type: 'layer2' }),
    getImplementationChangeReport(),
  ])

  const projects = await getScalingFinalityEntries(
    layer2s,
    tvlForOrdering,
    finality,
    icReport,
  )

  return (
    <ScalingFilterContextProvider>
      <SimplePageHeader>Finality</SimplePageHeader>
      <FinalityWarning />
      <ScalingFinalityTable projects={projects} />
      <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} />
    </ScalingFilterContextProvider>
  )
}
