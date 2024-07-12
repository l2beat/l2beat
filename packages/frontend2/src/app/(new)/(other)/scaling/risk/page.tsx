import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingRiskEntries } from '~/server/features/scaling/get-scaling-risk-entries'
import { ScalingRiskTables } from './_components/scaling-risk-tables'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'layer2' })
  const projects = await getScalingRiskEntries(tvl)

  return (
    <>
      <div className="mb-8">
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
      </div>
      <ScalingRiskTables projects={projects} />
    </>
  )
}
