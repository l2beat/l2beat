import { getScalingCostsEntries } from '~/server/features/scaling/get-scaling-costs-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'
import { CostsChart } from '~/app/_components/chart/costs-chart'
import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'

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
      <CostsChart milestones={HOMEPAGE_MILESTONES} />
      <HorizontalSeparator className="my-4 md:my-6" />
      <ScalingCostsTable entries={entries} />
    </div>
  )
}
