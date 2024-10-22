import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingCostsChart } from '~/components/chart/costs/scaling-costs-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { CostsMetricContextProvider } from './_components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { CostsUnitContextProvider } from './_components/costs-unit-context'
import { ScalingCostsTables } from './_components/scaling-costs-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const entries = await getScalingCostsEntries()
  const range = getCookie('scalingCostsChartRange')
  await api.costs.chart.prefetch({ range, filter: { type: 'all' } })
  await api.costs.table.prefetch({ range })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <CostsTimeRangeContextProvider>
          <CostsUnitContextProvider>
            <CostsMetricContextProvider>
              <MainPageHeader>Onchain costs</MainPageHeader>
              <MainPageCard>
                <ScalingCostsChart
                  entries={
                    entries.type === 'recategorised'
                      ? entries.entries.rollups
                      : entries.entries
                  }
                  milestones={HOMEPAGE_MILESTONES}
                />
              </MainPageCard>
              <ScalingCostsTables {...entries} />
            </CostsMetricContextProvider>
          </CostsUnitContextProvider>
        </CostsTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
