import { ActivityChart } from '~/app/_components/chart/activity-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingActivityEntries } from '~/server/features/scaling/get-scaling-activity-entries'
import { HydrateClient } from '~/trpc/server'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTable } from './_components/table/scaling-activity-table'
import { getCookie } from '~/utils/cookies/server'

export default async function Page() {
  const timeRange = getCookie('activityTimeRange')
  const entries = await getScalingActivityEntries()
  return (
    <HydrateClient>
      <ActivityTimeRangeContextProvider>
        <ActivityChart />
        <HorizontalSeparator className="my-4 md:mt-6" />
        <ScalingActivityTable entries={entries} />
      </ActivityTimeRangeContextProvider>
    </HydrateClient>
  )
}
