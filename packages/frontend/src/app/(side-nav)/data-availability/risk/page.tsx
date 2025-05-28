import { getDaRiskEntries } from 'rewrite/src/server/features/data-availability/risks/get-da-risk-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { DataAvailabilityRiskPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/risk',
  },
})

export default async function Page() {
  const { publicSystems, customSystems } = await getDaRiskEntries()

  return (
    <DataAvailabilityRiskPage
      publicSystems={publicSystems}
      customSystems={customSystems}
    />
  )
}
