import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingRiskEntries } from '~/server/features/scaling/get-scaling-risk-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingRiskTables } from './_components/scaling-risk-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'layer2' })
  const projects = await getScalingRiskEntries(tvl)

  return (
    <ScalingFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
      </div>
      <ScalingRiskTables projects={projects} />
    </ScalingFilterContextProvider>
  )
}
