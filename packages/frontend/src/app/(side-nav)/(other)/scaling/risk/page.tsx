import { getDefaultMetadata } from '~/utils/metadata'

import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingRiskTable } from './_components/table/scaling-risk-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const entries = await getScalingRiskEntries()

  return (
    <ScalingFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
      </div>
      <ScalingRiskTable entries={entries} />
    </ScalingFilterContextProvider>
  )
}
