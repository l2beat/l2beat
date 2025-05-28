import { getDefaultMetadata } from '~/utils/metadata'

import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { RiskPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const entries = await getScalingRiskEntries()

  return <RiskPage entries={entries} />
}
