import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { CostsChart } from '~/app/_components/chart/costs-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { CostsMetricContextProvider } from './_components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { CostsUnitContextProvider } from './_components/costs-unit-context'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const entries = await getScalingCostsEntries()
  const range = getCookie('costsChartRange')
  await api.scaling.costs.chart.prefetch({ range })
  await api.scaling.costs.table.prefetch({ range })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <CostsTimeRangeContextProvider>
          <CostsUnitContextProvider>
            <CostsMetricContextProvider>
              <CostsChart milestones={HOMEPAGE_MILESTONES} />
              <HorizontalSeparator className="my-4 md:my-6" />
              <ScalingCostsTable entries={entries} />
            </CostsMetricContextProvider>
          </CostsUnitContextProvider>
        </CostsTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
