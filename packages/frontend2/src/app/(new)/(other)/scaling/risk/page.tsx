import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { getTvl } from '~/server/features/scaling/get-tvl'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { ScalingRiskTables } from './_components/scaling-risk-tables'
import { getScalingRiskEntries } from '~/server/features/scaling/get-scaling-risk-entries'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const tvl = await getTvl()
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
