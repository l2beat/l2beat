import { getDefaultMetadata } from '~/utils/metadata'

import { MainPageCard } from '~/components/main-page-card'
import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
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
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <MainPageCard>
        <ScalingRiskTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
