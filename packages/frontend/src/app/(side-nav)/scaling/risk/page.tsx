import { getDefaultMetadata } from '~/utils/metadata'

import { MainPageHeader } from '~/components/main-page-header'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingRiskTables } from './_components/scaling-risk-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const entries = await getScalingRiskEntries()

  return (
    <>
      <MainPageHeader>Risk Analysis</MainPageHeader>
      <ScalingFilterContextProvider>
        <ScalingRiskTables {...entries} />
      </ScalingFilterContextProvider>
    </>
  )
}
