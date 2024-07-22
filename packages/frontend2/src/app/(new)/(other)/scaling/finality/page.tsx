import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { layer2s } from '@l2beat/config'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getFinality } from '~/server/features/scaling/finality/get-finality'
import { getFinalityConfigurations } from '~/server/features/scaling/finality/get-finality-configurations'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { FinalityDiagramsSection } from './_components/FinalityDiagramsSection'
import { FinalityWarning } from './_components/FinalityWarning'
import { ScalingFinalityTable } from './_components/table/scaling-finality-table'
import { finalityDiagrams } from './_utils/finality-diagrams'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const configurations = getFinalityConfigurations()

  const [finality, tvl] = await Promise.all([
    getFinality(configurations),
    getLatestTvlUsd({ type: 'layer2' }),
  ])

  const projects = await getScalingFinalityEntries(layer2s, tvl, finality)

  return (
    <>
      <SimplePageHeader>Finality</SimplePageHeader>
      <FinalityWarning />
      <ScalingFinalityTable projects={projects} />
      <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} />
    </>
  )
}
