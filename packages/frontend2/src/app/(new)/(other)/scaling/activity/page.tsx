import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ActivityChart } from '~/app/_components/chart/activity/activity-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingActivityEntries } from '~/server/features/scaling/get-scaling-activity-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTable } from './_components/table/scaling-activity-table'

export default async function Page() {
  const range = getCookie('activityTimeRange')
  const entries = await getScalingActivityEntries()

  await api.activity.chart.prefetch({
    range,
    filter: { type: 'all' },
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <ActivityChart milestones={HOMEPAGE_MILESTONES} entries={entries} />
          <HorizontalSeparator className="my-4 md:mt-6" />
          <ScalingFilters items={entries} />
          <ScalingActivityTable entries={entries} />
        </ActivityTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
