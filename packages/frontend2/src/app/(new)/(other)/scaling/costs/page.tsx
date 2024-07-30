import { getScalingCostsEntries } from '~/server/features/scaling/get-scaling-costs-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'layer2' })
  const entries = await getScalingCostsEntries(tvl)

  return (
    <div>
      <SimplePageHeader>Onchain Costs</SimplePageHeader>
      <ScalingCostsTable entries={entries} />
    </div>
  )
}
