import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { CostsHeader } from './_components/costs-header'
import { CostsMetricContextProvider } from './_components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { CostsUnitContextProvider } from './_components/costs-unit-context'
import { ScalingCostsTabs } from './_components/scaling-costs-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingCostsEntries(),
    api.costs.chart.prefetch({
      range: '30d',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    api.costs.table.prefetch({ range: '30d' }),
  ])

  return (
    <HydrateClient>
      <TableFilterContextProvider>
        <CostsTimeRangeContextProvider>
          <CostsUnitContextProvider>
            <CostsMetricContextProvider>
              <CostsHeader />
              <ScalingCostsTabs {...entries} milestones={HOMEPAGE_MILESTONES} />
            </CostsMetricContextProvider>
          </CostsUnitContextProvider>
        </CostsTimeRangeContextProvider>
      </TableFilterContextProvider>
    </HydrateClient>
  )
}
