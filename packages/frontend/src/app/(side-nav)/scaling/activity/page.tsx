import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ActivityChart } from '~/components/chart/activity/activity-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { getScalingActivityEntries } from '~/server/features/scaling/get-scaling-activity-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTable } from './_components/table/scaling-activity-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/activity',
  },
})

export default async function Page() {
  const range = getCookie('activityTimeRange')
  const [entries, _, __] = await Promise.all([
    getScalingActivityEntries(),
    api.activity.chart.prefetch({
      range,
      filter: { type: 'all' },
    }),
    api.activity.scalingFactor.prefetch({
      filter: { type: 'all' },
    }),
  ])

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <ActivityChart milestones={HOMEPAGE_MILESTONES} entries={entries} />
          <HorizontalSeparator className="my-4 md:mt-6" />
          <ScalingActivityTable entries={entries} />
        </ActivityTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
