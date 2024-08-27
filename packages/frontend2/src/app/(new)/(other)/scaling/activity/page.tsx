import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingActivityEntries } from '~/server/features/scaling/get-scaling-activity-entries'
import { api, HydrateClient } from '~/trpc/server'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTable } from './_components/table/scaling-activity-table'
import { getCookie } from '~/utils/cookies/server'
import { ActivityChart } from '~/app/_components/chart/activity/activity-chart'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'

export default async function Page() {
  const range = getCookie('activityTimeRange')
  const entries = await getScalingActivityEntries()

  await api.scaling.activity.chart.prefetch({
    range,
    filter: { type: 'all' },
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <ActivityChart />
          <HorizontalSeparator className="my-4 md:mt-6" />
          <ScalingFilters items={entries} />
          <ScalingActivityTable entries={entries} />
        </ActivityTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
