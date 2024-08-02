import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { CostsChart } from '~/app/_components/chart/costs-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { ScalingCostsTable } from './_components/table/scaling-costs-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const range = getCookie('costsChartRange')
  await api.scaling.costs.chart.prefetch({ range })
  await api.scaling.costs.entries.prefetch({ range })

  return (
    <div>
      <CostsTimeRangeContextProvider>
        <CostsChart milestones={HOMEPAGE_MILESTONES} />
        <HorizontalSeparator className="my-4 md:my-6" />
        <ScalingCostsTable />
      </CostsTimeRangeContextProvider>
    </div>
  )
}
