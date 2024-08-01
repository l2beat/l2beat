import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { CostsChart } from '~/app/_components/chart/costs-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingCostsEntries } from '~/server/features/scaling/get-scaling-costs-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'layer2' })
  const defaultTimeRange = '30d'
  const entries = await getScalingCostsEntries(tvl, defaultTimeRange)
  await api.scaling.costs.prefetch({ range: defaultTimeRange })

  return (
    <div>
      <CostsChart
        milestones={HOMEPAGE_MILESTONES}
        defaultTimeRange={defaultTimeRange}
      />
      <HorizontalSeparator className="my-4 md:my-6" />
      <ScalingCostsTable entries={entries} />
    </div>
  )
}
