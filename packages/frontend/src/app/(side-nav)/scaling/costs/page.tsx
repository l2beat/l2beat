import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { env } from 'process'
import { ScalingCostsChart } from '~/components/chart/costs/scaling-costs-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import {
  type ScalingCostsEntry,
  getScalingCostsEntries,
} from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { CostsMetricContextProvider } from './_components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { CostsUnitContextProvider } from './_components/costs-unit-context'
import { ScalingCostsRollupsTable } from './_components/table/scaling-costs-rollups-table'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'

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
                  entries={entries}
                  milestones={HOMEPAGE_MILESTONES}
                />
              </MainPageCard>
              <MainPageCard className="md:mt-6">
                <Table entries={entries} />
              </MainPageCard>
            </CostsMetricContextProvider>
          </CostsUnitContextProvider>
        </CostsTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}

async function Table({ entries }: { entries: ScalingCostsEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_RECATEGORISATION) {
    return <ScalingCostsRollupsTable entries={entries} />
  }
  return <ScalingCostsTable entries={entries} />
}
